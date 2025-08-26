// pages/api/stripe-webhook.js
export const config = { api: { bodyParser: false } };

async function raw(req){
  const chunks=[]; for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks);
}
function mapPriceToPlan(priceId){
  if (!priceId) return 'starter';
  if (process.env.NEXT_PUBLIC_PRICE_PRO === priceId) return 'pro';
  if (process.env.NEXT_PUBLIC_PRICE_BUSINESS === priceId) return 'business';
  return 'starter';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const stripe = (await import('stripe')).default(process.env.STRIPE_SECRET_KEY);
  const body = await raw(req);
  const whsec = process.env.STRIPE_WEBHOOK_SECRET;

  let event;
  try {
    if (whsec) {
      const sig = req.headers['stripe-signature'];
      event = stripe.webhooks.constructEvent(body, sig, whsec);
    } else {
      event = JSON.parse(body.toString('utf8'));
      console.warn('⚠ Webhook sem verificação de assinatura.');
    }
  } catch (err) {
    console.error('webhook_verify_fail', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    const { getAdminRTDB } = await import('../../lib/firebaseAdmin');
    const db = getAdminRTDB();

    const type = event.type;
    const obj  = event.data?.object || {};
    const now  = Date.now();

    // grava debug último evento
    await db.ref(`__debug/webhook_last`).set({ type, at: now, object: obj });

    async function resolveUid(o){
      if (o.client_reference_id) return o.client_reference_id;
      if (o.metadata?.uid) return o.metadata.uid;
      const customer = o.customer || o.data?.object?.customer || o.customer_id;
      if (customer) {
        const snap = await db.ref(`customers/${customer}`).get();
        if (snap.exists()) return snap.val();
      }
      return null;
    }

    if (type === 'checkout.session.completed') {
      const uid = await resolveUid(obj);
      if (uid) {
        if (obj.customer) await db.ref(`customers/${obj.customer}`).set(uid);
        let planKey = 'starter';
        try{
          const lines = obj?.lines?.data || [];
          const priceId = lines[0]?.price?.id;
          planKey = mapPriceToPlan(priceId) || (obj.metadata?.plan) || 'starter';
        }catch{}
        await db.ref(`subscriptions/${uid}`).set({ active: true, plan: planKey, updatedAt: now });
      }
    }

    if (type === 'customer.subscription.created' || type === 'customer.subscription.updated') {
      const uid = await resolveUid(obj);
      if (uid) {
        const priceId = obj.items?.data?.[0]?.price?.id || obj.plan?.id;
        const planKey = obj.metadata?.plan || mapPriceToPlan(priceId);
        await db.ref(`subscriptions/${uid}`).update({ active: true, plan: planKey, updatedAt: now });
      }
    }

    if (type === 'customer.subscription.deleted' || type === 'invoice.payment_failed') {
      const uid = await resolveUid(obj);
      if (uid) {
        await db.ref(`subscriptions/${uid}`).update({ active: false, updatedAt: now });
      }
    }

    return res.status(200).json({ received: true });
  } catch (e) {
    console.error('webhook_handler_error', e);
    return res.status(500).json({ error: 'server_error' });
  }
}

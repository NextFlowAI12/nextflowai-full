// pages/api/stripe-webhook.js
export const config = { api: { bodyParser: false } };

async function readRawBody(req){
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  const stripe = (await import('stripe')).default(process.env.STRIPE_SECRET_KEY);
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    if (whSecret) {
      const raw = await readRawBody(req);
      const sig = req.headers['stripe-signature'];
      event = stripe.webhooks.constructEvent(raw, sig, whSecret);
    } else {
      // SEM verificação (apenas para testes). Usa com cuidado.
      const raw = await readRawBody(req);
      event = JSON.parse(raw.toString('utf8'));
      console.warn('⚠ Webhook sem verificação de assinatura. Define STRIPE_WEBHOOK_SECRET para ativar a verificação.');
    }
  } catch (err) {
    console.error('Webhook verification failed', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    const type = event.type;
    const obj = event.data?.object || {};

    const getUidFrom = (o) => o.client_reference_id || o.metadata?.uid || null;

    if (type === 'checkout.session.completed' || type === 'customer.subscription.created' || type === 'customer.subscription.updated') {
      const uid = getUidFrom(obj);
      let planKey = 'starter';
      try {
        const items = (obj.items?.data) || (obj.lines?.data) || [];
        const priceId = items[0]?.price?.id || obj?.plan?.id;
        if (priceId) {
          if (process.env.NEXT_PUBLIC_PRICE_PRO === priceId) planKey = 'pro';
          else if (process.env.NEXT_PUBLIC_PRICE_BUSINESS === priceId) planKey = 'business';
        }
      } catch {}

      if (uid) {
        const { getAdminRTDB } = await import('../../lib/firebaseAdmin');
        const rtdb = getAdminRTDB();
        await rtdb.ref(`subscriptions/${uid}`).set({ active: true, plan: planKey, updatedAt: Date.now() });
        await rtdb.ref(`widgets/${uid}/chatbot`).update({ name:'Loja', hours:'', address:'', whatsapp:'', faqs:[{},{},{}] });
      }
    }

    if (type === 'customer.subscription.deleted' || type === 'invoice.payment_failed') {
      const uid = obj.metadata?.uid || null;
      if (uid) {
        const { getAdminRTDB } = await import('../../lib/firebaseAdmin');
        const rtdb = getAdminRTDB();
        await rtdb.ref(`subscriptions/${uid}`).update({ active: false, updatedAt: Date.now() });
      }
    }

    return res.status(200).json({ received: true });
  } catch (e) {
    console.error('webhook_handler_error', e);
    return res.status(500).json({ error: 'server_error' });
  }
}

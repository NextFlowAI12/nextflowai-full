// pages/api/stripe-webhook.js
export const config = { api: { bodyParser: false } };

async function rawBody(req){
  const chunks=[]; for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks);
}
function mapPriceToPlan(priceId){
  const m = {
    starter: process.env.PRICE_STARTER || process.env.NEXT_PUBLIC_PRICE_STARTER,
    pro:     process.env.PRICE_PRO     || process.env.NEXT_PUBLIC_PRICE_PRO,
    business:process.env.PRICE_BUSINESS|| process.env.NEXT_PUBLIC_PRICE_BUSINESS,
  };
  if (!priceId) return 'starter';
  if (priceId === m.pro) return 'pro';
  if (priceId === m.business) return 'business';
  return 'starter';
}

async function upsertSub(db, uid, active, plan, extra = {}){
  const payload = { active, plan, updatedAt: Date.now(), ...extra };
  await db.ref(`subscriptions/${uid}`).update(payload);
  return payload;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');

  const stripe = (await import('stripe')).default(process.env.STRIPE_SECRET_KEY);
  const body = await rawBody(req);
  const whsec = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    if (whsec) {
      const sig = req.headers['stripe-signature'];
      event = stripe.webhooks.constructEvent(body, sig, whsec);
    } else {
      // Sem verificação (apenas para teste)
      event = JSON.parse(body.toString('utf8'));
      console.warn('⚠ Webhook sem verificação de assinatura.');
    }
  } catch (err) {
    console.error('stripe_signature_verify_fail', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    const { getAdminRTDB } = await import('../../lib/firebaseAdmin');
    const db = getAdminRTDB();

    const type = event.type;
    const obj  = event.data?.object || {};

    // Guardar último evento para debug
    await db.ref(`__debug/webhook_last`).set({ type, at: Date.now() });

    // Helper para obter uid
    async function getUidFromAny(o){
      if (o.client_reference_id) return o.client_reference_id;
      if (o.metadata?.uid) return o.metadata.uid;
      const customer = o.customer || o.customer_id || o.data?.object?.customer;
      if (customer) {
        const snap = await db.ref(`customers/${customer}`).get();
        if (snap.exists()) return snap.val();
      }
      return null;
    }

    if (type === 'checkout.session.completed') {
      // Obter uid
      const uid = await getUidFromAny(obj);
      if (!uid) {
        console.warn('checkout.completed sem uid');
        return res.status(200).json({ ok: true, note: 'no_uid' });
      }

      // Guardar o mapping customer -> uid (para eventos futuros)
      if (obj.customer) await db.ref(`customers/${obj.customer}`).set(uid);

      // Obter o priceId do subscription (forma mais estável)
      let priceId, periodEnd;
      try {
        if (obj.subscription) {
          const sub = await stripe.subscriptions.retrieve(obj.subscription, { expand: ['items.data.price'] });
          priceId = sub?.items?.data?.[0]?.price?.id;
          periodEnd = sub?.current_period_end ? sub.current_period_end * 1000 : undefined;
        } else if (obj?.lines?.data?.length) {
          priceId = obj.lines.data[0]?.price?.id;
        }
      } catch(e) {
        console.warn('fetch_subscription_failed', e?.message);
      }

      const plan = obj.metadata?.plan || mapPriceToPlan(priceId);
      await upsertSub(db, uid, true, plan, { current_period_end: periodEnd || null });

      return res.status(200).json({ ok: true });
    }

    if (type === 'customer.subscription.created' || type === 'customer.subscription.updated') {
      const uid = await getUidFromAny(obj);
      if (!uid) return res.status(200).json({ ok: true, note: 'no_uid' });

      const priceId = obj.items?.data?.[0]?.price?.id || obj.plan?.id;
      const plan = obj.metadata?.plan || mapPriceToPlan(priceId);
      const periodEnd = obj.current_period_end ? obj.current_period_end * 1000 : null;

      await upsertSub(db, uid, obj.status === 'active' || obj.status === 'trialing', plan, { current_period_end: periodEnd });
      return res.status(200).json({ ok: true });
    }

    if (type === 'customer.subscription.deleted' || type === 'invoice.payment_failed') {
      const uid = await getUidFromAny(obj);
      if (!uid) return res.status(200).json({ ok: true, note: 'no_uid' });
      await upsertSub(db, uid, false, 'starter');
      return res.status(200).json({ ok: true });
    }

    // Ignora outros eventos
    return res.status(200).json({ ok: true, ignored: type });
  } catch (e) {
    console.error('webhook_handler_error', e);
    return res.status(500).json({ error: 'server_error' });
  }
}

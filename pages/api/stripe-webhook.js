// pages/api/stripe-webhook.js
export const config = { api: { bodyParser: false } };

async function rawBody(req){
  const chunks=[]; for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks);
}
function hasEnv(k){ return !!process.env[k]; }
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
  const diag = {
    env: {
      STRIPE_SECRET_KEY: hasEnv('STRIPE_SECRET_KEY'),
      STRIPE_WEBHOOK_SECRET: hasEnv('STRIPE_WEBHOOK_SECRET'),
      PRICE_STARTER: !!(process.env.PRICE_STARTER || process.env.NEXT_PUBLIC_PRICE_STARTER),
      PRICE_PRO: !!(process.env.PRICE_PRO || process.env.NEXT_PUBLIC_PRICE_PRO),
      PRICE_BUSINESS: !!(process.env.PRICE_BUSINESS || process.env.NEXT_PUBLIC_PRICE_BUSINESS),
      FIREBASE_SERVICE_ACCOUNT_JSON: hasEnv('FIREBASE_SERVICE_ACCOUNT_JSON'),
      FIREBASE_DATABASE_URL: hasEnv('FIREBASE_DATABASE_URL'),
    }
  };

  try {
    const { getAdminRTDB } = await import('../../lib/firebaseAdmin');
    const db = getAdminRTDB();
    await db.ref(`__debug/webhook_diag`).set({ ...diag, at: Date.now() });
  } catch(e) {
    // ignore, we'll continue
  }

  try {
    const stripe = (await import('stripe')).default(process.env.STRIPE_SECRET_KEY);
    const body = await rawBody(req);
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    let event;

    if (!process.env.STRIPE_SECRET_KEY) throw new Error('missing_STRIPE_SECRET_KEY');
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) throw new Error('missing_FIREBASE_SERVICE_ACCOUNT_JSON');

    if (secret) {
      const sig = req.headers['stripe-signature'];
      event = stripe.webhooks.constructEvent(body, sig, secret);
    } else {
      // Permite teste mesmo sem secret (não recomendado em produção)
      event = JSON.parse(body.toString('utf8'));
      console.warn('⚠ Webhook sem verificação de assinatura.');
    }

    const { getAdminRTDB } = await import('../../lib/firebaseAdmin');
    const db = getAdminRTDB();

    const type = event.type;
    const obj  = event.data?.object || {};

    await db.ref(`__debug/webhook_last`).set({ type, at: Date.now() });

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
      const uid = await getUidFromAny(obj);
      if (!uid) {
        await db.ref(`__debug/webhook_error`).set({ at: Date.now(), code:'no_uid_checkout_completed' });
        return res.status(200).json({ ok: true, note: 'no_uid' });
      }

      if (obj.customer) await db.ref(`customers/${obj.customer}`).set(uid);

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
        await db.ref(`__debug/webhook_error`).set({ at: Date.now(), code:'fetch_subscription_failed', msg: e?.message || String(e) });
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

    return res.status(200).json({ ok: true, ignored: type });
  } catch (e) {
    try {
      const { getAdminRTDB } = await import('../../lib/firebaseAdmin');
      const db = getAdminRTDB();
      await db.ref(`__debug/webhook_error`).set({ at: Date.now(), error: e?.message || String(e) });
    } catch(_){}
    return res.status(500).json({ error: 'server_error' });
  }
}

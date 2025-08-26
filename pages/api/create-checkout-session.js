// pages/api/create-checkout-session.js
function getPriceIdFromPlan(plan){
  // Aceita privadas (PRICE_*) ou públicas (NEXT_PUBLIC_PRICE_*)
  const map = {
    starter: process.env.PRICE_STARTER || process.env.NEXT_PUBLIC_PRICE_STARTER,
    pro:     process.env.PRICE_PRO     || process.env.NEXT_PUBLIC_PRICE_PRO,
    business:process.env.PRICE_BUSINESS|| process.env.NEXT_PUBLIC_PRICE_BUSINESS,
  };
  return map[plan];
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  try {
    const { plan, uid } = req.body || {};
    if (!plan || !uid) return res.status(400).json({ error: 'missing_fields' });

    const priceId = getPriceIdFromPlan(plan);
    if (!priceId) return res.status(400).json({ error: 'missing_price_id_for_plan', plan });

    const stripe = (await import('stripe')).default(process.env.STRIPE_SECRET_KEY);
    const origin = req.headers.origin || process.env.NEXT_PUBLIC_SITE_URL || 'https://nextflowai.netlify.app';

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      client_reference_id: uid,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/dashboard?success=1`,
      cancel_url: `${origin}/dashboard?canceled=1`,
      customer_creation: 'if_required',
      allow_promotion_codes: true,
      subscription_data: {
        metadata: { uid, plan }
      }
    });

    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error('create_checkout_error', e);
    return res.status(500).json({ error: 'server_error' });
  }
}

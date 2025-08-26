// pages/api/create-checkout-session.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
  try {
    const { priceId, uid, plan } = req.body || {};
    if (!priceId || !uid) return res.status(400).json({ error: 'missing_fields' });

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
        metadata: { uid, plan: plan || '' }
      }
    });

    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error('create_checkout_error', e);
    return res.status(500).json({ error: 'server_error' });
  }
}

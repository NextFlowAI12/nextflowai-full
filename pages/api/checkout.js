
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_MAP = {
  STARTER: process.env.STRIPE_PRICE_STARTER,
  PRO: process.env.STRIPE_PRICE_PRO,
  BUSINESS: process.env.STRIPE_PRICE_BUSINESS,
};

export default async function handler(req,res){
  if(req.method !== 'POST'){
    res.setHeader('Allow','POST');
    return res.status(405).end('Method Not Allowed');
  }
  try{
    const { email, uid, plan = 'STARTER' } = req.body || {};
    const price = PRICE_MAP[plan] || PRICE_MAP.STARTER;
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price, quantity: 1 }],
      customer_email: email,
      client_reference_id: uid,
      success_url: `${req.headers.origin}/dashboard?success=true`,
      cancel_url: `${req.headers.origin}/dashboard?canceled=true`,
    });
    return res.status(200).json({ url: session.url });
  }catch(err){
    console.error(err);
    return res.status(500).json({ error: err.message || 'stripe_error' });
  }
}

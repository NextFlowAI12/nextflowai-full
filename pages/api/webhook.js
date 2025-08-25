import { buffer } from 'micro';
import Stripe from 'stripe';
import { getAdminRTDB } from '../../lib/firebaseAdmin';

export const config = { api: { bodyParser: false } };
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req,res){
  if(req.method !== 'POST'){
    res.setHeader('Allow','POST');
    return res.status(405).end('Method Not Allowed');
  }
  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);
  let event;
  try{
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  }catch(err){
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if(event.type === 'checkout.session.completed'){
    const session = event.data.object;
    const email = session.customer_email || (session.customer_details && session.customer_details.email);
    if(email){
      const key = email.replace(/\./g, ','); // usar o mesmo encoding do dashboard
      const rtdb = getAdminRTDB();
      await rtdb.ref(`subscriptions/${key}`).update({
        active: true,
        plan: 'STARTER',
        updatedAt: new Date().toISOString(),
        stripeCustomer: session.customer,
        sessionId: session.id
      });
    }
  }

  return res.json({ received: true });
}

// pages/api/debug-status.js
export default function handler(req, res){
  res.status(200).json({
    ok: true,
    env_present: {
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET,
      PRICE_STARTER: !!(process.env.PRICE_STARTER || process.env.NEXT_PUBLIC_PRICE_STARTER),
      PRICE_PRO: !!(process.env.PRICE_PRO || process.env.NEXT_PUBLIC_PRICE_PRO),
      PRICE_BUSINESS: !!(process.env.PRICE_BUSINESS || process.env.NEXT_PUBLIC_PRICE_BUSINESS),
      FIREBASE_SERVICE_ACCOUNT_JSON: !!process.env.FIREBASE_SERVICE_ACCOUNT_JSON,
      FIREBASE_DATABASE_URL: !!process.env.FIREBASE_DATABASE_URL,
      ADMIN_DEBUG_TOKEN: !!process.env.ADMIN_DEBUG_TOKEN,
    }
  });
}

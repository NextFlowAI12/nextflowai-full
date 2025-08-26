// pages/api/get-price-ids.js
export default async function handler(req, res){
  return res.status(200).json({
    starter: process.env.NEXT_PUBLIC_PRICE_STARTER || process.env.PRICE_STARTER || null,
    pro: process.env.NEXT_PUBLIC_PRICE_PRO || process.env.PRICE_PRO || null,
    business: process.env.NEXT_PUBLIC_PRICE_BUSINESS || process.env.PRICE_BUSINESS || null,
  });
}


NextFlow AI — Next.js + Firebase + Stripe + Netlify

Deploy:
- Netlify: Build `npm run build` / Publish `.next` (já no netlify.toml).
- Env vars no Netlify → copiar de .env.example.
- Webhook Stripe: https://TEU-SITE.netlify.app/api/webhook (evento checkout.session.completed).

Fluxo:
- /signup e /login (Firebase Auth).
- /dashboard lê Firestore (subscriptions/{email}.active).
- /api/checkout cria Stripe Checkout (subscription) com o email do utilizador.
- /api/webhook (Stripe) marca a subscrição como ativa em Firestore.

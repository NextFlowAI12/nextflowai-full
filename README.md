# NextFlow AI — Setup

Este projeto já inclui:
- Landing page com secção de **Contactos**
- Página **/onboarding** com verificação de subscrição ativa
- Integração com Firebase (auth + Realtime Database)
- Integração com Stripe (checkout + webhooks no backend)

---

## 🚀 Como usar

### 1. Variáveis de ambiente (Netlify → Site settings → Environment Variables)
Frontend (NEXT_PUBLIC_*):
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
- NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
- NEXT_PUBLIC_FIREBASE_DATABASE_URL → URL do teu Realtime DB
- NEXT_PUBLIC_ONBOARDING_FORM_URL → (opcional) link do questionário, ex.: https://tally.so/r/SEU_ID

Backend (server-side):
- STRIPE_SECRET_KEY
- STRIPE_WEBHOOK_SECRET
- PRICE_STARTER
- PRICE_PRO
- PRICE_BUSINESS
- FIREBASE_SERVICE_ACCOUNT_JSON (tudo numa linha JSON)

---

### 2. Fluxo de funcionamento
1. Utilizador faz login via Firebase Auth
2. Stripe → checkout → sucesso
3. Webhook (`/api/stripe-webhook`) grava no Realtime DB a subscrição como ativa
4. Página `/onboarding` verifica:
   - `subscriptionsByUid/{uid}/active`
   - `subscriptions/{emailKey}/active`
   - `subscriptions/{uid}/active`
   Se algum estiver ativo → mostra botão para abrir o questionário

---

### 3. Estrutura
- `pages/index.js` → Landing page (funcionalidades, planos, contactos)
- `pages/onboarding.js` → Questionário só se plano ativo
- `lib/firebaseClient.js` → Inicialização do Firebase frontend
- `styles/onboarding.css` → Estilos onboarding

---

### 4. Deploy
1. Commit & push alterações para GitHub
2. Netlify → Deploys → **Trigger deploy → Clear cache and deploy site**
3. Testar:
   - `/` mostra contactos e link para onboarding
   - `/onboarding` → login obrigatório + subscrição ativa para abrir formulário

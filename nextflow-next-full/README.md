
# NextFlow AI — Deploy no Netlify (tim‑tim por tim‑tim)

## 1) Firebase
1. Aceda a https://console.firebase.google.com → **Criar projeto** (ex.: nextflow-ai).
2. **Authentication** → *Método de início de sessão* → ative **Email/Password**.
3. **Firestore Database** → criar base de dados (modo produção).
4. **Definições do Projeto → SDK setup & config (Web App)** → copie:
   - apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId.
5. **Accounts → Service accounts** → **Generate new private key** → descarrega `.json`.
   - Abra o `.json` e mantenha para o passo das variáveis.

## 2) Stripe
1. Aceda a https://dashboard.stripe.com → crie conta.
2. **Products** → criar 3 produtos com preços recorrentes (Starter/Pro/Business).
   - Em cada preço, copie o **Price ID** (ex.: price_123...).
3. **Developers → API keys** → copie a **Secret key** (sk_test_... ou sk_live_...).
4. **Developers → Webhooks → Add endpoint**:
   - URL: https://SEU-SITE.netlify.app/api/webhook
   - Evento: `checkout.session.completed`
   - Guarde o **Signing secret** (whsec_...).

## 3) Netlify
1. Aceda a https://app.netlify.com → **Add new site**.
2. Opção A: *Import from Git* (recomendado). Opção B: fazer upload manual após build local.
3. O projeto já tem `netlify.toml` com `@netlify/plugin-nextjs`.
4. Em **Site settings → Environment variables**, crie as seguintes variáveis (copiar/colar):
   - NEXT_PUBLIC_FIREBASE_API_KEY
   - NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   - NEXT_PUBLIC_FIREBASE_PROJECT_ID
   - NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   - NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   - NEXT_PUBLIC_FIREBASE_APP_ID
   - FIREBASE_SERVICE_ACCOUNT_JSON  ← cole o conteúdo do ficheiro .json **numa única linha**
   - STRIPE_SECRET_KEY
   - STRIPE_PRICE_STARTER
   - STRIPE_PRICE_PRO
   - STRIPE_PRICE_BUSINESS
   - STRIPE_WEBHOOK_SECRET
5. **Deploy**:
   - Build command: `npm run build`
   - Publish directory: `.next`

## 4) Testar
- Aceda a `/signup` → crie conta (email + password).
- Vá a `/dashboard` → deve dizer inativa.
- Clique “Pagar Plano Starter” → Stripe Checkout → finalize.
- Stripe chama `/api/webhook` → Firestore: `subscriptions/{email}.active = true`.
- Recarregue `/dashboard` → aparece **Subscrição ativa ✅**.

## Notas
- O **webhook** é obrigatório para ativar a conta após pagamento.
- Nunca exponha a `STRIPE_SECRET_KEY` no frontend (apenas nas variáveis de ambiente).
- Para `FIREBASE_SERVICE_ACCOUNT_JSON`, cole o JSON inteiro do service account numa só linha.

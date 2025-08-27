// pages/onboarding.js
import { useEffect, useState } from 'react';

export default function Onboarding(){
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [active, setActive] = useState(false);
  const [error, setError] = useState(null);
  const formUrl = process.env.NEXT_PUBLIC_ONBOARDING_FORM_URL || 'https://tally.so/r/w5Qx2r';

  useEffect(() => {
    let unsub = () => {};
    (async () => {
      try {
        const [{ getAuth, onAuthStateChanged }, { getDatabase, ref, get }] = await Promise.all([
          import('firebase/auth'),
          import('firebase/database')
        ]);
        const { app } = await import('../lib/firebaseClient');
        const auth = getAuth(app);

        unsub = onAuthStateChanged(auth, async (user) => {
          if (!user) {
            setAuthed(false);
            setLoading(false);
            // redireciona para login
            window.location.href = '/login?next=/onboarding';
            return;
          }
          setAuthed(true);

          try {
            const db = getDatabase(app);
            // caminhos possíveis onde a tua função de webhook pode ter gravado o estado
            const uid = user.uid;
            const emailKey = user.email ? user.email.replaceAll('.', ',') : null;

            // tenta por ordem: por UID, por emailKey, e um nó genérico "subscriptions/{uid}"
            const paths = [
              `subscriptionsByUid/${uid}/active`,
              emailKey ? `subscriptions/${emailKey}/active` : null,
              `subscriptions/${uid}/active`
            ].filter(Boolean);

            let isActive = false;
            for (const p of paths) {
              const snap = await get(ref(db, p));
              if (snap.exists()) {
                const val = snap.val();
                isActive = (val === true) || (val && val.status === 'active') || (val === 'active');
                if (!isActive && val && typeof val === 'object' && 'active' in val) {
                  isActive = !!val.active;
                }
                if (isActive) break;
              }
            }
            setActive(isActive);
            setLoading(false);
          } catch (e) {
            console.error(e);
            setError('Falha a ler o estado de subscrição.');
            setLoading(false);
          }
        });
      } catch (e) {
        console.error(e);
        setError('Falha a inicializar o cliente.');
        setLoading(false);
      }
    })();

    return () => { try { unsub(); } catch {} };
  }, []);

  if (loading) {
    return (
      <main className="wrap onboarding">
        <h1>Onboarding</h1>
        <p className="muted">A verificar sessão e subscrição…</p>
      </main>
    );
  }

  if (!authed) {
    return (
      <main className="wrap onboarding">
        <h1>Onboarding</h1>
        <div className="card">
          <p>Precisas de <a href="/login">iniciar sessão</a> para continuar.</p>
        </div>
      </main>
    );
  }

  if (!active) {
    return (
      <main className="wrap onboarding">
        <h1>Onboarding</h1>
        <div className="card warn">
          <p><b>Subscrição inativa.</b> Precisas de pagar antes de usar o serviço.</p>
          <div className="actions">
            <a className="btn" href="/#planos">Escolher plano</a>
            <a className="btn ghost" href="/dashboard">Voltar ao dashboard</a>
          </div>
          <p className="muted small">Se já pagaste há poucos minutos, aguarda 1–2 min e volta a entrar.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="wrap onboarding">
      <h1>Onboarding</h1>
      <p className="muted">Obrigado! Precisamos de alguns dados para preparar as tuas automações.</p>

      <div className="card">
        <h2>1) Preencher questionário do negócio</h2>
        <p>Leva 3–5 minutos. Com base nestas respostas montamos: chatbot, reservas, leads e integrações.</p>
        <a className="btn big" href={formUrl} target="_blank" rel="noreferrer">Abrir questionário</a>
        <p className="small muted">Se o botão não abrir, usa este link: <a href={formUrl} target="_blank" rel="noreferrer">{formUrl}</a></p>
      </div>

      <div className="grid2">
        <div className="card">
          <h3>Depois do questionário</h3>
          <ul>
            <li>Configuramos Calendly/Google Calendar</li>
            <li>Ligamos formulários a Google Sheets/Gmail</li>
            <li>Preparamos automações (Zapier/Make)</li>
            <li>Enviamos vídeo com validação</li>
          </ul>
        </div>
        <div className="card">
          <h3>Ajuda & Suporte</h3>
          <p>Dúvidas? Fala connosco:</p>
          <p>📞 <a href="tel:+351916053688">+351 916 053 688</a><br/>
             ✉️ <a href="mailto:nextflowai12@gmail.com">nextflowai12@gmail.com</a></p>
        </div>
      </div>
    </main>
  );
}

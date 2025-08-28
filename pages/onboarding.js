// pages/onboarding.js
import { useEffect, useState } from 'react';
import { app } from '../lib/firebaseClient';

export default function Onboarding(){
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [active, setActive] = useState(false);
  const [userInfo, setUserInfo] = useState({ uid: '', email: '' });

  // Link do Tally (env ou fallback para o teu link)
  const formBase = process.env.NEXT_PUBLIC_ONBOARDING_FORM_URL || 'https://tally.so/r/w8XQKr';

  useEffect(() => {
    let unsub = () => {};
    (async () => {
      try {
        const [{ getAuth, onAuthStateChanged }, { getDatabase, ref, get }] = await Promise.all([
          import('firebase/auth'),
          import('firebase/database')
        ]);
        const auth = getAuth(app);

        unsub = onAuthStateChanged(auth, async (user) => {
          if (!user) {
            setAuthed(false);
            setLoading(false);
            if (typeof window !== 'undefined') window.location.href = '/login?next=/onboarding';
            return;
          }
          setAuthed(true);
          setUserInfo({ uid: user.uid, email: user.email || '' });

          const db = getDatabase(app);
          const uid = user.uid;
          const emailKey = user.email ? user.email.replaceAll('.', ',') : null;
          const paths = [
            `subscriptionsByUid/${uid}/active`,
            emailKey ? `subscriptions/${emailKey}/active` : null,
            `subscriptions/${uid}/active`,
            emailKey ? `subscriptionsByEmail/${emailKey}/active` : null
          ].filter(Boolean);

          let isActive = false;
          for (const p of paths) {
            try {
              const snap = await get(ref(db, p));
              if (snap.exists()) {
                const val = snap.val();
                isActive = (val === true) || (val === 'active') || (val && (val.active === true || val.status === 'active'));
                if (isActive) break;
              }
            } catch(_) {}
          }
          setActive(isActive);
          setLoading(false);
        });
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    })();
    return () => { try {unsub();} catch {} };
  }, []);

  if (loading) return <main className="wrap"><p>A carregar…</p></main>;
  if (!authed) return <main className="wrap"><p>Redirecionando para login…</p></main>;
  if (!active) return (
    <main className="wrap onboarding">
      <h1>Onboarding</h1>
      <div className="card warn">
        <p><b>Subscrição inativa.</b> Precisas de pagar antes de usar o serviço.</p>
        <div className="actions">
          <a className="btn" href="/#planos">Escolher plano</a>
          <a className="btn ghost" href="/dashboard">Ir ao dashboard</a>
        </div>
      </div>
    </main>
  );

  // Construir URL do Tally com parâmetros
  const params = new URLSearchParams({
    uid: userInfo.uid || '',
    email: userInfo.email || '',
    plano: (typeof window!=='undefined' && window.localStorage.getItem('nf_plan')) || ''
  });
  const formUrl = formBase + (formBase.includes('?') ? '&' : '?') + params.toString();

  return (
    <main className="wrap onboarding">
      <h1>Onboarding</h1>
      <p className="muted">Obrigado! Clica no botão para abrir o questionário.</p>
      <div className="card">
        <button className="btn big" onClick={() => window.open(formUrl, '_blank', 'noopener,noreferrer')}>
          Abrir questionário
        </button>
        <p className="small muted" style={{marginTop: 8}}>
          Se não abrir, usa este link: <a href={formUrl} target="_blank" rel="noreferrer">{formUrl}</a>
        </p>
      </div>
    </main>
  );
}

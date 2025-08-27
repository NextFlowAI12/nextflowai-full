// pages/onboarding.js
import { useEffect, useState } from 'react';

export default function Onboarding(){
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);
  const [active, setActive] = useState(false);
  const formUrl = process.env.NEXT_PUBLIC_ONBOARDING_FORM_URL || 'https://tally.so/r/w5Qx2r';

  useEffect(() => {
    setLoading(false);
    setAuthed(true);
    setActive(true);
  }, []);

  if (loading) return <main className="wrap"><p>A carregar…</p></main>;
  if (!authed) return <main className="wrap"><p>Precisas de iniciar sessão</p></main>;
  if (!active) return <main className="wrap"><p>Subscrição inativa.</p></main>;

  return (
    <main className="wrap onboarding">
      <h1>Onboarding</h1>
      <p>Obrigado! Clica em baixo para preencher o questionário.</p>
      <div className="card">
        <a className="btn big" href={formUrl} target="_blank" rel="noreferrer">Abrir questionário</a>
      </div>
    </main>
  );
}


import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app, db } from '../lib/firebaseClient';
import { doc, getDoc } from 'firebase/firestore';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [subActive, setSubActive] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        // Documento de subscrição guardado por email (ver /api/webhook)
        const ref = doc(db, 'subscriptions', u.email);
        const snap = await getDoc(ref);
        setSubActive(snap.exists() && snap.data().active === true);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <p>A carregar…</p>;
  if (!user) return <p>Precisas de fazer login.</p>;

  async function startCheckout() {
    const res = await fetch('/api/checkout', { method: 'POST' });
    if (res.redirected) {
      window.location.href = res.url;
    } else {
      const data = await res.json().catch(()=>({}));
      alert(data.error || 'Erro a iniciar checkout');
    }
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      {subActive ? (
        <div>
          <p>Subscrição ativa ✅</p>
          <ul>
            <li>Chatbots de Atendimento</li>
            <li>Captação de Leads</li>
            <li>Marcações & Reservas</li>
            <li>Automação Operacional</li>
            <li>Integrações</li>
            <li>Formação & Suporte</li>
          </ul>
        </div>
      ) : (
        <div>
          <p>precisas de pagar antes de usar o serviço</p>
          <button onClick={startCheckout}>Pagar Plano Starter</button>
        </div>
      )}
    </div>
  );
}

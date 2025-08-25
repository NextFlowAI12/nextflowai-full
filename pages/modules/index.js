import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../lib/firebaseClient';

export default function Modules(){
  const [user,setUser] = useState(null);
  useEffect(()=>{
    const unsub = onAuthStateChanged(getAuth(app), setUser);
    return ()=>unsub();
  },[]);
  if(!user) return <div className="container"><p>Precisas de fazer login.</p></div>;
  return (
    <div className="container section">
      <div className="nav-inner" style={{marginBottom:16}}>
        <Link href="/" className="btn ghost">← Voltar</Link>
      </div>
      <h2 className="h2">Módulos</h2>
      <div className="grid grid-3">
        <div className="card">
          <div className="title">Chatbot de Atendimento</div>
          <p className="small">Configura FAQs, horários, morada e contacto. Gera um link/iframe para o teu site.</p>
          <Link className="btn" href="/modules/chatbot">Abrir</Link>
        </div>
        <div className="card">
          <div className="title">Captação de Leads</div>
          <p className="small">Gera um formulário partilhável. Leads ficam guardadas e podes exportar.</p>
          <Link className="btn" href="/modules/leads">Abrir</Link>
        </div>
        <div className="card">
          <div className="title">Marcações & Reservas</div>
          <p className="small">Mostra o teu Calendly/Google Calendar embed numa página pública.</p>
          <Link className="btn" href="/modules/bookings">Abrir</Link>
        </div>
      </div>
    </div>
  );
}

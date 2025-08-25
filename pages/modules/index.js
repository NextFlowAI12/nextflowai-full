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
        <a href="/" className="btn ghost">← Voltar</a>
      </div>
      <h2 className="h2">Módulos</h2>
      <div className="grid grid-3">
        <div className="card">
          <div className="title">Chatbot de Atendimento</div>
          <p className="small">Configura FAQs, horários, morada e contacto. Gera um link/iframe para o teu site.</p>
          <a className="btn" href="/modules/chatbot">Abrir</a>
        </div>
        <div className="card">
          <div className="title">Captação de Leads</div>
          <p className="small">Gera um formulário partilhável. Leads ficam guardadas e podes exportar.</p>
          <a className="btn" href="/modules/leads">Abrir</a>
        </div>
        <div className="card">
          <div className="title">Marcações & Reservas</div>
          <p className="small">Mostra o teu Calendly/Google Calendar embed numa página pública.</p>
          <a className="btn" href="/modules/bookings">Abrir</a>
        </div>
        <div className="card">
          <div className="title">Automação Operacional</div>
          <p className="small">Emails, lembretes de pagamento, rascunhos de fatura e atualização de sheets.</p>
          <a className="btn" href="/modules/automations">Abrir</a>
        </div>
        <div className="card">
          <div className="title">Integrações</div>
          <p className="small">WhatsApp, Gmail, Google Sheets, Meta, WordPress, Shopify e mais.</p>
          <a className="btn" href="/modules/integrations">Abrir</a>
        </div>
        <div className="card">
          <div className="title">Formação & Suporte</div>
          <p className="small">Documentação simples e suporte por email/WhatsApp.</p>
          <a className="btn" href="/modules/support">Abrir</a>
        </div>
      </div>
    </div>
  );
}

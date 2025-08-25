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
      <div className="toolbar">
        <a href="/" className="btn ghost">← Voltar</a>
        <div className="spacer" />
        <span className="badge ok">{user.email}</span>
      </div>
      <h2 className="h2">Módulos</h2>
      <p className="small" style={{marginTop:-6}}>Escolhe um módulo para configurar e publica-o com 1 clique.</p>
      <div className="grid grid-3" style={{marginTop:12}}>
        {[
          ['🤖','Chatbot de Atendimento','Configura FAQs, horários, morada e contacto. Gera link/iframe.','/modules/chatbot'],
          ['🎯','Captação de Leads','Formulário partilhável com inbox e export.','/modules/leads'],
          ['📆','Marcações & Reservas','Liga o teu Calendly/Google Calendar, com link/iframe.','/modules/bookings'],
          ['⚙️','Automação Operacional','Emails, lembretes, rascunhos de fatura, sheets.','/modules/automations'],
          ['🔌','Integrações','WhatsApp, Gmail, Sheets, Meta, WordPress, Shopify.','/modules/integrations'],
          ['📚','Formação & Suporte','Guias rápidos e contacto.','/modules/support'],
        ].map((c,i)=>(
          <a key={i} className="card" href={c[3]} style={{textDecoration:'none'}}>
            <div className="title"><span className="kicker">{c[0]} Requer plano ativo</span>{c[1]}</div>
            <p className="small" style={{color:'#cbd5e1'}}>{c[2]}</p>
            <div className="actions" style={{marginTop:8}}><span className="btn small">Abrir</span></div>
          </a>
        ))}
      </div>
    </div>
  );
}

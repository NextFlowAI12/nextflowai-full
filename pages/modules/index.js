import React from 'react';
export default function Modules(){
  const [user,setUser] = React.useState(null);

  React.useEffect(()=>{
    let unsub;
    (async ()=>{
      const { getAuth, onAuthStateChanged } = await import('firebase/auth');
      const { app } = await import('../../lib/firebaseClient');
      unsub = onAuthStateChanged(getAuth(app), setUser);
    })();
    return ()=>{ if(unsub) unsub(); };
  },[]);

  if(!user) return <div className="container"><p>Precisas de fazer login.</p></div>;
  return (
    <div className="container section">
      <div className="nav-inner" style={{marginBottom:16}}>
        <a href="/" className="btn ghost">← Voltar</a>
      </div>
      <h2 className="h2">Módulos</h2>
      <div className="grid grid-3">
        {[
          ['Chatbot de Atendimento','/modules/chatbot','Configura FAQs, horários, morada e contacto. Gera link/iframe.'],
          ['Captação de Leads','/modules/leads','Formulário partilhável com inbox e export.'],
          ['Marcações & Reservas','/modules/bookings','Liga o teu Calendly/Google Calendar.'],
          ['Automação Operacional','/modules/automations','Emails, lembretes, rascunhos de fatura, sheets.'],
          ['Integrações','/modules/integrations','WhatsApp, Gmail, Sheets, Meta, WordPress, Shopify.'],
          ['Formação & Suporte','/modules/support','Guias rápidos e contacto.'],
        ].map((c,i)=>(
          <div className="card" key={i}>
            <div className="title">{c[0]}</div>
            <p className="small">{c[2]}</p>
            <a className="btn" href={c[1]}>Abrir</a>
          </div>
        ))}
      </div>
    </div>
  );
}

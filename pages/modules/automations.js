import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../lib/firebaseClient';
import { getDatabase, ref, child, get } from 'firebase/database';

export default function Automations(){
  const [user,setUser] = useState(null);
  const [active,setActive] = useState(false);
  const [loading,setLoading] = useState(true);

  useEffect(()=>{
    const unsub = onAuthStateChanged(getAuth(app), async (u)=>{
      setUser(u);
      if(u){
        try{
          const key = u.email.replace(/\./g, ',');
          const db = getDatabase(app);
          const snap = await get(child(ref(db), `subscriptions/${key}`));
          setActive(snap.exists() && snap.val().active === true);
        }finally{ setLoading(false); }
      }else{
        setLoading(false);
      }
    });
    return ()=>unsub();
  },[]);

  if(loading) return <div className="container"><p>A carregar…</p></div>;
  if(!user) return <div className="container"><p>Precisas de fazer login.</p></div>;

  return (<div className="container section">
    <h2 className="h2">Automação Operacional</h2>
    {!active && <p className="small bad">precisas de pagar antes de usar o serviço</p>}
    <div className="grid grid-2" style={{opacity: active?1:.6, pointerEvents: active? 'auto':'none'}}>
      <div className="card">
        <div className="title">Lembrete de pagamento (email)</div>
        <ol>
          <li className="small">Cria um Zap/Scenario (Zapier/Make).</li>
          <li className="small">Trigger: Firebase RTDB → caminho <code>leads/{'{uid}'}</code> ou o teu ERP.</li>
          <li className="small">Action: Gmail/SMTP → enviar email com template.</li>
        </ol>
        <p className="small">Quer o passo-a-passo? Está no módulo <b>Formação & Suporte</b>.</p>
      </div>
      <div className="card">
        <div className="title">Rascunho de fatura</div>
        <p className="small">Sugestão: integra o teu ERP (Moloni/Talgts/PHC) via webhook para criar rascunhos ao fechar uma lead.</p>
        <p className="small">Trigger: Nova lead qualificada · Ação: Criar documento rascunho.</p>
      </div>
      <div className="card">
        <div className="title">Atualizar Google Sheets</div>
        <p className="small">Trigger: nova lead → Action: Append row em Sheets com nome/email/telefone/origem.</p>
      </div>
      <div className="card">
        <div className="title">Lembrete no WhatsApp</div>
        <p className="small">Usa provedor (ex. 360dialog/Gupshup) via Zapier/Make para mandar lembrete 24h antes da marcação.</p>
      </div>
    </div>
  </div>);
}

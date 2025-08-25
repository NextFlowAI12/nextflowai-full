import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../lib/firebaseClient';
import { getDatabase, ref, child, get } from 'firebase/database';

export default function Integrations(){
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
    <h2 className="h2">Integrações</h2>
    {!active && <p className="small bad">precisas de pagar antes de usar o serviço</p>}
    <div className="grid grid-3" style={{opacity: active?1:.6, pointerEvents: active? 'auto':'none'}}>
      {[
        ['WhatsApp','Via provedor oficial + Zapier/Make'],
        ['Gmail','Envio/receção com filtros e templates'],
        ['Google Sheets','Entrada/saída de dados simples'],
        ['Meta','Formulários de anúncios → leads'],
        ['WordPress','Embed dos widgets e formulários'],
        ['Shopify','Abandono de carrinho → lembretes']
      ].map((r,i)=>(
        <div className="card" key={i}>
          <div className="title">{r[0]}</div>
          <p className="small">{r[1]}</p>
          <p className="small">Implementação típica via Zapier/Make.</p>
        </div>
      ))}
    </div>
  </div>);
}

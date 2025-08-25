import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../lib/firebaseClient';
import { getDatabase, ref, child, get } from 'firebase/database';

export default function Support(){
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
    <h2 className="h2">Formação & Suporte</h2>
    {!active && <p className="small bad">precisas de pagar antes de usar o serviço</p>}
    <div className="grid grid-2" style={{opacity: active?1:.6, pointerEvents: active? 'auto':'none'}}>
      <div className="card">
        <div className="title">Documentação rápida</div>
        <ul>
          <li className="small">Como incorporar o chatbot (iframe/link)</li>
          <li className="small">Como ligar o Calendly</li>
          <li className="small">Como ativar Zapier/Make com a RTDB</li>
        </ul>
      </div>
      <div className="card">
        <div className="title">Fala connosco</div>
        <p className="small">WhatsApp: <a href="tel:+351916053688">+351 916 053 688</a></p>
        <p className="small">Email: <a href="mailto:nextflowai12@gmail.com">nextflowai12@gmail.com</a></p>
        <p className="small">Tempo de resposta típico: 24h úteis</p>
      </div>
    </div>
  </div>);
}

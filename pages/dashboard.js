import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '../lib/firebaseClient';
import { getDatabase, ref, child, get } from 'firebase/database';

export default function Dashboard(){
  const [user,setUser] = useState(null);
  const [subActive,setSubActive] = useState(false);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState('');

  useEffect(()=>{
    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, async (u)=>{
      try{
        if(u){
          setUser(u);
          const db = getDatabase(app);
          const key = u.email.replace(/\./g, ','); // RTDB não aceita pontos no ID
          const snap = await get(child(ref(db), `subscriptions/${key}`));
          setSubActive(snap.exists() && snap.val().active === true);
        } else {
          setUser(null);
          setSubActive(false);
        }
      }catch(e){
        console.error('Erro RTDB:', e);
        setError(e?.message || 'Falha ao verificar a subscrição');
        setSubActive(false);
      }finally{
        setLoading(false);
      }
    });
    return ()=>unsub();
  },[]);

  if(loading) return <div className="container"><p>A carregar…</p></div>;
  if(!user) return <div className="container"><p>Precisas de fazer login.</p></div>;

  async function startCheckout(plan='STARTER'){
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ email: user.email, uid: user.uid, plan })
    });
    const data = await res.json().catch(()=>({}));
    if(data.url) window.location.href = data.url;
    else alert(data.error || 'Erro a iniciar checkout');
  }

  return (<div>
    <div className="nav">
      <div className="container nav-inner">
        <div className="logo"><img src="/logo.svg" alt="logo"/><div>NextFlow AI</div></div>
        <div className="nav-links">
          <span className="badge">{user.email}</span>
          <button className="btn secondary" onClick={()=>signOut(getAuth(app))}>Sair</button>
        </div>
      </div>
    </div>

    <div className="container section">
      {error && <div className="card" style={{borderColor:'rgba(248,113,113,.35)'}}><p className="bad"><b>Erro:</b> {error}</p><p className="small">Dica: confirma que o Realtime Database está ativo e tem o nó <code>subscriptions/{{user && user.email && user.email.replace('.', ',')}}</code>.</p></div>}
      <h2 className="h2">Dashboard</h2>
      <div className="card">
        <p>Estado da subscrição: {subActive ? <b className="ok">Ativa</b> : <b className="bad">Inativa</b>}</p>
        {!subActive && (
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <button className="btn" onClick={()=>startCheckout('STARTER')}>Pagar Starter</button>
            <button className="btn secondary" onClick={()=>startCheckout('PRO')}>Pagar Pro</button>
            <button className="btn secondary" onClick={()=>startCheckout('BUSINESS')}>Pagar Business</button>
          </div>
        )}
      </div>

      <h3 className="h2" style={{marginTop:18}}>Funcionalidades</h3>
      {!subActive && <p className="small bad">precisas de pagar antes de usar o serviço</p>}
      <div className="grid grid-3" style={{opacity: subActive?1:.6}}>
        {['Chatbots de Atendimento','Captação de Leads','Marcações & Reservas','Automação Operacional','Integrações','Formação & Suporte'].map((t,i)=>(
          <div className="card" key={i}>
            <div className="title">{t}</div>
            {subActive ? <button className="btn secondary">Abrir módulo</button> : <span className="badge">Bloqueado</span>}
          </div>
        ))}
      </div>
    </div>
  </div>);
}

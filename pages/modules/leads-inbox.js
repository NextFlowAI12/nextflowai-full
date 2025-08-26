import React from 'react';
export default function LeadsInbox(){
  const [user,setUser] = React.useState(null);
  const [rows,setRows] = React.useState([]);

  React.useEffect(()=>{
    let unsubAuth;
    (async ()=>{
      const { getAuth, onAuthStateChanged } = await import('firebase/auth');
      const { app } = await import('../../lib/firebaseClient');
      const { getDatabase, ref, onValue } = await import('firebase/database');
      unsubAuth = onAuthStateChanged(getAuth(app), (u)=>{
        setUser(u);
        if(u){
          const r = ref(getDatabase(app), `leads/${u.uid}`);
          onValue(r, (snap)=>{
            const val = snap.val() || {};
            const arr = Object.entries(val).map(([id, v])=>({id, ...v})).sort((a,b)=> (b.ts||0)-(a.ts||0));
            setRows(arr);
          });
        }
      });
    })();
    return ()=>{ if(unsubAuth) unsubAuth(); };
  },[]);

  if(!user) return <div className="container"><p>Precisas de fazer login.</p></div>;

  return (<div className="container section">
    <div className="title">Leads — Caixa de entrada</div>
    {rows.length === 0 ? <div className="card"><p className="small">Sem leads ainda.</p></div> : (
      <div className="table">
        <div className="tr th">
          <div>Nome</div><div>Email</div><div>Telefone</div><div>Mensagem</div><div>Data</div>
        </div>
        {rows.map(row=>(
          <div key={row.id} className="tr">
            <div className="td"><b>{row.name}</b></div>
            <div className="td">{row.email}</div>
            <div className="td">{row.phone || '—'}</div>
            <div className="td">{row.message}</div>
            <div className="td">{new Date(row.ts||0).toLocaleString()}</div>
          </div>
        ))}
      </div>
    )}
  </div>);
}

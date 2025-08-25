import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../lib/firebaseClient';
import { getDatabase, ref, onValue } from 'firebase/database';

export default function LeadsInbox(){
  const [user,setUser] = useState(null);
  const [rows,setRows] = useState([]);

  useEffect(()=>{
    const unsub = onAuthStateChanged(getAuth(app), (u)=>{
      setUser(u);
      if(u){
        const db = getDatabase(app);
        const r = ref(db, `leads/${u.uid}`);
        onValue(r, (snap)=>{
          const val = snap.val() || {};
          const arr = Object.entries(val).map(([id, v])=>({id, ...v})).sort((a,b)=> (b.ts||0)-(a.ts||0));
          setRows(arr);
        });
      }
    });
    return ()=>unsub();
  },[]);

  if(!user) return <div className="container"><p>Precisas de fazer login.</p></div>;

  return (<div className="container section">
    <h2 className="h2">Leads — Caixa de entrada</h2>
    <div className="card">
      {rows.length === 0 ? <p className="small">Sem leads ainda.</p> : rows.map(row=>(
        <div key={row.id} className="card" style={{margin:'10px 0', padding:12}}>
          <b>{row.name}</b> · {row.email}
          <div className="small">{row.phone || ''}</div>
          <div style={{marginTop:6}}>{row.message}</div>
          <div className="small" style={{opacity:.8, marginTop:6}}>{new Date(row.ts||0).toLocaleString()}</div>
        </div>
      ))}
    </div>
  </div>);
}

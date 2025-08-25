import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../lib/firebaseClient';
import { getDatabase, ref, onValue } from 'firebase/database';

export default function LeadsInbox(){
  const [user,setUser] = useState(null);
  const [rows,setRows] = useState([]);
  const [downloading,setDownloading] = useState(false);

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

  function exportCSV(){
    setDownloading(true);
    const headers = ['id','name','email','phone','message','ts'];
    const lines = [headers.join(',')].concat(rows.map(r=>headers.map(h=>`"${(r[h]||'').toString().replace(/"/g,'""')}"`).join(',')));
    const blob = new Blob([lines.join('\n')], {type:'text/csv;charset=utf-8;'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click();
    URL.revokeObjectURL(url);
    setTimeout(()=>setDownloading(false),500);
  }

  if(!user) return <div className="container"><p>Precisas de fazer login.</p></div>;

  return (<div className="container section">
    <div className="toolbar">
      <a className="btn ghost" href="/modules/leads">← Leads</a>
      <div className="spacer" />
      <button className="btn small" onClick={exportCSV} disabled={rows.length===0 || downloading}>
        {downloading ? 'A gerar…' : 'Exportar CSV'}
      </button>
    </div>
    <h2 className="h2">Leads — Caixa de entrada</h2>

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

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../../../lib/firebaseClient';

export default function PublicChat(){
  const { query } = useRouter();
  const [data,setData] = useState(null);

  useEffect(()=>{
    if(!query.uid) return;
    const db = getDatabase(app);
    const r = ref(db, `widgets/${query.uid}/chatbot`);
    const unsub = onValue(r, (snap)=> setData(snap.val() || null));
    return ()=>unsub();
  },[query.uid]);

  if(!data) return <div className="container"><p>A carregar…</p></div>;

  return (<div className="container section">
    <div className="card">
      <div className="title">{data.name || 'Chatbot'}</div>
      <p className="small">{data.hours} · {data.address}</p>
      <div className="card" style={{padding:12, margin:'8px 0'}}>
        <div className="small" style={{opacity:.8}}>FAQs</div>
        <ul>{(data.faqs||[]).map((f,i)=>(<li key={i} style={{margin:'6px 0'}}><b>{f.q}</b><div>{f.a}</div></li>))}</ul>
      </div>
      {data.whatsapp && <a className="btn" href={`https://wa.me/${data.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer">Falar no WhatsApp</a>}
    </div>
  </div>);
}

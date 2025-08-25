import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../lib/firebaseClient';
import { getDatabase, ref, set, get, child } from 'firebase/database';

export default function Bookings(){
  const [user,setUser] = useState(null);
  const [calendly,setCalendly] = useState('');
  const [saved,setSaved] = useState(false);

  useEffect(()=>{
    const unsub = onAuthStateChanged(getAuth(app), async (u)=>{
      setUser(u);
      if(u){
        const db = getDatabase(app);
        const snap = await get(child(ref(db), `widgets/${u.uid}/calendly`));
        if(snap.exists()) setCalendly(snap.val().url || '');
      }
    });
    return ()=>unsub();
  },[]);

  async function save(){
    const db = getDatabase(app);
    await set(ref(db, `widgets/${user.uid}/calendly`), { url: calendly });
    setSaved(true); setTimeout(()=>setSaved(false), 1200);
  }

  if(!user) return <div className="container"><p>Precisas de fazer login.</p></div>;
  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/w/${user.uid}/book`;
  const iframe = `<iframe src="${publicUrl}" style="width:100%;height:800px;border:0;border-radius:12px"></iframe>`;

  return (<div className="container section">
    <h2 className="h2">Marcações & Reservas</h2>
    <div className="grid grid-2">
      <div className="card">
        <div className="title">Calendly</div>
        <input placeholder="https://calendly.com/teu-username/..." value={calendly} onChange={e=>setCalendly(e.target.value)} />
        <button className="btn" onClick={save}>Guardar</button> {saved && <span className="small ok">Guardado</span>}
      </div>
      <div className="card">
        <div className="title">Como usar</div>
        <p className="small">Link público: <a href={publicUrl} target="_blank" rel="noreferrer">{publicUrl}</a></p>
        <p className="small">Ou incorpora:</p>
        <pre style={{whiteSpace:'pre-wrap', background:'rgba(2,6,23,.35)', padding:10, borderRadius:10}}>{iframe}</pre>
      </div>
    </div>
  </div>);
}

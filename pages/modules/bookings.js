import React from 'react';
export default function Bookings(){
  const [user,setUser] = React.useState(null);
  const [url,setUrl] = React.useState('');
  const [saved,setSaved] = React.useState(false);
  React.useEffect(()=>{
    let unsub;
    (async ()=>{
      const { getAuth, onAuthStateChanged } = await import('firebase/auth');
      const { app } = await import('../../lib/firebaseClient');
      const { getDatabase, ref, set, get, child } = await import('firebase/database');
      const auth = getAuth(app);
      unsub = onAuthStateChanged(auth, async (u)=>{
        setUser(u);
        if(u){
          const snap = await get(child(ref(getDatabase(app)), `widgets/${u.uid}/calendly`));
          if(snap.exists()) setUrl(snap.val().url || '');
        }
      });
    })();
    return ()=>{ if(unsub) unsub(); };
  },[]);
  async function save(){
    const { app } = await import('../../lib/firebaseClient');
    const { getDatabase, ref, set } = await import('firebase/database');
    await set(ref(getDatabase(app), `widgets/${user.uid}/calendly`), { url });
    setSaved(true); setTimeout(()=>setSaved(false), 1200);
  }
  if(!user) return <div className="container"><p>Precisas de fazer login.</p></div>;
  const origin = typeof window!=='undefined' ? window.location.origin : '';
  const publicUrl = `${origin}/w/${user.uid}/book`;
  const iframe = `<iframe src="${publicUrl}" style="width:100%;height:800px;border:0;border-radius:12px"></iframe>`;
  return (<div className="container section">
    <h2 className="h2">Marcações & Reservas</h2>
    <div className="grid grid-2">
      <div className="card">
        <div className="title">Calendly</div>
        <input placeholder="https://calendly.com/teu-username/15min" value={url} onChange={e=>setUrl(e.target.value)} />
        <button className="btn" onClick={save}>Guardar</button> {saved && <span className="small ok">Guardado</span>}
        <div style={{marginTop:10}}>
          <div className="title">Iframe</div>
          <pre style={{whiteSpace:'pre-wrap', background:'rgba(2,6,23,.35)', padding:10, borderRadius:10}}>{iframe}</pre>
        </div>
      </div>
      <div className="card">
        <div className="title">Pré-visualização</div>
        {url ? <iframe src={publicUrl} style={{width:'100%',height:800,border:0,borderRadius:12}} /> : <p className="small">Cola o teu link Calendly e guarda.</p>}
      </div>
    </div>
  </div>);
}

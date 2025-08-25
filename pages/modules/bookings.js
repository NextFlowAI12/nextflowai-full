import { useEffect, useMemo, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../lib/firebaseClient';
import { getDatabase, ref, set, get, child } from 'firebase/database';

export default function Bookings(){
  const [user,setUser] = useState(null);
  const [calendly,setCalendly] = useState('');
  const [saved,setSaved] = useState(false);
  const [copied,setCopied] = useState('');

  const publicUrl = useMemo(()=>{
    if(typeof window === 'undefined' || !user) return '';
    return `${window.location.origin}/w/${user.uid}/book`;
  },[user]);
  const iframe = useMemo(()=> publicUrl ? `<iframe src="${publicUrl}" style="width:100%;height:800px;border:0;border-radius:12px"></iframe>` : '', [publicUrl]);

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
  function copy(txt,label){
    if(!txt) return;
    navigator.clipboard.writeText(txt); setCopied(label);
    setTimeout(()=>setCopied(''),1000);
  }

  if(!user) return <div className="container"><p>Precisas de fazer login.</p></div>;

  return (<div className="container section">
    <div className="toolbar">
      <a className="btn ghost" href="/modules">← Módulos</a>
      <div className="spacer" />
      {saved ? <span className="badge ok">Guardado</span> : <span className="badge pro">Draft</span>}
    </div>

    <div className="grid-tight">
      <div className="card">
        <div className="title">Calendly</div>
        <div className="field">
          <label>URL do teu Calendly</label>
          <input placeholder="https://calendly.com/teu-username/15min" value={calendly} onChange={e=>setCalendly(e.target.value)} />
          <span className="hint">Ex.: https://calendly.com/empresa/consulta</span>
        </div>
        <div className="actions-row">
          <button className="btn" onClick={save}>Guardar</button>
          <a className="btn secondary" href={publicUrl} target="_blank" rel="noreferrer">Abrir link público</a>
        </div>
        <div className="divider" />
        <div className="title">Embed (iframe)</div>
        <div className="codeblock small mono">{iframe || '—'}</div>
        <div className="actions-row">
          <button className={"copy "+(copied==='iframe'?'done':'')} onClick={()=>copy(iframe,'iframe')}>{copied==='iframe'?'Copiado!':'Copiar iframe'}</button>
        </div>
      </div>
      <div className="preview">
        <div className="title">Pré‑visualização</div>
        {calendly ? <iframe src={publicUrl} style={{width:'100%',height:800,border:0,borderRadius:12}} /> : <p className="placeholder small">Cola o teu link do Calendly e carrega em Guardar.</p>}
      </div>
    </div>
  </div>);
}

import { useEffect, useState, useMemo } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../lib/firebaseClient';
import { getDatabase, ref, set, get, child } from 'firebase/database';

export default function Chatbot(){
  const [user,setUser] = useState(null);
  const [tab,setTab] = useState('config');
  const [copied,setCopied] = useState('');
  const [data,setData] = useState({ name:'', hours:'', address:'', whatsapp:'', faqs:[{q:'',a:''},{q:'',a:''},{q:'',a:''}] });
  const [saved,setSaved] = useState(false);

  const publicUrl = useMemo(()=>{
    if(typeof window === 'undefined' || !user) return '';
    return `${window.location.origin}/w/${user.uid}/chat`;
  },[user]);

  const iframe = useMemo(()=> publicUrl ? `<iframe src="${publicUrl}" style="width:100%;height:600px;border:0;border-radius:12px"></iframe>` : '', [publicUrl]);

  useEffect(()=>{
    const auth = getAuth(app);
    const unsub = onAuthStateChanged(auth, async (u)=>{
      setUser(u);
      if(u){
        const db = getDatabase(app);
        const snap = await get(child(ref(db), `widgets/${u.uid}/chatbot`));
        if(snap.exists()) setData(snap.val());
      }
    });
    return ()=>unsub();
  },[]);

  async function save(){
    const db = getDatabase(app);
    await set(ref(db, `widgets/${user.uid}/chatbot`), data);
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
      <div className="tabbar">
        <span className={"tab "+(tab==='config'?'active':'')} onClick={()=>setTab('config')}>Configurar</span>
        <span className={"tab "+(tab==='publicar'?'active':'')} onClick={()=>setTab('publicar')}>Publicar</span>
      </div>
      <div className="spacer" />
      {saved ? <span className="badge ok">Guardado</span> : <span className="badge pro">Draft</span>}
    </div>

    {tab==='config' && (
      <div className="grid-tight">
        <div className="card">
          <div className="title">Informação da loja</div>
          <div className="field"><label>Nome</label><input placeholder="Café da Praça" value={data.name} onChange={e=>setData({...data,name:e.target.value})} /></div>
          <div className="field"><label>Horário</label><input placeholder="Seg–Sex 9h–18h" value={data.hours} onChange={e=>setData({...data,hours:e.target.value})} /></div>
          <div className="field"><label>Morada</label><input placeholder="Rua Exemplo 123, Lisboa" value={data.address} onChange={e=>setData({...data,address:e.target.value})} /></div>
          <div className="field"><label>WhatsApp (opcional)</label><input placeholder="+351 9xx xxx xxx" value={data.whatsapp} onChange={e=>setData({...data,whatsapp:e.target.value})} /></div>
          <div className="divider" />
          <div className="title">FAQs</div>
          {data.faqs.map((f,i)=>(
            <div key={i} className="field">
              <div className="input-row"><input placeholder={`Pergunta ${i+1}`} value={f.q} onChange={e=>{
                const faqs=[...data.faqs]; faqs[i]={...faqs[i], q:e.target.value}; setData({...data,faqs});
              }} /></div>
              <textarea placeholder="Resposta" rows="2" value={f.a} onChange={e=>{
                const faqs=[...data.faqs]; faqs[i]={...faqs[i], a:e.target.value}; setData({...data,faqs});
              }} />
            </div>
          ))}
          <div className="actions-row">
            <button className="btn" onClick={save}>Guardar</button>
            <span className="note">Guarda para publicar.</span>
          </div>
        </div>
        <div className="preview">
          <div className="title">{data.name || 'Chatbot'}</div>
          <p className="small">{(data.hours||'') + (data.address? ' · '+data.address : '')}</p>
          <div className="card" style={{padding:12}}>
            <div className="small" style={{opacity:.8}}>FAQs</div>
            <ul>{(data.faqs||[]).filter(x=>x.q||x.a).map((f,i)=>(<li key={i} style={{margin:'6px 0'}}><b>{f.q||'—'}</b><div>{f.a||'—'}</div></li>))}</ul>
          </div>
          {data.whatsapp && <a className="btn" style={{marginTop:8}} href={`https://wa.me/${data.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noreferrer">Testar WhatsApp</a>}
        </div>
      </div>
    )}

    {tab==='publicar' && (
      <div className="grid-tight">
        <div className="card">
          <div className="title">Link público</div>
          <div className="codeblock small mono">{publicUrl || '—'}</div>
          <div className="actions-row">
            <button className={"copy "+(copied==='link'?'done':'')} onClick={()=>copy(publicUrl,'link')}>{copied==='link'?'Copiado!':'Copiar link'}</button>
            <a className="btn secondary" href={publicUrl} target="_blank" rel="noreferrer">Abrir</a>
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
          <iframe src={publicUrl} style={{width:'100%',height:600,border:0,borderRadius:12}} />
          <p className="note" style={{marginTop:8}}>Se não aparece, volta a “Configurar” e clica Guardar.</p>
        </div>
      </div>
    )}
  </div>);
}

import { useEffect, useMemo, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../lib/firebaseClient';

export default function Leads(){
  const [user,setUser] = useState(null);
  const [tab,setTab] = useState('publicar');
  const [copied,setCopied] = useState('');

  const publicUrl = useMemo(()=>{
    if(typeof window === 'undefined' || !user) return '';
    return `${window.location.origin}/w/${user.uid}/lead`;
  },[user]);
  const iframe = useMemo(()=> publicUrl ? `<iframe src="${publicUrl}" style="width:100%;height:650px;border:0;border-radius:12px"></iframe>` : '', [publicUrl]);

  useEffect(()=>{
    const unsub = onAuthStateChanged(getAuth(app), setUser);
    return ()=>unsub();
  },[]);

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
        <span className={"tab "+(tab==='publicar'?'active':'')} onClick={()=>setTab('publicar')}>Publicar</span>
        <a className="tab" href="/modules/leads-inbox">Caixa de entrada</a>
      </div>
      <div className="spacer" />
      <span className="badge pro">Link público</span>
    </div>

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
        <p className="hint">Dica: no WordPress usa o bloco “HTML personalizado”.</p>
      </div>
      <div className="preview">
        <div className="title">Pré‑visualização</div>
        <iframe src={publicUrl} style={{width:'100%',height:650,border:0,borderRadius:12}} />
        <p className="note" style={{marginTop:8}}>Submete uma lead para testar e vê em “Caixa de entrada”.</p>
      </div>
    </div>
  </div>);
}

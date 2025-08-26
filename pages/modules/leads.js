import React from 'react';
export default function Leads(){
  const [user,setUser] = React.useState(null);
  React.useEffect(()=>{
    let unsub;
    (async ()=>{
      const { getAuth, onAuthStateChanged } = await import('firebase/auth');
      const { app } = await import('../../lib/firebaseClient');
      unsub = onAuthStateChanged(getAuth(app), setUser);
    })();
    return ()=>{ if(unsub) unsub(); };
  },[]);
  if(!user) return <div className="container"><p>Precisas de fazer login.</p></div>;
  const origin = typeof window!=='undefined' ? window.location.origin : '';
  const publicUrl = `${origin}/w/${user.uid}/lead`;
  const iframe = `<iframe src="${publicUrl}" style="width:100%;height:650px;border:0;border-radius:12px"></iframe>`;
  return (<div className="container section">
    <h2 className="h2">Captação de Leads</h2>
    <div className="grid grid-2">
      <div className="card">
        <div className="title">Publicar</div>
        <p className="small">Link: <a href={publicUrl} target="_blank" rel="noreferrer">{publicUrl}</a></p>
        <p className="small">Iframe:</p>
        <pre style={{whiteSpace:'pre-wrap', background:'rgba(2,6,23,.35)', padding:10, borderRadius:10}}>{iframe}</pre>
        <a className="btn" href="/modules/leads-inbox">Abrir Inbox</a>
      </div>
      <div className="card">
        <div className="title">Dicas</div>
        <p className="small">WordPress → bloco “HTML personalizado”.</p>
      </div>
    </div>
  </div>);
}

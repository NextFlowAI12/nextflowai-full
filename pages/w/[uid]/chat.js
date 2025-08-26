import React from 'react';
export default function PublicChat(){
  const [cfg,setCfg] = React.useState(null);
  React.useEffect(()=>{
    let uid;
    try{ uid = window.location.pathname.split('/')[2]; }catch(e){}
    (async ()=>{
      if(!uid) return;
      const { app } = await import('../../../lib/firebaseClient');
      const { getDatabase, ref, child, get } = await import('firebase/database');
      const snap = await get(child(ref(getDatabase(app)), `widgets/${uid}/chatbot`));
      if(snap.exists()) setCfg(snap.val());
    })();
  },[]);
  if(!cfg) return <div style={{padding:16,fontFamily:'system-ui'}}>A carregar…</div>;
  return (
    <div style={{fontFamily:'system-ui',maxWidth:680,margin:'0 auto',padding:16}}>
      <h3>{cfg.name||'Chatbot'}</h3>
      <div style={{opacity:.8,marginBottom:8}}>{cfg.hours} {cfg.address? '· '+cfg.address: ''}</div>
      <div style={{border:'1px solid #ddd',borderRadius:12,padding:12}}>
        <div style={{opacity:.7,marginBottom:6}}>FAQs</div>
        {(cfg.faqs||[]).filter(f=>f.q||f.a).map((f,i)=>(<div key={i} style={{margin:'6px 0'}}><b>{f.q}</b><div>{f.a}</div></div>))}
      </div>
    </div>
  );
}

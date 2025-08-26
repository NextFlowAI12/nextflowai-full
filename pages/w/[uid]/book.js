import React from 'react';
export default function PublicBook(){
  const [url,setUrl] = React.useState('');
  React.useEffect(()=>{
    (async ()=>{
      const uid = window.location.pathname.split('/')[2];
      const { app } = await import('../../../lib/firebaseClient');
      const { getDatabase, ref, child, get } = await import('firebase/database');
      const snap = await get(child(ref(getDatabase(app)), `widgets/${uid}/calendly`));
      if(snap.exists()) setUrl(snap.val().url||'');
    })();
  },[]);
  if(!url) return <div style={{padding:16,fontFamily:'system-ui'}}>Sem link configurado.</div>;
  return <iframe src={url} style={{width:'100%',height:800,border:0}} />;
}

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getDatabase, ref, onValue } from 'firebase/database';
import { app } from '../../../lib/firebaseClient';

export default function PublicBooking(){
  const { query } = useRouter();
  const [url,setUrl] = useState('');

  useEffect(()=>{
    if(!query.uid) return;
    const rtdb = getDatabase(app);
    const r = ref(rtdb, `widgets/${query.uid}/calendly`);
    const unsub = onValue(r, (snap)=> setUrl((snap.val() && snap.val().url) || ''));
    return ()=>unsub();
  },[query.uid]);

  if(!url) return <div className="container"><p>Sem calendário configurado.</p></div>;

  return (<div className="container section">
    <div className="card" style={{overflow:'hidden'}}>
      <iframe src={url} style={{width:'100%', height:'800px', border:0, borderRadius:'12px'}}></iframe>
    </div>
  </div>);
}

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../lib/firebaseClient';
import Link from 'next/link';

export default function Leads(){
  const [user,setUser] = useState(null);

  useEffect(()=>{
    const unsub = onAuthStateChanged(getAuth(app), setUser);
    return ()=>unsub();
  },[]);

  if(!user) return <div className="container"><p>Precisas de fazer login.</p></div>;

  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/w/${user.uid}/lead`;
  const iframe = `<iframe src="${publicUrl}" style="width:100%;height:650px;border:0;border-radius:12px"></iframe>`;

  return (<div className="container section">
    <h2 className="h2">Captação de Leads</h2>
    <div className="grid grid-2">
      <div className="card">
        <div className="title">Formulário público</div>
        <p className="small">Link partilhável:</p>
        <p><a href={publicUrl} target="_blank" rel="noreferrer">{publicUrl}</a></p>
        <p className="small">Ou incorpora no teu site:</p>
        <pre style={{whiteSpace:'pre-wrap', background:'rgba(2,6,23,.35)', padding:10, borderRadius:10}}>{iframe}</pre>
        <p className="small">As submissões ficam guardadas e podes vê-las em <Link href="/modules/leads-inbox">Leads → Caixa de entrada</Link>.</p>
      </div>
      <div className="card">
        <div className="title">Automatizações sugeridas</div>
        <ul>
          <li className="small">Zapier/Make: quando há nova lead → enviar email/WhatsApp/CRM.</li>
          <li className="small">Google Sheets: registar automaticamente as leads.</li>
        </ul>
        <p className="small">Se quiseres, eu envio-te os passos exatos no Zapier/Make.</p>
      </div>
    </div>
  </div>);
}

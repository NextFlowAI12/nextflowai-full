import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../../lib/firebaseClient';
import { getDatabase, ref, set, get, child } from 'firebase/database';

export default function Chatbot(){
  const [user,setUser] = useState(null);
  const [data,setData] = useState({ name:'', hours:'', address:'', whatsapp:'', faqs:[{q:'',a:''},{q:'',a:''},{q:'',a:''}] });
  const [saved,setSaved] = useState(false);

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
    setSaved(true);
    setTimeout(()=>setSaved(false), 1500);
  }

  if(!user) return <div className="container"><p>Precisas de fazer login.</p></div>;
  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/w/${user.uid}/chat`;
  const iframe = `<iframe src="${publicUrl}" style="width:100%;height:600px;border:0;border-radius:12px"></iframe>`;

  return (<div className="container section">
    <h2 className="h2">Chatbot de Atendimento</h2>
    <div className="grid grid-2">
      <div className="card">
        <div className="title">Informação da loja</div>
        <label className="small">Nome</label>
        <input value={data.name} onChange={e=>setData({...data,name:e.target.value})} />
        <label className="small">Horário</label>
        <input value={data.hours} onChange={e=>setData({...data,hours:e.target.value})} />
        <label className="small">Morada</label>
        <input value={data.address} onChange={e=>setData({...data,address:e.target.value})} />
        <label className="small">WhatsApp (opcional)</label>
        <input value={data.whatsapp} onChange={e=>setData({...data,whatsapp:e.target.value})} />
        <div className="title" style={{marginTop:8}}>FAQs</div>
        {data.faqs.map((f,i)=>(
          <div key={i} className="card" style={{padding:12, margin:'8px 0'}}>
            <input placeholder={`Pergunta ${i+1}`} value={f.q} onChange={e=>{
              const faqs=[...data.faqs]; faqs[i]={...faqs[i], q:e.target.value}; setData({...data,faqs});
            }} />
            <input placeholder="Resposta" value={f.a} onChange={e=>{
              const faqs=[...data.faqs]; faqs[i]={...faqs[i], a:e.target.value}; setData({...data,faqs});
            }} />
          </div>
        ))}
        <button className="btn" onClick={save}>Guardar</button>
        {saved && <span className="small ok" style={{marginLeft:8}}>Guardado</span>}
      </div>
      <div className="card">
        <div className="title">Como usar</div>
        <p className="small">Podes colocar no teu site com este iframe:</p>
        <pre style={{whiteSpace:'pre-wrap', background:'rgba(2,6,23,.35)', padding:10, borderRadius:10}}>{iframe}</pre>
        <p className="small">Ou usa o link direto: <a href={publicUrl} target="_blank" rel="noreferrer">{publicUrl}</a></p>
      </div>
    </div>
  </div>);
}

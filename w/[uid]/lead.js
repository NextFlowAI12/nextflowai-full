import { useRouter } from 'next/router';
import { useState } from 'react';

export default function LeadForm(){
  const { query } = useRouter();
  const [sent,setSent] = useState(false);
  const [loading,setLoading] = useState(false);
  const [form,setForm] = useState({ name:'', email:'', phone:'', message:'' });

  async function submit(e){
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/lead', { method:'POST', headers:{'Content-Type':'application/json'},
      body: JSON.stringify({ uid: query.uid, ...form }) });
    setLoading(false);
    if(res.ok) setSent(true);
    else alert('Falha a enviar lead');
  }

  if(sent) return <div className="container section"><div className="card"><h2 className="h2">Obrigado!</h2><p>Vamos entrar em contacto em breve.</p></div></div>;

  return (<div className="container section">
    <div className="card" style={{maxWidth:640, margin:'0 auto'}}>
      <div className="title">Pede contacto</div>
      <form onSubmit={submit}>
        <label className="small">Nome</label>
        <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/>
        <label className="small">Email</label>
        <input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/>
        <label className="small">Telefone</label>
        <input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/>
        <label className="small">Mensagem</label>
        <textarea value={form.message} onChange={e=>setForm({...form,message:e.target.value})} rows="4"/>
        <button className="btn" type="submit" disabled={loading}>{loading?'A enviar…':'Enviar'}</button>
      </form>
    </div>
  </div>);
}

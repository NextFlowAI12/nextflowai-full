import React from 'react';
export default function PublicLead(){
  const [uid,setUid] = React.useState('');
  const [form,setForm] = React.useState({name:'',email:'',phone:'',message:''});
  const [ok,setOk] = React.useState(false);
  const [err,setErr] = React.useState('');
  React.useEffect(()=>{
    const u = window.location.pathname.split('/')[2]; setUid(u||'');
  },[]);
  async function submit(e){
    e.preventDefault(); setErr(''); setOk(false);
    if(!form.name || !form.email){ setErr('Nome e email são obrigatórios'); return; }
    try{
      const res = await fetch('/api/lead', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ uid, ...form }) });
      const j = await res.json();
      if(!res.ok) throw new Error(j.error||'erro');
      setOk(true); setForm({name:'',email:'',phone:'',message:''});
    }catch(e){ setErr('Falhou: '+e.message); }
  }
  return (
    <div style={{fontFamily:'system-ui',maxWidth:680,margin:'0 auto',padding:16}}>
      <h3>Deixa os teus dados</h3>
      {ok && <div style={{padding:10,border:'1px solid #a7f3d0',background:'#ecfdf5',borderRadius:8,marginBottom:8}}>Recebido, obrigado!</div>}
      {err && <div style={{padding:10,border:'1px solid #fecaca',background:'#fef2f2',borderRadius:8,marginBottom:8}}>{err}</div>}
      <form onSubmit={submit}>
        <div style={{display:'grid',gap:8}}>
          <input placeholder="Nome" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} />
          <input placeholder="Telefone (opcional)" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
          <textarea placeholder="Mensagem" rows="4" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} />
          <button type="submit">Enviar</button>
        </div>
      </form>
    </div>
  );
}

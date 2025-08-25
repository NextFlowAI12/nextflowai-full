
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../lib/firebaseClient';
import Link from 'next/link';

export default function Login(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState('');
  const auth = getAuth(app);

  async function handleLogin(e){
    e.preventDefault();
    try{
      await signInWithEmailAndPassword(auth,email,password);
      window.location.href = '/dashboard';
    }catch(err){ setError(err.message); }
  }

  return (<div className="container">
    <div className="nav-inner" style={{marginBottom:16}}>
      <Link href="/" className="btn ghost">← Voltar</Link>
    </div>
    <div className="card" style={{maxWidth:460, margin:'0 auto'}}>
      <div className="title">Entrar</div>
      <form onSubmit={handleLogin}>
        <label className="small">Email</label>
        <input className="input" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--stroke);background:rgba(2,6,23,.4);color:var(--text)" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <label className="small" style={{marginTop:8}}>Password</label>
        <input className="input" style="width:100%;padding:10px;border-radius:10px;border:1px solid var(--stroke);background:rgba(2,6,23,.4);color:var(--text)" type="password" value={password} onChange={e=>setPassword(e.target.value)} required/>
        {error && <p style={{color:'#fecaca'}}>{error}</p>}
        <button className="btn" type="submit" style={{marginTop:10}}>Entrar</button>
      </form>
      <p className="small" style={{marginTop:10}}>Ainda não tens conta? <Link href="/signup">Criar conta</Link></p>
    </div>
  </div>);
}

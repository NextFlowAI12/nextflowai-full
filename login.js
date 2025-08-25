
import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../lib/firebaseClient';
import { useRouter } from 'next/router';

export default function Login(){
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [error,setError] = useState('');
  const router = useRouter();
  const auth = getAuth(app);

  async function handleLogin(e){
    e.preventDefault();
    try{
      await signInWithEmailAndPassword(auth,email,password);
      router.push('/dashboard');
    }catch(err){ setError(err.message); }
  }

  return (<div>
    <h1>Login</h1>
    <form onSubmit={handleLogin}>
      <input type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button type="submit">Entrar</button>
    </form>
    {error && <p style={{color:'red'}}>{error}</p>}
  </div>);
}

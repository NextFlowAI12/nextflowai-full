
import Link from 'next/link';
export default function Home(){
  return (
    <div>
      <h1>NextFlow AI</h1>
      <p>Automação para pequenas empresas</p>
      <p>📞 +351 916 053 688</p>
      <p>✉️ nextflowai12@gmail.com</p>
      <Link href="/login">Login</Link> | <Link href="/signup">Registar</Link> | <Link href="/dashboard">Dashboard</Link>
    </div>
  );
}

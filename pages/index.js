export default function Home(){
  return (
    <div className="container section">
      <div className="card">
        <div className="title">NextFlow AI</div>
        <p className="small">Homepage carregada com sucesso. Usa os atalhos abaixo.</p>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <a className="btn" href="/login">Entrar</a>
          <a className="btn" href="/modules">Módulos</a>
          <a className="btn" href="/#planos">Planos</a>
        </div>
      </div>
    </div>
  );
}

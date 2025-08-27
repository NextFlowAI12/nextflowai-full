// pages/index.js
export default function Home(){
  async function startCheckout(plan) {
    try {
      const { getAuth } = await import('firebase/auth');
      const { app } = await import('../lib/firebaseClient');
      const uid = getAuth(app).currentUser?.uid;
      if (!uid) return (window.location.href = '/login');
      const res = await fetch('/api/create-checkout-session', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ plan, uid })
      });
      const j = await res.json();
      if (res.ok && j.url) window.location.href = j.url;
      else alert('Não foi possível abrir o checkout.');
    } catch (e) { console.error(e); alert('Erro inesperado a abrir o checkout.'); }
  }

  return (
    <>
      <header className="nx-header">
        <div className="wrap">
          <a href="/" className="brand">
            <div className="logo">NF</div>
            <span>NextFlow AI</span>
          </a>
          <nav className="nav">
            <a href="#features">Funcionalidades</a>
            <a href="#como-funciona">Como funciona</a>
            <a href="#planos">Planos</a>
            <a href="#faq">FAQ</a>
            <a className="btn small" href="/login">Entrar</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="bg-glow"></div>
          <div className="wrap grid2">
            <div className="col">
              <h1>Automação que traz clientes,<br/>não trabalho extra.</h1>
              <p className="sub">Chatbots, captação de leads, marcações e integrações — prontos em dias, não meses.</p>
              <div className="cta">
                <a className="btn large" href="/login">Começar agora</a>
                <a className="btn ghost large" href="#demo">Ver demo</a>
              </div>
            </div>
            <div className="col preview">
              <div className="mac-card"><div className="mac-title"><span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span><span className="title">Fluxo</span></div>
                <div className="mac-body">
                  <div className="flow">
                    <div className="node">Visitante</div><div className="arrow"></div>
                    <div className="node">Chatbot</div><div className="arrow"></div>
                    <div className="node">Lead</div><div className="arrow"></div>
                    <div className="node accent">Reserva</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="planos" className="section planos">
          <div className="wrap">
            <h2>Planos simples</h2>
            <div className="grid3">
              <div className="card plan"><h3>Starter</h3><div className="price">€80/mês</div><button className="btn wfull" onClick={() => startCheckout('starter')}>Escolher Starter</button></div>
              <div className="card plan"><h3>Pro</h3><div className="price">€150/mês</div><button className="btn wfull" onClick={() => startCheckout('pro')}>Escolher Pro</button></div>
              <div className="card plan"><h3>Business</h3><div className="price">€300/mês</div><button className="btn wfull" onClick={() => startCheckout('business')}>Escolher Business</button></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="nx-footer"><div className="wrap">© {new Date().getFullYear()} NextFlow AI</div></footer>
      <link rel="stylesheet" href="/styles/home.css" />
    </>
  )
}

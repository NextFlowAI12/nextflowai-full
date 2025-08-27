// pages/index.js
import Head from 'next/head'

export default function Home(){
  return (
    <>
      <Head>
        <title>NextFlow AI — Automação para PMEs</title>
        <meta name="description" content="Chatbots, leads, marcações e integrações que trazem clientes — não trabalho extra." />
        <link rel="icon" href="/favicon.svg" />
        <meta property="og:title" content="NextFlow AI" />
        <meta property="og:description" content="Automação que traz clientes. Chatbots, leads, reservas e integrações." />
        <meta property="og:image" content="/og.png" />
      </Head>

      <header className="nx-header">
        <div className="wrap">
          <a href="/" className="brand">
            <img src="/favicon.svg" alt="NextFlow" width="28" height="28" />
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
          <div className="wrap grid2">
            <div className="col">
              <p className="kicker">AI para pequenas empresas</p>
              <h1>Automação que traz clientes,<br/>não trabalho extra.</h1>
              <p className="sub">
                Chatbots, captação de leads, marcações e integrações — prontos em dias, não meses.
              </p>
              <div className="cta">
                <a className="btn primary" href="/login">Começar agora</a>
                <a className="btn ghost" href="#planos">Ver preços</a>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="section">
          <div className="wrap">
            <h2>Tudo o que precisas</h2>
            <div className="grid3">
              <div className="card f"><div className="ico">💬</div><h3>Chatbots de Atendimento</h3><p>Respostas instantâneas, FAQs, horários, morada e encaminhamento.</p></div>
              <div className="card f"><div className="ico">🎯</div><h3>Captação de Leads</h3><p>Formulários inteligentes e envio para email/CRM/WhatsApp.</p></div>
              <div className="card f"><div className="ico">📅</div><h3>Marcações & Reservas</h3><p>Integração com Google Calendar, Calendly e sistemas de reservas.</p></div>
            </div>
          </div>
        </section>

        <section id="planos" className="section planos">
          <div className="wrap">
            <h2>Planos simples</h2>
            <div className="grid3">
              <div className="card plan"><h3>Starter</h3><div className="price">€80/mês</div></div>
              <div className="card plan featured"><h3>Pro</h3><div className="price">€150/mês</div></div>
              <div className="card plan"><h3>Business</h3><div className="price">€300/mês</div></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="nx-footer">
        <div className="wrap">
          <div>© {new Date().getFullYear()} NextFlow AI</div>
        </div>
      </footer>

      <link rel="stylesheet" href="/styles/home-pro.css" />
    </>
  )
}

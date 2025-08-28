// pages/index.js
import Head from 'next/head'

export default function Home(){
  return (
    <>
      <Head>
        <title>NextFlow AI — Automatiza e cresce</title>
        <meta name="description" content="Chatbots, leads, reservas e integrações para PMEs. Rápido, simples e com suporte humano." />
        <link rel="icon" href="/favicon.svg" />
      </Head>

      <header className="nx-header">
        <div className="wrap">
          <a href="/" className="brand">
            <img src="/favicon.svg" alt="NextFlow" width="28" height="28" />
            <span>NextFlow AI</span>
          </a>
          <nav className="nav">
            <a href="#features">Funcionalidades</a>
            <a href="#como">Como funciona</a>
            <a href="#planos">Planos</a>
            <a href="#contactos">Contactos</a>
            <a className="btn small" href="/login">Entrar</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="glow" />
          <div className="wrap grid2">
            <div className="col">
              <p className="kicker">Automação para pequenas empresas</p>
              <h1>Mais clientes, menos trabalho.</h1>
              <p className="sub">Chatbots, captação de leads, marcações e integrações — tudo ligado por ti, sem código.</p>
              <div className="cta">
                <a className="btn primary" href="#planos">Começar agora</a>
                <a className="btn ghost" href="/onboarding">Onboarding</a>
              </div>
              <ul className="benefits">
                <li>⚡ Arranque em dias</li>
                <li>🔒 Dados seguros</li>
                <li>💬 Suporte por WhatsApp</li>
              </ul>
            </div>
            <div className="col preview">
              <div className="panel">
                <div className="panel-top">
                  <span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span>
                  <span className="title">Fluxo típico</span>
                </div>
                <div className="panel-body">
                  <div className="flow">
                    <div className="node">Visitante</div><div className="arrow" />
                    <div className="node">Chatbot</div><div className="arrow" />
                    <div className="node">Lead</div><div className="arrow" />
                    <div className="node accent">Reserva</div>
                  </div>
                  <div className="stats">
                    <div><b>+37%</b><span>Leads</span></div>
                    <div><b>-62%</b><span>Tempo de resposta</span></div>
                    <div><b>24/7</b><span>Atendimento</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="logos wrap">
            <span>WhatsApp</span><span>Gmail</span><span>Sheets</span><span>Calendly</span><span>WordPress</span><span>Shopify</span><span>Meta</span>
          </div>
        </section>

        <section id="features" className="section">
          <div className="wrap">
            <h2>Tudo o que precisas</h2>
            <div className="grid3">
              <div className="card"><div className="ico">💬</div><h3>Chatbots de Atendimento</h3><p>Respostas instantâneas, FAQs, horários e passagem a humano.</p></div>
              <div className="card"><div className="ico">🎯</div><h3>Captação de Leads</h3><p>Formulários inteligentes, qualificação e envio para email/CRM/WhatsApp.</p></div>
              <div className="card"><div className="ico">📅</div><h3>Marcações & Reservas</h3><p>Integração com Google Calendar, Calendly e sistemas de reservas.</p></div>
              <div className="card"><div className="ico">⚙️</div><h3>Automação Operacional</h3><p>Emails, lembretes de pagamento, faturas e atualização de sheets.</p></div>
              <div className="card"><div className="ico">🔌</div><h3>Integrações</h3><p>WhatsApp, Gmail, Google Sheets, Meta, WordPress, Shopify e mais.</p></div>
              <div className="card"><div className="ico">📚</div><h3>Formação & Suporte</h3><p>Documentação simples e suporte por email/WhatsApp.</p></div>
            </div>
          </div>
        </section>

        <section id="como" className="section steps">
          <div className="wrap">
            <h2>Como funciona</h2>
            <div className="grid3">
              <div className="card step"><div className="step-num">1</div><h4>Escolhe um plano</h4><p>Sem fidelização.</p></div>
              <div className="card step"><div className="step-num">2</div><h4>Onboarding guiado</h4><p>Ligamos WhatsApp, Gmail e Sheets.</p></div>
              <div className="card step"><div className="step-num">3</div><h4>Arranca e mede</h4><p>Relatórios simples e objetivos.</p></div>
            </div>
          </div>
        </section>

        <section id="planos" className="section planos">
          <div className="wrap">
            <h2>Planos simples</h2>
            <div className="grid3">
              <div className="card plan">
                <div className="plan-head"><h3>Starter</h3><span className="pill">Para começar</span></div>
                <div className="price">€80<span>/mês</span></div>
                <ul><li>1 chatbot + 1 formulário</li><li>Marcações básicas</li><li>Suporte Email/WhatsApp</li></ul>
                <a className="btn primary wfull" href="/login">Escolher Starter</a>
              </div>
              <div className="card plan featured">
                <div className="badge">Mais popular</div>
                <div className="plan-head"><h3>Pro</h3><span className="pill">Crescimento</span></div>
                <div className="price">€150<span>/mês</span></div>
                <ul><li>3 chatbots + 3 formulários</li><li>Marcações avançadas</li><li>Integrações Zapier/Make</li></ul>
                <a className="btn primary wfull" href="/login">Escolher Pro</a>
              </div>
              <div className="card plan">
                <div className="plan-head"><h3>Business</h3><span className="pill">Escala</span></div>
                <div className="price">€300<span>/mês</span></div>
                <ul><li>Tudo do Pro sem limites</li><li>Onboarding assistido</li><li>SLAs de suporte</li></ul>
                <a className="btn primary wfull" href="/login">Escolher Business</a>
              </div>
            </div>
            <p className="disclaimer">Cobrança via Stripe. Cancela quando quiseres.</p>
          </div>
        </section>

        <section id="contactos" className="section">
          <div className="wrap">
            <h2>Contactos</h2>
            <div className="grid3">
              <div className="card"><h3>Telefone</h3><p><a href="tel:+351916053688">+351 916 053 688</a></p></div>
              <div className="card"><h3>Email</h3><p><a href="mailto:nextflowai12@gmail.com">nextflowai12@gmail.com</a></p></div>
              <div className="card"><h3>Onboarding</h3><p>Já tens plano ativo? <a className="btn small" href="/onboarding">Abrir questionário</a></p></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="nx-footer">
        <div className="wrap">
          <div>© {new Date().getFullYear()} NextFlow AI</div>
          <div className="links">
            <a href="/login">Área do cliente</a>
            <a href="#planos">Planos</a>
            <a href="mailto:nextflowai12@gmail.com">Contacto</a>
          </div>
        </div>
      </footer>
    </>
  )
}

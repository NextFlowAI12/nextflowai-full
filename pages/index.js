// pages/index.js
import Head from 'next/head'

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
        {/* HERO */}
        <section className="hero">
          <div className="grid-bg" aria-hidden />
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
              <ul className="bullets">
                <li>⚡ Onboarding assistido</li>
                <li>🔒 Dados seguros</li>
                <li>💬 Suporte humano</li>
              </ul>
            </div>
            <div className="col preview">
              <div className="ui-shell">
                <div className="shell-top">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                  <span className="title">Demo de fluxo</span>
                </div>
                <div className="shell-body">
                  <div className="flow">
                    <div className="node">Visitante</div>
                    <div className="arrow" />
                    <div className="node">Chatbot</div>
                    <div className="arrow" />
                    <div className="node">Lead</div>
                    <div className="arrow" />
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
            <span>WhatsApp</span><span>Gmail</span><span>Google Sheets</span><span>Calendly</span><span>WordPress</span><span>Shopify</span><span>Meta</span>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="section">
          <div className="wrap">
            <h2>Tudo o que precisas</h2>
            <div className="grid3">
              <div className="card f">
                <div className="ico">💬</div>
                <h3>Chatbots de Atendimento</h3>
                <p>Respostas instantâneas, FAQs, horários, morada e encaminhamento para humano.</p>
              </div>
              <div className="card f">
                <div className="ico">🎯</div>
                <h3>Captação de Leads</h3>
                <p>Formulários inteligentes, qualificação automática e envio para email/CRM/WhatsApp.</p>
              </div>
              <div className="card f">
                <div className="ico">📅</div>
                <h3>Marcações & Reservas</h3>
                <p>Integração com Google Calendar, Calendly e sistemas de reservas.</p>
              </div>
              <div className="card f">
                <div className="ico">⚙️</div>
                <h3>Automação Operacional</h3>
                <p>Emails, lembretes de pagamento, rascunhos de fatura e atualização de sheets.</p>
              </div>
              <div className="card f">
                <div className="ico">🔌</div>
                <h3>Integrações</h3>
                <p>WhatsApp, Gmail, Google Sheets, Meta, WordPress, Shopify e mais.</p>
              </div>
              <div className="card f">
                <div className="ico">📚</div>
                <h3>Formação & Suporte</h3>
                <p>Documentação simples e suporte por email/WhatsApp.</p>
              </div>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section id="como-funciona" className="section steps">
          <div className="wrap">
            <h2>Como funciona</h2>
            <div className="grid3">
              <div className="card step">
                <div className="step-num">1</div>
                <h4>Escolhe um plano</h4>
                <p>Sem fidelização. Podes cancelar quando quiseres.</p>
              </div>
              <div className="card step">
                <div className="step-num">2</div>
                <h4>Onboarding guiado</h4>
                <p>Ligamos-te WhatsApp/Gmail/Sheets e as páginas do teu site.</p>
              </div>
              <div className="card step">
                <div className="step-num">3</div>
                <h4>Arranca e mede</h4>
                <p>Relatórios simples com leads, reservas e KPIs principais.</p>
              </div>
            </div>
          </div>
        </section>

        {/* PLANOS */}
        <section id="planos" className="section planos">
          <div className="wrap">
            <h2>Planos simples</h2>
            <div className="grid3">
              <div className="card plan">
                <div className="plan-head"><h3>Starter</h3><span className="pill">Para começar</span></div>
                <div className="price">€80<span>/mês</span></div>
                <ul>
                  <li>1 chatbot + 1 formulário</li>
                  <li>Marcações básicas</li>
                  <li>Suporte Email/WhatsApp</li>
                </ul>
                <button className="btn primary wfull" onClick={() => startCheckout('starter')}>Escolher Starter</button>
              </div>
              <div className="card plan featured">
                <div className="badge">Mais popular</div>
                <div className="plan-head"><h3>Pro</h3><span className="pill">Crescimento</span></div>
                <div className="price">€150<span>/mês</span></div>
                <ul>
                  <li>3 chatbots + 3 formulários</li>
                  <li>Marcações avançadas</li>
                  <li>Integrações Zapier/Make</li>
                </ul>
                <button className="btn primary wfull" onClick={() => startCheckout('pro')}>Escolher Pro</button>
              </div>
              <div className="card plan">
                <div className="plan-head"><h3>Business</h3><span className="pill">Escala</span></div>
                <div className="price">€300<span>/mês</span></div>
                <ul>
                  <li>Tudo do Pro sem limites</li>
                  <li>Onboarding assistido</li>
                  <li>SLAs de suporte</li>
                </ul>
                <button className="btn primary wfull" onClick={() => startCheckout('business')}>Escolher Business</button>
              </div>
            </div>
            <p className="disclaimer">Cobrança via Stripe. Cancela quando quiseres.</p>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section faq">
          <div className="wrap">
            <h2>Perguntas frequentes</h2>
            <details className="card">
              <summary>Quanto tempo demora a ficar tudo pronto?</summary>
              <p>Normalmente 2–5 dias úteis, dependendo das integrações.</p>
            </details>
            <details className="card">
              <summary>Posso trazer o meu WhatsApp e Gmail?</summary>
              <p>Sim. Configuramos com as tuas contas e sem bloqueio.</p>
            </details>
            <details className="card">
              <summary>É possível cancelar a qualquer momento?</summary>
              <p>Sim, diretamente na tua área de cliente.</p>
            </details>
          </div>
        </section>

        {/* CONTACTO */}
        <section id="contacto" className="section contacto">
          <div className="wrap grid2">
            <div>
              <h2>Fala connosco</h2>
              <p>Tiras dúvidas num minuto. Sem compromisso.</p>
            </div>
            <div className="contact-cards">
              <a className="card link" href="tel:+351916053688">
                <div className="ico">📞</div>
                <div>
                  <div className="label">Telefone</div>
                  <div className="value">+351 916 053 688</div>
                </div>
              </a>
              <a className="card link" href="mailto:nextflowai12@gmail.com">
                <div className="ico">✉️</div>
                <div>
                  <div className="label">Email</div>
                  <div className="value">nextflowai12@gmail.com</div>
                </div>
              </a>
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
          </div>
        </div>
      </footer>

      <link rel="stylesheet" href="/styles/home-pro.css" />
    </>
  )
}

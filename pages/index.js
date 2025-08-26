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
      else if (j?.error === 'missing_price_id_for_plan') {
        alert('No Netlify: faltam as variáveis do plano ' + plan + ': PRICE_' + plan.toUpperCase() + ' (ou NEXT_PUBLIC_PRICE_' + plan.toUpperCase() + ')');
      } else {
        alert('Não foi possível abrir o checkout.');
      }
    } catch (e) {
      console.error(e); alert('Erro inesperado a abrir o checkout.');
    }
  }

  return (
    <>
      <header className="nf-header">
        <div className="wrap">
          <div className="brand">
            <div className="logo">NF</div>
            <span>NextFlow AI</span>
          </div>
          <nav className="nav">
            <a href="#servicos">Serviços</a>
            <a href="#planos">Planos</a>
            <a href="#contacto">Contacto</a>
            <a className="btn small" href="/login">Entrar</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="wrap grid2">
            <div className="col">
              <h1>Automação de IA simples para pequenas empresas</h1>
              <p className="sub">Chatbots de atendimento, captação de leads, marcações, integrações e workflows — tudo pronto em minutos.</p>
              <div className="cta">
                <a className="btn" href="/login">Começar agora</a>
                <a className="btn ghost" href="#planos">Ver planos</a>
              </div>
              <ul className="bullets">
                <li>Sem código • configuração guiada</li>
                <li>Pagamentos Stripe • cancelamento a qualquer momento</li>
                <li>Suporte por Email/WhatsApp</li>
              </ul>
            </div>
            <div className="col preview">
              <div className="glass">
                <div className="kpi">
                  <div><b>+37%</b><span>Leads</span></div>
                  <div><b>-62%</b><span>Tempo de resposta</span></div>
                  <div><b>24/7</b><span>Atendimento</span></div>
                </div>
                <div className="mock"></div>
              </div>
            </div>
          </div>
        </section>

        <section id="servicos" className="section">
          <div className="wrap">
            <h2>O que inclui</h2>
            <div className="grid3">
              <div className="card">
                <div className="ico">💬</div>
                <h3>Chatbots de Atendimento</h3>
                <p>Respostas instantâneas, FAQs, horários, morada e encaminhamento para humano.</p>
              </div>
              <div className="card">
                <div className="ico">🎯</div>
                <h3>Captação de Leads</h3>
                <p>Formulários inteligentes, qualificação automática e envio para email/CRM/WhatsApp.</p>
              </div>
              <div className="card">
                <div className="ico">📅</div>
                <h3>Marcações & Reservas</h3>
                <p>Integração com Google Calendar, Calendly e sistemas de reservas.</p>
              </div>
              <div className="card">
                <div className="ico">⚙️</div>
                <h3>Automação Operacional</h3>
                <p>Emails, lembretes de pagamento, rascunhos de fatura e atualização de sheets.</p>
              </div>
              <div className="card">
                <div className="ico">🔌</div>
                <h3>Integrações</h3>
                <p>WhatsApp, Gmail, Google Sheets, Meta, WordPress, Shopify e mais.</p>
              </div>
              <div className="card">
                <div className="ico">📚</div>
                <h3>Formação & Suporte</h3>
                <p>Documentação simples e suporte por email/WhatsApp.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="planos" className="section planos">
          <div className="wrap">
            <h2>Planos simples, sem complicações</h2>
            <div className="grid3">
              <div className="card plan">
                <div className="plan-name">Starter</div>
                <div className="price"><span>€</span>80<span>/mês</span></div>
                <ul>
                  <li>1 chatbot + 1 formulário</li>
                  <li>Marcações básicas</li>
                  <li>Email/WhatsApp de suporte</li>
                </ul>
                <button className="btn wfull" onClick={() => startCheckout('starter')}>Escolher Starter</button>
              </div>
              <div className="card plan featured">
                <div className="badge">Mais popular</div>
                <div className="plan-name">Pro</div>
                <div className="price"><span>€</span>150<span>/mês</span></div>
                <ul>
                  <li>3 chatbots + 3 formulários</li>
                  <li>Marcações avançadas</li>
                  <li>Integrações Zapier/Make</li>
                </ul>
                <button className="btn wfull" onClick={() => startCheckout('pro')}>Escolher Pro</button>
              </div>
              <div className="card plan">
                <div className="plan-name">Business</div>
                <div className="price"><span>€</span>300<span>/mês</span></div>
                <ul>
                  <li>Tudo do Pro sem limites</li>
                  <li>Onboarding assistido</li>
                  <li>SLAs de suporte</li>
                </ul>
                <button className="btn wfull" onClick={() => startCheckout('business')}>Escolher Business</button>
              </div>
            </div>
            <p className="disclaimer">Cobrança feita via Stripe. Podes cancelar quando quiseres.</p>
          </div>
        </section>

        <section id="contacto" className="section contacto">
          <div className="wrap grid2">
            <div>
              <h2>Fala connosco</h2>
              <p>Preferes ver ao vivo? Entramos contigo numa chamada curta e deixamos tudo a funcionar.</p>
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

      <footer className="nf-footer">
        <div className="wrap">
          <div>© {new Date().getFullYear()} NextFlow AI — Pequenas empresas, grande automação.</div>
          <div className="links">
            <a href="/login">Área do cliente</a>
            <a href="#planos">Planos</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        :root{
          --bg:#0b1220; --fg:#e2e8f0; --muted:#94a3b8;
          --card: linear-gradient(180deg,rgba(30,41,59,.35),rgba(2,6,23,.35));
          --stroke: rgba(148,163,184,.2);
          --brand:#7c3aed;
          --brand2:#22d3ee;
        }
        *{box-sizing:border-box}
        body{background:var(--bg);color:var(--fg);margin:0;font-family:system-ui,Segoe UI,Roboto,sans-serif}
        a{color:inherit;text-decoration:none}
        .wrap{max-width:1100px;margin:0 auto;padding:0 24px}
        .btn{display:inline-block;padding:12px 16px;border-radius:12px;border:1px solid var(--stroke);background:rgba(255,255,255,.06)}
        .btn.small{padding:8px 12px;border-radius:10px;font-size:14px}
        .btn.ghost{background:transparent;border-style:dashed}
        .btn.wfull{display:block;text-align:center}
        .nf-header{position:sticky;top:0;backdrop-filter:saturate(160%) blur(8px);background:rgba(11,18,32,.6);border-bottom:1px solid rgba(148,163,184,.08);z-index:20}
        .nf-header .wrap{display:flex;align-items:center;justify-content:space-between;height:64px}
        .brand{display:flex;align-items:center;gap:10px;font-weight:700}
        .brand .logo{width:28px;height:28px;border-radius:8px;background:radial-gradient(120% 120% at 0% 0%,var(--brand) 0%,var(--brand2) 100%);display:grid;place-items:center;font-size:14px}
        .nav{display:flex;gap:16px;align-items:center}
        .hero{padding:56px 0 24px;background:
          radial-gradient(60% 50% at 20% 0%,rgba(124,58,237,.35),transparent 60%),
          radial-gradient(50% 40% at 80% 0%,rgba(34,211,238,.25),transparent 60%)}
        h1{font-size:44px;line-height:1.1;margin:0 0 12px}
        .sub{color:var(--muted);font-size:18px;margin:0 0 18px}
        .cta{display:flex;gap:10px;margin-bottom:14px}
        .bullets{margin:0;padding-left:18px;color:var(--muted)}
        .bullets li{margin:4px 0}
        .grid2{display:grid;grid-template-columns:1.1fr .9fr;gap:20px}
        .grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}
        @media (max-width:900px){.grid2,.grid3{grid-template-columns:1fr} .nf-header .nav a:not(.btn){display:none}}
        .glass{background:var(--card);border:1px solid var(--stroke);border-radius:16px;padding:16px;position:relative}
        .kpi{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-bottom:12px}
        .kpi div{background:rgba(255,255,255,.06);border:1px solid var(--stroke);padding:10px;border-radius:12px;text-align:center}
        .kpi b{font-size:18px}
        .kpi span{display:block;color:var(--muted);font-size:12px}
        .mock{height:260px;border-radius:12px;background:
          linear-gradient(180deg,rgba(255,255,255,.06),rgba(255,255,255,0)),
          repeating-linear-gradient(90deg, rgba(148,163,184,.18) 0 1px, transparent 1px 12px);
          border:1px dashed rgba(148,163,184,.25)}
        .section{padding:32px 0}
        h2{font-size:28px;margin:0 0 14px}
        .card{background:var(--card);border:1px solid var(--stroke);border-radius:14px;padding:16px}
        .ico{font-size:24px}
        .planos .plan{position:relative}
        .planos .badge{position:absolute;top:-10px;right:12px;background:#16a34a;color:white;padding:6px 10px;border-radius:999px;font-size:12px;border:1px solid rgba(255,255,255,.25)}
        .plan .plan-name{font-weight:800;margin-bottom:8px}
        .plan .price{font-size:36px;margin:4px 0 10px}
        .plan .price span{font-size:14px;color:var(--muted);margin-left:6px}
        .plan ul{margin:0 0 14px 18px}
        .disclaimer{color:var(--muted);text-align:center;margin-top:12px}
        .contacto .contact-cards{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .link{display:flex;gap:12px;align-items:center}
        .label{font-size:12px;color:var(--muted)}
        .value{font-weight:700}
        .nf-footer{border-top:1px solid rgba(148,163,184,.08);padding:18px 0;color:var(--muted)}
        .nf-footer .wrap{display:flex;justify-content:space-between;align-items:center;gap:12px}
        @media (max-width:700px){.nf-footer .wrap{flex-direction:column;align-items:flex-start}}
      `}</style>
    </>
  )
}

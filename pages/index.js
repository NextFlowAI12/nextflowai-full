
import Link from 'next/link';
export default function Home(){
  return (
    <div>
      <div className="nav">
        <div className="container nav-inner">
          <div className="logo">
            <img src="/logo.svg" alt="NextFlow logo"/><div>NextFlow AI</div>
          </div>
          <div className="nav-links">
            <a href="#servicos">Serviços</a>
            <a href="#industrias">Indústrias</a>
            <a href="#planos">Planos</a>
            <a href="#contacto">Contacto</a>
            <Link className="btn secondary" href="/login">Entrar</Link>
            <Link className="btn" href="/dashboard">Dashboard</Link>
          </div>
        </div>
      </div>
      <header className="container hero">
        <div className="kicker">Automação prática • Resultados reais</div>
        <h1>IA que <b>traz clientes</b> e corta tarefas repetitivas.</h1>
        <p>Chatbots de atendimento, captação de leads, marcações e automações. Instalação rápida, sem fidelização, suporte por WhatsApp/email.</p>
        <div className="actions">
          <a className="btn" href="#planos">Começar agora</a>
          <a className="btn secondary" href="#servicos">Ver serviços</a>
        </div>
      </header>
      <section id="servicos" className="container section">
        <h2 className="h2">O que fazemos</h2>
        <div className="grid grid-3">
          {[
            ['🤖','Chatbots de Atendimento','Respostas instantâneas, FAQs, horários, morada e encaminhamento para humano.'],
            ['🎯','Captação de Leads','Formulários inteligentes, qualificação automática e envio para email/CRM/WhatsApp.'],
            ['📆','Marcações & Reservas','Integração com Google Calendar, Calendly e sistemas de reservas.'],
            ['⚙️','Automação Operacional','Emails, lembretes de pagamento, rascunhos de fatura e atualização de sheets.'],
            ['🔌','Integrações','WhatsApp, Gmail, Google Sheets, Meta, WordPress, Shopify e mais.'],
            ['📚','Formação & Suporte','Documentação simples e suporte por email/WhatsApp.']
          ].map((i,idx)=>(
            <div key={idx} className="card">
              <div className="badge"><span>{i[0]}</span> Requer plano ativo</div>
              <div className="title" style={{marginTop:8}}>{i[1]}</div>
              <p style={{color:'#cbd5e1'}}>{i[2]}</p>
            </div>
          ))}
        </div>
      </section>
      <section id="industrias" className="container section">
        <h2 className="h2">Feito para pequenos negócios</h2>
        <div className="list-min" style={{marginBottom:10}}>
          {['Cafés & Pastelarias','Restaurantes','Lojas de Roupa','Barbearias & Cabeleireiros','Clínicas Dentárias','Oficinas Auto','Ginásios & Estúdios','Imobiliárias Locais','Hotéis & Alojamentos','Mercearias & Minimercados'].map((t,i)=>(
            <span key={i} className="chip">{t}</span>
          ))}
        </div>
        <div className="small">Outros setores sob consulta.</div>
      </section>
      <section id="planos" className="container section pricing">
        <h2 className="h2">Planos simples</h2>
        <div className="grid grid-3">
          {[
            {t:'Starter',p:'€99/mês',k:'STARTER',feats:['Chatbot básico','Leads por email','Integração simples']},
            {t:'Pro',p:'€299/mês',k:'PRO',feats:['Chatbot avançado','Leads → CRM/WhatsApp','Marcações & Reservas','Automações core']},
            {t:'Business',p:'€699/mês',k:'BUSINESS',feats:['Tudo do Pro','Integrações custom','SLA & suporte prioritário']},
          ].map((pl,idx)=>(
            <div key={idx} className={"card plan " + (pl.t==='Pro'?'pro':'')}>
              {pl.t==='Pro' && <div className="ribbon">Mais escolhido</div>}
              <div className="title">{pl.t}</div>
              <div className="price">{pl.p}</div>
              <div style={{margin:'8px 0 12px'}}>
                {pl.feats.map((f,i)=>(<div className="feat" key={i}>✅ {f}</div>))}
              </div>
              <Link className="btn" href="/login">Escolher {pl.t}</Link>
            </div>
          ))}
        </div>
        <p className="small" style={{marginTop:8}}>Sem fidelização. Checkout seguro via Stripe.</p>
      </section>
      <section id="contacto" className="container section">
        <h2 className="h2">Contacto</h2>
        <div className="grid grid-2">
          <div className="card">
            <div className="title">Fala connosco</div>
            <p>📞 <a href="tel:+351916053688">+351 916 053 688</a></p>
            <p>✉️ <a href="mailto:nextflowai12@gmail.com">nextflowai12@gmail.com</a></p>
            <p className="small">Resposta em 24h úteis.</p>
          </div>
          <div className="card">
            <div className="title">Como começamos</div>
            <p className="small">1) Encontro rápido (15min) · 2) Plano escolhido · 3) Setup em 48–72h.</p>
            <div className="actions"><a className="btn" href="#planos">Começar</a><Link className="btn secondary" href="/login">Entrar</Link></div>
          </div>
        </div>
      </section>
      <footer className="footer">© {new Date().getFullYear()} NextFlow AI</footer>
    </div>
  );
}

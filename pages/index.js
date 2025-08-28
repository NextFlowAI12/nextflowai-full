import Head from 'next/head'

export default function Home(){
  return (
    <>
      <Head>
        <title>NextFlow AI — Automação para PMEs</title>
        <meta name="description" content="Chatbots, leads, marcações e integrações." />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <main className="wrap">
        <h1>NextFlow AI</h1>
        <p>Automação que traz clientes, não trabalho extra.</p>
        <section id="planos">
          <h2>Planos</h2>
          <ul>
            <li>Starter — €80/mês</li>
            <li>Pro — €150/mês</li>
            <li>Business — €300/mês</li>
          </ul>
        </section>
      </main>
    </>
  )
}

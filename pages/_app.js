
import Head from 'next/head';
import '../styles/styles.css';
export default function MyApp({ Component, pageProps }){
  return (<>
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>NextFlow AI — Automação para pequenos negócios</title>
      <meta name="description" content="Chatbots, leads, marcações, automações e integrações. Rápido de instalar, preço claro, suporte próximo." />
      <link rel="icon" href="/logo.svg" />
    </Head>
    <Component {...pageProps} />
  </>);
}

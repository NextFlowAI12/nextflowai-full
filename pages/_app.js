// _app.js com ErrorBoundary para evitar ecrã branco
import '../styles/globals.css';
import '../styles/styles.css';
import React, { useEffect } from 'react';

function ErrorFallback({ error }){
  useEffect(()=>{
    if(error) console.error('App crash:', error);
  }, [error]);
  return (
    <div className="container section">
      <div className="card" style={{borderColor:'rgba(248,113,113,.35)'}}>
        <div className="title">Ocorreu um erro no carregamento</div>
        <p className="small">Tenta recarregar a página. Se continuar, envia esta mensagem ao suporte:</p>
        <pre style={{whiteSpace:'pre-wrap', background:'rgba(2,6,23,.35)', padding:10, borderRadius:10, fontSize:12}}>{String(error && (error.stack || error.message || error))}</pre>
      </div>
    </div>
  );
}

class ErrorBoundary extends React.Component{
  constructor(props){
    super(props);
    this.state = { hasError:false, error:null };
  }
  static getDerivedStateFromError(error){ return { hasError:true, error }; }
  componentDidCatch(error, info){ console.error('ErrorBoundary', error, info); }
  render(){
    if(this.state.hasError){ return <ErrorFallback error={this.state.error} />; }
    return this.props.children;
  }
}

export default function MyApp({ Component, pageProps }){
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}

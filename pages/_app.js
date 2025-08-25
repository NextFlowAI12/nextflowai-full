// Minimal _app.js to ensure pages render and styles load
import '../styles/globals.css';
import '../styles/styles.css';

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

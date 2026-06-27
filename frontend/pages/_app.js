import '../styles/globals.css';
import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import WhatsAppFloat from '../components/ui/WhatsAppFloat';
import CartDrawer from '../components/cart/CartDrawer';
import { useStore } from '../store';
import siteConfig from '../config';
import { settingsAPI } from '../lib/api';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <p>Something went wrong.</p>
            <button onClick={() => this.setState({ hasError: false, error: null })}>Try again</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function MyApp({ Component, pageProps }) {
  const { isCartOpen, setCartOpen } = useStore();
  const [favicon, setFavicon] = useState('/favicon.svg');

  useEffect(() => {
    settingsAPI.get().then(res => {
      if (res.settings?.favicon?.url) setFavicon(res.settings.favicon.url);
    }).catch(() => {});
  }, []);

  const getLayout = Component.getLayout || ((page) => page);

  return (
    <>
      <Head>
        <title>{siteConfig.name}</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" type="image/svg+xml" href={favicon} />
      </Head>
      <ErrorBoundary>
        {getLayout(
          <>
            <Header />
            <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
            <WhatsAppFloat />
            <main style={{ minHeight: '100vh' }}>
              <Component {...pageProps} />
            </main>
            <Footer />
          </>
        )}
      </ErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: '#0F172A', color: '#fff', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', fontWeight: 500 },
          success: { iconTheme: { primary: '#006989', secondary: '#fff' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }}
      />
    </>
  );
}

export default MyApp;

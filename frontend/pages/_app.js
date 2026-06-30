import '../styles/globals.css';
import React, { useState, useEffect } from 'react';
import App from 'next/app';
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

function MyApp({ Component, pageProps, favicon: initialFavicon }) {
  const { isCartOpen, setCartOpen } = useStore();
  const [favicon, setFavicon] = useState(initialFavicon || '/favicon.svg');

  const getFaviconUrl = (settings) => {
    const fav = settings?.favicon;
    if (!fav) return null;
    return typeof fav === 'string' ? fav : fav?.url || null;
  };

  useEffect(() => {
    settingsAPI.get().then(res => {
      const fav = getFaviconUrl(res?.settings);
      if (fav) setFavicon(fav);
    }).catch(() => {});
  }, []);

  // Helper to determine mime type from url
  const mimeFor = (url) => {
    if (!url) return 'image/png';
    const u = url.split('?')[0].toLowerCase();
    if (u.endsWith('.svg')) return 'image/svg+xml';
    if (u.endsWith('.png')) return 'image/png';
    if (u.endsWith('.jpg') || u.endsWith('.jpeg')) return 'image/jpeg';
    if (u.endsWith('.webp')) return 'image/webp';
    return 'image/png';
  };

  const getLayout = Component.getLayout;
  const router = useRouter();
  const isPortalRoute = typeof window !== 'undefined' && router?.pathname?.startsWith('/portal');

  // If page is a portal/admin route, render it without the global Header/Footer
  if (isPortalRoute || getLayout) {
    return (
      <>
        <Head>
          <title>Admin — Alpha iStore</title>
          <meta name="viewport" content="width=device-width,initial-scale=1" />
          <link rel="icon" href={favicon} />
          <link rel="apple-touch-icon" href={favicon.endsWith('.png') ? favicon : '/favicon-180.png'} />
          <link rel="icon" type={mimeFor(favicon)} sizes="32x32" href={favicon.endsWith('.png') ? favicon : '/favicon-32.png'} />
        </Head>
        {getLayout ? getLayout(<Component {...pageProps} />) : <Component {...pageProps} />}
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: '#0F172A', color: '#fff', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', fontWeight: 500 }, success: { iconTheme: { primary: '#006989', secondary: '#fff' } }, error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } } }} />
      </>
    );
  }

  // Regular pages get Header/Footer
  return (
    <>
      <Head>
        <title>Alpha iStore</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href={favicon} />
        <link rel="apple-touch-icon" href={favicon.endsWith('.png') ? favicon : '/favicon-180.png'} />
        <link rel="icon" type={mimeFor(favicon)} sizes="32x32" href={favicon.endsWith('.png') ? favicon : '/favicon-32.png'} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </Head>
      <ErrorBoundary>
        <>
          <Header />
          <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
          <WhatsAppFloat />
          <main style={{ minHeight: '100vh' }}>
            <Component {...pageProps} />
          </main>
          <Footer />
        </>
      </ErrorBoundary>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: '#0F172A', color: '#fff', borderRadius: '12px', padding: '12px 16px', fontSize: '14px', fontWeight: 500 }, success: { iconTheme: { primary: '#006989', secondary: '#fff' } }, error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } } }} />
    </>
  );
}

MyApp.getInitialProps = async (appContext) => {
  const appProps = await App.getInitialProps(appContext);
  let initialFavicon = '/favicon.svg';

  try {
    const res = await settingsAPI.get();
    const fav = typeof res?.settings?.favicon === 'string'
      ? res.settings.favicon
      : res?.settings?.favicon?.url || null;
    if (fav) initialFavicon = fav;
  } catch (error) {
    // Keep default favicon if API call fails during SSR
  }

  return { ...appProps, favicon: initialFavicon };
};

export default MyApp;

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
import { AuthProvider } from '../hooks/useAuth';
import siteConfig from '../config';
import { settingsAPI } from '../lib/api';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface-muted px-4">
          <div className="text-center">
            <p className="text-sm font-medium text-ink">Something went wrong.</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="mt-3 text-sm font-medium text-primary hover:text-primary-dark"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function MyApp({ Component, pageProps }) {
  const { isCartOpen, setCartOpen, setToken, fetchUser, token, isDarkMode } = useStore();
  const router = useRouter();
  const [favicon, setFavicon] = useState('/favicon.svg');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('authToken');
      if (storedToken && storedToken !== token) {
        setToken(storedToken);
        fetchUser();
      }
    }
  }, []);

  useEffect(() => {
    settingsAPI.get().then(res => {
      if (res.settings?.favicon?.url) {
        setFavicon(res.settings.favicon.url);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const handleRouteChange = () => setCartOpen(false);
    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router.events, setCartOpen]);

  const showLayout = !['/auth/login', '/auth/signup', '/404'].some((path) =>
    router.pathname.startsWith(path)
  ) && !router.pathname.startsWith('/admin');

  return (
    <AuthProvider>
      <Head>
        <title>{siteConfig.name}</title>
        <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
        <meta name="theme-color" content={siteConfig.themeColor} />
        <link rel="icon" type="image/svg+xml" href={favicon} />
      </Head>
      <ErrorBoundary>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0F172A',
              color: '#fff',
              borderRadius: '10px',
              fontSize: '14px',
            },
          }}
        />
        <div className="flex flex-col min-h-screen">
          {showLayout && <Header />}
          <main className="flex-1">
            <Component {...pageProps} />
          </main>
          {showLayout && <Footer />}

          {showLayout && <WhatsAppFloat />}
          {showLayout && isCartOpen && (
            <CartDrawer
              isOpen={isCartOpen}
              onClose={() => setCartOpen(false)}
            />
          )}
        </div>
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default MyApp;
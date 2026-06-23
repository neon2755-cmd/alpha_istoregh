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
import { useSettings } from '../hooks/useSettings';

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
        <div className="min-h-screen flex items-center justify-center bg-surface-muted px-4">
          <div className="text-center">
            <p className="text-sm font-medium text-ink">Something went wrong.</p>
            <p className="text-xs text-ink-muted mt-2">{this.state.error?.message || 'Unknown error'}</p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
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
      if (storedToken) {
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

  return (
    <>
      <Head>
        <title>{siteConfig.name}</title>
        <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
        <meta name="theme-color" content={siteConfig.themeColor} />
        <meta name="google-site-verification" content="2ca66316d64c2a1a" />
        <link rel="icon" type="image/svg+xml" href={favicon} />
      </Head>
      <ErrorBoundary>
        <AuthProvider>
          <Header />
          <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
          <WhatsAppFloat />
          <main className="min-h-screen bg-background">
            <Component {...pageProps} />
          </main>
          <Footer />
        </AuthProvider>
      </ErrorBoundary>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#0F172A',
            color: '#fff',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '14px',
            fontWeight: 500,
          },
          success: { iconTheme: { primary: '#006989', secondary: '#fff' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }}
      />
    </>
  );
}

export default MyApp;

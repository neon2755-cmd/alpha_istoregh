import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../../store';
import { authAPI } from '../../lib/api';

const inputClass =
  'w-full h-11 pl-10 pr-3 text-sm bg-white border border-surface-border rounded-xl text-ink placeholder:text-ink-subtle focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-shadow';

export default function Login() {
  const router = useRouter();
  const setUser = useStore((s) => s.setUser);
  const setToken = useStore((s) => s.setToken);
  const fetchUser = useStore((s) => s.fetchUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { google_auth } = router.query;
    if (google_auth === 'success') {
      toast.success('Logged in with Google!');
      router.replace('/');
    }
    if (router.query.error === 'google_failed') {
      toast.error('Google login was cancelled or failed');
      router.replace('/auth/login');
    }
  }, [router.query]);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      fetchUser().then(() => {
        router.replace('/');
      });
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const data = await authAPI.login({ email: cleanEmail, password: cleanPassword });
      setToken(data.token);
      setUser(data.user);
      toast.success(`Welcome back, ${data.user.firstName || 'there'}!`);
      router.push(data.user.role === 'admin' ? '/portal' : '/');
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign in — AlphaiStore</title>
      </Head>

      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-surface-muted px-4 py-12">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm rounded-2xl border border-surface-border bg-white p-8"
        >
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary-50 text-primary mx-auto mb-4">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold tracking-tightish text-ink text-center">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-ink-muted text-center">
            Sign in to continue.
          </p>

          <a
            href="/api/auth/google"
            className="inline-flex w-full h-11 items-center justify-center gap-2 rounded-xl border border-surface-border bg-white text-ink text-sm font-semibold hover:bg-surface-muted transition-colors mb-5"
          >
            <img src="https://www.google.com/favicon.ico" width="18" height="18" alt="Google" />
            Continue with Google
          </a>

          <div className="mt-1 space-y-4">
            <div className="relative">
              <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none" />
              <input
                type={showPw ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Password"
                className={`${inputClass} pr-10`}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center text-ink-subtle hover:text-ink"
              >
                {showPw ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          <div className="mt-2 text-right">
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-primary hover:text-primary-dark"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full h-11 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark disabled:opacity-60 shadow-smooth"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="mt-6 text-center text-sm text-ink-muted">
            Don't have an account?{' '}
            <Link
              href="/auth/signup"
              className="font-medium text-primary hover:text-primary-dark"
            >
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
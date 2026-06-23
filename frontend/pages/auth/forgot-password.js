import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Mail } from 'lucide-react';

const inputClass =
  'w-full h-11 pl-10 pr-3 text-sm bg-white border border-surface-border rounded-xl text-ink placeholder:text-ink-subtle focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-shadow';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success('Password reset link sent to your email!');
    setLoading(false);
    router.push('/auth/login');
  };

  return (
    <>
      <Head>
        <title>Forgot password — AlphaiStore</title>
      </Head>

      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-surface-muted px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-2xl border border-surface-border bg-white p-8"
        >
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary-50 text-primary mx-auto mb-4">
            <Mail className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold tracking-tightish text-ink text-center">
            Reset your password
          </h1>
          <p className="mt-1 text-sm text-ink-muted text-center">
            Enter your email and we'll send you a reset link.
          </p>

          <div className="mt-6 space-y-4">
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full h-11 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark disabled:opacity-60 shadow-smooth"
          >
            {loading ? 'Sending…' : 'Send reset link'}
          </button>

          <p className="mt-6 text-center text-sm text-ink-muted">
            Remember your password?{' '}
            <Link
              href="/auth/login"
              className="font-medium text-primary hover:text-primary-dark"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </>
  );
}
import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Mail, Lock } from 'lucide-react';
import { authAPI } from '../../lib/api';

const inputClass =
  'w-full h-11 pl-10 pr-3 text-sm bg-white border border-surface-border rounded-xl text-ink placeholder:text-ink-subtle focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-shadow';

export default function ResetPassword() {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await authAPI.resetPassword(token, password);
      toast.success('Password reset! You can now log in.');
      router.push('/auth/login');
    } catch {
      toast.error('Invalid or expired reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Reset password — AlphaiStore</title>
      </Head>

      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-surface-muted px-4 py-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-2xl border border-surface-border bg-white p-8"
        >
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary-50 text-primary mx-auto mb-4">
            <Lock className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold tracking-tightish text-ink text-center">
            Set new password
          </h1>
          <p className="mt-1 text-sm text-ink-muted text-center">
            Choose a strong password for your account.
          </p>

          <div className="mt-6 space-y-4">
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="New password"
                className={inputClass}
                minLength={6}
              />
            </div>
            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none" />
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                placeholder="Confirm new password"
                className={inputClass}
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full h-11 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark disabled:opacity-60 shadow-smooth"
          >
            {loading ? 'Resetting…' : 'Reset password'}
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
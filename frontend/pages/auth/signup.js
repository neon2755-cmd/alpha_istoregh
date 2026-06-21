import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { UserPlus, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react';
import { useStore } from '../../store';
import { authAPI } from '../../lib/api';

const inputClass =
  'w-full h-11 pl-10 pr-3 text-sm bg-white border border-surface-border rounded-xl text-ink placeholder:text-ink-subtle focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-shadow';

const inputClassNoIcon =
  'w-full h-11 pl-3 pr-3 text-sm bg-white border border-surface-border rounded-xl text-ink placeholder:text-ink-subtle focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-shadow';

export default function Signup() {
  const router = useRouter();
  const setUser = useStore((s) => s.setUser);
  const setToken = useStore((s) => s.setToken);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.email || !form.password) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const data = await authAPI.register(form);
      setToken(data.token);
      setUser(data.user);
      toast.success('Account created');
      router.push('/');
    } catch (error) {
      toast.error(error.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign up — AlphaiStore</title>
      </Head>

      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-surface-muted px-4 py-12">
        <form
          onSubmit={handleSignup}
          className="w-full max-w-sm rounded-2xl border border-surface-border bg-white p-8"
        >
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary-50 text-primary mx-auto mb-4">
            <UserPlus className="h-5 w-5" />
          </div>
          <h1 className="text-xl font-semibold tracking-tightish text-ink text-center">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-ink-muted text-center">
            Sign up to track orders and check out faster.
          </p>

          <div className="mt-6 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <User className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none" />
                <input
                  placeholder="First name"
                  value={form.firstName}
                  onChange={set('firstName')}
                  required
                  className={inputClass}
                />
              </div>
              <div className="relative">
                <input
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={set('lastName')}
                  className={inputClassNoIcon}
                />
              </div>
            </div>

            <div className="relative">
              <Mail className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none" />
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={set('email')}
                required
                className={inputClass}
              />
            </div>

            <div className="relative">
              <Phone className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none" />
              <input
                placeholder="+233 XX XXX XXXX"
                value={form.phone}
                onChange={set('phone')}
                className={inputClass}
              />
            </div>

            <div className="relative">
              <Lock className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle pointer-events-none" />
              <input
                type={showPw ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={set('password')}
                required
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

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full h-11 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark disabled:opacity-60 shadow-smooth"
          >
            {loading ? 'Creating…' : 'Create account'}
          </button>

          <p className="mt-6 text-center text-sm text-ink-muted">
            Already have an account?{' '}
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
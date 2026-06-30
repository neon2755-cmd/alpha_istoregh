import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import AdminLayout from '../../components/portal/AdminLayout';
import { authAPI } from '../../lib/api';
import { useAdminAuthStore } from '../../store/adminAuth';
import toast from 'react-hot-toast';
import PasswordInput from '../../components/ui/PasswordInput';

export default function AdminLogin() {
  const router = useRouter();
  const login = useAdminAuthStore((s) => s.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await authAPI.login({ email, password });
      if (!data.success) {
        setError(data.message || 'Invalid credentials');
        toast.error('Invalid credentials');
        setLoading(false);
        return;
      }

      if (data.user.role !== 'admin') {
        setError('Access denied. Admin only.');
        toast.error('Access denied');
        setLoading(false);
        return;
      }

      login({ email: data.user.email, name: 'Administrator', token: data.token });
      localStorage.setItem('authToken', data.token);
      toast.success('Welcome back, Admin!');
      router.push('/portal');
    } catch (err) {
      setError('Login failed. Please try again.');
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout title="Admin Login" subtitle="Sign in to access the admin panel" hideSidebar>
      <div className="max-w-md mx-auto">
        <div className="rounded-3xl border border-surface-border bg-white p-8 shadow-sm">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mx-auto mb-6">
            <Lock className="h-8 w-8" />
          </div>

          <h2 className="text-2xl font-bold text-ink text-center mb-2">Welcome Back</h2>
          <p className="text-sm text-ink-muted text-center mb-8">Enter your credentials to access the admin panel</p>

          {error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 text-red-600 text-sm font-medium mb-6">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-subtle mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-surface-muted border border-transparent text-ink placeholder:text-ink-subtle focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all"
                  placeholder="admin@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-ink-subtle mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ink-muted" />
                <PasswordInput
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-xl bg-surface-muted border border-transparent text-ink placeholder:text-ink-subtle focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-xl bg-primary text-white font-bold hover:bg-primary-dark transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-sm font-medium text-primary hover:text-primary-dark">
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

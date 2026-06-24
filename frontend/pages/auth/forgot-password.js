import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { authAPI } from '../../lib/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent! Check your email.');
    } catch (err) {
      toast.error(err?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Forgot Password — Alpha iStore</title></Head>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#f8fafc' }}>
        <div style={{ width: '100%', maxWidth: '400px', background: '#fff', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Forgot Password</h1>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <p style={{ color: '#16a34a', fontWeight: 600, marginBottom: '16px' }}>Reset link sent to {email}</p>
              <p style={{ color: '#64748b', fontSize: '14px' }}>Check your inbox and click the link to reset your password.</p>
              <Link href="/auth/login" style={{ display: 'inline-block', marginTop: '24px', color: '#006989', fontWeight: 600 }}>Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '24px' }}>Enter your email and we will send you a reset link.</p>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                style={{ width: '100%', height: '44px', padding: '0 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', marginBottom: '16px', boxSizing: 'border-box' }}
              />
              <button
                type="submit"
                disabled={loading}
                style={{ width: '100%', height: '44px', background: '#006989', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
              <Link href="/auth/login" style={{ display: 'block', textAlign: 'center', marginTop: '16px', color: '#006989', fontSize: '13px', fontWeight: 600 }}>Back to Login</Link>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

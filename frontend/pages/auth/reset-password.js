import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { authAPI } from '../../lib/api';

export default function ResetPassword() {
  const router = useRouter();
  const { token, email } = router.query;
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) { toast.error('Passwords do not match'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      await authAPI.resetPassword({ token, email, password });
      toast.success('Password reset! Please log in.');
      router.push('/auth/login');
    } catch (err) {
      toast.error(err?.message || 'Reset failed. Link may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>Reset Password — Alpha iStore</title></Head>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', background: '#f8fafc' }}>
        <div style={{ width: '100%', maxWidth: '400px', background: '#fff', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Reset Password</h1>
          <form onSubmit={handleSubmit}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>New Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="Min 6 characters" style={{ width: '100%', height: '44px', padding: '0 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box' }} />
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Confirm Password</label>
            <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" style={{ width: '100%', height: '44px', padding: '0 14px', border: '1px solid #e2e8f0', borderRadius: '10px', fontSize: '14px', marginBottom: '16px', boxSizing: 'border-box' }} />
            <button type="submit" disabled={loading} style={{ width: '100%', height: '44px', background: '#006989', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { CheckCircle2, ShieldCheck, XCircle } from 'lucide-react';
import { ordersAPI } from '../lib/api';
import siteConfig from '../config';
import { formatPrice } from '../lib/utils';

export default function VerifyReceipt() {
  const router = useRouter();
  const { token } = router.query;
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('Verifying receipt authenticity...');
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (!token) return;
    const verify = async () => {
      setStatus('loading');
      setMessage('Verifying receipt authenticity...');
      try {
        const res = await ordersAPI.verifyReceipt(token);
        const verifiedOrder = res.order || res.data?.order || res;
        setOrder(verifiedOrder);
        setStatus('success');
        setMessage('Receipt authenticity verified successfully.');
      } catch (err) {
        const errMsg = err.response?.data?.message || err.message || 'Unable to verify receipt authenticity.';
        setStatus('error');
        setMessage(errMsg);
      }
    };
    verify();
  }, [token]);

  const title = status === 'success' ? 'Receipt Verified' : status === 'error' ? 'Verification Failed' : 'Verifying Receipt';
  const iconClass = status === 'success' ? 'text-green-600' : status === 'error' ? 'text-red-600' : 'text-slate-600';

  return (
    <>
      <Head>
        <title>{title} — AlphaiStore</title>
      </Head>

      <main className="min-h-screen bg-surface-muted px-4 py-10 text-ink">
        <div className="mx-auto max-w-3xl rounded-3xl border border-surface-border bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center gap-5 text-center">
            <div className={`inline-flex h-16 w-16 items-center justify-center rounded-full bg-surface-muted ${iconClass}`}>
              {status === 'success' ? (
                <CheckCircle2 className="h-10 w-10" />
              ) : status === 'error' ? (
                <XCircle className="h-10 w-10" />
              ) : (
                <ShieldCheck className="h-10 w-10 animate-pulse" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-ink-subtle">
                Receipt authenticity
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-ink">{title}</h1>
              <p className="mt-3 max-w-xl text-sm leading-6 text-ink-muted">{message}</p>
            </div>
          </div>

          {status === 'success' && order && (
            <div className="mt-10 rounded-3xl bg-surface-muted p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-ink-subtle">Order Number</p>
                  <p className="mt-2 text-lg font-semibold text-ink">#{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-ink-subtle">Order Status</p>
                  <p className="mt-2 text-lg font-semibold text-ink capitalize">{order.status}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-ink-subtle">Order Date</p>
                  <p className="mt-2 text-lg font-semibold text-ink">
                    {new Date(order.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-ink-subtle">Amount</p>
                  <p className="mt-2 text-lg font-semibold text-ink">{formatPrice(order.total)}</p>
                </div>
              </div>

              <div className="mt-8 border-t border-surface-border pt-6 text-sm text-ink-muted">
                <p>This receipt is signed with a secure verification token and matches the order data stored in our system.</p>
                <p className="mt-3">If you have any doubts, contact support at <a className="text-primary" href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.</p>
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <a
                  href={`/order-receipt?order=${order.orderNumber}`}
                  className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-dark"
                >
                  View original receipt
                </a>
                <p className="text-xs text-ink-subtle">Presented by {siteConfig.name}</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-10 rounded-3xl bg-red-50 p-6 text-sm text-red-700">
              <p>If you scanned this QR code from a printed receipt, it may be invalid or expired.</p>
              <p className="mt-3">Please verify that the URL includes the full token and try again.</p>
              <p className="mt-3">For support, contact <a className="font-semibold text-red-900" href={`mailto:${siteConfig.contact.email}`}>{siteConfig.contact.email}</a>.</p>
            </div>
          )}

          {!token && (
            <div className="mt-10 rounded-3xl bg-yellow-50 p-6 text-sm text-amber-800">
              <p>Verification token missing. Open the link again from the QR code or ask the receipt issuer for support.</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}

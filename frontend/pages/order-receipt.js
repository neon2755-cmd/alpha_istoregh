import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ordersAPI } from '../lib/api';
import { formatPrice } from '../lib/utils';
import siteConfig from '../config';

export default function OrderReceipt() {
  const router = useRouter();
  const { order: orderNum } = router.query;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNum) return;
    const fetchOrder = async () => {
      try {
        const res = await ordersAPI.track(orderNum);
        setOrder(res.data.order);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderNum]);

  useEffect(() => {
    if (order && !loading) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [order, loading]);

  if (loading) return <div className="p-10 text-center">Loading receipt...</div>;
  if (!order) return <div className="p-10 text-center">Order not found.</div>;

  const date = new Date(order.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <>
      <Head>
        <title>Receipt — {order.orderNumber}</title>
        <style>{`
          @media print {
            body { background: white !important; }
            .no-print { display: none !important; }
          }
        `}</style>
      </Head>
      <div className="max-w-3xl mx-auto p-10 bg-white min-h-screen text-ink">
        <div className="flex justify-between items-start border-b border-surface-border pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-ink mb-1">{siteConfig.name}</h1>
            <p className="text-sm text-ink-muted">{siteConfig.contact.address}</p>
            <p className="text-sm text-ink-muted">{siteConfig.contact.phone}</p>
            <p className="text-sm text-ink-muted">{siteConfig.contact.email}</p>
          </div>
          <div className="text-right">
            <h2 className="text-4xl font-light text-primary mb-2 tracking-tight">RECEIPT</h2>
            <p className="text-sm font-semibold">Order #{order.orderNumber}</p>
            <p className="text-sm text-ink-muted">{date}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 mb-10">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-subtle mb-3">Billed To</h3>
            <p className="font-medium text-ink">{order.user?.firstName || order.guestInfo?.firstName} {order.user?.lastName || order.guestInfo?.lastName}</p>
            <p className="text-sm text-ink-muted">{order.user?.email || order.guestInfo?.email}</p>
            <p className="text-sm text-ink-muted">{order.user?.phone || order.guestInfo?.phone}</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-subtle mb-3">Delivery</h3>
            <p className="font-medium text-ink capitalize">{order.delivery?.method}</p>
            <p className="text-sm text-ink-muted">{order.delivery?.address}</p>
            <p className="text-sm text-ink-muted">{order.delivery?.region}</p>
          </div>
        </div>

        <table className="w-full mb-10 text-sm">
          <thead>
            <tr className="border-b border-surface-border">
              <th className="py-3 text-left font-semibold text-ink">Item</th>
              <th className="py-3 text-center font-semibold text-ink">Qty</th>
              <th className="py-3 text-right font-semibold text-ink">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-border">
            {order.items.map((item, i) => (
              <tr key={i}>
                <td className="py-4">
                  <p className="font-medium text-ink">{item.name}</p>
                  <p className="text-xs text-ink-muted mt-0.5">{item.variant?.storage || item.variant?.color}</p>
                </td>
                <td className="py-4 text-center text-ink-muted">{item.quantity}</td>
                <td className="py-4 text-right font-medium text-ink">{formatPrice(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end">
          <div className="w-64 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-ink-muted">Subtotal</span>
              <span className="font-medium text-ink">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">Delivery</span>
              <span className="font-medium text-ink">{order.delivery?.fee === 0 ? 'Free' : formatPrice(order.delivery?.fee)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-status-success">
                <span>Discount</span>
                <span className="font-medium">− {formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-surface-border pt-3 text-base">
              <span className="font-bold text-ink">Total</span>
              <span className="font-bold text-ink">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-surface-border text-center text-sm text-ink-muted">
          <p className="font-medium text-ink mb-1">Thank you for your business!</p>
          <p>If you have any questions about this receipt, please contact us.</p>
        </div>

        <div className="mt-10 text-center no-print">
          <button onClick={() => window.print()} className="h-10 px-6 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark mr-4">
            Print / Save as PDF
          </button>
          <button onClick={() => router.push('/')} className="h-10 px-6 rounded-xl border border-surface-border text-ink text-sm font-medium hover:bg-surface-muted">
            Back to Home
          </button>
        </div>
      </div>
    </>
  );
}

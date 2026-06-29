import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { CheckCircle2, Package, ShoppingBag, Receipt } from 'lucide-react';
import { ordersAPI } from '../lib/api';

export default function OrderConfirm() {
  const router = useRouter();
  const { order } = router.query;
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(Boolean(order));

  useEffect(() => {
    if (!order) return;
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await ordersAPI.track(order);
        setOrderDetails(res.order || res.data?.order || res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [order]);

  return (
    <>
      <Head>
        <title>Order confirmed — AlphaiStore</title>
      </Head>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl border border-surface-border bg-white p-10 text-center">
          <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-status-success">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <h1 className="mt-6 text-2xl md:text-3xl font-semibold tracking-tightish text-ink">
            Order placed
          </h1>
          <p className="mt-2 text-sm text-ink-muted leading-relaxed max-w-md mx-auto">
            Thank you. Your order has been received and is being processed.
            You'll get a WhatsApp confirmation shortly.
          </p>

          {order && (
            <div className="mt-6 rounded-xl bg-primary-50 px-6 py-4 inline-block">
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                Order number
              </p>
              <p className="mt-1 text-lg font-semibold text-primary">
                #{order}
              </p>
            </div>
          )}

          {orderDetails && (
            <div className="mt-6 rounded-2xl border border-surface-border bg-surface-muted/40 px-6 py-5 text-left">
              <p className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">Customer details</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm text-ink">
                <div>
                  <p className="text-ink-subtle">Name</p>
                  <p className="font-medium">{orderDetails.customer?.name || orderDetails.user?.firstName + ' ' + orderDetails.user?.lastName || orderDetails.guestInfo?.name || 'Guest'}</p>
                </div>
                <div>
                  <p className="text-ink-subtle">Contact</p>
                  <p className="font-medium">{orderDetails.customer?.phone || orderDetails.user?.phone || orderDetails.guestInfo?.phone || '—'}</p>
                </div>
                <div>
                  <p className="text-ink-subtle">Email</p>
                  <p className="font-medium">{orderDetails.customer?.email || orderDetails.user?.email || orderDetails.guestInfo?.email || '—'}</p>
                </div>
                <div>
                  <p className="text-ink-subtle">Delivery</p>
                  <p className="font-medium">{orderDetails.delivery?.address || orderDetails.deliveryAddress || '—'}</p>
                </div>
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            {order && (
              <>
                <Link
                  href={`/track?order=${order}`}
                  className="inline-flex h-11 items-center justify-center gap-2 px-5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark shadow-smooth"
                >
                  <Package className="h-4 w-4" />
                  Track my order
                </Link>
                <Link
                  href={`/order-receipt?order=${order}`}
                  className="inline-flex h-11 items-center justify-center gap-2 px-5 rounded-xl border border-primary text-primary text-sm font-medium hover:bg-primary-50"
                >
                  <Receipt className="h-4 w-4" />
                  {loading ? 'Loading receipt…' : 'View receipt'}
                </Link>
              </>
            )}
            <Link
              href="/shop"
              className="inline-flex h-11 items-center justify-center gap-2 px-5 rounded-xl border border-surface-border bg-white text-ink text-sm font-medium hover:bg-surface-muted"
            >
              <ShoppingBag className="h-4 w-4" />
              Continue shopping
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
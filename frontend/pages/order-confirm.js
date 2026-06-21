import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { CheckCircle2, Package, ShoppingBag } from 'lucide-react';

export default function OrderConfirm() {
  const router = useRouter();
  const { order } = router.query;

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
                <button
                  type="button"
                  onClick={() => window.open(`/order-receipt?order=${order}`, '_blank')}
                  className="inline-flex h-11 items-center justify-center gap-2 px-5 rounded-xl border border-primary text-primary text-sm font-medium hover:bg-primary-50"
                >
                  Download receipt
                </button>
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
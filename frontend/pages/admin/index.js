import { useEffect, useState } from 'react';
import Head from 'next/head';
import {
  Package,
  ShoppingCart,
  Wallet,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import AdminLayout from '../../components/admin/AdminLayout';
import { ordersAPI } from '../../lib/api';
import { formatPrice } from '../../lib/utils';
import SkeletonLoader from '../../components/ui/SkeletonLoader';

const cards = [
  { label: 'Orders', valueKey: 'orders', Icon: ShoppingCart, bg: 'bg-blue-50', text: 'text-blue-600' },
  { label: 'Revenue', valueKey: 'revenue', Icon: Wallet, isPrice: true, bg: 'bg-green-50', text: 'text-green-600' },
  { label: 'Products sold', valueKey: 'productsSold', Icon: Package, bg: 'bg-purple-50', text: 'text-purple-600' },
  { label: 'Delivered', valueKey: 'delivered', Icon: CheckCircle2, bg: 'bg-orange-50', text: 'text-orange-600' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await ordersAPI.getStats();
        if (!cancelled) setStats(res.data);
      } catch {
        if (!cancelled) setStats({});
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard — Admin</title>
      </Head>
      <AdminLayout title="Dashboard" subtitle="Overview of your store performance">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map(({ label, valueKey, Icon, isPrice, bg, text }) => (
            <div
              key={label}
              className="rounded-3xl border border-surface-border bg-white p-6 shadow-sm hover:shadow-smooth transition-shadow"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold uppercase tracking-wider text-ink-subtle">
                  {label}
                </p>
                <span className={`h-12 w-12 inline-flex items-center justify-center rounded-2xl ${bg} ${text}`}>
                  <Icon className="h-6 w-6" />
                </span>
              </div>
              {loading ? (
                <SkeletonLoader width="60%" height="32px" className="mt-4" />
              ) : (
                <p className="mt-4 text-3xl font-bold tracking-tight text-ink">
                  {isPrice
                    ? formatPrice(stats?.[valueKey] || 0)
                    : stats?.[valueKey] ?? 0}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="rounded-3xl border border-surface-border bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold tracking-tight text-ink">
                Recent orders
              </h2>
              <a
                href="/admin/orders"
                className="text-sm font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1 bg-primary/5 px-4 py-2 rounded-full transition-colors"
              >
                View all
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
            <div className="py-12 text-center border-2 border-dashed border-surface-border rounded-2xl">
              <ShoppingCart className="h-8 w-8 text-ink-subtle mx-auto mb-3" />
              <p className="text-sm font-medium text-ink-muted">
                Recent orders will appear here.
              </p>
            </div>
          </section>

          <section className="rounded-3xl border border-surface-border bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold tracking-tight text-ink">
                Top products
              </h2>
            </div>
            <div className="py-12 text-center border-2 border-dashed border-surface-border rounded-2xl">
              <Package className="h-8 w-8 text-ink-subtle mx-auto mb-3" />
              <p className="text-sm font-medium text-ink-muted">
                Best sellers will appear here.
              </p>
            </div>
          </section>
        </div>
      </AdminLayout>
    </>
  );
}
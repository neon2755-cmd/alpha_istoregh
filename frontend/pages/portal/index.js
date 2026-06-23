import { useEffect, useState } from 'react';
import Head from 'next/head';
import {
  Package,
  ShoppingCart,
  Wallet,
  CheckCircle2,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import AdminLayout from '../../components/portal/AdminLayout';
import { ordersAPI } from '../../lib/api';
import { formatPrice } from '../../lib/utils';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import Link from 'next/link';

const cards = [
  { label: 'Orders', valueKey: 'orders', Icon: ShoppingCart, bg: 'bg-blue-50', text: 'text-blue-600' },
  { label: 'Revenue', valueKey: 'revenue', Icon: Wallet, isPrice: true, bg: 'bg-green-50', text: 'text-green-600' },
  { label: 'Products sold', valueKey: 'productsSold', Icon: Package, bg: 'bg-purple-50', text: 'text-purple-600' },
  { label: 'Delivered', valueKey: 'delivered', Icon: CheckCircle2, bg: 'bg-orange-50', text: 'text-orange-600' },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await ordersAPI.getStats();
        if (!cancelled) setStats(res.data?.stats || res.stats || {});
      } catch {
        if (!cancelled) setStats({});
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true };
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await ordersAPI.getAll({ limit: 5 });
        if (!cancelled) setRecentOrders(res.orders || []);
      } catch {
        if (!cancelled) setRecentOrders([]);
      } finally {
        if (!cancelled) setOrdersLoading(false);
      }
    })();
    return () => { cancelled = true };
  }, []);

  return (
    <>
      <Head>
        <title>Dashboard — Admin</title>
      </Head>
      <AdminLayout title="Dashboard" subtitle="Overview of your store performance">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {cards.map(({ label, valueKey, Icon, isPrice, bg, text }) => (
            <div
              key={label}
              className="rounded-2xl border border-surface-border bg-white p-5 shadow-sm hover:shadow-smooth transition-shadow"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-ink-subtle">
                  {label}
                </p>
                <span className={`h-10 w-10 inline-flex items-center justify-center rounded-xl ${bg} ${text}`}>
                  <Icon className="h-5 w-5" />
                </span>
              </div>
              {loading ? (
                <SkeletonLoader width="60%" height="28px" className="mt-3" />
              ) : (
                <p className="mt-3 text-2xl font-bold tracking-tight text-ink">
                  {isPrice
                    ? formatPrice(stats?.[valueKey] || 0)
                    : stats?.[valueKey] ?? 0}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 lg:mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
          <section className="rounded-2xl border border-surface-border bg-white p-5 lg:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h2 className="text-base lg:text-lg font-bold tracking-tight text-ink">
                Recent orders
              </h2>
              <Link
                href="/portal/orders"
                className="text-xs lg:text-sm font-semibold text-primary hover:text-primary-dark inline-flex items-center gap-1 bg-primary/5 px-3 lg:px-4 py-1.5 lg:py-2 rounded-full transition-colors"
              >
                View all
                <ArrowUpRight className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
              </Link>
            </div>
            {ordersLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <SkeletonLoader key={i} height="48px" className="rounded-xl" />
                ))}
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="py-10 text-center border-2 border-dashed border-surface-border rounded-2xl">
                <ShoppingCart className="h-8 w-8 text-ink-subtle mx-auto mb-3" />
                <p className="text-sm font-medium text-ink-muted">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3 lg:p-4 rounded-xl border border-surface-border hover:bg-surface-muted/30 transition-colors">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-ink truncate">{order.orderNumber}</p>
                      <p className="text-xs text-ink-subtle truncate">
                        {order.user ? `${order.user.firstName} ${order.user.lastName}` : (order.guestInfo?.firstName || 'Guest')}
                      </p>
                    </div>
                    <div className="text-right ml-3">
                      <p className="text-sm font-bold text-ink">{formatPrice(order.total)}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        order.status === 'delivered' ? 'bg-green-50 text-green-600' :
                        order.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                        'bg-amber-50 text-amber-600'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-surface-border bg-white p-5 lg:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4 lg:mb-6">
              <h2 className="text-base lg:text-lg font-bold tracking-tight text-ink">
                Top products
              </h2>
            </div>
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <SkeletonLoader key={i} height="48px" className="rounded-xl" />
                ))}
              </div>
            ) : stats?.topProducts?.length === 0 ? (
              <div className="py-10 text-center border-2 border-dashed border-surface-border rounded-2xl">
                <Package className="h-8 w-8 text-ink-subtle mx-auto mb-3" />
                <p className="text-sm font-medium text-ink-muted">No sales data yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.topProducts?.map((product, i) => (
                  <div key={product._id || i} className="flex items-center justify-between p-3 lg:p-4 rounded-xl border border-surface-border">
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-primary-50 text-primary text-xs font-bold">
                        {i + 1}
                      </span>
                      <p className="text-sm font-semibold text-ink truncate">{product.name}</p>
                    </div>
                    <span className="text-xs font-bold text-ink-muted ml-2">{product.sold} sold</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </AdminLayout>
    </>
  );
}
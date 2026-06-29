import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Package,
  ShoppingCart,
  Wallet,
  CheckCircle2,
  ArrowUpRight,
  ExternalLink,
  BarChart3,
} from 'lucide-react';
import AdminLayout from '../../components/portal/AdminLayout';
import withAdminAuth from '../../components/portal/withAdminAuth';
import { formatPrice } from '../../lib/utils';
import SkeletonLoader from '../../components/ui/SkeletonLoader';

const cards = [
  { label: 'Orders', valueKey: 'totalOrders', Icon: ShoppingCart, bg: 'bg-blue-50', text: 'text-blue-600' },
  { label: 'Revenue', valueKey: 'totalRevenue', Icon: Wallet, isPrice: true, bg: 'bg-green-50', text: 'text-green-600' },
  { label: 'Products sold', valueKey: 'totalSold', Icon: Package, bg: 'bg-purple-50', text: 'text-purple-600' },
  { label: 'Delivered', valueKey: 'delivered', Icon: CheckCircle2, bg: 'bg-orange-50', text: 'text-orange-600' },
  { label: 'Total Products', valueKey: 'totalProducts', Icon: Package, bg: 'bg-teal-50', text: 'text-teal-600' },
];

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const headers = { Authorization: `Bearer ${token}` };
        
        const [ordersRes, productsRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/orders?limit=1000`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/products?limit=1000`, { headers }),
        ]);
        
        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();
        
        const ordersList = ordersData.orders || [];
        const products = productsData.products || [];
        setOrders(ordersList);
        
        const totalRevenue = ordersList.reduce((sum, o) => sum + (o.total || o.totalGHS || 0), 0);
        const totalSold = ordersList.reduce((sum, o) => 
          sum + (o.items || []).reduce((s, i) => s + (i.quantity || 1), 0), 0
        );
        const delivered = ordersList.filter(o => 
          o.status === 'delivered' || o.deliveryStatus === 'delivered'
        ).length;
        
        setStats({
          totalOrders: ordersList.length,
          totalProducts: products.length,
          totalSold,
          delivered,
          totalRevenue,
        });
      } catch (err) {
        console.error('Stats fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/orders?limit=5`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
        });
        const data = await res.json();
        if (!cancelled) setRecentOrders(data.orders || []);
      } catch {
        if (!cancelled) setRecentOrders([]);
      } finally {
        if (!cancelled) setOrdersLoading(false);
      }
    })();
    return () => { cancelled = true };
  }, []);

  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toLocaleDateString('en-GB');
  });

  const revenueByDay = last7Days.map(day => ({
    label: day,
    value: orders.filter(o => new Date(o.createdAt).toLocaleDateString('en-GB') === day)
      .reduce((s, o) => s + (o.total || o.totalGHS || 0), 0),
  }));

  const statusCounts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = orders.filter(o => o.status === s).length;
    return acc;
  }, {});

  const maxRevenue = Math.max(...revenueByDay.map(d => d.value), 1);
  const totalStatus = Object.values(statusCounts).reduce((s, v) => s + v, 0) || 1;

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

        <div className="mt-6 lg:mt-8 grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
          <section className="rounded-2xl border border-surface-border bg-white p-5 lg:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base lg:text-lg font-bold tracking-tight text-ink">Revenue over last 7 days</h2>
                <p className="text-sm text-ink-subtle">Daily sales performance</p>
              </div>
              <div className="rounded-full bg-primary/10 p-2 text-primary">
                <BarChart3 className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-end gap-2 h-56 pt-4">
              {revenueByDay.map(item => (
                <div key={item.label} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                  <div className="w-full flex items-end justify-center" style={{ height: '180px' }}>
                    <div
                      title={`${item.label}: GHS ${item.value.toFixed(2)}`}
                      style={{ width: '100%', maxWidth: '34px', height: `${Math.max((item.value / maxRevenue) * 160, 6)}px`, background: 'linear-gradient(180deg, #006989, #0891b2)', borderRadius: '8px 8px 0 0' }}
                    />
                  </div>
                  <span className="text-[10px] text-ink-subtle text-center leading-tight">{item.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-surface-border bg-white p-5 lg:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-base lg:text-lg font-bold tracking-tight text-ink">Orders by status</h2>
                <p className="text-sm text-ink-subtle">Current order distribution</p>
              </div>
              <div className="rounded-full bg-amber-50 p-2 text-amber-600">
                <ShoppingCart className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-3">
              {STATUS_OPTIONS.map(status => {
                const count = statusCounts[status] || 0;
                const width = Math.max((count / totalStatus) * 100, 4);
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold capitalize text-ink">{status}</span>
                      <span className="text-sm font-bold text-ink-muted">{count}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-surface-muted overflow-hidden">
                      <div style={{ width: `${width}%`, height: '100%', borderRadius: '999px', background: status === 'delivered' ? '#16a34a' : status === 'cancelled' ? '#ef4444' : status === 'shipped' ? '#006989' : '#f59e0b' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
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
                ) : recentOrders?.length === 0 ? (
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
              <div className="space-y-4">
                <div className="h-64">
                  <Bar
                    data={{
                      labels: stats?.topProducts?.map(p => p.name.length > 20 ? p.name.substring(0, 20) + '...' : p.name) || [],
                      datasets: [
                        {
                          label: 'Units Sold',
                          data: stats?.topProducts?.map(p => p.sold) || [],
                          backgroundColor: [
                            'rgba(0, 105, 137, 0.8)',
                            'rgba(0, 105, 137, 0.65)',
                            'rgba(0, 105, 137, 0.5)',
                            'rgba(0, 105, 137, 0.35)',
                            'rgba(0, 105, 137, 0.2)',
                          ],
                          borderRadius: 8,
                          borderSkipped: false,
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false },
                        tooltip: {
                          backgroundColor: '#0F172A',
                          cornerRadius: 8,
                          padding: 12,
                          titleFont: { size: 13, weight: '600' },
                          bodyFont: { size: 12 },
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: { stepSize: 1, font: { size: 11 }, color: '#94A3B8' },
                          grid: { color: '#F1F5F9' },
                        },
                        x: {
                          ticks: { font: { size: 10 }, color: '#64748B', maxRotation: 45 },
                          grid: { display: false },
                        },
                      },
                    }}
                  />
                </div>
                <div className="space-y-2">
                  {stats?.topProducts?.length > 0 && stats.topProducts.map((product, i) => (
                    <div key={product._id || i} className="flex items-center justify-between p-3 rounded-xl border border-surface-border">
                      <div className="flex items-center gap-3 min-w-0">
                        <span className="h-7 w-7 inline-flex items-center justify-center rounded-lg bg-primary-50 text-primary text-xs font-bold">
                          {i + 1}
                        </span>
                        <p className="text-sm font-semibold text-ink truncate">{product.name}</p>
                      </div>
                      <span className="text-xs font-bold text-ink-muted">{product.sold} sold</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>
      </AdminLayout>
    </>
  );
}

AdminDashboard.getLayout = (page) => page;

export default withAdminAuth(AdminDashboard);

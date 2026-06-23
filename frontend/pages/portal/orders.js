import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Package, Search, ExternalLink, Edit2, Check, Trash2 } from 'lucide-react';
import AdminLayout from '../../components/portal/AdminLayout';
import { ordersAPI, fetchAPI } from '../../lib/api';
import { formatPrice } from '../../lib/utils';
import Link from 'next/link';

const STATUS_STYLES = {
  pending: 'bg-amber-50 text-status-warning',
  processing: 'bg-amber-50 text-status-warning',
  shipped: 'bg-primary-50 text-primary',
  delivered: 'bg-green-50 text-status-success',
  cancelled: 'bg-red-50 text-status-danger',
};

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await ordersAPI.getAll();
      setOrders(res.orders || res.data?.orders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    setUpdatingId(id);
    try {
      await ordersAPI.updateStatus(id, status);
      await fetchOrders();
    } catch (e) {
      alert('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure? This will permanently delete ALL orders. This action cannot be undone.')) return;
    try {
      const res = await fetchAPI('/orders/clear', 'DELETE');
      alert(res.data?.message || 'All orders deleted');
      fetchOrders();
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || 'Unknown error';
      alert('Failed to delete orders: ' + msg);
      console.error('Delete all orders error:', e);
    }
  };

  return (
    <>
      <Head>
        <title>Orders — Admin</title>
      </Head>
      <AdminLayout title="Orders" subtitle="Manage customer orders and updates">
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-ink-subtle">{orders.length} order{orders.length !== 1 ? 's' : ''} total</p>
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-2 h-9 px-4 rounded-xl bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete All Orders
          </button>
        </div>
        <div className="rounded-3xl border border-surface-border bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-surface-border text-sm">
              <thead className="bg-surface-muted/50">
                <tr className="text-left text-xs font-bold uppercase tracking-wider text-ink-subtle">
                  <th className="px-6 py-4">Order #</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-border">
                {loading ? (
                  <tr><td colSpan={6} className="px-6 py-8 text-center text-ink-subtle animate-pulse">Loading orders...</td></tr>
                ) : orders.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-ink-subtle">No orders found.</td></tr>
                ) : (
                  orders.map(order => (
                    <tr key={order._id} className="hover:bg-surface-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <Link href={`/track?order=${order.orderNumber}`} className="font-semibold text-primary hover:underline flex items-center gap-1">
                          {order.orderNumber}
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-ink-muted">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-ink">
                          {order.user ? `${order.user.firstName} ${order.user.lastName}` : (order.guestInfo?.firstName ? `${order.guestInfo.firstName} ${order.guestInfo.lastName}` : 'Guest')}
                        </div>
                        <div className="text-xs text-ink-subtle">
                          {order.user?.email || order.guestInfo?.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-ink">
                        {formatPrice(order.total)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold capitalize ${STATUS_STYLES[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          className="h-9 px-3 text-sm bg-surface-muted border border-surface-border rounded-lg text-ink focus:border-primary focus:ring-1 focus:ring-primary outline-none disabled:opacity-50"
                          value={order.status}
                          disabled={updatingId === order._id}
                          onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map(status => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </AdminLayout>
    </>
  );
}
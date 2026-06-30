import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ordersAPI, settingsAPI } from '../lib/api';
import { formatPrice } from '../lib/utils';
import siteConfig from '../config';
import { Printer, Mail } from 'lucide-react';

export default function OrderReceipt() {
  const router = useRouter();
  const { order: orderNum } = router.query;
  const [order, setOrder] = useState(null);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderNum) return;
    const fetchOrder = async () => {
      try {
        const res = await ordersAPI.track(orderNum);
        setOrder(res.order || res.data?.order || res);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderNum]);

  useEffect(() => {
    settingsAPI.get().then(res => {
      if (res.settings) setSettings(res.settings);
    }).catch(() => {});
  }, []);

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
  const time = new Date(order.createdAt).toLocaleTimeString('en-GB', {
    hour: '2-digit', minute: '2-digit'
  });

  const contact = settings?.contact || siteConfig.contact || {};
  const storeName = settings?.storeName || siteConfig.name;
  const logo = settings?.logo?.url;
  
  const getCustomerName = () => {
    if (order.user?.firstName && order.user?.lastName) {
      return `${order.user.firstName} ${order.user.lastName}`;
    }
    if (order.guestInfo?.firstName && order.guestInfo?.lastName) {
      return `${order.guestInfo.firstName} ${order.guestInfo.lastName}`;
    }
    if (order.guestInfo?.name) return order.guestInfo.name;
    return 'Guest Customer';
  };
  
  const getCustomerEmail = () => order.user?.email || order.guestInfo?.email || 'N/A';
  const getCustomerPhone = () => order.user?.phone || order.guestInfo?.phone || 'N/A';

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
        <div className="flex justify-between items-start mb-8 pb-8 border-b-2 border-surface-border">
          <div className="flex items-start gap-4">
            {logo && <img src={logo} alt="Logo" className="h-16 object-contain" />}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-ink mb-1">{storeName}</h1>
              <p className="text-xs font-semibold text-ink-subtle mb-3">INVOICE</p>
              <p className="text-xs text-ink-muted">{contact.address || 'Adum P.Z, Kumasi, Ghana'}</p>
              <p className="text-xs text-ink-muted">{contact.phone || '+233 575 453 086'}</p>
              <p className="text-xs text-ink-muted">{contact.email || 'info@alphaistore.com'}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="mb-3">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${
                order.status === 'delivered' ? 'bg-green-50 text-green-700' :
                order.status === 'shipped' ? 'bg-blue-50 text-blue-700' :
                order.status === 'processing' ? 'bg-amber-50 text-amber-700' :
                'bg-gray-50 text-gray-700'
              }`}>
                {order.status}
              </span>
            </div>
            <p className="text-sm font-bold text-ink mb-1">Order #{order.orderNumber}</p>
            <p className="text-xs text-ink-muted">{date}</p>
            <p className="text-xs text-ink-muted">{time}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-10 mb-10">
          <div className="bg-surface-muted/50 p-4 rounded-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-subtle mb-3">📋 Bill To</h3>
            <p className="font-bold text-ink text-sm">{getCustomerName()}</p>
            <p className="text-xs text-ink-muted mt-1">Email: {getCustomerEmail()}</p>
            <p className="text-xs text-ink-muted">Phone: {getCustomerPhone()}</p>
          </div>
          <div className="bg-surface-muted/50 p-4 rounded-lg">
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-subtle mb-3">🚚 Delivery</h3>
            <p className="font-bold text-ink text-sm capitalize">{order.delivery?.method || 'delivery'}</p>
            <p className="text-xs text-ink-muted mt-1">{order.delivery?.address || 'Not specified'}</p>
            <p className="text-xs text-ink-muted">{order.delivery?.region || 'Not specified'}</p>
            {order.delivery?.notes && <p className="text-xs text-ink-muted mt-1">Notes: {order.delivery.notes}</p>}
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-sm font-bold text-ink mb-4">Order Items</h3>
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-surface-muted/50 border-b border-surface-border">
                <th className="py-3 px-3 text-left font-bold text-ink">Product</th>
                <th className="py-3 px-3 text-center font-bold text-ink">Qty</th>
                <th className="py-3 px-3 text-right font-bold text-ink">Unit Price</th>
                <th className="py-3 px-3 text-right font-bold text-ink">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {order.items.map((item, i) => (
                <tr key={i} className="hover:bg-surface-muted/30">
                  <td className="py-4 px-3">
                    <div className="flex gap-3">
                      {item.image && <img src={item.image} alt={item.name} className="h-12 w-12 object-cover rounded" />}
                      <div>
                        <p className="font-semibold text-ink">{item.name}</p>
                        <p className="text-xs text-ink-muted">{item.variant?.storage && `${item.variant.storage}`}{item.variant?.color && ` · ${typeof item.variant.color === 'object' ? item.variant.color.name : item.variant.color}`}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-3 text-center text-ink-muted">{item.quantity}</td>
                  <td className="py-4 px-3 text-right text-ink-muted">{formatPrice(item.price)}</td>
                  <td className="py-4 px-3 text-right font-semibold text-ink">{formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mb-10">
          <div className="w-72 space-y-2 text-sm">
            <div className="flex justify-between pb-2">
              <span className="text-ink-muted">Subtotal:</span>
              <span className="font-medium text-ink">{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between pb-2 border-b border-surface-border">
              <span className="text-ink-muted">Delivery Fee:</span>
              <span className="font-medium text-ink">{order.delivery?.fee === 0 ? 'Free' : formatPrice(order.delivery?.fee || 0)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between pb-2 text-green-600">
                <span>Discount {order.promoCode && `(${order.promoCode})`}:</span>
                <span className="font-medium">− {formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t-2 border-primary bg-primary/5 p-3 rounded">
              <span className="font-bold text-ink">Grand Total:</span>
              <span className="font-bold text-primary text-lg">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-10 text-xs">
          <div className="bg-surface-muted/50 p-4 rounded-lg">
            <p className="font-bold text-ink-subtle mb-2">PAYMENT METHOD</p>
            <p className="text-ink capitalize">{order.payment?.method?.replace(/_/g, ' ') || 'Not specified'}</p>
            <p className="text-ink-muted mt-1">Status: <span className={order.payment?.status === 'paid' ? 'text-green-600 font-bold' : 'text-amber-600 font-bold'}>{order.payment?.status || 'Pending'}</span></p>
          </div>
          <div className="bg-surface-muted/50 p-4 rounded-lg">
            <p className="font-bold text-ink-subtle mb-2">ORDER STATUS</p>
            <p className="text-ink capitalize font-semibold">{order.status}</p>
            <p className="text-ink-muted mt-1">Order Date: {date}</p>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t-2 border-surface-border">
          <div className="text-center mb-6">
            <p className="font-bold text-ink mb-1">✓ Thank you for your order!</p>
            <p className="text-xs text-ink-muted">Your order has been received and is being processed. Track your order status in your account or via our website.</p>
          </div>
          
          <div className="text-center text-xs text-ink-muted space-y-1 mb-6">
            <p>Questions? Contact us:</p>
            <p>{contact.email || 'info@alphaistore.com'} · {contact.phone || '+233 575 453 086'}</p>
            {contact.whatsapp && <p>WhatsApp: {Array.isArray(contact.whatsapp) ? contact.whatsapp[0] : contact.whatsapp}</p>}
          </div>
          
          <p className="text-center text-xs text-ink-muted border-t border-surface-border pt-4 mt-4">
            {storeName} · {contact.address || 'Adum P.Z, Kumasi, Ghana'} · Generated on {date} at {time}
          </p>
        </div>

        <div className="mt-8 flex gap-3 justify-center no-print">
          <button onClick={() => window.print()} className="inline-flex items-center gap-2 h-11 px-6 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary-dark transition-colors">
            <Printer className="h-4 w-4" />
            Print / Save as PDF
          </button>
          <button onClick={() => router.push('/')} className="inline-flex items-center gap-2 h-11 px-6 rounded-xl border border-surface-border text-ink text-sm font-bold hover:bg-surface-muted transition-colors">
            <Mail className="h-4 w-4" />
            Back Home
          </button>
        </div>
      </div>
    </>
  );
}

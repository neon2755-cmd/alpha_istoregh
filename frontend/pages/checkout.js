import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import {
  Smartphone,
  CreditCard,
  Banknote,
  Truck,
  User,
  ShoppingBag,
  Lock,
  ArrowRight,
  Share,
} from 'lucide-react';
import { useStore } from '../store';
import { ordersAPI, settingsAPI } from '../lib/api';
import { formatPrice } from '../lib/utils';
import { useSettings } from '../hooks/useSettings';
import toast from 'react-hot-toast';

const DELIVERY_REGIONS = [
  { region: 'Pickup at Kumasi Adum', fee: 0 },
  { region: 'Greater Accra', fee: 20 },
  { region: 'Ashanti', fee: 40 },
  { region: 'Western', fee: 50 },
  { region: 'Eastern', fee: 45 },
  { region: 'Central', fee: 45 },
  { region: 'Northern', fee: 80 },
  { region: 'Volta', fee: 55 },
  { region: 'Upper East', fee: 90 },
  { region: 'Upper West', fee: 90 },
  { region: 'Bono', fee: 60 },
  { region: 'Pickup (Accra)', fee: 0 },
];

const PAYMENT_METHODS = [
  { value: 'mtn_momo', label: 'MTN MoMo', Icon: Smartphone },
  { value: 'telecel', label: 'Telecel Cash', Icon: Smartphone },
  { value: 'airteltigo', label: 'AirtelTigo Money', Icon: Smartphone },
  { value: 'card', label: 'Debit / Credit Card', Icon: CreditCard },
  { value: 'pay_on_delivery', label: 'Pay on Delivery', Icon: Banknote },
];

const inputClass =
  'w-full h-11 px-4 text-sm bg-surface-muted border border-transparent rounded-xl text-ink placeholder:text-ink-subtle focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 focus:outline-none transition-all';

const labelClass =
  'block text-xs font-semibold uppercase tracking-wider text-ink-subtle mb-2';

const cardClass =
  'rounded-3xl border border-surface-border bg-white p-7';

export default function Checkout() {
  const router = useRouter();
  const cart = useStore((s) => s.cart);
  const user = useStore((s) => s.user);
  const clearCart = useStore((s) => s.clearCart);
  const { settings } = useSettings();

  const [form, setForm] = useState({
    name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [region, setRegion] = useState(DELIVERY_REGIONS[0]);
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [payment, setPayment] = useState('mtn_momo');
  const [promo, setPromo] = useState('');
  const [discount, setDiscount] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const subtotal = cart.reduce((s, item) => s + item.price * item.quantity, 0);
  const total = Math.max(0, subtotal + region.fee - discount);

  const handlePromo = () => {
    if (promo.toUpperCase() === 'ALPHA10') {
      setDiscount(Math.round(subtotal * 0.1));
      toast.success('Promo code applied: 10% off');
    } else {
      toast.error('Invalid promo code');
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: 'AlphaiStore Order',
      text: `My order total: ${formatPrice(total)}`,
      url: typeof window !== 'undefined' ? window.location.href : '',
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        toast.success('Link copied to clipboard!');
      }
    } catch {
      // User cancelled
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.phone) {
      toast.error('Please fill your name and phone number');
      return;
    }
    if (!address && !region.region.startsWith('Pickup')) {
      toast.error('Please enter your delivery address');
      return;
    }
    if (!cart.length) {
      toast.error('Your cart is empty');
      return;
    }
    setSubmitting(true);
    try {
      const isPickup = region.region.startsWith('Pickup');
      const deliveryAddress = isPickup ? region.region : address;

      const res = await ordersAPI.create({
        items: cart.map((item) => ({
          product: item.id || item._id,
          quantity: item.quantity,
          variant: item.variant || null,
        })),
        delivery: {
          method: isPickup ? 'pickup' : 'delivery',
          address: deliveryAddress,
          fee: region.fee,
        },
        payment: { method: payment },
        guestInfo: !user
          ? { name: form.name, email: form.email, phone: form.phone }
          : undefined,
        promoCode: promo || '',
        discount,
      });
      clearCart();
      const orderNumber = res?.order?.orderNumber || res?.data?.order?.orderNumber;
      router.push(`/order-confirm?order=${orderNumber}`);
    } catch (e) {
      toast.error(
        e?.response?.data?.message ||
          'Failed to place order. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="mx-auto max-w-md rounded-2xl border border-surface-border bg-white p-12 text-center">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary">
            <ShoppingBag className="h-5 w-5" />
          </span>
          <h2 className="mt-4 text-lg font-semibold tracking-tightish text-ink">
            Your cart is empty
          </h2>
          <p className="mt-1 text-sm text-ink-muted">
            Add some phones before checking out.
          </p>
          <button
            type="button"
            onClick={() => router.push('/shop')}
            className="mt-6 inline-flex h-11 items-center gap-2 px-5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-dark shadow-smooth"
          >
            Browse shop
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Checkout — AlphaiStore</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold tracking-tight text-ink mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <section className={cardClass}>
              <div className="flex items-center gap-2 mb-5">
                <User className="h-4 w-4 text-ink-subtle" />
                <h2 className="text-base font-semibold tracking-tightish text-ink">
                  Your details
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className={labelClass}>Full name</label>
                  <input
                    className={inputClass}
                    placeholder="Kwame Asante"
                    value={form.name}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, name: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input
                    className={inputClass}
                    type="tel"
                    placeholder="+233 XX XXX XXXX"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, phone: e.target.value }))
                    }
                  />
                </div>
                <div>
                  <label className={labelClass}>Email</label>
                  <input
                    className={inputClass}
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, email: e.target.value }))
                    }
                  />
                </div>
              </div>
            </section>

            <section className={cardClass}>
              <div className="flex items-center gap-2 mb-5">
                <Truck className="h-4 w-4 text-ink-subtle" />
                <h2 className="text-base font-semibold tracking-tightish text-ink">
                  Delivery
                </h2>
              </div>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Region</label>
                  <select
                    className={inputClass}
                    value={region.region}
                    onChange={(e) =>
                      setRegion(
                        DELIVERY_REGIONS.find((r) => r.region === e.target.value)
                      )
                    }
                  >
                    {DELIVERY_REGIONS.map((r) => (
                      <option key={r.region} value={r.region}>
                        {r.region} — {r.fee === 0 ? 'Free' : formatPrice(r.fee)}
                      </option>
                    ))}
                  </select>
                </div>
                {region.region !== 'Pickup at Kumasi Adum' && region.region !== 'Pickup (Accra)' && (
                  <>
                    <div>
                      <label className={labelClass}>Address</label>
                      <input
                        className={inputClass}
                        placeholder="House number, street, area…"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>
                        Notes <span className="normal-case text-ink-subtle">(optional)</span>
                      </label>
                      <input
                        className={inputClass}
                        placeholder="Landmark, gate colour…"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>
                  </>
                )}
              </div>
            </section>

            <section className={cardClass}>
              <div className="flex items-center gap-2 mb-5">
                <CreditCard className="h-4 w-4 text-ink-subtle" />
                <h2 className="text-base font-semibold tracking-tightish text-ink">
                  Payment method
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {PAYMENT_METHODS.map(({ value, label, Icon }) => {
                  const active = payment === value;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setPayment(value)}
                      aria-pressed={active}
                      className={`flex items-center gap-3 h-12 px-4 rounded-2xl border text-sm font-semibold text-left transition-all ${
                        active
                          ? 'border-primary bg-primary/5 text-primary shadow-ring'
                          : 'border-surface-border bg-surface-muted text-ink-muted hover:border-primary hover:text-primary hover:bg-white'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {label}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          <aside className="lg:col-span-1">
            <div className="rounded-3xl border border-surface-border bg-white p-6 lg:sticky lg:top-24">
              <h2 className="text-base font-semibold tracking-tightish text-ink mb-5">
                Order summary
              </h2>

              <ul className="divide-y divide-surface-border mb-5">
                {cart.map((item) => (
                  <li
                    key={item.id + JSON.stringify(item.variant || {})}
                    className="flex items-start gap-3 py-3"
                  >
                    <div className="h-12 w-12 shrink-0 rounded-md bg-surface-muted border border-surface-border overflow-hidden flex items-center justify-center">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Smartphone className="h-5 w-5 text-ink-subtle" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-ink line-clamp-1">
                        {item.name}
                      </p>
                      <p className="text-xs text-ink-subtle">
                        {item.variant?.storage || (typeof item.variant?.color === 'object' ? item.variant?.color?.name : item.variant?.color) || ''} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-ink whitespace-nowrap">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex gap-2 mb-5">
                <input
                  type="text"
                  placeholder="Promo code"
                  value={promo}
                  onChange={(e) => setPromo(e.target.value)}
                  className={`${inputClass} flex-1`}
                />
                <button
                  type="button"
                  onClick={handlePromo}
                  className="h-11 px-4 rounded-xl border border-surface-border text-sm font-medium text-ink hover:bg-surface-muted"
                >
                  Apply
                </button>
              </div>

              <dl className="space-y-2 text-sm border-t border-surface-border pt-4">
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Subtotal</dt>
                  <dd className="text-ink font-medium">{formatPrice(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Delivery</dt>
                  <dd className="text-ink font-medium">
                    {region.fee === 0 ? 'Free' : formatPrice(region.fee)}
                  </dd>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-status-success">
                    <dt>Promo discount</dt>
                    <dd className="font-medium">
                      − {formatPrice(discount)}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between pt-3 border-t border-surface-border">
                  <dt className="text-ink font-semibold">Total</dt>
                  <dd className="text-ink font-semibold text-base">
                    {formatPrice(total)}
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="mt-6 inline-flex w-full h-12 items-center justify-center gap-2 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed shadow-smooth transition-all"
              >
                <Lock className="h-4 w-4" />
                {submitting ? 'Placing order…' : `Place order — ${formatPrice(total)}`}
              </button>
              <button
                type="button"
                onClick={handleShare}
                className="mt-2 inline-flex w-full h-11 items-center justify-center gap-2 rounded-lg border border-surface-border bg-white text-ink text-sm font-medium hover:bg-surface-muted"
              >
                <Share className="h-4 w-4" />
                Share order
              </button>
              <p className="mt-2 text-center text-xs text-ink-subtle">
                Your details are secure and encrypted.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
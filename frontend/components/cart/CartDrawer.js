import React from 'react';
import { X, Minus, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useStore } from '../../store';
import { formatPrice } from '../../lib/utils';
import siteConfig from '../../config';
import WhatsAppIcon from '../ui/WhatsAppIcon';

export default function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useStore();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden
      />
      <section className="absolute inset-y-0 right-0 pl-10 max-w-md w-full flex">
        <div className="h-full flex flex-col bg-white shadow-smooth-lg overflow-hidden w-full">
          <header className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
            <h2 className="text-base font-semibold tracking-tightish text-ink">
              Your cart
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close cart"
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-muted hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-6">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-20">
                <p className="text-sm text-ink-muted">Your cart is empty.</p>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-4 text-sm font-medium text-primary hover:text-primary-dark"
                >
                  Continue shopping
                </button>
              </div>
            ) : (
              <ul className="divide-y divide-surface-border">
                {cart.map((item) => (
                  <li
                    key={item.id + JSON.stringify(item.variant || {})}
                    className="flex gap-4 py-5"
                  >
                    <div className="h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-surface-muted border border-surface-border">
                      <Image
                        src={item.imageUrl || '/images/placeholder-phone.jpg'}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <Link
                          href={`/product/${item.id}`}
                          onClick={onClose}
                          className="text-sm font-medium text-ink hover:text-primary line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm font-semibold text-ink whitespace-nowrap">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      {item.variant && (
                        <p className="mt-1 text-xs text-ink-subtle">
                          {Object.entries(item.variant)
                            .map(([key, value]) => `${key}: ${typeof value === 'object' && value !== null ? (value?.name || '') : value}`)
                            .join(' · ')}
                        </p>
                      )}

                      <div className="mt-3 flex items-center justify-between">
                        <div className="inline-flex items-center border border-surface-border rounded-lg">
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity - 1,
                                item.variant
                              )
                            }
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                            className="h-8 w-8 inline-flex items-center justify-center text-ink-muted hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-ink">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              updateQuantity(
                                item.id,
                                item.quantity + 1,
                                item.variant
                              )
                            }
                            aria-label="Increase quantity"
                            className="h-8 w-8 inline-flex items-center justify-center text-ink-muted hover:text-ink"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id, item.variant)}
                          className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-red-50 text-red-500 hover:bg-red-100"
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {cart.length > 0 && (
            <footer className="border-t border-surface-border px-6 py-5 bg-surface-muted">
              <div className="flex items-center justify-between text-sm">
                <span className="text-ink-muted">Subtotal</span>
                <span className="text-base font-semibold text-ink">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mt-1 text-xs text-ink-subtle">
                Shipping and taxes calculated at checkout.
              </p>
              <Link
                href="/checkout"
                onClick={onClose}
                className="mt-4 inline-flex w-full h-11 items-center justify-center rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark"
              >
                Checkout
              </Link>
              <a
                href={`https://wa.me/${siteConfig.whatsappNumber || ''}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex w-full h-11 items-center justify-center gap-2 rounded-lg border border-[#25D366] text-[#25D366] text-sm font-medium hover:bg-[#25D366] hover:text-white"
              >
                <WhatsAppIcon className="h-[18px] w-[18px] text-[#25D366]" />
                Order via WhatsApp
              </a>
              <button
                type="button"
                onClick={clearCart}
                className="mt-2 w-full text-center text-xs font-semibold text-red-500 border border-red-200 rounded-lg py-2 hover:bg-red-50"
              >
                Empty cart
              </button>
            </footer>
          )}
        </div>
      </section>
    </div>
  );
}
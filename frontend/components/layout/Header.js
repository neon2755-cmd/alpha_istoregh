import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  Search,
  ShoppingCart,
  User,
  ChevronDown,
  Menu,
  LogOut,
  Package,
  LogIn,
  Heart,
} from 'lucide-react';
import useStore from '../../store';
import { settingsAPI } from '../../lib/api';

export default function Header() {
  const router = useRouter();
  const { user, logout, cart, setCartOpen } = useStore();
  const [openUser, setOpenUser] = useState(false);
  const [openMobile, setOpenMobile] = useState(false);
  const [settings, setSettings] = useState(null);
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  useEffect(() => {
    let active = true;
    settingsAPI.get().then(res => {
      if (active && res.settings) {
        setSettings(res.settings);
        if (typeof window !== 'undefined') {
          if (res.settings.storeName) localStorage.setItem('storeName', res.settings.storeName);
          if (res.settings.logo?.url) localStorage.setItem('storeLogo', res.settings.logo.url);
        }
      }
    }).catch(() => {});
    return () => { active = false };
  }, []);

  const cachedName = typeof window !== 'undefined' ? localStorage.getItem('storeName') : null;
  const cachedLogo = typeof window !== 'undefined' ? localStorage.getItem('storeLogo') : null;
  const storeName = settings?.storeName || cachedName || 'AlphaiStore';
  const logoUrl = settings?.logo?.url || cachedLogo;

  const handleSignOut = () => {
    logout();
    setOpenUser(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-surface-border shadow-sm rounded-b-3xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row h-auto lg:h-16 py-3 lg:py-0 items-center justify-between gap-4">
          <div className="flex items-center justify-between w-full lg:w-auto">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              {logoUrl ? (
                <img src={logoUrl} alt={storeName} loading="eager" className="h-8 w-auto object-contain" />
              ) : null}
              <span className="text-xl font-bold tracking-tight text-ink">{storeName}</span>
            </Link>
            <div className="flex lg:hidden items-center gap-1">
              <Link href="/wishlist" data-no-hover className="inline-flex h-9 w-9 items-center justify-center text-ink hover:text-primary">
                <Heart className="h-5 w-5" />
              </Link>
              <button type="button" onClick={() => setCartOpen(true)} className="relative inline-flex h-9 w-9 items-center justify-center text-ink hover:text-primary" aria-label="Open cart">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 inline-flex items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </button>
              <button type="button" onClick={() => setOpenMobile(!openMobile)} data-no-hover className="inline-flex h-9 w-9 items-center justify-center text-ink hover:text-primary" aria-label="Toggle menu">
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>

              <form
            onSubmit={(e) => {
              e.preventDefault();
              const query = e.target.search.value.trim();
              if (query) router.push(`/shop?q=${encodeURIComponent(query)}`);
            }}
            className="w-full lg:flex-1 lg:max-w-md hidden lg:flex mx-auto"
          >
            <div className="relative w-full flex items-center">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-subtle" aria-hidden />
              <input type="text" name="search" placeholder="Search for phones, laptops, accessories…" className="w-full h-10 pl-10 pr-4 text-sm bg-white/60 border border-surface-border rounded-full placeholder:text-ink-subtle focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all" />
            </div>
          </form>

          <div className="hidden lg:flex items-center gap-6 shrink-0">
            <nav className="flex items-center gap-6 text-sm font-semibold text-ink mr-2">
              <Link href="/" className="hover:text-primary transition-colors">Home</Link>
              <Link href="/shop" className="hover:text-primary transition-colors">Products</Link>
              <Link href="/about" className="hover:text-primary transition-colors">About</Link>
            </nav>

            <div className="h-6 w-px bg-surface-border hidden lg:block"></div>

            <div className="flex items-center gap-1">
              {user ? (
                <div className="relative">
                  <button onClick={() => setOpenUser(!openUser)} data-no-hover className="inline-flex h-9 items-center justify-center text-ink hover:text-primary" aria-expanded={openUser} aria-label="User menu">
                    <User className="h-5 w-5" />
                  </button>
                  {openUser && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-surface-border bg-white shadow-smooth-lg overflow-hidden">
                      <div className="px-4 py-4 border-b border-surface-border bg-transparent">
                        <p className="text-sm font-semibold text-ink truncate">{user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : 'My account'}</p>
                        <p className="text-xs text-ink-subtle truncate">{user.email}</p>
                      </div>
                      <div className="py-2">
                        <Link href="/orders" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-ink" onClick={() => setOpenUser(false)}>
                          <Package className="h-4 w-4 text-ink-subtle" />
                          My orders
                        </Link>
                        <div className="px-4 py-2.5">
                          <button onClick={handleSignOut} className="w-full flex items-center gap-3 text-sm font-medium text-red-600">
                            <LogOut className="h-4 w-4" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link href="/auth/login" style={{ fontSize: '14px', fontWeight: 600, color: '#006989' }}>
                  Sign in
                </Link>
              )}

              <Link href="/wishlist" data-no-hover className="relative inline-flex h-9 items-center justify-center text-ink hover:text-primary" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
              </Link>

              <button type="button" data-no-hover onClick={() => setCartOpen(true)} aria-label="Open cart" className="relative inline-flex h-9 items-center justify-center text-ink hover:text-primary">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[20px] h-[20px] px-1 inline-flex items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {openMobile && (
          <div className="lg:hidden py-4 space-y-4 border-t border-surface-border">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const query = e.target.search.value.trim();
                if (query) router.push(`/shop?q=${encodeURIComponent(query)}`);
                setOpenMobile(false);
              }}
              className="px-2"
            >
              <div className="relative w-full flex items-center">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-ink-subtle" aria-hidden />
                <input type="text" name="search" placeholder="Search…" className="w-full h-10 pl-10 pr-4 text-sm bg-white/60 border border-surface-border rounded-full focus:bg-white focus:border-primary outline-none" />
              </div>
            </form>
            <nav className="space-y-1">
              <Link href="/" onClick={() => setOpenMobile(false)} className="block px-4 py-3 rounded-xl text-sm font-semibold text-ink transition-colors">Home</Link>
              <Link href="/shop" onClick={() => setOpenMobile(false)} className="block px-4 py-3 rounded-xl text-sm font-semibold text-ink transition-colors">Products</Link>
              <Link href="/about" onClick={() => setOpenMobile(false)} className="block px-4 py-3 rounded-xl text-sm font-semibold text-ink transition-colors">About</Link>
              {user ? (
                <>
                  <Link href="/orders" onClick={() => setOpenMobile(false)} className="block px-4 py-3 rounded-xl text-sm font-semibold text-ink transition-colors">My Orders</Link>
                  <button type="button" onClick={handleSignOut} className="block w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors">Sign out</button>
                </>
              ) : (
                <Link href="/auth/login" onClick={() => setOpenMobile(false)} className="block px-3 py-2 rounded-xl text-sm font-semibold text-primary">Sign in</Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

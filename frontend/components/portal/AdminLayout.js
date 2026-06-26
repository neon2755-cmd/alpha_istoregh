import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  Smartphone,
  ClipboardList,
  Settings,
  Store,
  Menu,
  X,
  Mail,
  LogOut,
  ShieldCheck,
} from 'lucide-react';
import { useAdminAuthStore } from '../../store/adminAuth';

const adminNavItems = [
  { href: '/portal', label: 'Dashboard', Icon: LayoutDashboard, exact: true },
  { href: '/portal/products', label: 'Products', Icon: Smartphone },
  { href: '/portal/orders', label: 'Orders', Icon: ClipboardList },
  { href: '/portal/messages', label: 'Messages', Icon: Mail },
  { href: '/portal/settings', label: 'Settings', Icon: Settings },
];

const AdminLayout = ({ children, title, subtitle }) => {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated);
  const logout = useAdminAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.push('/portal/login');
  };

  const isActive = (item) =>
    item.exact
      ? router.pathname === item.href
      : router.pathname === item.href ||
        router.pathname.startsWith(`${item.href}/`);

  const NavContent = () => (
    <>
      <div className="h-20 flex items-center gap-3 px-6 lg:px-8 border-b border-surface-border">
        <span className="text-xl font-bold tracking-tight text-ink">
          Admin Panel
        </span>
      </div>
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-2">
          {adminNavItems.map(({ href, label, Icon }) => {
            const active = isActive({ href, exact: href === '/portal' });
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 h-12 px-4 rounded-xl text-sm font-semibold transition-all ${
                    active
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-ink-muted hover:bg-surface-muted hover:text-ink'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-surface-border space-y-2">
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 h-12 px-4 rounded-xl bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        )}
        <Link
          href="/"
          onClick={() => setSidebarOpen(false)}
          className="flex items-center justify-center gap-2 h-12 px-4 rounded-xl bg-surface-muted text-ink text-sm font-semibold hover:bg-surface-border transition-colors"
        >
          <Store className="h-4 w-4" />
          Back to Store
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-surface-border h-14 flex items-center justify-between px-4">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-ink hover:bg-surface-muted"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="text-base font-bold text-ink">Admin Panel</span>
        <div className="w-10" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 lg:top-4 left-0 z-50 lg:z-10
        h-screen lg:h-[calc(100vh-2rem)]
        w-72 bg-white lg:bg-white lg:rounded-r-3xl lg:border-r lg:border-surface-border lg:shadow-smooth
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col
      `}>
        {/* Mobile close button */}
        <div className="lg:hidden flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <span className="text-lg font-bold text-ink">Menu</span>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-ink-muted hover:bg-surface-muted"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <NavContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 pt-14 lg:pt-0">
        <header className="hidden lg:flex sticky top-0 z-40 bg-background/80 backdrop-blur-md h-20 items-center justify-between px-6 lg:px-12 border-b border-surface-border/50">
          <div>
            {title && (
              <h1 className="text-2xl font-bold tracking-tight text-ink">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-ink-muted mt-1">{subtitle}</p>
            )}
          </div>
          {isAuthenticated && (
            <div className="flex items-center gap-2 text-sm font-medium text-ink-muted">
              <ShieldCheck className="h-4 w-4 text-green-500" />
              Admin
            </div>
          )}
        </header>
        {/* Mobile title bar */}
        <div className="lg:hidden bg-white border-b border-surface-border px-4 py-3">
          <h1 className="text-lg font-bold text-ink">{title}</h1>
          {subtitle && <p className="text-xs text-ink-muted">{subtitle}</p>}
        </div>
        <main className="flex-1 p-4 lg:p-12">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;

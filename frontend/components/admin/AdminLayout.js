import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard,
  Smartphone,
  ClipboardList,
  Settings,
  Store,
} from 'lucide-react';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', Icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'Products', Icon: Smartphone },
  { href: '/admin/orders', label: 'Orders', Icon: ClipboardList },
  { href: '/admin/settings', label: 'Settings', Icon: Settings },
];

const AdminLayout = ({ children, title, subtitle }) => {
  const router = useRouter();

  const isActive = (item) =>
    item.exact
      ? router.pathname === item.href
      : router.pathname === item.href ||
        router.pathname.startsWith(`${item.href}/`);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-white rounded-r-3xl border-r border-surface-border shadow-smooth my-4 z-10 sticky top-4 h-[calc(100vh-2rem)]">
        <div className="h-20 flex items-center gap-3 px-8 border-b border-surface-border">
          <span className="text-xl font-bold tracking-tight text-ink">
            Admin Panel
          </span>
        </div>
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {adminNavItems.map(({ href, label, Icon }) => {
              const active = isActive({ href, exact: href === '/admin' });
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={`flex items-center gap-3 h-12 px-4 rounded-full text-sm font-semibold transition-all ${
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
        <div className="p-6 border-t border-surface-border">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 h-12 px-4 rounded-full bg-surface-muted text-ink text-sm font-semibold hover:bg-surface-border transition-colors"
          >
            <Store className="h-4 w-4" />
            Back to Store
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-md h-20 flex items-center justify-between px-6 lg:px-12 border-b border-surface-border/50">
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
        </header>
        <main className="flex-1 p-6 lg:p-12">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
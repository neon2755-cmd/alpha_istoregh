import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { LogOut, Store, ShieldCheck } from 'lucide-react';
import { useAdminAuthStore } from '../../store/adminAuth';

const AdminLayout = ({ children, title, subtitle, hideSidebar = false }) => {
  const router = useRouter();
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated);
  const logout = useAdminAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    router.push('/portal/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated && !hideSidebar && (
        <header className="sticky top-0 z-40 bg-white border-b border-surface-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div>
              {title && (
                <h1 className="text-xl font-bold tracking-tight text-ink">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-xs text-ink-muted mt-0.5">{subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                <ShieldCheck className="h-3.5 w-3.5" />
                Admin
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-red-50 text-red-600 text-sm font-semibold hover:bg-red-100 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
              <Link
                href="/"
                className="inline-flex items-center gap-2 h-9 px-4 rounded-lg bg-surface-muted text-ink text-sm font-semibold hover:bg-surface-border transition-colors"
              >
                <Store className="h-4 w-4" />
                Store
              </Link>
            </div>
          </div>
        </header>
      )}
      <main className={`${isAuthenticated && !hideSidebar ? 'p-4 sm:p-6 lg:p-8' : ''}`}>
        <div className={`${isAuthenticated && !hideSidebar ? 'max-w-7xl mx-auto' : ''}`}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

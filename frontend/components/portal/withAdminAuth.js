// frontend/components/portal/withAdminAuth.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAdminAuthStore } from '../../store/adminAuth';

export default function withAdminAuth(Component) {
  function AdminAuthWrapper(props) {
    const router = useRouter();
    const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated);

    useEffect(() => {
      if (!isAuthenticated && router.pathname !== '/portal/login') {
        router.replace('/portal/login');
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated && router.pathname !== '/portal/login') {
      return null;
    }

    return <Component {...props} />;
  }

  AdminAuthWrapper.getLayout = Component.getLayout;
  AdminAuthWrapper.displayName = `withAdminAuth(${Component.displayName || Component.name || 'Component'})`;

  return AdminAuthWrapper;
}

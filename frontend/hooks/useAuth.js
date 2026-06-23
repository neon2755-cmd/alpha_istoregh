// frontend/hooks/useAuth.js
import { useState, useEffect, useContext, createContext } from 'react';
import useStore from '../store'; // Import your Zustand store
import { useRouter } from 'next/router';

// Create a context for auth
const AuthContext = createContext();

// Auth Provider component
export const AuthProvider = ({ children }) => {
  const { user, token, isLoadingAuth, fetchUser, logout } = useStore();
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);

  // Effect to fetch user on initial load if token exists
  useEffect(() => {
    if (token) {
      fetchUser().then(() => setAuthChecked(true));
    } else {
      setAuthChecked(true); // No token, so auth check is complete
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]); // Re-run if token changes (e.g., login/logout)


  // Effect to handle protected routes
  useEffect(() => {
     // Don't run redirection logic until auth state is fully loaded
     if (!isLoadingAuth && authChecked) {
        const protectedRoutes = ['/orders', '/profile']; // Add routes that require login
         const adminRoutes = ['/portal', '/portal/*']; // Add admin routes

         // Check if current route requires login and user is not logged in
         const isProtectedRoute = protectedRoutes.some(route => router.pathname.startsWith(route));
         const isAdminRoute = adminRoutes.some(route => router.pathname.startsWith(route));


         if (isProtectedRoute && !user) {
           console.log('Redirecting to login: Protected route access denied.');
           router.push('/auth/login');
         }

         // Check if current route requires admin role and user is not admin or not logged in
         if (isAdminRoute && (!user || user.role !== 'admin')) {
            console.log('Redirecting to login: Admin route access denied.');
           router.push('/auth/login'); // Or a custom unauthorized page
         }
     }
  }, [router.pathname, user, isLoadingAuth, authChecked]); // Depend on pathname, user, and loading status


  const value = {
    user,
    token,
    isAuthenticated: !!user, // derived state
    isAdmin: user?.role === 'admin',
    isLoading: isLoadingAuth,
    login: useStore.getState().login, // Expose store actions
    register: useStore.getState().register,
    logout: () => {
        logout();
         // If user wasn't authenticated, log() in store might clear token anyway
         // but explicitly redirect if on protected page after logout.
         if (router.pathname !== '/auth/login' && router.pathname !== '/auth/signup') {
             router.push('/auth/login');
         }
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

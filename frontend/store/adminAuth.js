// frontend/store/adminAuth.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAdminAuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      admin: null,
      login: (admin) => set({ isAuthenticated: true, admin }),
      logout: () => set({ isAuthenticated: false, admin: null }),
    }),
    {
      name: 'admin-auth-storage',
    }
  )
);

export default useAdminAuthStore;

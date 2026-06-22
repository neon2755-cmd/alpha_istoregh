// frontend/store/index.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '../lib/api';

export const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoadingAuth: false,
      cart: [],
      isCartOpen: false,
      orders: [],
      wishlist: [],

      setUser: (user) => set({ user }),
      setToken: (token) => {
        if (typeof window !== 'undefined') {
          if (token) localStorage.setItem('authToken', token);
          else localStorage.removeItem('authToken');
        }
        set({ token });
      },
      fetchUser: async () => {
        const token =
          typeof window !== 'undefined'
            ? localStorage.getItem('authToken')
            : null;
        if (!token) {
          set({ user: null, token: null, isLoadingAuth: false });
          return;
        }
        set({ isLoadingAuth: true });
        try {
          const res = await authAPI.getMe();
          set({ user: res.user, isLoadingAuth: false });
        } catch {
          localStorage.removeItem('authToken');
          set({ user: null, token: null, isLoadingAuth: false });
        }
      },
      login: async (credentials) => {
        const res = await authAPI.login(credentials);
        get().setToken(res.token);
        get().setUser(res.user);
        return res;
      },
      register: async (data) => {
        const res = await authAPI.register(data);
        get().setToken(res.token);
        get().setUser(res.user);
        return res;
      },
      logout: () => {
        get().setToken(null);
        get().setUser(null);
        get().setCartOpen(false);
      },

      setCartOpen: (open) => set({ isCartOpen: open }),
      addToCart: (product, qty = 1, variant = null) => {
        set((state) => {
          let normalizedVariant = variant;
          if (variant && variant.color && typeof variant.color === 'object') {
            normalizedVariant = { ...variant, color: variant.color.name };
          }
          const existingIndex = state.cart.findIndex(
            (item) => item.id === product.id && JSON.stringify(item.variant || {}) === JSON.stringify(normalizedVariant || {})
          );
          let updatedCart;
          if (existingIndex > -1) {
            updatedCart = [...state.cart];
            updatedCart[existingIndex].quantity += qty;
          } else {
            const newItem = {
              id: product.id || product._id,
              name: product.name,
              price: normalizedVariant?.price || product.basePrice || product.price || 0,
              quantity: qty,
              imageUrl: product.images?.[0]?.url || '/images/placeholder-phone.jpg',
              variant: normalizedVariant,
            };
            updatedCart = [...state.cart, newItem];
          }
          return { cart: updatedCart, isCartOpen: true };
        });
      },
      removeFromCart: (productId, variant = null) => {
        set((state) => ({
          cart: state.cart.filter(
            (item) => !(item.id === productId && JSON.stringify(item.variant || {}) === JSON.stringify(variant || {}))
          ),
        }));
      },
      updateQuantity: (productId, quantity, variant = null) => {
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId && JSON.stringify(item.variant || {}) === JSON.stringify(variant || {})
              ? { ...item, quantity }
              : item
          ),
        }));
      },
      clearCart: () => set({ cart: [] }),

      setOrders: (orders) => set({ orders }),

      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'alphai-store-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        cart: state.cart,
        wishlist: state.wishlist,
        orders: state.orders,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);

export default useStore;
export const useCartStore = () => useStore();
export const useAuthStore = () => useStore();

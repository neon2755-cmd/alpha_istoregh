// frontend/store/index.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,
      wishlist: [],

      setCartOpen: (open) => set({ isCartOpen: open }),
      addToCart: (product, qty = 1, variant = null) => {
        set((state) => {
          const normalizedVariant = variant ? {
            color: typeof variant.color === 'object' ? (variant.color?.name || variant.color?.hex || '') : (variant.color || ''),
            storage: variant.storage || '',
            price: variant.price || 0,
          } : null;
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

      toggleWishlist: (productId) => {
        set((state) => {
          const idx = state.wishlist.indexOf(productId);
          let updatedWishlist;
          if (idx > -1) {
            updatedWishlist = state.wishlist.filter((id) => id !== productId);
          } else {
            updatedWishlist = [...state.wishlist, productId];
          }
          return { wishlist: updatedWishlist };
        });
      },

      isDarkMode: false,
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'alphai-store-storage',
      partialize: (state) => ({
        cart: state.cart,
        wishlist: state.wishlist,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
);

export default useStore;
export const useCartStore = () => useStore();

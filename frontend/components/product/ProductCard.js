import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Sparkles, Flame, Heart } from 'lucide-react';
import { formatPrice } from '../../lib/utils';
import { useStore } from '../../store';

function toggleWishlistItem(product) {
  try {
    const stored = localStorage.getItem('alphaistore_wishlist');
    const items = stored ? JSON.parse(stored) : [];
    const id = product._id || product.id;
    const exists = items.find((i) => i.id === id);
    const updated = exists
      ? items.filter((i) => i.id !== id)
      : [
          ...items,
          {
            id,
            name: product.name,
            brand: product.brand,
            price: product.basePrice || product.variants?.[0]?.price || 0,
            imageUrl: product.images?.[0]?.url || null,
          },
        ];
    localStorage.setItem('alphaistore_wishlist', JSON.stringify(updated));
    return !exists;
  } catch {
    return false;
  }
}

function isWishlisted(id) {
  try {
    const stored = localStorage.getItem('alphaistore_wishlist');
    const items = stored ? JSON.parse(stored) : [];
    return !!items.find((i) => i.id === id);
  } catch {
    return false;
  }
}

function ProductCard({ product }) {
  const { addToCart, setCartOpen } = useStore();
  const price = product.basePrice || product.variants?.[0]?.price || 0;
  const comparePrice = product.comparePrice;
  const hasDiscount = comparePrice && comparePrice > price;
  const productId = product._id || product.id;

  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    setWishlisted(isWishlisted(productId));
  }, [productId]);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const added = toggleWishlistItem(product);
    setWishlisted(added);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      product: productId,
      name: product.name,
      price,
      quantity: 1,
      variant: product.variants?.[0] || null,
      image: product.images?.[0]?.url
    });
    setCartOpen(true);
  };

  return (
    <article className="group flex flex-col bg-white rounded-3xl overflow-hidden hover:-translate-y-2 hover:shadow-smooth-lg transition-all duration-300">
      <Link
        href={`/product/${productId}`}
        className="relative aspect-square bg-white overflow-hidden p-6"
      >
        <img
          src={product.images?.[0]?.url || '/images/placeholder-phone.jpg'}
          alt={product.name || 'Product'}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badges top-left */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-sm text-ink text-[11px] font-bold tracking-wider uppercase shadow-sm">
              <Sparkles className="h-3 w-3" />
              Featured
            </span>
          )}
          {product.isHotDeal && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-600 text-white text-[11px] font-bold tracking-wider uppercase shadow-sm">
              <Flame className="h-3 w-3" />
              Hot deal
            </span>
          )}
        </div>

        {/* Wishlist button top-right */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-4 right-4 h-9 w-9 inline-flex items-center justify-center rounded-full bg-white shadow-sm hover:scale-110 transition-transform"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              wishlisted ? 'fill-red-500 text-red-500' : 'text-ink-subtle'
            }`}
          />
        </button>
      </Link>

      <div className="flex flex-col flex-1 p-6">
        <Link
          href={`/product/${productId}`}
          className="text-lg font-bold text-ink hover:text-primary line-clamp-1"
        >
          {product.name}
        </Link>

        <p className="mt-1 text-sm text-ink-muted">
          {product.variants?.[0]?.storage || '128GB'}{product.brand ? ` · ${product.brand}` : ''}
        </p>

        <div className="mt-4 flex flex-col">
          {hasDiscount && (
            <span className="text-xs text-ink-subtle line-through font-medium">
              {formatPrice(comparePrice)}
            </span>
          )}
          <span className="text-xl font-bold text-ink tracking-tight">
            {formatPrice(price)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-6 w-full inline-flex items-center justify-center gap-1.5 h-11 px-4 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
          aria-label={`Add ${product.name} to cart`}
        >
          <Plus className="h-4 w-4" />
          Add to cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard;

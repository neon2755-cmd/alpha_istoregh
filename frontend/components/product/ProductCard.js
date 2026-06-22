import React from 'react';
import Link from 'next/link';
import { Heart, ShoppingCart, Zap, Star } from 'lucide-react';
import { useStore } from '../../store';
import { formatPrice } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { addToCart, wishlist, toggleWishlist, user } = useStore();
  
  if (!product) return null;

  const productId = product._id || product.id;
  const isWishlisted = wishlist.includes(productId);

  const handleWishlist = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      toast('Sign in to add to wishlist', { icon: '🔒' });
      return;
    }
    toggleWishlist(productId);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!user) {
      toast('Sign in to add to cart', { icon: '🔒' });
      return;
    }
    const variant = product.variants?.[0] || null;
    const normalizedVariant = variant ? {
      color: typeof variant.color === 'object' ? (variant.color?.name || '') : (variant.color || ''),
      storage: variant.storage || '',
      price: variant.price || 0,
    } : null;
    addToCart(product, 1, normalizedVariant);
    toast.success('Added to cart');
  };

  const discountPercentage = product.comparePrice && product.comparePrice > product.basePrice 
    ? Math.round(((product.comparePrice - product.basePrice) / product.comparePrice) * 100) 
    : 0;

  return (
    <div 
      className="group relative bg-white border border-surface-border rounded-2xl overflow-hidden hover:shadow-lg transition-shadow duration-300"
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
    >
      {/* Badges */}
      <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 10, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        {discountPercentage > 0 && (
          <span style={{ backgroundColor: '#EF4444', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '999px' }}>
            -{discountPercentage}%
          </span>
        )}
        {product.isHotDeal && (
          <span style={{ backgroundColor: '#F59E0B', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <Zap size={10} /> Hot
          </span>
        )}
        {product.isFeatured && (
          <span style={{ backgroundColor: '#006989', color: 'white', fontSize: '10px', fontWeight: 'bold', padding: '2px 8px', borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '2px' }}>
            <Star size={10} /> Featured
          </span>
        )}
      </div>

      <button
        onClick={handleWishlist}
        style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10, backgroundColor: 'white', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}
        aria-label="Toggle wishlist"
      >
        <Heart size={16} fill={isWishlisted ? '#EF4444' : 'transparent'} color={isWishlisted ? '#EF4444' : '#94A3B8'} />
      </button>

      {/* Image Container */}
      <Link href={`/product/${productId}`} style={{ display: 'block', position: 'relative', width: '100%', paddingBottom: '100%', backgroundColor: '#F8FAFC' }}>
        <img 
          src={product.images?.[0]?.url || '/images/placeholder-phone.jpg'} 
          alt={product.name}
          style={{ position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', objectFit: 'contain', padding: '20px' }}
        />
      </Link>

      {/* Content Container */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '8px' }}>
        {/* Brand & Condition */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: '#94A3B8', fontWeight: '600' }}>
          <span>{product.brand}</span>
          <span>{product.condition}</span>
        </div>

        {/* Title */}
        <Link href={`/product/${productId}`}>
          <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0F172A', margin: '0', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {product.name}
          </h3>
        </Link>

        <div style={{ flexGrow: 1 }} />

        {/* Price & Add to Cart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginTop: '4px' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {product.comparePrice && product.comparePrice > product.basePrice && (
              <span style={{ fontSize: '12px', color: '#94A3B8', textDecoration: 'line-through' }}>
                {formatPrice(product.comparePrice)}
              </span>
            )}
            <span style={{ fontSize: '16px', fontWeight: '700', color: '#0F172A' }}>
              {formatPrice(product.basePrice)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#006989', color: 'white', border: 'none', cursor: 'pointer', transition: 'background-color 0.2s' }}
            aria-label="Add to cart"
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#00526b'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#006989'}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

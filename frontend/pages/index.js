import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Truck,
  PackageCheck,
  HeadphonesIcon,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';
import WhatsAppIcon from '../components/ui/WhatsAppIcon';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/product/ProductCard';
import SkeletonLoader from '../components/ui/SkeletonLoader';
import siteConfig from '../config';
import { settingsAPI } from '../lib/api';

const featureItems = [
  { label: 'Nationwide Delivery', Icon: Truck },
  { label: 'Secure Payment', Icon: ShieldCheck },
  { label: 'Genuine Products', Icon: PackageCheck },
  { label: 'Fast Support', Icon: HeadphonesIcon },
];

const ProductCardSkeleton = () => (
  <div className="rounded-2xl border border-surface-border bg-white p-4 shadow-sm">
    <SkeletonLoader height="208px" className="mb-4 rounded-xl" />
    <SkeletonLoader width="80%" height="16px" className="mb-2" />
    <SkeletonLoader width="50%" height="20px" className="mb-4" />
    <SkeletonLoader width="100%" height="40px" className="rounded-xl" />
  </div>
);

function HomePage() {
  const { featuredProducts, hotDeals, loading, error } = useProducts();
  const [settings, setSettings] = useState(null);
  const [heroLoaded, setHeroLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    settingsAPI.get().then(res => {
      if (res.success) setSettings(res.settings);
    }).catch(console.error);
  }, []);

  const heroImages = Array.isArray(settings?.heroImages) && settings.heroImages.length > 0
    ? settings.heroImages.map(img => (typeof img === 'string' ? { url: img } : img))
    : [{ url: settings?.hero?.image?.url || '/images/hero-phone.png' }];

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  // Mocking extra product arrays for "Latest Arrivals" and "Best Sellers" since they aren't provided by the hook directly
  const latestArrivals = featuredProducts ? [...featuredProducts].reverse() : [];
  const bestSellers = hotDeals ? [...hotDeals].reverse() : [];

  const heroTitle = settings?.hero?.title || "The Perfect iPhone\nfor Every Lifestyle";
  const heroSubtitle = settings?.hero?.subtitle || "Discover the latest iPhone 17 Pro Max with premium features, stunning displays, and unmatched performance. Shop now for exclusive deals.";
  const whatsappNumber = settings?.contact?.whatsapp?.[0] || siteConfig.whatsappNumber || "";
  const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}` : "https://wa.me/";

  return (
    <>
      <Head>
        <title>{settings?.storeName || siteConfig.name} — Premium Experience</title>
        <meta name="description" content={heroSubtitle} />
      </Head>

      {/* Hero Section */}
      <section className="bg-white overflow-hidden relative border-b border-surface-border rounded-b-[2.5rem] shadow-sm mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="z-10">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-ink leading-tight mb-6 whitespace-pre-line">
                {settings?.hero?.title || "The Perfect iPhone\nfor Every Lifestyle"}
              </h1>
              <p className="text-lg text-ink-muted leading-relaxed max-w-lg mb-10">
                {settings?.hero?.subtitle || "Discover the latest iPhone 17 Pro Max with premium features, stunning displays, and unmatched performance. Shop now for exclusive deals."}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/shop"
                  className="inline-flex h-12 items-center justify-center gap-2 px-8 rounded-full bg-ink text-white text-sm font-semibold hover:bg-ink-muted shadow-smooth transition-all"
                >
                  Shop Now
                </Link>
                <Link
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 px-8 rounded-full bg-white text-ink text-sm font-semibold hover:bg-surface-muted shadow-sm border border-surface-border transition-all"
                >
                  <WhatsAppIcon className="h-[18px] w-[18px] text-[#25D366]" />
                  Order on WhatsApp
                </Link>
              </div>
            </div>
            <div className="relative flex justify-center items-center z-0 md:h-[450px] h-[300px]">
              <div className="relative w-full h-full max-w-md">
                {heroImages.length > 0 ? (
                  heroImages.map((img, i) => (
                    <div key={i} style={{ position: 'absolute', inset: 0, display: i === currentSlide ? 'block' : 'none', transition: 'opacity 0.5s' }}>
                      <img
                        src={typeof img === 'string' ? img : img.url}
                        alt={`Hero slide ${i + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'contain', background: '#f8fafc', borderRadius: '1rem' }}
                      />
                    </div>
                  ))
                ) : (
                  <SkeletonLoader width="100%" height="100%" className="rounded-3xl" />
                )}
                
                {heroImages.length > 1 && (
                  <>
                    {/* Previous Button */}
                    <button
                      onClick={() => setCurrentSlide(prev => (prev - 1 + heroImages.length) % heroImages.length)}
                      className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 md:-translate-x-6 h-10 w-10 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-surface-muted transition-all flex items-center justify-center text-ink z-10"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>

                    {/* Next Button */}
                    <button
                      onClick={() => setCurrentSlide(prev => (prev + 1) % heroImages.length)}
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 md:translate-x-6 h-10 w-10 rounded-full bg-white shadow-md hover:shadow-lg hover:bg-surface-muted transition-all flex items-center justify-center text-ink z-10"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>

                    {/* Dots Navigation */}
                    <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
                      {heroImages.map((_, i) => (
                        <button key={i} onClick={() => setCurrentSlide(i)}
                          style={{ width: i === currentSlide ? '24px' : '8px', height: '8px', borderRadius: '999px', background: i === currentSlide ? '#006989' : 'rgba(255,255,255,0.6)', border: 'none', cursor: 'pointer', transition: 'all 0.3s' }} 
                          aria-label={`Go to slide ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Bar */}
      <section className="bg-transparent border-b border-surface-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {featureItems.map(({ label, Icon }) => (
              <div key={label} className="flex flex-col items-center text-center gap-3 group">
                <span className="h-14 w-14 inline-flex items-center justify-center rounded-2xl bg-white shadow-sm text-ink group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="font-semibold text-sm text-ink">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promo Banners Section */}
      {settings?.promoBanners && settings.promoBanners.length > 0 && (
        <section className="bg-transparent py-6 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {settings?.promoBanners?.map((promo, idx) => (
                <div key={idx} style={{ backgroundColor: promo.color || '#EAEBED' }} className={`rounded-2xl md:rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-8 relative h-[180px] md:min-h-[220px] promo-pattern-${promo.pattern || 'none'}`}>
                  <div className="relative z-10 max-w-full md:max-w-[60%] mb-2 md:mb-0 pr-24 md:pr-0">
                    <h3 className="text-base md:text-2xl font-bold text-white mb-1 md:mb-2 leading-tight">{promo.title}</h3>
                    <p className="text-white/80 mb-3 md:mb-6 text-xs md:text-sm">{promo.subtitle}</p>
                    {promo.link && (
                      <Link href={promo.link} className="inline-flex h-8 md:h-10 items-center justify-center px-4 md:px-6 rounded-full bg-white text-ink text-xs md:text-sm font-bold shadow-sm hover:-translate-y-0.5 transition-transform">
                        {promo.cta || 'Shop Now'}
                      </Link>
                    )}
                  </div>
                  {promo.image?.url && (
                    <div className="absolute right-0 bottom-0 md:top-0 w-2/3 md:w-1/2 flex items-end justify-end z-10 h-full md:h-auto">
                      <img src={promo.image.url} alt={promo.title} className="max-h-full md:max-h-[110%] w-auto object-contain object-bottom drop-shadow-xl" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Product Sections */}
      <div className="bg-background pb-20">
        
        {/* Featured iPhones */}
        <section className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-ink">
                  Featured iPhones
                </h2>
              </div>
              <Link
                href="/shop?brand=iphone"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark"
              >
                View all
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            
            {loading && (
              <div className="products-grid">
                {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            )}

            {!loading && !error && featuredProducts.length > 0 && (
              <div className="products-grid">
                {featuredProducts.slice(0, 4).map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Flash Deals */}
        <section className="pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-sm font-bold text-red-600 uppercase tracking-wider mb-2 block">Limited Time</span>
                <h2 className="text-3xl font-bold tracking-tight text-ink">
                  Flash Deals
                </h2>
              </div>
              <Link
                href="/shop?filter=hotDeals"
                className="hidden sm:inline-flex items-center gap-1 text-sm font-semibold text-primary hover:text-primary-dark"
              >
                View all deals
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
            
            {!loading && !error && hotDeals.length > 0 && (
              <div className="products-grid">
                {hotDeals.slice(0, 4).map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </section>

      </div>
    </>
  );
}

export default HomePage;
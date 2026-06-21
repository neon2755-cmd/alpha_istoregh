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
} from 'lucide-react';
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

  useEffect(() => {
    settingsAPI.get().then(res => {
      if (res.success) setSettings(res.settings);
    }).catch(console.error);
  }, []);

  // Mocking extra product arrays for "Latest Arrivals" and "Best Sellers" since they aren't provided by the hook directly
  const latestArrivals = featuredProducts ? [...featuredProducts].reverse() : [];
  const bestSellers = hotDeals ? [...hotDeals].reverse() : [];

  const heroTitle = settings?.hero?.title || "The Perfect iPhone\nfor Every Lifestyle";
  const heroSubtitle = settings?.hero?.subtitle || "Discover the latest iPhone 17 Pro Max with premium features, stunning displays, and unmatched performance. Shop now for exclusive deals.";
  const heroImage = settings?.hero?.image?.url || "/images/hero-phone.png";
  const whatsappNumber = settings?.contact?.whatsapp?.[0] || "";
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
                {heroTitle}
              </h1>
              <p className="text-lg text-ink-muted leading-relaxed max-w-lg mb-10">
                {heroSubtitle}
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
                  <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current text-green-500" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.662-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>
                  Order on WhatsApp
                </Link>
              </div>
            </div>
            <div className="relative flex justify-center items-center z-0 md:h-[450px] h-[300px]">
              <div className="relative w-full h-full max-w-md animate-float">
                <Image
                  src={heroImage}
                  alt={heroTitle}
                  fill
                  priority
                  loading="eager"
                  fetchPriority="high"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-contain drop-shadow-2xl bg-surface-muted/20"
                />
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
        <section className="bg-transparent py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {settings.promoBanners.map((promo, idx) => (
                <div key={idx} style={{ backgroundColor: promo.color || '#EAEBED' }} className={`rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:p-8 relative min-h-[220px] promo-pattern-${promo.pattern || 'none'}`}>
                  <div className="relative z-10 max-w-full md:max-w-[60%] mb-20 md:mb-0">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 leading-tight">{promo.title}</h3>
                    <p className="text-white/80 mb-6 text-xs md:text-sm">{promo.subtitle}</p>
                    {promo.link && (
                      <Link href={promo.link} className="inline-flex h-10 items-center justify-center px-6 rounded-full bg-white text-ink text-sm font-bold shadow-sm hover:-translate-y-0.5 transition-transform">
                        {promo.cta || 'Shop Now'}
                      </Link>
                    )}
                  </div>
                  {promo.image?.url && (
                    <div className="absolute right-0 bottom-0 md:top-0 w-2/3 md:w-1/2 flex items-end justify-end z-10">
                      <img src={promo.image.url} alt={promo.title} className="max-h-[110%] object-contain object-bottom drop-shadow-xl" />
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            )}
            
            {!loading && !error && featuredProducts.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
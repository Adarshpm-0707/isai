import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Crown,
  ArrowRight,
  Sparkles,
  FolderTree,
} from 'lucide-react';
import useProducts from '../hooks/useProducts';
import HeroSection from '../components/layout/HeroSection';
import ProductCard from '../components/reusable/ProductCard';
import FlexCarousel from '../components/reusable/FlexCarousel';
import { LotusEmblem } from '../components/reusable/BrandLogo';
import { FloralOrnament } from '../components/reusable/FloralOrnament';
import FaqSection from '../components/layout/FaqSection';

/* ── TRUST BADGES (5 items) ── */
const TRUST_BADGES = [
  {
    icon: <LotusEmblem className="w-5 h-5 sm:w-6 sm:h-6 text-[#DFC18A]" />,
    title: 'Authentic Sarees',
    subtitle: '100% Handloom Guarantee',
  },
  {
    icon: <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-[#DFC18A] stroke-[1.8]" />,
    title: 'Pan India Delivery',
    subtitle: '4-5 Days Express Shipping',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#DFC18A] stroke-[1.8]" />,
    title: 'Secure Payments',
    subtitle: 'GPay & Bank Transfer',
  },
  {
    icon: <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-[#DFC18A] stroke-[1.8]" />,
    title: 'Quality Assured',
    subtitle: 'Inspected by Master Weavers',
  },
  {
    icon: <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-[#DFC18A] stroke-[1.8]" />,
    title: 'Royal Heritage',
    subtitle: 'Kerala • Kanchi • Banaras',
    desktopOnly: true,
  },
];

const DEFAULT_CATEGORY_BG =
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600';

export default function Home() {
  const navigate = useNavigate();
  const { products, categories, fetchProducts, fetchCategories } = useProducts();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  const [activeFilter, setActiveFilter] = useState('All');
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const carouselHeight = isMobile ? '470px' : isTablet ? '530px' : '570px';

  // Derive dynamic categories from categories table and products added by admin
  const dynamicCategories = useMemo(() => {
    const map = new Map();

    (categories || []).forEach((cat) => {
      if (cat && cat.name && cat.name.trim()) {
        const name = cat.name.trim();
        map.set(name.toLowerCase(), {
          id: cat.id,
          name,
          shortName: name,
          category: name,
          img: cat.image_url || cat.image || null,
        });
      }
    });

    (products || []).forEach((p) => {
      if (p && p.category && p.category.trim()) {
        const name = p.category.trim();
        const key = name.toLowerCase();
        const pImg =
          (Array.isArray(p.images) && p.images[0]) || p.image_url || p.image || null;

        if (!map.has(key)) {
          map.set(key, {
            id: key,
            name,
            shortName: name,
            category: name,
            img: pImg,
          });
        } else if (!map.get(key).img && pImg) {
          map.get(key).img = pImg;
        }
      }
    });

    return Array.from(map.values()).map((col) => ({
      ...col,
      img: col.img || DEFAULT_CATEGORY_BG,
    }));
  }, [categories, products]);

  /* 3D Carousel Saree Items: only real categories added in admin/database */
  const categoryCarouselItems = useMemo(() => {
    if (!dynamicCategories || dynamicCategories.length === 0) {
      return [];
    }

    return dynamicCategories.map((col) => ({
      src: col.img || DEFAULT_CATEGORY_BG,
      alt: `${col.name} Handloom Saree Collection`,
      title: col.name,
      subtitle: 'Explore Handcrafted Saree Weaves',
      category: col.category,
    }));
  }, [dynamicCategories]);

  // Newly Arrived products (newest additions from admin, exactly 4 products)
  const newlyArrivedProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    return [...products]
      .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))
      .slice(0, 4)
      .map((p) => ({
        ...p,
        badge: p.badge || 'New Arrival',
      }));
  }, [products]);

  // Derive filter categories for featured section
  const productFilterCategories = useMemo(() => {
    const set = new Set();
    (products || []).forEach((p) => {
      if (p.category && p.category.trim()) set.add(p.category.trim());
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  // Featured products filtered by category (exactly 4 products)
  const featuredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];
    if (activeFilter === 'All') {
      return products.slice(0, 4);
    }
    return products
      .filter(
        (p) =>
          p.category?.toLowerCase() === activeFilter.toLowerCase() ||
          p.name?.toLowerCase().includes(activeFilter.toLowerCase())
      )
      .slice(0, 4);
  }, [products, activeFilter]);

  return (
    <div className="min-h-screen bg-[#120B09] text-[#FDF8F4] font-sans selection:bg-[#C86A27] selection:text-white">
      {/* ── 1. HERO SECTION ── */}
      <HeroSection />

      {/* ── 2. TRUST / FEATURE BADGES STRIP (Luxury Glass Cards) ── */}
      <section className="bg-gradient-to-r from-[#140C0A] via-[#1A100C] to-[#140C0A] border-y border-[#2B1B15] py-4 sm:py-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Laptop / Desktop View (5 Columns) */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-4 items-center">
            {TRUST_BADGES.map((badge, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#1C120E]/60 border border-[#301F18] hover:border-[#DFC18A]/40 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#241611] border border-[#DFC18A]/30 flex items-center justify-center shrink-0 text-[#DFC18A] group-hover:scale-105 group-hover:border-[#DFC18A] transition-all duration-300">
                  {badge.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-[#FDF8F4] group-hover:text-[#DFC18A] transition-colors truncate">
                    {badge.title}
                  </h4>
                  <p className="text-[11px] text-[#A69385] truncate font-light mt-0.5">
                    {badge.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile / Tablet View (Horizontal Swipeable Ribbon) */}
          <div className="lg:hidden flex items-center gap-3 overflow-x-auto no-scrollbar py-1 px-1">
            {TRUST_BADGES.map((badge, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-full bg-[#1C120E]/80 border border-[#301F18] shrink-0"
              >
                <div className="w-6 h-6 rounded-full bg-[#241611] flex items-center justify-center text-[#DFC18A] shrink-0">
                  {badge.icon}
                </div>
                <div className="whitespace-nowrap">
                  <span className="text-[11px] font-medium text-[#FDF8F4] block leading-tight">
                    {badge.title}
                  </span>
                  <span className="text-[9px] text-[#DFC18A]/80 font-light block leading-tight">
                    {badge.subtitle}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. CATEGORIES SECTION (3D CIRCULAR CAROUSEL) ── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="relative flex items-center justify-between mb-8 sm:mb-14">
          <div className="text-center w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#DFC18A]/25 bg-[#19100D] mb-2.5">
              <FolderTree className="w-3 h-3 text-[#DFC18A]" />
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.28em] uppercase text-[#DFC18A]">
                Explore By Weave
              </span>
            </div>
            <h2
              className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#FDF8F4] font-normal leading-tight"
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
            >
              Shop by Category
            </h2>
            <FloralOrnament className="mt-2" />
          </div>

          <Link
            to="/products"
            className="absolute right-0 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#DFC18A]/40 text-xs font-medium text-[#DFC18A] hover:bg-[#DFC18A]/10 transition-colors"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ── FLEX CAROUSEL (RESPONSIVE LIQUID GLASS BEND) ── */}
        {categoryCarouselItems.length === 0 ? (
          <div className="py-14 px-6 rounded-2xl bg-[#1A100C]/60 border border-[#301F18] text-center max-w-xl mx-auto my-4">
            <LotusEmblem className="w-8 h-8 text-[#DFC18A] mx-auto mb-3 opacity-80" />
            <h3 className="font-serif text-lg text-[#FDF8F4]">Handloom Collections Coming Soon</h3>
            <p className="text-xs text-[#A69385] mt-1.5 font-light">
              Weave categories added in the admin dashboard will automatically appear here.
            </p>
          </div>
        ) : (
          <div
            className="w-full relative mx-auto overflow-hidden"
            style={{ width: '100%', height: carouselHeight, position: 'relative' }}
          >
            <FlexCarousel
              items={categoryCarouselItems}
              preset="liquid"
              intro="rise"
              fit="portrait"
              radius={18}
              squeeze={0.2}
              focusOnClick={true}
              captions={true}
              captureWheel={false}
              onSelect={(_index, item) => {
                if (item) {
                  navigate(`/products?category=${encodeURIComponent(item.category || item.title || '')}`);
                }
              }}
            />
          </div>
        )}
      </section>

      {/* ── 4. NEWLY ARRIVED SECTION (UNDER CATEGORIES) ── */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#23140F]">
        {/* Header */}
        <div className="relative flex items-center justify-between mb-8 sm:mb-10">
          <div className="text-center w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#DFC18A]/25 bg-[#19100D] mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-[#DFC18A]" />
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.28em] uppercase text-[#DFC18A]">
                Fresh Off The Loom
              </span>
            </div>
            <h2
              className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#FDF8F4] font-normal leading-tight"
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
            >
              Newly Arrived
            </h2>
            <FloralOrnament className="mt-2" />
          </div>

          <Link
            to="/products?sort=newest"
            className="absolute right-0 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#DFC18A]/40 text-xs font-medium text-[#DFC18A] hover:bg-[#DFC18A]/10 transition-colors"
          >
            <span>Show More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Newly Arrived Grid (Exactly 4 Products) */}
        {newlyArrivedProducts.length === 0 ? (
          <div className="py-14 px-6 rounded-2xl bg-[#1A100C]/60 border border-[#301F18] text-center max-w-xl mx-auto">
            <LotusEmblem className="w-8 h-8 text-[#DFC18A] mx-auto mb-3 opacity-80" />
            <h3 className="font-serif text-lg text-[#FDF8F4]">New Arrivals Coming Soon</h3>
            <p className="text-xs text-[#A69385] mt-1.5 font-light">
              Newly created sarees added in the admin dashboard will automatically appear here.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
              {newlyArrivedProducts.map((product) => (
                <ProductCard
                  key={`new-${product.id}`}
                  product={product}
                  badge={product.badge}
                  rating={product.rating}
                  reviewsCount={product.review_count || product.reviewsCount}
                  originalPrice={product.original_price || product.price}
                />
              ))}
            </div>

            {/* Show More New Arrivals Button */}
            <div className="mt-8 sm:mt-10 text-center">
              <button
                type="button"
                onClick={() => navigate('/products?sort=newest')}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full border border-[#DFC18A]/50 bg-[#1A100C] hover:bg-[#DFC18A] text-[#DFC18A] hover:text-[#120B09] text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-lg group cursor-pointer"
              >
                <span>Show More New Arrivals</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </>
        )}
      </section>

      {/* ── 5. FEATURED PRODUCTS SECTION (UNDER NEWLY ARRIVED) ── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#23140F]">
        {/* Header */}
        <div className="relative flex items-center justify-between mb-8 sm:mb-10">
          <div className="text-center w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#DFC18A]/25 bg-[#19100D] mb-2.5">
              <LotusEmblem className="w-3.5 h-3.5" />
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.28em] uppercase text-[#DFC18A]">
                Curated Spotlight
              </span>
            </div>
            <h2
              className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#FDF8F4] font-normal leading-tight"
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
            >
              Featured Products
            </h2>
            <FloralOrnament className="mt-2" />
          </div>

          <Link
            to={
              activeFilter === 'All'
                ? '/products'
                : `/products?category=${encodeURIComponent(activeFilter)}`
            }
            className="absolute right-0 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#DFC18A]/40 text-xs font-medium text-[#DFC18A] hover:bg-[#DFC18A]/10 transition-colors"
          >
            <span>Show More</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Dynamic Category Filter Tabs */}
        {productFilterCategories.length > 1 && (
          <div className="flex items-center justify-center gap-2 flex-wrap mb-8 sm:mb-10">
            {productFilterCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-medium tracking-wide transition-all cursor-pointer ${
                  activeFilter === cat
                    ? 'bg-[#DFC18A] text-[#120B09] font-semibold shadow-[0_2px_12px_rgba(223,193,138,0.35)]'
                    : 'bg-[#1C120E] text-[#C7B5A7] hover:text-[#FDF8F4] border border-[#2F1C15] hover:border-[#DFC18A]/40'
                }`}
              >
                {cat === 'All' ? 'All Sarees' : cat}
              </button>
            ))}
          </div>
        )}

        {/* Featured Products Grid (Exactly 4 Products) */}
        {featuredProducts.length === 0 ? (
          <div className="py-16 px-6 rounded-2xl bg-[#1A100C]/60 border border-[#301F18] text-center max-w-xl mx-auto">
            <LotusEmblem className="w-8 h-8 text-[#DFC18A] mx-auto mb-3 opacity-80" />
            <h3 className="font-serif text-lg text-[#FDF8F4]">
              {products.length === 0
                ? 'No Featured Sarees Available'
                : `No Sarees Found in ${activeFilter}`}
            </h3>
            <p className="text-xs text-[#A69385] mt-1.5 font-light">
              {products.length === 0
                ? 'Products added in the admin dashboard will automatically appear here.'
                : 'Explore other categories or view our full catalog.'}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={`feat-${product.id}`}
                  product={product}
                  badge={product.badge}
                  rating={product.rating}
                  reviewsCount={product.review_count || product.reviewsCount}
                  originalPrice={product.original_price || product.price}
                />
              ))}
            </div>

            {/* Show More Products Button with Selected Category Destination */}
            <div className="mt-8 sm:mt-10 text-center">
              <button
                type="button"
                onClick={() => {
                  if (activeFilter === 'All') {
                    navigate('/products');
                  } else {
                    navigate(`/products?category=${encodeURIComponent(activeFilter)}`);
                  }
                }}
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-[#DFC18A]/50 bg-[#1A100C] hover:bg-[#DFC18A] text-[#DFC18A] hover:text-[#120B09] text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-lg group cursor-pointer"
              >
                <span>
                  {activeFilter === 'All'
                    ? 'Show More Products'
                    : `Show More ${activeFilter} Sarees`}
                </span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </>
        )}
      </section>

      {/* ── 6. FREQUENTLY ASKED QUESTIONS (FAQ) ── */}
      <FaqSection />
    </div>
  );
}

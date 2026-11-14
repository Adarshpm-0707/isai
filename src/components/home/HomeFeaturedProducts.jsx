import React, { useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { LotusEmblem } from '../reusable/BrandLogo';
import ProductSectionHeader from '../reusable/ProductSectionHeader';
import { ElasticReel } from '../ui/elastic-reel';

export default function HomeFeaturedProducts({
  products = [],
  featuredProducts = [],
  productFilterCategories = [],
  activeFilter = 'All',
  setActiveFilter = () => {},
}) {
  const navigate = useNavigate();
  const reelRef = useRef(null);

  // Derive products list filtered by category, fallback to featured or products
  const displayProducts = useMemo(() => {
    const base = featuredProducts.length > 0 ? featuredProducts : products;
    if (!base || base.length === 0) return [];
    if (!activeFilter || activeFilter === 'All') {
      return base.slice(0, 5);
    }
    const filtered = base.filter(
      (p) =>
        p.category?.toLowerCase() === activeFilter.toLowerCase() ||
        p.name?.toLowerCase().includes(activeFilter.toLowerCase())
    );
    return filtered.length > 0 ? filtered.slice(0, 5) : base.slice(0, 5);
  }, [featuredProducts, products, activeFilter]);

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#23140F] relative">
      {/* ── TITLES SECTION: Elevated Royal Header ── */}
      <ProductSectionHeader
        badge="Curated Spotlight • Master Weaves"
        badgeIcon={LotusEmblem}
        title="Featured"
        titleAccent="Creations"
        subtitle="Meticulously curated heritage sarees celebrated for their regal motifs, luminous silk luster, and generational master craftsmanship."
        actionText="Explore All"
        actionLink="/products"
      />

      {/* ── DYNAMIC CATEGORY FILTER TABS ── */}
      {productFilterCategories && productFilterCategories.length > 1 && (
        <div className="flex items-center justify-center gap-2 sm:gap-2.5 flex-wrap mb-6 sm:mb-8">
          {productFilterCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveFilter(cat)}
              className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium tracking-wide transition-all cursor-pointer active:scale-95 ${
                activeFilter === cat
                  ? 'bg-[#DFC18A] text-[#120B09] font-semibold shadow-[0_2px_12px_rgba(223,193,138,0.35)] scale-105'
                  : 'bg-[#1C120E] text-[#C7B5A7] hover:text-[#FDF8F4] border border-[#2F1C15] hover:border-[#DFC18A]/40'
              }`}
            >
              {cat === 'All' ? 'All Sarees' : cat}
            </button>
          ))}
        </div>
      )}

      {/* ── FEATURED PRODUCTS SHOWCASE: ELASTIC REEL ANIMATION (FULLY RESPONSIVE) ── */}
      {displayProducts.length === 0 ? (
        <div className="py-16 px-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#1A100C]/70 to-[#140C08]/90 border border-[#301F18] text-center max-w-xl mx-auto shadow-xl">
          <LotusEmblem className="w-9 h-9 text-[#DFC18A] mx-auto mb-3 opacity-80" />
          <h3 className="font-serif text-lg sm:text-xl text-[#FDF8F4]">
            No Featured Sarees Available
          </h3>
          <p className="text-xs sm:text-sm text-[#A69385] mt-2 font-light max-w-md mx-auto">
            {products.length === 0
              ? 'Products added in the admin dashboard will automatically appear here.'
              : `No sarees found in "${activeFilter}". Explore our other categories.`}
          </p>
        </div>
      ) : (
        <>
          <div className="w-full">
            <ElasticReel
              ref={reelRef}
              items={displayProducts}
              initialIndex={0}
              className="my-2"
            />
          </div>

          {/* Bottom Show More Button */}
          <div className="mt-8 sm:mt-12 text-center">
            <button
              type="button"
              onClick={() => {
                if (activeFilter === 'All') {
                  navigate('/products');
                } else {
                  navigate(`/products?category=${encodeURIComponent(activeFilter)}`);
                }
              }}
              className="inline-flex items-center gap-2.5 px-6 sm:px-8 py-3 sm:py-3.5 rounded-full border border-[#DFC18A]/50 bg-gradient-to-r from-[#1A100C] via-[#221510] to-[#1A100C] hover:border-[#DFC18A] hover:bg-[#DFC18A] text-[#DFC18A] hover:text-[#120B09] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-[0_6px_20px_rgba(0,0,0,0.5)] group cursor-pointer active:scale-95"
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
  );
}

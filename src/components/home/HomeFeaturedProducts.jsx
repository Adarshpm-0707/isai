import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { LotusEmblem } from '../reusable/BrandLogo';
import ProductSectionHeader from '../reusable/ProductSectionHeader';
import { ElasticReel } from '../ui/elastic-reel';

export default function HomeFeaturedProducts({
  products = [],
  featuredProducts = [],
}) {
  const navigate = useNavigate();
  const reelRef = useRef(null);

  // Use featured products, fallback to first 4 products if featured list is empty
  const displayProducts =
    featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#23140F] relative">
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

      {/* ── FEATURED PRODUCTS SHOWCASE: ELASTIC REEL ── */}
      {displayProducts.length === 0 ? (
        <div className="py-16 px-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#1A100C]/70 to-[#140C08]/90 border border-[#301F18] text-center max-w-xl mx-auto shadow-xl">
          <LotusEmblem className="w-9 h-9 text-[#DFC18A] mx-auto mb-3 opacity-80" />
          <h3 className="font-serif text-lg sm:text-xl text-[#FDF8F4]">
            No Featured Sarees Available
          </h3>
          <p className="text-xs sm:text-sm text-[#A69385] mt-2 font-light max-w-md mx-auto">
            Products added in the admin dashboard will automatically appear here.
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
          <div className="mt-10 sm:mt-14 text-center">
            <button
              type="button"
              onClick={() => navigate('/products')}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-[#DFC18A]/50 bg-gradient-to-r from-[#1A100C] via-[#221510] to-[#1A100C] hover:border-[#DFC18A] hover:bg-[#DFC18A] text-[#DFC18A] hover:text-[#120B09] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-[0_6px_20px_rgba(0,0,0,0.5)] group cursor-pointer active:scale-95"
            >
              <span>Show More Products</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </>
      )}
    </section>
  );
}

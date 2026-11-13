import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { LotusEmblem } from '../reusable/BrandLogo';
import ProductCard from '../reusable/ProductCard';
import ProductSectionHeader from '../reusable/ProductSectionHeader';

export default function HomeNewlyArrived({ newlyArrivedProducts }) {
  const navigate = useNavigate();

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#23140F] relative">
      {/* ── TITLES SECTION: Elevated Royal Header ── */}
      <ProductSectionHeader
        badge="Fresh Off The Loom • Autumn Drops"
        badgeIcon={Sparkles}
        title="Newly Arrived"
        titleAccent="Treasures"
        subtitle="Be the first to drape our newest loom creations, showcasing contemporary palettes paired with traditional heritage zari."
        actionText="Explore All"
        actionLink="/products?sort=newest"
      />

      {/* ── NEW ARRIVALS GRID ── */}
      {newlyArrivedProducts.length === 0 ? (
        <div className="py-16 px-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#1A100C]/70 to-[#140C08]/90 border border-[#301F18] text-center max-w-xl mx-auto shadow-xl">
          <LotusEmblem className="w-9 h-9 text-[#DFC18A] mx-auto mb-3 opacity-80" />
          <h3 className="font-serif text-lg sm:text-xl text-[#FDF8F4]">New Arrivals Coming Soon</h3>
          <p className="text-xs sm:text-sm text-[#A69385] mt-2 font-light max-w-md mx-auto">
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
          <div className="mt-10 sm:mt-14 text-center">
            <button
              type="button"
              onClick={() => navigate('/products?sort=newest')}
              className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-[#DFC18A]/50 bg-gradient-to-r from-[#1A100C] via-[#221510] to-[#1A100C] hover:border-[#DFC18A] hover:bg-[#DFC18A] text-[#DFC18A] hover:text-[#120B09] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-[0_6px_20px_rgba(0,0,0,0.5)] group cursor-pointer active:scale-95"
            >
              <span>Show More New Arrivals</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </>
      )}
    </section>
  );
}

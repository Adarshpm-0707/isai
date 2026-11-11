import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { LotusEmblem } from '../reusable/BrandLogo';
import { FloralOrnament } from '../reusable/FloralOrnament';
import ProductCard from '../reusable/ProductCard';

export default function HomeNewlyArrived({ newlyArrivedProducts }) {
  const navigate = useNavigate();

  return (
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
  );
}


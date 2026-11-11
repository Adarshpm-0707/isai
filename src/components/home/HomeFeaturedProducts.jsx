import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { LotusEmblem } from '../reusable/BrandLogo';
import { FloralOrnament } from '../reusable/FloralOrnament';
import ProductCard from '../reusable/ProductCard';

export default function HomeFeaturedProducts({
  products,
  featuredProducts,
  productFilterCategories,
  activeFilter,
  setActiveFilter,
}) {
  const navigate = useNavigate();

  return (
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
  );
}

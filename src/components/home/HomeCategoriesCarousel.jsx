import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FolderTree, ArrowRight } from 'lucide-react';
import { LotusEmblem } from '../reusable/BrandLogo';
import { FloralOrnament } from '../reusable/FloralOrnament';
import FlexCarousel from '../reusable/FlexCarousel';

export default function HomeCategoriesCarousel({
  carouselHeight,
  categoryCarouselItems,
}) {
  const navigate = useNavigate();

  return (
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
  );
}


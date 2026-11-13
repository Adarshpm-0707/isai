import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderTree } from 'lucide-react';
import { LotusEmblem } from '../reusable/BrandLogo';
import FlexCarousel from '../reusable/FlexCarousel';
import ProductSectionHeader from '../reusable/ProductSectionHeader';

export default function HomeCategoriesCarousel({
  carouselHeight,
  categoryCarouselItems,
}) {
  const navigate = useNavigate();

  return (
    <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* ── TITLES SECTION: Elevated Royal Header ── */}
      <ProductSectionHeader
        badge="Explore By Weave • Heritage Silhouettes"
        badgeIcon={FolderTree}
        title="Shop by"
        titleAccent="Category"
        subtitle="Discover authentic handlooms organized by traditional weave origin, zari richness, and occasion."
        actionText="All Categories"
        actionLink="/products"
      />

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


import React from 'react';
import useHomeData from '../hooks/useHomeData';
import HeroSection from '../components/layout/HeroSection';
import FaqSection from '../components/layout/FaqSection';
import HomeCategoriesCarousel from '../components/home/HomeCategoriesCarousel';
import HomeNewlyArrived from '../components/home/HomeNewlyArrived';
import HomeFeaturedProducts from '../components/home/HomeFeaturedProducts';

export default function Home() {
  const {
    products,
    activeFilter,
    setActiveFilter,
    carouselHeight,
    categoryCarouselItems,
    newlyArrivedProducts,
    productFilterCategories,
    featuredProducts,
  } = useHomeData();

  return (
    <div className="min-h-screen bg-[#120B09] text-[#FDF8F4] font-sans selection:bg-[#C86A27] selection:text-white">
      {/* ── 1. HERO SECTION ── */}
      <HeroSection />

      {/* ── 2. CATEGORIES SECTION (3D CIRCULAR CAROUSEL) ── */}
      <HomeCategoriesCarousel
        carouselHeight={carouselHeight}
        categoryCarouselItems={categoryCarouselItems}
      />

      {/* ── 4. NEWLY ARRIVED SECTION ── */}
      <HomeNewlyArrived newlyArrivedProducts={newlyArrivedProducts} />

      {/* ── 5. FEATURED PRODUCTS SECTION ── */}
      <HomeFeaturedProducts
        products={products}
        featuredProducts={featuredProducts}
        productFilterCategories={productFilterCategories}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
      />

      {/* ── 6. FREQUENTLY ASKED QUESTIONS (FAQ) ── */}
      <FaqSection />
    </div>
  );
}

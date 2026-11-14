import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import heroLaptopBg from '../../assets/hero_laptop_bg.jpg';
import heroModelImg from '../../assets/hero_saree_model.jpg';
import HomeSplitText from '../home/HomeSplitText';

export default function HeroSection() {
  const navigate = useNavigate();

  // Track whether the initial SareeLoader has unveiled the home page
  const [isLoaderDone, setIsLoaderDone] = useState(() => {
    if (typeof window !== 'undefined') {
      return Boolean(window.__sareeLoaderDone);
    }
    return true;
  });

  useEffect(() => {
    if (isLoaderDone) return;

    const handleLoaderComplete = () => {
      setIsLoaderDone(true);
    };

    window.addEventListener('saree-loader-complete', handleLoaderComplete);

    // Fast fallback timer so hero content always displays immediately
    const fallbackTimer = setTimeout(() => {
      setIsLoaderDone(true);
    }, 2400);

    return () => {
      window.removeEventListener('saree-loader-complete', handleLoaderComplete);
      clearTimeout(fallbackTimer);
    };
  }, [isLoaderDone]);

  return (
    <section className="relative w-full overflow-hidden bg-[#0E0705] border-b border-[#2A1B15]">
      {/* ── 1. DESKTOP / LAPTOP HERO (hidden on mobile/tablet, block on lg) ── */}
      <div className="hidden lg:block relative w-full min-h-[620px] xl:min-h-[680px] 2xl:min-h-[740px] overflow-hidden">
        {/* Full-width Panoramic Royal Temple Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroLaptopBg}
            alt="Isai Tarang Heritage Sarees - Pure Silk Handloom Collection"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-right xl:object-center transition-transform duration-1000 scale-100 hover:scale-[1.015]"
          />
        </div>

        {/* Container for Left Text & Actions */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 xl:px-8 h-full flex flex-col justify-center min-h-[620px] xl:min-h-[680px] 2xl:min-h-[740px] py-16">
          <div className="max-w-xl xl:max-w-2xl space-y-6">
            {/* Eyebrow / Collection Label */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={isLoaderDone ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="flex items-center gap-3"
            >
              <span className="text-xs font-semibold tracking-[0.28em] uppercase text-[#DFC18A]">
                Woven Heritage Collection
              </span>
            </motion.div>

            {/* Main Headline with GSAP SplitText Characters Animation */}
            <HomeSplitText variant="desktop" />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={isLoaderDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.7, delay: 0.45 }}
              className="text-[#EADFC9] text-base xl:text-lg leading-relaxed max-w-lg font-light drop-shadow-sm"
            >
              Timeless sarees, thoughtfully chosen for every story you carry.
            </motion.p>

            {/* CTA Buttons — Side by Side */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={isLoaderDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.7, delay: 0.55 }}
              className="pt-2 flex flex-row items-center gap-4"
            >
              <button
                onClick={() => navigate('/products')}
                type="button"
                className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-[#163326] hover:bg-[#204634] text-[#FDF8F4] text-xs xl:text-sm font-semibold tracking-[0.16em] uppercase border border-[#2A563E] transition-all duration-300 shadow-[0_4px_20px_rgba(22,51,38,0.55)] cursor-pointer hover:shadow-[0_8px_30px_rgba(22,51,38,0.7)] hover:scale-[1.03]"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => navigate('/about#our-story')}
                type="button"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-[#C8A27A]/80 hover:border-[#DFC18A] bg-[#120B09]/40 hover:bg-[#DFC18A]/10 text-[#DFC18A] hover:text-[#FDF8F4] text-xs xl:text-sm font-medium tracking-[0.18em] uppercase transition-all duration-300 cursor-pointer hover:scale-[1.03] backdrop-blur-sm"
              >
                <span>Our Story</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── 2. MOBILE & TABLET HERO (< lg only) ── */}
      <div
        className="lg:hidden relative w-full overflow-hidden flex flex-col justify-end"
        style={{
          height: 'calc(100svh - 62px)',
          minHeight: '520px',
          maxHeight: '880px',
        }}
      >
        {/* Background: Full bleed royal red saree model */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroModelImg}
            alt="Indian woman draped in pure silk saree - Isai Tarang"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            className="w-full h-full object-cover object-center sm:object-top"
          />
          {/* Layered gradients for depth & text legibility */}
          <div
            className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0E0705] via-[#0E0705]/85 via-50% to-transparent pointer-events-none"
            style={{ height: '62%' }}
          />
          {/* Subtle horizontal vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0E0705]/50 via-transparent to-[#0E0705]/30 pointer-events-none" />
        </div>

        {/* BOTTOM: Content Overlay (text + CTAs) */}
        <div className="relative z-20 px-5 sm:px-8 pb-7 sm:pb-9 pt-10 max-w-xl">
          {/* Eyebrow line */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={isLoaderDone ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="flex items-center gap-2 mb-2 sm:mb-2.5"
          >
            <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.28em] uppercase text-[#DFC18A]">
              Woven Heritage Collection
            </span>
          </motion.div>

          {/* Main Headline with GSAP SplitText Characters Animation */}
          <HomeSplitText variant="mobile" />

          {/* Subtitle — airy, light */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={isLoaderDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.65, delay: 0.4 }}
            className="text-[#D6C9B8] text-xs sm:text-[13.5px] leading-relaxed font-light mb-4 sm:mb-5 max-w-[320px] drop-shadow-sm"
          >
            Timeless sarees, thoughtfully chosen for every story you carry.
          </motion.p>

          {/* CTA Button Row — side by side */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={isLoaderDone ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.65, delay: 0.5 }}
            className="flex items-center gap-2.5 sm:gap-3.5"
          >
            {/* Primary — filled forest green pill */}
            <button
              onClick={() => navigate('/products')}
              type="button"
              className="group flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#163326] active:bg-[#204634] text-[#FDF8F4] text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase border border-[#2A563E] shadow-[0_4px_20px_rgba(22,51,38,0.55)] transition-all duration-200 cursor-pointer active:scale-95"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-active:translate-x-1 shrink-0" />
            </button>

            {/* Secondary — ghost gold outline */}
            <button
              onClick={() => navigate('/about#our-story')}
              type="button"
              className="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-full border border-[#C8A27A]/80 bg-[#120B09]/50 backdrop-blur-sm text-[#DFC18A] active:text-[#FDF8F4] text-[11px] sm:text-xs font-semibold tracking-[0.14em] uppercase transition-all duration-200 cursor-pointer active:bg-[#DFC18A]/10 active:scale-95"
            >
              <span>Our Story</span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

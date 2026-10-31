import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import heroLaptopBg from '../../assets/hero_laptop_bg.jpg';
import heroModelImg from '../../assets/hero_saree_model.jpg';
import { LotusEmblem } from '../reusable/BrandLogo';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="relative w-full overflow-hidden bg-[#120B09] border-b border-[#2A1B15]">
      {/* ── 1. DESKTOP / LAPTOP HERO (hidden on mobile, block on lg) ── */}
      <div className="hidden lg:block relative w-full min-h-[620px] xl:min-h-[680px] 2xl:min-h-[720px] overflow-hidden">
        {/* Full-width Panoramic Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroLaptopBg}
            alt="Isaitarang Heritage Sarees - Pure Silk Handloom Collection"
            className="w-full h-full object-cover object-right xl:object-center transition-transform duration-1000 scale-100 hover:scale-[1.02]"
          />
          {/* Multi-stop Luxury Espresso Gradient Overlay for crisp text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#120B09] via-[#120B09]/90 via-35% via-[#120B09]/55 via-60% to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#120B09] via-[#120B09]/70 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#120B09]/60 to-transparent pointer-events-none" />
        </div>

        {/* Container for Left Text & Actions */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 xl:px-8 h-full flex flex-col justify-center min-h-[620px] xl:min-h-[680px] 2xl:min-h-[720px] py-16">
          <div className="max-w-xl xl:max-w-2xl space-y-6">
            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-serif text-5xl xl:text-6xl 2xl:text-7xl font-normal text-[#FDF8F4] leading-[1.1] drop-shadow-[0_3px_16px_rgba(0,0,0,0.7)]"
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
            >
              Woven in Heritage.
              <br />
              <span className="italic font-light text-[#D27A58]">
                Worn with Grace.
              </span>
            </motion.h1>

            {/* Decorative Divider */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="w-16 h-[1.5px] bg-[#C8A27A] origin-left"
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-[#EADFC9] text-base xl:text-lg leading-relaxed max-w-lg font-light drop-shadow-sm"
            >
              Timeless sarees, thoughtfully chosen for every story you carry.
            </motion.p>

            {/* Collection Eyebrow / Label */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-[#DFC18A] text-xs font-semibold tracking-[0.28em] uppercase pt-1"
            >
              THE ISAI TARANG EDIT
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="pt-2 flex flex-col gap-3.5 w-full max-w-[310px]"
            >
              <button
                onClick={() => navigate('/products')}
                type="button"
                className="group w-full inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-[#163326] hover:bg-[#204634] text-[#FDF8F4] text-xs xl:text-sm font-medium tracking-[0.16em] uppercase border border-[#2A563E] transition-all duration-300 shadow-xl cursor-pointer hover:shadow-[0_8px_30px_rgba(22,51,38,0.5)] hover:scale-[1.02]"
              >
                <span>EXPLORE THE COLLECTION</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => navigate('/about#our-story')}
                type="button"
                className="w-full inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-[#C8A27A] hover:border-[#DFC18A] bg-transparent hover:bg-[#DFC18A]/10 text-[#DFC18A] hover:text-[#FDF8F4] text-xs xl:text-sm font-medium tracking-[0.18em] uppercase transition-all duration-300 cursor-pointer hover:scale-[1.02]"
              >
                <span>OUR STORY</span>
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── 2. MOBILE HERO — Premium Redesign (< lg only) ── */}
      <div className="lg:hidden relative w-full overflow-hidden" style={{ minHeight: '100svh' }}>

        {/* ── Background: Full bleed saree model ── */}
        <div className="absolute inset-0 z-0">
          <img
            src={heroModelImg}
            alt="Indian woman draped in silk saree"
            className="w-full h-full object-cover object-top"
          />
          {/* Layered gradients for depth & text legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#120B09]/70 via-transparent via-40% to-[#120B09]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#120B09] via-[#120B09]/40 to-transparent" style={{ height: '55%', top: 'auto' }} />
          {/* Subtle left vignette */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#120B09]/60 via-transparent to-transparent" />
        </div>

        {/* ── TOP: Brand Label Strip ── */}
        <div className="absolute top-0 left-0 right-0 z-20 pt-4 pb-3 px-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LotusEmblem className="w-6 h-6 object-contain filter drop-shadow-[0_0_8px_rgba(223,193,138,0.6)]" />
            <span className="text-[9px] font-semibold tracking-[0.28em] uppercase text-[#DFC18A]/90">
              ISAI TARANG
            </span>
          </div>
          <span className="text-[8px] font-semibold tracking-[0.22em] uppercase text-[#C7B5A7]/70 border border-[#DFC18A]/20 px-2 py-1 rounded-full bg-[#120B09]/50 backdrop-blur-sm">
            THE EDIT
          </span>
        </div>

        {/* ── BOTTOM: Content Overlay (text + CTAs) ── */}
        <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-8 pt-14">
          {/* Micro eyebrow line */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center gap-2.5 mb-3"
          >
            <span className="w-5 h-px bg-[#DFC18A]" />
            <span className="text-[9px] font-semibold tracking-[0.30em] uppercase text-[#DFC18A]">
              Woven Heritage Collection
            </span>
          </motion.div>

          {/* Main Headline — clean two-line luxury serif */}
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="font-serif leading-[1.08] mb-3 drop-shadow-[0_4px_20px_rgba(0,0,0,0.9)]"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 9vw, 2.6rem)' }}
          >
            <span className="block text-[#FDF8F4] font-normal">Woven in Heritage.</span>
            <span className="block italic font-light text-[#D4855A] mt-0.5">Worn with Grace.</span>
          </motion.h1>

          {/* Animated gold rule */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.35 }}
            className="w-14 h-[1.5px] bg-gradient-to-r from-[#DFC18A] to-[#C8A27A] origin-left mb-3"
          />

          {/* Subtitle — airy, light */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.42 }}
            className="text-[#D6C9B8] text-[13px] leading-relaxed font-light mb-5 max-w-[280px]"
          >
            Timeless sarees, thoughtfully chosen for every story you carry.
          </motion.p>

          {/* CTA Button Row — side by side on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.52 }}
            className="flex items-center gap-3 mb-6"
          >
            {/* Primary — filled forest green pill */}
            <button
              onClick={() => navigate('/products')}
              type="button"
              className="group flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-[#163326] active:bg-[#204634] text-[#FDF8F4] text-[10px] font-semibold tracking-[0.15em] uppercase border border-[#2A563E] shadow-[0_4px_20px_rgba(22,51,38,0.55)] transition-all duration-200 cursor-pointer"
            >
              <span>Shop Now</span>
              <ArrowRight className="w-3 h-3 transition-transform duration-200 group-active:translate-x-1 shrink-0" />
            </button>

            {/* Secondary — ghost gold outline */}
            <button
              onClick={() => navigate('/about#our-story')}
              type="button"
              className="flex-1 inline-flex items-center justify-center px-4 py-3 rounded-full border border-[#C8A27A]/70 bg-[#120B09]/40 backdrop-blur-sm text-[#DFC18A] text-[10px] font-semibold tracking-[0.15em] uppercase transition-all duration-200 cursor-pointer active:bg-[#DFC18A]/10"
            >
              <span>Our Story</span>
            </button>
          </motion.div>


        </div>
      </div>
    </section>
  );
}

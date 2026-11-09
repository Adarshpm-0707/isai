import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, RotateCcw, Crown, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';
import useProducts from '../hooks/useProducts';
import HeroSection from '../components/layout/HeroSection';
import ProductCard from '../components/reusable/ProductCard';
import { LotusEmblem } from '../components/reusable/BrandLogo';
import { FloralOrnament } from '../components/reusable/FloralOrnament';
import FaqSection from '../components/layout/FaqSection';
import storyModelImg from '../assets/story_saree_model.jpg';

/* ── 6 COLLECTIONS WITH RICH METADATA ── */
const OUR_COLLECTIONS = [
  {
    name: 'Kanchipuram Sarees',
    shortName: 'Kanchipuram',
    tag: 'Temple Silk',
    category: 'Kanchipuram',
    img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Pure Silk Sarees',
    shortName: 'Pure Silk',
    tag: 'Zari Brocade',
    category: 'Silk',
    img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Soft Cotton Sarees',
    shortName: 'Cotton',
    tag: 'Everyday Grace',
    category: 'Cotton',
    img: 'https://images.unsplash.com/photo-1610030470258-a4005cfa2c5a?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Georgette Sarees',
    shortName: 'Georgette',
    tag: 'Flowing Drape',
    category: 'Georgette',
    img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Chiffon Sarees',
    shortName: 'Chiffon',
    tag: 'Airy Elegance',
    category: 'Chiffon',
    img: 'https://images.unsplash.com/photo-1583391265517-35bbdba01229?auto=format&fit=crop&q=80&w=600',
  },
  {
    name: 'Festive Collection',
    shortName: 'Festive',
    tag: 'Occasion Edit',
    category: 'Festive',
    img: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=600',
  },
];

/* ── TRUST BADGES (5 items) ── */
const TRUST_BADGES = [
  {
    icon: <LotusEmblem className="w-5 h-5 sm:w-6 sm:h-6 text-[#DFC18A]" />,
    title: 'Authentic Sarees',
    subtitle: '100% Handloom Guarantee',
  },
  {
    icon: <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-[#DFC18A] stroke-[1.8]" />,
    title: 'Pan India Delivery',
    subtitle: '4-5 Days Express Shipping',
  },
  {
    icon: <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6 text-[#DFC18A] stroke-[1.8]" />,
    title: 'Secure Payments',
    subtitle: 'GPay & Bank Transfer',
  },
  {
    icon: <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6 text-[#DFC18A] stroke-[1.8]" />,
    title: 'Quality Assured',
    subtitle: 'Inspected by Master Weavers',
  },
  {
    icon: <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-[#DFC18A] stroke-[1.8]" />,
    title: 'Royal Heritage',
    subtitle: 'Kerala • Kanchi • Banaras',
    desktopOnly: true,
  },
];

/* ── 5 FEATURED PRODUCTS (EXACTLY MATCHING THE MOCKUP) ── */
const FEATURED_FALLBACKS = [
  {
    id: 'kanchipuram-silk-saree',
    name: 'Kanchipuram Silk Saree',
    price: 5999,
    originalPrice: 7999,
    badge: 'Bestseller',
    rating: 5.0,
    reviewsCount: 124,
    stock: 10,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'soft-cotton-saree',
    name: 'Soft Cotton Saree',
    price: 1999,
    originalPrice: 2999,
    badge: '20% OFF',
    rating: 4.9,
    reviewsCount: 89,
    stock: 14,
    image: 'https://images.unsplash.com/photo-1610030470258-a4005cfa2c5a?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'georgette-saree',
    name: 'Georgette Saree',
    price: 2499,
    originalPrice: 3499,
    badge: null,
    rating: 4.8,
    reviewsCount: 67,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'banarasi-silk-saree',
    name: 'Banarasi Silk Saree',
    price: 4999,
    originalPrice: 6499,
    badge: null,
    rating: 4.9,
    reviewsCount: 93,
    stock: 6,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 'chiffon-saree',
    name: 'Chiffon Saree',
    price: 2299,
    originalPrice: 3499,
    badge: null,
    rating: 4.7,
    reviewsCount: 58,
    stock: 12,
    image: 'https://images.unsplash.com/photo-1583391265517-35bbdba01229?auto=format&fit=crop&q=80&w=600',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { products, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const [activeFilter, setActiveFilter] = useState('All');

  // Use database products if available, with fallback to mockup featured items
  const baseProducts =
    products && products.length >= 5
      ? products.slice(0, 8).map((p, idx) => ({
          ...p,
          badge: idx === 0 ? 'Bestseller' : idx === 1 ? '20% OFF' : null,
          rating: idx === 0 ? 5.0 : 4.8 + (idx % 3) * 0.1,
          reviewsCount: [124, 89, 67, 93, 58][idx] || 75,
          originalPrice: p.price ? Math.round(p.price * 1.35) : null,
        }))
      : FEATURED_FALLBACKS;

  const displayProducts =
    activeFilter === 'All'
      ? baseProducts.slice(0, 5)
      : baseProducts.filter(
          (p) =>
            p.category?.toLowerCase() === activeFilter.toLowerCase() ||
            p.name?.toLowerCase().includes(activeFilter.toLowerCase())
        );

  const productFilterCategories = ['All', 'Kanchipuram', 'Silk', 'Cotton', 'Festive'];

  return (
    <div className="min-h-screen bg-[#120B09] text-[#FDF8F4] font-sans selection:bg-[#C86A27] selection:text-white">
      {/* ── 1. HERO SECTION ── */}
      <HeroSection />

      {/* ── 2. TRUST / FEATURE BADGES STRIP (Luxury Glass Cards) ── */}
      <section className="bg-gradient-to-r from-[#140C0A] via-[#1A100C] to-[#140C0A] border-y border-[#2B1B15] py-4 sm:py-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Laptop / Desktop View (5 Columns) */}
          <div className="hidden lg:grid lg:grid-cols-5 gap-4 items-center">
            {TRUST_BADGES.map((badge, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#1C120E]/60 border border-[#301F18] hover:border-[#DFC18A]/40 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)] group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#241611] border border-[#DFC18A]/30 flex items-center justify-center shrink-0 text-[#DFC18A] group-hover:scale-105 group-hover:border-[#DFC18A] transition-all duration-300">
                  {badge.icon}
                </div>
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-[#FDF8F4] group-hover:text-[#DFC18A] transition-colors truncate">
                    {badge.title}
                  </h4>
                  <p className="text-[11px] text-[#A69385] truncate font-light mt-0.5">
                    {badge.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile / Tablet View (Horizontal Swipeable Ribbon) */}
          <div className="lg:hidden flex items-center gap-3 overflow-x-auto no-scrollbar py-1 px-1">
            {TRUST_BADGES.map((badge, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-full bg-[#1C120E]/80 border border-[#301F18] shrink-0"
              >
                <div className="w-6 h-6 rounded-full bg-[#241611] flex items-center justify-center text-[#DFC18A] shrink-0">
                  {badge.icon}
                </div>
                <div className="whitespace-nowrap">
                  <span className="text-[11px] font-medium text-[#FDF8F4] block leading-tight">
                    {badge.title}
                  </span>
                  <span className="text-[9px] text-[#DFC18A]/80 font-light block leading-tight">
                    {badge.subtitle}
                  </span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 3. OUR COLLECTIONS SECTION ── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Section Header */}
        <div className="relative flex items-center justify-between mb-8 sm:mb-14">
          <div className="text-center w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#DFC18A]/25 bg-[#19100D] mb-2.5">
              <Sparkles className="w-3 h-3 text-[#DFC18A]" />
              <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.28em] uppercase text-[#DFC18A]">
                Handloom Archive
              </span>
            </div>
            <h2
              className="font-serif text-2xl sm:text-3xl md:text-4xl text-[#FDF8F4] font-normal leading-tight"
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
            >
              Our Collections
            </h2>
            <FloralOrnament className="mt-2" />
          </div>

          <Link
            to="/products"
            className="absolute right-0 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#DFC18A]/40 text-xs font-medium text-[#DFC18A] hover:bg-[#DFC18A]/10 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* ── LAPTOP / DESKTOP VIEW: TALL EDITORIAL CARDS (sm & above) ── */}
        <div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3.5 lg:gap-5">
          {OUR_COLLECTIONS.map((col, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              onClick={() => navigate(`/products?category=${encodeURIComponent(col.category)}`)}
              className="group relative aspect-[3/4.4] rounded-2xl overflow-hidden cursor-pointer border border-[#35221B] hover:border-[#DFC18A]/60 transition-all duration-300 shadow-[0_12px_32px_rgba(0,0,0,0.5)] hover:shadow-[0_18px_48px_rgba(0,0,0,0.7)]"
            >
              {/* Fabric Image */}
              <img
                src={col.img}
                alt={col.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Top Tag Pill */}
              <div className="absolute top-3 left-3 z-20">
                <span className="text-[9px] uppercase tracking-wider font-semibold text-[#DFC18A] bg-[#120B09]/80 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#DFC18A]/30 shadow">
                  {col.tag}
                </span>
              </div>

              {/* Bottom Gradient and Glass Details */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0E0705] via-[#120B09]/50 via-[45%] to-transparent flex flex-col justify-end p-3.5 z-10">
                <div className="p-2.5 rounded-xl bg-[#170E0B]/85 backdrop-blur-md border border-[#35221B] group-hover:border-[#DFC18A]/40 transition-colors flex items-center justify-between gap-2 shadow-lg">
                  <div className="min-w-0">
                    <h3 className="font-serif text-xs font-semibold text-[#FDF8F4] group-hover:text-[#DFC18A] transition-colors truncate">
                      {col.name}
                    </h3>
                    <p className="text-[10px] text-[#C7B5A7] font-light">
                      Explore Weave
                    </p>
                  </div>
                  <span className="w-6 h-6 rounded-full bg-[#C86A27] text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── MOBILE VIEW: LUXURY CIRCLE STORY DESIGN (< sm) ── */}
        <div className="sm:hidden">
          {/* Header row with pill */}
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-xs font-serif text-[#DFC18A] tracking-wider uppercase font-semibold">
              Explore by Style
            </span>
            <Link
              to="/products"
              className="text-[10px] text-[#DFC18A] uppercase font-semibold tracking-wider flex items-center gap-1 bg-[#1E130F] px-2.5 py-1 rounded-full border border-[#DFC18A]/30"
            >
              <span>All Weaves</span>
              <ArrowRight className="w-2.5 h-2.5" />
            </Link>
          </div>

          {/* Smooth horizontal scroll with luxury circles */}
          <div className="flex items-start gap-4 overflow-x-auto no-scrollbar pb-3 pt-1 px-1">
            {OUR_COLLECTIONS.map((col, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/products?category=${encodeURIComponent(col.category)}`)}
                className="flex flex-col items-center shrink-0 cursor-pointer group"
              >
                {/* ── LUXURY STORY HALO RING ── */}
                <div className="relative p-[2.5px] rounded-full bg-gradient-to-tr from-[#DFC18A] via-[#E28945] to-[#C86A27] shadow-[0_4px_16px_rgba(200,106,39,0.35)] group-active:scale-95 transition-all duration-200">
                  {/* Dark separator ring */}
                  <div className="p-[2px] bg-[#120B09] rounded-full">
                    {/* Circle Image */}
                    <div className="w-[72px] h-[72px] rounded-full overflow-hidden relative shadow-inner">
                      <img
                        src={col.img}
                        alt={col.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      {/* Subtle dark bottom vignette inside circle */}
                      <div className="absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
                    </div>
                  </div>

                  {/* Micro gold indicator dot */}
                  <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#DFC18A] border-2 border-[#120B09] shadow-sm" />
                </div>

                {/* Typography underneath */}
                <span className="font-serif text-[11px] font-medium text-[#FDF8F4] mt-2.5 text-center truncate max-w-[76px] group-hover:text-[#DFC18A] transition-colors leading-tight">
                  {col.shortName}
                </span>
                <span className="text-[8px] font-semibold tracking-wider uppercase text-[#DFC18A]/80 text-center truncate max-w-[76px] mt-0.5">
                  {col.tag}
                </span>
              </div>
            ))}
          </div>
        </div>

      </section>

      {/* ── 4. EDITORIAL STORY BANNER ── */}

      {/* DESKTOP version (sm and above) — full-bleed immersive redesign */}
      <section className="hidden sm:block py-8 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
          style={{ minHeight: 'clamp(400px, 52vh, 560px)' }}
        >
          {/* Full-bleed background image */}
          <img
            src={storyModelImg}
            alt="Woman in festive silk saree"
            className="absolute inset-0 w-full h-full object-cover object-[60%_top]"
          />

          {/* Layered overlays — dark vignette from left + bottom */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0704]/95 via-[#120B09]/70 via-[50%] to-[#120B09]/10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#120B09]/60 via-transparent to-transparent pointer-events-none" />

          {/* Top-left eyebrow tag */}
          <div className="absolute top-7 left-8 flex items-center gap-3 z-10">
            <span className="text-[9px] font-bold tracking-[0.32em] uppercase text-[#DFC18A]">
              THE ISAI TARANG EDIT
            </span>
          </div>

          {/* Main editorial content — left-anchored */}
          <div
            className="relative z-10 flex flex-col justify-center h-full px-8 sm:px-12 lg:px-16"
            style={{ minHeight: 'clamp(400px, 52vh, 560px)' }}
          >
            <div className="max-w-[420px] xl:max-w-[480px] space-y-5">

              {/* Headline */}
              <h2
                className="font-serif font-normal text-[#FDF8F4] leading-[1.08]"
                style={{
                  fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
                  fontSize: 'clamp(2.2rem, 4vw, 3.6rem)',
                  textShadow: '0 4px 24px rgba(0,0,0,0.6)',
                }}
              >
                Tradition
                <br />
                <span className="italic font-light text-[#D4855A]">in a Modern Light</span>
              </h2>

              {/* Subtitle */}
              <p className="text-[#C7B5A7] font-light leading-[1.75] max-w-[340px]"
                style={{ fontSize: 'clamp(0.82rem, 1.1vw, 1rem)' }}>
                Sarees for today's woman, rooted in heritage, thoughtfully designed for her world.
              </p>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/about')}
                type="button"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#C86A27] hover:bg-[#D87A38] text-white text-xs font-semibold tracking-[0.16em] uppercase cursor-pointer shadow-[0_6px_28px_rgba(200,106,39,0.45)] transition-colors duration-300"
              >
                <span>Discover More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            </div>
          </div>

          {/* Bottom-right italic watermark quote */}
          <div className="absolute bottom-6 right-7 z-10 text-right pointer-events-none">
            <p
              className="font-serif italic text-[#DFC18A]/80 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)] leading-snug"
              style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(0.8rem, 1.2vw, 1.05rem)' }}
            >
              Woven with Culture<br />Styled for Today
            </p>
          </div>

          {/* Subtle gold border accent */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{ boxShadow: 'inset 0 0 0 1px rgba(223,193,138,0.12)' }}
          />
        </motion.div>
      </section>

      {/* MOBILE version — Full-bleed immersive editorial card */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7 }}
        className="sm:hidden mx-4 my-5"
      >
        <div
          className="relative rounded-3xl overflow-hidden shadow-[0_16px_60px_rgba(0,0,0,0.65)]"
          style={{ height: '420px' }}
        >
          {/* Full-bleed background image */}
          <img
            src={storyModelImg}
            alt="Woman in festive silk saree"
            className="absolute inset-0 w-full h-full object-cover object-[60%_top]"
          />

          {/* Layered overlays — dark bottom anchor + left vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0704]/95 via-[#120B09]/55 via-[55%] to-[#120B09]/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0D0704]/70 via-transparent to-transparent pointer-events-none" />

          {/* Top eyebrow tag */}
          <div className="absolute top-5 left-5 flex items-center gap-2 z-10">
            <span className="text-[8px] font-bold tracking-[0.30em] uppercase text-[#DFC18A]">
              THE ISAI TARANG EDIT
            </span>
          </div>

          {/* Subtle inset gold frame */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none z-10"
            style={{ boxShadow: 'inset 0 0 0 1px rgba(223,193,138,0.14)' }}
          />

          {/* Bottom content overlay */}
          <div className="absolute bottom-0 left-0 right-0 z-20 px-5 pb-6 pt-10">
            {/* Headline */}
            <h3
              className="font-serif leading-[1.1] mb-3 drop-shadow-[0_4px_16px_rgba(0,0,0,0.85)]"
              style={{
                fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
                fontSize: 'clamp(1.7rem, 8vw, 2.2rem)',
              }}
            >
              <span className="block text-[#FDF8F4] font-normal">Tradition</span>
              <span className="block italic font-light text-[#D4855A]">in a Modern Light</span>
            </h3>

            {/* Body */}
            <p className="text-[12px] text-[#C7B5A7] leading-relaxed font-light mb-5 max-w-[260px]">
              Sarees for today's woman, rooted in heritage, designed for her world.
            </p>

            {/* CTA */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/about')}
              type="button"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C86A27] text-white text-[10px] font-semibold tracking-[0.14em] uppercase cursor-pointer shadow-[0_4px_24px_rgba(200,106,39,0.50)]"
            >
              <span>Discover More</span>
              <ArrowRight className="w-3 h-3" />
            </motion.button>
          </div>

          {/* Bottom-right italic watermark */}
          <div className="absolute bottom-6 right-5 z-20 text-right pointer-events-none">
            <p
              className="font-serif italic text-[#DFC18A]/75 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] leading-snug text-[11px]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Woven with Culture<br />Styled for Today
            </p>
          </div>
        </div>
      </motion.section>

      {/* ── 5. FEATURED PRODUCTS (Desktop 5-col, Mobile 2-col) ── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
              Featured Handlooms
            </h2>
            <FloralOrnament className="mt-2" />
          </div>

          {/* Right View All link */}
          <Link
            to="/products"
            className="absolute right-0 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#DFC18A]/40 text-xs font-medium text-[#DFC18A] hover:bg-[#DFC18A]/10 transition-colors"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Category Filter Tabs */}
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

        {/* ── Desktop & Mobile Responsive Products Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              badge={product.badge}
              rating={product.rating}
              reviewsCount={product.reviewsCount}
              originalPrice={product.originalPrice}
            />
          ))}
        </div>

        {/* Bottom Catalog Action Link */}
        <div className="mt-10 sm:mt-12 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-[#DFC18A]/50 bg-[#1A100C] hover:bg-[#DFC18A] text-[#DFC18A] hover:text-[#120B09] text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-lg group cursor-pointer"
          >
            <span>Explore Entire Handloom Catalog</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* ── 6. FREQUENTLY ASKED QUESTIONS (FAQ) ── */}
      <FaqSection />
    </div>
  );
}

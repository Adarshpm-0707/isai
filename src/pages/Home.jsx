import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { ArrowRight, Sparkles, Leaf, Droplets, Flower2, ShoppingBag, ArrowUpRight } from 'lucide-react';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/reusable/ProductCard';
import { getProductImage } from '../utils/productHelpers';

const CATEGORIES = [
  { name: 'Banarasi', label: 'THE ROYAL WEAVE', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1000' },
  { name: 'Kanchipuram', label: 'GOLDEN ARCHIVE', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000' },
  { name: 'Organza', label: 'LIGHT AS AIR', img: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=1000' },
];

const WORDS = ["Pure Mulberry Silk", "Royal Banarasi", "Temple Kanchipuram", "Airy Organza"];

export default function Home() {
  const navigate = useNavigate();
  const { products, loading, fetchProducts } = useProducts();
  const [wordIndex, setWordIndex] = useState(0);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  // Parallax offsets for the Mosaic items
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -80]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    const timer = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % WORDS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-[#F9F6F2] text-[#1B2621] overflow-hidden selection:bg-[#C56E4E] selection:text-white">
      
      {/* 1. ANIMATED KINETIC HERO SECTION (BG TITLE + MOVING ANIMATION + COLOR GRADIENT) */}
      <section className="relative min-h-[92vh] md:min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden bg-[#F9F6F2]">
        
        {/* Animated Moving Background Title Stream 1 (Moving Left) */}
        <div className="absolute top-[12%] inset-x-0 flex items-center pointer-events-none select-none overflow-hidden opacity-10 sm:opacity-15">
          <motion.div 
            animate={{ x: [0, -1600] }}
            transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
            className="whitespace-nowrap flex gap-12 text-[18vw] font-black uppercase text-[#1B2621]/40 tracking-tighter"
          >
            <span>ISAI TARANG • THE LOOM ARCHIVES • PURE SILK • HERITAGE •</span>
            <span>ISAI TARANG • THE LOOM ARCHIVES • PURE SILK • HERITAGE •</span>
          </motion.div>
        </div>

        {/* Animated Moving Background Title Stream 2 (Moving Right) */}
        <div className="absolute bottom-[8%] inset-x-0 flex items-center pointer-events-none select-none overflow-hidden opacity-10 sm:opacity-15">
          <motion.div 
            animate={{ x: [-1600, 0] }}
            transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
            className="whitespace-nowrap flex gap-12 text-[16vw] font-black uppercase text-[#6B0F1A]/35 tracking-tighter italic"
          >
            <span>HANDSPUN HEIRLOOMS • ROYAL WEAVES • VARANASI ATELIER •</span>
            <span>HANDSPUN HEIRLOOMS • ROYAL WEAVES • VARANASI ATELIER •</span>
          </motion.div>
        </div>

        {/* Ambient Glowing Color Gradients */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#C56E4E]/20 via-[#6B0F1A]/10 to-[#E2BD45]/15 rounded-full blur-3xl pointer-events-none" 
        />
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-[#E2BD45]/20 via-[#C56E4E]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto w-full text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
      

            {/* Main Headline with Color Gradient Highlight */}
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-playfair font-light leading-[0.95] tracking-tight mb-8">
              The Art of <br />
              <span className="italic font-normal bg-gradient-to-r from-[#C56E4E] via-[#6B0F1A] to-[#C56E4E] bg-clip-text text-transparent animate-gradient">
                Draping.
              </span>
            </h1>

            {/* Animated Word Cycler */}
            <div className="h-12 sm:h-16 flex items-center justify-center mb-8 overflow-hidden">
              <span className="text-sm sm:text-lg font-light text-gray-500 uppercase tracking-[0.3em] mr-3">
                Crafted In
              </span>
              <div className="relative h-full flex items-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={wordIndex}
                    initial={{ opacity: 0, y: 25, rotateX: -90 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    exit={{ opacity: 0, y: -25, rotateX: 90 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="text-lg sm:text-2xl font-playfair font-bold text-[#1B2621] border-b-2 border-[#C56E4E] pb-0.5 inline-block"
                  >
                    {WORDS[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-gray-600 max-w-2xl font-light leading-relaxed mb-12 px-4">
              Heirlooms hand-spun from pure mulberry silk, capturing centuries of Indian weaving wisdom in every single fold.
            </p>

            {/* Action CTAs with Color Gradient Effects */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full">
              <button 
                onClick={() => navigate('/products')}
                className="group relative flex items-center justify-center gap-4 px-10 py-5 bg-[#1B2621] text-white rounded-full overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 w-full sm:w-auto"
              >
                <motion.div className="absolute inset-0 bg-gradient-to-r from-[#C56E4E] via-[#6B0F1A] to-[#C56E4E] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 text-xs font-bold uppercase tracking-[0.3em]">
                  Explore Vault
                </span>
                <div className="relative z-10 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={15} />
                </div>
              </button>

              <button 
                onClick={() => {
                  const el = document.getElementById('curated-genres');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center justify-center gap-3 px-8 py-5 text-xs font-bold uppercase tracking-[0.3em] text-[#1B2621] hover:text-[#C56E4E] border border-[#1B2621]/20 hover:border-[#C56E4E] rounded-full transition-all duration-300 w-full sm:w-auto backdrop-blur-sm bg-white/40"
              >
                View Genres
              </button>
            </div>

      

          </motion.div>
        </div>
      </section>

      {/* 2. THE ORGANIC ATTRIBUTES (Kept) */}
      <section className="bg-[#1B2621] py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
          {[{ icon: <Leaf />, title: "Organic Thread", desc: "100% Mulberry silk fibers" },
            { icon: <Droplets />, title: "Plant Based", desc: "Dyed using turmeric & indigo" },
            { icon: <Flower2 />, title: "Hand Blocked", desc: "Pressed by master artisans" }
          ].map((item, i) => (
            <div key={i} className="text-white/80 space-y-4">
              <div className="text-[#C56E4E]">{item.icon}</div>
              <h3 className="text-xl font-playfair text-white">{item.title}</h3>
              <p className="text-sm tracking-wide leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CURATED GENRES (HOVER IMAGE REVEAL) */}
      <section id="curated-genres" className="py-40 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-[#1B2621]/10 pb-8">
          <div>
            <span className="text-[#C56E4E] text-[10px] tracking-[0.5em] uppercase font-bold block mb-3">Regional Mastery</span>
            <h2 className="text-5xl md:text-7xl font-playfair">Curated <br /> Genres</h2>
          </div>
          <p className="text-sm text-gray-500 max-w-xs mt-4 md:mt-0 font-light leading-relaxed">
            Hover over a genre to preview the artisanal silk weave.
          </p>
        </div>

        <div className="space-y-4">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.name}
              whileHover={{ x: 15 }}
              className="group relative h-[160px] md:h-[220px] flex items-center border-b border-[#1B2621]/10 cursor-pointer overflow-hidden px-4"
              onClick={() => navigate(`/products?category=${cat.name}`)}
            >
              <span className="text-2xl font-playfair mr-10 opacity-30 group-hover:opacity-100 group-hover:text-[#C56E4E] transition-all">
                0{idx + 1}
              </span>
              
              <h3 className="text-4xl md:text-6xl font-playfair uppercase tracking-tight z-10 group-hover:text-[#C56E4E] transition-colors">
                {cat.name}
              </h3>
              
              <div className="ml-auto flex items-center gap-8 z-10">
                <span className="text-xs font-bold tracking-[0.4em] uppercase text-[#C56E4E] hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                  {cat.label}
                </span>
                <div className="w-12 h-12 rounded-full border border-[#1B2621]/20 flex items-center justify-center group-hover:bg-[#C56E4E] group-hover:border-[#C56E4E] group-hover:text-white transition-all duration-300">
                  <ArrowRight size={18} />
                </div>
              </div>

              {/* FLOATING IMAGE REVEAL ON HOVER */}
              <div className="absolute right-[22%] top-1/2 -translate-y-1/2 w-[280px] h-[170px] opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 pointer-events-none z-0 shadow-2xl rounded-sm overflow-hidden border border-white/20">
                <img 
                  src={cat.img} 
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800';
                  }}
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" 
                  alt={cat.name} 
                />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. REIMAGINED: WINTER ARCHIVE 24' — HIGH FASHION SHOWCASE */}
      <section className="relative py-36 bg-[#09100D] text-white overflow-hidden border-t border-white/5">
        {/* Ambient Gradient Glow Spheres */}
        <div className="absolute top-1/3 left-10 w-[550px] h-[550px] bg-gradient-to-tr from-[#C56E4E]/15 via-[#6B0F1A]/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-gradient-to-br from-[#E2BD45]/15 via-transparent to-transparent rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
            <div>
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border border-[#C56E4E]/40 bg-[#C56E4E]/10 backdrop-blur-md mb-4">
                <Sparkles size={12} className="text-[#C56E4E] animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-[#C56E4E]">
                  Winter Archive 24' • Limited Drop
                </span>
              </div>
              <h2 className="text-6xl md:text-8xl font-playfair leading-[0.9] tracking-tight">
                Ready to <br />
                <span className="italic font-light bg-gradient-to-r from-[#C56E4E] via-[#E2BD45] to-[#C56E4E] bg-clip-text text-transparent">
                  Drape.
                </span>
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <p className="text-white/40 text-sm font-light leading-relaxed max-w-xs">
                Hand-spun silk masterpieces, crafted by master weavers across 40 days of dedicated handloom art.
              </p>
              <button 
                onClick={() => navigate('/products')}
                className="group flex items-center gap-4 px-8 py-4 bg-[#C56E4E] text-[#09100D] rounded-full font-bold text-xs uppercase tracking-[0.3em] hover:bg-white transition-all duration-300 shadow-xl"
              >
                View All Vault ({products.length})
                <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
              </button>
            </div>
          </div>

          {/* Product Cards Showcase Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 4).map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group relative bg-[#121815] border border-white/10 rounded-sm overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-500 hover:border-[#C56E4E]/50"
              >
                {/* Image Container */}
                <div 
                  className="relative aspect-[3/4] overflow-hidden bg-black/40 cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img 
                    src={getProductImage(product)} 
                    alt={product.name || 'Pure Silk Saree'} 
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800';
                    }}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121815] via-transparent to-transparent opacity-80 group-hover:opacity-40 transition-opacity" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-black/60 backdrop-blur-md border border-white/20 text-[#C56E4E] text-[9px] font-bold uppercase tracking-widest rounded-full">
                      {product.category || 'Pure Silk'}
                    </span>
                  </div>

                  {/* Quick Add Hover Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${product.id}`);
                      }}
                      className="w-full py-3 bg-[#C56E4E] text-[#09100D] font-bold text-[10px] uppercase tracking-[0.25em] rounded-sm flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-lg"
                    >
                      <ShoppingBag size={13} /> Quick Inspect
                    </button>
                  </div>
                </div>

                {/* Details Container */}
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-start">
                    <h3 
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="font-playfair text-xl text-white group-hover:text-[#C56E4E] transition-colors line-clamp-1 cursor-pointer"
                    >
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-white/10">
                    <span className="text-xs uppercase tracking-widest text-white/50">Handloom Silk</span>
                    <span className="font-playfair text-lg text-[#C56E4E] font-bold">₹{product.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Banner Accent */}
          <div className="mt-20 p-8 sm:p-12 border border-[#C56E4E]/30 bg-gradient-to-r from-[#C56E4E]/10 via-transparent to-[#C56E4E]/10 rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-sm">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] uppercase tracking-[0.5em] text-[#C56E4E] font-bold">Guarantee of Authenticity</span>
              <h4 className="text-2xl sm:text-3xl font-playfair text-white">Every Silk Mark Piece Hand-Crafted Since 1994</h4>
            </div>
            <button 
              onClick={() => navigate('/products')}
              className="px-8 py-4 border border-[#C56E4E] text-[#C56E4E] hover:bg-[#C56E4E] hover:text-[#09100D] transition-all text-xs font-bold uppercase tracking-[0.3em] rounded-full whitespace-nowrap"
            >
              Explore Full Collection
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}
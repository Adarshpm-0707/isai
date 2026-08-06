import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Sparkles, Leaf, Droplets, Flower2, ShoppingBag, ArrowUpRight } from 'lucide-react';
import useProducts from '../hooks/useProducts';
import { getProductImage } from '../utils/productHelpers';
import HeroSection from '../components/layout/HeroSection';

const CATEGORIES = [
  { name: 'Banarasi', label: 'THE ROYAL WEAVE', img: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1000' },
  { name: 'Kanchipuram', label: 'GOLDEN ARCHIVE', img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=1000' },
  { name: 'Organza', label: 'LIGHT AS AIR', img: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=1000' },
];

const WORDS = ["Pure Mulberry Silk", "Royal Banarasi", "Temple Kanchipuram", "Airy Organza"];

export default function Home() {
  const navigate = useNavigate();
  const { products, fetchProducts } = useProducts();
  const [wordIndex, setWordIndex] = useState(0);
  const sectionRef = useRef(null);

  // Mouse position tracking for floating magnetic image previews
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    setMousePos({
      x: (clientX / window.innerWidth - 0.5) * 30,
      y: (clientY / window.innerHeight - 0.5) * 30,
    });
  };

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

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
    <div
      onMouseMove={handleMouseMove}
      className="bg-[#0E2A1C] text-[#E3C381] min-h-screen overflow-hidden selection:bg-[#D4AF7A] selection:text-[#0F2318] relative"
    >
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. THE ORGANIC ATTRIBUTES */}
      <section className="relative z-10 bg-[#E3C381]/5 border-y border-[#E3C381]/20 py-12 sm:py-20 text-[#E3C381]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
          {[
            { icon: <Leaf />, title: "Organic Thread", desc: "100% Mulberry silk fibers" },
            { icon: <Droplets />, title: "Plant Based", desc: "Dyed using turmeric & indigo" },
            { icon: <Flower2 />, title: "Hand Blocked", desc: "Pressed by master artisans" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-[#0E2A1C]/50 border border-[#D4AF7A]/15 hover:border-[#D4AF7A]/40 transition-all duration-300 space-y-3 text-center sm:text-left group shadow-lg"
            >
              <div className="text-[#D4AF7A] w-8 h-8 sm:w-10 sm:h-10 mx-auto sm:mx-0 group-hover:scale-110 group-hover:text-[#F3E5AB] transition-all duration-300">
                {item.icon}
              </div>
              <h3 className="text-base sm:text-lg font-playfair text-[#E3C381] font-bold tracking-wide group-hover:text-[#F3E5AB]">
                {item.title}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-[#D8D0C0]/75 font-normal tracking-wide max-w-xs mx-auto sm:mx-0">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. CURATED GENRES */}
      <section id="curated-genres" className="relative z-10 py-14 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto bg-transparent">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 sm:mb-16 border-b border-[#D4AF7A]/30 pb-6 sm:pb-8 gap-4">
          <div>
            <span className="text-[#D4AF7A] text-[10px] tracking-[0.5em] uppercase font-bold block mb-2">
              Regional Mastery
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-playfair text-[#E3C381] font-bold tracking-tight">
              Curated <br /> Genres
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#D8D0C0] max-w-xs font-medium leading-relaxed">
            Hover or tap over a genre to explore the artisanal silk weave collection.
          </p>
        </div>

        <div className="space-y-2 sm:space-y-4">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ x: 8 }}
              className="group relative min-h-[70px] sm:min-h-[120px] md:min-h-[160px] py-4 sm:py-6 flex items-center justify-between border-b border-[#D4AF7A]/25 cursor-pointer overflow-hidden px-2 sm:px-4"
              onClick={() => navigate(`/products?category=${cat.name}`)}
            >
              <div className="flex items-center gap-3 sm:gap-6 md:gap-10 min-w-0 pr-2 z-10">
                <span className="text-base sm:text-2xl font-playfair opacity-70 group-hover:opacity-100 group-hover:text-[#E3C381] transition-all text-[#D4AF7A] flex-shrink-0 font-bold">
                  0{idx + 1}
                </span>

                <div className="min-w-0">
                  <h3 className="text-xl sm:text-4xl md:text-6xl font-playfair uppercase tracking-tight text-[#E3C381] group-hover:text-[#F0DDB0] transition-colors break-words font-bold">
                    {cat.name}
                  </h3>
                  <span className="text-[9px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.4em] uppercase text-[#D4AF7A] block md:hidden mt-0.5 opacity-90">
                    {cat.label}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-8 flex-shrink-0 z-10">
                <span className="text-xs font-bold tracking-[0.4em] uppercase text-[#D4AF7A] hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                  {cat.label}
                </span>
                <div className="w-8 h-8 sm:w-12 sm:h-12 rounded-full border border-[#D4AF7A] flex items-center justify-center group-hover:bg-[#D4AF7A] group-hover:border-transparent group-hover:text-[#0F2318] transition-all duration-300 text-[#E3C381] flex-shrink-0 shadow-md">
                  <ArrowRight className="w-3.5 h-3.5 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>

              {/* FLOATING IMAGE REVEAL ON HOVER (DESKTOP) */}
              <div className="hidden lg:block absolute right-[22%] top-1/2 -translate-y-1/2 w-[280px] h-[170px] opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 pointer-events-none z-0 shadow-2xl rounded-sm overflow-hidden border border-[#D4AF7A]/40">
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

      {/* 4. SHOWCASE SECTION */}
      <section className="relative z-10 py-16 sm:py-24 md:py-32 bg-transparent text-[#E3C381] overflow-hidden border-t border-[#D4AF7A]/30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 relative z-10">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 sm:mb-20 gap-6 sm:gap-8">
            <div>
              <h2 className="text-4xl sm:text-6xl md:text-8xl font-playfair leading-[0.95] sm:leading-[0.9] tracking-tight text-[#E3C381] font-bold">
                Ready to <br />
                <span className="italic font-light text-[#F0DDB0]">
                  Drape.
                </span>
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
              <p className="text-[#D8D0C0] text-xs sm:text-sm font-medium leading-relaxed max-w-xs">
                Hand-spun silk masterpieces, crafted by master weavers across 40 days of dedicated handloom art.
              </p>
              <button
                onClick={() => navigate('/products')}
                className="group flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 bg-[#D4AF7A] text-[#0F2318] rounded-full font-bold text-[10px] sm:text-xs uppercase tracking-[0.25em] sm:tracking-[0.3em] hover:bg-[#F0DDB0] hover:scale-105 transition-all duration-300 shadow-xl shrink-0 cursor-pointer"
              >
                View All Vault ({products.length})
                <ArrowUpRight size={15} className="group-hover:rotate-45 transition-transform" />
              </button>
            </div>
          </div>

          {/* Product Cards Showcase Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 md:gap-8">
            {products.slice(0, 4).map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -6 }}
                className="group relative bg-[#E3C381]/10 border border-[#E3C381]/20 rounded-xl overflow-hidden flex flex-col justify-between shadow-lg transition-all duration-500 hover:bg-[#E3C381]/15 hover:border-[#E3C381]/50"
              >
                {/* Image Container */}
                <div
                  className="relative aspect-[3/4] overflow-hidden bg-transparent cursor-pointer"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-20 transition-opacity pointer-events-none" />

                  {/* Top Badge */}
                  <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10">
                    <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-[#D4AF7A] text-[#0F2318] text-[8px] sm:text-[9px] font-bold uppercase tracking-widest rounded-full shadow-md">
                      {product.category || 'Pure Silk'}
                    </span>
                  </div>

                  {/* Quick Add Hover Overlay */}
                  <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 z-10 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/product/${product.id}`);
                      }}
                      className="w-full py-2 sm:py-2.5 bg-[#D4AF7A] text-[#0F2318] font-bold text-[9px] sm:text-[10px] uppercase tracking-[0.2em] rounded-lg flex items-center justify-center gap-1.5 hover:bg-[#F0DDB0] transition-all shadow-lg cursor-pointer"
                    >
                      <ShoppingBag size={12} /> Inspect
                    </button>
                  </div>
                </div>

                {/* Details Container */}
                <div className="p-3 sm:p-5 space-y-2 flex-grow flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="font-playfair text-xs sm:text-base md:text-lg text-[#E3C381] font-bold group-hover:text-[#F0DDB0] transition-colors line-clamp-1 cursor-pointer"
                    >
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-[#E3C381]/15">
                    <span className="text-[9px] sm:text-xs uppercase tracking-widest text-[#D4AF7A] font-medium hidden xs:inline">
                      Silk Mark
                    </span>
                    <span className="font-playfair text-sm sm:text-base text-[#E3C381] font-bold">
                      ₹{product.price}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Banner Accent */}
          <div className="mt-12 sm:mt-20 p-6 sm:p-10 border border-[#D4AF7A]/30 bg-[#E3C381]/10 rounded-xl flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 shadow-md text-center md:text-left">
            <div className="space-y-1.5">
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.4em] sm:tracking-[0.5em] text-[#D4AF7A] font-bold">
                Guarantee of Authenticity
              </span>
              <h4 className="text-lg sm:text-2xl font-playfair text-[#E3C381] font-bold">
                Every Silk Mark Piece Hand-Crafted • Est. 2026
              </h4>
            </div>
            <button
              onClick={() => navigate('/products')}
              className="px-6 sm:px-8 py-3.5 bg-[#D4AF7A] text-[#0F2318] hover:bg-[#F0DDB0] transition-all text-[10px] sm:text-xs font-bold uppercase tracking-[0.25em] sm:tracking-[0.3em] rounded-full whitespace-nowrap shadow-lg shrink-0 cursor-pointer"
            >
              Explore Full Collection
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

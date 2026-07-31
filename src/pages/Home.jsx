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
    <div className="bg-[#120404] text-[#efcf8b] min-h-screen overflow-hidden selection:bg-[#f45d04] selection:text-[#efcf8b]">
      
      {/* 1. ANIMATED KINETIC HERO SECTION (BG TITLE + MOVING ANIMATION + COLOR GRADIENT) */}
      <section className="relative min-h-[92vh] md:min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden bg-[#120404]">
        


        {/* Ambient Glowing Color Gradients */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#f45d04]/25 via-[#c20903]/20 to-transparent rounded-full blur-3xl pointer-events-none" 
        />
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-[#c20903]/20 via-[#f45d04]/15 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto w-full text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
      

            {/* Main Headline with Color Gradient Highlight */}
            <h1 className="text-6xl xs:text-5xl sm:text-7xl md:text-[9rem] lg:text-[11rem] font-playfair font-black leading-[0.9] sm:leading-[0.88] tracking-tighter mb-6 sm:mb-8 text-[#efcf8b] max-w-full break-words">
              The Art of <br />
              <span className="italic font-extrabold bg-gradient-to-r from-[#efcf8b] via-[#f45d04] to-[#efcf8b] bg-clip-text text-transparent animate-gradient">
                Draping.
              </span>
            </h1>

            {/* Animated Word Cycler */}
            <div className="h-12 sm:h-16 flex items-center justify-center mb-8 overflow-hidden">
              <span className="text-sm sm:text-lg font-light text-[#efcf8b] uppercase tracking-[0.3em] mr-3">
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
                    className="text-lg sm:text-2xl font-playfair font-bold text-[#efcf8b] border-b-2 border-[#c20903] pb-0.5 inline-block"
                  >
                    {WORDS[wordIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Subtitle */}
            <p className="text-base sm:text-xl text-[#efcf8b] max-w-2xl font-light leading-relaxed mb-12 px-4">
              Heirlooms hand-spun from pure mulberry silk, capturing centuries of Indian weaving wisdom in every single fold.
            </p>

            {/* Action CTAs with Color Gradient Effects */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full">
              <button 
                onClick={() => navigate('/products')}
                className="group relative flex items-center justify-center gap-4 px-10 py-5 bg-[#c20903] text-[#efcf8b] rounded-full overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-500 w-full sm:w-auto"
              >
                <motion.div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                <span className="relative z-10 text-xs font-bold uppercase tracking-[0.3em]">
                  Explore Vault
                </span>
                <div className="relative z-10 w-7 h-7 rounded-full bg-white/20 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={15} />
                </div>
              </button>

              <button 
                onClick={() => {
                  const el = document.getElementById('curated-genres');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center justify-center gap-3 px-8 py-5 text-xs font-bold uppercase tracking-[0.3em] text-[#efcf8b] hover:bg-white hover:text-[#f45d04] border border-white rounded-full transition-all duration-300 w-full sm:w-auto backdrop-blur-sm"
              >
                View Genres
              </button>
            </div>

      

          </motion.div>
        </div>
      </section>

      {/* 2. THE ORGANIC ATTRIBUTES */}
      <section className="bg-[#1a0806] border-y border-[#c20903]/20 py-24">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16">
          {[{ icon: <Leaf />, title: "Organic Thread", desc: "100% Mulberry silk fibers" },
            { icon: <Droplets />, title: "Plant Based", desc: "Dyed using turmeric & indigo" },
            { icon: <Flower2 />, title: "Hand Blocked", desc: "Pressed by master artisans" }
          ].map((item, i) => (
            <div key={i} className="text-[#efcf8b]/80 space-y-4">
              <div className="text-[#f45d04]">{item.icon}</div>
              <h3 className="text-xl font-playfair text-[#efcf8b]">{item.title}</h3>
              <p className="text-sm tracking-wide leading-relaxed text-[#efcf8b]">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CURATED GENRES */}
      <section id="curated-genres" className="py-16 sm:py-28 px-4 sm:px-6 max-w-7xl mx-auto bg-[#120404]">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 sm:mb-20 border-b border-[#f45d04]/20 pb-6 sm:pb-8 gap-4">
          <div>
            <span className="text-[#f45d04] text-[10px] tracking-[0.5em] uppercase font-bold block mb-2">Regional Mastery</span>
            <h2 className="text-3xl sm:text-5xl md:text-7xl font-playfair text-[#efcf8b] font-bold tracking-tight">Curated <br /> Genres</h2>
          </div>
          <p className="text-xs sm:text-sm text-[#efcf8b]/70 max-w-xs font-light leading-relaxed">
            Hover or tap over a genre to explore the artisanal silk weave collection.
          </p>
        </div>

        <div className="space-y-2 sm:space-y-4">
          {CATEGORIES.map((cat, idx) => (
            <motion.div
              key={cat.name}
              whileHover={{ x: 10 }}
              className="group relative min-h-[90px] sm:min-h-[140px] md:min-h-[180px] py-4 sm:py-6 flex items-center justify-between border-b border-[#f45d04]/20 cursor-pointer overflow-hidden px-2 sm:px-4"
              onClick={() => navigate(`/products?category=${cat.name}`)}
            >
              <div className="flex items-center gap-3 sm:gap-6 md:gap-10 min-w-0 pr-2">
                <span className="text-lg sm:text-2xl font-playfair opacity-40 group-hover:opacity-100 group-hover:text-[#f45d04] transition-all text-[#efcf8b] flex-shrink-0">
                  0{idx + 1}
                </span>
                
                <div className="min-w-0">
                  <h3 className="text-xl sm:text-4xl md:text-6xl font-playfair uppercase tracking-tight text-[#efcf8b] group-hover:text-[#f45d04] transition-colors break-words">
                    {cat.name}
                  </h3>
                  <span className="text-[9px] sm:text-xs font-bold tracking-[0.25em] sm:tracking-[0.4em] uppercase text-[#f45d04] block md:hidden mt-1 opacity-90">
                    {cat.label}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 sm:gap-8 flex-shrink-0">
                <span className="text-xs font-bold tracking-[0.4em] uppercase text-[#f45d04] hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                  {cat.label}
                </span>
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full border border-[#f45d04]/40 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-[#f45d04] group-hover:to-[#c20903] group-hover:border-transparent group-hover:text-[#efcf8b] transition-all duration-300 text-[#efcf8b] flex-shrink-0">
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </div>

              {/* FLOATING IMAGE REVEAL ON HOVER (DESKTOP) */}
              <div className="hidden lg:block absolute right-[22%] top-1/2 -translate-y-1/2 w-[280px] h-[170px] opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 pointer-events-none z-0 shadow-2xl rounded-sm overflow-hidden border border-[#f45d04]/30">
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
      <section className="relative py-36 bg-[#0d0202] text-[#efcf8b] overflow-hidden border-t border-gray-200">
        {/* Ambient Gradient Glow Spheres */}
        <div className="absolute top-1/3 left-10 w-[550px] h-[550px] bg-gradient-to-tr from-[#f45d04]/20 via-[#c20903]/15 to-transparent rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-gradient-to-br from-[#c20903]/20 via-transparent to-transparent rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-3 sm:px-6 relative z-10">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-8">
            <div>
           
              <h2 className="text-6xl md:text-8xl font-playfair leading-[0.9] tracking-tight text-[#efcf8b]">
                Ready to <br />
                <span className="italic font-light bg-gradient-to-r from-[#f45d04] via-[#f45d04] to-[#c20903] bg-clip-text text-transparent">
                  Drape.
                </span>
              </h2>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <p className="text-[#efcf8b]/60 text-sm font-light leading-relaxed max-w-xs">
                Hand-spun silk masterpieces, crafted by master weavers across 40 days of dedicated handloom art.
              </p>
              <button 
                onClick={() => navigate('/products')}
                className="group flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-[#f45d04] to-[#c20903] text-[#efcf8b] rounded-full font-bold text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all duration-300 shadow-xl"
              >
                View All Vault ({products.length})
                <ArrowUpRight size={16} className="group-hover:rotate-45 transition-transform" />
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
                transition={{ duration: 0.7, delay: idx * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group relative bg-[#1a0806] border border-[#c20903]/30 rounded-sm overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-500 hover:border-[#f45d04]/60"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0806] via-transparent to-transparent opacity-80 group-hover:opacity-30 transition-opacity pointer-events-none" />

                  {/* Top Badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <span className="px-3 py-1 bg-gradient-to-r from-[#f45d04] to-[#c20903] text-[#efcf8b] text-[9px] font-bold uppercase tracking-widest rounded-full shadow-md">
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
                      className="w-full py-3 bg-gradient-to-r from-[#f45d04] to-[#c20903] text-[#efcf8b] font-bold text-[10px] uppercase tracking-[0.25em] rounded-sm flex items-center justify-center gap-2 hover:from-[#c20903] hover:to-[#f45d04] transition-colors shadow-lg"
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
                      className="font-playfair text-xl text-[#efcf8b] group-hover:text-[#f45d04] transition-colors line-clamp-1 cursor-pointer"
                    >
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <span className="text-xs uppercase tracking-widest text-[#efcf8b]">Handloom Silk</span>
                    <span className="font-playfair text-lg text-[#f45d04] font-bold">₹{product.price}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Banner Accent */}
          <div className="mt-20 p-8 sm:p-12 border border-[#f45d04]/40 bg-gradient-to-r from-[#f45d04]/10 via-[#c20903]/10 to-transparent rounded-sm flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-sm">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-[10px] uppercase tracking-[0.5em] text-[#f45d04] font-bold">Guarantee of Authenticity</span>
              <h4 className="text-2xl sm:text-3xl font-playfair text-[#efcf8b]">Every Silk Mark Piece Hand-Crafted Since 1994</h4>
            </div>
            <button 
              onClick={() => navigate('/products')}
              className="px-8 py-4 bg-gradient-to-r from-[#f45d04] to-[#c20903] text-[#efcf8b] hover:from-[#c20903] hover:to-[#f45d04] transition-all text-xs font-bold uppercase tracking-[0.3em] rounded-full whitespace-nowrap shadow-lg"
            >
              Explore Full Collection
            </button>
          </div>

        </div>
      </section>

    </div>
  );
}





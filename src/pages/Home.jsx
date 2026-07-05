import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Plus, Zap } from 'lucide-react';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/reusable/ProductCard';
import Button from '../components/reusable/Button';
import Loader from '../components/reusable/Loader';

const CATEGORIES = [
  {
    name: 'Banarasi',
    title: 'The Imperial Drape',
    tag: 'Varanasi · Pure Silk',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=900',
    gridStyle: { gridColumn: 'span 2', gridRow: 'span 2' },
  },
  {
    name: 'Kanchipuram',
    title: 'Temple Gold',
    tag: 'Tamil Nadu · Brocade',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=700',
    gridStyle: {},
  },
  {
    name: 'Organza',
    title: 'Sheer Poetry',
    tag: 'Contemporary · Handwoven',
    image: 'https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&q=80&w=700',
    gridStyle: {},
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { products, loading, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const featuredProducts = products.slice(0, 4);

  return (
    <div className="bg-[#FAF9F6] text-[#1a1a1a] selection:bg-gold selection:text-white">

      {/* 1. EDITORIAL HERO SECTION */}
      <section className="relative h-[95vh] flex items-center overflow-hidden bg-[#121212]">
        <div className="absolute top-0 right-0 w-full md:w-2/3 h-full overflow-hidden">
          <motion.img
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 1.5 }}
            src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1200"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="h-[1px] w-12 bg-gold" />
              <span className="text-gold tracking-[0.4em] text-[10px] font-bold uppercase">Est. 1994 • Handcrafted</span>
            </div>
            <h1 className="font-playfair text-6xl md:text-8xl text-white leading-[0.9] mb-8">
              Woven <br />
              <span className="italic font-light text-gold-light ml-8 md:ml-20">Emotions.</span>
            </h1>
            <p className="font-sans text-ivory/60 text-lg md:text-xl max-w-md leading-relaxed mb-10 border-l border-gold/30 pl-6">
              Discover the art of the loom. Rare mulberry silks meet genuine gold zari in a collection designed for legacies.
            </p>
            <button
              onClick={() => navigate('/products')}
              className="group relative px-12 py-4 bg-gold text-maroon-dark font-bold uppercase tracking-widest text-xs hover:bg-white transition-all duration-500"
            >
              The Collection
              <Plus className="absolute -top-2 -right-2 w-5 h-5 text-gold group-hover:rotate-90 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. LUXURY MARQUEE */}
      <div className="bg-maroon py-4 overflow-hidden border-y border-gold/20">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="flex whitespace-nowrap gap-20 items-center"
        >
          {[...Array(6)].map((_, i) => (
            <span key={i} className="text-gold-light font-playfair italic text-xl tracking-wider flex items-center gap-4">
              <Zap className="w-4 h-4 fill-current" /> Authentic Kanchipuram Silks
              <Zap className="w-4 h-4 fill-current" /> Hand-woven Banarasi Heritage
            </span>
          ))}
        </motion.div>
      </div>

      {/* 3. MASONRY CATEGORY GRID */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-3">Collections</p>
            <h2 className="font-playfair text-5xl md:text-6xl">The Atelier</h2>
          </div>
          <Link
            to="/products"
            className="group flex items-center gap-2 font-sans font-bold text-xs uppercase tracking-[0.2em] border-b border-[#1a1a1a] pb-1.5 hover:border-[#C9A227] hover:text-[#C9A227] transition-all"
          >
            View All Archives
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Grid: 3 cols on desktop, hidden on mobile/tablet. */}
        <div className="hidden md:grid grid-cols-3 auto-rows-[300px] gap-4">
          {CATEGORIES.map((cat) => (
            <motion.div
              key={cat.name}
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.4 }}
              style={{
                backgroundImage: `url('${cat.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              className={`relative overflow-hidden group cursor-pointer bg-[#2a1a1a] ${
                cat.name === 'Banarasi' ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'
              }`}
              onClick={() => navigate(`/products?category=${cat.name}`)}
            >
              {/* Zoom layer */}
              <div
                className="absolute inset-0 transition-transform duration-[1.4s] group-hover:scale-110"
                style={{
                  backgroundImage: `url('${cat.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              {/* Gold top badge */}
              <div className="absolute top-5 left-5 z-10">
                <span className="bg-[#C9A227] text-[#1a1a1a] font-sans font-bold text-[9px] uppercase tracking-[0.25em] px-2.5 py-1">
                  {cat.tag}
                </span>
              </div>
              {/* Bottom text */}
              <div className="absolute bottom-0 left-0 right-0 p-7 text-white z-10">
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/50 mb-1">{cat.name}</p>
                <h3 className="font-playfair text-2xl md:text-3xl font-medium leading-tight">{cat.title}</h3>
                <div className="flex items-center gap-2 mt-3 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <span className="font-sans text-[10px] uppercase tracking-widest text-[#C9A227]">Discover</span>
                  <ArrowRight className="w-3 h-3 text-[#C9A227]" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: simple vertical stack */}
        <div className="flex flex-col gap-4 md:hidden">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.name}
              style={{
                height: '260px',
                backgroundImage: `url('${cat.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
              className="relative overflow-hidden cursor-pointer bg-[#2a1a1a]"
              onClick={() => navigate(`/products?category=${cat.name}`)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute top-4 left-4">
                <span className="bg-[#C9A227] text-[#1a1a1a] font-sans font-bold text-[9px] uppercase tracking-[0.2em] px-2 py-1">
                  {cat.tag}
                </span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-white/50 mb-1">{cat.name}</p>
                <h3 className="font-playfair text-2xl font-medium">{cat.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS (ART GALLERY STYLE) */}
      <section className="bg-white py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="font-playfair text-5xl mb-4">Seasonal Spotlight</h2>
            <div className="w-20 h-[1px] bg-gold mx-auto" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-16">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group">
                <ProductCard product={product} />
                <div className="mt-4 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <button className="text-[10px] font-bold uppercase tracking-tighter border-b border-gold text-gold">Quick View</button>
                  <button className="text-[10px] font-bold uppercase tracking-tighter border-b border-maroon text-maroon">Add to Bag</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. MINIMALIST TESTIMONIAL */}
      <section className="bg-[#121212] py-32 overflow-hidden relative">
        <div className="absolute top-0 left-10 text-[200px] font-playfair text-white/[0.03] pointer-events-none select-none">
          "
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="flex justify-center gap-1 text-gold">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
            </div>
            <p className="font-playfair text-2xl md:text-4xl text-ivory/90 leading-relaxed italic">
              "The Banarasi saree I purchased was a work of art. The gold zari work was fine and reflective, draping beautifully on my wedding day."
            </p>
            <div>
              <p className="text-gold tracking-[0.3em] uppercase text-xs font-bold">Priya Sharma</p>
              <p className="text-ivory/40 text-[10px] uppercase mt-2">New Delhi Patron</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 6. NEWSLETTER (THE "ATELIER" INVITE) */}
      <section className="py-24 max-w-xl mx-auto px-6 text-center">
        <h3 className="font-playfair text-3xl mb-4">Join the Inner Circle</h3>
        <p className="text-gray-500 text-sm mb-10">Receive exclusive invites to new collection launches and weaving tours.</p>
        <div className="relative">
          <input
            type="email"
            placeholder="ENTER EMAIL ADDRESS"
            className="w-full bg-transparent border-b border-black py-4 text-xs tracking-widest focus:outline-none focus:border-gold transition-colors uppercase"
          />
          <button className="absolute right-0 top-1/2 -translate-y-1/2 text-[10px] font-bold tracking-widest hover:text-gold transition-colors">
            SUBSCRIBE
          </button>
        </div>
      </section>

    </div>
  );
}
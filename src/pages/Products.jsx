import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/reusable/ProductCard';
import EmptyState from '../components/reusable/EmptyState';
import { 
  SlidersHorizontal, 
  Search, 
  LayoutGrid, 
  Square, 
  RefreshCw, 
  ArrowUpRight,
  ChevronRight
} from 'lucide-react';

const ITEMS_PER_PAGE = 10;

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  const { products, fetchProducts, getCategories } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState(100000);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { setSelectedCategory(categoryParam); setCurrentPage(1); }, [categoryParam]);

  const categoryCounts = useMemo(() => {
    const counts = { All: products.length };
    (products || []).forEach(p => { if (p.category) counts[p.category] = (counts[p.category] || 0) + 1; });
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return (products || [])
      .filter((p) => {
        const matchCategory = !selectedCategory || selectedCategory === 'All' || (p.category?.toLowerCase() === selectedCategory.toLowerCase());
        const matchPrice = (p.price || 0) <= priceRange;
        const matchSearch = !searchQuery.trim() || p.name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchPrice && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low-high') return a.price - b.price;
        if (sortBy === 'price-high-low') return b.price - a.price;
        return new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now());
      });
  }, [products, selectedCategory, priceRange, searchQuery, sortBy]);

  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const categoriesList = ['All', ...getCategories().filter(c => c !== 'All')];

  return (
    <div className="bg-transparent text-[#FFE8A3] min-h-screen pb-32 selection:bg-[#FFE8A3] selection:text-[#800202]">
      
      {/* ─── 1. ASYMMETRIC EDITORIAL HEADER ─── */}
      <header className="relative pt-32 px-6 max-w-7xl mx-auto flex flex-col md:flex-row items-start justify-between gap-12">
        <div className="flex gap-6">
          {/* Vertical Title Decor */}
          <div className="hidden md:block overflow-hidden">
            <motion.p 
              initial={{ y: "100%" }} animate={{ y: 0 }}
              className="[writing-mode:vertical-lr] rotate-180 text-[10px] tracking-[0.8em] uppercase font-bold text-[#D8A55A] opacity-50"
            >
              Startup Atelier • Est. 2026
            </motion.p>
          </div>
          
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-7xl md:text-9xl font-playfair font-bold leading-[0.85] tracking-tighter">
              The <br /> Anthology<span className="text-[#D8A55A]"></span>
            </h1>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="max-w-sm pt-4"
        >
          <div className="h-[1px] w-12 bg-[#F6D18A] mb-6" />
          <p className="text-sm font-light leading-relaxed tracking-wide text-[#F6D18A]/80">
            A curated intersection of Silk Mark certified heritage and contemporary drape. 
            Browse our vault of hand-woven masterpieces.
          </p>
          <div className="mt-8 flex items-center gap-4 text-[10px] tracking-[0.3em] font-bold uppercase">
             Scroll To Explore <ChevronRight size={14} className="animate-bounce-x" />
          </div>
        </motion.div>
      </header>

      {/* ─── 2. CATEGORY RAIL & INLINE SEARCH CONTROLS ─── */}
      <section className="mt-16 px-6 max-w-7xl mx-auto space-y-8">
        {/* Category Tabs */}
        <div className="flex items-center gap-12 border-b border-[#FFE8A3]/20 pb-4 overflow-x-auto no-scrollbar">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
              className={`group relative whitespace-nowrap text-[11px] font-bold tracking-[0.3em] uppercase transition-all ${
                selectedCategory.toLowerCase() === cat.toLowerCase() ? 'text-[#FFE8A3]' : 'text-[#FFE8A3]/40 hover:text-[#FFE8A3]'
              }`}
            >
              <span>{cat}</span>
              <span className="ml-2 text-[8px] opacity-40 font-light italic">
                {categoryCounts[cat] || 0}
              </span>
              {selectedCategory.toLowerCase() === cat.toLowerCase() && (
                <motion.div layoutId="activeUnderline" className="absolute -bottom-4 left-0 right-0 h-[2px] bg-[#FFE8A3]" />
              )}
            </button>
          ))}
        </div>

        {/* Inline Search Bar & Controls */}
        <div className="relative">
          <div className="bg-[#FFE8A3]/10 backdrop-blur-md border border-[#FFE8A3]/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
            {/* Search Input Box */}
            <div className="flex items-center gap-3 bg-[#4A0000]/60 border border-[#FFE8A3]/30 rounded-xl px-4 py-2.5 w-full md:w-80 focus-within:border-[#FFE8A3] transition-all">
              <Search size={18} className="text-[#FFE8A3]/70 shrink-0" />
              <input 
                type="text" 
                placeholder="Search sarees & collections..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="bg-transparent border-none text-xs text-[#FFE8A3] placeholder:text-[#FFE8A3]/40 focus:outline-none w-full font-medium"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="text-xs text-[#FFE8A3]/60 hover:text-[#FFE8A3]">✕</button>
              )}
            </div>

            {/* Controls Right Side */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-[#FFE8A3]/70 font-semibold hidden sm:inline">Sort:</span>
                <select 
                  value={sortBy} 
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#4A0000] border border-[#FFE8A3]/30 rounded-xl px-3 py-2 text-xs text-[#FFE8A3] focus:outline-none cursor-pointer"
                >
                  <option value="newest" className="bg-[#4A0000] text-[#FFE8A3]">Newest Arrivals</option>
                  <option value="price-low-high" className="bg-[#4A0000] text-[#FFE8A3]">Price: Low to High</option>
                  <option value="price-high-low" className="bg-[#4A0000] text-[#FFE8A3]">Price: High to Low</option>
                </select>
              </div>

              {/* Filter Toggle Button */}
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
                  showFilters 
                    ? 'bg-[#FFE8A3] text-[#800202] border-[#FFE8A3]' 
                    : 'bg-[#4A0000]/60 text-[#FFE8A3] border-[#FFE8A3]/30 hover:bg-[#FFE8A3]/20'
                }`}
              >
                <SlidersHorizontal size={14} />
                <span>Filters</span>
              </button>

              {/* Reset Button */}
              <button 
                onClick={() => { setSearchQuery(''); setPriceRange(100000); setSortBy('newest'); setSelectedCategory('All'); }} 
                title="Reset Search & Filters"
                className="p-2.5 border border-[#FFE8A3]/30 hover:border-[#FFE8A3] bg-[#4A0000]/60 hover:bg-[#FFE8A3]/10 rounded-xl text-[#FFE8A3] transition-all shrink-0"
              >
                <RefreshCw size={14} />
              </button>
            </div>
          </div>

          {/* Expandable Filter Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                className="overflow-hidden mt-3"
              >
                <div className="bg-[#4A0000]/95 backdrop-blur-xl border border-[#FFE8A3]/30 p-6 rounded-2xl shadow-2xl space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] tracking-[0.3em] uppercase text-[#FFE8A3]/70 font-bold">Max Price Ceiling</label>
                    <span className="text-xs font-bold text-[#FFE8A3]">₹ {priceRange.toLocaleString()}</span>
                  </div>
                  <input 
                    type="range" min="2000" max="100000" step="5000" value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full accent-[#FFE8A3] bg-[#FFE8A3]/20 h-[3px] appearance-none rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-[#FFE8A3]/40">
                    <span>₹ 2,000</span>
                    <span>₹ 1,00,000</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ─── 3. ELEGANT PRODUCT GRID ─── */}
      <main className="max-w-7xl mx-auto px-6 pt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {paginatedProducts.map((product, idx) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: (idx % 3) * 0.08 }}
              className="h-full"
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {paginatedProducts.length === 0 && (
          <EmptyState title="Archive Empty" onAction={() => setSearchQuery('')} />
        )}

        {/* ─── 4. MODERN MINIMAL PAGINATION ─── */}
        {filteredProducts.length > ITEMS_PER_PAGE && (
          <div className="mt-40 flex items-center justify-between border-t border-[#FFE8A3]/10 pt-8">
            <span className="text-[10px] tracking-[0.4em] uppercase opacity-50">
              Page {currentPage} of {Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
            </span>
            <div className="flex gap-4">
               <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-8 py-3 border border-[#FFE8A3]/20 hover:border-[#FFE8A3] text-[10px] uppercase tracking-widest transition-all disabled:opacity-20"
               >
                 Prev
               </button>
               <button 
                disabled={currentPage >= Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-8 py-3 bg-[#FFE8A3] text-[#800202] text-[10px] font-bold uppercase tracking-widest hover:bg-white transition-all disabled:opacity-20"
               >
                 Next
               </button>
            </div>
          </div>
        )}
      </main>

    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/reusable/ProductCard';
import Loader from '../components/reusable/Loader';
import EmptyState from '../components/reusable/EmptyState';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';

  const { products, loading, fetchProducts, getCategories } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [priceRange, setPriceRange] = useState(50000);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);

  // Fetch all products once on mount
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Sync selectedCategory state with URL query parameters
  useEffect(() => {
    setSelectedCategory(categoryParam);
    setCurrentPage(1);
  }, [categoryParam]);

  // Client-side filtering logic (Instant response, 0ms latency)
  const filteredProducts = products
    .filter((p) => {
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchPrice = p.price <= priceRange;
      return matchCategory && matchPrice;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low-high') return a.price - b.price;
      if (sortBy === 'price-high-low') return b.price - a.price;
      return new Date(b.created_at) - new Date(a.created_at);
    });

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleCategoryChange = (cat) => {
    setSearchParams({ category: cat });
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest First' },
    { value: 'price-low-high', label: 'Price: Low → High' },
    { value: 'price-high-low', label: 'Price: High → Low' },
  ];

  const currentSortLabel = SORT_OPTIONS.find(o => o.value === sortBy)?.label || 'Sort';

  return (
    <div className="bg-[#FAF9F6] text-[#1a1a1a] min-h-screen">

      {/* ─── PAGE HEADER ─── */}
      <section className="relative bg-[#0d0d0d] py-24 overflow-hidden">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.25 }}
          transition={{ duration: 1.8 }}
          src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=1600"
          className="absolute inset-0 w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d0d]/90 to-[#0d0d0d]/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="h-[1px] w-10 bg-[#C9A227]" />
              <span className="text-[#C9A227] tracking-[0.4em] text-[10px] font-sans font-bold uppercase">
                Handcrafted Collections
              </span>
            </div>
            <h1 className="font-playfair text-5xl md:text-6xl text-white leading-tight">
              The <em className="not-italic text-[#C9A227]">Archive</em>
            </h1>
            <p className="font-sans text-white/40 text-sm mt-3 uppercase tracking-[0.15em]">
              Drape yourself in authentic, heirloom heritage
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── MOBILE FILTER DRAWER ─── */}
      <AnimatePresence>
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="absolute top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white p-8 overflow-y-auto space-y-8"
            >
              <div className="flex justify-between items-center">
                <h3 className="font-playfair text-xl font-bold text-[#6B0F1A]">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X className="w-5 h-5 text-gray-400 hover:text-[#6B0F1A]" />
                </button>
              </div>
              <FilterPanel
                categories={getCategories()}
                selectedCategory={selectedCategory}
                onCategoryChange={(cat) => { handleCategoryChange(cat); setShowMobileFilters(false); }}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                onPageReset={() => setCurrentPage(1)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─── MAIN LAYOUT ─── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">

        {/* Horizontal Category Chips (Mobile/Tablet only for instant access) */}
        <div className="flex lg:hidden overflow-x-auto pb-4 mb-8 -mx-4 px-4 gap-2 scrollbar-none">
          {getCategories().map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`flex-shrink-0 font-sans text-[11px] font-bold uppercase tracking-wider px-5 py-2.5 rounded-full border transition-all ${
                selectedCategory === cat
                  ? 'bg-[#6B0F1A] text-white border-[#6B0F1A]'
                  : 'bg-white text-gray-600 border-gray-200 active:border-[#6B0F1A]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Toolbar row */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            {/* Mobile filter trigger */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 font-sans font-bold text-xs uppercase tracking-[0.2em] text-[#6B0F1A] border border-[#6B0F1A]/30 px-4 py-2.5 hover:bg-[#6B0F1A] hover:text-white transition-all"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filter
            </button>
            <p className="font-sans text-xs text-gray-400 tracking-wide">
              <span className="font-bold text-[#1a1a1a]">{filteredProducts.length}</span> results
              {selectedCategory !== 'All' && (
                <span> in <span className="text-[#C9A227] font-bold">{selectedCategory}</span></span>
              )}
            </p>
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.2em] border border-gray-200 px-4 py-2.5 bg-white hover:border-[#C9A227] transition-colors"
            >
              {currentSortLabel}
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-100 shadow-lg z-20"
                >
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortBy(opt.value); setCurrentPage(1); setSortOpen(false); }}
                      className={`w-full text-left px-4 py-3 font-sans text-xs uppercase tracking-[0.15em] hover:bg-[#FAF9F6] transition-colors ${
                        sortBy === opt.value ? 'text-[#C9A227] font-bold' : 'text-gray-600'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12">

          {/* ─── SIDEBAR FILTERS (desktop) ─── */}
          <aside className="hidden lg:block space-y-10">
            <FilterPanel
              categories={getCategories()}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
              priceRange={priceRange}
              onPriceChange={setPriceRange}
              onPageReset={() => setCurrentPage(1)}
            />
          </aside>

          {/* ─── PRODUCTS GRID ─── */}
          <div>
            {paginatedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.25 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No Sarees Match Filters"
                message="Adjust the price range or select a different category."
                actionText="Reset Filters"
                actionPath="/products"
              />
            )}

            {/* ─── PAGINATION ─── */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 pt-16 border-t border-gray-100 mt-16">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                  className="w-10 h-10 flex items-center justify-center border border-gray-200 font-sans text-xs font-bold text-gray-500 hover:border-[#6B0F1A] hover:text-[#6B0F1A] disabled:opacity-30 transition-all"
                >
                  ←
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 flex items-center justify-center font-sans text-xs font-bold border transition-all ${
                      currentPage === i + 1
                        ? 'bg-[#6B0F1A] text-white border-[#6B0F1A]'
                        : 'border-gray-200 text-gray-500 hover:border-[#6B0F1A] hover:text-[#6B0F1A]'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                  className="w-10 h-10 flex items-center justify-center border border-gray-200 font-sans text-xs font-bold text-gray-500 hover:border-[#6B0F1A] hover:text-[#6B0F1A] disabled:opacity-30 transition-all"
                >
                  →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── FILTER PANEL (shared between desktop sidebar + mobile drawer) ─── */
function FilterPanel({ categories, selectedCategory, onCategoryChange, priceRange, onPriceChange, onPageReset }) {
  return (
    <>
      {/* Category filter */}
      <div className="space-y-4">
        <h4 className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
          Category
        </h4>
        <div className="flex flex-col gap-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`text-left font-sans text-xs py-2 px-3 transition-all flex items-center gap-2 ${
                selectedCategory === cat
                  ? 'bg-[#6B0F1A] text-white font-bold'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-[#6B0F1A]'
              }`}
            >
              {selectedCategory === cat && (
                <span className="w-1 h-3 bg-[#C9A227] flex-shrink-0" />
              )}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Price range slider */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
            Max Price
          </h4>
          <span className="font-sans text-xs font-bold text-[#6B0F1A]">
            ₹{priceRange.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="2000"
          max="50000"
          step="1000"
          value={priceRange}
          onChange={(e) => { onPriceChange(parseInt(e.target.value)); onPageReset(); }}
          className="w-full h-[2px] bg-gray-200 rounded-full appearance-none cursor-pointer accent-[#6B0F1A]"
        />
        <div className="flex justify-between text-[10px] text-gray-400 font-sans">
          <span>₹2,000</span>
          <span>₹50,000</span>
        </div>
      </div>
    </>
  );
}

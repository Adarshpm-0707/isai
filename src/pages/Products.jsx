import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/reusable/ProductCard';
import EmptyState from '../components/reusable/EmptyState';
import { SlidersHorizontal, Search, ChevronDown, Sparkles, Grid3X3, Columns2, RefreshCw } from 'lucide-react';

const ITEMS_PER_PAGE = 9;

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
  const [sortOpen, setSortOpen] = useState(false);
  const [gridCols, setGridCols] = useState(3); // 3 for 3-col grid, 2 for 2-col editorial gallery

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setSelectedCategory(categoryParam);
    setCurrentPage(1);
  }, [categoryParam]);

  // Compute category count map
  const categoryCounts = useMemo(() => {
    const counts = { All: products.length };
    (products || []).forEach(p => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  // Filtering & Sorting
  const filteredProducts = useMemo(() => {
    return (products || [])
      .filter((p) => {
        const matchCategory = 
          !selectedCategory || 
          selectedCategory === 'All' || 
          (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());
        
        const matchPrice = (p.price || 0) <= priceRange;

        const matchSearch = !searchQuery.trim() || 
          (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchCategory && matchPrice && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low-high') return a.price - b.price;
        if (sortBy === 'price-high-low') return b.price - a.price;
        return new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now());
      });
  }, [products, selectedCategory, priceRange, searchQuery, sortBy]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filteredProducts, currentPage]);

  const handleCategoryChange = (cat) => {
    setSearchParams({ category: cat });
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchParams({ category: 'All' });
    setSelectedCategory('All');
    setSearchQuery('');
    setPriceRange(100000);
    setSortBy('newest');
    setCurrentPage(1);
  };

  const SORT_OPTIONS = [
    { value: 'newest', label: 'Newest Arrivals' },
    { value: 'price-low-high', label: 'Price: Lowest First' },
    { value: 'price-high-low', label: 'Price: Highest First' },
  ];

  const categoriesList = ['All', ...getCategories().filter(c => c !== 'All')];

  return (
    <div className="bg-[#120404] text-[#1a1a1a] min-h-screen pb-24 selection:bg-[#120404] selection:text-[#efcf8b]">
      
      {/* ─── 1. HERO ARCHIVE HEADER ─── */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden bg-[#1a0806] border-b border-[#c20903]/30">
        


        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-[#f45d04]/40 bg-[#120404]/10 backdrop-blur-sm mb-6">
                <Sparkles size={13} className="text-[#f45d04] animate-pulse" />
                <span className="text-[10px] font-bold tracking-[0.45em] uppercase text-[#efcf8b]">
                  Est. 1994 • Silk Mark Certified Vault
                </span>
              </div>

              <h1 className="text-4xl sm:text-7xl lg:text-8xl font-playfair font-bold leading-[0.95] tracking-tight text-[#efcf8b] max-w-full break-words">
                The Royal <br />
                <span className="italic font-normal bg-gradient-to-r from-[#f45d04] via-[#f45d04] to-[#c20903] bg-clip-text text-transparent">
                  Anthology.
                </span>
              </h1>
            </motion.div>
            
            {/* Search Box */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full lg:w-80"
            >
              <div className="relative">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#efcf8b]" />
                <input 
                  type="text"
                  placeholder="Search by weave, color, motif..."
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-11 pr-4 py-3.5 bg-[#120404] border border-[#c20903]/40 rounded-full text-xs text-[#efcf8b] placeholder:text-[#efcf8b] focus:outline-none focus:border-[#f45d04] transition-all shadow-sm"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#efcf8b] hover:text-[#efcf8b]"
                  >
                    ×
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ─── 2. CATEGORY PILL FILTER STRIP ─── */}
      <section className="bg-[#120404]/95 border-b border-[#c20903]/30 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          
          {/* Scrollable Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {categoriesList.map((cat) => {
              const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
              const count = categoryCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryChange(cat)}
                  className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[11px] font-bold tracking-[0.2em] uppercase transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#f45d04] to-[#c20903] text-[#efcf8b] shadow-md'
                      : 'bg-[#1a0806] text-[#efcf8b] border border-gray-200 hover:border-[#f45d04] hover:text-[#efcf8b]'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full ${isActive ? 'bg-gray-200 text-[#efcf8b]' : 'bg-gray-100 text-[#efcf8b]'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Controls Right */}
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 border rounded-full text-[10px] font-bold tracking-[0.2em] uppercase transition-all ${
                showFilters ? 'border-[#f45d04] bg-[#120404]/20 text-[#f45d04]' : 'border-gray-300 text-[#efcf8b] hover:border-[#f45d04]'
              }`}
            >
              <SlidersHorizontal size={13} />
              <span>Filters</span>
            </button>

            {/* Grid Layout Switcher */}
            <div className="flex items-center border border-gray-300 rounded-full p-1 bg-[#1a0806]">
              <button 
                onClick={() => setGridCols(3)}
                className={`p-1.5 rounded-full transition-colors ${gridCols === 3 ? 'bg-gradient-to-r from-[#f45d04] to-[#c20903] text-[#efcf8b]' : 'text-[#efcf8b] hover:text-[#efcf8b]'}`}
                title="3-Column Grid"
              >
                <Grid3X3 size={14} />
              </button>
              <button 
                onClick={() => setGridCols(2)}
                className={`p-1.5 rounded-full transition-colors ${gridCols === 2 ? 'bg-gradient-to-r from-[#f45d04] to-[#c20903] text-[#efcf8b]' : 'text-[#efcf8b] hover:text-[#efcf8b]'}`}
                title="2-Column Gallery"
              >
                <Columns2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 3. EXPANDABLE FILTER & SORT BAR ─── */}
      <AnimatePresence>
        {showFilters && (
          <motion.section 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-[#1a0806] border-b border-gray-200 overflow-hidden text-[#efcf8b]"
          >
            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              
              {/* Price Filter */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#efcf8b]">Price Ceiling</span>
                  <span className="text-sm font-playfair font-bold text-[#f45d04]">Up to ₹{priceRange.toLocaleString('en-IN')}</span>
                </div>
                <input 
                  type="range"
                  min="2000"
                  max="100000"
                  step="5000"
                  value={priceRange}
                  onChange={(e) => { setPriceRange(Number(e.target.value)); setCurrentPage(1); }}
                  className="w-full accent-[#f45d04] bg-gray-200 h-1 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Sort By */}
              <div>
                <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#efcf8b] block mb-3">Sort Order</span>
                <div className="relative">
                  <button 
                    onClick={() => setSortOpen(!sortOpen)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-[#120404] border border-gray-300 rounded-full text-xs font-bold uppercase tracking-wider text-[#efcf8b]"
                  >
                    <span>{SORT_OPTIONS.find(o => o.value === sortBy)?.label}</span>
                    <ChevronDown size={14} className={sortOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
                  </button>

                  <AnimatePresence>
                    {sortOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="absolute left-0 right-0 mt-2 bg-[#1a0806] border border-gray-300 rounded-2xl shadow-2xl z-50 overflow-hidden"
                      >
                        {SORT_OPTIONS.map(opt => (
                          <button
                            key={opt.value}
                            onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                            className={`w-full text-left px-5 py-3 text-xs uppercase tracking-wider font-bold hover:bg-gray-100 transition-colors ${sortBy === opt.value ? 'text-[#f45d04]' : 'text-[#efcf8b]'}`}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Reset Action */}
              <div className="flex items-center justify-end">
                <button 
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-6 py-3 border border-[#f45d04] text-[#f45d04] hover:bg-[#120404] hover:text-[#efcf8b] rounded-full text-[10px] font-bold uppercase tracking-[0.3em] transition-all"
                >
                  <RefreshCw size={12} />
                  Reset All Filters
                </button>
              </div>

            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ─── 4. MAIN PRODUCTS DISPLAY GRID ─── */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-8 sm:pt-12">
        
        {/* Results Header Count */}
        <div className="flex justify-between items-center mb-6 sm:mb-10 pb-4 border-b border-gray-200">
          <p className="text-[10px] sm:text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] font-bold text-[#efcf8b]">
            Showing <span className="text-[#efcf8b] font-bold">{filteredProducts.length}</span> Heirloom Masterpiece{filteredProducts.length === 1 ? '' : 's'}
          </p>

          <span className="text-[10px] sm:text-[11px] font-playfair italic text-[#efcf8b]">
            Page {currentPage} of {totalPages || 1}
          </span>
        </div>

        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {paginatedProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (idx % 3) * 0.08 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <EmptyState
              title="No Sarees Found"
              message="No heirloom pieces match your selected filter criteria."
              actionText="Reset Filters"
              actionPath="#"
              onAction={resetFilters}
            />
          </div>
        )}

        {/* ─── 5. PAGINATION ─── */}
        {totalPages > 1 && (
          <div className="mt-24 flex justify-center items-center gap-4 border-t border-gray-200 pt-12">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="px-6 py-3 rounded-full border border-gray-300 text-[10px] font-bold uppercase tracking-[0.3em] text-[#efcf8b] disabled:opacity-20 hover:border-[#f45d04] hover:text-[#f45d04] transition-all"
            >
              Prev
            </button>
            
            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-full text-xs font-bold transition-all ${
                    currentPage === i + 1
                      ? 'bg-gradient-to-r from-[#f45d04] to-[#c20903] text-[#efcf8b] shadow-md'
                      : 'bg-[#1a0806] text-[#efcf8b] border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="px-6 py-3 rounded-full border border-gray-300 text-[10px] font-bold uppercase tracking-[0.3em] text-[#efcf8b] disabled:opacity-20 hover:border-[#f45d04] hover:text-[#f45d04] transition-all"
            >
              Next
            </button>
          </div>
        )}
      </main>

    </div>
  );
}





import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/reusable/ProductCard';
import EmptyState from '../components/reusable/EmptyState';
import { FloralOrnament } from '../components/reusable/FloralOrnament';
import { SlidersHorizontal, Search, RefreshCw, ChevronRight } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  const searchParamQuery = searchParams.get('search') || '';
  const { products, fetchProducts, getCategories } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParamQuery);
  const [priceRange, setPriceRange] = useState(100000);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    setSelectedCategory(categoryParam);
    setCurrentPage(1);
  }, [categoryParam]);

  useEffect(() => {
    if (searchParamQuery) {
      setSearchQuery(searchParamQuery);
      setCurrentPage(1);
    }
  }, [searchParamQuery]);

  const categoryCounts = useMemo(() => {
    const counts = { All: products.length };
    (products || []).forEach((p) => {
      if (p.category) counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return (products || [])
      .filter((p) => {
        const matchCategory =
          !selectedCategory ||
          selectedCategory === 'All' ||
          p.category?.toLowerCase() === selectedCategory.toLowerCase();
        const matchPrice = (p.price || 0) <= priceRange;
        const matchSearch =
          !searchQuery.trim() ||
          p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchPrice && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low-high') return a.price - b.price;
        if (sortBy === 'price-high-low') return b.price - a.price;
        return new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now());
      });
  }, [products, selectedCategory, priceRange, searchQuery, sortBy]);

  const paginatedProducts = useMemo(
    () =>
      filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
      ),
    [filteredProducts, currentPage]
  );

  const categoriesList = ['All', ...getCategories().filter((c) => c !== 'All')];

  return (
    <div className="min-h-screen pb-24 bg-[#120B09] text-[#FDF8F4]">
      {/* ── HEADER ── */}
      <header className="relative pt-10 sm:pt-16 px-4 sm:px-6 max-w-7xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-[#DFC18A] text-xs font-semibold tracking-[0.28em] uppercase mb-1.5">
            Handcrafted Drapery
          </p>
          <h1
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-[#FDF8F4] tracking-tight leading-tight"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            The Saree <span className="italic text-[#DFC18A]">Anthology</span>
          </h1>
          <FloralOrnament className="mt-2" />
          <p className="text-xs sm:text-sm text-[#C7B5A7] max-w-lg mx-auto font-light mt-3 leading-relaxed">
            Curated pure silks, Kanchipuram weaves, soft handlooms, and lightweight georgettes crafted for every occasion.
          </p>
        </motion.div>
      </header>

      {/* ── CATEGORY TABS & CONTROLS ── */}
      <section className="mt-8 sm:mt-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-5">
        {/* Category Horizontal Bar */}
        <div className="flex items-center gap-3 sm:gap-6 pb-2 overflow-x-auto no-scrollbar border-b border-[#2C1C16]">
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`relative whitespace-nowrap text-xs font-medium tracking-wider uppercase py-2 px-1 transition-all ${
                  isSelected
                    ? 'text-[#DFC18A] font-semibold'
                    : 'text-[#8E7B6F] hover:text-[#C7B5A7]'
                }`}
              >
                <span>{cat}</span>
                <span className="text-[9px] opacity-60 ml-1">
                  ({categoryCounts[cat] || 0})
                </span>
                {isSelected && (
                  <motion.div
                    layoutId="categoryUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C86A27]"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Search & Filter Toolbar */}
        <div className="relative">
          <div className="bg-[#1E130F] border border-[#35221B] rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl">
            {/* Search Input */}
            <div className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 w-full md:w-80 bg-[#160E0B] border border-[#35221B] text-[#FDF8F4]">
              <Search size={15} className="text-[#8E7B6F] shrink-0" />
              <input
                type="text"
                placeholder="Search sarees & weaves..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent border-none text-xs placeholder:text-[#8E7B6F] focus:outline-none w-full text-[#FDF8F4]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#8E7B6F] hover:text-[#FDF8F4]"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Sorting & Filter Buttons */}
            <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-[#8E7B6F] font-bold hidden sm:inline">
                  Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-[#160E0B] border border-[#35221B] text-[#C7B5A7] rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
                >
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                </select>
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                  showFilters
                    ? 'bg-[#C86A27] text-white border-[#C86A27]'
                    : 'bg-[#160E0B] text-[#C7B5A7] border-[#35221B] hover:text-[#DFC18A]'
                }`}
              >
                <SlidersHorizontal size={13} />
                <span>Filters</span>
              </button>

              <button
                onClick={() => {
                  setSearchQuery('');
                  setPriceRange(100000);
                  setSortBy('newest');
                  setSelectedCategory('All');
                }}
                title="Reset Filters"
                className="p-2 border border-[#35221B] rounded-xl bg-[#160E0B] text-[#8E7B6F] hover:text-[#DFC18A] transition-all cursor-pointer"
              >
                <RefreshCw size={13} />
              </button>
            </div>
          </div>

          {/* Collapsible Filter Slider */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden mt-3"
              >
                <div className="bg-[#1A100C] border border-[#35221B] rounded-2xl p-5 space-y-3 shadow-xl">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-[#DFC18A] uppercase tracking-wider text-[11px]">
                      Max Price Range
                    </span>
                    <span className="font-bold text-[#FDF8F4]">
                      ₹{priceRange.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1500"
                    max="100000"
                    step="2000"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="w-full h-1.5 appearance-none rounded-lg cursor-pointer accent-[#C86A27] bg-[#2A1B15]"
                  />
                  <div className="flex justify-between text-[10px] text-[#8E7B6F]">
                    <span>₹1,500</span>
                    <span>₹1,00,000</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── PRODUCTS GRID ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {paginatedProducts.map((product) => (
            <div key={product.id} className="h-full">
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {paginatedProducts.length === 0 && (
          <EmptyState
            title="No Sarees Found"
            message="Try refining your filter criteria or search keyword."
            onAction={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
          />
        )}

        {/* Pagination Bar */}
        {filteredProducts.length > ITEMS_PER_PAGE && (
          <div className="mt-16 flex items-center justify-between border-t border-[#2C1C16] pt-6">
            <span className="text-xs text-[#8E7B6F]">
              Page {currentPage} of {Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
            </span>
            <div className="flex gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 border border-[#35221B] rounded-lg text-xs uppercase tracking-wider text-[#C7B5A7] disabled:opacity-30 hover:border-[#DFC18A] transition-colors"
              >
                Prev
              </button>
              <button
                disabled={currentPage >= Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 bg-[#C86A27] text-white rounded-lg text-xs uppercase tracking-wider font-semibold disabled:opacity-30 hover:bg-[#DB7B32] transition-colors"
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

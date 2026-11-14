import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/reusable/ProductCard';
import EmptyState from '../components/reusable/EmptyState';
import { RoyalHeaderOrnament } from '../components/reusable/FloralOrnament';
import { LotusEmblem } from '../components/reusable/BrandLogo';
import { SlidersHorizontal, Search, RefreshCw, ChevronRight, ShieldCheck, Sparkles, Award } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  const searchParamQuery = searchParams.get('search') || '';
  const sortParam = searchParams.get('sort') || 'newest';
  const { products, loading, fetchProducts, getCategories } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState(searchParamQuery);
  const [priceRange, setPriceRange] = useState(100000);
  const [sortBy, setSortBy] = useState(sortParam);
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
    if (sortParam) {
      setSortBy(sortParam);
      setCurrentPage(1);
    }
  }, [sortParam]);

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
      {/* ── HEADER (Elevated Royal Title Section) ── */}
      <header className="relative pt-12 sm:pt-20 px-4 sm:px-6 max-w-7xl mx-auto text-center">
        {/* Soft background ambient bloom */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 sm:w-[600px] h-36 bg-[#DFC18A]/[0.08] rounded-full blur-3xl pointer-events-none"
          aria-hidden="true"
        />

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DFC18A]/30 bg-gradient-to-r from-[#1E130F]/90 via-[#261712]/90 to-[#1E130F]/90 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.4)] mb-3 transition-transform hover:scale-105 duration-300">
            <LotusEmblem className="w-3.5 h-3.5 text-[#DFC18A]" />
            <span className="text-[10px] sm:text-xs font-semibold tracking-[0.26em] uppercase text-[#DFC18A]">
              Handcrafted Drapery • Master Loom Weaves
            </span>
          </div>

          <h1
            className="font-serif text-3xl sm:text-5xl md:text-6xl font-normal text-[#FDF8F4] tracking-tight leading-tight"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            The Saree{' '}
            <span className="italic font-normal font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0D4] via-[#DFC18A] to-[#C59B27]">
              Anthology
            </span>
          </h1>

          <RoyalHeaderOrnament className="mt-3 mb-1.5" />

          <p className="text-xs sm:text-sm text-[#C7B5A7] max-w-xl mx-auto font-light mt-3 leading-relaxed px-2">
            Curated pure silks, Kanchipuram bridal drapes, Banarasi brocades, and lightweight artisanal handlooms crafted for every celebration.
          </p>

          {/* Luxury Trust Micro-Badges Strip */}
          <div className="flex items-center justify-center gap-3 sm:gap-6 mt-5 flex-wrap text-[10px] sm:text-xs text-[#DFC18A]/90">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A100C]/70 border border-[#35221B]">
              <Award className="w-3.5 h-3.5 text-[#DFC18A]" />
              <span>100% Pure Certified Silk</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A100C]/70 border border-[#35221B]">
              <Sparkles className="w-3.5 h-3.5 text-[#DFC18A]" />
              <span>Artisan Loom Craft</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A100C]/70 border border-[#35221B]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#DFC18A]" />
              <span>Direct Weaver Value</span>
            </span>
          </div>
        </motion.div>
      </header>

      {/* ── CATEGORY TABS & CONTROLS ── */}
      <section id="catalog-grid-start" className="mt-8 sm:mt-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-6">
        {/* Category Horizontal Bar */}
        <div className="flex items-center gap-2 sm:gap-3 pb-3 overflow-x-auto no-scrollbar border-b border-[#2C1C16]">
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            return (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`relative whitespace-nowrap text-xs font-semibold tracking-wider uppercase py-2 px-3.5 sm:px-4 rounded-full transition-all duration-300 cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#DFC18A] via-[#E8CD9B] to-[#DFC18A] text-[#120B09] font-bold shadow-[0_3px_14px_rgba(223,193,138,0.35)] scale-105'
                    : 'bg-[#180F0C] text-[#C7B5A7] hover:text-[#FDF8F4] border border-[#2F1D16] hover:border-[#DFC18A]/40'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-[#120B09]/20 text-[#120B09]' : 'bg-[#261712] text-[#8E7B6F]'}`}>
                  {categoryCounts[cat] || 0}
                </span>
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
        {loading && products.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center space-y-4">
            <RefreshCw className="w-8 h-8 text-[#DFC18A] animate-spin" />
            <p className="font-serif text-sm text-[#DFC18A]">Curating Handloom Catalog...</p>
          </div>
        ) : (
          <>
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
                message={
                  products.length === 0
                    ? 'Our master weavers are curating new saree arrivals. Please check back soon!'
                    : 'Try refining your filter criteria or search keyword.'
                }
                onAction={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
              />
            )}
          </>
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

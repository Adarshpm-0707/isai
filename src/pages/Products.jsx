import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import useProducts from "../hooks/useProducts";
import ProductCard from "../components/reusable/ProductCard";
import EmptyState from "../components/reusable/EmptyState";
import { SlidersHorizontal, Search, RefreshCw, ChevronRight } from "lucide-react";
import { OnamPageHeading, SectionFlower, PookklamGarland, GoldLine, MiniFlower } from "../components/layout/OnamEffects";

const ITEMS_PER_PAGE = 10;

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get("category") || "All";
  const { products, fetchProducts, getCategories } = useProducts();

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState(100000);
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { setSelectedCategory(categoryParam); setCurrentPage(1); }, [categoryParam]);

  const categoryCounts = useMemo(() => {
    const counts = { All: products.length };
    (products || []).forEach(p => { if (p.category) counts[p.category] = (counts[p.category] || 0) + 1; });
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    return (products || [])
      .filter(p => {
        const matchCategory = !selectedCategory || selectedCategory === "All" || p.category?.toLowerCase() === selectedCategory.toLowerCase();
        const matchPrice = (p.price || 0) <= priceRange;
        const matchSearch = !searchQuery.trim() || p.name?.toLowerCase().includes(searchQuery.toLowerCase());
        return matchCategory && matchPrice && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === "price-low-high") return a.price - b.price;
        if (sortBy === "price-high-low") return b.price - a.price;
        return new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now());
      });
  }, [products, selectedCategory, priceRange, searchQuery, sortBy]);

  const paginatedProducts = useMemo(() =>
    filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE),
    [filteredProducts, currentPage]
  );

  const categoriesList = ["All", ...getCategories().filter(c => c !== "All")];

  return (
    <div className="min-h-screen pb-24" style={{ background: "linear-gradient(180deg,#0C2317 0%,#1A3C2B 30%,#0C2317 100%)" }}>

      {/* ── ONAM HEADER ── */}
      <header className="relative pt-10 sm:pt-20 px-4 sm:px-6 max-w-7xl mx-auto">
        {/* Top garland */}
        <div className="mb-6">
          <GoldLine />
          <PookklamGarland count={24} />
          <GoldLine />
        </div>

        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 mb-2">
              <SectionFlower size={24} />
              <span className="text-[#B8860B] text-[10px] font-bold tracking-[0.35em] uppercase">ഉൽപ്പന്ന ശേഖരം</span>
              <SectionFlower size={24} />
            </div>
            <h1
              className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-[0.95] tracking-wide uppercase"
              style={{
                fontFamily: "'Cinzel Decorative','Playfair Display',serif",
                background: "linear-gradient(180deg,#FFF8E7 0%,#F3E5AB 45%,#D4AF37 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                filter: "drop-shadow(0 2px 16px rgba(212,175,55,0.3))",
              }}
            >
              The Onam<br />Anthology
            </h1>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-sm pt-2">
            <div className="h-px w-12 mb-3" style={{ background: "#D4AF37" }} />
            <p className="text-xs sm:text-sm font-light leading-relaxed text-[#EADFC9]/80">
              A curated collection of Silk Mark certified heritage and contemporary Kerala handloom.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[10px] tracking-[0.3em] font-bold uppercase text-[#D4AF37]">
              <SectionFlower size={16} /> Scroll To Explore <ChevronRight size={14} className="animate-bounce" />
            </div>
          </motion.div>
        </div>
      </header>

      {/* ── CATEGORY TABS & FILTERS ── */}
      <section className="mt-8 sm:mt-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-5">
        <div className="flex items-center gap-5 sm:gap-8 pb-3 overflow-x-auto no-scrollbar border-b" style={{ borderColor: "rgba(212,175,55,0.25)" }}>
          {categoriesList.map(cat => (
            <button key={cat}
              onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
              className={`relative whitespace-nowrap text-[10px] sm:text-[11px] font-bold tracking-[0.28em] uppercase transition-all flex items-center gap-1 ${selectedCategory.toLowerCase() === cat.toLowerCase() ? "text-[#D4AF37]" : "text-[#D4AF37]/40 hover:text-[#D4AF37]"}`}
            >
              {selectedCategory.toLowerCase() === cat.toLowerCase() && <SectionFlower size={12} />}
              {cat}
              <span className="text-[8px] opacity-50 font-light italic">{categoryCounts[cat] || 0}</span>
              {selectedCategory.toLowerCase() === cat.toLowerCase() && (
                <motion.div layoutId="onamUnderline" className="absolute -bottom-3 left-0 right-0 h-[2px]" style={{ background: "linear-gradient(90deg,#D4AF37,#FFD54F)" }} />
              )}
            </button>
          ))}
        </div>

        {/* Search & Controls */}
        <div className="relative">
          <div className="rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xl"
            style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.22)", backdropFilter: "blur(12px)" }}>
            <div className="flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 w-full md:w-80 transition-all"
              style={{ background: "rgba(12,35,23,0.9)", border: "1px solid rgba(212,175,55,0.3)" }}>
              <Search size={16} className="text-[#D4AF37]/70 shrink-0" />
              <input type="text" placeholder="Search sarees & collections..."
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="bg-transparent border-none text-xs placeholder:text-[#D4AF37]/40 focus:outline-none w-full font-medium text-[#F3E5AB]"
              />
              {searchQuery && <button onClick={() => setSearchQuery("")} className="text-xs text-[#D4AF37]/60 hover:text-[#D4AF37]">&#x2715;</button>}
            </div>

            <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-widest text-[#D4AF37]/70 font-bold hidden sm:inline">Sort:</span>
                <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                  className="rounded-xl px-3 py-2 text-xs focus:outline-none cursor-pointer"
                  style={{ background: "rgba(12,35,23,0.9)", border: "1px solid rgba(212,175,55,0.3)", color: "#D4AF37" }}>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                </select>
              </div>
              <button onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${showFilters ? "text-[#0C2317]" : "text-[#D4AF37]"}`}
                style={{ background: showFilters ? "linear-gradient(135deg,#D4AF37,#B8860B)" : "rgba(12,35,23,0.9)", borderColor: "rgba(212,175,55,0.4)" }}>
                <SlidersHorizontal size={13} /> Filters
              </button>
              <button onClick={() => { setSearchQuery(""); setPriceRange(100000); setSortBy("newest"); setSelectedCategory("All"); }}
                className="p-2 border rounded-xl transition-all text-[#D4AF37]"
                style={{ background: "rgba(12,35,23,0.9)", borderColor: "rgba(212,175,55,0.3)" }}>
                <RefreshCw size={13} />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, y: -10, height: 0 }} animate={{ opacity: 1, y: 0, height: "auto" }} exit={{ opacity: 0, y: -10, height: 0 }}
                className="overflow-hidden mt-3">
                <div className="rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xl"
                  style={{ background: "rgba(10,24,16,0.97)", border: "1px solid rgba(212,175,55,0.3)" }}>
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] tracking-[0.3em] uppercase text-[#D4AF37]/70 font-bold flex items-center gap-1">
                      <SectionFlower size={14} /> Max Price
                    </label>
                    <span className="text-xs font-bold text-[#D4AF37]">&#8377; {priceRange.toLocaleString()}</span>
                  </div>
                  <input type="range" min="2000" max="100000" step="5000" value={priceRange}
                    onChange={e => setPriceRange(Number(e.target.value))}
                    className="w-full h-[3px] appearance-none rounded-lg cursor-pointer accent-[#D4AF37]" />
                  <div className="flex justify-between text-[9px] text-[#D4AF37]/40">
                    <span>&#8377; 2,000</span><span>&#8377; 1,00,000</span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── PRODUCT GRID ── */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 pt-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-8">
          {paginatedProducts.map((product, idx) => (
            <motion.div key={product.id}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.6, delay: (idx % 3) * 0.08 }}
              className="h-full">
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {paginatedProducts.length === 0 && <EmptyState title="No Sarees Found" onAction={() => setSearchQuery("")} />}

        {filteredProducts.length > ITEMS_PER_PAGE && (
          <div className="mt-20 flex items-center justify-between border-t pt-6" style={{ borderColor: "rgba(212,175,55,0.2)" }}>
            <div className="flex items-center gap-1.5 text-[10px] tracking-[0.35em] uppercase text-[#D4AF37]/60">
              <SectionFlower size={14} /> Page {currentPage} of {Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
            </div>
            <div className="flex gap-3">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}
                className="px-6 py-2.5 border text-[10px] uppercase tracking-widest transition-all disabled:opacity-20 rounded-lg text-[#D4AF37]"
                style={{ borderColor: "rgba(212,175,55,0.35)", background: "rgba(12,35,23,0.8)" }}>
                Prev
              </button>
              <button disabled={currentPage >= Math.ceil(filteredProducts.length / ITEMS_PER_PAGE)}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest transition-all disabled:opacity-20 rounded-lg flex items-center gap-1.5"
                style={{ background: "linear-gradient(135deg,#D4AF37,#B8860B)", color: "#0C2317" }}>
                <MiniFlower size={14} c1="#0C2317" c2="#1A3C2B" /> Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

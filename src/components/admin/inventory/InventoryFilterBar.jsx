import React from 'react';
import { Search } from 'lucide-react';

export default function InventoryFilterBar({
  search,
  setSearch,
  stockFilter,
  setStockFilter,
  sortBy,
  setSortBy,
  productsCount = 0,
  aggregates,
}) {
  const { inStockCount, lowStockCount, outOfStockCount, highMarginCount } =
    aggregates;

  const tabs = [
    { id: 'all', label: 'All Items', count: productsCount },
    { id: 'in', label: 'In Stock (>5)', count: inStockCount },
    { id: 'low', label: 'Low Stock (≤5)', count: lowStockCount },
    { id: 'out', label: 'Out of Stock (0)', count: outOfStockCount },
    { id: 'high_margin', label: 'High Margin (≥45%)', count: highMarginCount },
  ];

  return (
    <div className="bg-[#0C2317] border border-[#D4AF37]/35 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col lg:flex-row items-center justify-between gap-4">
      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setStockFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
              stockFilter === tab.id
                ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317] shadow-lg'
                : 'bg-[#153424] text-[#EADFC9] border border-[#D4AF37]/30 hover:border-[#D4AF37]'
            }`}
          >
            <span>{tab.label}</span>
            <span className="ml-1.5 opacity-80 text-[10px]">({tab.count})</span>
          </button>
        ))}
      </div>

      {/* Search & Sort Controls */}
      <div className="flex items-center gap-3 w-full lg:w-auto">
        {/* Search */}
        <div className="relative flex-1 lg:w-72">
          <Search className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search saree, SKU or category..."
            className="w-full bg-[#153424] border border-[#D4AF37]/35 rounded-xl pl-9 pr-4 py-2 text-xs text-[#F3E5AB] placeholder-[#D4AF37]/50 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        {/* Sort By Dropdown */}
        <div className="relative shrink-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#153424] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-xs text-[#F3E5AB] font-bold focus:outline-none focus:border-[#D4AF37] cursor-pointer"
          >
            <option value="value_desc">Sort: Highest Valuation</option>
            <option value="profit_desc">Sort: Highest Profit</option>
            <option value="margin_desc">Sort: Highest Margin %</option>
            <option value="stock_asc">Sort: Lowest Stock First</option>
            <option value="stock_desc">Sort: Highest Stock First</option>
            <option value="name_asc">Sort: Saree Name (A to Z)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { Search, X, Filter } from 'lucide-react';

const ORDER_TABS = [
  'all',
  'pending',
  'paid',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

export default function OrdersFilterBar({
  searchQuery,
  setSearchQuery,
  activeTab,
  setActiveTab,
  orders = [],
  filteredCount = 0,
}) {
  return (
    <div className="bg-[#0C2317] border border-[#D4AF37]/35 p-4 rounded-2xl space-y-4 shadow-xl font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Real-time Keyword Search Input Box */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Order ID, Customer Name, Email, or Phone..."
            className="w-full bg-[#1A3C2B] border border-[#D4AF37]/35 rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#F3E5AB] placeholder:text-[#EADFC9]/50 focus:outline-none focus:border-[#D4AF37]"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#EADFC9]/60 hover:text-[#F3E5AB]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="text-xs text-[#D4AF37] font-bold flex items-center gap-1.5 shrink-0">
          <Filter className="w-3.5 h-3.5" />
          <span>
            Showing {filteredCount} of {orders.length} orders
          </span>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex gap-2 border-t border-[#D4AF37]/20 pt-3 overflow-x-auto no-scrollbar">
        {ORDER_TABS.map((t) => {
          const count = orders.filter((o) =>
            t === 'all'
              ? true
              : (o.status || 'pending').toLowerCase() === t.toLowerCase()
          ).length;

          return (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === t
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317] shadow-lg scale-105'
                  : 'bg-[#1A3C2B] text-[#F3E5AB] hover:bg-[#D4AF37] hover:text-[#0C2317] border border-[#D4AF37]/35'
              }`}
            >
              <span>{t}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === t
                    ? 'bg-[#0C2317] text-[#D4AF37]'
                    : 'bg-[#081A11] text-[#EADFC9]'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

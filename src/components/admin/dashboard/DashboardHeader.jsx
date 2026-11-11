import React from 'react';
import { Link } from 'react-router-dom';
import { RefreshCw, Boxes, TrendingUp, ArrowUpRight } from 'lucide-react';

export default function DashboardHeader({ onRefresh, loading }) {
  return (
    <header className="animate-container-in bg-[#0F131C] border border-[#D4AF37]/35 rounded-2xl p-6 sm:p-7 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse" />
            <span className="text-[11px] uppercase tracking-widest text-[#D4AF37] font-bold">
              Isai Heritage Real-Time Console
            </span>
          </div>
          <h1 className="font-sans text-2xl sm:text-3xl font-bold text-[#FFFFFF] tracking-tight">
            Admin Control & Analytics
          </h1>
          <p className="text-xs sm:text-sm text-[#D1D5DB] max-w-2xl font-normal leading-relaxed">
            Live sales analytics, inventory valuation, active orders fulfillment, and customer registry.
          </p>
        </div>

        {/* Quick Action Navigation Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onRefresh}
            disabled={loading}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#161B26] border border-[#D4AF37]/40 text-[#D4AF37] hover:bg-[#1E2534] hover:text-[#FFFFFF] active:scale-95 transition-all text-xs font-bold cursor-pointer"
            title="Force refresh all stats"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#D4AF37]' : ''}`} />
            <span>Refresh Data</span>
          </button>

          <Link
            to="/admin/inventory"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#161B26] border border-[#D4AF37]/40 text-[#F5E6BE] hover:bg-[#1E2534] hover:border-[#D4AF37] transition-all text-xs uppercase tracking-wider font-bold cursor-pointer"
          >
            <Boxes className="w-4 h-4 text-[#D4AF37]" />
            <span>Manage Inventory</span>
          </Link>

          <Link
            to="/admin/profit-loss"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#D4AF37] hover:bg-[#E5C158] text-[#090B10] font-extrabold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Profit & Loss</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}


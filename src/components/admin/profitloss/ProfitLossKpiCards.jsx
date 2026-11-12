import React from 'react';
import { DollarSign, TrendingUp, Percent, ShoppingBag } from 'lucide-react';

export default function ProfitLossKpiCards({ metrics }) {
  const { grossRevenue, netProfit, profitMargin, avgOrderValue } = metrics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 font-sans">
      {/* Gross Revenue */}
      <div className="bg-[#0F131C] border border-[#D4AF37]/35 p-4 sm:p-5 rounded-2xl shadow-xl flex items-center gap-3.5 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#161B26] border border-[#D4AF37]/30 flex items-center justify-center text-[#FFD54F] shrink-0">
          <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <span className="block text-[10px] text-[#D4AF37]/80 uppercase font-bold tracking-wider mb-1 truncate">
            Gross Revenue
          </span>
          <span className="font-sans text-xl sm:text-2xl font-bold text-[#FFFFFF] truncate block">
            ₹{grossRevenue.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Estimated Net Profit */}
      <div className="bg-[#0F131C] border border-emerald-500/40 p-4 sm:p-5 rounded-2xl shadow-xl flex items-center gap-3.5 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
          <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <span className="block text-[10px] text-emerald-300/80 uppercase font-bold tracking-wider mb-1 truncate">
            Estimated Net Profit
          </span>
          <span className="font-sans text-xl sm:text-2xl font-bold text-emerald-300 truncate block">
            ₹{netProfit.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Profit Margin % */}
      <div className="bg-[#0F131C] border border-[#D4AF37]/35 p-4 sm:p-5 rounded-2xl shadow-xl flex items-center gap-3.5 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#161B26] border border-[#D4AF37]/30 flex items-center justify-center text-[#FFD54F] shrink-0">
          <Percent className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <span className="block text-[10px] text-[#D4AF37]/80 uppercase font-bold tracking-wider mb-1 truncate">
            Net Profit Margin
          </span>
          <span className="font-sans text-xl sm:text-2xl font-bold text-[#FFFFFF] block">
            {profitMargin}%
          </span>
        </div>
      </div>

      {/* Average Order Value (AOV) */}
      <div className="bg-[#0F131C] border border-[#D4AF37]/35 p-4 sm:p-5 rounded-2xl shadow-xl flex items-center gap-3.5 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#161B26] border border-[#D4AF37]/30 flex items-center justify-center text-[#FFD54F] shrink-0">
          <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <span className="block text-[10px] text-[#D4AF37]/80 uppercase font-bold tracking-wider mb-1 truncate">
            Average Order Value
          </span>
          <span className="font-sans text-xl sm:text-2xl font-bold text-[#FFFFFF] truncate block">
            ₹{avgOrderValue.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
}

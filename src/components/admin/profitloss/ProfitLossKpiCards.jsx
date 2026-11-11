import React from 'react';
import { DollarSign, TrendingUp, Percent, ShoppingBag } from 'lucide-react';

export default function ProfitLossKpiCards({ metrics }) {
  const { grossRevenue, netProfit, profitMargin, avgOrderValue } = metrics;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 font-sans">
      {/* Gross Revenue */}
      <div className="bg-[#0F131C] border border-[#D4AF37]/35 p-5 sm:p-6 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#161B26] border border-[#D4AF37]/30 flex items-center justify-center text-[#FFD54F] shrink-0">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <span className="block text-[10px] text-[#D4AF37]/80 uppercase font-bold tracking-wider mb-1">
            Gross Revenue
          </span>
          <span className="font-sans text-2xl font-bold text-[#FFFFFF]">
            ₹{grossRevenue.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Estimated Net Profit */}
      <div className="bg-[#0F131C] border border-emerald-500/40 p-5 sm:p-6 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
          <TrendingUp className="w-6 h-6" />
        </div>
        <div>
          <span className="block text-[10px] text-emerald-300/80 uppercase font-bold tracking-wider mb-1">
            Estimated Net Profit
          </span>
          <span className="font-sans text-2xl font-bold text-emerald-300">
            ₹{netProfit.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Profit Margin % */}
      <div className="bg-[#0F131C] border border-[#D4AF37]/35 p-5 sm:p-6 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#161B26] border border-[#D4AF37]/30 flex items-center justify-center text-[#FFD54F] shrink-0">
          <Percent className="w-6 h-6" />
        </div>
        <div>
          <span className="block text-[10px] text-[#D4AF37]/80 uppercase font-bold tracking-wider mb-1">
            Net Profit Margin
          </span>
          <span className="font-sans text-2xl font-bold text-[#FFFFFF]">
            {profitMargin}%
          </span>
        </div>
      </div>

      {/* Average Order Value (AOV) */}
      <div className="bg-[#0F131C] border border-[#D4AF37]/35 p-5 sm:p-6 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#161B26] border border-[#D4AF37]/30 flex items-center justify-center text-[#FFD54F] shrink-0">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div>
          <span className="block text-[10px] text-[#D4AF37]/80 uppercase font-bold tracking-wider mb-1">
            Average Order Value
          </span>
          <span className="font-sans text-2xl font-bold text-[#FFFFFF]">
            ₹{avgOrderValue.toLocaleString('en-IN')}
          </span>
        </div>
      </div>
    </div>
  );
}

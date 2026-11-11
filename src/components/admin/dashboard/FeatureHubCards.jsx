import React from 'react';
import { Link } from 'react-router-dom';
import { Boxes, TrendingUp, ChevronRight } from 'lucide-react';

export default function FeatureHubCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Card A: Stock Control Hub */}
      <div className="animate-container-in bg-[#0F131C] border border-[#D4AF37]/35 hover:border-[#D4AF37] p-6 rounded-2xl shadow-xl flex flex-col justify-between transition-colors">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#D4AF37] uppercase font-bold tracking-wider flex items-center gap-2">
              <Boxes className="w-4 h-4 text-[#D4AF37]" /> Inventory Warehouse
            </span>
            <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#161B26] text-[#D4AF37] border border-[#D4AF37]/40">
              {stats.totalStockUnits} Units In Stock
            </span>
          </div>
          <h2 className="font-sans text-lg font-bold text-[#FFFFFF]">
            Saree Catalog Stock & Variant Replenishment
          </h2>
          <p className="text-xs text-[#D1D5DB] leading-relaxed">
            Review low stock alerts, adjust variant quantities in one click, update procurement cost prices, and export stock sheets.
          </p>
        </div>
        <div className="mt-5 pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between">
          <span className="text-xs text-amber-300 font-medium">
            {stats.lowStockCount + stats.outOfStockCount} items need attention
          </span>
          <Link
            to="/admin/inventory"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] hover:text-[#FFFFFF] uppercase tracking-wider"
          >
            <span>Open Inventory</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Card B: P&L Financial Hub */}
      <div className="animate-container-in bg-[#0F131C] border border-[#D4AF37]/35 hover:border-[#D4AF37] p-6 rounded-2xl shadow-xl flex flex-col justify-between transition-colors">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-[#D4AF37] uppercase font-bold tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#D4AF37]" /> Financial Statements
            </span>
            <span className="px-3 py-0.5 rounded-full text-[11px] font-bold bg-[#161B26] text-[#D4AF37] border border-[#D4AF37]/40">
              Healthy Cash Flow
            </span>
          </div>
          <h2 className="font-sans text-lg font-bold text-[#FFFFFF]">
            Profit & Loss Accounts & Ledger
          </h2>
          <p className="text-xs text-[#D1D5DB] leading-relaxed">
            Analyze precise margins, manufacturing cost deductions, online vs COD splits, and download monthly statements.
          </p>
        </div>
        <div className="mt-5 pt-3 border-t border-[#D4AF37]/20 flex items-center justify-between">
          <span className="text-xs text-[#D4AF37] font-medium">
            Est. Net Profit: ₹{stats.estimatedProfit.toLocaleString('en-IN')}
          </span>
          <Link
            to="/admin/profit-loss"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D4AF37] hover:text-[#FFFFFF] uppercase tracking-wider"
          >
            <span>View Full Statements</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}


import React from 'react';
import {
  Boxes,
  Coins,
  DollarSign,
  Percent,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  RotateCcw,
  Save,
} from 'lucide-react';

export default function InventoryKpis({
  aggregates,
  catalogLength,
  totalModifiedCount,
  onDiscardAll,
  onSaveAll,
  savingAll,
  setStockFilter,
}) {
  const {
    totalUnits,
    totalCostAmount,
    totalSellingAmount,
    totalDiscountAmount,
    totalPotentialProfit,
    overallMarginPercent,
    outOfStockCount,
    lowStockCount,
  } = aggregates;

  return (
    <div className="space-y-4 sm:space-y-6 font-sans">
      {/* Unsaved Changes Banner */}
      {totalModifiedCount > 0 && (
        <div className="bg-[#0F131C] border border-[#D4AF37] p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#161B26] border border-[#D4AF37] flex items-center justify-center text-[#FFD54F] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#FFFFFF]">
                Unsaved modifications detected across {totalModifiedCount} saree(s)
              </p>
              <p className="text-[11px] text-[#D4AF37]/80">
                Stock counts and cost prices have been altered in the workspace.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto w-full sm:w-auto">
            <button
              type="button"
              onClick={onDiscardAll}
              className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-xl bg-transparent border border-[#D4AF37]/40 text-[#FFFFFF] text-xs font-bold uppercase tracking-wider hover:bg-white/5 cursor-pointer flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard All</span>
            </button>
            <button
              type="button"
              onClick={onSaveAll}
              disabled={savingAll}
              className="flex-1 sm:flex-none px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#090B10] text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-lg cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingAll ? 'Saving All...' : `Save All (${totalModifiedCount})`}</span>
            </button>
          </div>
        </div>
      )}

      {/* Critical Stock Warning Banner */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="bg-gradient-to-r from-amber-950/80 via-[#1C1408] to-amber-950/80 border border-amber-500/40 p-3.5 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-sans text-xs sm:text-sm font-bold text-amber-200 uppercase tracking-wider">
                Immediate Inventory Attention Required
              </h4>
              <p className="text-xs text-amber-300/80 mt-0.5 font-light">
                {outOfStockCount > 0 &&
                  `${outOfStockCount} saree(s) currently out of stock. `}
                {lowStockCount > 0 &&
                  `${lowStockCount} saree(s) running critically low with 5 or fewer units.`}
              </p>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setStockFilter('out')}
              className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg bg-red-900/60 border border-red-500/40 text-red-200 text-xs font-bold uppercase tracking-wider hover:bg-red-800 transition-colors cursor-pointer text-center"
            >
              Out of Stock ({outOfStockCount})
            </button>
            <button
              type="button"
              onClick={() => setStockFilter('low')}
              className="flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg bg-amber-900/60 border border-amber-500/40 text-amber-200 text-xs font-bold uppercase tracking-wider hover:bg-amber-800 transition-colors cursor-pointer text-center"
            >
              Low Stock ({lowStockCount})
            </button>
          </div>
        </div>
      )}

      {/* 6 Executive Financial & Inventory Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-3 sm:gap-4">
        {/* Card 1: Total Units */}
        <div className="bg-[#0F131C] border border-[#D4AF37]/35 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#D4AF37]/80 uppercase font-bold tracking-wider">
              Total Stock Units
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#161B26] border border-[#D4AF37]/30 flex items-center justify-center text-[#FFD54F]">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-sans text-xl sm:text-2xl font-bold text-[#FFFFFF] block">
              {totalUnits.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#A1A1AA] block mt-0.5">
              Across {catalogLength} saree catalog designs
            </span>
          </div>
        </div>

        {/* Card 2: Total Cost Amount */}
        <div className="bg-[#0F131C] border border-[#D4AF37]/35 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-300 uppercase font-bold tracking-wider">
              Total Cost Amount
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/40 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-sans text-xl sm:text-2xl font-bold text-amber-200 block truncate">
              ₹{totalCostAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] sm:text-[11px] text-amber-300/70 block mt-0.5">
              Wholesale procurement capital
            </span>
          </div>
        </div>

        {/* Card 3: Total Selling Amount */}
        <div className="bg-[#0F131C] border border-[#D4AF37]/35 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#D4AF37]/80 uppercase font-bold tracking-wider">
              Total Selling Amount
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#161B26] border border-[#D4AF37]/30 flex items-center justify-center text-[#FFD54F]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-sans text-xl sm:text-2xl font-bold text-[#FFFFFF] block truncate">
              ₹{totalSellingAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#A1A1AA] block mt-0.5">
              Gross inventory retail value
            </span>
          </div>
        </div>

        {/* Card 4: Total Discount Amount */}
        <div className="bg-[#0F131C] border border-[#D4AF37]/35 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-purple-300 uppercase font-bold tracking-wider">
              Total Discount Amount
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-950/40 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-sans text-xl sm:text-2xl font-bold text-purple-200 block truncate">
              ₹{totalDiscountAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] sm:text-[11px] text-purple-300/70 block mt-0.5">
              Total customer promotional savings
            </span>
          </div>
        </div>

        {/* Card 5: Total Potential Profit */}
        <div className="bg-[#0F131C] border border-emerald-500/50 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col justify-between ring-1 ring-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider">
              Potential Profit
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center text-emerald-300">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-sans text-xl sm:text-2xl font-bold text-emerald-300 block truncate">
              ₹{totalPotentialProfit.toLocaleString('en-IN')}
            </span>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/50">
              +{overallMarginPercent}% Margin
            </span>
          </div>
        </div>

        {/* Card 6: Stock Alerts */}
        <div className="bg-[#0F131C] border border-[#D4AF37]/35 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#D4AF37]/80 uppercase font-bold tracking-wider">
              Stock Health Status
            </span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                outOfStockCount > 0
                  ? 'bg-red-950/40 border-red-500/40 text-red-400'
                  : lowStockCount > 0
                  ? 'bg-amber-950/40 border-amber-500/40 text-amber-400'
                  : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span
              className={`font-sans text-xl sm:text-2xl font-bold block ${
                outOfStockCount > 0
                  ? 'text-red-400'
                  : lowStockCount > 0
                  ? 'text-amber-300'
                  : 'text-emerald-300'
              }`}
            >
              {outOfStockCount > 0
                ? `${outOfStockCount} Depleted`
                : lowStockCount > 0
                ? `${lowStockCount} Low`
                : '100% Healthy'}
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#A1A1AA] block mt-0.5 truncate">
              {outOfStockCount + lowStockCount === 0
                ? 'All sarees safely stocked'
                : 'Restocking suggested'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

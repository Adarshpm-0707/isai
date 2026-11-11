import React from 'react';
import { Link } from 'react-router-dom';
import { CreditCard, TrendingUp, ShoppingBag, Users, Boxes, ArrowUpRight } from 'lucide-react';

export default function DashboardKpiCards({ stats }) {
  const hasLowStock = stats.lowStockCount > 0 || stats.outOfStockCount > 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Card 1: Gross Revenue */}
      <div className="animate-container-in bg-[#0F131C] border border-[#D4AF37]/35 hover:border-[#D4AF37] p-5 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
            Gross Revenue
          </span>
          <div className="w-9 h-9 rounded-xl bg-[#161B26] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div className="space-y-1">
          <span className="font-serif text-2xl font-bold text-[#FFFFFF] tracking-tight block">
            ₹{stats.totalRevenue.toLocaleString('en-IN')}
          </span>
          <p className="text-[11px] text-[#A1A1AA] font-medium">Live all-time total</p>
        </div>
      </div>

      {/* Card 2: Estimated Net Profit */}
      <Link
        to="/admin/profit-loss"
        className="animate-container-in bg-[#0F131C] border border-[#D4AF37]/35 hover:border-[#D4AF37] p-5 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer block"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] flex items-center gap-1">
            Net Profit <ArrowUpRight className="w-3.5 h-3.5" />
          </span>
          <div className="w-9 h-9 rounded-xl bg-[#161B26] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="space-y-1">
          <span className="font-serif text-2xl font-bold text-[#FFFFFF] tracking-tight block">
            ₹{stats.estimatedProfit.toLocaleString('en-IN')}
          </span>
          <p className="text-[11px] text-[#A1A1AA] font-medium">Estimated ~48% margin</p>
        </div>
      </Link>

      {/* Card 3: Total Orders */}
      <Link
        to="/admin/orders"
        className="animate-container-in bg-[#0F131C] border border-[#D4AF37]/35 hover:border-[#D4AF37] p-5 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer block"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
            Total Orders
          </span>
          <div className="w-9 h-9 rounded-xl bg-[#161B26] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>
        <div className="space-y-1">
          <span className="font-serif text-2xl font-bold text-[#FFFFFF] tracking-tight block">
            {stats.totalOrders}
          </span>
          <p className="text-[11px] text-[#A1A1AA] font-medium">Recorded sales orders</p>
        </div>
      </Link>

      {/* Card 4: Customers */}
      <Link
        to="/admin/customers"
        className="animate-container-in bg-[#0F131C] border border-[#D4AF37]/35 hover:border-[#D4AF37] p-5 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer block"
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
            Customers
          </span>
          <div className="w-9 h-9 rounded-xl bg-[#161B26] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="space-y-1">
          <span className="font-serif text-2xl font-bold text-[#FFFFFF] tracking-tight block">
            {stats.activeCustomersCount}
          </span>
          <p className="text-[11px] text-[#A1A1AA] font-medium">Registered client profiles</p>
        </div>
      </Link>

      {/* Card 5: Inventory Units */}
      <Link
        to="/admin/inventory"
        className={`animate-container-in bg-[#0F131C] border p-5 rounded-2xl shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer block ${
          hasLowStock
            ? 'border-amber-500/70 hover:border-amber-400'
            : 'border-[#D4AF37]/35 hover:border-[#D4AF37]'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
            Stock Units
          </span>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              hasLowStock
                ? 'bg-amber-950/60 border border-amber-500/60 text-amber-300'
                : 'bg-[#161B26] border border-[#D4AF37]/30 text-[#D4AF37]'
            }`}
          >
            <Boxes className="w-4 h-4" />
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-serif text-2xl font-bold text-[#FFFFFF] tracking-tight">
              {stats.totalStockUnits}
            </span>
            {hasLowStock && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {stats.lowStockCount + stats.outOfStockCount} Low
              </span>
            )}
          </div>
          <p className="text-[11px] text-[#A1A1AA] font-medium">Total pieces in warehouse</p>
        </div>
      </Link>
    </div>
  );
}

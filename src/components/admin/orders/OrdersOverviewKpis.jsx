import React from 'react';
import { ShoppingBag, Clock, CheckCircle, DollarSign } from 'lucide-react';

export default function OrdersOverviewKpis({ stats }) {
  const { totalOrdersCount, pendingCount, fulfilledCount, totalRevenueSum } = stats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4 font-sans">
      <div className="bg-[#0F131C] border border-[#D4AF37]/35 p-4 sm:p-5 rounded-2xl shadow-xl flex items-center gap-3.5 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#161B26] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
          <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider font-bold text-[#A1A1AA] truncate">
            Total Orders
          </p>
          <p className="text-xl sm:text-2xl font-sans font-bold text-[#FFFFFF]">
            {totalOrdersCount}
          </p>
        </div>
      </div>

      <div className="bg-[#0F131C] border border-[#D4AF37]/35 p-4 sm:p-5 rounded-2xl shadow-xl flex items-center gap-3.5 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
          <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider font-bold text-[#A1A1AA] truncate">
            Pending Dispatch
          </p>
          <p className="text-xl sm:text-2xl font-sans font-bold text-amber-300">
            {pendingCount}
          </p>
        </div>
      </div>

      <div className="bg-[#0F131C] border border-[#D4AF37]/35 p-4 sm:p-5 rounded-2xl shadow-xl flex items-center gap-3.5 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider font-bold text-[#A1A1AA] truncate">
            Fulfilled Orders
          </p>
          <p className="text-xl sm:text-2xl font-sans font-bold text-emerald-300">
            {fulfilledCount}
          </p>
        </div>
      </div>

      <div className="bg-[#0F131C] border border-[#D4AF37]/35 p-4 sm:p-5 rounded-2xl shadow-xl flex items-center gap-3.5 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#161B26] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
          <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
        </div>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-wider font-bold text-[#A1A1AA] truncate">
            Orders Revenue
          </p>
          <p className="text-xl sm:text-2xl font-sans font-bold text-[#D4AF37] truncate">
            ₹{totalRevenueSum.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  );
}

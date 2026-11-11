import React from 'react';
import { ShoppingBag, Clock, CheckCircle, DollarSign } from 'lucide-react';

export default function OrdersOverviewKpis({ stats }) {
  const { totalOrdersCount, pendingCount, fulfilledCount, totalRevenueSum } = stats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
      <div className="bg-[#0F131C] border border-[#D4AF37]/35 p-5 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#161B26] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-[#A1A1AA]">
            Total Orders
          </p>
          <p className="text-2xl font-sans font-bold text-[#FFFFFF]">
            {totalOrdersCount}
          </p>
        </div>
      </div>

      <div className="bg-[#0F131C] border border-[#D4AF37]/35 p-5 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-[#A1A1AA]">
            Pending Dispatch
          </p>
          <p className="text-2xl font-sans font-bold text-amber-300">
            {pendingCount}
          </p>
        </div>
      </div>

      <div className="bg-[#0F131C] border border-[#D4AF37]/35 p-5 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-[#A1A1AA]">
            Fulfilled Orders
          </p>
          <p className="text-2xl font-sans font-bold text-emerald-300">
            {fulfilledCount}
          </p>
        </div>
      </div>

      <div className="bg-[#0F131C] border border-[#D4AF37]/35 p-5 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#161B26] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-[#A1A1AA]">
            Orders Revenue
          </p>
          <p className="text-2xl font-sans font-bold text-[#D4AF37]">
            ₹{totalRevenueSum.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { ShoppingBag, Clock, CheckCircle, DollarSign } from 'lucide-react';

export default function OrdersOverviewKpis({ stats }) {
  const { totalOrdersCount, pendingCount, fulfilledCount, totalRevenueSum } = stats;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
      <div className="bg-[#0C2317] border border-[#D4AF37]/35 p-5 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#1A3C2B] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-[#EADFC9]/70">
            Total Orders
          </p>
          <p className="text-2xl font-serif font-bold text-[#F3E5AB]">
            {totalOrdersCount}
          </p>
        </div>
      </div>

      <div className="bg-[#0C2317] border border-[#D4AF37]/35 p-5 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-[#EADFC9]/70">
            Pending Dispatch
          </p>
          <p className="text-2xl font-serif font-bold text-amber-300">
            {pendingCount}
          </p>
        </div>
      </div>

      <div className="bg-[#0C2317] border border-[#D4AF37]/35 p-5 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
          <CheckCircle className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-[#EADFC9]/70">
            Fulfilled Orders
          </p>
          <p className="text-2xl font-serif font-bold text-emerald-300">
            {fulfilledCount}
          </p>
        </div>
      </div>

      <div className="bg-[#0C2317] border border-[#D4AF37]/35 p-5 rounded-2xl shadow-xl flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-[#1A3C2B] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-[#EADFC9]/70">
            Orders Revenue
          </p>
          <p className="text-2xl font-serif font-bold text-[#D4AF37]">
            ₹{totalRevenueSum.toLocaleString('en-IN')}
          </p>
        </div>
      </div>
    </div>
  );
}

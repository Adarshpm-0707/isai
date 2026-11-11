import React from 'react';
import { CreditCard, ShoppingBag } from 'lucide-react';

export default function ProfitLossDetailsGrid({ metrics }) {
  const {
    grossRevenue,
    estimatedCOGS,
    estimatedOperating,
    totalDiscounts,
    netProfit,
    prepaidOrders,
    prepaidRevenue,
    codOrders,
    codRevenue,
  } = metrics;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Cost & Margin Analysis */}
      <div className="bg-[#0C2317] border border-[#D4AF37]/35 p-6 rounded-2xl shadow-xl space-y-4">
        <h4 className="font-serif text-base font-bold text-[#F3E5AB] uppercase tracking-wider pb-3 border-b border-[#D4AF37]/25 flex items-center justify-between">
          <span>Profit &amp; Loss Breakdown</span>
          <span className="text-[10px] text-[#D4AF37] font-sans font-bold uppercase">
            Financial Summary
          </span>
        </h4>

        <div className="space-y-3 text-xs font-sans">
          <div className="flex justify-between items-center py-1.5 border-b border-[#D4AF37]/15">
            <span className="text-[#EADFC9]">Gross Retail Revenue</span>
            <span className="font-bold text-[#F3E5AB]">
              + ₹{grossRevenue.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-[#D4AF37]/15">
            <span className="text-[#EADFC9]">
              Estimated Handloom Cost (COGS ~46%)
            </span>
            <span className="font-bold text-amber-300">
              - ₹{estimatedCOGS.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex justify-between items-center py-1.5 border-b border-[#D4AF37]/15">
            <span className="text-[#EADFC9]">
              Estimated Logistics &amp; Shipping (~6%)
            </span>
            <span className="font-bold text-amber-300">
              - ₹{estimatedOperating.toLocaleString('en-IN')}
            </span>
          </div>

          {totalDiscounts > 0 && (
            <div className="flex justify-between items-center py-1.5 border-b border-[#D4AF37]/15">
              <span className="text-[#EADFC9]">Coupons &amp; Promotional Discounts</span>
              <span className="font-bold text-red-400">
                - ₹{totalDiscounts.toLocaleString('en-IN')}
              </span>
            </div>
          )}

          <div className="flex justify-between items-center py-2.5 bg-[#153424] px-3 rounded-xl mt-2 text-sm font-bold text-emerald-300">
            <span className="uppercase tracking-wider text-xs">Estimated Net Profit</span>
            <span className="text-base">₹{netProfit.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Payment Channels (Prepaid vs COD) */}
      <div className="bg-[#0C2317] border border-[#D4AF37]/35 p-6 rounded-2xl shadow-xl space-y-4">
        <h4 className="font-serif text-base font-bold text-[#F3E5AB] uppercase tracking-wider pb-3 border-b border-[#D4AF37]/25 flex items-center justify-between">
          <span>Payment Method Analysis</span>
          <span className="text-[10px] text-[#D4AF37] font-sans font-bold uppercase">
            Settlement Split
          </span>
        </h4>

        <div className="space-y-4 text-xs font-sans">
          {/* Prepaid Online */}
          <div className="p-3.5 rounded-xl bg-[#153424] border border-[#D4AF37]/25 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-[#F3E5AB]">Online Prepaid (Card / UPI)</span>
              </div>
              <span className="font-bold text-emerald-300">
                ₹{prepaidRevenue.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-[#EADFC9]/80">
              <span>{prepaidOrders.length} Completed Orders</span>
              <span>
                {grossRevenue > 0
                  ? Math.round((prepaidRevenue / grossRevenue) * 100)
                  : 0}
                % of total sales
              </span>
            </div>
          </div>

          {/* Cash on Delivery */}
          <div className="p-3.5 rounded-xl bg-[#153424] border border-[#D4AF37]/25 space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span className="font-bold text-[#F3E5AB]">Cash on Delivery (COD)</span>
              </div>
              <span className="font-bold text-amber-300">
                ₹{codRevenue.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-[#EADFC9]/80">
              <span>{codOrders.length} Completed Orders</span>
              <span>
                {grossRevenue > 0
                  ? Math.round((codRevenue / grossRevenue) * 100)
                  : 0}
                % of total sales
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

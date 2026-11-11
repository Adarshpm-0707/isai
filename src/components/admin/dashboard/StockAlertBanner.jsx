import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ChevronRight } from 'lucide-react';

export default function StockAlertBanner({ lowStockCount, outOfStockCount }) {
  if (lowStockCount <= 0 && outOfStockCount <= 0) return null;

  return (
    <div className="animate-container-in bg-[#181113] border-2 border-amber-500 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/50 shrink-0">
            <ShieldAlert className="w-6 h-6 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-serif font-bold text-amber-200 text-sm tracking-wide">
                Urgent Inventory Alert: Low Stock Warning
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-500 text-[#090B10] uppercase">
                Attention Required
              </span>
            </div>
            <p className="text-xs text-[#F5E6BE] mt-1 font-sans leading-normal">
              {outOfStockCount > 0 && (
                <span className="text-red-400 font-bold mr-2">
                  {outOfStockCount} sarees are currently completely out of stock.
                </span>
              )}
              {lowStockCount > 0 && (
                <span className="text-amber-300 font-semibold">
                  {lowStockCount} sarees have 5 or fewer units remaining in warehouse.
                </span>
              )}
            </p>
          </div>
        </div>
        <Link
          to="/admin/inventory"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#090B10] font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 shrink-0"
        >
          <span>Restock Inventory</span>
          <ChevronRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

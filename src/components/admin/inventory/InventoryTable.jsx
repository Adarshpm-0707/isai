import React from 'react';
import { Link } from 'react-router-dom';
import {
  XCircle,
  AlertTriangle,
  CheckCircle2,
  Minus,
  Plus,
  Save,
  RotateCcw,
  Edit2,
} from 'lucide-react';
import { getProductImage } from '../../../utils/productHelpers';
import { getProductFinancials } from '../../../utils/inventoryHelpers';

export default function InventoryTable({
  filteredProducts = [],
  stockEdits = {},
  costEdits = {},
  handleCostChange,
  handleAdjustDelta,
  handleStockChange,
  handleSaveProduct,
  handleDiscardRowEdits,
  savingId,
}) {
  return (
    <div className="bg-[#0F131C] border border-[#D4AF37]/35 rounded-2xl overflow-hidden shadow-2xl font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-b border-[#D4AF37]/25 text-[#D4AF37] uppercase font-bold bg-[#0A0D14]">
              <th className="py-3.5 sm:py-4 px-3 sm:px-4 min-w-[180px] sm:min-w-[220px]">Saree Product</th>
              <th className="py-3.5 sm:py-4 px-2.5 sm:px-3 min-w-[110px] sm:min-w-[130px]">Cost Price</th>
              <th className="py-3.5 sm:py-4 px-2.5 sm:px-3 min-w-[100px] sm:min-w-[120px]">Selling Price</th>
              <th className="py-3.5 sm:py-4 px-2.5 sm:px-3 min-w-[100px] sm:min-w-[110px]">Discount</th>
              <th className="py-3.5 sm:py-4 px-2.5 sm:px-3 min-w-[100px] sm:min-w-[120px]">Unit Profit</th>
              <th className="py-3.5 sm:py-4 px-2.5 sm:px-3 min-w-[120px] sm:min-w-[140px]">Line Valuation</th>
              <th className="py-3.5 sm:py-4 px-2.5 sm:px-3 min-w-[110px] sm:min-w-[130px]">Stock Status</th>
              <th className="py-3.5 sm:py-4 px-3 sm:px-4 min-w-[140px] sm:min-w-[160px]">Stock Count</th>
              <th className="py-3.5 sm:py-4 px-3 sm:px-4 text-right min-w-[90px] sm:min-w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D4AF37]/15">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-12 text-center text-[#A1A1AA] italic">
                  No sarees match the selected inventory and financial criteria.
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => {
                const currentStock = Number(p.stock) || 0;
                const baseFin = getProductFinancials(p, undefined, undefined);
                const currentCost = baseFin.costPrice;

                const fin = getProductFinancials(p, stockEdits[p.id], costEdits[p.id]);

                const isStockModified =
                  stockEdits[p.id] !== undefined && stockEdits[p.id] !== currentStock;
                const isCostModified =
                  costEdits[p.id] !== undefined && costEdits[p.id] !== currentCost;
                const isModified = isStockModified || isCostModified;

                return (
                  <tr
                    key={p.id}
                    className={`transition-colors ${
                      isModified ? 'bg-[#161B26]/90' : 'hover:bg-[#161B26]/60'
                    }`}
                  >
                    {/* 1. Saree Product Info */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-11 aspect-[3/4] rounded-lg overflow-hidden bg-[#0A0D14] border border-[#D4AF37]/30 shrink-0 shadow">
                          <img
                            src={getProductImage(p)}
                            alt={p.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 max-w-[180px]">
                          <p className="font-bold text-[#FFFFFF] truncate text-xs">
                            {p.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-[#161B26] text-[#D4AF37] border border-[#D4AF37]/30">
                              {p.category || 'Pure Silk'}
                            </span>
                            <span className="text-[9px] text-[#A1A1AA] font-mono">
                              ID:{p.id?.slice(0, 6)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 2. Cost Price (Inline Editable) */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-1">
                        <div className="flex items-center border border-[#D4AF37]/40 rounded-lg overflow-hidden bg-[#0A0D14] max-w-[110px]">
                          <span className="px-1.5 text-xs text-[#D4AF37] font-bold bg-[#161B26] select-none">
                            ₹
                          </span>
                          <input
                            type="number"
                            min="0"
                            step="50"
                            value={
                              costEdits[p.id] !== undefined
                                ? costEdits[p.id]
                                : fin.costPrice
                            }
                            onChange={(e) => handleCostChange(p.id, e.target.value)}
                            className="w-full px-1.5 py-1 text-xs font-bold font-mono text-amber-200 bg-transparent focus:outline-none"
                            title="Wholesale procurement cost per saree"
                          />
                        </div>
                        {isCostModified && (
                          <span className="text-[9px] text-amber-400 font-semibold block">
                            Original: ₹{currentCost.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 3. Selling Price */}
                    <td className="py-3.5 px-3">
                      <div>
                        <span className="font-bold text-[#FFFFFF] text-xs block">
                          ₹{fin.sellingPrice.toLocaleString('en-IN')}
                        </span>
                        {fin.originalPrice > fin.sellingPrice && (
                          <span className="text-[10px] text-[#A1A1AA] line-through block">
                            ₹{fin.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* 4. Unit Discount */}
                    <td className="py-3.5 px-3">
                      {fin.unitDiscount > 0 ? (
                        <div>
                          <span className="font-bold text-purple-300 text-xs block">
                            ₹{fin.unitDiscount.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[9px] text-purple-400 font-medium block">
                            {fin.discountPercent}% OFF
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-[#A1A1AA] italic">
                          Full MRP
                        </span>
                      )}
                    </td>

                    {/* 5. Unit Profit & Margin */}
                    <td className="py-3.5 px-3">
                      <div>
                        <span
                          className={`font-bold text-xs block ${
                            fin.unitProfit > 0 ? 'text-emerald-300' : 'text-red-400'
                          }`}
                        >
                          ₹{fin.unitProfit.toLocaleString('en-IN')}
                        </span>
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider border mt-0.5 ${
                            parseFloat(fin.marginPercent) >= 40
                              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                              : parseFloat(fin.marginPercent) > 0
                              ? 'bg-amber-950/80 text-amber-300 border-amber-500/50'
                              : 'bg-red-950/80 text-red-300 border-red-500/50'
                          }`}
                        >
                          +{fin.marginPercent}%
                        </span>
                      </div>
                    </td>

                    {/* 6. Line Valuation */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-0.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#A1A1AA]">Retail:</span>
                          <span className="font-bold text-[#FFFFFF]">
                            ₹{fin.lineSelling.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-amber-300/70">Cost:</span>
                          <span className="text-amber-200">
                            ₹{fin.lineCost.toLocaleString('en-IN')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] pt-0.5 border-t border-[#D4AF37]/20">
                          <span className="text-emerald-300/80 font-medium">
                            Profit:
                          </span>
                          <span className="font-bold text-emerald-300">
                            ₹{fin.lineProfit.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* 7. Stock Status */}
                    <td className="py-3.5 px-3">
                      {fin.stock <= 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-red-950/80 text-red-300 border border-red-500/50">
                          <XCircle className="w-3 h-3" />
                          Out of Stock
                        </span>
                      ) : fin.stock <= 5 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-500/50 animate-pulse">
                          <AlertTriangle className="w-3 h-3" />
                          Low ({fin.stock})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/50">
                          <CheckCircle2 className="w-3 h-3" />
                          In Stock ({fin.stock})
                        </span>
                      )}
                    </td>

                    {/* 8. Inline Stock Replenishment Controls */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-[#D4AF37]/40 rounded-lg overflow-hidden bg-[#0A0D14]">
                          <button
                            type="button"
                            onClick={() => handleAdjustDelta(p.id, currentStock, -1)}
                            disabled={fin.stock <= 0}
                            className="w-7 h-7 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors disabled:opacity-30 cursor-pointer"
                            title="Decrease stock by 1 unit"
                          >
                            <Minus className="w-3 h-3" />
                          </button>

                          <input
                            type="number"
                            min="0"
                            value={fin.stock}
                            onChange={(e) => handleStockChange(p.id, e.target.value)}
                            className="w-12 text-center text-xs font-bold font-mono text-[#FFFFFF] bg-transparent border-x border-[#D4AF37]/40 focus:outline-none"
                            title="Available stock units"
                          />

                          <button
                            type="button"
                            onClick={() => handleAdjustDelta(p.id, currentStock, +1)}
                            className="w-7 h-7 flex items-center justify-center text-[#D4AF37] hover:bg-[#D4AF37]/20 transition-colors cursor-pointer"
                            title="Increase stock by 1 unit"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Quick Save button for modified row */}
                        {isModified && (
                          <button
                            type="button"
                            onClick={() => handleSaveProduct(p)}
                            disabled={savingId === p.id}
                            className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#090B10] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-md hover:brightness-110 cursor-pointer disabled:opacity-50"
                            title="Save stock and cost changes"
                          >
                            <Save className="w-3 h-3" />
                            <span>{savingId === p.id ? '...' : 'Save'}</span>
                          </button>
                        )}
                      </div>
                    </td>

                    {/* 9. Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {isModified && (
                          <button
                            type="button"
                            onClick={() => handleDiscardRowEdits(p.id)}
                            className="p-1.5 rounded-lg text-[#D4AF37]/60 hover:text-red-300 hover:bg-white/5 transition-colors cursor-pointer"
                            title="Discard pending changes"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <Link
                          to={`/admin/products/edit/${p.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#161B26] text-[#FFFFFF] border border-[#D4AF37]/35 hover:bg-[#D4AF37] hover:text-[#090B10] transition-all text-[11px] font-bold uppercase tracking-wider cursor-pointer"
                          title="Edit full product details"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

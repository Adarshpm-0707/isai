import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../../services/productService';
import { adminLogService } from '../../services/adminLogService';
import SectionHeading from '../../components/reusable/SectionHeading';
import { getProductImage } from '../../utils/productHelpers';
import {
  Boxes,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  Plus,
  Minus,
  Save,
  Edit2,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Coins,
  Percent,
  Download,
  Sparkles,
  ArrowUpDown,
  RotateCcw,
} from 'lucide-react';

export default function ManageInventory() {
  const [products, setProducts] = useState(() => productService.getLocalProducts());
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('all'); /* 'all' | 'in' | 'low' | 'out' | 'high_margin' */
  const [sortBy, setSortBy] = useState('value_desc');
  const [stockEdits, setStockEdits] = useState({});
  const [costEdits, setCostEdits] = useState({});
  const [savingId, setSavingId] = useState(null);
  const [savingAll, setSavingAll] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const showNotification = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback(null), 3500);
  };

  const fetchProducts = async () => {
    const local = productService.getLocalProducts();
    if (local.length > 0) setProducts(local);
    setLoading(true);
    try {
      const res = await productService.getProducts({ limit: 500 });
      if (res && Array.isArray(res.products)) {
        setProducts(res.products);
      }
    } catch (err) {
      console.warn('Failed to refresh inventory products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();

    const handleUpdate = (e) => {
      if (Array.isArray(e.detail)) setProducts(e.detail);
    };
    window.addEventListener('isai:products_updated', handleUpdate);
    return () => window.removeEventListener('isai:products_updated', handleUpdate);
  }, []);

  /* Helper to calculate complete financial breakdown for any product */
  const getProductFinancials = (p, stockOverride, costOverride) => {
    const stock = stockOverride !== undefined ? Math.max(0, parseInt(stockOverride, 10) || 0) : Math.max(0, Number(p.stock) || 0);

    /* Effective customer retail selling price */
    const sellingPrice = Number(
      p.discount_price && Number(p.discount_price) > 0 && Number(p.discount_price) < Number(p.price)
        ? p.discount_price
        : p.price || 0
    );

    /* Original MRP regular price */
    const originalPrice = Number(
      p.original_price ||
      (p.discount_price && Number(p.discount_price) < Number(p.price) ? p.price : 0) ||
      (sellingPrice > 0 ? Math.round(sellingPrice * 1.25) : 0)
    );

    /* Unit discount amount */
    const unitDiscount = Math.max(0, originalPrice - sellingPrice);
    const discountPercent = originalPrice > 0 ? Math.round((unitDiscount / originalPrice) * 100) : 0;

    /* Procurement or weaver cost price */
    const defaultCost = sellingPrice > 0 ? Math.round(sellingPrice * 0.52) : 0;
    const rawCost = costOverride !== undefined ? costOverride : (p.cost !== undefined && p.cost !== null && Number(p.cost) > 0 ? Number(p.cost) : defaultCost);
    const costPrice = Math.max(0, Number(rawCost) || 0);

    /* Profit per saree */
    const unitProfit = sellingPrice - costPrice;
    const marginPercent = sellingPrice > 0 ? ((unitProfit / sellingPrice) * 100).toFixed(1) : '0.0';

    /* Line totals for current inventory stock */
    const lineCost = costPrice * stock;
    const lineSelling = sellingPrice * stock;
    const lineDiscount = unitDiscount * stock;
    const lineProfit = unitProfit * stock;

    return {
      stock,
      sellingPrice,
      originalPrice,
      unitDiscount,
      discountPercent,
      costPrice,
      unitProfit,
      marginPercent,
      lineCost,
      lineSelling,
      lineDiscount,
      lineProfit,
    };
  };

  /* Stock & Cost Edit Handlers */
  const handleStockChange = (id, newStock) => {
    const val = Math.max(0, parseInt(newStock, 10) || 0);
    setStockEdits((prev) => ({ ...prev, [id]: val }));
  };

  const handleAdjustDelta = (id, currentVal, delta) => {
    const activeVal = stockEdits[id] !== undefined ? stockEdits[id] : currentVal;
    const nextVal = Math.max(0, activeVal + delta);
    setStockEdits((prev) => ({ ...prev, [id]: nextVal }));
  };

  const handleCostChange = (id, newCost) => {
    const val = Math.max(0, parseFloat(newCost) || 0);
    setCostEdits((prev) => ({ ...prev, [id]: val }));
  };

  const handleDiscardRowEdits = (id) => {
    setStockEdits((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
    setCostEdits((prev) => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };

  /* Save single product updates */
  const handleSaveProduct = async (product) => {
    const fin = getProductFinancials(product, stockEdits[product.id], costEdits[product.id]);
    const currentStock = Number(product.stock) || 0;
    const baseFin = getProductFinancials(product, undefined, undefined);
    const currentCost = baseFin.costPrice;

    const targetStock = fin.stock;
    const targetCost = fin.costPrice;

    if (targetStock === currentStock && targetCost === currentCost) {
      return;
    }

    setSavingId(product.id);
    try {
      await productService.updateProduct(product.id, {
        stock: targetStock,
        cost: targetCost,
      });

      await adminLogService.logAction('UPDATE_INVENTORY_STOCK_AND_COST', 'products', product.id, {
        old_stock: currentStock,
        new_stock: targetStock,
        old_cost: currentCost,
        new_cost: targetCost,
        product_name: product.name,
      });

      setProducts((prev) =>
        prev.map((p) =>
          p.id === product.id ? { ...p, stock: targetStock, cost: targetCost } : p
        )
      );

      handleDiscardRowEdits(product.id);
      showNotification(`Saved "${product.name}": Stock ${targetStock} units, Cost ₹${targetCost.toLocaleString('en-IN')}`);
    } catch (err) {
      showNotification(err.message || 'Failed to update inventory', 'error');
    } finally {
      setSavingId(null);
    }
  };

  /* Save all modified products at once */
  const handleSaveAll = async () => {
    const modifiedIds = Array.from(
      new Set([...Object.keys(stockEdits), ...Object.keys(costEdits)])
    );

    if (modifiedIds.length === 0) return;

    setSavingAll(true);
    try {
      let savedCount = 0;
      for (const id of modifiedIds) {
        const prod = products.find((p) => p.id === id);
        if (!prod) continue;

        const fin = getProductFinancials(prod, stockEdits[id], costEdits[id]);
        await productService.updateProduct(id, {
          stock: fin.stock,
          cost: fin.costPrice,
        });

        await adminLogService.logAction('BULK_UPDATE_INVENTORY', 'products', id, {
          stock: fin.stock,
          cost: fin.costPrice,
          product_name: prod.name,
        });
        savedCount++;
      }

      setProducts(productService.getLocalProducts());
      setStockEdits({});
      setCostEdits({});
      showNotification(`Successfully updated ${savedCount} saree inventory records.`);
    } catch (err) {
      showNotification(err.message || 'Error updating inventory records', 'error');
    } finally {
      setSavingAll(false);
    }
  };

  /* Export comprehensive financial inventory report to CSV */
  const handleExportCsv = () => {
    const headers = [
      'Product ID',
      'Saree Title',
      'Category',
      'Current Stock Units',
      'Stock Status',
      'Cost Price (INR)',
      'Retail Selling Price (INR)',
      'MRP Original Price (INR)',
      'Unit Discount (INR)',
      'Discount Percent',
      'Unit Profit (INR)',
      'Profit Margin Percent',
      'Total Line Cost (INR)',
      'Total Line Selling Value (INR)',
      'Total Potential Profit (INR)',
    ];

    const rows = products.map((p) => {
      const fin = getProductFinancials(p, stockEdits[p.id], costEdits[p.id]);
      const status = fin.stock <= 0 ? 'Out of Stock' : fin.stock <= 5 ? 'Low Stock' : 'In Stock';
      return [
        `"${p.id || ''}"`,
        `"${(p.name || '').replace(/"/g, '""')}"`,
        `"${p.category || 'Pure Silk'}"`,
        fin.stock,
        `"${status}"`,
        fin.costPrice,
        fin.sellingPrice,
        fin.originalPrice,
        fin.unitDiscount,
        `"${fin.discountPercent}%"`,
        fin.unitProfit,
        `"${fin.marginPercent}%"`,
        fin.lineCost,
        fin.lineSelling,
        fin.lineProfit,
      ];
    });

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `isai_tarang_inventory_financial_report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  /* Inventory Aggregate Financial Calculations */
  const allFinancials = products.map((p) =>
    getProductFinancials(p, stockEdits[p.id], costEdits[p.id])
  );

  const totalUnits = allFinancials.reduce((acc, f) => acc + f.stock, 0);
  const totalCostAmount = allFinancials.reduce((acc, f) => acc + f.lineCost, 0);
  const totalSellingAmount = allFinancials.reduce((acc, f) => acc + f.lineSelling, 0);
  const totalDiscountAmount = allFinancials.reduce((acc, f) => acc + f.lineDiscount, 0);
  const totalPotentialProfit = allFinancials.reduce((acc, f) => acc + f.lineProfit, 0);

  const overallMarginPercent =
    totalSellingAmount > 0
      ? ((totalPotentialProfit / totalSellingAmount) * 100).toFixed(1)
      : '0.0';

  const outOfStockCount = allFinancials.filter((f) => f.stock <= 0).length;
  const lowStockCount = allFinancials.filter((f) => f.stock > 0 && f.stock <= 5).length;
  const inStockCount = allFinancials.filter((f) => f.stock > 5).length;
  const highMarginCount = allFinancials.filter((f) => parseFloat(f.marginPercent) >= 45).length;

  const totalModifiedCount = Array.from(
    new Set([...Object.keys(stockEdits), ...Object.keys(costEdits)])
  ).length;

  /* Filter and Sort Products */
  const filteredProducts = products
    .filter((p) => {
      const fin = getProductFinancials(p, stockEdits[p.id], costEdits[p.id]);
      if (stockFilter === 'out' && fin.stock > 0) return false;
      if (stockFilter === 'low' && (fin.stock <= 0 || fin.stock > 5)) return false;
      if (stockFilter === 'in' && fin.stock <= 5) return false;
      if (stockFilter === 'high_margin' && parseFloat(fin.marginPercent) < 45) return false;

      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const nameMatch = (p.name || '').toLowerCase().includes(q);
        const catMatch = (p.category || '').toLowerCase().includes(q);
        const idMatch = (p.id || '').toLowerCase().includes(q);
        if (!nameMatch && !catMatch && !idMatch) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const finA = getProductFinancials(a, stockEdits[a.id], costEdits[a.id]);
      const finB = getProductFinancials(b, stockEdits[b.id], costEdits[b.id]);

      if (sortBy === 'value_desc') return finB.lineSelling - finA.lineSelling;
      if (sortBy === 'profit_desc') return finB.lineProfit - finA.lineProfit;
      if (sortBy === 'margin_desc') return parseFloat(finB.marginPercent) - parseFloat(finA.marginPercent);
      if (sortBy === 'stock_asc') return finA.stock - finB.stock;
      if (sortBy === 'stock_desc') return finB.stock - finA.stock;
      if (sortBy === 'name_asc') return (a.name || '').localeCompare(b.name || '');
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-[#F3E5AB]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <SectionHeading
          title="Inventory, Cost & Profit Intelligence"
          subtitle="Real-time procurement cost tracking, unit margin calculation, stock replenishment, and inventory valuation"
          align="left"
        />

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#153424] text-[#F3E5AB] border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#0C2317] transition-all text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
            title="Download full inventory financial spreadsheet"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            type="button"
            onClick={fetchProducts}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A3C2B] text-[#F3E5AB] border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#0C2317] transition-all text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Data</span>
          </button>

          <Link
            to="/admin/products/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317] font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Saree</span>
          </Link>
        </div>
      </div>

      {/* Floating Alert Toast Notification */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-xs font-semibold shadow-2xl transition-all ${
            feedback.type === 'error'
              ? 'bg-red-950/90 text-red-200 border-red-500/50'
              : 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50'
          }`}
        >
          {feedback.type === 'error' ? (
            <XCircle className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Unsaved Changes Banner */}
      {totalModifiedCount > 0 && (
        <div className="bg-gradient-to-r from-[#1A3C2B] via-[#0C2317] to-[#1A3C2B] border border-[#D4AF37] p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center text-[#FFD54F] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#F3E5AB]">
                Unsaved modifications detected across {totalModifiedCount} saree(s)
              </p>
              <p className="text-[11px] text-[#D4AF37]/80">
                Stock counts and cost prices have been altered in the workspace.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setStockEdits({});
                setCostEdits({});
                showNotification('All pending edits reverted to saved values.', 'error');
              }}
              className="px-3.5 py-1.5 rounded-xl bg-transparent border border-[#D4AF37]/40 text-[#F3E5AB] text-xs font-bold uppercase tracking-wider hover:bg-white/5 cursor-pointer flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard All</span>
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              disabled={savingAll}
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317] text-xs font-bold uppercase tracking-wider hover:brightness-110 shadow-lg cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingAll ? 'Saving All...' : `Save All (${totalModifiedCount})`}</span>
            </button>
          </div>
        </div>
      )}

      {/* Critical Stock Warning Banner */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <div className="bg-gradient-to-r from-amber-950/80 via-[#261508] to-amber-950/80 border border-amber-500/40 p-4 sm:p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif text-sm font-bold text-amber-200 uppercase tracking-wider">
                Immediate Inventory Attention Required
              </h4>
              <p className="text-xs text-amber-300/80 mt-0.5 font-light">
                {outOfStockCount > 0 && `${outOfStockCount} saree(s) currently out of stock. `}
                {lowStockCount > 0 && `${lowStockCount} saree(s) running critically low with 5 or fewer units.`}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStockFilter('out')}
              className="px-3.5 py-1.5 rounded-lg bg-red-900/60 border border-red-500/40 text-red-200 text-xs font-bold uppercase tracking-wider hover:bg-red-800 transition-colors cursor-pointer"
            >
              Out of Stock ({outOfStockCount})
            </button>
            <button
              type="button"
              onClick={() => setStockFilter('low')}
              className="px-3.5 py-1.5 rounded-lg bg-amber-900/60 border border-amber-500/40 text-amber-200 text-xs font-bold uppercase tracking-wider hover:bg-amber-800 transition-colors cursor-pointer"
            >
              Low Stock ({lowStockCount})
            </button>
          </div>
        </div>
      )}

      {/* 6 Executive Financial & Inventory Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1: Total Units */}
        <div className="bg-gradient-to-b from-[#133323] to-[#0A1F14] border border-[#D4AF37]/35 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#D4AF37]/80 uppercase font-bold tracking-wider">
              Total Stock Units
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#1A3C2B] border border-[#D4AF37]/30 flex items-center justify-center text-[#FFD54F]">
              <Boxes className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-sans text-2xl font-bold text-[#F3E5AB] block">
              {totalUnits.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-[#D4AF37]/70 block mt-0.5">
              Across {products.length} saree catalog designs
            </span>
          </div>
        </div>

        {/* Card 2: Total Cost Amount */}
        <div className="bg-gradient-to-b from-[#133323] to-[#0A1F14] border border-[#D4AF37]/35 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-amber-300 uppercase font-bold tracking-wider">
              Total Cost Amount
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-950/40 border border-amber-500/40 flex items-center justify-center text-amber-300">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-sans text-2xl font-bold text-amber-200 block">
              ₹{totalCostAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-amber-300/70 block mt-0.5">
              Wholesale procurement capital
            </span>
          </div>
        </div>

        {/* Card 3: Total Selling Amount */}
        <div className="bg-gradient-to-b from-[#133323] to-[#0A1F14] border border-[#D4AF37]/35 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#D4AF37]/80 uppercase font-bold tracking-wider">
              Total Selling Amount
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#1A3C2B] border border-[#D4AF37]/30 flex items-center justify-center text-[#FFD54F]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-sans text-2xl font-bold text-[#F3E5AB] block">
              ₹{totalSellingAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-[#D4AF37]/70 block mt-0.5">
              Gross inventory retail value
            </span>
          </div>
        </div>

        {/* Card 4: Total Discount Amount */}
        <div className="bg-gradient-to-b from-[#133323] to-[#0A1F14] border border-[#D4AF37]/35 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-purple-300 uppercase font-bold tracking-wider">
              Total Discount Amount
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-950/40 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-sans text-2xl font-bold text-purple-200 block">
              ₹{totalDiscountAmount.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-purple-300/70 block mt-0.5">
              Total customer promotional savings
            </span>
          </div>
        </div>

        {/* Card 5: Total Potential Profit */}
        <div className="bg-gradient-to-b from-[#0F3822] to-[#082415] border border-emerald-500/50 p-5 rounded-2xl shadow-xl flex flex-col justify-between ring-1 ring-emerald-500/20">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-emerald-300 uppercase font-bold tracking-wider">
              Potential Profit
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 border border-emerald-500/50 flex items-center justify-center text-emerald-300">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="font-sans text-2xl font-bold text-emerald-300 block">
              ₹{totalPotentialProfit.toLocaleString('en-IN')}
            </span>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-300 border border-emerald-500/50">
              +{overallMarginPercent}% Margin
            </span>
          </div>
        </div>

        {/* Card 6: Stock Alerts */}
        <div className="bg-gradient-to-b from-[#133323] to-[#0A1F14] border border-[#D4AF37]/35 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#D4AF37]/80 uppercase font-bold tracking-wider">
              Stock Health Status
            </span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                outOfStockCount > 0
                  ? 'bg-red-950/40 border-red-500/50 text-red-400'
                  : lowStockCount > 0
                  ? 'bg-amber-950/40 border-amber-500/50 text-amber-400 animate-pulse'
                  : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-sans text-xl font-bold text-[#F3E5AB]">
                {inStockCount} Healthy
              </span>
            </div>
            <span className="text-[11px] text-amber-300 block mt-0.5">
              {lowStockCount} Low stock, {outOfStockCount} Out of stock
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs, Search Bar & Sort Dropdown */}
      <div className="bg-[#0C2317] border border-[#D4AF37]/35 p-4 sm:p-5 rounded-2xl shadow-xl flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 flex-wrap w-full lg:w-auto">
          {[
            { id: 'all', label: 'All Items', count: products.length },
            { id: 'in', label: 'In Stock (>5)', count: inStockCount },
            { id: 'low', label: 'Low Stock (≤5)', count: lowStockCount },
            { id: 'out', label: 'Out of Stock (0)', count: outOfStockCount },
            { id: 'high_margin', label: 'High Margin (≥45%)', count: highMarginCount },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setStockFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                stockFilter === tab.id
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317] shadow-lg'
                  : 'bg-[#153424] text-[#EADFC9] border border-[#D4AF37]/30 hover:border-[#D4AF37]'
              }`}
            >
              <span>{tab.label}</span>
              <span className="ml-1.5 opacity-80 text-[10px]">({tab.count})</span>
            </button>
          ))}
        </div>

        {/* Search & Sort Controls */}
        <div className="flex items-center gap-3 w-full lg:w-auto">
          {/* Search */}
          <div className="relative flex-1 lg:w-72">
            <Search className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search saree, SKU or category..."
              className="w-full bg-[#153424] border border-[#D4AF37]/35 rounded-xl pl-9 pr-4 py-2 text-xs text-[#F3E5AB] placeholder-[#D4AF37]/50 focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Sort By Dropdown */}
          <div className="relative shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#153424] border border-[#D4AF37]/35 rounded-xl px-3 py-2 text-xs text-[#F3E5AB] font-bold focus:outline-none focus:border-[#D4AF37] cursor-pointer"
            >
              <option value="value_desc">Sort: Highest Valuation</option>
              <option value="profit_desc">Sort: Highest Profit</option>
              <option value="margin_desc">Sort: Highest Margin %</option>
              <option value="stock_asc">Sort: Lowest Stock First</option>
              <option value="stock_desc">Sort: Highest Stock First</option>
              <option value="name_asc">Sort: Saree Name (A to Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Comprehensive Inventory & Financial Table */}
      <div className="bg-[#0C2317] border border-[#D4AF37]/35 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-[#D4AF37]/25 text-[#D4AF37] uppercase font-bold bg-[#081A11]">
                <th className="py-4 px-4 min-w-[220px]">Saree Product</th>
                <th className="py-4 px-3 min-w-[130px]">Cost Price</th>
                <th className="py-4 px-3 min-w-[120px]">Selling Price</th>
                <th className="py-4 px-3 min-w-[110px]">Discount</th>
                <th className="py-4 px-3 min-w-[120px]">Unit Profit</th>
                <th className="py-4 px-3 min-w-[140px]">Line Valuation</th>
                <th className="py-4 px-3 min-w-[130px]">Stock Status</th>
                <th className="py-4 px-4 min-w-[160px]">Stock Count</th>
                <th className="py-4 px-4 text-right min-w-[100px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/15">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-[#EADFC9]/70 italic">
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
                        isModified ? 'bg-[#1D3E2B]/40' : 'hover:bg-[#153424]/60'
                      }`}
                    >
                      {/* 1. Saree Product Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 aspect-[3/4] rounded-lg overflow-hidden bg-[#081A11] border border-[#D4AF37]/30 shrink-0 shadow">
                            <img
                              src={getProductImage(p)}
                              alt={p.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 max-w-[180px]">
                            <p className="font-bold text-[#F3E5AB] truncate text-xs">
                              {p.name}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-[#1A3C2B] text-[#D4AF37] border border-[#D4AF37]/30">
                                {p.category || 'Pure Silk'}
                              </span>
                              <span className="text-[9px] text-[#D4AF37]/60 font-mono">
                                ID:{p.id?.slice(0, 6)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Cost Price (Inline Editable) */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-1">
                          <div className="flex items-center border border-[#D4AF37]/40 rounded-lg overflow-hidden bg-[#081A11] max-w-[110px]">
                            <span className="px-1.5 text-xs text-[#D4AF37] font-bold bg-[#1A3C2B]/60 select-none">
                              ₹
                            </span>
                            <input
                              type="number"
                              min="0"
                              step="50"
                              value={costEdits[p.id] !== undefined ? costEdits[p.id] : fin.costPrice}
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
                          <span className="font-bold text-[#F3E5AB] text-xs block">
                            ₹{fin.sellingPrice.toLocaleString('en-IN')}
                          </span>
                          {fin.originalPrice > fin.sellingPrice && (
                            <span className="text-[10px] text-[#D4AF37]/50 line-through block">
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
                          <span className="text-[10px] text-[#D4AF37]/60 italic">
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

                      {/* 6. Line Valuation (Total for available stock) */}
                      <td className="py-3.5 px-3">
                        <div className="space-y-0.5">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-[#D4AF37]/70">Retail:</span>
                            <span className="font-bold text-[#F3E5AB]">
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
                            <span className="text-emerald-300/80 font-medium">Profit:</span>
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
                          <div className="flex items-center border border-[#D4AF37]/40 rounded-lg overflow-hidden bg-[#081A11]">
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
                              className="w-12 text-center text-xs font-bold font-mono text-[#F3E5AB] bg-transparent border-x border-[#D4AF37]/40 focus:outline-none"
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
                              className="px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317] font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 shadow-md hover:brightness-110 cursor-pointer disabled:opacity-50"
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
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1A3C2B] text-[#F3E5AB] border border-[#D4AF37]/35 hover:bg-[#D4AF37] hover:text-[#0C2317] transition-all text-[11px] font-bold uppercase tracking-wider cursor-pointer"
                            title="Edit full product details"
                          >
                            <Edit2 className="w-3 h-3" />
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
    </div>
  );
}

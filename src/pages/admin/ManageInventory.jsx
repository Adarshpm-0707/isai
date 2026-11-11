import React from 'react';
import { Link } from 'react-router-dom';
import { useInventoryManager } from '../../hooks/useInventoryManager';
import SectionHeading from '../../components/reusable/SectionHeading';
import InventoryKpis from '../../components/admin/inventory/InventoryKpis';
import InventoryFilterBar from '../../components/admin/inventory/InventoryFilterBar';
import InventoryTable from '../../components/admin/inventory/InventoryTable';
import {
  Download,
  RefreshCw,
  Plus,
  XCircle,
  CheckCircle2,
} from 'lucide-react';

export default function ManageInventory() {
  const {
    products,
    loading,
    search,
    setSearch,
    stockFilter,
    setStockFilter,
    sortBy,
    setSortBy,
    stockEdits,
    costEdits,
    savingId,
    savingAll,
    feedback,
    aggregates,
    filteredProducts,
    handleStockChange,
    handleAdjustDelta,
    handleCostChange,
    handleDiscardRowEdits,
    handleSaveProduct,
    handleSaveAll,
    handleExportCsv,
    fetchProducts,
  } = useInventoryManager();

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-[#F3E5AB]">
      {/* Page Header & Global Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeading
          title="Inventory & Stock Ledger"
          subtitle="Real-time stock monitoring, wholesale cost margin auditing, and rapid variant replenishment"
          align="left"
        />

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={fetchProducts}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#1A3C2B] text-[#F3E5AB] border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#0C2317] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
            title="Refresh inventory from database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>

          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A3C2B] text-[#F3E5AB] border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#0C2317] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-md"
            title="Export complete inventory valuation report to CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
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

      {/* KPI Cards & Warnings */}
      <InventoryKpis
        aggregates={aggregates}
        catalogLength={products.length}
        totalModifiedCount={aggregates.totalModifiedCount}
        onDiscardAll={() => {
          fetchProducts();
        }}
        onSaveAll={handleSaveAll}
        savingAll={savingAll}
        setStockFilter={setStockFilter}
      />

      {/* Filter Tabs, Search Bar & Sort Dropdown */}
      <InventoryFilterBar
        search={search}
        setSearch={setSearch}
        stockFilter={stockFilter}
        setStockFilter={setStockFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        productsCount={products.length}
        aggregates={aggregates}
      />

      {/* Comprehensive Inventory Table */}
      <InventoryTable
        filteredProducts={filteredProducts}
        stockEdits={stockEdits}
        costEdits={costEdits}
        handleCostChange={handleCostChange}
        handleAdjustDelta={handleAdjustDelta}
        handleStockChange={handleStockChange}
        handleSaveProduct={handleSaveProduct}
        handleDiscardRowEdits={handleDiscardRowEdits}
        savingId={savingId}
      />
    </div>
  );
}

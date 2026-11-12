import React from 'react';
import { useManageOrders } from '../../hooks/useManageOrders';
import SectionHeading from '../../components/reusable/SectionHeading';
import OrdersOverviewKpis from '../../components/admin/orders/OrdersOverviewKpis';
import OrdersFilterBar from '../../components/admin/orders/OrdersFilterBar';
import OrdersTable from '../../components/admin/orders/OrdersTable';
import OrderDetailModal from '../../components/admin/orders/OrderDetailModal';
import {
  FileText,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export default function ManageOrders() {
  const {
    orders,
    loading,
    fetchOrders,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    modalOpen,
    selectedOrder,
    newStatus,
    setNewStatus,
    trackingId,
    setTrackingId,
    feedback,
    filteredOrders,
    stats,
    handleDeleteOrder,
    handleOpenModal,
    handleCloseModal,
    handleUpdateStatus,
    handleQuickStatusChange,
    handleExportExcel,
    handleExportPDF,
    handlePrintInvoice,
  } = useManageOrders();

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 text-[#F5E6BE] font-sans">
      {/* Toast Notification */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-sans shadow-lg border transition-all ${
            feedback.type === 'error'
              ? 'bg-red-950/80 border-red-500/50 text-red-200'
              : 'bg-[#0F131C] border-[#D4AF37]/50 text-[#F5E6BE]'
          }`}
        >
          {feedback.type === 'error' ? (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#D4AF37] shrink-0" />
          )}
          <span className="font-semibold">{feedback.msg}</span>
        </div>
      )}

      {/* Page Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeading
          title="Fulfillments Board"
          subtitle="Manage customer purchases, view complete shipping & item details, and update dispatch statuses"
          align="left"
        />

        {/* Export & Refresh Options */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            onClick={fetchOrders}
            disabled={loading}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#161B26] text-[#F5E6BE] border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#090B10] px-3.5 sm:px-4 py-2.5 rounded-xl font-sans text-xs uppercase tracking-wider font-bold shadow-xl transition-all cursor-pointer disabled:opacity-50"
            title="Refresh orders from database and local storage"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37] ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportPDF}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-[#161B26] text-[#F5E6BE] border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#090B10] px-3.5 sm:px-4 py-2.5 rounded-xl font-sans text-xs uppercase tracking-wider font-bold shadow-xl transition-all cursor-pointer"
            title="Download PDF Orders Summary Report"
          >
            <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#090B10] hover:brightness-110 px-4 py-2.5 rounded-xl font-sans text-xs uppercase tracking-wider font-bold shadow-xl transition-all cursor-pointer"
            title="Export Orders to Excel Sheet (.csv)"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel Sheet</span>
          </button>
        </div>
      </div>

      {/* Top Stat Overview Cards */}
      <OrdersOverviewKpis stats={stats} />

      {/* Filter Toolbar: Search Input + Status Filter Tabs */}
      <OrdersFilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        orders={orders}
        filteredCount={filteredOrders.length}
      />

      {/* Main Table */}
      <OrdersTable
        filteredOrders={filteredOrders}
        loading={loading}
        activeTab={activeTab}
        searchQuery={searchQuery}
        handleOpenModal={handleOpenModal}
        handleDeleteOrder={handleDeleteOrder}
        handleQuickStatusChange={handleQuickStatusChange}
        handlePrintInvoice={handlePrintInvoice}
      />

      {/* Redesigned Order Details Modal */}
      <OrderDetailModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        selectedOrder={selectedOrder}
        newStatus={newStatus}
        setNewStatus={setNewStatus}
        trackingId={trackingId}
        setTrackingId={setTrackingId}
        handleUpdateStatus={handleUpdateStatus}
        handleDeleteOrder={handleDeleteOrder}
        handlePrintInvoice={handlePrintInvoice}
      />
    </div>
  );
}

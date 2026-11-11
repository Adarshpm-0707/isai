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
} from 'lucide-react';

export default function ManageOrders() {
  const {
    orders,
    loading,
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
    handleExportExcel,
    handleExportPDF,
    handlePrintInvoice,
  } = useManageOrders();

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-[#F3E5AB]">
      {/* Toast Notification */}
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs font-sans shadow-lg border transition-all ${
            feedback.type === 'error'
              ? 'bg-red-950/80 border-red-500/50 text-red-200'
              : 'bg-[#153424] border-[#D4AF37]/50 text-[#F3E5AB]'
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

        {/* 2 Export Options: PDF & Excel Sheet */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center gap-2 bg-[#1A3C2B] text-[#F3E5AB] border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#0C2317] px-4 py-2.5 rounded-xl font-sans text-xs uppercase tracking-wider font-bold shadow-xl transition-all cursor-pointer"
            title="Download PDF Orders Summary Report"
          >
            <FileText className="w-4 h-4 text-[#D4AF37]" />
            <span>Download PDF</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317] hover:brightness-110 px-4 py-2.5 rounded-xl font-sans text-xs uppercase tracking-wider font-bold shadow-xl transition-all cursor-pointer"
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

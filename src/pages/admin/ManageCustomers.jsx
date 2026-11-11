import React from 'react';
import useManageCustomers from '../../hooks/useManageCustomers';
import SectionHeading from '../../components/reusable/SectionHeading';
import CustomerTable from '../../components/admin/customers/CustomerTable';
import CustomerDetailModal from '../../components/admin/customers/CustomerDetailModal';
import { Search, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ManageCustomers() {
  const {
    loading,
    searchQuery,
    setSearchQuery,
    modalOpen,
    setModalOpen,
    selectedCustomer,
    feedback,
    handleDeleteCustomer,
    handleViewCustomer,
    filteredCustomers,
    getCustomerOrderStats,
  } = useManageCustomers();

  const selectedOrderStats = selectedCustomer
    ? getCustomerOrderStats(selectedCustomer.email, selectedCustomer.id)
    : { count: 0, totalSpent: 0, history: [] };

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-[#F5E6BE] font-sans">
      {/* Floating Notification */}
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

      {/* Page Header */}
      <SectionHeading
        title="Customers Directory"
        subtitle="View customer accounts, purchase history, contact records, and profiles"
        align="left"
      />

      {/* Search Input Box */}
      <div className="bg-[#0F131C] border border-[#D4AF37]/35 p-4 rounded-2xl shadow-xl flex items-center gap-3">
        <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search customers by name, email, or phone number..."
          className="w-full bg-transparent text-sm text-[#FFFFFF] placeholder:text-[#A1A1AA]/60 focus:outline-none font-sans"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs uppercase font-bold text-[#D4AF37] hover:underline cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Customers Table */}
      <CustomerTable
        filteredCustomers={filteredCustomers}
        loading={loading}
        searchQuery={searchQuery}
        getCustomerOrderStats={getCustomerOrderStats}
        onViewCustomer={handleViewCustomer}
        onDeleteCustomer={handleDeleteCustomer}
      />

      {/* View Customer Details Modal */}
      <CustomerDetailModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        customer={selectedCustomer}
        orderStats={selectedOrderStats}
        onDeleteCustomer={handleDeleteCustomer}
      />
    </div>
  );
}

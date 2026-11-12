import React, { useState, useEffect, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import EmptyState from '../components/reusable/EmptyState';
import { orderService } from '../services/orderService';
import { printOrderInvoice } from '../utils/orderReportUtils';
import { FloralOrnament } from '../components/reusable/FloralOrnament';
import OrderHistoryCard from '../components/orders/OrderHistoryCard';
import { Search, RefreshCw, PackageCheck } from 'lucide-react';

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilterQuery, setActiveFilterQuery] = useState('');

  const fetchOrders = useCallback(async (customQuery = null) => {
    setLoading(true);
    try {
      const q = customQuery !== null ? customQuery : activeFilterQuery;
      const data = await orderService.getUserOrders(user?.id || null, user?.email || null, q);
      if (Array.isArray(data)) {
        setOrders(data);
      }
    } catch (err) {
      console.warn('Notice fetching user orders:', err);
    } finally {
      setLoading(false);
    }
  }, [user, activeFilterQuery]);

  useEffect(() => {
    fetchOrders();

    const handleOrdersUpdated = () => {
      fetchOrders();
    };

    const handleStorageChange = (e) => {
      if (!e.key || e.key === 'isai_orders' || e.key === 'isai_deleted_order_ids') {
        fetchOrders();
      }
    };

    window.addEventListener('isai:orders_updated', handleOrdersUpdated);
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('isai:orders_updated', handleOrdersUpdated);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [fetchOrders]);

  const handleSearchSubmit = (e) => {
    if (e?.preventDefault) e.preventDefault();
    setActiveFilterQuery(searchQuery.trim());
    fetchOrders(searchQuery.trim());
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setActiveFilterQuery('');
    fetchOrders('');
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancellingId(orderId);
    try {
      await orderService.cancelOrder(orderId);
      alert('Order cancelled successfully.');
      await fetchOrders();
    } catch (err) {
      alert(err.message || 'Failed to cancel order');
    } finally {
      setCancellingId(null);
    }
  };

  const handleCopyId = (id) => {
    if (!id) return;
    navigator.clipboard?.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePrintInvoice = (order) => {
    printOrderInvoice(order);
  };

  return (
    <div className="min-h-screen bg-[#120B09] text-[#FDF8F4] px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8">
      {/* Title */}
      <div className="text-center space-y-1">
        <p className="text-[10px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-[#DFC18A]">
          Customer Purchase Anthology
        </p>
        <h1
          className="font-serif text-3xl sm:text-4xl text-[#FDF8F4]"
          style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
        >
          My Orders {orders.length > 0 ? `(${orders.length})` : ''}
        </h1>
        <FloralOrnament className="mt-1" />
        <p className="text-xs text-[#C7B5A7] font-light max-w-md mx-auto pt-1">
          Review your handcrafted saree orders, live dispatch status, and download tax invoices.
        </p>
      </div>

      {/* Order Lookup & Search Tracker Bar */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#DFC18A] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Track by Order ID (e.g. ORD-...), Email, or Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full bg-[#1A0E0A] border border-[#3A2219] text-xs text-[#FDF8F4] placeholder-[#8E7B6F] focus:outline-none focus:border-[#DFC18A] transition-all"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 rounded-full bg-[#C86A27] hover:bg-[#DB7B32] text-xs font-bold uppercase tracking-wider text-white transition-all cursor-pointer shadow-md"
          >
            Track Order
          </button>
          {activeFilterQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="px-4 py-2.5 rounded-full bg-[#1A0E0A] border border-[#3A2219] hover:border-[#DFC18A] text-xs text-[#C7B5A7] transition-all cursor-pointer"
            >
              Clear
            </button>
          )}
          <button
            type="button"
            onClick={() => fetchOrders()}
            disabled={loading}
            className="px-3.5 py-2.5 rounded-full bg-[#1A0E0A] border border-[#3A2219] hover:border-[#DFC18A] text-xs text-[#DFC18A] transition-all cursor-pointer disabled:opacity-50"
            title="Refresh Orders"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </form>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto space-y-6">
        {loading && orders.length === 0 ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-4">
            <div className="w-10 h-10 border-2 border-[#DFC18A]/30 border-t-[#DFC18A] rounded-full animate-spin" />
            <p className="font-serif text-sm text-[#DFC18A] tracking-wider">
              Retrieving Order Records...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="min-h-[40vh] flex items-center justify-center p-4">
            <EmptyState
              title={activeFilterQuery ? "No Orders Matching Search" : "No Orders Found"}
              message={
                activeFilterQuery
                  ? `We couldn't locate any orders matching "${activeFilterQuery}". Please double check your Order ID or phone number.`
                  : "You haven't ordered any sarees yet, or your orders were placed under a different email. You can search by Order ID above."
              }
              actionText="Browse Sarees"
              actionPath="/products"
            />
          </div>
        ) : (
          orders.map((order, idx) => (
            <OrderHistoryCard
              key={order.id || order.order_id || idx}
              order={order}
              idx={idx}
              copiedId={copiedId}
              handleCopyId={handleCopyId}
              cancellingId={cancellingId}
              handleCancel={handleCancel}
              handlePrintInvoice={handlePrintInvoice}
            />
          ))
        )}
      </div>
    </div>
  );
}

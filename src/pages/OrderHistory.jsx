import React, { useState, useEffect, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import EmptyState from '../components/reusable/EmptyState';
import { orderService } from '../services/orderService';
import { printOrderInvoice } from '../utils/orderReportUtils';
import { FloralOrnament } from '../components/reusable/FloralOrnament';
import OrderHistoryCard from '../components/orders/OrderHistoryCard';

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const local = orderService.getLocalOrders();
      if (Array.isArray(local) && local.length > 0) {
        const matching = user?.id
          ? local.filter((o) => !o.user_id || o.user_id === user.id)
          : local;
        setOrders(matching);
      }
    } catch {
      // Fallback
    }

    setLoading(true);
    try {
      const data = await orderService.getUserOrders(user?.id || null);
      if (Array.isArray(data) && data.length > 0) {
        setOrders(data);
      }
    } catch (err) {
      console.warn('Notice fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchOrders();

    const handleOrdersUpdated = () => {
      fetchOrders();
    };

    window.addEventListener('isai:orders_updated', handleOrdersUpdated);
    return () => window.removeEventListener('isai:orders_updated', handleOrdersUpdated);
  }, [fetchOrders]);

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

  if (loading && orders.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#120B09] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-2 border-[#DFC18A]/30 border-t-[#DFC18A] rounded-full animate-spin" />
        <p className="font-serif text-sm text-[#DFC18A] tracking-wider">
          Retrieving Your Purchase History...
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#120B09] flex items-center justify-center p-4">
        <EmptyState
          title="No Orders Found"
          message="You haven't ordered any sarees yet. Explore our curated handloom heirlooms."
          actionText="Browse Sarees"
          actionPath="/products"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#120B09] text-[#FDF8F4] px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-8">
      {/* Title */}
      <div className="text-center space-y-1">
        <p className="text-[10px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-[#DFC18A]">
          Purchase Anthology
        </p>
        <h1
          className="font-serif text-3xl sm:text-4xl text-[#FDF8F4]"
          style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
        >
          My Orders ({orders.length})
        </h1>
        <FloralOrnament className="mt-1" />
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {orders.map((order, idx) => (
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
        ))}
      </div>
    </div>
  );
}

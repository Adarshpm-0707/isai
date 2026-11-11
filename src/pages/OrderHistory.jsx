import React, { useState, useEffect, useCallback } from 'react';
import useAuth from '../hooks/useAuth';
import EmptyState from '../components/reusable/EmptyState';
import { orderService } from '../services/orderService';
import { printOrderInvoice } from '../utils/orderReportUtils';
import { FloralOrnament } from '../components/reusable/FloralOrnament';
import OrderHistoryCard from '../components/orders/OrderHistoryCard';

export default function OrderHistory() {
  const { user } = useAuth();

  const getFilteredLocal = useCallback((list) => {
    if (!Array.isArray(list)) return [];
    if (!user) return list;

    const uEmail = user.email ? user.email.toLowerCase().trim() : null;
    const uId = user.id ? String(user.id).toLowerCase().trim() : null;

    return list.filter((o) => {
      const loUserId = o.user_id ? String(o.user_id).toLowerCase().trim() : null;
      const loEmail = (o.customer_email || o.shipping_address?.email || o.profiles?.email || '').toLowerCase().trim();
      const loName = (o.customer_name || o.shipping_address?.name || '').toLowerCase().trim();

      return (
        (!loUserId && !loEmail) || // local device guest order
        (uId && loUserId && uId === loUserId) ||
        (uEmail && loEmail && uEmail === loEmail) ||
        (uEmail && loName && uEmail.split('@')[0] === loName)
      );
    });
  }, [user]);

  const [orders, setOrders] = useState(() => {
    try {
      const local = orderService.getLocalOrders();
      if (!Array.isArray(local) || local.length === 0) return [];
      if (!user) return local;
      const uEmail = user.email ? user.email.toLowerCase().trim() : null;
      const uId = user.id ? String(user.id).toLowerCase().trim() : null;
      return local.filter((o) => {
        const loUserId = o.user_id ? String(o.user_id).toLowerCase().trim() : null;
        const loEmail = (o.customer_email || o.shipping_address?.email || o.profiles?.email || '').toLowerCase().trim();
        const loName = (o.customer_name || o.shipping_address?.name || '').toLowerCase().trim();
        return (
          (!loUserId && !loEmail) ||
          (uId && loUserId && uId === loUserId) ||
          (uEmail && loEmail && uEmail === loEmail) ||
          (uEmail && loName && uEmail.split('@')[0] === loName)
        );
      });
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fetchOrders = useCallback(async () => {
    try {
      const local = orderService.getLocalOrders();
      if (Array.isArray(local)) {
        const matching = getFilteredLocal(local);
        setOrders(matching);
      }
    } catch {
      // Fallback
    }

    try {
      const data = await orderService.getUserOrders(user?.id || null, user?.email || null);
      if (Array.isArray(data)) {
        const filtered = getFilteredLocal(data);
        if (filtered.length > 0) {
          setOrders(filtered);
        }
      }
    } catch (err) {
      console.warn('Notice fetching orders:', err);
    }
  }, [user, getFilteredLocal]);

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

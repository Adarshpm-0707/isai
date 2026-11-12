import { useState, useEffect, useMemo, useCallback } from 'react';
import { orderService } from '../services/orderService';
import { adminLogService } from '../services/adminLogService';
import {
  exportOrdersToCSV,
  printOrdersPdfReport,
  printOrderInvoice,
} from '../utils/orderReportUtils';

export function useManageOrders() {
  const [orders, setOrders] = useState(() => orderService.getLocalOrders());
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('pending');
  const [trackingId, setTrackingId] = useState('');
  const [feedback, setFeedback] = useState(null);

  const showNotification = useCallback((msg, type = 'success') => {
    setFeedback({ msg, type });
    setTimeout(() => setFeedback(null), 4000);
  }, []);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await orderService.getAllOrders({ status: 'all', limit: 200 });
      if (res?.orders) {
        setOrders(res.orders);
      }
    } catch (err) {
      console.warn('Notice loading orders:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();

    const handleOrdersUpdated = (e) => {
      if (Array.isArray(e.detail) && e.detail.length > 0) {
        setOrders(e.detail);
      } else {
        fetchOrders();
      }
    };

    const handleStorageChange = (e) => {
      if (!e.key || e.key === 'isai_orders') {
        fetchOrders();
      }
    };

    window.addEventListener('isai:orders_updated', handleOrdersUpdated);
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', fetchOrders);
    return () => {
      window.removeEventListener('isai:orders_updated', handleOrdersUpdated);
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', fetchOrders);
    };
  }, [fetchOrders]);

  const handleDeleteOrder = async (orderOrId) => {
    if (!orderOrId) return;
    const order = typeof orderOrId === 'object'
      ? orderOrId
      : (orders.find((o) => o.id === orderOrId || o.order_id === orderOrId) || { id: orderOrId });
    const orderId = order.id || order.order_id || orderOrId;
    const displayId = order.order_id || String(orderId).slice(0, 10);
    if (!window.confirm(`Are you sure you want to permanently delete order #${displayId}?`)) {
      return;
    }

    try {
      await orderService.deleteOrder(order);
      adminLogService.logAction('DELETE_ORDER', 'orders', orderId, {}).catch(() => {});
      setOrders((prev) =>
        prev.filter(
          (o) =>
            o.id !== order.id &&
            o.order_id !== order.order_id &&
            o.id !== orderId &&
            o.order_id !== orderId
        )
      );
      if (
        selectedOrder &&
        (selectedOrder.id === order.id ||
          selectedOrder.order_id === order.order_id ||
          selectedOrder.id === orderId ||
          selectedOrder.order_id === orderId)
      ) {
        setModalOpen(false);
        setSelectedOrder(null);
      }
      showNotification(`Order #${displayId} deleted successfully`);
    } catch (err) {
      console.error('Delete order error:', err);
      showNotification(err.message || 'Failed to delete order', 'error');
    }
  };

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status || 'pending');
    setTrackingId(order.shiprocket_order_id || '');
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const handleQuickStatusChange = async (order, updatedStatus) => {
    if (!order || !updatedStatus) return;
    const orderId = order.id || order.order_id || order.orderId;
    const displayId = order.order_id || String(orderId).slice(0, 10);
    const targetKey = String(orderId).toLowerCase().trim();

    try {
      const local = orderService.getLocalOrders();
      const updated = local.map((o) => {
        const idMatch = o.id && String(o.id).toLowerCase().trim() === targetKey;
        const orderIdMatch = (o.order_id && String(o.order_id).toLowerCase().trim() === targetKey) ||
                             (o.orderId && String(o.orderId).toLowerCase().trim() === targetKey);
        return idMatch || orderIdMatch
          ? { ...o, status: updatedStatus, updated_at: new Date().toISOString() }
          : o;
      });
      orderService.saveLocalOrders(updated);
      setOrders(updated);

      await orderService.updateOrderStatus(orderId, updatedStatus);
      adminLogService.logAction('UPDATE_ORDER_STATUS', 'orders', orderId, {
        status: updatedStatus,
      }).catch(() => {});
      showNotification(`Order #${displayId} updated to ${updatedStatus.toUpperCase()}`);
    } catch (err) {
      console.warn('Quick status update notice:', err);
    }
  };

  const handleUpdateStatus = async (e) => {
    if (e) e.preventDefault();
    if (!selectedOrder) return;
    const orderId = selectedOrder.id || selectedOrder.order_id || selectedOrder.orderId;
    const displayId = selectedOrder.order_id || String(orderId).slice(0, 10);
    const targetKey = String(orderId).toLowerCase().trim();

    try {
      try {
        const local = orderService.getLocalOrders();
        const updated = local.map((o) => {
          const idMatch = o.id && String(o.id).toLowerCase().trim() === targetKey;
          const orderIdMatch = (o.order_id && String(o.order_id).toLowerCase().trim() === targetKey) ||
                               (o.orderId && String(o.orderId).toLowerCase().trim() === targetKey);
          return idMatch || orderIdMatch
            ? { ...o, status: newStatus, shiprocket_order_id: trackingId, updated_at: new Date().toISOString() }
            : o;
        });
        orderService.saveLocalOrders(updated);
        setOrders(updated);
      } catch {
        // Fallback silently
      }

      try {
        await orderService.updateOrderStatus(orderId, newStatus, trackingId);
        await adminLogService.logAction('UPDATE_ORDER_STATUS', 'orders', orderId, {
          status: newStatus,
          tracking_id: trackingId,
        });
      } catch (cloudErr) {
        console.warn('Cloud status update notice (updated locally):', cloudErr.message);
      }

      setModalOpen(false);
      showNotification(`Order #${displayId} status updated to ${newStatus.toUpperCase()}`);
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (activeTab !== 'all') {
        const orderStatus = (o.status || 'pending').toLowerCase();
        if (orderStatus !== activeTab.toLowerCase()) return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const idMatch = (o.id || o.order_id || '').toLowerCase().includes(q);
        const custName = (o.customer_name || o.shipping_address?.name || o.profiles?.name || '').toLowerCase();
        const custEmail = (o.customer_email || o.shipping_address?.email || o.profiles?.email || '').toLowerCase();
        const custPhone = (o.customer_phone || o.shipping_address?.phone || o.profiles?.phone || '').toLowerCase();

        const nameMatch = custName.includes(q);
        const emailMatch = custEmail.includes(q);
        const phoneMatch = custPhone.includes(q);

        if (!idMatch && !nameMatch && !emailMatch && !phoneMatch) return false;
      }

      return true;
    });
  }, [orders, activeTab, searchQuery]);

  const stats = useMemo(() => {
    const totalOrdersCount = orders.length;
    const pendingCount = orders.filter((o) => (o.status || 'pending') === 'pending').length;
    const fulfilledCount = orders.filter(
      (o) => o.status === 'shipped' || o.status === 'delivered' || o.status === 'paid'
    ).length;
    const totalRevenueSum = orders.reduce(
      (acc, curr) => acc + (parseFloat(curr.total || curr.total_amount) || 0),
      0
    );

    return { totalOrdersCount, pendingCount, fulfilledCount, totalRevenueSum };
  }, [orders]);

  const handleExportExcel = () => exportOrdersToCSV(filteredOrders, activeTab);
  const handleExportPDF = () => printOrdersPdfReport(filteredOrders, activeTab);
  const handlePrintInvoice = (order) => printOrderInvoice(order);

  return {
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
  };
}


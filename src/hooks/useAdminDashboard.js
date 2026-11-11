import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { customerService } from '../services/customerService';
import {
  calculateDashboardStats,
  calculateRevenueChartData,
  calculateDonutChartData,
} from '../utils/dashboardHelpers';

export function useAdminDashboard() {
  const [stats, setStats] = useState(() => {
    const localOrders = orderService.getLocalOrders();
    const localProds = productService.getLocalProducts();
    let localUsers = [];
    try {
      localUsers = JSON.parse(localStorage.getItem('isai_registered_users') || '[]');
    } catch {
      localUsers = [];
    }
    return calculateDashboardStats(localOrders, localProds, localUsers);
  });

  const [loading, setLoading] = useState(false);
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const fastTimeout = (promise, ms = 1200) => {
        let t;
        const timer = new Promise((_, reject) => {
          t = setTimeout(() => reject(new Error('timeout')), ms);
        });
        return Promise.race([promise, timer]).finally(() => clearTimeout(t));
      };

      const [ordersResult, prodsResult, profilesResult] = await Promise.allSettled([
        fastTimeout(
          supabase.from('orders').select('*').order('created_at', { ascending: false })
        ),
        fastTimeout(supabase.from('products').select('*')),
        fastTimeout(
          supabase.from('profiles').select('*').order('created_at', { ascending: false })
        ),
      ]);

      const dbOrders =
        ordersResult.status === 'fulfilled' && ordersResult.value?.data
          ? ordersResult.value.data
          : [];
      const dbProducts =
        prodsResult.status === 'fulfilled' && prodsResult.value?.data
          ? prodsResult.value.data
          : [];
      const dbProfiles =
        profilesResult.status === 'fulfilled' && profilesResult.value?.data
          ? profilesResult.value.data
          : [];

      const localOrders = orderService.getLocalOrders();
      const localProds = productService.getLocalProducts();
      let localUsers = [];
      try {
        localUsers = JSON.parse(localStorage.getItem('isai_registered_users') || '[]');
      } catch {
        localUsers = [];
      }

      const orderMap = new Map();
      localOrders.forEach((o) => orderMap.set(o.id || o.order_id, o));
      dbOrders.forEach((o) => orderMap.set(o.id || o.order_id, o));
      const combinedOrders = Array.from(orderMap.values());

      const prodMap = new Map();
      localProds.forEach((p) => prodMap.set(p.id, p));
      dbProducts.forEach((p) => prodMap.set(p.id, p));
      const combinedProducts = Array.from(prodMap.values());

      const userMap = new Map();
      localUsers.forEach((u) => userMap.set(u.email?.toLowerCase() || u.id, u));
      dbProfiles.forEach((u) => userMap.set(u.email?.toLowerCase() || u.id, u));
      const combinedUsers = Array.from(userMap.values());

      setStats(calculateDashboardStats(combinedOrders, combinedProducts, combinedUsers));
    } catch (err) {
      console.warn('Dashboard sync note:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();

    const handleDataUpdate = () => {
      const localOrders = orderService.getLocalOrders();
      const localProds = productService.getLocalProducts();
      let localUsers = [];
      try {
        localUsers = JSON.parse(localStorage.getItem('isai_registered_users') || '[]');
      } catch {
        localUsers = [];
      }
      setStats(calculateDashboardStats(localOrders, localProds, localUsers));
    };

    window.addEventListener('isai:orders_updated', handleDataUpdate);
    window.addEventListener('isai:products_updated', handleDataUpdate);
    window.addEventListener('isai:customers_updated', handleDataUpdate);

    return () => {
      window.removeEventListener('isai:orders_updated', handleDataUpdate);
      window.removeEventListener('isai:products_updated', handleDataUpdate);
      window.removeEventListener('isai:customers_updated', handleDataUpdate);
    };
  }, [fetchStats]);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      fetchStats();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const handleDeleteOrder = async (order) => {
    const orderNum = order.order_id || order.id || 'this order';
    if (!window.confirm(`Are you sure you want to permanently delete order #${orderNum}?`)) {
      return;
    }
    try {
      await orderService.deleteOrder(order);
      setStats((prev) => ({
        ...prev,
        recentOrders: prev.recentOrders.filter(
          (o) => o.id !== order.id && o.order_id !== order.order_id
        ),
      }));
      fetchStats();
    } catch (err) {
      console.error('Failed to delete order:', err);
      alert(err.message || 'Failed to delete order');
    }
  };

  const handleDeleteCustomer = async (customer) => {
    const customerIdentifier = customer.name || customer.email || 'this customer';
    if (!window.confirm(`Are you sure you want to delete customer account "${customerIdentifier}"?`)) {
      return;
    }
    try {
      await customerService.deleteCustomer(customer);
      setStats((prev) => ({
        ...prev,
        customers: prev.customers.filter(
          (c) =>
            (!customer.id || c.id !== customer.id) &&
            (!customer.email || c.email?.toLowerCase() !== customer.email?.toLowerCase())
        ),
      }));
      fetchStats();
    } catch (err) {
      console.error('Failed to delete customer:', err);
      alert(err.message || 'Failed to delete customer record');
    }
  };

  const filteredRecentOrders = useMemo(() => {
    return stats.recentOrders.filter((ord) => {
      const matchesStatus =
        orderStatusFilter === 'ALL' ||
        (ord.status || 'pending').toLowerCase() === orderStatusFilter.toLowerCase();

      const custName = (
        ord.shipping_address?.name ||
        ord.customer_name ||
        ord.profiles?.name ||
        ''
      ).toLowerCase();
      const orderId = String(ord.order_id || ord.id || '').toLowerCase();
      const firstItem = ord.items?.[0]?.name?.toLowerCase() || '';

      const query = orderSearchQuery.toLowerCase();
      const matchesSearch =
        !query ||
        custName.includes(query) ||
        orderId.includes(query) ||
        firstItem.includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [stats.recentOrders, orderStatusFilter, orderSearchQuery]);

  const revenueChartData = useMemo(() => {
    return calculateRevenueChartData(stats.allOrders || []);
  }, [stats.allOrders]);

  const donutChartData = useMemo(() => {
    return calculateDonutChartData(stats.allOrders || []);
  }, [stats.allOrders]);

  return {
    stats,
    loading,
    orderSearchQuery,
    setOrderSearchQuery,
    orderStatusFilter,
    setOrderStatusFilter,
    fetchStats,
    handleUpdateOrderStatus,
    handleDeleteOrder,
    handleDeleteCustomer,
    filteredRecentOrders,
    revenueChartData,
    donutChartData,
  };
}


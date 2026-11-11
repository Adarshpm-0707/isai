import { useState, useEffect, useMemo, useCallback } from 'react';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import {
  filterOrdersByRange,
  calculateProfitLossMetrics,
  exportProfitLossCSV,
} from '../utils/profitLossHelpers';

export default function useProfitLoss() {
  const [orders, setOrders] = useState(() => orderService.getLocalOrders());
  const [products, setProducts] = useState(() => productService.getLocalProducts());
  const [timeRange, setTimeRange] = useState('all'); // 'all' | 'month' | 'week'

  const fetchData = useCallback(async () => {
    try {
      // 1. Fetch Orders
      const orderRes = await orderService.getAllOrders({ limit: 1000 });
      if (orderRes?.orders) {
        setOrders(orderRes.orders);
      }

      // 2. Fetch Products
      const prods = productService.getLocalProducts();
      setProducts(prods);
    } catch (err) {
      console.warn('Notice loading financial data:', err);
    }
  }, []);

  useEffect(() => {
    fetchData();

    const handleUpdate = () => {
      fetchData();
    };

    window.addEventListener('isai:orders_updated', handleUpdate);
    return () => window.removeEventListener('isai:orders_updated', handleUpdate);
  }, [fetchData]);

  // Filter orders by time range
  const filteredOrders = useMemo(
    () => filterOrdersByRange(orders, timeRange),
    [orders, timeRange]
  );

  // Financial calculations
  const metrics = useMemo(
    () => calculateProfitLossMetrics(filteredOrders),
    [filteredOrders]
  );

  // Export Financial CSV
  const handleExportReport = useCallback(() => {
    exportProfitLossCSV({ timeRange, metrics });
  }, [timeRange, metrics]);

  return {
    orders,
    products,
    timeRange,
    setTimeRange,
    filteredOrders,
    metrics,
    handleExportReport,
  };
}


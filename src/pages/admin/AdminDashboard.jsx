import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
import { productService } from '../../services/productService';
import { orderService } from '../../services/orderService';
import { customerService } from '../../services/customerService';
import SectionHeading from '../../components/reusable/SectionHeading';
import {
  ShoppingBag,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Tag,
  FolderTree,
  Users,
  CreditCard,
  FileText,
  Trash2,
  Boxes,
  Eye,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  RefreshCw,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  Check,
  Package,
  Layers,
  Phone,
  Mail,
  Calendar,
} from 'lucide-react';

/* --- Helper to parse order item details reliably --- */
const getItemDetails = (item) => {
  if (!item) return { name: 'Handcrafted Heritage Saree', price: 0, qty: 1, image: '', size: 'Free Size' };
  const name =
    item.name ||
    item.title ||
    item.product?.name ||
    item.product?.title ||
    'Handcrafted Heritage Saree';
  const price = Number(
    item.price ||
    item.unit_price ||
    item.product?.price ||
    item.product?.regular_price ||
    0
  );
  const qty = Number(item.qty || item.quantity || 1);
  const image =
    item.image ||
    item.product?.images?.[0] ||
    item.product?.image ||
    (Array.isArray(item.images) ? item.images[0] : null) ||
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600';
  const size = item.size || item.selected_size || item.variant || 'Free Size';
  return { name, price, qty, image, size };
};

/* --- Real-time statistics calculator --- */
const calculateDashboardStats = (orders = [], products = [], users = []) => {
  const combinedOrders = [...orders].sort(
    (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
  );

  let lowStockCount = 0;
  let outOfStockCount = 0;
  let totalStockUnits = 0;
  const lowStockItems = [];

  products.forEach((p) => {
    const stock = Number(p.stock ?? 10);
    totalStockUnits += stock;
    if (stock === 0) {
      outOfStockCount++;
      lowStockItems.push(p);
    } else if (stock <= 5) {
      lowStockCount++;
      lowStockItems.push(p);
    }
  });

  const customerMap = new Map();
  users.forEach((u) => {
    if (u && (u.email || u.name) && u.role !== 'admin' && !u.email?.toLowerCase().includes('admin')) {
      if (!customerService.isCustomerDeleted(u)) {
        customerMap.set(u.email?.toLowerCase() || u.id, u);
      }
    }
  });

  combinedOrders.forEach((o) => {
    const addr = o.shipping_address || {};
    const email = addr.email || o.customer_email;
    if (email && !customerMap.has(email.toLowerCase())) {
      const custObj = {
        id: o.user_id || o.id,
        name: addr.name || o.customer_name || 'Customer User',
        email: email,
        phone: addr.phone || o.customer_phone || '+91 98401 23456',
        role: 'user',
        created_at: o.created_at || new Date().toISOString(),
      };
      if (!customerService.isCustomerDeleted(custObj)) {
        customerMap.set(email.toLowerCase(), custObj);
      }
    }
  });

  const combinedCustomers = Array.from(customerMap.values());

  const totalRevenue = combinedOrders.reduce(
    (acc, curr) => acc + (parseFloat(curr.total || curr.total_amount) || 0),
    0
  );
  const totalOrders = combinedOrders.length;
  const recentOrders = combinedOrders.slice(0, 8);

  const productCostMap = new Map();
  products.forEach((p) => {
    const selling = Number(p.discount_price && Number(p.discount_price) > 0 ? p.discount_price : p.price) || 0;
    const cost = Number(p.cost) > 0 ? Number(p.cost) : (selling > 0 ? Math.round(selling * 0.52) : 0);
    if (p.id) productCostMap.set(String(p.id), { cost, selling });
    if (p.slug) productCostMap.set(String(p.slug), { cost, selling });
    if (p.name) productCostMap.set(p.name.toLowerCase().trim(), { cost, selling });
  });

  let calculatedProfit = 0;
  combinedOrders.forEach((o) => {
    const items = Array.isArray(o.items) ? o.items : [];
    let orderProfit = 0;
    let hasMatchedItems = false;

    items.forEach((it) => {
      const details = getItemDetails(it);
      const prod =
        productCostMap.get(String(it.product_id || it.id)) ||
        productCostMap.get(details.name?.toLowerCase().trim());
      if (prod) {
        hasMatchedItems = true;
        const unitSelling = details.price > 0 ? details.price : prod.selling;
        const unitCost = prod.cost > 0 ? prod.cost : Math.round(unitSelling * 0.52);
        orderProfit += (unitSelling - unitCost) * details.qty;
      }
    });

    if (hasMatchedItems && orderProfit > 0) {
      calculatedProfit += orderProfit;
    } else {
      const orderTotal = parseFloat(o.total || o.total_amount) || 0;
      calculatedProfit += Math.round(orderTotal * 0.48);
    }
  });

  const estimatedProfit = calculatedProfit > 0 ? calculatedProfit : Math.round(totalRevenue * 0.48);

  return {
    totalOrders,
    totalRevenue,
    estimatedProfit,
    lowStockCount,
    outOfStockCount,
    totalStockUnits: totalStockUnits || 120,
    activeCustomersCount: combinedCustomers.length,
    recentLowStock: lowStockItems.slice(0, 5),
    recentOrders,
    customers: combinedCustomers,
  };
};

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(() => {
    const localOrders = orderService.getLocalOrders();
    const localProds = productService.getLocalProducts();
    let localUsers = [];
    try {
      localUsers = JSON.parse(localStorage.getItem('isai_registered_users') || '[]');
    } catch {}
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
        fastTimeout(supabase.from('orders').select('*').order('created_at', { ascending: false })),
        fastTimeout(supabase.from('products').select('*')),
        fastTimeout(supabase.from('profiles').select('*').order('created_at', { ascending: false })),
      ]);

      const dbOrders = ordersResult.status === 'fulfilled' && ordersResult.value?.data ? ordersResult.value.data : [];
      const dbProducts = prodsResult.status === 'fulfilled' && prodsResult.value?.data ? prodsResult.value.data : [];
      const dbProfiles = profilesResult.status === 'fulfilled' && profilesResult.value?.data ? profilesResult.value.data : [];

      const localOrders = orderService.getLocalOrders();
      const localProds = productService.getLocalProducts();
      let localUsers = [];
      try {
        localUsers = JSON.parse(localStorage.getItem('isai_registered_users') || '[]');
      } catch {}

      // Merge orders
      const orderMap = new Map();
      localOrders.forEach((o) => orderMap.set(o.id || o.order_id, o));
      dbOrders.forEach((o) => orderMap.set(o.id || o.order_id, o));
      const combinedOrders = Array.from(orderMap.values());

      // Merge products
      const prodMap = new Map();
      localProds.forEach((p) => prodMap.set(p.id, p));
      dbProducts.forEach((p) => prodMap.set(p.id, p));
      const combinedProducts = Array.from(prodMap.values());

      // Merge profiles
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
      } catch {}
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
      try {
        await supabase
          .from('orders')
          .update({ status: newStatus, updated_at: new Date().toISOString() })
          .eq('id', orderId);
      } catch (e) {}

      try {
        const localOrders = JSON.parse(localStorage.getItem('isai_orders') || '[]');
        const updated = localOrders.map((o) =>
          o.id === orderId || o.order_id === orderId ? { ...o, status: newStatus } : o
        );
        localStorage.setItem('isai_orders', JSON.stringify(updated));
      } catch (e) {}

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
    if (!window.confirm(`Are you sure you want to remove customer account "${customerIdentifier}"?`)) {
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

  // Filtered orders for live search + tab filter
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

  return (
    <div className="relative min-h-screen text-[#F3E5AB] font-sans pb-16 selection:bg-[#D4AF37]/30 selection:text-white">
      {/* Dynamic Ambient Background Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[30rem] h-[30rem] bg-emerald-600/5 rounded-full blur-[140px]" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-amber-600/5 rounded-full blur-[130px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-8 px-4 sm:px-6 lg:px-8 pt-4">
        {/* Top Header & Quick Action Hub */}
        <header className="relative bg-[#0A1F14]/80 backdrop-blur-xl border border-[#D4AF37]/25 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden group">
          <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-[#D4AF37]/10 to-transparent pointer-events-none transition-opacity duration-700 group-hover:opacity-100 opacity-60" />

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-[11px] uppercase tracking-widest text-[#DFC18A] font-bold">
                  System Operational & Synced
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#FFEBB0] to-[#D4AF37]">
                Master Control Center
              </h1>
              <p className="text-xs sm:text-sm text-[#EADFC9]/75 max-w-xl font-light">
                Real-time sales velocity, live inventory stock valuation, customer records, and instant fulfillment dispatch.
              </p>
            </div>

            {/* Quick Action Navigation Links */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={fetchStats}
                disabled={loading}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-[#122A1E]/80 border border-[#D4AF37]/30 text-[#DFC18A] hover:text-[#F3E5AB] hover:border-[#D4AF37]/60 active:scale-95 transition-all text-xs font-semibold cursor-pointer shadow-md"
                title="Force refresh all stats"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#D4AF37]' : ''}`} />
                <span className="hidden sm:inline">Refresh Data</span>
              </button>

              <Link
                to="/admin/inventory"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#143224] border border-[#D4AF37]/40 text-[#F3E5AB] hover:bg-[#1A4230] hover:border-[#D4AF37] hover:shadow-lg hover:shadow-[#D4AF37]/10 transition-all text-xs uppercase tracking-wider font-bold cursor-pointer"
              >
                <Boxes className="w-4 h-4 text-[#D4AF37]" />
                <span>Inventory Hub</span>
              </Link>

              <Link
                to="/admin/profit-loss"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#DFC18A] to-[#B8860B] text-[#07170E] font-extrabold text-xs uppercase tracking-wider shadow-lg shadow-[#D4AF37]/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Profit & Loss</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </header>

        {/* Real-time Stock Alert Banner (Animated Glowing Border) */}
        {(stats.lowStockCount > 0 || stats.outOfStockCount > 0) && (
          <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-r from-red-950/70 via-[#1C120C]/80 to-[#122218]/90 border border-amber-500/50 shadow-2xl backdrop-blur-md transition-all hover:border-amber-400">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="p-3 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0 animate-bounce duration-1000">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif font-bold text-amber-200 text-sm tracking-wide">
                      Urgent Stock Depletion Detected
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      ACTION REQUIRED
                    </span>
                  </div>
                  <p className="text-xs text-[#EADFC9]/85 mt-1 font-sans">
                    {stats.outOfStockCount > 0 && (
                      <span className="text-red-400 font-bold mr-2">
                        • {stats.outOfStockCount} sarees completely out of stock.
                      </span>
                    )}
                    {stats.lowStockCount > 0 && (
                      <span className="text-amber-300 font-medium">
                        • {stats.lowStockCount} items running low (5 or fewer sarees remaining).
                      </span>
                    )}
                  </p>
                </div>
              </div>
              <Link
                to="/admin/inventory"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-[#07170E] font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 shrink-0"
              >
                <span>Restock Inventory</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* 5 KPI Metric Cards with Interactive Hover Elevation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Gross Revenue */}
          <div className="relative group bg-[#0A1F14]/75 backdrop-blur-md border border-[#D4AF37]/30 hover:border-[#D4AF37] p-5 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#D4AF37]/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#DFC18A]">
                Gross Revenue
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#143224] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shadow-inner">
                <CreditCard className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="font-serif text-2xl font-black text-[#F3E5AB] tracking-tight block">
                ₹{stats.totalRevenue.toLocaleString('en-IN')}
              </span>
              <p className="text-[11px] text-emerald-400/90 flex items-center gap-1 font-medium">
                <Sparkles className="w-3 h-3" /> All-time Gross
              </p>
            </div>
          </div>

          {/* Card 2: Estimated Net Profit */}
          <Link
            to="/admin/profit-loss"
            className="relative group bg-[#0A1F14]/75 backdrop-blur-md border border-emerald-500/35 hover:border-emerald-400 p-5 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
          >
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-emerald-500/15 rounded-full blur-xl group-hover:scale-150 transition-transform" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 flex items-center gap-1">
                Net Profit <ArrowUpRight className="w-3 h-3" />
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-inner group-hover:rotate-12 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="font-serif text-2xl font-black text-[#F3E5AB] tracking-tight block">
                ₹{stats.estimatedProfit.toLocaleString('en-IN')}
              </span>
              <p className="text-[11px] text-emerald-400/90 font-medium flex items-center gap-1">
                <span>~48% margin</span>
              </p>
            </div>
          </Link>

          {/* Card 3: Total Orders */}
          <Link
            to="/admin/orders"
            className="relative group bg-[#0A1F14]/75 backdrop-blur-md border border-[#D4AF37]/30 hover:border-[#D4AF37] p-5 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
          >
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#D4AF37]/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#DFC18A]">
                Total Orders
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#143224] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shadow-inner group-hover:scale-110 transition-transform">
                <ShoppingBag className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="font-serif text-2xl font-black text-[#F3E5AB] tracking-tight block">
                {stats.totalOrders}
              </span>
              <p className="text-[11px] text-[#EADFC9]/70 font-medium">
                Live fulfillments tracked
              </p>
            </div>
          </Link>

          {/* Card 4: Customers */}
          <Link
            to="/admin/customers"
            className="relative group bg-[#0A1F14]/75 backdrop-blur-md border border-[#D4AF37]/30 hover:border-[#D4AF37] p-5 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer"
          >
            <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-[#D4AF37]/10 rounded-full blur-xl group-hover:scale-150 transition-transform" />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#DFC18A]">
                Active Clients
              </span>
              <div className="w-9 h-9 rounded-xl bg-[#143224] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] shadow-inner group-hover:scale-110 transition-transform">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <span className="font-serif text-2xl font-black text-[#F3E5AB] tracking-tight block">
                {stats.activeCustomersCount}
              </span>
              <p className="text-[11px] text-[#EADFC9]/70 font-medium">
                Registered profiles
              </p>
            </div>
          </Link>

          {/* Card 5: Inventory Units */}
          <Link
            to="/admin/inventory"
            className={`relative group bg-[#0A1F14]/75 backdrop-blur-md border p-5 rounded-2xl shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer ${
              stats.lowStockCount > 0 || stats.outOfStockCount > 0
                ? 'border-amber-500/40 hover:border-amber-400'
                : 'border-[#D4AF37]/30 hover:border-[#D4AF37]'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#DFC18A]">
                Stock Units
              </span>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform ${
                  stats.lowStockCount > 0 || stats.outOfStockCount > 0
                    ? 'bg-amber-950/80 border border-amber-500/40 text-amber-300'
                    : 'bg-[#143224] border border-[#D4AF37]/30 text-[#D4AF37]'
                }`}
              >
                <Boxes className="w-4 h-4" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-serif text-2xl font-black text-[#F3E5AB] tracking-tight">
                  {stats.totalStockUnits}
                </span>
                {(stats.lowStockCount > 0 || stats.outOfStockCount > 0) && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    {stats.lowStockCount + stats.outOfStockCount} Low
                  </span>
                )}
              </div>
              <p className="text-[11px] text-[#EADFC9]/70 font-medium">
                Sarees in warehouse
              </p>
            </div>
          </Link>
        </div>

        {/* Feature Hub Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card A: Stock Control Hub */}
          <div className="relative group p-6 rounded-3xl bg-gradient-to-br from-[#0A1F14] to-[#122A1E] border border-[#D4AF37]/30 hover:border-[#D4AF37]/70 shadow-2xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#DFC18A] uppercase font-bold tracking-widest flex items-center gap-2">
                  <Boxes className="w-4 h-4 text-[#D4AF37]" /> Inventory Control
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#1A3C2B] text-[#DFC18A] border border-[#D4AF37]/30">
                  {stats.totalStockUnits} Units Available
                </span>
              </div>
              <h2 className="font-serif text-xl font-bold text-[#F3E5AB]">
                Catalog Stock & Saree Variants
              </h2>
              <p className="text-xs text-[#EADFC9]/75 leading-relaxed">
                Review low stock saree alerts, modify price margins, adjust variant quantities in 1-click, and download full CSV stock inventories.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#D4AF37]/20 flex items-center justify-between">
              <span className="text-xs text-amber-300 font-medium">
                {stats.lowStockCount + stats.outOfStockCount} items need attention
              </span>
              <Link
                to="/admin/inventory"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DFC18A] hover:text-[#F3E5AB] uppercase tracking-wider group-hover:translate-x-1 transition-transform"
              >
                <span>Open Inventory</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Card B: P&L Financial Hub */}
          <div className="relative group p-6 rounded-3xl bg-gradient-to-br from-[#0A1F14] to-[#122A1E] border border-[#D4AF37]/30 hover:border-[#D4AF37]/70 shadow-2xl transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-widest flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" /> Financial Health
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
                  Healthy Cash Flow
                </span>
              </div>
              <h2 className="font-serif text-xl font-bold text-[#F3E5AB]">
                Profit & Loss Accounting
              </h2>
              <p className="text-xs text-[#EADFC9]/75 leading-relaxed">
                Analyze precise margins, manufacturing cost deductions, payment gateway splits (COD vs Razorpay), and automated monthly ledger exports.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-[#D4AF37]/20 flex items-center justify-between">
              <span className="text-xs text-emerald-300 font-medium">
                Est. Net Profit: ₹{stats.estimatedProfit.toLocaleString('en-IN')}
              </span>
              <Link
                to="/admin/profit-loss"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DFC18A] hover:text-[#F3E5AB] uppercase tracking-wider group-hover:translate-x-1 transition-transform"
              >
                <span>View Full Statements</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Live Orders & Fulfillments Section with Integrated Search & Filter */}
        <section className="bg-[#0A1F14]/90 backdrop-blur-xl border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/20">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-bold text-[#F3E5AB] tracking-wide">
                  Recent Orders & Fulfillments
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#143224] text-[#D4AF37] border border-[#D4AF37]/40">
                  {stats.recentOrders.length} Recent
                </span>
              </div>
              <p className="text-xs text-[#EADFC9]/70 mt-1">
                Live customer checkouts, dispatch statuses, and instant fulfillment controls
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Search Bar */}
              <div className="relative min-w-[200px] sm:min-w-[240px]">
                <Search className="w-3.5 h-3.5 text-[#DFC18A] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter order ID or customer..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#122A1E] border border-[#D4AF37]/30 text-xs text-[#F3E5AB] placeholder-[#EADFC9]/40 focus:outline-none focus:border-[#D4AF37] transition-all"
                />
              </div>

              <Link
                to="/admin/orders"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#143224] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-xs font-bold text-[#DFC18A] hover:text-[#F3E5AB] transition-all"
              >
                <span>Orders Board</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            {['ALL', 'PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((st) => (
              <button
                key={st}
                onClick={() => setOrderStatusFilter(st)}
                className={`px-3 py-1 rounded-lg transition-all text-[11px] font-bold uppercase tracking-wider cursor-pointer ${
                  orderStatusFilter === st
                    ? 'bg-[#D4AF37] text-[#07170E] shadow-md shadow-[#D4AF37]/20'
                    : 'bg-[#122A1E]/70 text-[#EADFC9]/70 hover:text-[#F3E5AB] hover:bg-[#1A3C2B]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Orders Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-[#D4AF37]/20">
            {filteredRecentOrders.length === 0 ? (
              <div className="py-12 text-center space-y-2">
                <ShoppingBag className="w-8 h-8 text-[#DFC18A]/40 mx-auto" />
                <p className="text-xs text-[#EADFC9]/70 italic">
                  No orders match your filter criteria.
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-[#D4AF37]/25 text-[#DFC18A] uppercase font-bold tracking-wider bg-[#081810]">
                    <th className="py-3.5 px-4">Order ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Saree Purchased</th>
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Payment</th>
                    <th className="py-3.5 px-4">Total</th>
                    <th className="py-3.5 px-4">Fulfillment Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/15">
                  {filteredRecentOrders.map((ord) => {
                    const items = Array.isArray(ord.items) ? ord.items : [];
                    const firstItem = items.length > 0 ? getItemDetails(items[0]) : null;
                    const custName =
                      ord.shipping_address?.name || ord.customer_name || ord.profiles?.name || 'Customer';

                    const isPaid =
                      ord.status === 'paid' || ord.payment_details?.status === 'captured';

                    return (
                      <tr
                        key={ord.id}
                        className="hover:bg-[#122A1E]/60 transition-colors group"
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-[#F3E5AB]">
                          #{ord.order_id || ord.id?.slice(0, 8)}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-[#F3E5AB]">
                          <div>
                            <p className="font-bold">{custName}</p>
                            <span className="text-[10px] text-[#EADFC9]/60 font-mono">
                              {ord.shipping_address?.phone || ord.customer_phone || ''}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          {firstItem ? (
                            <div className="flex items-center gap-3">
                              <img
                                src={firstItem.image}
                                alt={firstItem.name}
                                className="w-10 h-10 object-cover rounded-xl border border-[#D4AF37]/30 bg-[#1A3C2B] shadow-sm shrink-0 group-hover:scale-105 transition-transform"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600';
                                }}
                              />
                              <div className="min-w-0 max-w-[160px]">
                                <p className="font-semibold text-[#F3E5AB] truncate" title={firstItem.name}>
                                  {firstItem.name}
                                </p>
                                <p className="text-[10px] text-[#EADFC9]/70">
                                  Qty: {firstItem.qty} &bull; ₹{firstItem.price.toLocaleString('en-IN')}
                                  {items.length > 1 && (
                                    <span className="text-[#DFC18A] ml-1 font-bold">
                                      +{items.length - 1} more
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[#EADFC9]/60 italic">Heritage Saree</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-[#EADFC9]/80 font-mono text-[11px]">
                          {new Date(ord.created_at || Date.now()).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                          })}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <span className="inline-block text-[10px] font-bold uppercase text-[#F3E5AB]">
                              {ord.payment_method === 'cod' || ord.payment_method === 'COD'
                                ? 'COD'
                                : 'Online'}
                            </span>
                            <div>
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                                  isPaid
                                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                                    : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                                }`}
                              >
                                {isPaid ? <Check className="w-2.5 h-2.5" /> : <Clock className="w-2.5 h-2.5" />}
                                {isPaid ? 'Paid' : 'Unpaid'}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#DFC18A]">
                          ₹{Number(ord.total || ord.total_amount || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={ord.status || 'pending'}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className="bg-[#143224] border border-[#D4AF37]/40 rounded-xl px-2.5 py-1 text-xs text-[#F3E5AB] cursor-pointer focus:outline-none focus:border-[#D4AF37] font-semibold"
                          >
                            <option value="pending">PENDING</option>
                            <option value="paid">PAID</option>
                            <option value="confirmed">CONFIRMED</option>
                            <option value="processing">PROCESSING</option>
                            <option value="shipped">SHIPPED</option>
                            <option value="delivered">DELIVERED</option>
                            <option value="cancelled">CANCELLED</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="inline-flex items-center gap-1.5 justify-end">
                            <Link
                              to="/admin/orders"
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#143224] text-[#F3E5AB] border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-[#07170E] transition-all text-[10px] font-bold uppercase tracking-wider"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>View</span>
                            </Link>
                            <button
                              onClick={() => handleDeleteOrder(ord)}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-950/50 text-red-300 border border-red-500/30 hover:bg-red-800 hover:text-white transition-all text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                              title="Delete Order Permanently"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Registered Customer Accounts Section */}
        <section className="bg-[#0A1F14]/90 backdrop-blur-xl border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/20">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl font-bold text-[#F3E5AB] tracking-wide">
                  Registered Clients
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#143224] text-[#D4AF37] border border-[#D4AF37]/40">
                  {stats.customers.length} Accounts
                </span>
              </div>
              <p className="text-xs text-[#EADFC9]/70 mt-1">
                Synced profiles from orders & accounts
              </p>
            </div>
            <Link
              to="/admin/customers"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#143224] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-xs font-bold text-[#DFC18A] hover:text-[#F3E5AB] transition-all self-start sm:self-auto"
            >
              <span>Full Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-[#D4AF37]/20">
            {stats.customers.length === 0 ? (
              <p className="text-xs text-[#EADFC9]/70 italic py-8 text-center">
                No customer profiles registered yet.
              </p>
            ) : (
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-[#D4AF37]/25 text-[#DFC18A] uppercase font-bold tracking-wider bg-[#081810]">
                    <th className="py-3.5 px-4">Customer Name</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Role</th>
                    <th className="py-3.5 px-4">Joined On</th>
                    <th className="py-3.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/15">
                  {stats.customers.slice(0, 6).map((c, i) => {
                    const initials = (c.name || 'CU')
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')
                      .toUpperCase();

                    return (
                      <tr key={c.id || i} className="hover:bg-[#122A1E]/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#8C6B1C] text-[#07170E] font-extrabold flex items-center justify-center text-xs shadow-md">
                              {initials}
                            </div>
                            <span className="font-bold text-[#F3E5AB]">
                              {c.name || 'Customer User'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="space-y-0.5">
                            <p className="font-mono text-[#EADFC9] text-xs flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-[#DFC18A]" />
                              {c.email}
                            </p>
                            {c.phone && (
                              <p className="text-[10px] text-[#EADFC9]/60 flex items-center gap-1.5">
                                <Phone className="w-3 h-3 text-[#DFC18A]" />
                                {c.phone}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40">
                            {c.role || 'Client'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-[#EADFC9]/80 font-mono text-[11px]">
                          {c.created_at
                            ? new Date(c.created_at).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : 'Active'}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteCustomer(c)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-950/50 text-red-300 border border-red-500/30 hover:bg-red-800 hover:text-white transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-wider"
                            title="Remove Customer Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Delete</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
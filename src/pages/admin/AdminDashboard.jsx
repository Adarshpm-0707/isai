import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../../lib/supabaseClient';
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
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    lowStockCount: 0,
    activeCustomersCount: 0,
    recentLowStock: [],
    recentOrders: [],
    customers: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // 1. Fetch orders
      let ordersData = [];
      try {
        const { data } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });
        if (data) ordersData = data;
      } catch (e) {}

      let localOrders = [];
      try {
        localOrders = JSON.parse(localStorage.getItem('isai_orders') || '[]');
      } catch (e) {}

      const combinedOrders = [...ordersData];
      localOrders.forEach(lo => {
        if (!combinedOrders.some(co => co.id === lo.id || co.order_id === lo.id)) {
          combinedOrders.push(lo);
        }
      });

      // 2. Fetch products details for low stock
      const { data: productsData } = await supabase
        .from('products')
        .select('id, name, stock, category')
        .lt('stock', 5);

      // 3. Fetch profiles & registered customer data
      let dbProfiles = [];
      try {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });
        if (data) dbProfiles = data;
      } catch (e) {}

      let localUsers = [];
      try {
        localUsers = JSON.parse(localStorage.getItem('isai_registered_users') || '[]');
      } catch (e) {}

      const rawCustomers = [...dbProfiles];
      localUsers.forEach(lu => {
        if (!rawCustomers.some(cp => cp.email?.toLowerCase() === lu.email?.toLowerCase() || cp.id === lu.id)) {
          rawCustomers.push(lu);
        }
      });

      // Filter to keep ONLY customer accounts (exclude admins)
      const combinedCustomers = rawCustomers.filter(
        (c) => c.role !== 'admin' && !c.email?.toLowerCase().includes('admin')
      );

      let totalRevenue = combinedOrders.reduce(
        (acc, curr) => acc + (parseFloat(curr.total || curr.total_amount) || 0),
        0
      );
      let totalOrders = combinedOrders.length;
      let recentOrders = combinedOrders.slice(0, 5);

      let lowStockCount = productsData?.length || 0;
      let recentLowStock = productsData?.slice(0, 5) || [];

      setStats({
        totalOrders,
        totalRevenue,
        lowStockCount,
        activeCustomersCount: combinedCustomers.length,
        recentLowStock,
        recentOrders,
        customers: combinedCustomers,
      });
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId);
      if (error) throw error;
      fetchStats();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const handleDeleteCustomer = async (customer) => {
    const customerIdentifier = customer.name || customer.email || 'this customer';
    if (!window.confirm(`Are you sure you want to permanently delete customer "${customerIdentifier}" from the database?`)) {
      return;
    }

    try {
      // 1. Delete from Supabase PostgreSQL tables
      if (customer.id) {
        await supabase.from('profiles').delete().eq('id', customer.id);
        await supabase.from('customers').delete().eq('id', customer.id);
        await supabase.from('users').delete().eq('id', customer.id);
      }
      if (customer.email) {
        await supabase.from('profiles').delete().eq('email', customer.email);
        await supabase.from('customers').delete().eq('email', customer.email);
        await supabase.from('users').delete().eq('email', customer.email);
      }

      // 2. Remove from local storage fallback cache
      try {
        const localUsers = JSON.parse(localStorage.getItem('isai_registered_users') || '[]');
        const updatedLocal = localUsers.filter(
          (u) => u.email?.toLowerCase() !== customer.email?.toLowerCase() && u.id !== customer.id
        );
        localStorage.setItem('isai_registered_users', JSON.stringify(updatedLocal));
      } catch (e) {}

      alert(`Customer record for "${customerIdentifier}" deleted successfully.`);
      fetchStats();
    } catch (err) {
      console.error('Failed to delete customer:', err);
      alert(err.message || 'Failed to delete customer record from database');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 text-[#F3E5AB]">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeading
          title="Admin Control Center"
          subtitle="Real-time sales analytics, catalog controls, and fulfillment oversight"
          align="left"
        />
      </div>

      {/* Metrics widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-gradient-to-b from-[#133323] to-[#0A1F14] border border-[#D4AF37]/35 p-6 rounded-xl flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-[#1A3C2B] rounded-full text-[#FFD54F]">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] text-[#D4AF37]/80 uppercase font-bold tracking-wider mb-1">
              Total Revenue
            </span>
            <span className="font-sans text-xl font-bold text-[#F3E5AB]">
              ₹{stats.totalRevenue.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#133323] to-[#0A1F14] border border-[#D4AF37]/35 p-6 rounded-xl flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-[#1A3C2B] rounded-full text-[#FFD54F]">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] text-[#D4AF37]/80 uppercase font-bold tracking-wider mb-1">
              Orders Count
            </span>
            <span className="font-sans text-xl font-bold text-[#F3E5AB]">{stats.totalOrders}</span>
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#133323] to-[#0A1F14] border border-[#D4AF37]/35 p-6 rounded-xl flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-[#1A3C2B] rounded-full text-[#FFD54F]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] text-[#D4AF37]/80 uppercase font-bold tracking-wider mb-1">
              Active Customers
            </span>
            <span className="font-sans text-xl font-bold text-[#F3E5AB]">
              {stats.activeCustomersCount}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#133323] to-[#0A1F14] border border-[#D4AF37]/35 p-6 rounded-xl flex items-center gap-4 shadow-xl">
          <div
            className={`p-3 rounded-full ${
              stats.lowStockCount > 0 ? 'bg-[#1A3C2B] text-[#FFD54F] animate-pulse' : 'bg-[#1A3C2B]/60 text-[#D4AF37]/70'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] text-[#D4AF37]/80 uppercase font-bold tracking-wider mb-1">
              Low Stock Items
            </span>
            <span className="font-sans text-xl font-bold text-[#F3E5AB]">{stats.lowStockCount}</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-[#0C2317] border border-[#D4AF37]/35 p-6 rounded-xl shadow-xl space-y-4">
        <h3 className="font-serif text-lg font-bold text-[#F3E5AB] uppercase tracking-wider pb-3 border-b border-[#D4AF37]/25">
          Recent Orders
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-[#D4AF37]/25 text-[#D4AF37] uppercase font-bold">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/15">
              {stats.recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#153424]/60 transition-colors">
                  <td className="py-3 px-4 font-mono text-[#F3E5AB]">{ord.id.slice(0, 8)}...</td>
                  <td className="py-3 px-4 text-[#EADFC9]">
                    {new Date(ord.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#F3E5AB]">
                    ₹{Number(ord.total || ord.total_amount || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 uppercase text-[10px] font-bold">{ord.payment_method}</td>
                  <td className="py-3 px-4">
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                      className="bg-[#1A3C2B] border border-[#D4AF37]/40 rounded px-2 py-1 text-xs text-[#F3E5AB]"
                    >
                      <option value="pending">Pending</option>
                      <option value="paid">Paid</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registered Customer Signups & Logins Table */}
      <div className="bg-[#0C2317] border border-[#D4AF37]/35 p-6 rounded-xl shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/25">
          <h3 className="font-serif text-lg font-bold text-[#F3E5AB] uppercase tracking-wider">
            Registered Customers &amp; Signups ({stats.customers.length})
          </h3>
          <span className="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold">
            Real-time User Sync
          </span>
        </div>
        <div className="overflow-x-auto">
          {stats.customers.length === 0 ? (
            <p className="text-xs text-[#EADFC9]/70 italic py-2">No registered customers yet.</p>
          ) : (
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-[#D4AF37]/25 text-[#D4AF37] uppercase font-bold">
                  <th className="py-3 px-4">Customer Name</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Phone</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Joined Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#D4AF37]/15">
                {stats.customers.map((c, i) => (
                  <tr key={c.id || i} className="hover:bg-[#153424]/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-[#F3E5AB]">{c.name || 'Customer User'}</td>
                    <td className="py-3 px-4 text-[#EADFC9] font-mono">{c.email}</td>
                    <td className="py-3 px-4 text-[#EADFC9]/80">{c.phone || 'N/A'}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider"
                        style={{ background: c.role === 'admin' ? '#B8860B' : 'rgba(212,175,55,0.15)', color: c.role === 'admin' ? '#0C2317' : '#D4AF37', border: '1px solid rgba(212,175,55,0.4)' }}>
                        {c.role || 'User'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#EADFC9]">
                      {c.created_at ? new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : 'Recent'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteCustomer(c)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-950/60 text-red-300 border border-red-500/40 hover:bg-red-900/80 hover:text-white transition-colors cursor-pointer text-[10px] font-bold uppercase tracking-wider"
                        title="Delete Customer from Database"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

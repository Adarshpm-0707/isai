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
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    lowStockCount: 0,
    activeCustomersCount: 0,
    recentLowStock: [],
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // 1. Fetch orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      // 2. Fetch products details for low stock
      const { data: productsData } = await supabase
        .from('products')
        .select('id, name, stock, category')
        .lt('stock', 5);

      // 3. Fetch profiles count for customers
      const { data: profilesData } = await supabase.from('profiles').select('id');

      let totalRevenue = 0;
      let totalOrders = 0;
      let lowStockCount = 0;
      let recentLowStock = [];
      let recentOrders = [];
      let activeCustomersCount = profilesData?.length || 0;

      if (ordersData) {
        totalOrders = ordersData.length;
        totalRevenue = ordersData.reduce(
          (acc, curr) => acc + (parseFloat(curr.total || curr.total_amount) || 0),
          0
        );
        recentOrders = ordersData.slice(0, 5);
      }

      if (productsData) {
        lowStockCount = productsData.length;
        recentLowStock = productsData.slice(0, 5);
      }

      setStats({
        totalOrders,
        totalRevenue,
        lowStockCount,
        activeCustomersCount,
        recentLowStock,
        recentOrders,
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 text-[#D8A55A]">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeading
          title="Admin Control Center"
          subtitle="Real-time sales analytics, catalog controls, and fulfillment oversight"
          align="left"
        />
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/products"
            className="px-3 py-1.5 border border-[#D8A55A]/40 text-[#F6D18A] hover:bg-[#5C2F14] text-xs font-bold uppercase rounded"
          >
            Products
          </Link>
          <Link
            to="/admin/orders"
            className="px-3 py-1.5 bg-[#F6D18A] text-[#2B1409] text-xs font-bold uppercase rounded hover:opacity-90"
          >
            Orders
          </Link>
          <Link
            to="/admin/categories"
            className="px-3 py-1.5 border border-[#D8A55A]/40 text-[#F6D18A] hover:bg-[#5C2F14] text-xs font-bold uppercase rounded flex items-center gap-1"
          >
            <FolderTree className="w-3.5 h-3.5" /> Categories
          </Link>
          <Link
            to="/admin/coupons"
            className="px-3 py-1.5 border border-[#D8A55A]/40 text-[#F6D18A] hover:bg-[#5C2F14] text-xs font-bold uppercase rounded flex items-center gap-1"
          >
            <Tag className="w-3.5 h-3.5" /> Coupons
          </Link>
          <Link
            to="/admin/admins"
            className="px-3 py-1.5 border border-[#D8A55A]/40 text-[#F6D18A] hover:bg-[#5C2F14] text-xs font-bold uppercase rounded flex items-center gap-1"
          >
            <Users className="w-3.5 h-3.5" /> Admins
          </Link>
          <Link
            to="/admin/payment-settings"
            className="px-3 py-1.5 border border-[#D8A55A]/40 text-[#F6D18A] hover:bg-[#5C2F14] text-xs font-bold uppercase rounded flex items-center gap-1"
          >
            <CreditCard className="w-3.5 h-3.5" /> Gateway
          </Link>
          <Link
            to="/admin/activity-logs"
            className="px-3 py-1.5 border border-[#D8A55A]/40 text-[#F6D18A] hover:bg-[#5C2F14] text-xs font-bold uppercase rounded flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" /> Logs
          </Link>
        </div>
      </div>

      {/* Metrics widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="bg-gradient-to-b from-[#2B1409] to-[#3E1B0E] border border-[#D8A55A]/30 p-6 rounded-sm flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-[#5C2F14] rounded-full text-[#F6D18A]">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] text-[#D8A55A]/70 uppercase font-bold tracking-wider mb-1">
              Total Revenue
            </span>
            <span className="font-sans text-xl font-bold text-[#F6D18A]">
              ₹{stats.totalRevenue.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#2B1409] to-[#3E1B0E] border border-[#D8A55A]/30 p-6 rounded-sm flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-[#5C2F14] rounded-full text-[#F6D18A]">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] text-[#D8A55A]/70 uppercase font-bold tracking-wider mb-1">
              Orders Count
            </span>
            <span className="font-sans text-xl font-bold text-[#F6D18A]">{stats.totalOrders}</span>
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#2B1409] to-[#3E1B0E] border border-[#D8A55A]/30 p-6 rounded-sm flex items-center gap-4 shadow-xl">
          <div className="p-3 bg-[#5C2F14] rounded-full text-[#F6D18A]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] text-[#D8A55A]/70 uppercase font-bold tracking-wider mb-1">
              Active Customers
            </span>
            <span className="font-sans text-xl font-bold text-[#F6D18A]">
              {stats.activeCustomersCount}
            </span>
          </div>
        </div>

        <div className="bg-gradient-to-b from-[#2B1409] to-[#3E1B0E] border border-[#D8A55A]/30 p-6 rounded-sm flex items-center gap-4 shadow-xl">
          <div
            className={`p-3 rounded-full ${
              stats.lowStockCount > 0 ? 'bg-[#5C2F14] text-[#F6D18A] animate-pulse' : 'bg-[#5C2F14]/50 text-[#D8A55A]'
            }`}
          >
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] text-[#D8A55A]/70 uppercase font-bold tracking-wider mb-1">
              Low Stock Items
            </span>
            <span className="font-sans text-xl font-bold text-[#F6D18A]">{stats.lowStockCount}</span>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-[#2B1409] border border-[#D8A55A]/30 p-6 rounded-sm shadow-xl space-y-4">
        <h3 className="font-playfair text-lg font-bold text-[#F6D18A] uppercase tracking-wider pb-3 border-b border-[#D8A55A]/20">
          Recent Orders
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-[#D8A55A]/20 text-[#D8A55A]/70 uppercase font-bold">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D8A55A]/10">
              {stats.recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#5C2F14]/30">
                  <td className="py-3 px-4 font-mono text-[#F6D18A]">{ord.id.slice(0, 8)}...</td>
                  <td className="py-3 px-4 text-[#D8A55A]">
                    {new Date(ord.created_at).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 font-bold text-[#F6D18A]">
                    ₹{Number(ord.total || ord.total_amount || 0).toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 uppercase text-[10px] font-bold">{ord.payment_method}</td>
                  <td className="py-3 px-4">
                    <select
                      value={ord.status}
                      onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                      className="bg-[#4A0000] border border-[#F6D18A]/30 rounded px-2 py-1 text-xs text-[#F6D18A]"
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
    </div>
  );
}

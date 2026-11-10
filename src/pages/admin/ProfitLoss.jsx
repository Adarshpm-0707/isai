import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { orderService } from '../../services/orderService';
import { productService } from '../../services/productService';
import SectionHeading from '../../components/reusable/SectionHeading';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  PieChart,
  ShoppingBag,
  CreditCard,
  Download,
  Calendar,
  Percent,
  CheckCircle2,
  RefreshCw,
  Award,
} from 'lucide-react';

export default function ProfitLoss() {
  const [orders, setOrders] = useState(() => orderService.getLocalOrders());
  const [products, setProducts] = useState(() => productService.getLocalProducts());
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('all'); // 'all' | 'month' | 'week'

  const fetchData = async () => {
    try {
      // 1. Fetch Orders
      const orderRes = await orderService.getAllOrders({ limit: 1000 });
      if (orderRes?.orders && orderRes.orders.length > 0) {
        setOrders(orderRes.orders);
      }

      // 2. Fetch Products
      const prods = productService.getLocalProducts();
      setProducts(prods);
    } catch (err) {
      console.warn('Notice loading financial data:', err);
    }
  };

  useEffect(() => {
    fetchData();

    const handleUpdate = () => {
      fetchData();
    };

    window.addEventListener('isai:orders_updated', handleUpdate);
    return () => window.removeEventListener('isai:orders_updated', handleUpdate);
  }, []);

  // Filter orders by time range
  const filteredOrders = orders.filter((o) => {
    if (timeRange === 'all') return true;
    const orderDate = new Date(o.created_at || Date.now());
    const now = new Date();
    if (timeRange === 'week') {
      const diffTime = Math.abs(now - orderDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }
    if (timeRange === 'month') {
      return (
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getFullYear() === now.getFullYear()
      );
    }
    return true;
  });

  // Financial Calculations
  const grossRevenue = filteredOrders.reduce(
    (acc, o) => acc + Number(o.total || o.total_amount || 0),
    0
  );

  const totalDiscounts = filteredOrders.reduce(
    (acc, o) => acc + Number(o.discount || 0),
    0
  );

  const totalOrdersCount = filteredOrders.length;
  const avgOrderValue = totalOrdersCount > 0 ? Math.round(grossRevenue / totalOrdersCount) : 0;

  // Estimated Cost of Goods Sold (COGS) ~ 46% of retail price for master handloom silk weaving
  const estimatedCOGS = Math.round(grossRevenue * 0.46);
  // Estimated Operating / Shipping Costs ~ 6%
  const estimatedOperating = Math.round(grossRevenue * 0.06);
  // Net Profit
  const netProfit = Math.max(0, grossRevenue - estimatedCOGS - estimatedOperating);
  const profitMargin = grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : '0.0';

  // Payment Breakdown
  const codOrders = filteredOrders.filter(
    (o) => (o.payment_method || o.paymentMethod || '').toUpperCase().includes('COD')
  );
  const prepaidOrders = filteredOrders.filter(
    (o) => !(o.payment_method || o.paymentMethod || '').toUpperCase().includes('COD')
  );

  const codRevenue = codOrders.reduce(
    (acc, o) => acc + Number(o.total || o.total_amount || 0),
    0
  );
  const prepaidRevenue = prepaidOrders.reduce(
    (acc, o) => acc + Number(o.total || o.total_amount || 0),
    0
  );

  // Category Revenue Breakdown
  const categoryRevenueMap = {};
  filteredOrders.forEach((o) => {
    const items = Array.isArray(o.items) ? o.items : [];
    items.forEach((it) => {
      const cat = it.product?.category || it.category || 'Pure Silk';
      const itemPrice = Number(it.price || it.product?.price || 0);
      const qty = Number(it.quantity || it.qty || 1);
      categoryRevenueMap[cat] = (categoryRevenueMap[cat] || 0) + itemPrice * qty;
    });
  });

  // Top Performing Sarees
  const productPerformanceMap = {};
  filteredOrders.forEach((o) => {
    const items = Array.isArray(o.items) ? o.items : [];
    items.forEach((it) => {
      const name = it.name || it.product?.name || 'Heritage Saree';
      const qty = Number(it.quantity || it.qty || 1);
      const price = Number(it.price || it.product?.price || 0);
      const total = price * qty;

      if (!productPerformanceMap[name]) {
        productPerformanceMap[name] = {
          name,
          category: it.product?.category || it.category || 'Pure Silk',
          unitsSold: 0,
          revenue: 0,
        };
      }
      productPerformanceMap[name].unitsSold += qty;
      productPerformanceMap[name].revenue += total;
    });
  });

  const topSarees = Object.values(productPerformanceMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  // Export Financial CSV
  const handleExportReport = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'ISAI TARANG HANDLOOM : PROFIT & LOSS STATEMENT',
        `Generated: ${new Date().toLocaleString('en-IN')}`,
        `Period: ${timeRange.toUpperCase()}`,
        '',
        'Financial Metric,Value (INR)',
        `Gross Revenue,${grossRevenue}`,
        `Estimated COGS (46%),${estimatedCOGS}`,
        `Operating & Logistics (6%),${estimatedOperating}`,
        `Total Discounts Provided,${totalDiscounts}`,
        `Net Estimated Profit,${netProfit}`,
        `Net Profit Margin,${profitMargin}%`,
        `Total Orders,${totalOrdersCount}`,
        `Average Order Value (AOV),${avgOrderValue}`,
        `Prepaid Revenue,${prepaidRevenue}`,
        `Cash on Delivery Revenue,${codRevenue}`,
        '',
        'Product Name,Category,Units Sold,Total Revenue (INR),Estimated Profit (INR)',
        ...topSarees.map(
          (s) =>
            `"${s.name}","${s.category}",${s.unitsSold},${s.revenue},${Math.round(s.revenue * 0.48)}`
        ),
      ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `isai_financial_pl_${timeRange}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-[#F3E5AB]">
      {/* Title & Range Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeading
          title="Profit &amp; Loss Financial Overview"
          subtitle="Real-time revenue accounting, cost analysis, margin estimates, and sales health"
          align="left"
        />

        <div className="flex items-center gap-2 flex-wrap">
          {/* Time Filter Buttons */}
          <div className="flex items-center bg-[#0C2317] border border-[#D4AF37]/35 p-1 rounded-xl">
            {[
              { id: 'all', label: 'All Time' },
              { id: 'month', label: 'This Month' },
              { id: 'week', label: 'Past 7 Days' },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTimeRange(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  timeRange === t.id
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317]'
                    : 'text-[#EADFC9] hover:text-[#F3E5AB]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleExportReport}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1A3C2B] text-[#F3E5AB] border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#0C2317] transition-all text-xs font-bold uppercase tracking-wider shadow-md cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export P&amp;L</span>
          </button>
        </div>
      </div>

      {/* 4 Main Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Gross Revenue */}
        <div className="bg-gradient-to-b from-[#133323] to-[#0A1F14] border border-[#D4AF37]/35 p-5 sm:p-6 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1A3C2B] border border-[#D4AF37]/30 flex items-center justify-center text-[#FFD54F] shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] text-[#D4AF37]/80 uppercase font-bold tracking-wider mb-1">
              Gross Revenue
            </span>
            <span className="font-sans text-2xl font-bold text-[#F3E5AB]">
              ₹{grossRevenue.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Estimated Net Profit */}
        <div className="bg-gradient-to-b from-[#133323] to-[#0A1F14] border border-emerald-500/40 p-5 sm:p-6 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] text-emerald-300/80 uppercase font-bold tracking-wider mb-1">
              Estimated Net Profit
            </span>
            <span className="font-sans text-2xl font-bold text-emerald-300">
              ₹{netProfit.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Profit Margin % */}
        <div className="bg-gradient-to-b from-[#133323] to-[#0A1F14] border border-[#D4AF37]/35 p-5 sm:p-6 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1A3C2B] border border-[#D4AF37]/30 flex items-center justify-center text-[#FFD54F] shrink-0">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] text-[#D4AF37]/80 uppercase font-bold tracking-wider mb-1">
              Net Profit Margin
            </span>
            <span className="font-sans text-2xl font-bold text-[#F3E5AB]">
              {profitMargin}%
            </span>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="bg-gradient-to-b from-[#133323] to-[#0A1F14] border border-[#D4AF37]/35 p-5 sm:p-6 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1A3C2B] border border-[#D4AF37]/30 flex items-center justify-center text-[#FFD54F] shrink-0">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] text-[#D4AF37]/80 uppercase font-bold tracking-wider mb-1">
              Average Order Value
            </span>
            <span className="font-sans text-2xl font-bold text-[#F3E5AB]">
              ₹{avgOrderValue.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Financial Cost Breakdown & Payment Channels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cost & Margin Analysis */}
        <div className="bg-[#0C2317] border border-[#D4AF37]/35 p-6 rounded-2xl shadow-xl space-y-4">
          <h4 className="font-serif text-base font-bold text-[#F3E5AB] uppercase tracking-wider pb-3 border-b border-[#D4AF37]/25 flex items-center justify-between">
            <span>Profit &amp; Loss Breakdown</span>
            <span className="text-[10px] text-[#D4AF37] font-sans font-bold uppercase">
              Financial Summary
            </span>
          </h4>

          <div className="space-y-3 text-xs font-sans">
            <div className="flex justify-between items-center py-1.5 border-b border-[#D4AF37]/15">
              <span className="text-[#EADFC9]">Gross Retail Revenue</span>
              <span className="font-bold text-[#F3E5AB]">
                + ₹{grossRevenue.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#D4AF37]/15">
              <span className="text-[#EADFC9]">
                Estimated Handloom Cost (COGS ~46%)
              </span>
              <span className="font-bold text-amber-300">
                - ₹{estimatedCOGS.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex justify-between items-center py-1.5 border-b border-[#D4AF37]/15">
              <span className="text-[#EADFC9]">
                Estimated Logistics &amp; Shipping (~6%)
              </span>
              <span className="font-bold text-amber-300">
                - ₹{estimatedOperating.toLocaleString('en-IN')}
              </span>
            </div>

            {totalDiscounts > 0 && (
              <div className="flex justify-between items-center py-1.5 border-b border-[#D4AF37]/15">
                <span className="text-[#EADFC9]">Coupons &amp; Promotional Discounts</span>
                <span className="font-bold text-red-400">
                  - ₹{totalDiscounts.toLocaleString('en-IN')}
                </span>
              </div>
            )}

            <div className="flex justify-between items-center py-2.5 bg-[#153424] px-3 rounded-xl mt-2 text-sm font-bold text-emerald-300">
              <span className="uppercase tracking-wider text-xs">Estimated Net Profit</span>
              <span className="text-base">₹{netProfit.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Payment Channels (Prepaid vs COD) */}
        <div className="bg-[#0C2317] border border-[#D4AF37]/35 p-6 rounded-2xl shadow-xl space-y-4">
          <h4 className="font-serif text-base font-bold text-[#F3E5AB] uppercase tracking-wider pb-3 border-b border-[#D4AF37]/25 flex items-center justify-between">
            <span>Payment Method Analysis</span>
            <span className="text-[10px] text-[#D4AF37] font-sans font-bold uppercase">
              Settlement Split
            </span>
          </h4>

          <div className="space-y-4 text-xs font-sans">
            {/* Prepaid Online */}
            <div className="p-3.5 rounded-xl bg-[#153424] border border-[#D4AF37]/25 space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-[#F3E5AB]">Online Prepaid (Card / UPI)</span>
                </div>
                <span className="font-bold text-emerald-300">
                  ₹{prepaidRevenue.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-[#EADFC9]/80">
                <span>{prepaidOrders.length} Completed Orders</span>
                <span>
                  {grossRevenue > 0
                    ? Math.round((prepaidRevenue / grossRevenue) * 100)
                    : 0}
                  % of total sales
                </span>
              </div>
            </div>

            {/* Cash on Delivery */}
            <div className="p-3.5 rounded-xl bg-[#153424] border border-[#D4AF37]/25 space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-[#F3E5AB]">Cash on Delivery (COD)</span>
                </div>
                <span className="font-bold text-amber-300">
                  ₹{codRevenue.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-[#EADFC9]/80">
                <span>{codOrders.length} Completed Orders</span>
                <span>
                  {grossRevenue > 0
                    ? Math.round((codRevenue / grossRevenue) * 100)
                    : 0}
                  % of total sales
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Saree Revenue Leaders Table */}
      <div className="bg-[#0C2317] border border-[#D4AF37]/35 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-[#D4AF37]/25 flex items-center justify-between">
          <h4 className="font-serif text-base font-bold text-[#F3E5AB] uppercase tracking-wider">
            Top Revenue Generating Sarees
          </h4>
          <span className="text-[10px] text-[#D4AF37] uppercase font-bold tracking-widest">
            Sales Performance
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-[#D4AF37]/25 text-[#D4AF37] uppercase font-bold bg-[#081A11]">
                <th className="py-3 px-5">Saree Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-center">Units Sold</th>
                <th className="py-3 px-4">Total Revenue</th>
                <th className="py-3 px-4 text-right">Est. Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/15">
              {topSarees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-[#EADFC9]/70 italic">
                    No individual saree sales recorded in this timeframe yet.
                  </td>
                </tr>
              ) : (
                topSarees.map((s, idx) => (
                  <tr key={idx} className="hover:bg-[#153424]/60 transition-colors">
                    <td className="py-3.5 px-5 font-bold text-[#F3E5AB]">{s.name}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#1A3C2B] text-[#D4AF37] border border-[#D4AF37]/30">
                        {s.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center font-bold text-[#F3E5AB]">
                      {s.unitsSold}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-[#DFC18A]">
                      ₹{s.revenue.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-emerald-300">
                      ₹{Math.round(s.revenue * 0.48).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

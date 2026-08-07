import React, { useState, useEffect } from 'react';
import { orderService } from '../../services/orderService';
import { adminLogService } from '../../services/adminLogService';
import SectionHeading from '../../components/reusable/SectionHeading';
import Badge from '../../components/reusable/Badge';
import Modal from '../../components/reusable/Modal';
import {
  Eye,
  MapPin,
  User,
  Phone,
  Mail,
  Package,
  CreditCard,
  Calendar,
  Truck,
  Save,
  Printer,
  ShoppingBag,
  DollarSign,
  Clock,
  CheckCircle,
  FileSpreadsheet,
  FileText,
  Search,
  X,
  Filter,
} from 'lucide-react';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('pending');
  const [trackingId, setTrackingId] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Fetch all orders so tab switching and search filtering work instantly
      const res = await orderService.getAllOrders({ status: 'all', limit: 200 });
      setOrders(res.orders || []);
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status || 'pending');
    setTrackingId(order.shiprocket_order_id || '');
    setModalOpen(true);
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      await orderService.updateOrderStatus(selectedOrder.id, newStatus, trackingId);
      await adminLogService.logAction('UPDATE_ORDER_STATUS', 'orders', selectedOrder.id, {
        status: newStatus,
        tracking_id: trackingId,
      });

      setModalOpen(false);
      fetchOrders();
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  // Client-Side Filtered Orders (Status Tab + Search Keyword)
  const filteredOrders = orders.filter((o) => {
    // 1. Status Filter Tab
    if (activeTab !== 'all') {
      const orderStatus = (o.status || 'pending').toLowerCase();
      if (orderStatus !== activeTab.toLowerCase()) return false;
    }

    // 2. Search Keyword Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const idMatch = (o.id || o.order_id || '').toLowerCase().includes(q);
      const custName = (o.shipping_address?.name || o.profiles?.name || '').toLowerCase();
      const custEmail = (o.shipping_address?.email || o.profiles?.email || '').toLowerCase();
      const custPhone = (o.shipping_address?.phone || o.profiles?.phone || '').toLowerCase();
      
      const nameMatch = custName.includes(q);
      const emailMatch = custEmail.includes(q);
      const phoneMatch = custPhone.includes(q);

      if (!idMatch && !nameMatch && !emailMatch && !phoneMatch) return false;
    }

    return true;
  });

  // Option 1: Export Excel Sheet (CSV)
  const handleExportExcel = () => {
    if (!filteredOrders || filteredOrders.length === 0) {
      alert('No orders available to export.');
      return;
    }

    const headers = [
      'Order ID',
      'Customer Name',
      'Email',
      'Phone',
      'Address',
      'City',
      'State',
      'Pincode',
      'Date',
      'Items Purchased',
      'Total Amount (INR)',
      'Payment Method',
      'Status',
      'Tracking ID',
    ];

    const rows = filteredOrders.map((o) => {
      const cust = o.shipping_address || o.profiles || {};
      const itemsList = (Array.isArray(o.items) ? o.items : [])
        .map((i) => `${i.qty || i.quantity || 1}x ${i.name || i.product?.name || 'Saree'}`)
        .join('; ');

      const cleanStr = (str) => `"${String(str || '').replace(/"/g, '""')}"`;

      return [
        cleanStr(o.id || o.order_id),
        cleanStr(cust.name || 'N/A'),
        cleanStr(cust.email || 'N/A'),
        cleanStr(cust.phone || 'N/A'),
        cleanStr(cust.addressLine1 || cust.street || ''),
        cleanStr(cust.city || ''),
        cleanStr(cust.state || ''),
        cleanStr(cust.pincode || ''),
        cleanStr(new Date(o.created_at || Date.now()).toLocaleDateString('en-IN')),
        cleanStr(itemsList),
        cleanStr(o.total || o.total_amount || 0),
        cleanStr(o.payment_method || 'COD'),
        cleanStr(o.status || 'pending'),
        cleanStr(o.shiprocket_order_id || 'N/A'),
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `isai_orders_report_${activeTab}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Option 2: Download PDF Report
  const handleExportPDFReport = () => {
    if (!filteredOrders || filteredOrders.length === 0) {
      alert('No orders available to export.');
      return;
    }

    const printWindow = window.open('', '_blank', 'width=900,height=900');
    if (!printWindow) {
      alert('Please allow popups to download PDF report.');
      return;
    }

    const rowsHTML = filteredOrders
      .map(
        (o, idx) => `
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 10px; font-mono; font-size: 11px; color: #4A5568; text-align: center;">${idx + 1}</td>
          <td style="padding: 10px; font-weight: 700; color: #1A202C;">${o.id || o.order_id}</td>
          <td style="padding: 10px; color: #1A202C;">${o.shipping_address?.name || o.profiles?.name || 'Customer'}</td>
          <td style="padding: 10px; color: #4A5568;">${new Date(o.created_at || Date.now()).toLocaleDateString('en-IN')}</td>
          <td style="padding: 10px; font-weight: 700; color: #1A202C;">₹${Number(o.total || o.total_amount || 0).toLocaleString('en-IN')}</td>
          <td style="padding: 10px; text-transform: uppercase; font-size: 10px; font-weight: 700; color: #4A5568;">${o.payment_method || 'COD'}</td>
          <td style="padding: 10px;"><span style="background: #FEF3C7; color: #92400E; padding: 4px 8px; border-radius: 9999px; font-size: 10px; font-weight: 700; text-transform: uppercase;">${o.status || 'pending'}</span></td>
        </tr>
      `
      )
      .join('');

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Isai Orders PDF Summary - ${activeTab.toUpperCase()}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@400;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; padding: 30px; color: #1A202C; }
            .header { border-bottom: 2px solid #D4AF37; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
            .title { font-family: 'Cinzel', serif; font-size: 22px; font-weight: 700; color: #0C2317; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; font-size: 12px; }
            th { background: #0C2317; color: #F3E5AB; padding: 10px; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="title">ISAI TARANG HERITAGE</div>
              <div style="font-size: 12px; color: #B8860B; font-weight: 700; text-transform: uppercase;">Orders & Fulfillments Audit Report (${activeTab.toUpperCase()})</div>
            </div>
            <div style="text-align: right; font-size: 11px; color: #718096;">
              Generated: ${new Date().toLocaleString('en-IN')}<br/>
              Total Record Count: <strong>${filteredOrders.length}</strong>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th style="text-align: left;">Order ID</th>
                <th style="text-align: left;">Customer</th>
                <th style="text-align: left;">Date</th>
                <th style="text-align: left;">Total Amount</th>
                <th style="text-align: left;">Payment</th>
                <th style="text-align: left;">Status</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHTML}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  // Helper to generate print/download invoice from admin side
  const handlePrintAdminInvoice = (order) => {
    if (!order) return;
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      alert('Please allow popups to print/download invoice.');
      return;
    }

    const items = Array.isArray(order.items) ? order.items : [];
    const cust = order.shipping_address || order.profiles || {};
    const total = Number(order.total || order.total_amount || 0);

    const itemsRowsHTML = (items.length > 0 ? items : [{ name: 'Handcrafted Heritage Saree', qty: 1, price: total }])
      .map(
        (it, idx) => `
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 12px; text-align: center; color: #4A5568;">${idx + 1}</td>
          <td style="padding: 12px; color: #1A202C; font-weight: 600;">${it.name || it.product?.name || 'Handcrafted Saree'}</td>
          <td style="padding: 12px; text-align: center; color: #4A5568;">${it.qty || it.quantity || 1}</td>
          <td style="padding: 12px; text-align: right; color: #4A5568;">₹${Number(it.price || it.product?.price || total).toLocaleString('en-IN')}</td>
          <td style="padding: 12px; text-align: right; color: #1A202C; font-weight: 700;">₹${Number((it.price || it.product?.price || total) * (it.qty || it.quantity || 1)).toLocaleString('en-IN')}</td>
        </tr>
      `
      )
      .join('');

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${order.id || order.order_id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Inter:wght@400;600;700&display=swap');
            body { font-family: 'Inter', sans-serif; color: #1A202C; background-color: #FFFFFF; margin: 0; padding: 40px; }
            .invoice-container { max-width: 800px; margin: 0 auto; border: 1px solid #E2E8F0; border-radius: 8px; padding: 32px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; margin-bottom: 24px; }
            .brand-title { font-family: 'Cinzel', serif; font-size: 26px; font-weight: 700; color: #0C2317; margin: 0; letter-spacing: 1px; }
            .brand-sub { font-size: 11px; color: #B8860B; text-transform: uppercase; letter-spacing: 2px; margin-top: 4px; font-weight: 700; }
            .inv-badge { text-align: right; }
            .inv-title { font-size: 22px; font-weight: 700; color: #0C2317; text-transform: uppercase; letter-spacing: 1px; }
            .meta-table { width: 100%; margin-bottom: 24px; }
            .meta-col { width: 50%; vertical-align: top; }
            .meta-box { background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 16px; border-radius: 6px; }
            .meta-label { font-size: 10px; text-transform: uppercase; color: #718096; font-weight: 700; letter-spacing: 1px; margin-bottom: 6px; }
            .items-table { width: 100%; border-collapse: collapse; margin-top: 20px; margin-bottom: 24px; }
            .items-table th { background-color: #0C2317; color: #F3E5AB; padding: 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
            .totals-container { display: flex; justify-content: flex-end; margin-top: 20px; }
            .totals-box { width: 280px; background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 6px; padding: 16px; }
            .totals-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 12px; }
            .totals-row.grand { border-top: 2px solid #D4AF37; padding-top: 10px; font-size: 16px; font-weight: 700; color: #0C2317; }
            .footer { margin-top: 40px; border-top: 1px solid #E2E8F0; padding-top: 20px; text-align: center; font-size: 11px; color: #718096; }
            .stamp { display: inline-block; border: 2px dashed #D4AF37; color: #0C2317; padding: 6px 16px; font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin-top: 12px; }
            @media print { body { padding: 0; } .invoice-container { border: none; box-shadow: none; } }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <div>
                <h1 class="brand-title">ISAI TARANG</h1>
                <div class="brand-sub">Handcrafted Heritage Sarees</div>
                <div style="font-size: 11px; color: #4A5568; margin-top: 8px;">
                  GSTIN: 33AAAAA0000A1Z5 | Reg: Kanchipuram, TN<br/>
                  Phone: +91 90488 68444 | Email: support@isaitarang.com
                </div>
              </div>
              <div class="inv-badge">
                <div class="inv-title">TAX INVOICE</div>
                <div style="font-size: 12px; font-weight: 600; color: #4A5568; margin-top: 4px;"># ${order.id || order.order_id}</div>
                <div style="font-size: 11px; color: #718096; margin-top: 2px;">Date: ${new Date(order.created_at || Date.now()).toLocaleDateString('en-IN')}</div>
              </div>
            </div>

            <table class="meta-table">
              <tr>
                <td class="meta-col" style="padding-right: 10px;">
                  <div class="meta-box">
                    <div class="meta-label">Billed & Shipped To</div>
                    <div style="font-weight: 700; font-size: 14px; color: #1A202C;">${cust.name || 'Valued Customer'}</div>
                    <div style="font-size: 12px; color: #4A5568; margin-top: 4px;">
                      ${cust.addressLine1 || cust.street || ''} ${cust.addressLine2 || ''}<br/>
                      ${cust.city || ''}, ${cust.state || ''} - ${cust.pincode || ''}<br/>
                      Phone: ${cust.phone || 'N/A'}<br/>
                      Email: ${cust.email || 'N/A'}
                    </div>
                  </div>
                </td>
                <td class="meta-col" style="padding-left: 10px;">
                  <div class="meta-box">
                    <div class="meta-label">Payment Information</div>
                    <div style="font-size: 13px; font-weight: 700; color: #0C2317;">${order.payment_method || 'COD'}</div>
                    <div style="font-size: 12px; color: #4A5568; margin-top: 4px;">
                      Fulfillment Status: <strong style="color: #2F855A;">${(order.status || 'pending').toUpperCase()}</strong><br/>
                      Invoice Currency: <strong>INR (₹)</strong>
                    </div>
                  </div>
                </td>
              </tr>
            </table>

            <table class="items-table">
              <thead>
                <tr>
                  <th style="width: 8%;">S.No</th>
                  <th style="text-align: left; width: 47%;">Product Description</th>
                  <th style="width: 15%;">Qty</th>
                  <th style="text-align: right; width: 15%;">Rate (₹)</th>
                  <th style="text-align: right; width: 15%;">Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRowsHTML}
              </tbody>
            </table>

            <div class="totals-container">
              <div class="totals-box">
                <div class="totals-row">
                  <span>Subtotal:</span>
                  <span>₹${total.toLocaleString('en-IN')}</span>
                </div>
                <div class="totals-row">
                  <span>Shipping:</span>
                  <span style="color: #2F855A; font-weight: 600;">FREE</span>
                </div>
                <div class="totals-row grand">
                  <span>Grand Total:</span>
                  <span>₹${total.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            <div class="footer">
              <p>Thank you for shopping with <strong>Isai Tarang Heritage Sarees</strong>.</p>
              <div class="stamp">OFFICIAL VERIFIED INVOICE</div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  const tabs = [
    'all',
    'pending',
    'paid',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
  ];

  // Derived Stats
  const totalOrdersCount = orders.length;
  const pendingCount = orders.filter((o) => (o.status || 'pending') === 'pending').length;
  const fulfilledCount = orders.filter(
    (o) => o.status === 'shipped' || o.status === 'delivered' || o.status === 'paid'
  ).length;
  const totalRevenueSum = orders.reduce(
    (acc, curr) => acc + (parseFloat(curr.total || curr.total_amount) || 0),
    0
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-[#F3E5AB]">
      {/* Page Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <SectionHeading
          title="Fulfillments Board"
          subtitle="Manage customer purchases, view complete shipping & item details, and update dispatch statuses"
          align="left"
        />

        {/* 2 Export Options: PDF & Excel Sheet */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Option 1: PDF Download */}
          <button
            onClick={handleExportPDFReport}
            className="inline-flex items-center gap-2 bg-[#1A3C2B] text-[#F3E5AB] border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#0C2317] px-4 py-2.5 rounded-xl font-sans text-xs uppercase tracking-wider font-bold shadow-xl transition-all cursor-pointer"
            title="Download PDF Orders Summary Report"
          >
            <FileText className="w-4 h-4 text-[#D4AF37]" />
            <span>Download PDF</span>
          </button>

          {/* Option 2: Excel Sheet Export */}
          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317] hover:brightness-110 px-4 py-2.5 rounded-xl font-sans text-xs uppercase tracking-wider font-bold shadow-xl transition-all cursor-pointer"
            title="Export Orders to Excel Sheet (.csv)"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Excel Sheet</span>
          </button>
        </div>
      </div>

      {/* Top Stat Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
        <div className="bg-[#0C2317] border border-[#D4AF37]/35 p-5 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1A3C2B] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-[#EADFC9]/70">Total Orders</p>
            <p className="text-2xl font-serif font-bold text-[#F3E5AB]">{totalOrdersCount}</p>
          </div>
        </div>

        <div className="bg-[#0C2317] border border-[#D4AF37]/35 p-5 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-[#EADFC9]/70">Pending Dispatch</p>
            <p className="text-2xl font-serif font-bold text-amber-300">{pendingCount}</p>
          </div>
        </div>

        <div className="bg-[#0C2317] border border-[#D4AF37]/35 p-5 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-[#EADFC9]/70">Fulfilled Orders</p>
            <p className="text-2xl font-serif font-bold text-emerald-300">{fulfilledCount}</p>
          </div>
        </div>

        <div className="bg-[#0C2317] border border-[#D4AF37]/35 p-5 rounded-2xl shadow-xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#1A3C2B] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37]">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-[#EADFC9]/70">Orders Revenue</p>
            <p className="text-2xl font-serif font-bold text-[#D4AF37]">
              ₹{totalRevenueSum.toLocaleString('en-IN')}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar: Search Input + Status Filter Tabs */}
      <div className="bg-[#0C2317] border border-[#D4AF37]/35 p-4 rounded-2xl space-y-4 shadow-xl font-sans">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Real-time Keyword Search Input Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Order ID, Customer Name, Email, or Phone..."
              className="w-full bg-[#1A3C2B] border border-[#D4AF37]/35 rounded-xl pl-10 pr-10 py-2.5 text-xs text-[#F3E5AB] placeholder:text-[#EADFC9]/50 focus:outline-none focus:border-[#D4AF37]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#EADFC9]/60 hover:text-[#F3E5AB]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="text-xs text-[#D4AF37] font-bold flex items-center gap-1.5 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Showing {filteredOrders.length} of {orders.length} orders</span>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 border-t border-[#D4AF37]/20 pt-3 overflow-x-auto no-scrollbar">
          {tabs.map((t) => {
            const count = orders.filter((o) =>
              t === 'all' ? true : (o.status || 'pending').toLowerCase() === t.toLowerCase()
            ).length;

            return (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === t
                    ? 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317] shadow-lg scale-105'
                    : 'bg-[#1A3C2B] text-[#F3E5AB] hover:bg-[#D4AF37] hover:text-[#0C2317] border border-[#D4AF37]/35'
                }`}
              >
                <span>{t}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === t ? 'bg-[#0C2317] text-[#D4AF37]' : 'bg-[#081A11] text-[#EADFC9]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#0C2317] border border-[#D4AF37]/35 rounded-2xl shadow-2xl overflow-hidden text-[#F3E5AB]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-[#D4AF37]/25 text-[#D4AF37] font-bold uppercase tracking-wider bg-[#081A11]">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Items Purchased</th>
                <th className="py-4 px-6">Total Amount</th>
                <th className="py-4 px-6">Payment Method</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/15">
              {filteredOrders.length === 0 && !loading ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-[#EADFC9]/70 italic">
                    No orders matching filter: <strong>"{activeTab}"</strong> {searchQuery && `with search "${searchQuery}"`}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  let badgeVariant = 'warning';
                  if (order.status === 'shipped') badgeVariant = 'gold';
                  if (order.status === 'delivered' || order.status === 'paid')
                    badgeVariant = 'success';
                  if (order.status === 'cancelled' || order.status === 'failed')
                    badgeVariant = 'danger';

                  const items = Array.isArray(order.items) ? order.items : [];
                  const custName =
                    order.shipping_address?.name || order.profiles?.name || 'Customer';

                  return (
                    <tr key={order.id} className="hover:bg-[#153424]/60 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-[#F3E5AB]">
                        {order.id?.slice(0, 12) || order.order_id}
                      </td>
                      <td className="py-4 px-6 font-medium text-[#F3E5AB]">{custName}</td>
                      <td className="py-4 px-6 text-[#EADFC9]">
                        {new Date(order.created_at || Date.now()).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-4 px-6">
                        <div className="space-y-1">
                          {items.slice(0, 2).map((it, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[#EADFC9]">
                              <span className="font-bold text-[#F3E5AB]">
                                {it.quantity || it.qty || 1} &times;
                              </span>
                              <span className="truncate max-w-[150px]">
                                {it.name || it.product?.name || 'Handcrafted Saree'}
                              </span>
                            </div>
                          ))}
                          {items.length > 2 && (
                            <span className="text-[10px] text-[#D4AF37] font-bold">
                              + {items.length - 2} more items
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-4 px-6 font-bold text-[#F3E5AB]">
                        ₹{Number(order.total || order.total_amount || 0).toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-6 uppercase text-[10px] font-bold text-[#EADFC9]">
                        {order.payment_method || 'COD'}
                      </td>
                      <td className="py-4 px-6">
                        <Badge text={order.status || 'pending'} variant={badgeVariant} />
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleOpenModal(order)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider bg-[#1A3C2B] text-[#F3E5AB] border border-[#D4AF37]/35 hover:bg-[#D4AF37] hover:text-[#0C2317] transition-all cursor-pointer shadow-md"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Details</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Redesigned Order Details Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Order Details (#${selectedOrder?.id || selectedOrder?.order_id || ''})`}
      >
        {selectedOrder && (
          <div className="space-y-6 text-xs font-sans text-[#F3E5AB] p-1 max-h-[80vh] overflow-y-auto pr-1">
            {/* Header info banner */}
            <div className="bg-[#1A3C2B] border border-[#D4AF37]/40 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-lg">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-mono text-[#EADFC9]">
                    Ordered on: {new Date(selectedOrder.created_at || Date.now()).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#D4AF37]" />
                  <span className="font-bold uppercase text-[#F3E5AB]">
                    Payment: {selectedOrder.payment_method || 'COD'} (Total: ₹
                    {Number(selectedOrder.total || selectedOrder.total_amount || 0).toLocaleString('en-IN')})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePrintAdminInvoice(selectedOrder)}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317] font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer hover:brightness-110"
                  title="Print / Download Official Tax Invoice PDF"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Invoice PDF</span>
                </button>

                <div className="flex items-center gap-1.5">
                  <span className="text-[#EADFC9] uppercase font-bold text-[10px]">Status:</span>
                  <Badge text={selectedOrder.status || 'pending'} variant="gold" />
                </div>
              </div>
            </div>

            {/* Customer & Shipping Address Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer Info Card */}
              <div className="bg-[#081A11] border border-[#D4AF37]/30 p-4 rounded-xl space-y-2.5 shadow-md">
                <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#D4AF37]/20 pb-2">
                  <User className="w-4 h-4" /> Customer Profile
                </h4>
                <div className="space-y-1.5 text-xs text-[#EADFC9]">
                  <p className="font-bold text-[#F3E5AB] text-sm">
                    {selectedOrder.shipping_address?.name || selectedOrder.profiles?.name || 'N/A'}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{selectedOrder.shipping_address?.email || selectedOrder.profiles?.email || 'N/A'}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>{selectedOrder.shipping_address?.phone || selectedOrder.profiles?.phone || 'N/A'}</span>
                  </p>
                </div>
              </div>

              {/* Shipping Address Card */}
              <div className="bg-[#081A11] border border-[#D4AF37]/30 p-4 rounded-xl space-y-2.5 shadow-md">
                <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#D4AF37]/20 pb-2">
                  <MapPin className="w-4 h-4" /> Shipping & Delivery Location
                </h4>
                <div className="space-y-1 text-xs text-[#EADFC9]">
                  {selectedOrder.shipping_address ? (
                    <>
                      <p className="font-medium">
                        {selectedOrder.shipping_address.addressLine1 || selectedOrder.shipping_address.street}
                      </p>
                      {selectedOrder.shipping_address.addressLine2 && (
                        <p>{selectedOrder.shipping_address.addressLine2}</p>
                      )}
                      <p>
                        {selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} -{' '}
                        <span className="font-bold text-[#D4AF37]">
                          {selectedOrder.shipping_address.pincode}
                        </span>
                      </p>
                    </>
                  ) : (
                    <p className="italic text-[#EADFC9]/60">No shipping address recorded</p>
                  )}
                </div>
              </div>
            </div>

            {/* Purchased Items List */}
            <div className="bg-[#081A11] border border-[#D4AF37]/30 p-4 rounded-xl space-y-3 shadow-md">
              <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#D4AF37]/20 pb-2">
                <Package className="w-4 h-4" /> Items Purchased (
                {Array.isArray(selectedOrder.items) ? selectedOrder.items.length : 0})
              </h4>

              <div className="space-y-2.5">
                {Array.isArray(selectedOrder.items) &&
                  selectedOrder.items.map((it, idx) => {
                    const unitPrice = Number(it.price || it.product?.price || 0);
                    const qty = Number(it.quantity || it.qty || 1);
                    const itemTotal = unitPrice * qty;

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-[#1A3C2B]/60 border border-[#D4AF37]/20 rounded-xl"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-[#0C2317] border border-[#D4AF37]/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                            {it.product?.images?.[0] || it.image ? (
                              <img
                                src={it.product?.images?.[0] || it.image}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="w-5 h-5 text-[#D4AF37]" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-[#F3E5AB] text-sm">
                              {it.name || it.product?.name || 'Handcrafted Saree'}
                            </p>
                            <p className="text-[10px] text-[#EADFC9] mt-0.5">
                              Qty: <strong className="text-[#F3E5AB]">{qty}</strong> &times; ₹
                              {unitPrice.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                        <div className="font-bold text-[#D4AF37] text-sm">
                          ₹{itemTotal.toLocaleString('en-IN')}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Status Update Form */}
            <form
              onSubmit={handleUpdateStatus}
              className="bg-[#1A3C2B] border border-[#D4AF37]/40 p-4 rounded-xl space-y-4 shadow-lg"
            >
              <h4 className="font-serif text-sm font-bold text-[#F3E5AB] uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#D4AF37]" /> Dispatch & Status Update
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block uppercase font-bold text-[#D4AF37] tracking-wider text-[10px]">
                    Select New Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full bg-[#081A11] border border-[#D4AF37]/35 rounded-lg p-2.5 text-[#F3E5AB] focus:outline-none focus:border-[#D4AF37]"
                  >
                    {tabs
                      .filter((t) => t !== 'all')
                      .map((t) => (
                        <option key={t} value={t}>
                          {t.toUpperCase()}
                        </option>
                      ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block uppercase font-bold text-[#D4AF37] tracking-wider text-[10px]">
                    Tracking / AWB Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={trackingId}
                    onChange={(e) => setTrackingId(e.target.value)}
                    className="w-full bg-[#081A11] border border-[#D4AF37]/35 rounded-lg p-2.5 text-[#F3E5AB] focus:outline-none focus:border-[#D4AF37]"
                    placeholder="e.g. AWB19827391"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#D4AF37]/20">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg font-bold text-xs uppercase text-[#EADFC9] hover:bg-[#081A11]"
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317] hover:brightness-110 shadow-lg flex items-center gap-1.5 cursor-pointer font-sans"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Status</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import EmptyState from '../components/reusable/EmptyState';
import Badge from '../components/reusable/Badge';
import { orderService } from '../services/orderService';
import { getProductImage } from '../utils/productHelpers';
import {
  Package,
  XCircle,
  Printer,
  Clock,
  MapPin,
  Phone,
  Mail,
  Truck,
  CheckCircle2,
  Copy,
  Check,
  CreditCard,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { FloralOrnament } from '../components/reusable/FloralOrnament';

// Helper to normalize item details regardless of storage shape
function getItemDetails(item) {
  const prod = item.product || item;
  const name = prod.name || item.name || item.product_name || 'Handcrafted Heritage Saree';
  const qty = Number(item.quantity || item.qty || 1);
  const unitPrice = Number(prod.discount_price ?? prod.price ?? item.price ?? 0);
  const size = item.size || prod.size || 'Standard (5.5m + 0.8m Blouse)';
  const img = getProductImage(prod);
  const category = prod.category || item.category || 'Pure Silk';
  const id = prod.id || item.product_id || item.id;

  return {
    name,
    qty,
    unitPrice,
    lineTotal: unitPrice * qty,
    size,
    img,
    category,
    id,
  };
}

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fetchOrders = async () => {
    // Immediately display local orders without delay
    try {
      const local = orderService.getLocalOrders();
      if (Array.isArray(local) && local.length > 0) {
        const matching = user?.id
          ? local.filter((o) => !o.user_id || o.user_id === user.id)
          : local;
        setOrders(matching);
      }
    } catch {}

    setLoading(true);
    try {
      // Works for both authenticated users and guest orders placed on this device
      const data = await orderService.getUserOrders(user?.id || null);
      if (Array.isArray(data) && data.length > 0) {
        setOrders(data);
      }
    } catch (err) {
      console.warn('Notice fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    const handleOrdersUpdated = (e) => {
      if (Array.isArray(e.detail)) {
        setOrders(e.detail);
      } else {
        fetchOrders();
      }
    };

    window.addEventListener('isai:orders_updated', handleOrdersUpdated);
    return () => window.removeEventListener('isai:orders_updated', handleOrdersUpdated);
  }, [user]);

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
    const printWindow = window.open('', '_blank', 'width=850,height=950');
    if (!printWindow) {
      alert('Please allow popups to download or print your Invoice.');
      return;
    }

    const orderId = order.id || order.order_id || 'ORD-ISAI';
    const items = Array.isArray(order.items) ? order.items : [];
    const addr = order.shippingAddress || order.shipping_address || {};
    const totalAmount = Number(order.totalAmount || order.total_amount || 0);
    const dateStr = new Date(order.created_at || Date.now()).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const itemsRowsHTML = items
      .map((it, idx) => {
        const d = getItemDetails(it);
        return `
        <tr style="border-bottom: 1px solid #E2E8F0;">
          <td style="padding: 12px; text-align: center; color: #4A5568;">${idx + 1}</td>
          <td style="padding: 12px; color: #1A202C; font-weight: 600;">
            ${d.name}
            <div style="font-size: 11px; color: #718096; font-weight: normal;">${d.size}</div>
          </td>
          <td style="padding: 12px; text-align: center; color: #4A5568;">${d.qty}</td>
          <td style="padding: 12px; text-align: right; color: #4A5568;">₹${d.unitPrice.toLocaleString('en-IN')}</td>
          <td style="padding: 12px; text-align: right; color: #1A202C; font-weight: 700;">₹${d.lineTotal.toLocaleString('en-IN')}</td>
        </tr>
      `;
      })
      .join('');

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice - ${orderId}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;500;600;700&display=swap');
            body {
              font-family: 'Inter', sans-serif;
              color: #1A202C;
              background-color: #FFFFFF;
              margin: 0;
              padding: 40px;
            }
            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              border: 1px solid #E2E8F0;
              border-radius: 8px;
              padding: 36px;
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              border-bottom: 2px solid #C86A27;
              padding-bottom: 20px;
              margin-bottom: 24px;
            }
            .brand-title {
              font-family: 'Playfair Display', serif;
              font-size: 28px;
              font-weight: 700;
              color: #120B09;
              margin: 0;
            }
            .brand-subtitle {
              font-size: 10px;
              letter-spacing: 2px;
              text-transform: uppercase;
              color: #C86A27;
              margin-top: 4px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 24px;
            }
            th {
              background: #1E130F;
              color: #DFC18A;
              padding: 12px;
              text-transform: uppercase;
              font-size: 11px;
              letter-spacing: 1px;
            }
            .total-row {
              background: #F7FAFC;
              font-weight: 700;
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <div class="header">
              <div>
                <h1 class="brand-title">ISAITARANG</h1>
                <div class="brand-subtitle">Pure Handloom & Royal Silk Heritage</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 18px; font-weight: 700; color: #C86A27;">TAX INVOICE</div>
                <div style="font-size: 12px; color: #718096; margin-top: 4px;">Invoice: <strong>${orderId}</strong></div>
                <div style="font-size: 12px; color: #718096;">Date: ${dateStr}</div>
              </div>
            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 24px; font-size: 13px;">
              <div>
                <strong style="color: #C86A27; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Billed & Shipped To:</strong>
                <div style="font-weight: 700; margin-top: 4px;">${addr.name || 'Customer'}</div>
                <div>${addr.addressLine1 || addr.street || ''}</div>
                ${addr.addressLine2 ? `<div>${addr.addressLine2}</div>` : ''}
                <div>${addr.city || ''}${addr.state ? `, ${addr.state}` : ''} - ${addr.pincode || ''}</div>
                <div>Phone: ${addr.phone || 'N/A'}</div>
              </div>
              <div style="text-align: right;">
                <strong style="color: #C86A27; text-transform: uppercase; font-size: 11px; letter-spacing: 1px;">Payment & Delivery:</strong>
                <div style="margin-top: 4px;">Method: <strong>${order.paymentMethod || order.payment_method || 'Prepaid'}</strong></div>
                <div>Status: <strong style="text-transform: uppercase; color: #2B6CB0;">${order.status || 'Confirmed'}</strong></div>
                <div>Courier: Isai Royal Express Delivery</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th style="width: 40px; text-align: center;">#</th>
                  <th style="text-align: left;">Saree Description</th>
                  <th style="width: 70px; text-align: center;">Qty</th>
                  <th style="width: 120px; text-align: right;">Price</th>
                  <th style="width: 130px; text-align: right;">Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsRowsHTML}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="4" style="padding: 12px; text-align: right; font-weight: 600;">Grand Total:</td>
                  <td style="padding: 12px; text-align: right; font-size: 16px; font-weight: 700; color: #C86A27;">₹${totalAmount.toLocaleString('en-IN')}</td>
                </tr>
              </tfoot>
            </table>

            <div style="margin-top: 40px; text-align: center; border-top: 1px solid #E2E8F0; padding-top: 20px; font-size: 12px; color: #718096;">
              Thank you for weaving tradition into your life with Isaitarang.
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
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
        {orders.map((order, idx) => {
          const orderId = order.id || order.order_id || `ORD-${idx + 1}`;
          const formattedDate = new Date(order.created_at || Date.now()).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });

          let badgeVariant = 'warning';
          const normStatus = (order.status || 'pending').toLowerCase();
          if (normStatus === 'shipped') badgeVariant = 'gold';
          if (normStatus === 'delivered' || normStatus === 'paid') badgeVariant = 'success';
          if (normStatus === 'cancelled' || normStatus === 'failed') badgeVariant = 'danger';

          const isCancelable = ['pending', 'paid', 'confirmed'].includes(normStatus);
          const items = Array.isArray(order.items) ? order.items : [];
          const addr = order.shippingAddress || order.shipping_address || {};
          const totalAmount = Number(order.totalAmount || order.total_amount || order.total || 0);
          const subtotal = Number(order.subtotal || totalAmount);
          const discount = Number(order.discount || 0);
          const shippingFee = Number(order.shippingFee || order.shipping_fee || 0);
          const codFee = Number(order.codFee || order.cod_fee || 0);

          return (
            <motion.div
              key={orderId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.04 }}
              className="bg-[#1E130F] border border-[#35221B] rounded-2xl overflow-hidden shadow-2xl hover:border-[#DFC18A]/30 transition-all duration-300"
            >
              {/* ── 1. ORDER TOP BAR ── */}
              <div className="px-5 py-4 flex flex-wrap justify-between items-center gap-3 border-b border-[#2C1C16] bg-[#160E0B]">
                <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs">
                  {/* Order ID */}
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-[#8E7B6F] tracking-widest">
                      Order ID
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyId(orderId)}
                      className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-[#DFC18A] hover:text-[#F4E7CC] transition-colors"
                      title="Click to copy Order ID"
                    >
                      <span>{orderId}</span>
                      {copiedId === orderId ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3 text-[#8E7B6F]" />
                      )}
                    </button>
                  </div>

                  {/* Date */}
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-[#8E7B6F] tracking-widest">
                      Date &amp; Time
                    </span>
                    <span className="text-[#C7B5A7] flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#8E7B6F]" />
                      {formattedDate}
                    </span>
                  </div>

                  {/* Payment Mode */}
                  <div>
                    <span className="block text-[9px] uppercase font-bold text-[#8E7B6F] tracking-widest">
                      Payment Mode
                    </span>
                    <span className="text-[#FDF8F4] font-medium flex items-center gap-1">
                      <CreditCard className="w-3 h-3 text-[#DFC18A]" />
                      {order.paymentMethod || order.payment_method || 'Prepaid'}
                    </span>
                  </div>
                </div>

                {/* Status Badge + Cancel Button */}
                <div className="flex items-center gap-3">
                  <Badge text={order.status || 'Confirmed'} variant={badgeVariant} />
                  {isCancelable && (
                    <button
                      type="button"
                      onClick={() => handleCancel(orderId)}
                      disabled={cancellingId === orderId}
                      className="text-xs text-red-400 hover:text-red-300 underline font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-40"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{cancellingId === orderId ? 'Cancelling...' : 'Cancel'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* ── 2. PURCHASED PRODUCTS LIST (FULL DETAILS & VISIBLE) ── */}
              <div className="divide-y divide-[#2C1C16] px-5 sm:px-6">
                {items.length === 0 ? (
                  <div className="py-6 text-center text-xs text-[#8E7B6F] italic">
                    Ordered item details recorded with order confirmation.
                  </div>
                ) : (
                  items.map((rawItem, i) => {
                    const item = getItemDetails(rawItem);
                    return (
                      <div
                        key={i}
                        className="py-4 sm:py-5 flex flex-col sm:flex-row gap-4 sm:gap-5 sm:items-center justify-between"
                      >
                        {/* Image + Info */}
                        <div className="flex gap-4 items-center min-w-0">
                          {/* Saree Thumbnail */}
                          <div className="relative w-16 sm:w-20 aspect-[3/4] rounded-xl overflow-hidden bg-[#160E0B] border border-[#35221B] shrink-0 shadow-md">
                            <img
                              src={item.img}
                              alt={item.name}
                              className="w-full h-full object-cover object-center"
                              loading="lazy"
                            />
                          </div>

                          {/* Saree Meta */}
                          <div className="space-y-1 min-w-0 flex-1">
                            <span className="inline-block text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#160E0B] text-[#DFC18A] border border-[#35221B]">
                              {item.category}
                            </span>
                            <h4 className="text-sm sm:text-base font-semibold text-[#FDF8F4] truncate">
                              {item.name}
                            </h4>
                            <p className="text-xs text-[#8E7B6F] font-light">
                              {item.size}
                            </p>
                            <div className="text-xs text-[#C7B5A7] sm:hidden pt-0.5">
                              Qty: <span className="font-semibold text-[#FDF8F4]">{item.qty}</span>
                              {' · '}
                              Price: <span className="text-[#DFC18A] font-semibold">₹{item.unitPrice.toLocaleString('en-IN')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Price Breakdown + Link */}
                        <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#2C1C16]">
                          <div className="hidden sm:block text-right text-xs">
                            <span className="text-[#8E7B6F] block text-[10px] uppercase">
                              Unit Price × Qty
                            </span>
                            <span className="text-[#C7B5A7]">
                              ₹{item.unitPrice.toLocaleString('en-IN')} × {item.qty}
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-[#8E7B6F] block text-[10px] uppercase">
                              Item Total
                            </span>
                            <span className="text-base sm:text-lg font-bold text-[#DFC18A]">
                              ₹{item.lineTotal.toLocaleString('en-IN')}
                            </span>
                          </div>

                          {item.id && (
                            <Link
                              to={`/products/${item.id}`}
                              className="p-2 rounded-xl bg-[#160E0B] border border-[#35221B] text-[#DFC18A] hover:bg-[#DFC18A]/10 transition-colors"
                              title="View Saree Details"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* ── 3. FULL ORDER DETAILS SUMMARY (SHIPPING & PRICING) ── */}
              <div className="bg-[#180E0B] border-t border-[#2C1C16] p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Delivery Information */}
                <div className="space-y-3">
                  <h5 className="text-[11px] uppercase font-bold text-[#DFC18A] tracking-wider flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-[#DFC18A]" />
                    Delivery Address
                  </h5>

                  <div className="space-y-1 text-xs text-[#C7B5A7] bg-[#140C0A] p-3.5 rounded-xl border border-[#2D1B15]">
                    <div className="font-semibold text-[#FDF8F4] text-sm">
                      {addr.name || 'Customer'}
                    </div>
                    {addr.phone && (
                      <div className="flex items-center gap-1.5 text-[#8E7B6F]">
                        <Phone className="w-3 h-3 text-[#DFC18A]" />
                        <span>{addr.phone}</span>
                      </div>
                    )}
                    {addr.email && (
                      <div className="flex items-center gap-1.5 text-[#8E7B6F]">
                        <Mail className="w-3 h-3 text-[#DFC18A]" />
                        <span>{addr.email}</span>
                      </div>
                    )}
                    <div className="flex items-start gap-1.5 pt-1 text-[#C7B5A7]">
                      <MapPin className="w-3 h-3 text-[#DFC18A] shrink-0 mt-0.5" />
                      <span>
                        {[
                          addr.addressLine1 || addr.street,
                          addr.addressLine2,
                          addr.city,
                          addr.state,
                          addr.pincode,
                        ]
                          .filter(Boolean)
                          .join(', ') || 'Address recorded with order.'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="space-y-3">
                  <h5 className="text-[11px] uppercase font-bold text-[#DFC18A] tracking-wider flex items-center gap-1.5">
                    <ShoppingBag className="w-3.5 h-3.5 text-[#DFC18A]" />
                    Payment &amp; Cost Breakdown
                  </h5>

                  <div className="space-y-2 text-xs bg-[#140C0A] p-3.5 rounded-xl border border-[#2D1B15]">
                    <div className="flex justify-between text-[#C7B5A7]">
                      <span>Subtotal</span>
                      <span className="font-medium text-[#FDF8F4]">
                        ₹{subtotal.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between text-green-400">
                        <span>Coupon Discount</span>
                        <span>-₹{discount.toLocaleString('en-IN')}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-[#C7B5A7]">
                      <span>Delivery / Shipping</span>
                      <span>
                        {shippingFee === 0 ? (
                          <span className="text-green-400 font-semibold uppercase text-[10px]">
                            Free Delivery
                          </span>
                        ) : (
                          `₹${shippingFee}`
                        )}
                      </span>
                    </div>

                    {codFee > 0 && (
                      <div className="flex justify-between text-[#C7B5A7]">
                        <span>Cash on Delivery Handling</span>
                        <span>₹{codFee}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-sm font-bold text-[#FDF8F4] border-t border-[#2C1C16] pt-2 mt-1">
                      <span className="uppercase text-xs tracking-wider">Total Paid</span>
                      <span className="text-base sm:text-lg text-[#DFC18A] font-bold">
                        ₹{totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── 4. FOOTER ACTIONS (PRINT INVOICE & SUPPORT) ── */}
              <div className="px-5 py-3.5 bg-[#140C0A] border-t border-[#2C1C16] flex flex-wrap justify-between items-center gap-3">
                <div className="flex items-center gap-2 text-xs text-[#8E7B6F]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#DFC18A]" />
                  <span>Certified Pure Silk Mark Guarantee Included</span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handlePrintInvoice(order)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#DFC18A]/40 bg-[#1E130F] hover:bg-[#DFC18A]/10 text-[#DFC18A] text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                    title="Download and print official tax invoice"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Invoice</span>
                  </button>

                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-1 text-xs text-[#8E7B6F] hover:text-[#DFC18A] transition-colors"
                  >
                    <span>Support</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

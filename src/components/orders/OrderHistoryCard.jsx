import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Badge from '../reusable/Badge';
import {
  Clock,
  CreditCard,
  XCircle,
  Copy,
  Check,
  ExternalLink,
  Truck,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  CheckCircle2,
  Printer,
} from 'lucide-react';
import { getItemDetails } from '../../utils/orderHelpers';

export default function OrderHistoryCard({
  order,
  idx,
  copiedId,
  handleCopyId,
  cancellingId,
  handleCancel,
  handlePrintInvoice,
}) {
  const orderId = order.id || order.order_id || `ORD-${idx + 1}`;
  const formattedDate = new Date(order.created_at || Date.now()).toLocaleDateString(
    'en-IN',
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }
  );

  let badgeVariant = 'warning';
  const normStatus = (order.status || 'pending').toLowerCase();
  if (normStatus === 'shipped') badgeVariant = 'gold';
  if (normStatus === 'delivered' || normStatus === 'paid') badgeVariant = 'success';
  if (normStatus === 'cancelled' || normStatus === 'failed') badgeVariant = 'danger';

  const isCancelable = ['pending', 'paid', 'confirmed'].includes(normStatus);
  const items = Array.isArray(order.items) ? order.items : [];
  const addr = order.shippingAddress || order.shipping_address || {};
  const totalAmount = Number(
    order.totalAmount || order.total_amount || order.total || 0
  );
  const subtotal = Number(order.subtotal || totalAmount);
  const discount = Number(order.discount || 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: idx * 0.04 }}
      className="bg-[#1E130F] border border-[#35221B] rounded-2xl overflow-hidden shadow-2xl hover:border-[#DFC18A]/30 transition-all duration-300"
    >
      {/* 1. Order Top Bar */}
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

      {/* 2. Purchased Products List */}
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
                  <div className="relative w-16 sm:w-20 aspect-[3/4] rounded-xl overflow-hidden bg-[#160E0B] border border-[#35221B] shrink-0 shadow-md">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center"
                      loading="lazy"
                    />
                  </div>

                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="inline-block text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-[#160E0B] text-[#DFC18A] border border-[#35221B]">
                      {item.category || 'Pure Silk'}
                    </span>
                    <h4 className="text-sm sm:text-base font-semibold text-[#FDF8F4] truncate">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[#8E7B6F] font-light">{item.size}</p>
                    <div className="text-xs text-[#C7B5A7] sm:hidden pt-0.5">
                      Qty:{' '}
                      <span className="font-semibold text-[#FDF8F4]">
                        {item.qty}
                      </span>
                      {' · '}
                      Price:{' '}
                      <span className="text-[#DFC18A] font-semibold">
                        ₹{item.price.toLocaleString('en-IN')}
                      </span>
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
                      ₹{item.price.toLocaleString('en-IN')} × {item.qty}
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

      {/* 3. Full Order Details Summary */}
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

            <div className="flex justify-between items-center text-sm font-bold text-[#FDF8F4] border-t border-[#2C1C16] pt-2 mt-1">
              <span className="uppercase text-xs tracking-wider">Total Paid</span>
              <span className="text-base sm:text-lg text-[#DFC18A] font-bold">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Footer Actions */}
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
}


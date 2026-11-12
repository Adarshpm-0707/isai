import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Search,
  ChevronRight,
  Check,
  Clock,
  Eye,
  Trash2,
} from 'lucide-react';
import { getItemDetails } from '../../../utils/orderHelpers';

const STATUS_FILTERS = ['ALL', 'PENDING', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

export default function RecentOrdersSection({
  filteredRecentOrders,
  orderSearchQuery,
  setOrderSearchQuery,
  orderStatusFilter,
  setOrderStatusFilter,
  handleUpdateOrderStatus,
  handleDeleteOrder,
  recentOrdersCount,
}) {
  return (
    <section className="animate-container-in bg-[#0F131C] border border-[#D4AF37]/35 rounded-2xl p-4 sm:p-6 lg:p-7 shadow-xl space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#D4AF37]/20">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-sans text-base sm:text-lg lg:text-xl font-bold text-[#FFFFFF]">
              Recent Customer Orders &amp; Fulfillments
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#161B26] text-[#D4AF37] border border-[#D4AF37]/40">
              {recentOrdersCount} Recent
            </span>
          </div>
          <p className="text-xs text-[#A1A1AA] mt-0.5">
            Full customer checkout records, purchased items, payment methods, and live dispatch switcher
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative flex-1 md:w-64 lg:w-72">
            <Search className="w-4 h-4 text-[#D4AF37] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by order ID, saree or customer..."
              value={orderSearchQuery}
              onChange={(e) => setOrderSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#090B10] border border-[#D4AF37]/40 text-xs text-[#FFFFFF] placeholder-[#A1A1AA]/50 focus:outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>

          <Link
            to="/admin/orders"
            className="inline-flex items-center gap-1 px-3 sm:px-3.5 py-2 rounded-xl bg-[#161B26] border border-[#D4AF37]/40 text-xs font-bold text-[#D4AF37] hover:bg-[#1E2534] hover:text-[#FFFFFF] transition-all shrink-0"
          >
            <span>All Orders</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {STATUS_FILTERS.map((st) => (
          <button
            key={st}
            onClick={() => setOrderStatusFilter(st)}
            className={`px-3 sm:px-3.5 py-1.5 rounded-lg transition-all text-[11px] sm:text-xs font-bold uppercase tracking-wider cursor-pointer whitespace-nowrap shrink-0 ${
              orderStatusFilter === st
                ? 'bg-[#D4AF37] text-[#090B10] shadow-md'
                : 'bg-[#161B26] text-[#D1D5DB] hover:text-[#FFFFFF] hover:bg-[#1E2534]'
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Orders Table Container */}
      <div className="overflow-x-auto rounded-xl border border-[#D4AF37]/25">
        {filteredRecentOrders.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <ShoppingBag className="w-8 h-8 text-[#D4AF37]/40 mx-auto" />
            <p className="text-xs text-[#A1A1AA] italic">
              No orders found matching your search.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-[#D4AF37]/25 text-[#D4AF37] uppercase font-bold tracking-wider bg-[#090B10]">
                <th className="py-3 px-3 sm:px-4">Order ID</th>
                <th className="py-3 px-3 sm:px-4">Customer &amp; Contact</th>
                <th className="py-3 px-3 sm:px-4 min-w-[200px] sm:min-w-[240px]">Purchased Saree(s)</th>
                <th className="py-3 px-3 sm:px-4">Date</th>
                <th className="py-3 px-3 sm:px-4">Payment</th>
                <th className="py-3 px-3 sm:px-4">Total Amount</th>
                <th className="py-3 px-3 sm:px-4">Fulfillment Status</th>
                <th className="py-3 px-3 sm:px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/15">
              {filteredRecentOrders.map((ord) => {
                const items = Array.isArray(ord.items) ? ord.items : [];
                const firstItem = items.length > 0 ? getItemDetails(items[0]) : null;
                const custName =
                  ord.shipping_address?.name ||
                  ord.customer_name ||
                  ord.profiles?.name ||
                  'Customer';
                const custPhone =
                  ord.shipping_address?.phone ||
                  ord.customer_phone ||
                  ord.profiles?.phone ||
                  '';

                const isPaid =
                  ord.status === 'paid' || ord.payment_details?.status === 'captured';

                return (
                  <tr key={ord.id || ord.order_id || Math.random()} className="hover:bg-[#161B26] transition-colors">
                    {/* Order ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#FFFFFF] align-top">
                      #{ord.order_id || String(ord.id || '').slice(0, 10)}
                    </td>

                    {/* Customer & Phone */}
                    <td className="py-3.5 px-4 font-medium text-[#FFFFFF] align-top">
                      <div>
                        <p className="font-bold text-[#FFFFFF]">{custName}</p>
                        {custPhone && (
                          <p className="text-[11px] text-[#A1A1AA] font-mono mt-0.5">
                            {custPhone}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Purchased Saree */}
                    <td className="py-3.5 px-4 align-top">
                      {firstItem ? (
                        <div className="flex items-start gap-3">
                          <img
                            src={firstItem.image}
                            alt={firstItem.name}
                            className="w-11 h-11 object-cover rounded-lg border border-[#D4AF37]/40 bg-[#161B26] shrink-0"
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600';
                            }}
                          />
                          <div className="space-y-0.5">
                            <p className="font-bold text-[#FFFFFF] leading-snug break-words">
                              {firstItem.name}
                            </p>
                            <p className="text-[11px] text-[#D1D5DB]">
                              Qty: <strong className="text-[#FFFFFF]">{firstItem.qty}</strong> &times; ₹{firstItem.price.toLocaleString('en-IN')}
                            </p>
                            {items.length > 1 && (
                              <p className="text-[10px] text-[#D4AF37] font-bold">
                                + {items.length - 1} additional items in this order
                              </p>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[#A1A1AA] italic">Handcrafted Silk Saree</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="py-3.5 px-4 text-[#A1A1AA] font-mono text-xs align-top whitespace-nowrap">
                      {new Date(ord.created_at || Date.now()).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Payment */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="space-y-1">
                        <span className="block text-[11px] font-bold uppercase text-[#FFFFFF]">
                          {ord.payment_method === 'cod' || ord.payment_method === 'COD'
                            ? 'Cash on Delivery'
                            : 'Online Payment'}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            isPaid
                              ? 'bg-blue-950/80 text-blue-300 border border-blue-500/40'
                              : 'bg-amber-950/80 text-amber-300 border border-amber-500/40'
                          }`}
                        >
                          {isPaid ? <Check className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                          {isPaid ? 'Paid' : 'Payment Pending'}
                        </span>
                      </div>
                    </td>

                    {/* Total Amount */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#D4AF37] text-sm align-top whitespace-nowrap">
                      <div>
                        <span>₹{Number(ord.total || ord.total_amount || 0).toLocaleString('en-IN')}</span>
                        {(Number(ord.discount || ord.discount_amount || 0) > 0 || ord.coupon_code) && (
                          <p className="text-[10px] text-emerald-400 font-sans font-normal mt-0.5 flex items-center gap-1">
                            <span className="font-mono bg-emerald-950/80 px-1 py-0.2 rounded border border-emerald-500/30">
                              {ord.coupon_code || 'COUPON'}
                            </span>
                            <span>(-₹{Number(ord.discount || ord.discount_amount || 0).toLocaleString('en-IN')})</span>
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Fulfillment Switcher */}
                    <td className="py-3.5 px-4 align-top">
                      <select
                        value={ord.status || 'pending'}
                        onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                        className="bg-[#161B26] border border-[#D4AF37]/50 rounded-lg px-2.5 py-1.5 text-xs text-[#FFFFFF] cursor-pointer focus:outline-none focus:border-[#D4AF37] font-bold uppercase"
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

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right align-top">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <Link
                          to="/admin/orders"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#161B26] text-[#FFFFFF] border border-[#D4AF37]/40 hover:bg-[#D4AF37] hover:text-[#090B10] transition-all text-xs font-bold uppercase tracking-wider"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>
                        <button
                          onClick={() => handleDeleteOrder(ord)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-red-950 text-red-200 border border-red-500/50 hover:bg-red-800 hover:text-white transition-all text-xs font-bold uppercase tracking-wider cursor-pointer"
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
  );
}


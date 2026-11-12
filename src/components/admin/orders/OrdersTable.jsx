import React from 'react';
import Badge from '../../reusable/Badge';
import { Eye, Trash2, Printer, RefreshCw } from 'lucide-react';
import { getItemDetails } from '../../../utils/orderHelpers';

export default function OrdersTable({
  filteredOrders = [],
  loading = false,
  activeTab = 'all',
  searchQuery = '',
  handleOpenModal,
  handleDeleteOrder,
  handleQuickStatusChange,
  handlePrintInvoice,
}) {
  return (
    <div className="bg-[#0F131C] border border-[#D4AF37]/35 rounded-2xl shadow-2xl overflow-hidden text-[#F5E6BE]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-sans">
          <thead>
            <tr className="border-b border-[#D4AF37]/25 text-[#D4AF37] font-bold uppercase tracking-wider bg-[#0A0D14]">
              <th className="py-3.5 sm:py-4 px-3 sm:px-4 lg:px-6">Order ID</th>
              <th className="py-3.5 sm:py-4 px-3 sm:px-4 lg:px-6">Customer</th>
              <th className="py-3.5 sm:py-4 px-3 sm:px-4 lg:px-6">Date</th>
              <th className="py-3.5 sm:py-4 px-3 sm:px-4 lg:px-6 min-w-[180px] sm:min-w-[200px]">Items Purchased</th>
              <th className="py-3.5 sm:py-4 px-3 sm:px-4 lg:px-6">Total Amount</th>
              <th className="py-3.5 sm:py-4 px-3 sm:px-4 lg:px-6">Payment Method</th>
              <th className="py-3.5 sm:py-4 px-3 sm:px-4 lg:px-6">Status</th>
              <th className="py-3.5 sm:py-4 px-3 sm:px-4 lg:px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#D4AF37]/15">
            {loading && filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-[#D4AF37]">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#D4AF37]" />
                    <span className="text-xs font-semibold text-[#A1A1AA]">Loading order records...</span>
                  </div>
                </td>
              </tr>
            ) : filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-[#A1A1AA] italic">
                  No orders matching filter: <strong>"{activeTab}"</strong>{' '}
                  {searchQuery && `with search "${searchQuery}"`}
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
                  order.customer_name ||
                  order.shipping_address?.name ||
                  order.profiles?.name ||
                  'Customer';

                return (
                  <tr key={order.id || order.order_id || Math.random()} className="hover:bg-[#161B26]/60 transition-colors">
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 lg:px-6 font-mono font-bold text-[#FFFFFF] whitespace-nowrap">
                      {order.order_id || String(order.id || '').slice(0, 12)}
                    </td>
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 lg:px-6 font-semibold text-[#FFFFFF] max-w-[140px] truncate">{custName}</td>
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 lg:px-6 text-[#A1A1AA] whitespace-nowrap">
                      {new Date(order.created_at || Date.now()).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 lg:px-6">
                      <div className="space-y-1">
                        {items.slice(0, 2).map((raw, i) => {
                          const item = getItemDetails(raw);
                          return (
                            <div key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] shrink-0" />
                              <span className="truncate max-w-[150px] sm:max-w-[170px] text-[#FFFFFF] font-medium" title={item.name}>
                                {item.name}
                              </span>
                              <span className="text-[10px] text-[#A1A1AA] font-bold shrink-0">
                                (x{item.qty})
                              </span>
                            </div>
                          );
                        })}
                        {items.length > 2 && (
                          <span className="text-[10px] text-[#D4AF37] font-semibold italic">
                            +{items.length - 2} more item(s)
                          </span>
                        )}
                        {items.length === 0 && (
                          <span className="text-[11px] text-[#A1A1AA] italic">
                            1x Handloom Saree
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 lg:px-6 font-bold text-[#DFC18A] whitespace-nowrap">
                      <div>
                        <span>₹{Number(order.total || order.total_amount || 0).toLocaleString('en-IN')}</span>
                        {(Number(order.discount || order.discount_amount || 0) > 0 || order.coupon_code) && (
                          <div className="text-[10px] text-emerald-400 font-normal flex items-center gap-1 mt-0.5">
                            <span className="font-mono bg-emerald-950/80 px-1 py-0.2 rounded border border-emerald-500/30">
                              {order.coupon_code || 'COUPON'}
                            </span>
                            <span>(-₹{Number(order.discount || order.discount_amount || 0).toLocaleString('en-IN')})</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 lg:px-6 uppercase font-bold text-[10px] text-[#A1A1AA] whitespace-nowrap">
                      {order.payment_method === 'cod' || order.payment_method === 'COD'
                        ? 'Cash on Delivery'
                        : 'Prepaid Online'}
                    </td>
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 lg:px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status || 'pending'}
                          onChange={(e) =>
                            handleQuickStatusChange
                              ? handleQuickStatusChange(order, e.target.value)
                              : null
                          }
                          className="bg-[#0A0D14] border border-[#D4AF37]/40 rounded-lg px-2 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-[11px] font-bold uppercase cursor-pointer text-[#FFFFFF] focus:outline-none focus:border-[#D4AF37]"
                          title="Change fulfillment status directly"
                        >
                          <option value="pending">PENDING</option>
                          <option value="paid">PAID</option>
                          <option value="confirmed">CONFIRMED</option>
                          <option value="processing">PROCESSING</option>
                          <option value="shipped">SHIPPED</option>
                          <option value="delivered">DELIVERED</option>
                          <option value="cancelled">CANCELLED</option>
                        </select>
                        <Badge text={order.status || 'pending'} variant={badgeVariant} />
                      </div>
                    </td>
                    <td className="py-3.5 sm:py-4 px-3 sm:px-4 lg:px-6 text-right space-x-1 sm:space-x-1.5 whitespace-nowrap">
                      {handlePrintInvoice && (
                        <button
                          onClick={() => handlePrintInvoice(order)}
                          className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1.5 bg-[#161B26] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#090B10] border border-[#D4AF37]/35 transition-all rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm"
                          title="Print / Download Official Invoice PDF"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Invoice</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenModal(order)}
                        className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-[#161B26] text-[#FFFFFF] hover:bg-[#D4AF37] hover:text-[#090B10] border border-[#D4AF37]/35 transition-all rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm"
                        title="View Full Order Details, Items & Edit Status"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Manage</span>
                      </button>

                      <button
                        onClick={() => handleDeleteOrder(order)}
                        className="inline-flex items-center gap-1 px-2 sm:px-3 py-1.5 bg-red-950/60 text-red-300 hover:bg-red-900 border border-red-500/40 transition-all rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer shadow-sm"
                        title="Delete Order Record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Delete</span>
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
  );
}

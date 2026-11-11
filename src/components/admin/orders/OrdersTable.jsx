import React from 'react';
import Badge from '../../reusable/Badge';
import { Eye, Trash2 } from 'lucide-react';
import { getItemDetails } from '../../../utils/orderHelpers';

export default function OrdersTable({
  filteredOrders = [],
  loading = false,
  activeTab = 'all',
  searchQuery = '',
  handleOpenModal,
  handleDeleteOrder,
}) {
  return (
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
                      {items.length === 0 ? (
                        <span className="text-[#EADFC9]/60 italic">
                          Handcrafted Heritage Saree
                        </span>
                      ) : (
                        <div className="flex items-center gap-3">
                          {(() => {
                            const firstItem = getItemDetails(items[0]);
                            return (
                              <>
                                <img
                                  src={firstItem.image}
                                  alt={firstItem.name}
                                  className="w-10 h-10 object-cover rounded-lg border border-[#D4AF37]/35 bg-[#1A3C2B] shrink-0"
                                  onError={(e) => {
                                    e.currentTarget.src =
                                      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600';
                                  }}
                                />
                                <div className="min-w-0">
                                  <p
                                    className="font-semibold text-[#F3E5AB] truncate max-w-[170px]"
                                    title={firstItem.name}
                                  >
                                    {firstItem.name}
                                  </p>
                                  <p className="text-[10px] text-[#EADFC9]/80 flex items-center gap-1.5 mt-0.5">
                                    <span className="font-bold text-[#F3E5AB]">
                                      {firstItem.qty} &times; ₹
                                      {firstItem.price.toLocaleString('en-IN')}
                                    </span>
                                    {items.length > 1 && (
                                      <span className="text-[#DFC18A] font-bold">
                                        +{items.length - 1} more
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 font-bold text-[#F3E5AB]">
                      ₹
                      {Number(order.total || order.total_amount || 0).toLocaleString(
                        'en-IN'
                      )}
                    </td>
                    <td className="py-4 px-6 uppercase text-[10px] font-bold text-[#EADFC9]">
                      {order.payment_method || 'COD'}
                    </td>
                    <td className="py-4 px-6">
                      <Badge text={order.status || 'pending'} variant={badgeVariant} />
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider bg-[#1A3C2B] text-[#F3E5AB] border border-[#D4AF37]/35 hover:bg-[#D4AF37] hover:text-[#0C2317] transition-all cursor-pointer shadow-md"
                        title="View Order Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(order)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg font-bold text-[10px] uppercase tracking-wider bg-red-950/60 text-red-300 hover:bg-red-900 hover:text-white border border-red-500/40 transition-all cursor-pointer shadow-md"
                        title="Delete Order"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
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

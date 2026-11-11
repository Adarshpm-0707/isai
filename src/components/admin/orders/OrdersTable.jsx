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
    <div className="bg-[#0F131C] border border-[#D4AF37]/35 rounded-2xl shadow-2xl overflow-hidden text-[#F5E6BE]">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs font-sans">
          <thead>
            <tr className="border-b border-[#D4AF37]/25 text-[#D4AF37] font-bold uppercase tracking-wider bg-[#0A0D14]">
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
                  order.shipping_address?.name || order.profiles?.name || 'Customer';

                return (
                  <tr key={order.id} className="hover:bg-[#161B26]/60 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#FFFFFF]">
                      {order.id?.slice(0, 12) || order.order_id}
                    </td>
                    <td className="py-4 px-6 font-semibold text-[#FFFFFF]">{custName}</td>
                    <td className="py-4 px-6 text-[#A1A1AA]">
                      {new Date(order.created_at || Date.now()).toLocaleDateString('en-IN')}
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        {items.slice(0, 2).map((raw, i) => {
                          const item = getItemDetails(raw);
                          return (
                            <div key={i} className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                              <span className="truncate max-w-[170px] text-[#FFFFFF] font-medium" title={item.name}>
                                {item.name}
                              </span>
                              <span className="text-[10px] text-[#A1A1AA] font-bold">
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
                    <td className="py-4 px-6 font-bold text-[#DFC18A]">
                      ₹{Number(order.total || order.total_amount || 0).toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-6 uppercase font-bold text-[10px] text-[#A1A1AA]">
                      {order.payment_method === 'cod' || order.payment_method === 'COD'
                        ? 'Cash on Delivery'
                        : 'Prepaid Online'}
                    </td>
                    <td className="py-4 px-6">
                      <Badge text={order.status || 'pending'} variant={badgeVariant} />
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#161B26] text-[#FFFFFF] hover:bg-[#D4AF37] hover:text-[#090B10] border border-[#D4AF37]/35 transition-all rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                        title="View Full Order Details, Items & Edit Status"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Manage</span>
                      </button>

                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-950/60 text-red-300 hover:bg-red-900 border border-red-500/40 transition-all rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer"
                        title="Delete Order Record"
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

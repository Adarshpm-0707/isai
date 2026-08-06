import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import SectionHeading from '../components/reusable/SectionHeading';
import EmptyState from '../components/reusable/EmptyState';
import Badge from '../components/reusable/Badge';
import Button from '../components/reusable/Button';
import { orderService } from '../services/orderService';
import { getProductImage } from '../utils/productHelpers';
import { ExternalLink, XCircle } from 'lucide-react';

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await orderService.getUserOrders(user.id);
      setOrders(data || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
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

  if (orders.length === 0 && !loading) {
    return (
      <EmptyState
        title="No Orders Placed Yet"
        message="You haven't ordered any items yet. Start exploring our collections today."
        actionText="Browse Collection"
        actionPath="/products"
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 text-[#D8A55A]">
      <SectionHeading
        title="Order History"
        subtitle="Manage and track your recent orders"
      />

      <div className="space-y-8">
        {orders.map((order) => {
          const formattedDate = new Date(order.created_at).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          let badgeVariant = 'warning';
          if (order.status === 'shipped') badgeVariant = 'gold';
          if (order.status === 'delivered' || order.status === 'paid') badgeVariant = 'success';
          if (order.status === 'cancelled' || order.status === 'failed') badgeVariant = 'danger';

          const isCancelable = ['pending', 'paid', 'confirmed'].includes(order.status);
          const items = Array.isArray(order.items) ? order.items : [];
          const addr = order.shipping_address || {};

          return (
            <div
              key={order.id}
              className="bg-gradient-to-b from-[#2B1409] to-[#3E1B0E] border border-[#D8A55A]/30 shadow-xl rounded-sm overflow-hidden"
            >
              {/* Header */}
              <div className="bg-[#2B1409]/80 border-b border-[#D8A55A]/20 px-6 py-4 flex flex-wrap justify-between items-center gap-4 text-xs font-sans">
                <div className="flex flex-wrap gap-6">
                  <div>
                    <span className="block text-[#D8A55A]/70 uppercase font-bold tracking-wider mb-1">
                      Order Placed
                    </span>
                    <span className="text-[#F6D18A] font-medium">{formattedDate}</span>
                  </div>
                  <div>
                    <span className="block text-[#D8A55A]/70 uppercase font-bold tracking-wider mb-1">
                      Total Payable
                    </span>
                    <span className="text-[#F6D18A] font-bold">
                      ₹{Number(order.total || order.total_amount || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[#D8A55A]/70 uppercase font-bold tracking-wider mb-1">
                      Payment
                    </span>
                    <span className="text-[#F6D18A] uppercase font-bold">
                      {order.payment_method || 'Prepaid'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge text={order.status} variant={badgeVariant} />
                  {isCancelable && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      disabled={cancellingId === order.id}
                      className="text-xs text-red-400 hover:text-red-300 underline font-bold flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      {cancellingId === order.id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-[#D8A55A]/10 px-6">
                {items.map((item, idx) => (
                  <div key={idx} className="py-4 flex gap-4 items-center">
                    <div className="w-12 aspect-[3/4] overflow-hidden bg-[#2B1409] border border-[#D8A55A]/20 flex-shrink-0 rounded">
                      <img
                        src={getProductImage(item)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-playfair text-sm font-bold text-[#F6D18A] truncate">
                        {item.name}
                      </h4>
                      {item.size && (
                        <p className="text-[10px] text-[#D8A55A]/80 font-sans">Size: {item.size}</p>
                      )}
                    </div>
                    <div className="text-right text-xs font-sans">
                      <p className="text-[#F6D18A] font-medium">
                        {item.qty} &times; ₹{Number(item.price || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Address & Tracking Footer */}
              <div className="bg-[#2B1409]/60 px-6 py-3 border-t border-[#D8A55A]/10 flex flex-wrap justify-between items-center text-[11px] text-[#D8A55A]/90 gap-2">
                <div>
                  <strong>Deliver To:</strong> {addr.name || 'Customer'} ({addr.city}, {addr.pincode})
                </div>
                {order.shiprocket_order_id && (
                  <div className="flex items-center gap-1 text-[#F6D18A] font-bold">
                    <span>Tracking ID: {order.shiprocket_order_id}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

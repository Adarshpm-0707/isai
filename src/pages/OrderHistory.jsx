import React, { useState, useEffect } from 'react';
import useAuth from '../hooks/useAuth';
import EmptyState from '../components/reusable/EmptyState';
import Badge from '../components/reusable/Badge';
import { orderService } from '../services/orderService';
import { getProductImage } from '../utils/productHelpers';
import { XCircle, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { FloralOrnament } from '../components/reusable/FloralOrnament';

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
      <div className="min-h-[70vh] bg-[#120B09] flex items-center justify-center p-4">
        <EmptyState
          title="No Orders Yet"
          message="You haven't ordered any sarees yet. Explore our handcrafted collections."
          actionText="Browse Collection"
          actionPath="/products"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#120B09] text-[#FDF8F4] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-8">
      <div className="text-center space-y-1">
        <p className="text-[10px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-[#DFC18A]">
          Purchase History
        </p>
        <h1
          className="font-serif text-3xl sm:text-4xl text-[#FDF8F4]"
          style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
        >
          My Orders
        </h1>
        <FloralOrnament className="mt-1" />
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {orders.map((order, idx) => {
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
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-[#1E130F] border border-[#35221B] rounded-2xl overflow-hidden shadow-xl"
            >
              {/* Header */}
              <div className="px-5 py-4 flex flex-wrap justify-between items-center gap-3 text-xs border-b border-[#2C1C16] bg-[#160E0B]">
                <div className="flex flex-wrap gap-5 text-[#C7B5A7]">
                  <div>
                    <span className="block text-[#8E7B6F] uppercase font-bold text-[10px]">
                      Date Placed
                    </span>
                    <span className="text-[#FDF8F4]">{formattedDate}</span>
                  </div>
                  <div>
                    <span className="block text-[#8E7B6F] uppercase font-bold text-[10px]">
                      Total
                    </span>
                    <span className="text-[#DFC18A] font-semibold">
                      ₹{Number(order.total || order.total_amount || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[#8E7B6F] uppercase font-bold text-[10px]">
                      Payment Mode
                    </span>
                    <span className="text-[#FDF8F4]">{order.payment_method || 'Prepaid'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge text={order.status} variant={badgeVariant} />
                  {isCancelable && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      disabled={cancellingId === order.id}
                      className="text-xs text-red-400 hover:text-red-300 underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>{cancellingId === order.id ? 'Cancelling...' : 'Cancel'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Items List */}
              <div className="divide-y divide-[#2C1C16] px-5">
                {items.map((item, i) => (
                  <div key={i} className="py-4 flex gap-4 items-center">
                    <div className="w-12 aspect-[3/4] rounded-lg overflow-hidden bg-[#160E0B] border border-[#35221B] shrink-0">
                      <img
                        src={getProductImage(item)}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-[#FDF8F4] truncate">
                        {item.name}
                      </h4>
                      {item.size && (
                        <p className="text-xs text-[#8E7B6F] mt-0.5">Size: {item.size}</p>
                      )}
                    </div>
                    <div className="text-right text-xs">
                      <p className="text-[#DFC18A] font-medium">
                        {item.qty} × ₹{Number(item.price || 0).toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-5 py-3 text-xs bg-[#160E0B] border-t border-[#2C1C16] text-[#8E7B6F] flex flex-wrap justify-between items-center gap-2">
                <div>
                  <span className="text-[#C7B5A7]">Ship to:</span> {addr.name || 'Customer'} (
                  {addr.city}, {addr.pincode})
                </div>
                {order.shiprocket_order_id && (
                  <div className="text-[#DFC18A] font-semibold">
                    Tracking ID: {order.shiprocket_order_id}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

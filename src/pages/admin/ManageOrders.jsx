import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import SectionHeading from '../../components/reusable/SectionHeading';
import Loader from '../../components/reusable/Loader';
import Badge from '../../components/reusable/Badge';

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        // select profiles(email) to display who placed it
        .select('*, profiles(email), order_items(*, product:products(*))')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch orders failed in admin, using mock data:', error.message);
        setOrders(getMockOrders());
      } else if (data && data.length > 0) {
        setOrders(data);
      } else {
        // If DB has no orders, fallback to mock data
        setOrders(getMockOrders());
      }
    } catch (err) {
      console.error('Failed to query orders:', err);
      setOrders(getMockOrders());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Check if it is a mock order (contains 'mock-' prefix)
      if (String(orderId).startsWith('mock-')) {
        setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        setFeedback(`Order status updated to ${newStatus} (Sandbox state).`);
        setTimeout(() => setFeedback(null), 3000);
        return;
      }

      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
      setFeedback(`Order status updated to ${newStatus} successfully.`);
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update order status: ' + err.message);
    }
  };

  const getMockOrders = () => [
    {
      id: 'mock-order-101',
      created_at: '2026-07-01T10:15:00Z',
      total_amount: 18500,
      status: 'pending',
      profiles: { email: 'customer1@example.com' },
      order_items: [
        {
          id: 'mock-item-1',
          qty: 1,
          price: 18500,
          product: { name: 'Varanasi Gold Zari Banarasi Saree', images: ['https://images.unsplash.com/photo-1610030470258-a4005cfa2c5a?auto=format&fit=crop&q=80&w=100'] }
        }
      ]
    },
    {
      id: 'mock-order-102',
      created_at: '2026-06-28T14:30:00Z',
      total_amount: 31200,
      status: 'delivered',
      profiles: { email: 'buyer2@example.com' },
      order_items: [
        {
          id: 'mock-item-2',
          qty: 1,
          price: 24000,
          product: { name: 'Crimson Royal Kanchipuram Saree', images: ['https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=100'] }
        },
        {
          id: 'mock-item-3',
          qty: 1,
          price: 7200,
          product: { name: 'Blush Pink Embroidered Organza Saree', images: ['https://images.unsplash.com/photo-1583391265517-35bbdba01229?auto=format&fit=crop&q=80&w=100'] }
        }
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      <SectionHeading
        title="Fulfillments Board"
        subtitle="Manage customer purchases, dispatch statuses, and order shipments"
        align="left"
      />

      {feedback && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-sm font-sans text-xs">
          {feedback}
        </div>
      )}

      {/* Orders Grid/Table list */}
      <div className="bg-white border border-gold/15 rounded-sm shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-gold/10 text-gray-400 font-bold uppercase tracking-wider bg-ivory/20">
                <th className="py-4 px-6">Order ID</th>
                <th className="py-4 px-6">Customer</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Items Purchased</th>
                <th className="py-4 px-6">Total Amount</th>
                <th className="py-4 px-6">Fulfillment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/5">
              {orders.map((order) => {
                const orderDate = new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });

                let badgeVariant = 'warning';
                if (order.status === 'shipped') badgeVariant = 'gold';
                if (order.status === 'delivered') badgeVariant = 'success';
                if (order.status === 'cancelled') badgeVariant = 'danger';

                return (
                  <tr key={order.id} className="hover:bg-ivory/10">
                    {/* Order ID */}
                    <td className="py-4 px-6 font-mono font-medium text-gray-800">
                      {order.id}
                    </td>

                    {/* Email */}
                    <td className="py-4 px-6 font-medium text-gray-600 truncate max-w-[150px]">
                      {order.profiles?.email || 'Guest Patron'}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 text-gray-500">
                      {orderDate}
                    </td>

                    {/* Items Details summary */}
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        {order.order_items?.map((item) => (
                          <div key={item.id} className="flex items-center gap-1.5 text-gray-700">
                            <span className="font-bold text-maroon">{item.qty} &times;</span>
                            <span className="truncate max-w-[180px]">{item.product?.name || 'Saree'}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total */}
                    <td className="py-4 px-6 font-bold text-maroon">
                      ₹{order.total_amount?.toLocaleString('en-IN') || 0}
                    </td>

                    {/* Status updater */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Badge text={order.status} variant={badgeVariant} />
                        
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          className="bg-transparent border border-maroon/20 hover:border-gold px-1.5 py-1 text-[10px] uppercase font-bold focus:outline-none cursor-pointer"
                        >
                          <option value="pending">Pending</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

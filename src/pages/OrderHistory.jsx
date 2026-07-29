import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import useAuth from '../hooks/useAuth';
import SectionHeading from '../components/reusable/SectionHeading';
import Loader from '../components/reusable/Loader';
import EmptyState from '../components/reusable/EmptyState';
import PriceTag from '../components/reusable/PriceTag';
import Badge from '../components/reusable/Badge';

export default function OrderHistory() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(*, product:products(*))')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.warn('Supabase orders fetch error, using empty state:', error.message);
          setOrders([]);
        } else {
          setOrders(data || []);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  if (orders.length === 0 && !loading) {
    return (
      <EmptyState
        title="No Orders Placed Yet"
        message="You haven't ordered any handcrafted sarees yet. Start building your legacy collection today."
        actionText="Browse Sarees"
        actionPath="/products"
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <SectionHeading
        title="Order History"
        subtitle="Manage and track your custom weavers orders"
      />

      <div className="space-y-8">
        {orders.map((order) => {
          const formattedDate = new Date(order.created_at).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });

          // Order status badge styling
          let badgeVariant = 'warning';
          if (order.status === 'shipped') badgeVariant = 'gold';
          if (order.status === 'delivered') badgeVariant = 'success';
          if (order.status === 'cancelled') badgeVariant = 'danger';

          return (
            <div
              key={order.id}
              className="bg-white border border-gold/15 shadow-sm rounded-sm overflow-hidden"
            >
              {/* Order Header Summary */}
              <div className="bg-ivory/50 border-b border-gold/10 px-6 py-4 flex flex-wrap justify-between items-center gap-4 text-xs font-sans">
                <div className="flex gap-6">
                  <div>
                    <span className="block text-gray-400 uppercase font-bold tracking-wider mb-1">
                      Order Placed
                    </span>
                    <span className="text-gray-800 font-medium">{formattedDate}</span>
                  </div>
                  <div>
                    <span className="block text-gray-400 uppercase font-bold tracking-wider mb-1">
                      Total Payable
                    </span>
                    <span className="text-maroon font-bold">
                      ₹{order.total_amount?.toLocaleString('en-IN') || 0}
                    </span>
                  </div>
                  <div className="hidden sm:block">
                    <span className="block text-gray-400 uppercase font-bold tracking-wider mb-1">
                      Order ID
                    </span>
                    <span className="text-gray-600 font-mono select-all">{order.id}</span>
                  </div>
                </div>

                <div>
                  <Badge text={order.status} variant={badgeVariant} />
                </div>
              </div>

              {/* Order Items */}
              <div className="divide-y divide-gold/10 px-6">
                {order.order_items?.map((item) => {
                  const productDetails = item.product || {
                    name: 'Handcrafted Heritage Saree',
                    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=100'],
                  };

                  return (
                    <div
                      key={item.id}
                      className="py-4 flex gap-4 items-center"
                    >
                      <div className="w-12 aspect-[3/4] overflow-hidden bg-ivory border border-gold/10 flex-shrink-0">
                        <img
                          src={productDetails.images?.[0]}
                          alt={productDetails.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow min-w-0">
                        <h4 className="font-playfair text-sm font-bold text-maroon truncate">
                          {productDetails.name}
                        </h4>
                        <p className="text-[10px] text-gray-400 font-sans mt-0.5">
                          Category: {productDetails.category || 'Traditional'}
                        </p>
                      </div>
                      <div className="text-right text-xs font-sans">
                        <p className="text-gray-800 font-medium">
                          {item.qty} &times; ₹{item.price?.toLocaleString('en-IN') || 0}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
}

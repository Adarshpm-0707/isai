import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import { orderService } from '../services/orderService';
import { ShoppingBag, LogOut, ShieldCheck, ArrowRight } from 'lucide-react';
import BrandLogo from '../components/reusable/BrandLogo';

export default function CustomerProfile() {
  const navigate = useNavigate();
  const { user, profile, logout } = useAuth();

  const name = profile?.name || user?.name || user?.user_metadata?.name || '';
  const email = profile?.email || user?.email || '';
  const phone = profile?.phone || '';
  const address = profile?.address || '';
  const city = profile?.city || '';
  const pincode = profile?.pincode || '';

  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCustomerOrders();
  }, [user]);

  const fetchCustomerOrders = async () => {
    if (!user?.email && !user?.id) return;

    // 1. Immediately read local orders (0 ms)
    try {
      const local = orderService.getLocalOrders();
      const uEmail = user.email ? user.email.toLowerCase().trim() : null;
      const uId = user.id ? String(user.id).toLowerCase().trim() : null;

      const matching = local.filter((o) => {
        const loUserId = o.user_id ? String(o.user_id).toLowerCase().trim() : null;
        const loEmail = (o.customer_email || o.shipping_address?.email || o.profiles?.email || '').toLowerCase().trim();
        const loName = (o.customer_name || o.shipping_address?.name || '').toLowerCase().trim();

        return (
          (uId && loUserId && uId === loUserId) ||
          (uEmail && loEmail && uEmail === loEmail) ||
          (uEmail && loName && uEmail.split('@')[0] === loName) ||
          (!loUserId && !loEmail)
        );
      });

      if (matching.length > 0) {
        setRecentOrders(matching.slice(0, 5));
      }
    } catch {
      // Fallback
    }

    // 2. Fetch from Supabase in background
    try {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .or(`customer_email.eq.${user.email},user_id.eq.${user.id}`)
        .order('created_at', { ascending: false })
        .limit(5);

      if (data && data.length > 0) setRecentOrders(data);
    } catch (err) {
      console.warn('Notice loading customer orders:', err);
    }
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#120B09] text-[#FDF8F4] py-10 sm:py-14 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#2C1C16]">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] font-semibold text-[#DFC18A]">
              My Account
            </p>
            <h1
              className="font-serif text-3xl sm:text-4xl text-[#FDF8F4]"
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
            >
              Customer Profile
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/orders"
              className="px-4 py-2 rounded-full border border-[#35221B] bg-[#1E130F] text-xs font-semibold uppercase tracking-wider text-[#C7B5A7] hover:text-[#DFC18A] hover:border-[#DFC18A] transition-all flex items-center gap-1.5"
            >
              <ShoppingBag className="w-4 h-4 text-[#DFC18A]" /> View Orders
            </Link>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#1E130F] text-red-300 border border-red-500/30 hover:bg-red-950/60 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Badge Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-[#1E130F] border border-[#35221B] p-6 rounded-2xl shadow-xl text-center space-y-4">
              <div className="flex justify-center pb-1">
                <BrandLogo size="sm" />
              </div>

              <div className="w-20 h-20 mx-auto rounded-full bg-[#160E0B] border-2 border-[#DFC18A] flex items-center justify-center text-[#DFC18A] font-serif text-3xl font-bold shadow-xl">
                {(name || email || 'C')[0].toUpperCase()}
              </div>

              <div>
                <h3 className="font-serif text-lg font-semibold text-[#FDF8F4]">{name || 'Valued Patron'}</h3>
                <p className="text-xs text-[#8E7B6F] font-mono mt-0.5">{email}</p>
                <span className="inline-flex items-center gap-1 mt-2.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#160E0B] text-[#4ADE80] border border-[#4ADE80]/30">
                  <ShieldCheck className="w-3 h-3 text-[#4ADE80]" /> Verified Patron
                </span>
              </div>

              <div className="pt-4 border-t border-[#2C1C16] text-left text-xs space-y-2 text-[#C7B5A7]">
                <div className="flex justify-between">
                  <span className="text-[#8E7B6F]">Account Type:</span>
                  <span className="text-[#FDF8F4]">Standard Customer</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#8E7B6F]">Phone:</span>
                  <span className="text-[#FDF8F4]">{phone || 'Not provided'}</span>
                </div>
                {(city || address) && (
                  <div className="flex justify-between">
                    <span className="text-[#8E7B6F]">Location:</span>
                    <span className="text-[#FDF8F4] text-right truncate max-w-[180px]">
                      {[city, pincode].filter(Boolean).join(', ') || address}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-[#1E130F] border border-[#35221B] p-6 rounded-2xl shadow-xl space-y-3 text-xs">
              <h4 className="font-serif text-xs font-semibold uppercase text-[#DFC18A] tracking-wider border-b border-[#2C1C16] pb-2">
                Quick Shortcuts
              </h4>
              <Link
                to="/cart"
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#160E0B] hover:bg-[#261914] text-[#C7B5A7] hover:text-[#FDF8F4] transition-colors"
              >
                <span>View Shopping Bag</span>
                <ArrowRight size={14} className="text-[#DFC18A]" />
              </Link>
              <Link
                to="/products"
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#160E0B] hover:bg-[#261914] text-[#C7B5A7] hover:text-[#FDF8F4] transition-colors"
              >
                <span>Browse Sarees</span>
                <ArrowRight size={14} className="text-[#DFC18A]" />
              </Link>
            </div>
          </div>

          {/* Right Column: Orders & Activity */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Orders Overview */}
            <div className="bg-[#1E130F] border border-[#35221B] p-6 rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#2C1C16] pb-3">
                <h3 className="font-serif text-sm font-semibold text-[#FDF8F4]">
                  Recent Orders ({recentOrders.length})
                </h3>
                <Link to="/orders" className="text-xs text-[#DFC18A] hover:underline font-medium">
                  View Full History →
                </Link>
              </div>

              {recentOrders.length === 0 ? (
                <p className="text-xs text-[#8E7B6F] italic py-2">No recent orders found.</p>
              ) : (
                <div className="space-y-2.5">
                  {recentOrders.map((ord) => (
                    <div
                      key={ord.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-xl bg-[#160E0B] border border-[#35221B] gap-2 text-xs"
                    >
                      <div>
                        <span className="font-mono text-[#FDF8F4] font-semibold block">
                          Order #{ord.id.slice(0, 8)}
                        </span>
                        <span className="text-[#8E7B6F] text-[10px]">
                          {new Date(ord.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-[#DFC18A]">
                          ₹{Number(ord.total || ord.total_amount || 0).toLocaleString('en-IN')}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#1E130F] text-[#DFC18A] border border-[#35221B]">
                          {ord.status || 'Processing'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

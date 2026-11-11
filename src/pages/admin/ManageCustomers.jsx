import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import SectionHeading from '../../components/reusable/SectionHeading';
import Badge from '../../components/reusable/Badge';
import Modal from '../../components/reusable/Modal';
import { Search, Eye, Trash2, User, Mail, Phone, MapPin, ShoppingBag, Calendar, Package } from 'lucide-react';

const DEMO_CUSTOMER_EMAILS = new Set([
  'priya.sharma@example.com',
  'ananya.ramesh@example.com',
]);

export default function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const getItemDetails = (item) => {
    if (!item) return { name: 'Handcrafted Heritage Saree', price: 0, qty: 1, image: '', size: 'Free Size', lineTotal: 0 };
    const name =
      item.name ||
      item.title ||
      item.product?.name ||
      item.product?.title ||
      'Handcrafted Heritage Saree';
    const price = Number(
      item.price ||
      item.unit_price ||
      item.product?.price ||
      item.product?.regular_price ||
      0
    );
    const qty = Number(item.qty || item.quantity || 1);
    const image =
      item.image ||
      item.product?.images?.[0] ||
      item.product?.image ||
      (Array.isArray(item.images) ? item.images[0] : null) ||
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600';
    const size = item.size || item.selected_size || item.variant || 'Free Size';
    return { name, price, qty, image, size, lineTotal: price * qty };
  };

  const fetchCustomersAndOrders = async () => {
    try {
      const fastTimeout = (promise, ms = 1000) => {
        let t;
        const timer = new Promise((_, reject) => {
          t = setTimeout(() => reject(new Error('timeout')), ms);
        });
        return Promise.race([promise, timer]).finally(() => clearTimeout(t));
      };

      // 1. Fetch profiles & orders with fast timeout race
      let dbProfiles = [];
      let dbOrders = [];

      try {
        const { data: pData } = await fastTimeout(
          supabase.from('profiles').select('*').order('created_at', { ascending: false })
        );
        if (pData) dbProfiles = pData;
      } catch (e) {}

      try {
        const { data: oData } = await fastTimeout(
          supabase.from('orders').select('*').order('created_at', { ascending: false })
        );
        if (oData) dbOrders = oData;
      } catch (e) {}

      // 2. Local storage sources
      let localUsers = [];
      try {
        localUsers = JSON.parse(localStorage.getItem('isai_registered_users') || '[]');
      } catch (e) {}

      let localOrders = [];
      try {
        const raw = localStorage.getItem('isai_orders');
        localOrders = raw ? JSON.parse(raw) : [];
      } catch (e) {}

      let currentUser = null;
      try {
        currentUser = JSON.parse(localStorage.getItem('isai_current_user') || 'null');
      } catch (e) {}

      const allOrders = [...dbOrders, ...localOrders];
      setOrders(allOrders);

      const customerMap = new Map();

      // Helper to aggregate customer accounts (exclude admins)
      const addCustomer = (u) => {
        if (!u || (!u.email && !u.name)) return;
        if (u.role === 'admin' || u.email?.toLowerCase().includes('admin')) return;

        const emailKey = u.email
          ? u.email.toLowerCase()
          : `cust_${String(u.name).toLowerCase().replace(/\s+/g, '')}@isaitarang.com`;

        if (!customerMap.has(emailKey)) {
          customerMap.set(emailKey, {
            id: u.id || 'usr_' + Math.random().toString(36).substring(2, 8),
            name: u.name || (emailKey.includes('@') ? emailKey.split('@')[0] : 'Customer User'),
            email: emailKey,
            phone: u.phone || u.shipping_address?.phone || '+91 98765 43210',
            role: u.role || 'user',
            address: u.address || u.shipping_address?.addressLine1 || u.shipping_address?.street || 'Tamil Nadu, India',
            city: u.city || u.shipping_address?.city || 'Chennai',
            pincode: u.pincode || u.shipping_address?.pincode || '600001',
            created_at: u.created_at || new Date().toISOString(),
          });
        }
      };

      // Add from Database Profiles
      if (dbProfiles) dbProfiles.forEach(addCustomer);

      // Add Current Logged-in Customer
      if (currentUser) addCustomer(currentUser);

      // Add Local Storage Users
      if (localUsers) localUsers.forEach(addCustomer);

      // Add Customers from Order Contacts
      allOrders.forEach((ord) => {
        const addr = ord.shipping_address || ord.profiles || {};
        if (addr.email || addr.name) {
          addCustomer({
            id: ord.user_id || ord.id,
            name: addr.name,
            email: addr.email,
            phone: addr.phone,
            address: addr.addressLine1 || addr.street,
            city: addr.city,
            pincode: addr.pincode,
            role: 'user',
            created_at: ord.created_at,
          });
        }
      });

      // Exclude any residual demo accounts
      DEMO_CUSTOMER_EMAILS.forEach((demoEmail) => customerMap.delete(demoEmail));

      setCustomers(Array.from(customerMap.values()));
    } catch (err) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomersAndOrders();

    const handleUpdate = () => {
      fetchCustomersAndOrders();
    };

    window.addEventListener('isai:orders_updated', handleUpdate);
    window.addEventListener('isai:customers_updated', handleUpdate);
    return () => {
      window.removeEventListener('isai:orders_updated', handleUpdate);
      window.removeEventListener('isai:customers_updated', handleUpdate);
    };
  }, []);

  const handleDeleteCustomer = async (customer) => {
    const identifier = customer.name || customer.email;
    if (!window.confirm(`Are you sure you want to delete customer "${identifier}"?`)) {
      return;
    }

    try {
      if (customer.id) {
        await supabase.from('profiles').delete().eq('id', customer.id);
        await supabase.from('customers').delete().eq('id', customer.id);
        await supabase.from('users').delete().eq('id', customer.id);
      }
      if (customer.email) {
        await supabase.from('profiles').delete().eq('email', customer.email);
        await supabase.from('customers').delete().eq('email', customer.email);
        await supabase.from('users').delete().eq('email', customer.email);
      }

      // Remove from local storage registered users
      try {
        const localUsers = JSON.parse(localStorage.getItem('isai_registered_users') || '[]');
        const updatedUsers = localUsers.filter(
          (u) => u.email?.toLowerCase() !== customer.email?.toLowerCase() && u.id !== customer.id
        );
        localStorage.setItem('isai_registered_users', JSON.stringify(updatedUsers));
      } catch (e) {}

      fetchCustomersAndOrders();
    } catch (err) {
      console.error('Delete customer error:', err);
      alert('Could not delete customer record: ' + err.message);
    }
  };

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setModalOpen(true);
  };

  // Filter customers by search keyword
  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    const nameMatch = c.name?.toLowerCase().includes(q);
    const emailMatch = c.email?.toLowerCase().includes(q);
    const phoneMatch = c.phone?.toLowerCase().includes(q);
    return nameMatch || emailMatch || phoneMatch;
  });

  // Calculate order stats per customer
  const getCustomerOrderStats = (email, customerId) => {
    const custOrders = orders.filter((o) => {
      const ordEmail = o.shipping_address?.email || o.profiles?.email || o.email;
      const ordUserId = o.user_id || o.id;
      return (
        (ordEmail && ordEmail.toLowerCase() === email?.toLowerCase()) ||
        (customerId && ordUserId === customerId)
      );
    });

    const totalSpent = custOrders.reduce(
      (acc, curr) => acc + (parseFloat(curr.total || curr.total_amount) || 0),
      0
    );

    return {
      count: custOrders.length,
      totalSpent,
      history: custOrders,
    };
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 text-[#F3E5AB]">
      {/* Page Header */}
      <SectionHeading
        title="Customers Directory"
        subtitle="View customer accounts, purchase history, contact records, and profiles"
        align="left"
      />

      {/* Search Input Box */}
      <div className="bg-[#0C2317] border border-[#D4AF37]/35 p-4 rounded-2xl shadow-xl flex items-center gap-3">
        <Search className="w-5 h-5 text-[#D4AF37] shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search customers by name, email, or phone number..."
          className="w-full bg-transparent text-sm text-[#F3E5AB] placeholder:text-[#EADFC9]/50 focus:outline-none font-sans"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs uppercase font-bold text-[#D4AF37] hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      {/* Customers Table */}
      <div className="bg-[#0C2317] border border-[#D4AF37]/35 rounded-2xl shadow-2xl overflow-hidden text-[#F3E5AB]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs font-sans">
            <thead>
              <tr className="border-b border-[#D4AF37]/25 text-[#D4AF37] font-bold uppercase tracking-wider bg-[#081A11]">
                <th className="py-4 px-6">Customer Name</th>
                <th className="py-4 px-6">Email Address</th>
                <th className="py-4 px-6">Phone Number</th>
                <th className="py-4 px-6">Account Role</th>
                <th className="py-4 px-6">Total Orders</th>
                <th className="py-4 px-6">Total Spent</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#D4AF37]/15">
              {filteredCustomers.length === 0 && !loading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#EADFC9]/70 italic">
                    {searchQuery ? `No customers matching "${searchQuery}"` : 'No customers recorded yet.'}
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const stats = getCustomerOrderStats(cust.email, cust.id);

                  return (
                    <tr key={cust.id} className="hover:bg-[#153424]/60 transition-colors">
                      <td className="py-4 px-6 font-bold text-[#F3E5AB] flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#1A3C2B] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-bold text-xs shrink-0">
                          {cust.name?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <span>{cust.name}</span>
                      </td>
                      <td className="py-4 px-6 font-mono text-[#EADFC9]">{cust.email}</td>
                      <td className="py-4 px-6 text-[#EADFC9]">{cust.phone}</td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40">
                          User
                        </span>
                      </td>
                      <td className="py-4 px-6 font-bold text-[#F3E5AB]">{stats.count} orders</td>
                      <td className="py-4 px-6 font-bold text-[#D4AF37]">
                        ₹{stats.totalSpent.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleViewCustomer(cust)}
                          className="p-1.5 bg-[#1A3C2B] text-[#F3E5AB] hover:bg-[#D4AF37] hover:text-[#0C2317] border border-[#D4AF37]/35 rounded-lg transition-all cursor-pointer"
                          title="View Customer Profile & History"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCustomer(cust)}
                          className="p-1.5 bg-red-950/60 text-red-300 hover:bg-red-900 border border-red-500/40 rounded-lg transition-all cursor-pointer"
                          title="Delete Customer Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* View Customer Details Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Customer Profile (${selectedCustomer?.name || ''})`}
      >
        {selectedCustomer && (
          <div className="space-y-6 text-xs font-sans text-[#F3E5AB] p-1 max-h-[80vh] overflow-y-auto pr-1">
            {/* Header info */}
            <div className="bg-[#1A3C2B] border border-[#D4AF37]/40 p-4 rounded-xl flex items-center gap-4 shadow-lg">
              <div className="w-12 h-12 rounded-full bg-[#0C2317] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold text-lg shrink-0">
                {selectedCustomer.name?.charAt(0).toUpperCase() || 'C'}
              </div>
              <div>
                <h3 className="font-serif text-base font-bold text-[#F3E5AB]">{selectedCustomer.name}</h3>
                <p className="font-mono text-[#EADFC9] text-xs">{selectedCustomer.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40">
                  Customer User
                </span>
              </div>
            </div>

            {/* Contact & Address Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#081A11] border border-[#D4AF37]/30 p-4 rounded-xl space-y-2">
                <h4 className="font-serif text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#D4AF37]/20 pb-1.5">
                  <Phone className="w-3.5 h-3.5" /> Contact Information
                </h4>
                <p className="flex items-center gap-2 text-[#EADFC9]">
                  <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{selectedCustomer.email}</span>
                </p>
                <p className="flex items-center gap-2 text-[#EADFC9]">
                  <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{selectedCustomer.phone}</span>
                </p>
              </div>

              <div className="bg-[#081A11] border border-[#D4AF37]/30 p-4 rounded-xl space-y-2">
                <h4 className="font-serif text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#D4AF37]/20 pb-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Primary Address
                </h4>
                <p className="text-[#EADFC9]">{selectedCustomer.address}</p>
                <p className="text-[#EADFC9]">
                  {selectedCustomer.city}, <span className="font-bold text-[#D4AF37]">{selectedCustomer.pincode}</span>
                </p>
              </div>
            </div>

            {/* Purchase History with Detailed Products */}
            <div className="bg-[#081A11] border border-[#D4AF37]/30 p-4 rounded-xl space-y-3">
              <h4 className="font-serif text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#D4AF37]/20 pb-2">
                <ShoppingBag className="w-3.5 h-3.5" /> Order History & Purchased Products
              </h4>

              {(() => {
                const stats = getCustomerOrderStats(selectedCustomer.email, selectedCustomer.id);
                if (stats.history.length === 0) {
                  return <p className="italic text-[#EADFC9]/60 py-2">No orders placed by this customer yet.</p>;
                }

                return (
                  <div className="space-y-3">
                    {stats.history.map((o) => {
                      const items = Array.isArray(o.items) ? o.items : [];

                      return (
                        <div
                          key={o.id}
                          className="bg-[#1A3C2B]/50 border border-[#D4AF37]/25 rounded-xl p-3 space-y-2.5"
                        >
                          {/* Order Header */}
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D4AF37]/20 pb-2">
                            <div>
                              <span className="font-mono font-bold text-[#F3E5AB]">
                                #{o.id?.slice(0, 12) || o.order_id}
                              </span>
                              <span className="text-[10px] text-[#EADFC9]/70 ml-2">
                                {new Date(o.created_at || Date.now()).toLocaleDateString('en-IN')} &bull;{' '}
                                <span className="uppercase font-semibold text-[#DFC18A]">
                                  {o.payment_method === 'cod' || o.payment_method === 'COD' ? 'Cash on Delivery' : 'Prepaid Online'}
                                </span>
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge text={o.status || 'pending'} variant="gold" />
                              <span className="font-bold text-sm text-[#DFC18A]">
                                ₹{Number(o.total || o.total_amount || 0).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </div>

                          {/* Purchased Products List */}
                          <div className="space-y-1.5">
                            {items.length === 0 ? (
                              <p className="text-[11px] text-[#EADFC9]/70 italic">
                                1x Handcrafted Heritage Saree
                              </p>
                            ) : (
                              items.map((rawItem, idx) => {
                                const item = getItemDetails(rawItem);
                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between p-2 rounded-lg bg-[#0C2317]/60 border border-[#D4AF37]/15"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-9 h-9 rounded object-cover border border-[#D4AF37]/25 shrink-0"
                                        onError={(e) => {
                                          e.currentTarget.src =
                                            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600';
                                        }}
                                      />
                                      <div className="min-w-0">
                                        <p className="font-medium text-[#F3E5AB] text-xs truncate max-w-[200px]" title={item.name}>
                                          {item.name}
                                        </p>
                                        <p className="text-[10px] text-[#EADFC9]/70">
                                          Qty: {item.qty} &bull; ₹{item.price.toLocaleString('en-IN')} each
                                        </p>
                                      </div>
                                    </div>
                                    <div className="font-bold text-xs text-[#DFC18A] shrink-0">
                                      ₹{item.lineTotal.toLocaleString('en-IN')}
                                    </div>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317] hover:brightness-110 shadow-lg cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

import React from 'react';
import Modal from '../../reusable/Modal';
import Badge from '../../reusable/Badge';
import { getItemDetails } from '../../../utils/orderHelpers';
import { Phone, Mail, MapPin, ShoppingBag, Trash2 } from 'lucide-react';

export default function CustomerDetailModal({
  isOpen,
  onClose,
  customer,
  orderStats,
  onDeleteCustomer,
}) {
  if (!customer) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Customer Profile (${customer.name || ''})`}
    >
      <div className="space-y-6 text-xs font-sans text-[#F5E6BE] p-1 max-h-[80vh] overflow-y-auto pr-1">
        {/* Header info */}
        <div className="bg-[#161B26] border border-[#D4AF37]/40 p-4 rounded-xl flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-full bg-[#0A0D14] border-2 border-[#D4AF37] flex items-center justify-center text-[#D4AF37] font-bold text-lg shrink-0">
            {customer.name?.charAt(0).toUpperCase() || 'C'}
          </div>
          <div>
            <h3 className="font-sans text-base font-bold text-[#FFFFFF]">{customer.name}</h3>
            <p className="font-mono text-[#A1A1AA] text-xs">{customer.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/40">
              Customer User
            </span>
          </div>
        </div>

        {/* Contact & Address Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0A0D14] border border-[#D4AF37]/30 p-4 rounded-xl space-y-2">
            <h4 className="font-sans text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#D4AF37]/20 pb-1.5">
              <Phone className="w-3.5 h-3.5" /> Contact Information
            </h4>
            <p className="flex items-center gap-2 text-[#A1A1AA]">
              <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[#FFFFFF]">{customer.email}</span>
            </p>
            <p className="flex items-center gap-2 text-[#A1A1AA]">
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[#FFFFFF]">{customer.phone}</span>
            </p>
          </div>

          <div className="bg-[#0A0D14] border border-[#D4AF37]/30 p-4 rounded-xl space-y-2">
            <h4 className="font-sans text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#D4AF37]/20 pb-1.5">
              <MapPin className="w-3.5 h-3.5" /> Primary Address
            </h4>
            <p className="text-[#FFFFFF]">{customer.address}</p>
            <p className="text-[#A1A1AA]">
              {customer.city}, <span className="font-bold text-[#D4AF37]">{customer.pincode}</span>
            </p>
          </div>
        </div>

        {/* Purchase History with Detailed Products */}
        <div className="bg-[#0A0D14] border border-[#D4AF37]/30 p-4 rounded-xl space-y-3">
          <h4 className="font-sans text-xs font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#D4AF37]/20 pb-2">
            <ShoppingBag className="w-3.5 h-3.5" /> Order History &amp; Purchased Products
          </h4>

          {orderStats.history.length === 0 ? (
            <p className="italic text-[#A1A1AA] py-2">No orders placed by this customer yet.</p>
          ) : (
            <div className="space-y-3">
              {orderStats.history.map((o) => {
                const items = Array.isArray(o.items) ? o.items : [];

                return (
                  <div
                    key={o.id}
                    className="bg-[#161B26] border border-[#D4AF37]/25 rounded-xl p-3 space-y-2.5"
                  >
                    {/* Order Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#D4AF37]/20 pb-2">
                      <div>
                        <span className="font-mono font-bold text-[#FFFFFF]">
                          #{o.id?.slice(0, 12) || o.order_id}
                        </span>
                        <span className="text-[10px] text-[#A1A1AA] ml-2">
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
                        <p className="text-[11px] text-[#A1A1AA] italic">
                          1x Handcrafted Heritage Saree
                        </p>
                      ) : (
                        items.map((rawItem, idx) => {
                          const item = getItemDetails(rawItem);
                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between p-2 rounded-lg bg-[#0A0D14] border border-[#D4AF37]/15"
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
                                  <p className="font-semibold text-[#FFFFFF] text-xs truncate max-w-[200px]" title={item.name}>
                                    {item.name}
                                  </p>
                                  <p className="text-[10px] text-[#A1A1AA]">
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
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#D4AF37]/20">
          <button
            type="button"
            onClick={() => onDeleteCustomer(customer)}
            className="px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-red-950/70 text-red-300 hover:bg-red-900 border border-red-500/40 shadow-lg flex items-center gap-1.5 cursor-pointer font-sans transition-all"
            title="Permanently remove customer record"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Customer</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#090B10] hover:brightness-110 shadow-lg cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </Modal>
  );
}

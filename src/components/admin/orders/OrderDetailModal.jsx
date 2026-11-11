import React from 'react';
import Modal from '../../reusable/Modal';
import Badge from '../../reusable/Badge';
import {
  Calendar,
  CreditCard,
  Printer,
  User,
  Mail,
  Phone,
  MapPin,
  Package,
  Truck,
  Trash2,
  Save,
} from 'lucide-react';
import { getItemDetails } from '../../../utils/orderHelpers';

const STATUS_OPTIONS = [
  'pending',
  'paid',
  'confirmed',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
];

export default function OrderDetailModal({
  isOpen,
  onClose,
  selectedOrder,
  newStatus,
  setNewStatus,
  trackingId,
  setTrackingId,
  handleUpdateStatus,
  handleDeleteOrder,
  handlePrintInvoice,
}) {
  if (!selectedOrder) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order Details (#${selectedOrder.id || selectedOrder.order_id || ''})`}
    >
      <div className="space-y-6 text-xs font-sans text-[#F5E6BE] p-1 max-h-[80vh] overflow-y-auto pr-1">
        {/* Header info banner */}
        <div className="bg-[#161B26] border border-[#D4AF37]/40 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-mono text-[#A1A1AA]">
                Ordered on:{' '}
                {new Date(selectedOrder.created_at || Date.now()).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-bold text-[#FFFFFF]">
                Method:{' '}
                {selectedOrder.payment_method === 'cod' || selectedOrder.payment_method === 'COD'
                  ? 'Cash on Delivery (COD)'
                  : 'Prepaid Razorpay / UPI'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePrintInvoice(selectedOrder)}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#090B10] font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer hover:brightness-110"
              title="Print / Download Official Tax Invoice PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Invoice PDF</span>
            </button>

            <div className="flex items-center gap-1.5">
              <span className="text-[#A1A1AA] uppercase font-bold text-[10px]">
                Status:
              </span>
              <Badge text={selectedOrder.status || 'pending'} variant="gold" />
            </div>
          </div>
        </div>

        {/* Customer & Shipping Address Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer Info Card */}
          <div className="bg-[#0A0D14] border border-[#D4AF37]/30 p-4 rounded-xl space-y-2.5 shadow-md">
            <h4 className="font-sans text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#D4AF37]/20 pb-2">
              <User className="w-4 h-4" /> Customer Profile
            </h4>
            <div className="space-y-1.5 text-xs text-[#A1A1AA]">
              <p className="font-bold text-[#FFFFFF] text-sm">
                {selectedOrder.shipping_address?.name ||
                  selectedOrder.profiles?.name ||
                  selectedOrder.customer_name ||
                  'Valued Customer'}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  {selectedOrder.shipping_address?.email ||
                    selectedOrder.profiles?.email ||
                    selectedOrder.email ||
                    'N/A'}
                </span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  {selectedOrder.shipping_address?.phone ||
                    selectedOrder.profiles?.phone ||
                    selectedOrder.phone ||
                    'N/A'}
                </span>
              </p>
            </div>
          </div>

          {/* Delivery Address Card */}
          <div className="bg-[#0A0D14] border border-[#D4AF37]/30 p-4 rounded-xl space-y-2.5 shadow-md">
            <h4 className="font-sans text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#D4AF37]/20 pb-2">
              <MapPin className="w-4 h-4" /> Shipping Destination
            </h4>
            <div className="space-y-1 text-xs text-[#A1A1AA]">
              <p className="text-[#FFFFFF]">
                {selectedOrder.shipping_address?.street ||
                  selectedOrder.shipping_address?.addressLine1 ||
                  selectedOrder.shipping_address?.address ||
                  selectedOrder.address ||
                  'No street address noted'}
              </p>
              {(selectedOrder.shipping_address?.landmark ||
                selectedOrder.shipping_address?.addressLine2) && (
                <p className="text-[11px] text-[#A1A1AA]/80">
                  Landmark:{' '}
                  {selectedOrder.shipping_address.landmark ||
                    selectedOrder.shipping_address.addressLine2}
                </p>
              )}
              <p className="text-[#FFFFFF]">
                {selectedOrder.shipping_address?.city || selectedOrder.city || ''}
                {selectedOrder.shipping_address?.state ? `, ${selectedOrder.shipping_address.state}` : ''}{' '}
                <span className="font-bold text-[#D4AF37]">
                  {selectedOrder.shipping_address?.pincode ||
                    selectedOrder.shipping_address?.zip ||
                    selectedOrder.pincode ||
                    ''}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Ordered Sarees List */}
        <div className="bg-[#0A0D14] border border-[#D4AF37]/30 p-4 rounded-xl space-y-3 shadow-md">
          <h4 className="font-sans text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#D4AF37]/20 pb-2">
            <Package className="w-4 h-4" /> Ordered Sarees &amp; Items
          </h4>

          <div className="space-y-2.5">
            {(!selectedOrder.items || selectedOrder.items.length === 0) ? (
              <div className="p-3 bg-[#161B26] rounded-lg text-center text-[#A1A1AA] italic">
                1x Master Handcrafted Pure Silk Saree
              </div>
            ) : (
              selectedOrder.items.map((rawItem, idx) => {
                const item = getItemDetails(rawItem);
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-[#161B26] border border-[#D4AF37]/20"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-14 rounded-lg overflow-hidden border border-[#D4AF37]/30 bg-[#090B10] shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.src =
                              'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-sans font-bold text-[#FFFFFF] text-sm truncate" title={item.name}>
                          {item.name}
                        </p>
                        <p className="text-[11px] text-[#A1A1AA]">
                          Unit Price: ₹{item.price.toLocaleString('en-IN')} &bull; Quantity: {item.qty}
                        </p>
                        {item.category && (
                          <span className="inline-block mt-0.5 px-2 py-0.2 rounded-full text-[9px] font-bold uppercase bg-[#090B10] text-[#D4AF37] border border-[#D4AF37]/30">
                            {item.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-bold text-sm text-[#DFC18A]">
                        ₹{item.lineTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Financial Billing & Payment Breakdown */}
        <div className="bg-[#0A0D14] border border-[#D4AF37]/30 p-4 rounded-xl space-y-3 shadow-md">
          <h4 className="font-sans text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#D4AF37]/20 pb-2">
            <CreditCard className="w-4 h-4" /> Billing &amp; Payment Ledger
          </h4>

          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center text-[#A1A1AA]">
              <span>Payment Gateway Transaction Reference:</span>
              <span className="font-mono text-[#FFFFFF] bg-[#161B26] px-2 py-0.5 rounded border border-[#D4AF37]/20">
                {selectedOrder.razorpay_order_id ||
                  selectedOrder.razorpay_payment_id ||
                  selectedOrder.transaction_id ||
                  'COD Verified on Delivery'}
              </span>
            </div>

            {(() => {
              const subtotalVal = Number(
                selectedOrder.subtotal ??
                (Array.isArray(selectedOrder.items) && selectedOrder.items.length > 0
                  ? selectedOrder.items.reduce((acc, it) => acc + (Number(it.price || it.product?.price || 0) * (it.quantity || it.qty || 1)), 0)
                  : (selectedOrder.total || selectedOrder.total_amount || 0))
              );
              const discountVal = Number(selectedOrder.discount ?? selectedOrder.discount_amount ?? 0);
              const couponCodeVal = selectedOrder.coupon_code || selectedOrder.coupon?.code || '';
              const finalTotalVal = Number(selectedOrder.total ?? selectedOrder.total_amount ?? Math.max(0, subtotalVal - discountVal));

              return (
                <div className="space-y-2 bg-[#161B26] p-3.5 rounded-lg border border-[#D4AF37]/20 text-xs">
                  <div className="flex justify-between text-[#A1A1AA]">
                    <span>Sarees Subtotal</span>
                    <span className="text-[#FFFFFF] font-mono">
                      ₹{subtotalVal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {discountVal > 0 ? (
                    <div className="flex justify-between items-center text-[#A1A1AA]">
                      <span className="flex items-center gap-1.5">
                        <span>Coupon Discount</span>
                        {couponCodeVal && (
                          <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/40">
                            {couponCodeVal}
                          </span>
                        )}
                      </span>
                      <span className="text-emerald-400 font-semibold font-mono">
                        -₹{discountVal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-[#A1A1AA]">
                      <span>Promotional Discount</span>
                      <span className="text-[#A1A1AA] italic">None</span>
                    </div>
                  )}

                  <div className="flex justify-between text-[#A1A1AA]">
                    <span>Insured Heritage Shipping</span>
                    <span className="text-emerald-400 font-semibold uppercase">
                      FREE
                    </span>
                  </div>

                  <div className="flex justify-between pt-2 border-t border-[#D4AF37]/20 font-bold text-sm text-[#DFC18A]">
                    <span>Final Total Paid</span>
                    <span className="font-mono text-base">
                      ₹{finalTotalVal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Status Update Form */}
        <form
          onSubmit={handleUpdateStatus}
          className="bg-[#161B26] border border-[#D4AF37]/40 p-4 rounded-xl space-y-4 shadow-lg"
        >
          <h4 className="font-sans text-sm font-bold text-[#FFFFFF] uppercase tracking-wider flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#D4AF37]" /> Dispatch &amp; Status Update
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block uppercase font-bold text-[#D4AF37] tracking-wider text-[10px]">
                Select New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-[#0A0D14] border border-[#D4AF37]/35 rounded-lg p-2.5 text-[#FFFFFF] focus:outline-none focus:border-[#D4AF37]"
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st} value={st}>
                    {st.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="block uppercase font-bold text-[#D4AF37] tracking-wider text-[10px]">
                Tracking / AWB Number (Optional)
              </label>
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                className="w-full bg-[#0A0D14] border border-[#D4AF37]/35 rounded-lg p-2.5 text-[#FFFFFF] focus:outline-none focus:border-[#D4AF37]"
                placeholder="e.g. AWB19827391"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#D4AF37]/20">
            <button
              type="button"
              onClick={() => handleDeleteOrder(selectedOrder)}
              className="px-4 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-red-950/70 text-red-300 hover:bg-red-900 border border-red-500/40 shadow-lg flex items-center gap-1.5 cursor-pointer font-sans transition-all"
              title="Permanently remove order from database and storage"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Order</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg font-bold text-xs uppercase text-[#A1A1AA] hover:bg-[#0A0D14] cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#090B10] hover:brightness-110 shadow-lg flex items-center gap-1.5 cursor-pointer font-sans"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Status</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}

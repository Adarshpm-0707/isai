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
      <div className="space-y-6 text-xs font-sans text-[#F3E5AB] p-1 max-h-[80vh] overflow-y-auto pr-1">
        {/* Header info banner */}
        <div className="bg-[#1A3C2B] border border-[#D4AF37]/40 p-4 rounded-xl flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-mono text-[#EADFC9]">
                Ordered on:{' '}
                {new Date(selectedOrder.created_at || Date.now()).toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#D4AF37]" />
              <span className="font-bold uppercase text-[#F3E5AB]">
                Payment: {selectedOrder.payment_method || 'COD'} (Total: ₹
                {Number(
                  selectedOrder.total || selectedOrder.total_amount || 0
                ).toLocaleString('en-IN')}
                )
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePrintInvoice(selectedOrder)}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317] font-bold text-[10px] uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer hover:brightness-110"
              title="Print / Download Official Tax Invoice PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Invoice PDF</span>
            </button>

            <div className="flex items-center gap-1.5">
              <span className="text-[#EADFC9] uppercase font-bold text-[10px]">
                Status:
              </span>
              <Badge text={selectedOrder.status || 'pending'} variant="gold" />
            </div>
          </div>
        </div>

        {/* Customer & Shipping Address Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer Info Card */}
          <div className="bg-[#081A11] border border-[#D4AF37]/30 p-4 rounded-xl space-y-2.5 shadow-md">
            <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#D4AF37]/20 pb-2">
              <User className="w-4 h-4" /> Customer Profile
            </h4>
            <div className="space-y-1.5 text-xs text-[#EADFC9]">
              <p className="font-bold text-[#F3E5AB] text-sm">
                {selectedOrder.shipping_address?.name ||
                  selectedOrder.profiles?.name ||
                  'N/A'}
              </p>
              <p className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  {selectedOrder.shipping_address?.email ||
                    selectedOrder.profiles?.email ||
                    'N/A'}
                </span>
              </p>
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>
                  {selectedOrder.shipping_address?.phone ||
                    selectedOrder.profiles?.phone ||
                    'N/A'}
                </span>
              </p>
            </div>
          </div>

          {/* Shipping Address Card */}
          <div className="bg-[#081A11] border border-[#D4AF37]/30 p-4 rounded-xl space-y-2.5 shadow-md">
            <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#D4AF37]/20 pb-2">
              <MapPin className="w-4 h-4" /> Shipping & Delivery Location
            </h4>
            <div className="space-y-1 text-xs text-[#EADFC9]">
              {selectedOrder.shipping_address ? (
                <>
                  <p className="font-medium">
                    {selectedOrder.shipping_address.addressLine1 ||
                      selectedOrder.shipping_address.street}
                  </p>
                  {selectedOrder.shipping_address.addressLine2 && (
                    <p>{selectedOrder.shipping_address.addressLine2}</p>
                  )}
                  <p>
                    {selectedOrder.shipping_address.city},{' '}
                    {selectedOrder.shipping_address.state},{' '}
                    <span className="font-bold text-[#D4AF37]">
                      {selectedOrder.shipping_address.pincode}
                    </span>
                  </p>
                </>
              ) : (
                <p className="italic text-[#EADFC9]/60">
                  No shipping address recorded
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Purchased Items List */}
        <div className="bg-[#081A11] border border-[#D4AF37]/30 p-4 rounded-xl space-y-3 shadow-md">
          <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#D4AF37]/20 pb-2">
            <Package className="w-4 h-4" /> Items Purchased (
            {Array.isArray(selectedOrder.items) ? selectedOrder.items.length : 0})
          </h4>

          <div className="space-y-2.5">
            {Array.isArray(selectedOrder.items) &&
              selectedOrder.items.map((rawItem, idx) => {
                const item = getItemDetails(rawItem);

                return (
                  <div
                    key={idx}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-[#1A3C2B]/60 border border-[#D4AF37]/25 rounded-xl gap-3"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-lg object-cover bg-[#0C2317] border border-[#D4AF37]/35 shrink-0"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600';
                        }}
                      />
                      <div className="min-w-0 space-y-1">
                        <p className="font-serif font-bold text-[#F3E5AB] text-sm truncate">
                          {item.name}
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-[#EADFC9]/90">
                          <span className="px-2 py-0.5 rounded bg-[#081A11] border border-[#D4AF37]/30 text-[#DFC18A] uppercase font-semibold">
                            {item.size}
                          </span>
                          <span>
                            Rate: ₹{item.price.toLocaleString('en-IN')} &times;{' '}
                            {item.qty}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right sm:shrink-0">
                      <span className="text-[10px] text-[#EADFC9]/70 block uppercase font-bold">
                        Item Total
                      </span>
                      <span className="font-bold text-[#D4AF37] text-base">
                        ₹{item.lineTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Payment & Financial Breakdown Card */}
        <div className="bg-[#081A11] border border-[#D4AF37]/30 p-4 rounded-xl space-y-3 shadow-md">
          <h4 className="font-serif text-sm font-bold text-[#D4AF37] uppercase tracking-wider flex items-center gap-1.5 border-b border-[#D4AF37]/20 pb-2">
            <CreditCard className="w-4 h-4" /> Payment Details & Financial Audit
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2 bg-[#1A3C2B]/40 p-3 rounded-lg border border-[#D4AF37]/20">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#EADFC9]">Payment Method</span>
                <span className="font-bold uppercase text-[#F3E5AB]">
                  {selectedOrder.payment_method === 'cod' ||
                  selectedOrder.payment_method === 'COD'
                    ? 'Cash on Delivery (COD)'
                    : 'Prepaid Online / Razorpay'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#EADFC9]">Payment Status</span>
                <span
                  className={`font-bold uppercase px-2 py-0.5 rounded text-[10px] ${
                    selectedOrder.status === 'paid' ||
                    selectedOrder.payment_details?.status === 'captured' ||
                    selectedOrder.payment_status === 'paid'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                      : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                  }`}
                >
                  {selectedOrder.status === 'paid' ||
                  selectedOrder.payment_details?.status === 'captured' ||
                  selectedOrder.payment_status === 'paid'
                    ? 'Payment Verified'
                    : 'Pending On Delivery'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#EADFC9]">Transaction ID</span>
                <span className="font-mono text-[10px] text-[#DFC18A] truncate max-w-[150px]">
                  {selectedOrder.payment_details?.razorpay_payment_id ||
                    selectedOrder.razorpay_payment_id ||
                    selectedOrder.transaction_id ||
                    'COD Verified on Delivery'}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 bg-[#1A3C2B]/40 p-3 rounded-lg border border-[#D4AF37]/20 text-xs">
              <div className="flex justify-between text-[#EADFC9]">
                <span>Sarees Subtotal</span>
                <span>
                  ₹
                  {Number(
                    selectedOrder.total || selectedOrder.total_amount || 0
                  ).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between text-[#EADFC9]">
                <span>Promotional Discount</span>
                <span className="text-emerald-400 font-semibold">₹0</span>
              </div>
              <div className="flex justify-between text-[#EADFC9]">
                <span>Insured Heritage Shipping</span>
                <span className="text-emerald-400 font-semibold uppercase">
                  FREE
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#D4AF37]/20 font-bold text-sm text-[#DFC18A]">
                <span>Total Amount</span>
                <span>
                  ₹
                  {Number(
                    selectedOrder.total || selectedOrder.total_amount || 0
                  ).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Update Form */}
        <form
          onSubmit={handleUpdateStatus}
          className="bg-[#1A3C2B] border border-[#D4AF37]/40 p-4 rounded-xl space-y-4 shadow-lg"
        >
          <h4 className="font-serif text-sm font-bold text-[#F3E5AB] uppercase tracking-wider flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-[#D4AF37]" /> Dispatch & Status Update
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block uppercase font-bold text-[#D4AF37] tracking-wider text-[10px]">
                Select New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full bg-[#081A11] border border-[#D4AF37]/35 rounded-lg p-2.5 text-[#F3E5AB] focus:outline-none focus:border-[#D4AF37]"
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
                className="w-full bg-[#081A11] border border-[#D4AF37]/35 rounded-lg p-2.5 text-[#F3E5AB] focus:outline-none focus:border-[#D4AF37]"
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
                className="px-4 py-2 rounded-lg font-bold text-xs uppercase text-[#EADFC9] hover:bg-[#081A11]"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#0C2317] hover:brightness-110 shadow-lg flex items-center gap-1.5 cursor-pointer font-sans"
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

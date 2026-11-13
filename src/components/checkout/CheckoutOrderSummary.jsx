import React from 'react';
import { ShieldCheck } from 'lucide-react';
import { getProductImage } from '../../utils/productHelpers';

export default function CheckoutOrderSummary({
  cartItems,
  subtotal,
  paymentMethod,
  finalTotal,
  submitting,
}) {

  return (
    <div className="bg-[#1E130F] border border-[#35221B] p-6 rounded-2xl space-y-5 shadow-xl text-[#FDF8F4]">
      <h3 className="font-serif text-lg font-semibold text-[#FDF8F4] pb-3 border-b border-[#2C1C16]">
        Order Review
      </h3>

      {/* Items List */}
      <div className="space-y-3.5 max-h-[260px] overflow-y-auto pr-1">
        {cartItems.map((item) => {
          const prod = item.product || item;
          const pId = item.product_id || prod.id;
          const qty = item.quantity || item.qty || 1;
          const unitPrice = prod.discount_price ?? prod.price ?? item.price ?? 0;

          return (
            <div key={item.id || pId} className="flex gap-3 items-center">
              <div className="w-12 aspect-[3/4] rounded-lg overflow-hidden bg-[#160E0B] border border-[#35221B] shrink-0">
                <img
                  src={getProductImage(prod)}
                  alt={prod.name || item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-[#FDF8F4] truncate">
                  {prod.name || item.name}
                </h4>
                <div className="text-[11px] text-[#8E7B6F] flex items-center gap-1.5 flex-wrap">
                  <span>Qty: {qty} ×</span>
                  {Number(prod.price || item.regular_price || 0) > unitPrice ? (
                    <span className="flex items-center gap-1">
                      <span className="line-through text-[#6E5F55]">
                        ₹{Number(prod.price || item.regular_price).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[#DFC18A] font-semibold">
                        ₹{unitPrice.toLocaleString('en-IN')}
                      </span>
                    </span>
                  ) : (
                    <span>₹{unitPrice.toLocaleString('en-IN')}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="space-y-2 text-xs text-[#C7B5A7] border-t border-[#2C1C16] pt-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-[#FDF8F4]">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between">
          <span>Delivery</span>
          <span className="text-emerald-400 font-medium">FREE</span>
        </div>
        <div className="flex justify-between text-base font-bold text-[#FDF8F4] border-t border-[#2C1C16] pt-3">
          <span>Total Payable</span>
          <span className="text-[#DFC18A] font-bold text-lg">
            ₹{finalTotal.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Submit CTA */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 rounded-full bg-[#C86A27] hover:bg-[#DB7B32] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer disabled:opacity-50"
      >
        {submitting
          ? 'Processing Order...'
          : paymentMethod === 'cod'
          ? 'Confirm COD Order'
          : 'Pay with Razorpay'}
      </button>

      <div className="flex items-center gap-2 text-[11px] text-[#8E7B6F] pt-2">
        <ShieldCheck className="w-4 h-4 text-[#DFC18A] shrink-0" />
        <span>SSL Encrypted Checkout • Verified Weaver Guarantee</span>
      </div>
    </div>
  );
}


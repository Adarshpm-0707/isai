import React, { useState } from 'react';
import { ShieldCheck, Tag, X, Check } from 'lucide-react';
import { getProductImage } from '../../utils/productHelpers';

export default function CheckoutOrderSummary({
  cartItems,
  subtotal,
  discount,
  appliedCoupon,
  applyCoupon,
  removeCoupon,
  paymentMethod,
  finalTotal,
  submitting,
}) {
  const [couponCode, setCouponCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');

  const handleApply = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!couponCode.trim() || !applyCoupon) return;
    setIsApplying(true);
    setCouponError('');
    setCouponSuccess('');
    try {
      const res = await applyCoupon(couponCode.trim());
      setCouponSuccess(res.message || `Coupon ${couponCode.toUpperCase()} applied!`);
      setCouponCode('');
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code');
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemove = () => {
    if (removeCoupon) removeCoupon();
    setCouponSuccess('');
    setCouponError('');
  };

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
                <p className="text-[11px] text-[#8E7B6F]">
                  Qty: {qty} × ₹{unitPrice.toLocaleString('en-IN')}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Coupon Code Section */}
      <div className="border-t border-[#2C1C16] pt-4 space-y-2">
        <label className="text-[11px] uppercase tracking-wider font-semibold text-[#DFC18A] flex items-center gap-1.5">
          <Tag className="w-3.5 h-3.5" /> Have a Coupon Code?
        </label>

        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-[#160E0B] border border-emerald-500/40 px-3 py-2 rounded-xl text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <Check className="w-3.5 h-3.5" />
              <span>
                <strong className="tracking-wider">{appliedCoupon.code}</strong> Applied (-₹{discount.toLocaleString('en-IN')})
              </span>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="text-[#8E7B6F] hover:text-red-400 p-1 transition-colors cursor-pointer"
              title="Remove coupon"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. WELCOME10"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              className="flex-1 bg-[#160E0B] border border-[#35221B] rounded-xl px-3 py-2 text-xs text-[#FDF8F4] placeholder-[#8E7B6F] focus:border-[#DFC18A] focus:outline-none uppercase font-mono"
            />
            <button
              type="button"
              onClick={handleApply}
              disabled={isApplying || !couponCode.trim()}
              className="px-4 py-2 bg-[#160E0B] hover:bg-[#261914] border border-[#DFC18A]/40 text-[#DFC18A] rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors disabled:opacity-40 cursor-pointer"
            >
              {isApplying ? '...' : 'Apply'}
            </button>
          </div>
        )}

        {couponError && <p className="text-[11px] text-red-400 font-medium">{couponError}</p>}
        {couponSuccess && !appliedCoupon && <p className="text-[11px] text-emerald-400 font-medium">{couponSuccess}</p>}
      </div>

      {/* Totals */}
      <div className="space-y-2 text-xs text-[#C7B5A7] border-t border-[#2C1C16] pt-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span className="text-[#FDF8F4]">₹{subtotal.toLocaleString('en-IN')}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-400 font-medium">
            <span>
              Coupon Discount {appliedCoupon ? `(${appliedCoupon.code})` : ''}
            </span>
            <span>-₹{discount.toLocaleString('en-IN')}</span>
          </div>
        )}
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


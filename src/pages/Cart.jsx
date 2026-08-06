import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import PriceTag from '../components/reusable/PriceTag';
import QtySelector from '../components/reusable/QtySelector';
import SectionHeading from '../components/reusable/SectionHeading';
import Button from '../components/reusable/Button';
import EmptyState from '../components/reusable/EmptyState';
import { Trash2, ArrowRight, ShieldCheck, Tag, X } from 'lucide-react';
import { getProductImage } from '../utils/productHelpers';

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    shippingFee,
    totalAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (cartItems.length === 0) {
    return (
      <EmptyState
        title="Your Shopping Bag is Empty"
        message="Drape yourself in style. Browse our handcrafted luxury collections."
        actionText="Browse Collection"
        actionPath="/products"
      />
    );
  }

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    if (!couponCode.trim()) return;

    setIsApplying(true);
    try {
      const res = await applyCoupon(couponCode);
      setCouponSuccess(res.message);
      setCouponCode('');
    } catch (err) {
      setCouponError(err.message || 'Failed to apply coupon');
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 sm:space-y-10 bg-transparent text-[#E3C381] min-h-[70vh]">
      <SectionHeading
        title="Shopping Bag"
        subtitle="Review your selections before completing checkout"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <div className="border border-[#E3C381]/25 bg-[#E3C381]/10 rounded-2xl divide-y divide-[#E3C381]/20 shadow-xl overflow-hidden">
            {cartItems.map((item) => {
              const prod = item.product || item;
              const pId = item.product_id || prod.id;
              const unitPrice = prod.discount_price ?? prod.price ?? item.price ?? 0;
              const qty = item.quantity || item.qty || 1;

              return (
                <div key={item.id || pId} className="p-3.5 sm:p-6 flex gap-3 sm:gap-6 items-start">
                  {/* Product Thumbnail */}
                  <div className="relative w-16 sm:w-28 aspect-[3/4] overflow-hidden bg-[#0A1810]/60 border border-[#E3C381]/30 flex-shrink-0 rounded-xl p-1 shadow-md">
                    <img
                      src={getProductImage(prod)}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover blur-sm opacity-30 scale-110 pointer-events-none"
                    />
                    <img
                      src={getProductImage(prod)}
                      alt={prod.name || item.name}
                      className="relative z-10 w-full h-full object-contain object-center rounded-lg"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-grow flex flex-col justify-between min-h-[90px] sm:min-h-[100px] space-y-2 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <Link
                          to={`/products/${prod.slug || pId}`}
                          className="font-playfair font-bold text-[#E3C381] hover:text-[#F0DDB0] transition-colors text-xs sm:text-base tracking-wide line-clamp-1"
                        >
                          {prod.name || item.name}
                        </Link>
                        {prod.category && (
                          <span className="block font-sans text-[9px] sm:text-[10px] text-[#D4AF7A] uppercase font-bold tracking-widest mt-0.5">
                            {prod.category}
                          </span>
                        )}
                        {item.size && (
                          <span className="block font-sans text-[10px] sm:text-xs text-[#D8D0C0] font-medium">
                            Size: {item.size}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        type="button"
                        className="text-[#E3C381]/60 hover:text-red-400 transition-colors p-1 shrink-0"
                        title="Remove Item"
                      >
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-4 pt-1.5 border-t border-[#E3C381]/10">
                      <QtySelector
                        qty={qty}
                        onChange={(newQty) => updateQuantity(item.id, newQty)}
                        stock={prod.stock || 10}
                      />
                      <div className="text-right">
                        <span className="block text-[8px] sm:text-[10px] text-[#D4AF7A] font-sans font-bold uppercase">
                          Total
                        </span>
                        <PriceTag price={unitPrice * qty} size="sm" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-between items-center px-2">
            <button
              onClick={clearCart}
              type="button"
              className="text-xs font-sans uppercase font-bold text-[#5C2F14] hover:text-[#2B1409] transition-colors"
            >
              Clear Bag
            </button>
            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-xs font-sans uppercase font-bold text-[#E3C381] hover:text-[#F0DDB0] transition-colors"
            >
              Continue Shopping <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Summary sidebar */}
        <aside className="bg-gradient-to-b from-[#FFEEDD] to-[#FFF7ED] border border-[#D8A55A]/40 p-6 rounded-sm space-y-6 shadow-xl text-[#2B1409]">
          <h3 className="font-playfair text-lg font-bold text-[#2B1409] uppercase tracking-wider pb-3 border-b border-[#D8A55A]/30">
            Order Summary
          </h3>

          {/* Coupon Form */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-[#5C2F14] block">
              Have a Coupon?
            </label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-[#E88D37]/20 border border-[#E88D37] p-2.5 rounded text-xs font-bold text-[#2B1409]">
                <div className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-[#E88D37]" />
                  <span>
                    {appliedCoupon.code} (
                    {appliedCoupon.type === 'percentage'
                      ? `${appliedCoupon.value}% OFF`
                      : `₹${appliedCoupon.value} OFF`}
                    )
                  </span>
                </div>
                <button
                  type="button"
                  onClick={removeCoupon}
                  className="text-red-700 hover:text-red-900"
                  title="Remove coupon"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter Code (e.g. WELCOME10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="flex-grow bg-white border border-[#D8A55A]/50 text-xs text-[#2B1409] p-2.5 rounded focus:outline-none focus:border-[#E88D37]"
                />
                <Button type="submit" variant="primary" size="sm" disabled={isApplying}>
                  {isApplying ? 'Applying...' : 'Apply'}
                </Button>
              </form>
            )}
            {couponError && <p className="text-xs text-red-600 font-medium">{couponError}</p>}
            {couponSuccess && <p className="text-xs text-green-700 font-medium">{couponSuccess}</p>}
          </div>

          <div className="space-y-3 font-sans text-xs">
            <div className="flex justify-between text-[#5C2F14] font-medium">
              <span>Subtotal</span>
              <span className="font-bold text-[#2B1409]">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-green-700 font-bold">
                <span>Coupon Discount</span>
                <span>- ₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-[#5C2F14] font-medium">
              <span>Shipping Fee</span>
              <span className="font-bold text-[#2B1409]">
                {shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}
              </span>
            </div>

            <div className="h-[1px] bg-[#D8A55A]/30" />

            <div className="flex justify-between text-sm text-[#2B1409] font-bold uppercase tracking-wider">
              <span>Order Total</span>
              <span className="text-[#2B1409]">₹{totalAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="pt-2">
            <Button
              onClick={() => navigate('/checkout')}
              variant="primary"
              size="lg"
              className="w-full justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-start gap-2.5 pt-4 text-[10px] text-[#5C2F14] font-medium leading-normal border-t border-[#D8A55A]/30 font-sans">
            <ShieldCheck className="w-4 h-4 text-[#E88D37] flex-shrink-0 mt-0.5" />
            <span>Secure Checkout and genuine product guarantee. Authentic quality verified.</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

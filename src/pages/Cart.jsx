import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useCart from '../hooks/useCart';
import PriceTag from '../components/reusable/PriceTag';
import QtySelector from '../components/reusable/QtySelector';
import EmptyState from '../components/reusable/EmptyState';
import { Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { getProductImage } from '../utils/productHelpers';
import { FloralOrnament } from '../components/reusable/FloralOrnament';

export default function Cart() {
  const navigate = useNavigate();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    subtotal,
    totalAmount,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] bg-[#120B09] flex items-center justify-center p-4">
        <EmptyState
          title="Your Shopping Bag is Empty"
          message="Explore our curated collection of pure silk and handloom heirlooms."
          actionText="Browse Sarees"
          actionPath="/products"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-8 sm:py-14 bg-[#120B09] text-[#FDF8F4]">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Title */}
        <div className="text-center space-y-1">
          <p className="text-[10px] sm:text-xs font-semibold tracking-[0.28em] uppercase text-[#DFC18A]">
            Review Selection
          </p>
          <h1
            className="font-serif text-3xl sm:text-4xl text-[#FDF8F4]"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            Shopping Bag
          </h1>
          <FloralOrnament className="mt-1" />
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="rounded-2xl divide-y divide-[#2C1C16] bg-[#1E130F] border border-[#35221B] shadow-xl overflow-hidden">
              {cartItems.map((item) => {
                const prod = item.product || item;
                const pId = item.product_id || prod.id;
                const unitPrice = prod.discount_price ?? prod.price ?? item.price ?? 0;
                const qty = item.quantity || item.qty || 1;

                return (
                  <div
                    key={item.id || pId}
                    className="p-4 sm:p-5 flex gap-4 sm:gap-6 items-start"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 sm:w-24 aspect-[3/4] rounded-xl overflow-hidden bg-[#160E0B] border border-[#35221B] shrink-0">
                      <img
                        src={getProductImage(prod)}
                        alt={prod.name || item.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-between min-h-[95px] space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <Link
                            to={`/products/${prod.slug || pId}`}
                            className="font-sans font-semibold text-sm sm:text-base text-[#FDF8F4] hover:text-[#DFC18A] transition-colors line-clamp-1"
                          >
                            {prod.name || item.name}
                          </Link>
                          {prod.category && (
                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#DFC18A] block mt-0.5">
                              {prod.category}
                            </span>
                          )}
                          {item.size && (
                            <span className="text-xs text-[#8E7B6F] block mt-0.5">
                              {item.size}
                            </span>
                          )}
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-[#8E7B6F] hover:text-red-400 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Quantity & Unit Total */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#2C1C16]">
                        <QtySelector
                          qty={qty}
                          onChange={(newQty) => updateQuantity(item.id, newQty)}
                          stock={prod.stock || 10}
                        />

                        <div className="text-right">
                          {Number(prod.price || item.regular_price || 0) > unitPrice && (
                            <span className="text-xs text-[#8E7B6F] line-through block font-normal">
                              ₹{(Number(prod.price || item.regular_price) * qty).toLocaleString('en-IN')}
                            </span>
                          )}
                          <span className="text-sm sm:text-base font-bold text-[#FDF8F4]">
                            ₹{(unitPrice * qty).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reassurance */}
            <div className="flex items-center gap-2 text-xs text-[#8E7B6F] px-2">
              <ShieldCheck className="w-4 h-4 text-[#DFC18A] shrink-0" />
              <span>Complimentary insured shipping & easy 7-day returns included.</span>
            </div>
          </div>

          {/* Order Summary Card */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-[#1E130F] border border-[#35221B] rounded-2xl p-6 space-y-5 shadow-xl">
              <h3 className="font-serif text-lg font-semibold text-[#FDF8F4]">
                Order Summary
              </h3>

              {/* Cost Breakdown */}
              <div className="space-y-2.5 text-xs text-[#C7B5A7] pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-[#FDF8F4] font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-emerald-400 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-base font-bold text-[#FDF8F4] border-t border-[#2C1C16] pt-3">
                  <span>Total</span>
                  <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/checkout')}
                type="button"
                className="w-full py-3.5 rounded-full bg-[#C86A27] hover:bg-[#DB7B32] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useCart from "../hooks/useCart";
import PriceTag from "../components/reusable/PriceTag";
import QtySelector from "../components/reusable/QtySelector";
import Button from "../components/reusable/Button";
import EmptyState from "../components/reusable/EmptyState";
import { Trash2, ArrowRight, ShieldCheck, Tag, X } from "lucide-react";
import { getProductImage } from "../utils/productHelpers";
import { OnamPageHeading, SectionFlower, PookklamGarland, GoldLine, MiniFlower } from "../components/layout/OnamEffects";
import { motion } from "framer-motion";

export default function Cart() {
  const navigate = useNavigate();
  const { cartItems, updateQuantity, removeFromCart, subtotal, discount, shippingFee, totalAmount, appliedCoupon, applyCoupon, removeCoupon, clearCart } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [isApplying, setIsApplying] = useState(false);

  if (cartItems.length === 0) {
    return <EmptyState title="Your Shopping Bag is Empty" message="Drape yourself in style. Browse our handcrafted Kerala collections." actionText="Browse Collection" actionPath="/products" />;
  }

  const handleApplyCoupon = async (e) => {
    e.preventDefault(); setCouponError(""); setCouponSuccess("");
    if (!couponCode.trim()) return;
    setIsApplying(true);
    try { const res = await applyCoupon(couponCode); setCouponSuccess(res.message); setCouponCode(""); }
    catch (err) { setCouponError(err.message || "Failed to apply coupon"); }
    finally { setIsApplying(false); }
  };

  return (
    <div className="min-h-screen px-3 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8"
      style={{ background: "linear-gradient(180deg,#0C2317 0%,#1A3C2B 40%,#0C2317 100%)" }}>

      {/* Top garland */}
      <div><GoldLine /><PookklamGarland count={26} /><GoldLine /></div>

      <OnamPageHeading malayalam="ഷോപ്പിംഗ് ബാഗ്" english="SHOPPING BAG" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
        {/* Cart items */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl divide-y shadow-xl overflow-hidden"
            style={{ border: "1px solid rgba(212,175,55,0.3)", background: "rgba(26,60,43,0.4)", divideColor: "rgba(212,175,55,0.15)" }}>
            {cartItems.map(item => {
              const prod = item.product || item;
              const pId = item.product_id || prod.id;
              const unitPrice = prod.discount_price ?? prod.price ?? item.price ?? 0;
              const qty = item.quantity || item.qty || 1;
              return (
                <div key={item.id || pId} className="p-3.5 sm:p-5 flex gap-3 sm:gap-5 items-start border-b" style={{ borderColor: "rgba(212,175,55,0.12)" }}>
                  <div className="relative w-16 sm:w-24 aspect-[3/4] overflow-hidden flex-shrink-0 rounded-xl border" style={{ background: "rgba(12,35,23,0.6)", borderColor: "rgba(212,175,55,0.3)" }}>
                    <img src={getProductImage(prod)} alt="" className="absolute inset-0 w-full h-full object-cover blur-sm opacity-25 scale-110 pointer-events-none" />
                    <img src={getProductImage(prod)} alt={prod.name || item.name} className="relative z-10 w-full h-full object-contain object-center rounded-lg" />
                  </div>
                  <div className="flex-grow flex flex-col justify-between min-h-[90px] space-y-2 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <Link to={`/products/${prod.slug || pId}`}
                          className="font-serif font-bold hover:text-[#FFD54F] transition-colors text-xs sm:text-sm tracking-wide line-clamp-1 text-[#F3E5AB]">
                          {prod.name || item.name}
                        </Link>
                        {prod.category && <span className="block text-[9px] text-[#D4AF37] uppercase font-bold tracking-widest mt-0.5">{prod.category}</span>}
                        {item.size && <span className="block text-[10px] text-[#EADFC9]/70 font-medium">Size: {item.size}</span>}
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-[#D4AF37]/50 hover:text-red-400 transition-colors p-1 shrink-0">
                        <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1.5 border-t" style={{ borderColor: "rgba(212,175,55,0.12)" }}>
                      <QtySelector qty={qty} onChange={newQty => updateQuantity(item.id, newQty)} stock={prod.stock || 10} />
                      <div className="text-right">
                        <span className="block text-[8px] text-[#D4AF37] font-bold uppercase">Total</span>
                        <PriceTag price={unitPrice * qty} size="sm" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between items-center px-2">
            <button onClick={clearCart} className="text-xs uppercase font-bold text-[#D4AF37]/50 hover:text-red-400 transition-colors">Clear Bag</button>
            <Link to="/products" className="inline-flex items-center gap-1 text-xs uppercase font-bold text-[#D4AF37] hover:text-[#FFD54F] transition-colors">
              Continue Shopping <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Summary sidebar */}
        <aside className="rounded-2xl p-6 space-y-5 shadow-2xl"
          style={{ background: "linear-gradient(135deg,rgba(26,60,43,0.95),rgba(12,35,23,0.98))", border: "1.5px solid rgba(212,175,55,0.4)" }}>
          <div className="flex items-center gap-1.5 pb-3 border-b" style={{ borderColor: "rgba(212,175,55,0.2)" }}>
            <SectionFlower size={20} />
            <h3 className="font-serif text-base font-bold uppercase tracking-wider text-[#F3E5AB]">Order Summary</h3>
            <SectionFlower size={20} />
          </div>

          {/* Coupon */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-[#D4AF37] block">Have a Coupon?</label>
            {appliedCoupon ? (
              <div className="flex items-center justify-between p-2.5 rounded-lg text-xs font-bold text-[#F3E5AB]"
                style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.5)" }}>
                <div className="flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-[#D4AF37]" />
                  {appliedCoupon.code} ({appliedCoupon.type === "percentage" ? `${appliedCoupon.value}% OFF` : `&#8377;${appliedCoupon.value} OFF`})
                </div>
                <button type="button" onClick={removeCoupon} className="text-red-400 hover:text-red-300"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input type="text" placeholder="Enter Code" value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  className="flex-grow text-xs p-2.5 rounded-lg focus:outline-none"
                  style={{ background: "rgba(12,35,23,0.8)", border: "1px solid rgba(212,175,55,0.3)", color: "#F3E5AB" }} />
                <Button type="submit" variant="primary" size="sm" disabled={isApplying}>
                  {isApplying ? "..." : "Apply"}
                </Button>
              </form>
            )}
            {couponError && <p className="text-xs text-red-400 font-medium">{couponError}</p>}
            {couponSuccess && <p className="text-xs text-green-400 font-medium">{couponSuccess}</p>}
          </div>

          {/* Totals */}
          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-[#EADFC9]/80"><span>Subtotal</span><span className="font-bold text-[#F3E5AB]">&#8377;{subtotal.toLocaleString("en-IN")}</span></div>
            {discount > 0 && <div className="flex justify-between text-green-400 font-bold"><span>Coupon Discount</span><span>- &#8377;{discount.toLocaleString("en-IN")}</span></div>}
            <div className="flex justify-between text-[#EADFC9]/80"><span>Shipping</span><span className="font-bold text-[#F3E5AB]">{shippingFee === 0 ? "FREE" : `&#8377;${shippingFee}`}</span></div>
            <div className="h-px" style={{ background: "rgba(212,175,55,0.25)" }} />
            <div className="flex justify-between text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
              <span>Order Total</span><span>&#8377;{totalAmount.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <button onClick={() => navigate("/checkout")}
            className="w-full py-3 rounded-lg font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 transition-all"
            style={{ background: "linear-gradient(135deg,#D4AF37,#B8860B)", color: "#0C2317", boxShadow: "0 4px 24px rgba(212,175,55,0.4)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg,#FFD54F,#D4AF37)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg,#D4AF37,#B8860B)"; }}>
            <MiniFlower size={16} c1="#0C2317" c2="#1A3C2B" />
            Proceed to Checkout <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-start gap-2 pt-3 text-[10px] text-[#EADFC9]/60 border-t" style={{ borderColor: "rgba(212,175,55,0.15)" }}>
            <ShieldCheck className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
            <span>Secure Checkout. Authentic Kerala quality guaranteed.</span>
          </div>
        </aside>
      </div>
    </div>
  );
}

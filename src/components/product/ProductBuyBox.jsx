import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Share2,
  Tag,
  Minus,
  Plus,
  ShoppingBag,
  Zap,
  Check,
  ShieldCheck,
  Truck,
  RotateCcw,
  Award,
} from 'lucide-react';
import StarRow from './StarRow';

export default function ProductBuyBox({
  product,
  displayPrice,
  originalPrice,
  discountPct,
  avgRating,
  reviewCount,
  inStock,
  inWishlist,
  wishlist,
  SIZES,
  selectedSize,
  setSelectedSize,
  qty,
  setQty,
  handleAddToCart,
  handleBuyNow,
  addedToCart,
}) {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.08 }}
      className="flex flex-col gap-5"
    >
      {/* Category + Discount tags */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {product.category && (
            <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-[#DFC18A]/15 text-[#DFC18A] border border-[#DFC18A]/25">
              {product.category}
            </span>
          )}
          {discountPct && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#C86A27] text-white">
              {discountPct}% OFF
            </span>
          )}
        </div>

        {/* Wishlist + Share */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => wishlist?.toggleWishlist?.(product.id).catch(() => {})}
            className={`p-2 rounded-full border transition-all ${
              inWishlist
                ? 'bg-[#C86A27]/15 border-[#C86A27] text-[#C86A27]'
                : 'bg-[#1E130F] border-[#35221B] text-[#8E7B6F] hover:border-[#DFC18A] hover:text-[#DFC18A]'
            }`}
            title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>
          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator
                  .share({ title: product.name, url: window.location.href })
                  .catch(() => {});
              }
            }}
            className="p-2 rounded-full border bg-[#1E130F] border-[#35221B] text-[#8E7B6F] hover:border-[#DFC18A] hover:text-[#DFC18A] transition-all cursor-pointer"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Name */}
      <h1
        className="font-serif text-2xl sm:text-3xl xl:text-4xl text-[#FDF8F4] leading-tight font-normal"
        style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
      >
        {product.name || 'Handloom Saree'}
      </h1>

      {/* Rating Row */}
      <div className="flex flex-wrap items-center gap-3">
        <StarRow value={Math.round(Number(avgRating) || 5)} />
        <span className="text-sm font-semibold text-[#DFC18A]">{avgRating}</span>
        <span className="text-xs text-[#8E7B6F]">({reviewCount} reviews)</span>
        <span
          className={`ml-auto text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
            inStock
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          }`}
        >
          {inStock ? 'In Stock' : 'Sold Out'}
        </span>
      </div>

      {/* Price */}
      <div className="flex flex-wrap items-end gap-3 py-1">
        <span
          className="text-3xl sm:text-4xl font-bold text-[#DFC18A]"
          style={{ fontFamily: 'serif' }}
        >
          ₹{displayPrice.toLocaleString('en-IN')}
        </span>
        {originalPrice > displayPrice && (
          <span className="text-base text-[#8E7B6F] line-through font-light pb-1">
            ₹{originalPrice.toLocaleString('en-IN')}
          </span>
        )}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#35221B] to-transparent" />

      {/* Size Selector */}
      <div className="space-y-2.5">
        <label className="text-[11px] font-semibold uppercase tracking-widest text-[#DFC18A] flex items-center gap-1.5">
          <Tag className="w-3 h-3" />
          Drape Length &amp; Blouse
        </label>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => setSelectedSize(sz)}
              className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all border cursor-pointer ${
                selectedSize === sz
                  ? 'bg-[#DFC18A]/15 border-[#DFC18A] text-[#DFC18A] shadow-[0_0_10px_rgba(223,193,138,0.2)]'
                  : 'bg-[#1A100C] border-[#35221B] text-[#8E7B6F] hover:border-[#DFC18A]/50 hover:text-[#C7B5A7]'
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Quantity Selector */}
      <div className="space-y-2.5">
        <label className="text-[11px] font-semibold uppercase tracking-widest text-[#DFC18A]">
          Quantity
        </label>
        <div className="flex items-center w-fit border border-[#35221B] rounded-xl overflow-hidden bg-[#1A100C]">
          <button
            type="button"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            className="w-11 h-11 flex items-center justify-center text-[#DFC18A] hover:bg-[#DFC18A]/10 transition-colors disabled:opacity-30 cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-12 text-center text-sm font-semibold text-[#FDF8F4] border-x border-[#35221B]">
            {qty}
          </span>
          <button
            type="button"
            onClick={() => setQty((q) => Math.min(product.stock || 99, q + 1))}
            disabled={qty >= (product.stock || 99)}
            className="w-11 h-11 flex items-center justify-center text-[#DFC18A] hover:bg-[#DFC18A]/10 transition-colors disabled:opacity-30 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      {inStock ? (
        <div className="flex flex-col sm:flex-row gap-3 pt-1">
          {/* Add to Cart */}
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl border-2 border-[#DFC18A] bg-transparent hover:bg-[#DFC18A]/10 text-[#DFC18A] font-semibold text-sm uppercase tracking-wider transition-all duration-200 group cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Add to Cart
          </button>

          {/* Buy Now */}
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#C86A27] hover:bg-[#DB7B32] text-white font-semibold text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_4px_20px_rgba(200,106,39,0.4)] group cursor-pointer"
          >
            <Zap className="w-4 h-4 group-hover:scale-110 transition-transform" />
            Buy Now
          </button>
        </div>
      ) : (
        <div className="py-4 px-6 rounded-xl bg-[#1A100C] border border-[#35221B] text-center text-sm text-[#8E7B6F] uppercase tracking-wider font-medium">
          Currently Sold Out
        </div>
      )}

      {/* Add to Cart Toast */}
      <AnimatePresence>
        {addedToCart && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#1A100C] border border-[#C86A27]/50 text-sm"
          >
            <Check className="w-4 h-4 text-[#C86A27] shrink-0" />
            <span className="text-[#DFC18A] text-xs">Added to your cart!</span>
            <button
              type="button"
              onClick={() => navigate('/cart')}
              className="ml-auto text-[#C86A27] text-xs font-semibold hover:underline cursor-pointer"
            >
              View Cart →
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {[
          {
            icon: <ShieldCheck className="w-4 h-4 text-[#DFC18A] shrink-0" />,
            text: '100% Pure Silk Certified',
          },
          {
            icon: <Truck className="w-4 h-4 text-[#DFC18A] shrink-0" />,
            text: 'Free Pan-India Delivery',
          },
          {
            icon: <RotateCcw className="w-4 h-4 text-[#DFC18A] shrink-0" />,
            text: '7-Day Easy Returns',
          },
          {
            icon: <Award className="w-4 h-4 text-[#DFC18A] shrink-0" />,
            text: 'Silk Mark Assured',
          },
        ].map((b, i) => (
          <div
            key={i}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#1A100C] border border-[#2A1B15]"
          >
            {b.icon}
            <span className="text-[11px] text-[#C7B5A7] leading-tight">
              {b.text}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

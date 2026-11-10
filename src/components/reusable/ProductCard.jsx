import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star, Check, Zap } from 'lucide-react';
import useCart from '../../hooks/useCart';
import { getProductImage } from '../../utils/productHelpers';

export default function ProductCard({
  product,
  badge = null,
  rating = 4.9,
  reviewsCount = 124,
  originalPrice = null
}) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isLiked, setIsLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fallbackImage =
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600';
  const imageUrl = imgError ? fallbackImage : getProductImage(product);

  // Handle discount_price vs regular price
  const hasDiscount = Boolean(product?.discount_price && Number(product.discount_price) < Number(product.price));
  const displayPrice = hasDiscount ? Number(product.discount_price) : (Number(product?.price) || 0);
  const displayOriginalPrice = hasDiscount
    ? Number(product.price)
    : (originalPrice || product?.originalPrice || (displayPrice > 0 ? Math.round(displayPrice * 1.25) : null));

  // Derive badge if not passed explicitly
  const calcDiscountPercent = hasDiscount
    ? `${Math.round(((Number(product.price) - Number(product.discount_price)) / Number(product.price)) * 100)}% OFF`
    : null;
  const displayBadge = badge || product?.badge || calcDiscountPercent;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    navigate('/cart');
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked((prev) => !prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="group relative flex flex-col h-full bg-[#1E130F] border border-[#35221B] rounded-xl sm:rounded-2xl overflow-hidden hover:border-[#DFC18A]/40 transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
    >
      {/* ── IMAGE WRAPPER ── */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#160E0B] flex items-center justify-center p-1.5 sm:p-2">
        <Link to={`/products/${product.id}`} className="relative z-10 w-full h-full block">
          <img
            src={imageUrl}
            alt={product.name || 'Saree'}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center rounded-lg sm:rounded-xl transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Top-Left Tag Badge (Bestseller / 20% OFF) */}
        {displayBadge && (
          <span
            className={`absolute top-3 left-3 z-20 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow ${
              displayBadge.includes('%')
                ? 'bg-[#C86A27]/90 text-white'
                : 'bg-[#C86A27] text-white'
            }`}
          >
            {displayBadge}
          </span>
        )}

        {/* Top-Right Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          type="button"
          aria-label="Save to Wishlist"
          className="absolute top-3 right-3 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#160E0B]/70 backdrop-blur-md flex items-center justify-center text-[#C7B5A7] hover:text-[#C86A27] transition-colors shadow cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isLiked ? 'fill-[#C86A27] text-[#C86A27]' : 'stroke-[1.8]'
            }`}
          />
        </button>

        {/* Out of Stock Overlay */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/75 flex items-center justify-center z-20">
            <span className="font-bold text-[10px] sm:text-xs uppercase tracking-widest text-[#DFC18A] border border-[#DFC18A]/50 px-3 py-1 rounded-full bg-[#1E130F]">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* ── PRODUCT DETAILS ── */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div>
          {/* Title */}
          <Link
            to={`/products/${product.id}`}
            className="block font-sans text-xs sm:text-sm font-semibold text-[#FDF8F4] hover:text-[#DFC18A] transition-colors line-clamp-1 leading-snug"
          >
            {product.name}
          </Link>

          {/* Pricing Row */}
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-sm sm:text-base font-bold text-[#DFC18A]">
              ₹{displayPrice.toLocaleString('en-IN')}
            </span>
            {displayOriginalPrice > displayPrice && (
              <span className="text-[11px] sm:text-xs text-[#8E7B6F] line-through font-normal">
                ₹{displayOriginalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Star Rating */}
          <div className="flex items-center gap-1 mt-1.5">
            <div className="flex text-[#DFC18A]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current text-[#DFC18A]" />
              ))}
            </div>
            <span className="text-[10px] text-[#8E7B6F] font-medium ml-0.5">
              ({reviewsCount || 89})
            </span>
          </div>
        </div>

        {/* Action Buttons: Add to Cart & Buy Now */}
        <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-2 border-t border-[#2D1B15] mt-auto">
          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            type="button"
            aria-label="Add to cart"
            className="flex items-center justify-center gap-1 py-2 px-1 sm:px-2 rounded-lg border border-[#DFC18A]/40 bg-transparent hover:bg-[#DFC18A]/10 text-[#DFC18A] text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            title="Add to Cart"
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#DFC18A]" />
                <span className="truncate">Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 stroke-[2]" />
                <span className="truncate">Add</span>
              </>
            )}
          </button>

          {/* Buy Now button */}
          <button
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
            type="button"
            aria-label="Buy now"
            className="flex items-center justify-center gap-1 py-2 px-1 sm:px-2 rounded-lg bg-[#C86A27] hover:bg-[#DB7B32] text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group"
            title="Buy Now"
          >
            <Zap className="w-3.5 h-3.5 fill-current group-hover:scale-110 transition-transform" />
            <span className="truncate">Buy Now</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

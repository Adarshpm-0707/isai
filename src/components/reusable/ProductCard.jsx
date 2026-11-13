import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star, Check, Zap, Sparkles } from 'lucide-react';
import useCart from '../../hooks/useCart';
import useWishlist from '../../hooks/useWishlist';
import { getProductImage } from '../../utils/productHelpers';

export default function ProductCard({
  product,
  badge = null,
  rating = null,
  reviewsCount = null,
  originalPrice = null,
}) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Safe wishlist integration
  let wishlist = null;
  try {
    wishlist = useWishlist();
  } catch {
    wishlist = null;
  }

  const [localLiked, setLocalLiked] = useState(false);

  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  const fallbackImage =
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600';
  const imageUrl = imgError ? fallbackImage : getProductImage(product);

  // Handle discount_price vs regular price
  const hasDiscount = Boolean(
    product?.discount_price && Number(product.discount_price) < Number(product.price)
  );
  const displayPrice = hasDiscount
    ? Number(product.discount_price)
    : (Number(product?.price) || 0);

  // Real original price from database only (no artificial 1.25x calculation)
  const rawOriginal = originalPrice || product?.originalPrice || product?.original_price;
  const displayOriginalPrice = hasDiscount
    ? Number(product.price)
    : (rawOriginal && Number(rawOriginal) > displayPrice ? Number(rawOriginal) : null);

  // Derive discount percentage badge if applicable
  const discountPercentValue = hasDiscount
    ? Math.round(((Number(product.price) - Number(product.discount_price)) / Number(product.price)) * 100)
    : null;
  const calcDiscountPercent = discountPercentValue ? `${discountPercentValue}% OFF` : null;
  const displayBadge = badge || product?.badge || calcDiscountPercent;

  // Real rating from database only (no artificial 0.0 or 124 reviews)
  const productRating =
    product?.rating !== undefined && product?.rating !== null && Number(product.rating) > 0
      ? Number(product.rating)
      : (rating && Number(rating) > 0 ? Number(rating) : null);
  const displayReviews = product?.review_count || product?.reviewsCount || reviewsCount || null;
  const showRating = Boolean(productRating);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    navigate('/cart');
  };

  const isLiked = wishlist?.isInWishlist ? wishlist.isInWishlist(product?.id) : localLiked;

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (wishlist?.toggleWishlist) {
      try {
        await wishlist.toggleWishlist(product);
        return;
      } catch {
        // Fall back to local liked state if error
      }
    }
    setLocalLiked((prev) => !prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="group relative flex flex-col h-full bg-[#1A100C] border border-[#38241D] rounded-2xl sm:rounded-[22px] overflow-hidden transition-all duration-300 hover:border-[#DFC18A]/60 hover:shadow-[0_16px_36px_rgba(0,0,0,0.65),0_0_24px_rgba(223,193,138,0.12)] hover:-translate-y-1"
    >
      {/* Golden hairline glow on hover */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#DFC18A] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-30 pointer-events-none" />

      {/* ── IMAGE WRAPPER (Edge-to-Edge, Seamless & Responsive) ── */}
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#140C0A] select-none">
        <Link
          to={`/products/${product.id}`}
          className="relative z-10 w-full h-full block cursor-pointer overflow-hidden"
        >
          <img
            src={imageUrl}
            alt={product.name || 'Handcrafted Saree'}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
          />
        </Link>

        {/* Soft bottom vignette blending image smoothly into card */}
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-[#1A100C] via-[#1A100C]/40 to-transparent pointer-events-none z-10" />

        {/* Top-Left Floating Badge (Discount or Curated Tag) */}
        {displayBadge && (
          <div className="absolute top-2.5 left-2.5 z-20 pointer-events-none">
            {displayBadge.includes('%') ? (
              <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#C86A27] via-[#D87428] to-[#E58535] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 sm:py-1 rounded-full shadow-[0_4px_12px_rgba(200,106,39,0.5)] border border-white/20">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{displayBadge}</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-[#140C09]/90 backdrop-blur-md text-[#DFC18A] border border-[#DFC18A]/40 text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 sm:py-1 rounded-full shadow-md">
                {displayBadge}
              </span>
            )}
          </div>
        )}

        {/* Top-Right Wishlist Heart Button */}
        <button
          onClick={handleToggleWishlist}
          type="button"
          aria-label={isLiked ? 'Remove from Wishlist' : 'Save to Wishlist'}
          className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer active:scale-90 ${
            isLiked
              ? 'bg-[#E05353]/20 border border-[#E05353]/70 text-[#E05353] shadow-[0_0_12px_rgba(224,83,83,0.35)]'
              : 'bg-[#140C09]/80 border border-[#3A261E] text-[#C7B5A7] hover:text-[#DFC18A] hover:border-[#DFC18A]/50'
          }`}
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isLiked ? 'fill-[#E05353] text-[#E05353]' : 'stroke-[1.8]'
            }`}
          />
        </button>

        {/* Stock Alert Badge (Floating bottom-left on image so it doesn't crowd the category text!) */}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-none">
            <span className="text-[9px] font-semibold text-[#E58535] bg-[#140C09]/90 backdrop-blur-md border border-[#E58535]/50 px-2 py-0.5 rounded-full shadow-md">
              Only {product.stock} left
            </span>
          </div>
        )}

        {/* Out of Stock Overlay */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-[#120B09]/85 backdrop-blur-[2px] flex items-center justify-center z-20">
            <span className="font-serif text-[10px] sm:text-xs uppercase tracking-widest text-[#DFC18A] border border-[#DFC18A]/60 px-3.5 py-1.5 rounded-full bg-[#1E130F] shadow-xl">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* ── PRODUCT DETAILS ── */}
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2.5">
        <div className="space-y-1 sm:space-y-1.5">
          {/* Micro Category Tag (Full width - No ellipsis truncation!) */}
          <div className="text-[10px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase text-[#DFC18A]/85 truncate leading-tight">
            {product.category || 'Pure Handloom'}
          </div>

          {/* Product Title */}
          <Link
            to={`/products/${product.id}`}
            className="block font-serif text-xs sm:text-sm md:text-[15px] font-medium text-[#FDF8F4] hover:text-[#DFC18A] transition-colors line-clamp-1 leading-snug tracking-tight"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Star Rating & Review Count (Rendered only when real rating exists) */}
          {showRating && (
            <div className="flex items-center gap-1.5 pt-0.5">
              <div className="flex text-[#DFC18A] items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${
                      i < Math.round(productRating)
                        ? 'fill-current text-[#DFC18A]'
                        : 'text-[#5A4034]'
                    }`}
                  />
                ))}
              </div>
              <span className="text-[11px] font-bold text-[#DFC18A]">
                {productRating.toFixed(1)}
              </span>
              {displayReviews && (
                <span className="text-[10px] text-[#8E7B6F]">
                  ({displayReviews})
                </span>
              )}
            </div>
          )}

          {/* Pricing Row */}
          <div className="flex items-baseline flex-wrap gap-1.5 sm:gap-2 pt-0.5">
            <span className="text-sm sm:text-base md:text-lg font-bold text-[#DFC18A] tracking-tight">
              ₹{displayPrice.toLocaleString('en-IN')}
            </span>
            {displayOriginalPrice && displayOriginalPrice > displayPrice && (
              <span className="text-[11px] sm:text-xs text-[#8E7B6F] line-through font-normal">
                ₹{displayOriginalPrice.toLocaleString('en-IN')}
              </span>
            )}
            {displayOriginalPrice && displayOriginalPrice > displayPrice && (
              <span className="text-[9px] sm:text-[10px] font-bold text-[#C86A27] bg-[#C86A27]/15 border border-[#C86A27]/30 px-1.5 py-0.5 rounded">
                Save ₹{(displayOriginalPrice - displayPrice).toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* ── ACTION BUTTONS: FULLY RESPONSIVE (Zero Truncation on Mobile & Laptop) ── */}
        <div className="flex items-center gap-1.5 sm:gap-2 pt-2 border-t border-[#2D1B15] mt-auto">
          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            type="button"
            aria-label="Add to cart"
            className={`h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl border text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95 flex items-center justify-center shrink-0 ${
              added
                ? 'bg-[#2A4428] text-[#8CE280] border-[#488440]'
                : 'border-[#DFC18A]/40 bg-[#170E0B] hover:bg-[#DFC18A]/15 text-[#DFC18A]'
            }`}
            title="Add to Cart"
          >
            {added ? (
              <Check className="w-4 h-4 text-[#8CE280]" />
            ) : (
              <ShoppingBag className="w-4 h-4 stroke-[2]" />
            )}
            <span className="hidden sm:inline ml-1.5">{added ? 'Added' : 'Add'}</span>
          </button>

          {/* Buy Now button */}
          <button
            onClick={handleBuyNow}
            disabled={product.stock <= 0}
            type="button"
            aria-label="Buy now"
            className="flex-1 h-9 sm:h-10 px-2 sm:px-3 rounded-xl bg-gradient-to-r from-[#C86A27] via-[#D87428] to-[#E58535] hover:from-[#DB7B32] hover:to-[#EB9142] text-white text-[11px] sm:text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-[0_4px_14px_rgba(200,106,39,0.35)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed group/buy active:scale-95 flex items-center justify-center gap-1"
            title="Buy Now"
          >
            <Zap className="w-3.5 h-3.5 shrink-0 fill-current group-hover/buy:scale-110 transition-transform" />
            <span className="whitespace-nowrap">Buy Now</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}

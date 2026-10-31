import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Star, Check } from 'lucide-react';
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

  // Compute calculated or passed original price
  const displayPrice = product?.price || 4999;
  const displayOriginalPrice =
    originalPrice || product?.originalPrice || Math.round(displayPrice * 1.35);

  // Derive badge if not passed explicitly
  const displayBadge =
    badge ||
    product?.badge ||
    (displayPrice > 5000 ? 'Bestseller' : displayPrice < 2500 ? '20% OFF' : null);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked((prev) => !prev);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4 }}
      className="group relative flex flex-col h-full bg-[#1E130F] border border-[#35221B] rounded-xl sm:rounded-2xl overflow-hidden hover:border-[#DFC18A]/40 transition-all duration-300 hover:shadow-[0_12px_32px_rgba(0,0,0,0.5)]"
    >
      {/* ── IMAGE WRAPPER ── */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#160E0B] flex items-center justify-center p-1.5 sm:p-2">
        <Link to={`/products/${product.id}`} className="relative z-10 w-full h-full block">
          <img
            src={imageUrl}
            alt={product.name || 'Saree'}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center rounded-lg sm:rounded-xl transition-transform duration-700 group-hover:scale-108"
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
          className="absolute top-3 right-3 z-20 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#160E0B]/70 backdrop-blur-md flex items-center justify-center text-[#C7B5A7] hover:text-[#C86A27] transition-colors shadow"
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
      <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between gap-2">
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
            <span className="text-sm sm:text-base font-bold text-[#FDF8F4]">
              ₹{displayPrice.toLocaleString('en-IN')}
            </span>
            {displayOriginalPrice > displayPrice && (
              <span className="text-[11px] sm:text-xs text-[#8E7B6F] line-through font-normal">
                ₹{displayOriginalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>

        {/* Rating and Cart Button Row */}
        <div className="flex items-center justify-between pt-1 border-t border-[#2D1B15] mt-auto">
          {/* Star Rating */}
          <div className="flex items-center gap-1">
            <div className="flex text-[#DFC18A]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current text-[#DFC18A]" />
              ))}
            </div>
            <span className="text-[10px] text-[#8E7B6F] font-medium ml-0.5">
              ({reviewsCount || 89})
            </span>
          </div>

          {/* Amber Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.stock <= 0}
            type="button"
            aria-label="Add to cart"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-[#C86A27] hover:bg-[#DB7B32] text-white flex items-center justify-center transition-all duration-200 cursor-pointer shadow disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            title="Add to Cart"
          >
            {added ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <ShoppingBag className="w-4 h-4 stroke-[2]" />
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

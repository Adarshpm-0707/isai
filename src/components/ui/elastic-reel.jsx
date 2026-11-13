import React, { useState, useRef, useImperativeHandle, forwardRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Sparkles, ShoppingBag, Zap, Star, Check, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import { getProductImage } from '../../utils/productHelpers';

/**
 * Elastic Reel Component (React Bits Pro Inspired)
 * A dock of photo slices that dynamically swell open into full images
 */
export const ElasticReel = forwardRef(function ElasticReel(
  {
    items = [],
    initialIndex = 0,
    autoPlay = false,
    autoPlayInterval = 4000,
    className = '',
    onOpen = null,
    onClose = null,
  },
  ref
) {
  const [activeIndex, setActiveIndex] = useState(
    initialIndex !== null && initialIndex >= 0 && initialIndex < items.length ? initialIndex : 0
  );
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [addedItemMap, setAddedItemMap] = useState({});

  // Imperative Ref API (matches React Bits Pro ref spec: open(index), close(), next())
  useImperativeHandle(ref, () => ({
    open: (index) => {
      if (index >= 0 && index < items.length) {
        setActiveIndex(index);
        if (onOpen) onOpen(items[index], index);
      }
    },
    close: () => {
      setActiveIndex(null);
      if (onClose) onClose();
    },
    next: () => {
      setActiveIndex((prev) => {
        const nextIdx = prev === null ? 0 : (prev + 1) % items.length;
        if (onOpen) onOpen(items[nextIdx], nextIdx);
        return nextIdx;
      });
    },
    prev: () => {
      setActiveIndex((prev) => {
        const prevIdx = prev === null ? items.length - 1 : (prev - 1 + items.length) % items.length;
        if (onOpen) onOpen(items[prevIdx], prevIdx);
        return prevIdx;
      });
    },
  }));

  // AutoPlay support
  useEffect(() => {
    if (!autoPlay || items.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === null ? 0 : (prev + 1) % items.length));
    }, autoPlayInterval);
    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, items.length]);

  const handleSelect = (index) => {
    setActiveIndex(index);
    if (onOpen) onOpen(items[index], index);
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product || product.stock <= 0) return;
    addToCart(product, 1);
    setAddedItemMap((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItemMap((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  const handleBuyNow = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product || product.stock <= 0) return;
    addToCart(product, 1);
    navigate('/cart');
  };

  if (!items || items.length === 0) return null;

  return (
    <div className={`relative w-full ${className}`}>
      {/* ── THE ELASTIC REEL DOCK ── */}
      <div
        ref={containerRef}
        className="flex items-stretch gap-2 sm:gap-3 lg:gap-4 h-[440px] sm:h-[500px] md:h-[540px] lg:h-[580px] w-full overflow-x-auto no-scrollbar py-2 px-1 select-none"
      >
        {items.map((product, index) => {
          const isActive = activeIndex === index;
          const isHovered = hoveredIndex === index && !isActive;
          const imageUrl = getProductImage(product);
          const hasDiscount = Boolean(
            product?.discount_price && Number(product.discount_price) < Number(product.price)
          );
          const displayPrice = hasDiscount
            ? Number(product.discount_price)
            : Number(product?.price) || 0;
          const rawOriginal = product?.originalPrice || product?.original_price;
          const displayOriginalPrice = hasDiscount
            ? Number(product.price)
            : (rawOriginal && Number(rawOriginal) > displayPrice ? Number(rawOriginal) : null);
          const discountPercent = hasDiscount
            ? `${Math.round(((Number(product.price) - Number(product.discount_price)) / Number(product.price)) * 100)}% OFF`
            : null;
          const displayBadge = product?.badge || discountPercent;
          const isAdded = addedItemMap[product.id];
          const prodRating =
            product?.rating !== undefined && product?.rating !== null && Number(product.rating) > 0
              ? Number(product.rating)
              : null;
          const prodReviews = product?.review_count || product?.reviewsCount || null;

          return (
            <motion.div
              key={product.id || index}
              onClick={() => handleSelect(index)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              layout
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 28,
                mass: 0.8,
              }}
              className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border transition-colors duration-300 ${
                isActive
                  ? 'flex-[4] min-w-[270px] sm:min-w-[360px] md:min-w-[420px] lg:min-w-[500px] border-[#DFC18A]/60 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(223,193,138,0.15)] bg-gradient-to-b from-[#1C120E] via-[#160E0B] to-[#120B08]'
                  : isHovered
                  ? 'flex-[0.8] min-w-[56px] sm:min-w-[80px] md:min-w-[96px] border-[#DFC18A]/40 bg-[#1A100C] cursor-pointer shadow-lg'
                  : 'flex-[0.5] min-w-[48px] sm:min-w-[64px] md:min-w-[76px] border-[#35221B] bg-[#140C0A] cursor-pointer opacity-80 hover:opacity-100 hover:border-[#DFC18A]/30'
              }`}
            >
              {/* ── BACKGROUND PHOTO SLICE (FOR COLLAPSED STATE) ── */}
              {!isActive && (
                <div className="absolute inset-0 w-full h-full">
                  <img
                    src={imageUrl}
                    alt={product.name || 'Saree slice'}
                    className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.05] transition-transform duration-500 hover:scale-105"
                  />
                  {/* Dark luxury gradient veil */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#120B09] via-[#120B09]/60 to-[#120B09]/30" />

                  {/* Top slice indicator badge */}
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="w-6 h-6 rounded-full bg-[#120B09]/80 backdrop-blur-md border border-[#DFC18A]/40 flex items-center justify-center text-[10px] font-bold text-[#DFC18A]">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Vertical Saree Name on slice */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
                    <span
                      className="text-[11px] sm:text-xs font-serif font-medium text-[#FDF8F4] tracking-widest uppercase whitespace-nowrap"
                      style={{
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                      }}
                    >
                      {product.name}
                    </span>
                    <span className="w-1 h-6 bg-[#DFC18A]/40 rounded-full mt-1" />
                  </div>
                </div>
              )}

              {/* ── FULL SWELLED CONTENT (WHEN ACTIVE) ── */}
              {isActive && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  className="relative w-full h-full flex flex-col md:flex-row p-3 sm:p-5 lg:p-6 gap-3 sm:gap-5 lg:gap-6 overflow-hidden"
                >
                  {/* Hairline gold glow along the top edge */}
                  <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#DFC18A] to-transparent pointer-events-none" />

                  {/* ── LEFT / TOP: PRODUCT IMAGE (Edge-to-Edge & Responsive) ── */}
                  <div className="relative w-full md:w-1/2 h-[210px] sm:h-[260px] md:h-full rounded-xl sm:rounded-2xl overflow-hidden bg-[#140C0A] shrink-0 select-none">
                    <Link
                      to={`/products/${product.id}`}
                      className="relative z-10 w-full h-full block cursor-pointer overflow-hidden"
                    >
                      <img
                        src={imageUrl}
                        alt={product.name || 'Handcrafted Saree'}
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out hover:scale-106"
                      />
                    </Link>

                    {/* Gradient transition into card */}
                    <div className="absolute inset-x-0 bottom-0 h-14 md:hidden bg-gradient-to-t from-[#160E0B] via-[#160E0B]/50 to-transparent pointer-events-none z-10" />
                    <div className="hidden md:block absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#160E0B] via-[#160E0B]/50 to-transparent pointer-events-none z-10" />

                    {/* Floating Badges */}
                    {displayBadge && (
                      <div className="absolute top-3 left-3 z-20">
                        <span className="inline-flex items-center gap-1 bg-gradient-to-r from-[#C86A27] to-[#E58535] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-[0_4px_12px_rgba(200,106,39,0.5)] border border-white/20">
                          <Sparkles className="w-2.5 h-2.5" />
                          <span>{displayBadge}</span>
                        </span>
                      </div>
                    )}

                    {/* Reel Index Pill */}
                    <div className="absolute top-3 right-3 z-20">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#120B09]/80 backdrop-blur-md border border-[#DFC18A]/40 text-[10px] font-bold text-[#DFC18A]">
                        {index + 1} / {items.length}
                      </span>
                    </div>

                    {/* Sold out overlay */}
                    {product.stock <= 0 && (
                      <div className="absolute inset-0 bg-[#120B09]/85 backdrop-blur-sm flex items-center justify-center z-20">
                        <span className="font-serif text-xs uppercase tracking-widest text-[#DFC18A] border border-[#DFC18A]/60 px-4 py-1.5 rounded-full bg-[#1E130F]">
                          Sold Out
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ── RIGHT / BOTTOM: PRODUCT DETAILS & ACTIONS ── */}
                  <div className="flex-1 flex flex-col justify-between gap-2.5 sm:gap-4 md:py-1">
                    <div className="space-y-1.5 sm:space-y-2.5">
                      {/* Eyebrow Category Tag & Stock */}
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#DFC18A]">
                          {product.category || 'Handcrafted Heritage'}
                        </span>
                        {product.stock > 0 && product.stock <= 5 ? (
                          <span className="text-[9px] font-semibold text-[#E58535] bg-[#E58535]/15 border border-[#E58535]/30 px-2 py-0.5 rounded-full">
                            Only {product.stock} left
                          </span>
                        ) : (
                          <span className="text-[9px] font-semibold text-[#8CE280] bg-[#8CE280]/10 border border-[#8CE280]/30 px-2 py-0.5 rounded-full">
                            In Stock
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <Link
                        to={`/products/${product.id}`}
                        className="block font-serif text-base sm:text-xl lg:text-2xl font-normal text-[#FDF8F4] hover:text-[#DFC18A] transition-colors line-clamp-1 leading-snug"
                        style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
                      >
                        {product.name}
                      </Link>

                      {/* Description snippet */}
                      <p className="text-xs sm:text-sm text-[#C7B5A7] font-light line-clamp-2 leading-relaxed">
                        {product.description ||
                          'Authentic master weaver drape woven with pure zari, luminous silk sheen, and traditional artisan motifs.'}
                      </p>

                      {/* Rating & Reviews (only when available in database) */}
                      {prodRating && (
                        <div className="flex items-center gap-1.5 pt-0.5">
                          <div className="flex text-[#DFC18A] items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < Math.round(prodRating)
                                    ? 'fill-current text-[#DFC18A]'
                                    : 'text-[#5A4034]'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs font-bold text-[#DFC18A]">
                            {prodRating.toFixed(1)}
                          </span>
                          {prodReviews && (
                            <span className="text-xs text-[#8E7B6F]">
                              ({prodReviews} reviews)
                            </span>
                          )}
                        </div>
                      )}

                      {/* Pricing Row */}
                      <div className="flex items-baseline flex-wrap gap-2.5 pt-1.5">
                        <span className="text-lg sm:text-2xl lg:text-3xl font-bold text-[#DFC18A] tracking-tight">
                          ₹{displayPrice.toLocaleString('en-IN')}
                        </span>
                        {displayOriginalPrice && displayOriginalPrice > displayPrice && (
                          <span className="text-xs sm:text-sm text-[#8E7B6F] line-through font-normal">
                            ₹{displayOriginalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                        {displayOriginalPrice && displayOriginalPrice > displayPrice && (
                          <span className="text-[10px] sm:text-xs font-bold text-[#C86A27] bg-[#C86A27]/15 border border-[#C86A27]/30 px-2 py-0.5 rounded-md">
                            Save ₹{(displayOriginalPrice - displayPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons: Add to Cart & Buy Now + View Details Link */}
                    <div className="space-y-2 pt-2 border-t border-[#2F1D16] mt-auto">
                      <div className="grid grid-cols-2 gap-2 sm:gap-3">
                        <button
                          onClick={(e) => handleAddToCart(e, product)}
                          disabled={product.stock <= 0}
                          type="button"
                          className={`flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95 ${
                            isAdded
                              ? 'bg-[#2A4428] text-[#8CE280] border border-[#488440]'
                              : 'border border-[#DFC18A]/50 bg-[#170E0B] hover:bg-[#DFC18A]/15 text-[#DFC18A]'
                          }`}
                        >
                          {isAdded ? (
                            <>
                              <Check className="w-4 h-4 shrink-0" />
                              <span>Added</span>
                            </>
                          ) : (
                            <>
                              <ShoppingBag className="w-4 h-4 shrink-0" />
                              <span>Add to Cart</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={(e) => handleBuyNow(e, product)}
                          disabled={product.stock <= 0}
                          type="button"
                          className="flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 rounded-xl bg-gradient-to-r from-[#C86A27] via-[#D87428] to-[#E58535] hover:from-[#DB7B32] hover:to-[#EB9142] text-white text-xs sm:text-sm font-semibold uppercase tracking-wider transition-all duration-200 shadow-[0_4px_16px_rgba(200,106,39,0.35)] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed active:scale-95"
                        >
                          <Zap className="w-4 h-4 shrink-0 fill-current" />
                          <span>Buy Now</span>
                        </button>
                      </div>

                      {/* View Complete Product Page Link */}
                      <Link
                        to={`/products/${product.id}`}
                        className="flex items-center justify-center gap-1.5 py-1 text-xs text-[#DFC18A]/80 hover:text-[#DFC18A] font-medium transition-colors group/view"
                      >
                        <span>View Full Product Details & Weave Specs</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/view:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* ── NAVIGATION CONTROLS & DOCK INDICATORS ── */}
      <div className="flex items-center justify-between mt-5 px-2">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => {
            setActiveIndex((prev) => (prev === null ? items.length - 1 : (prev - 1 + items.length) % items.length));
          }}
          aria-label="Previous saree"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#DFC18A]/40 bg-[#1A100C]/90 hover:bg-[#DFC18A] hover:text-[#120B09] text-[#DFC18A] flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer active:scale-90"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Center Dots */}
        <div className="flex items-center gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === i
                  ? 'w-8 bg-gradient-to-r from-[#DFC18A] to-[#E58535] shadow-[0_0_10px_rgba(223,193,138,0.5)]'
                  : 'w-2 bg-[#35221B] hover:bg-[#DFC18A]/50'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => {
            setActiveIndex((prev) => (prev === null ? 0 : (prev + 1) % items.length));
          }}
          aria-label="Next saree"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-[#DFC18A]/40 bg-[#1A100C]/90 hover:bg-[#DFC18A] hover:text-[#120B09] text-[#DFC18A] flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer active:scale-90"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
});

export default ElasticReel;


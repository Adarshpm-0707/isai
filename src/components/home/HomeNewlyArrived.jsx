import React, { useRef, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ChevronLeft, ChevronRight, Heart, MoveHorizontal } from 'lucide-react';
import { LotusEmblem } from '../reusable/BrandLogo';
import ProductSectionHeader from '../reusable/ProductSectionHeader';
import formatPrice from '../../utils/formatPrice';
import { getProductImage } from '../../utils/productHelpers';
import useWishlist from '../../hooks/useWishlist';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable);
}

/**
 * Builds the GSAP seamless loop timeline.
 * Mathematically offsets and repeats elements across a master sequence so they smoothly loop forever.
 */
function buildSeamlessLoop(items, spacing, animateFunc) {
  const overlap = Math.ceil(1 / spacing);
  const startTime = items.length * spacing + 0.5;
  const loopTime = (items.length + overlap) * spacing + 1;
  const rawSequence = gsap.timeline({ paused: true });
  const seamlessLoop = gsap.timeline({
    paused: true,
    repeat: -1,
    onRepeat() {
      if (this._time === this._dur) {
        this._tTime += this._dur - 0.01;
      }
    },
  });
  const l = items.length + overlap * 2;

  for (let i = 0; i < l; i++) {
    const index = i % items.length;
    const time = i * spacing;
    rawSequence.add(animateFunc(items[index]), time);
    if (i <= items.length) {
      seamlessLoop.add('label' + i, time);
    }
  }

  rawSequence.time(startTime);
  seamlessLoop
    .to(rawSequence, {
      time: loopTime,
      duration: loopTime - startTime,
      ease: 'none',
    })
    .fromTo(
      rawSequence,
      { time: overlap * spacing + 1 },
      {
        time: startTime,
        duration: startTime - (overlap * spacing + 1),
        immediateRender: false,
        ease: 'none',
      }
    );

  return seamlessLoop;
}

/**
 * Calculate responsive horizontal spread (xPercent).
 * Spacing = 0.1, so deltaXPercent = 0.2 * xDistance.
 * - Mobile: xDistance = 350 => deltaX = 70% (clean symmetrical peek on both edges, center card 100% visible)
 * - Tablet: xDistance = 420 => deltaX = 84% (5 cards cascading gracefully across the tablet)
 * - Laptop: xDistance = 460 => deltaX = 92% (balanced luxury showroom spread with 8% overlap)
 */
function getResponsiveXPercent(width) {
  if (width < 380) return 320;  // small mobile: deltaX = 64%
  if (width < 640) return 350;  // regular mobile: deltaX = 70%
  if (width < 768) return 390;  // large mobile: deltaX = 78%
  if (width < 1024) return 420; // tablet: deltaX = 84%
  if (width < 1440) return 460; // laptop: deltaX = 92%
  return 490;                   // wide desktop: deltaX = 98%
}

export default function HomeNewlyArrived({ newlyArrivedProducts = [] }) {
  const navigate = useNavigate();

  // Safe wishlist context access
  let wishlist = null;
  try {
    wishlist = useWishlist();
  } catch {
    wishlist = null;
  }

  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  const sectionRef = useRef(null);
  const galleryRef = useRef(null);
  const cardsRef = useRef(null);
  const dragProxyRef = useRef(null);
  const scrubRef = useRef(null);
  const snapTimeRef = useRef(null);
  const isDraggingRef = useRef(false);
  const dragDistanceRef = useRef(0);
  const manualOffsetRef = useRef(0);

  // Responsive resize watcher with debounce
  useEffect(() => {
    let timer;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setWindowWidth(window.innerWidth);
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  // Guarantee at least 14 cards so spacing of 0.1 seamlessly fills the loop with no empty slots
  const displayCards = useMemo(() => {
    if (!newlyArrivedProducts || newlyArrivedProducts.length === 0) return [];
    let list = [...newlyArrivedProducts];
    while (list.length < 14) {
      list = [...list, ...newlyArrivedProducts];
    }
    return list.slice(0, Math.max(14, newlyArrivedProducts.length));
  }, [newlyArrivedProducts]);

  useEffect(() => {
    if (!galleryRef.current || !cardsRef.current || displayCards.length === 0) return;

    const currentWidth = window.innerWidth;
    const xDistance = getResponsiveXPercent(currentWidth);

    const ctx = gsap.context(() => {
      const cardElements = gsap.utils.toArray('.cards li', galleryRef.current);
      if (!cardElements.length) return;

      // Set initial state of items
      gsap.set(cardElements, { xPercent: xDistance, opacity: 0, scale: 0.5 });

      const spacing = 0.1;
      const snapTime = gsap.utils.snap(spacing);
      snapTimeRef.current = snapTime;

      // Function called for each element to build the scale/opacity & responsive horizontal travel
      const animateFunc = (element) => {
        const tl = gsap.timeline();
        tl.fromTo(
          element,
          { scale: 0.5, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            zIndex: 100,
            duration: 0.5,
            yoyo: true,
            repeat: 1,
            ease: 'power1.inOut',
            immediateRender: false,
          }
        ).fromTo(
          element,
          { xPercent: xDistance },
          { xPercent: -xDistance, duration: 1, ease: 'none', immediateRender: false },
          0
        );
        return tl;
      };

      const seamlessLoop = buildSeamlessLoop(cardElements, spacing, animateFunc);
      const playhead = { offset: 0 };
      const wrapTime = gsap.utils.wrap(0, seamlessLoop.duration());

      // Reusable tween to smoothly scrub playhead on the seamlessLoop
      const scrub = gsap.to(playhead, {
        offset: 0,
        onUpdate() {
          seamlessLoop.time(wrapTime(playhead.offset));
        },
        duration: 0.5,
        ease: 'power3',
        paused: true,
      });

      scrubRef.current = scrub;

      // Ensure active card 0 starts perfectly centered
      scrub.vars.offset = 0;
      scrub.invalidate().restart();

      // Dragging functionality (fully mobile touch & desktop drag friendly)
      if (dragProxyRef.current && galleryRef.current) {
        Draggable.create(dragProxyRef.current, {
          type: 'x',
          trigger: galleryRef.current,
          onPress() {
            dragDistanceRef.current = 0;
            isDraggingRef.current = true;
            this.startOffset = scrub.vars.offset;
          },
          onDrag() {
            dragDistanceRef.current = Math.abs(this.startX - this.x);
            // Calibrated drag sensitivity for effortless swipe on mobile and mouse
            const sensitivity = currentWidth < 640 ? 0.0016 : 0.0011;
            scrub.vars.offset = this.startOffset + (this.startX - this.x) * sensitivity;
            scrub.invalidate().restart();
          },
          onDragEnd() {
            setTimeout(() => {
              dragDistanceRef.current = 0;
              isDraggingRef.current = false;
            }, 80);
            const snapped = snapTime(scrub.vars.offset);
            manualOffsetRef.current = snapped;
            scrub.vars.offset = snapped;
            scrub.invalidate().restart();
          },
        });
      }
    }, galleryRef);

    return () => ctx.revert();
  }, [displayCards, windowWidth]);

  const handlePrev = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (!scrubRef.current || !snapTimeRef.current) return;
    const nextOffset = snapTimeRef.current(scrubRef.current.vars.offset - 0.1);
    manualOffsetRef.current = nextOffset;
    scrubRef.current.vars.offset = nextOffset;
    scrubRef.current.invalidate().restart();
  };

  const handleNext = (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    if (!scrubRef.current || !snapTimeRef.current) return;
    const nextOffset = snapTimeRef.current(scrubRef.current.vars.offset + 0.1);
    manualOffsetRef.current = nextOffset;
    scrubRef.current.vars.offset = nextOffset;
    scrubRef.current.invalidate().restart();
  };

  const handleCardClick = (product) => {
    // Prevent accidental navigation if the user was dragging
    if (dragDistanceRef.current > 6) return;
    navigate(`/products/${product.id}`);
  };

  const handleWishlistToggle = async (e, product) => {
    e.stopPropagation();
    e.preventDefault();
    if (wishlist?.toggleWishlist) {
      try {
        await wishlist.toggleWishlist(product);
      } catch (err) {
        console.warn('Wishlist toggle notice:', err);
      }
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#23140F] relative overflow-x-clip"
    >
      {/* ── TITLES SECTION: Elevated Royal Header ── */}
      <ProductSectionHeader
        badge="Fresh Off The Loom • Autumn Drops"
        badgeIcon={Sparkles}
        title="Newly Arrived"
        titleAccent="Treasures"
        subtitle="Be the first to drape our newest loom creations, showcasing contemporary palettes paired with traditional heritage zari."
        actionText="Explore All"
        actionLink="/products?sort=newest"
        hideMobileAction={true}
        className="mb-6 sm:mb-8 lg:mb-10"
      />

      {/* ── EMPTY STATE FALLBACK ── */}
      {newlyArrivedProducts.length === 0 ? (
        <div className="py-14 sm:py-16 px-4 sm:px-6 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#1A100C]/70 to-[#140C08]/90 border border-[#301F18] text-center max-w-xl mx-auto shadow-xl my-6">
          <LotusEmblem className="w-8 sm:w-9 h-8 sm:h-9 text-[#DFC18A] mx-auto mb-3 opacity-80" />
          <h3 className="font-serif text-base sm:text-lg lg:text-xl text-[#FDF8F4]">New Arrivals Coming Soon</h3>
          <p className="text-xs sm:text-sm text-[#A69385] mt-2 font-light max-w-md mx-auto">
            Newly created sarees added in the admin dashboard will automatically appear here.
          </p>
        </div>
      ) : (
        /* ── GSAP SEAMLESS LOOP 3D GALLERY (PERFECTLY ALIGNED & UNCLIPPED) ── */
        <div className="relative w-full overflow-visible py-2 sm:py-3">
          <div
            ref={galleryRef}
            className="gallery relative w-full h-[290px] sm:h-[340px] lg:h-[390px] select-none flex items-center justify-center overflow-visible"
          >
            {/* Ambient Radial Golden Glow Behind Active Center Card */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 sm:w-72 lg:w-96 h-48 sm:h-72 lg:h-96 bg-[#DFC18A]/[0.08] rounded-full blur-3xl pointer-events-none" />

            {/* Cards List - Centered via .cards CSS rules, avoiding Tailwind translate collisions */}
            <ul
              ref={cardsRef}
              className="cards p-0 m-0 list-none pointer-events-auto touch-pan-y"
            >
              {displayCards.map((product, index) => {
                const imageUrl = getProductImage(product);
                const hasDiscount = Boolean(
                  product?.discount_price && Number(product.discount_price) < Number(product.price)
                );
                const displayPrice = hasDiscount
                  ? Number(product.discount_price)
                  : Number(product?.price) || 0;
                const rawOriginal = product?.original_price || product?.originalPrice;
                const displayOriginalPrice = hasDiscount
                  ? Number(product.price)
                  : rawOriginal && Number(rawOriginal) > displayPrice
                  ? Number(rawOriginal)
                  : null;
                const discountPercentValue = hasDiscount
                  ? Math.round(
                      ((Number(product.price) - Number(product.discount_price)) /
                        Number(product.price)) *
                        100
                    )
                  : null;
                const displayBadge =
                  product?.badge || (discountPercentValue ? `${discountPercentValue}% OFF` : 'New');
                const isLiked = wishlist?.isInWishlist
                  ? wishlist.isInWishlist(product?.id)
                  : false;

                return (
                  <li
                    key={`card-${product.id}-${index}`}
                    onClick={() => handleCardClick(product)}
                    className="cards-item absolute top-0 left-0 w-full h-full list-none p-0 m-0 rounded-xl sm:rounded-2xl overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.7),0_0_24px_rgba(223,193,138,0.15)] border border-[#DFC18A]/35 bg-[#160E0A] select-none group cursor-pointer transition-colors duration-300 hover:border-[#DFC18A]"
                  >
                    {/* Saree Image */}
                    <img
                      src={imageUrl}
                      alt={product.name || 'Handcrafted Saree'}
                      className="w-full h-full object-cover object-center pointer-events-none transition-transform duration-700 ease-out group-hover:scale-106"
                      loading="lazy"
                    />

                    {/* Golden Hairline Shine on Card Top */}
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#DFC18A] to-transparent opacity-85 z-20 pointer-events-none" />

                    {/* Top-Left Floating Heritage Badge */}
                    {displayBadge && (
                      <div className="absolute top-2 sm:top-2.5 left-2 sm:left-2.5 z-20 pointer-events-none">
                        <span className="inline-flex items-center gap-1 bg-[#120B09]/90 backdrop-blur-md text-[#DFC18A] border border-[#DFC18A]/40 text-[8px] sm:text-[9px] md:text-[10px] font-semibold uppercase tracking-wider px-1.5 sm:px-2 py-0.5 rounded-full shadow-md">
                          <Sparkles className="w-2 sm:w-2.5 h-2 sm:h-2.5 text-[#DFC18A]" />
                          <span>{displayBadge}</span>
                        </span>
                      </div>
                    )}

                    {/* Top-Right Wishlist Heart Button */}
                    <button
                      type="button"
                      onClick={(e) => handleWishlistToggle(e, product)}
                      aria-label={isLiked ? 'Remove from wishlist' : 'Add to wishlist'}
                      className={`absolute top-2 sm:top-2.5 right-2 sm:right-2.5 z-30 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer active:scale-90 ${
                        isLiked
                          ? 'bg-[#E05353]/25 border border-[#E05353]/70 text-[#E05353] shadow-[0_0_12px_rgba(224,83,83,0.35)]'
                          : 'bg-[#140C09]/80 border border-[#3A261E] text-[#C7B5A7] hover:text-[#DFC18A] hover:border-[#DFC18A]/50'
                      }`}
                    >
                      <Heart
                        className={`w-3 sm:w-3.5 h-3 sm:h-3.5 transition-transform active:scale-125 ${
                          isLiked ? 'fill-[#E05353] text-[#E05353]' : 'stroke-[1.8]'
                        }`}
                      />
                    </button>

                    {/* Bottom Vignette Overlay with Responsive Saree Details */}
                    <div className="absolute inset-x-0 bottom-0 p-2.5 sm:p-3.5 md:p-4 pt-10 sm:pt-14 bg-gradient-to-t from-[#120B09] via-[#120B09]/85 to-transparent z-20 pointer-events-none flex flex-col justify-end">
                      {product.category && (
                        <span className="text-[8px] sm:text-[9px] uppercase tracking-widest text-[#DFC18A]/90 font-medium truncate mb-0.5">
                          {product.category}
                        </span>
                      )}
                      <h4 className="font-serif text-[11px] sm:text-xs md:text-sm text-[#FDF8F4] font-medium leading-tight truncate drop-shadow-sm group-hover:text-[#DFC18A] transition-colors">
                        {product.name}
                      </h4>
                      <div className="mt-1 sm:mt-1.5 flex items-center justify-between gap-1.5">
                        <div className="flex items-baseline gap-1 sm:gap-1.5">
                          <span className="text-xs sm:text-sm md:text-base font-bold text-[#FDF8F4]">
                            {formatPrice(displayPrice)}
                          </span>
                          {displayOriginalPrice && (
                            <span className="text-[9px] sm:text-[10px] text-[#A69385] line-through">
                              {formatPrice(displayOriginalPrice)}
                            </span>
                          )}
                        </div>
                        <span className="inline-flex items-center gap-0.5 sm:gap-1 text-[9px] sm:text-[10px] md:text-xs font-semibold text-[#DFC18A] group-hover:translate-x-0.5 transition-transform">
                          <span>View</span>
                          <ArrowRight className="w-2.5 sm:w-3 h-2.5 sm:h-3" />
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Hidden Drag Proxy for GSAP Draggable */}
            <div ref={dragProxyRef} className="drag-proxy invisible absolute" />
          </div>

          {/* ── NAVIGATION CONTROLS (BALANCED & CENTERED IN NATURAL FLOW) ── */}
          <div className="actions flex items-center justify-center gap-3 sm:gap-4 mt-5 sm:mt-7 z-40 relative px-4">
            <button
              type="button"
              onClick={handlePrev}
              aria-label="Previous Saree"
              className="prev flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#DFC18A]/40 bg-[#1A100C]/90 hover:bg-[#DFC18A] text-[#DFC18A] hover:text-[#120B09] shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 cursor-pointer active:scale-90 group shrink-0"
            >
              <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-0.5" />
            </button>

            <button
              type="button"
              onClick={() => navigate('/products?sort=newest')}
              className="px-5 sm:px-7 py-2.5 sm:py-3 rounded-full border border-[#DFC18A]/40 bg-gradient-to-r from-[#1A100C] via-[#221510] to-[#1A100C] hover:border-[#DFC18A] hover:bg-[#DFC18A] text-[#DFC18A] hover:text-[#120B09] text-xs sm:text-sm font-semibold tracking-wider uppercase transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur-md flex items-center gap-2 cursor-pointer active:scale-95 group"
            >
              <span>Explore All Loom Drops</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 shrink-0" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              aria-label="Next Saree"
              className="next flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-[#DFC18A]/40 bg-[#1A100C]/90 hover:bg-[#DFC18A] text-[#DFC18A] hover:text-[#120B09] shadow-[0_4px_16px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-300 cursor-pointer active:scale-90 group shrink-0"
            >
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>

          {/* Swipe or Arrow Hint */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-xs uppercase tracking-wider text-[#A69385]/60 mt-3 pointer-events-none">
            <MoveHorizontal className="w-3.5 h-3.5 text-[#DFC18A]/70" />
            <span>Swipe horizontally or use arrows to glide</span>
          </div>
        </div>
      )}
    </section>
  );
}

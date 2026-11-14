import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, X, ChevronRight, Sparkles, Award, RefreshCw, Eye, Maximize2, Minimize2, Check, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useCart from '../../hooks/useCart';
import formatPrice from '../../utils/formatPrice';
import { getProductImage } from '../../utils/productHelpers';
import { LotusEmblem } from '../reusable/BrandLogo';

// ── 1. ASSET SPECIFICATION (MAISON VERREL RUNWAY) ──
const RAW_SHEETS = {
  side: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261113_115504_3ab92758-5854-4a1c-85db-ff8efd929e86.png",
  front: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261113_115743_54dc8c72-0be0-4858-bd0c-10ecb399c16c.png",
  back: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20261113_115613_7d45aea6-1bea-41ff-b878-72d7c8bcb9da.png"
};

const SHEET_URLS = {
  side: `https://images.higgs.ai/?default=1&output=webp&url=${encodeURIComponent(RAW_SHEETS.side)}&w=1360&q=85`,
  front: `https://images.higgs.ai/?default=1&output=webp&url=${encodeURIComponent(RAW_SHEETS.front)}&w=1360&q=85`,
  back: `https://images.higgs.ai/?default=1&output=webp&url=${encodeURIComponent(RAW_SHEETS.back)}&w=1360&q=85`
};

const MAISON_GARMENTS = [
  { k: 0, name: "Noir Tailored Blazer", desc: "Black single-breasted blazer", price: 690 },
  { k: 1, name: "Ivory Belted Trench", desc: "Long ivory trench", price: 690 },
  { k: 2, name: "Oxblood Silk Slip", desc: "Ankle-length slip, thin straps", price: 690 },
  { k: 3, name: "Taupe Wool Blazer", desc: "Tailored taupe wool blazer", price: 690 },
  { k: 4, name: "Champagne Bias Slip", desc: "Ankle length bias slip", price: 690 },
  { k: 5, name: "Pearl Silk Slip", desc: "Ivory silk slip", price: 690 },
  { k: 6, name: "Taupe Belted Trench", desc: "Belted taupe trench", price: 690 },
  { k: 7, name: "Oxblood Satin Gown", desc: "Floor length, fuller skirt", price: 690 }
];

const CROPS = {
  0: { side: [44, 619, 185], front: [79, 552, 175], back: [76, 515, 176] },
  1: { side: [45, 860, 514], front: [76, 900, 511], back: [60, 890, 508] },
  2: { side: [45, 876, 834], front: [76, 913, 848], back: [60, 901, 845] },
  3: { side: [45, 606, 1169], front: [80, 550, 1179], back: [76, 520, 1180] },
  4: { side: [1024, 937, 177], front: [1024, 936, 177], back: [1026, 931, 175] },
  5: { side: [1024, 936, 511], front: [1024, 940, 513], back: [1026, 929, 508] },
  6: { side: [1024, 907, 825], front: [1024, 894, 851], back: [1024, 901, 845] },
  7: { side: [1024, 962, 1166], front: [1024, 938, 1185], back: [1024, 934, 1184] }
};

const MAISON_ORDER = [0, 1, 2, 3, 4, 0, 5, 6, 7, 0, 4, 1, 2, 3, 5, 6, 7, 1, 4, 3];
const TAG_ANGLES = [-5, 4, -3, 6, -4, 3, -6, 4, -3, 5];

// ── 2. CURATED STORE SAREES (FALLBACK & SEED DATA) ──
const CURATED_SAREES = [
  {
    id: 'saree-curated-1',
    name: 'Kanchipuram Crimson & Gold Zari Pure Silk',
    category: 'Kanchipuram',
    price: 18500,
    original_price: 24000,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    detail_image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
    description: 'Certified 100% pure mulberry silk woven with authentic 3-ply gold zari, adorned with traditional temple motifs.',
    stock: 8,
  },
  {
    id: 'saree-curated-2',
    name: 'Royal Emerald Bridal Kanjivaram Brocade',
    category: 'Bridal Silks',
    price: 26900,
    original_price: 35000,
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
    detail_image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    description: 'An heirloom bridal treasure bathed in rich emerald green luster, featuring heavy korvai weaving.',
    stock: 5,
  },
  {
    id: 'saree-curated-3',
    name: 'Varanasi Antique Kadwa Banarasi Handloom',
    category: 'Banarasi',
    price: 16200,
    original_price: 21500,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
    detail_image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
    description: 'Handcrafted by Varanasi master weavers using the ancient kadwa brocade technique with delicate floral bootis.',
    stock: 6,
  },
  {
    id: 'saree-curated-4',
    name: 'Kuthampully Traditional Kasavu Handwoven Ivory',
    category: 'Kerala Kasavu',
    price: 6800,
    original_price: 9200,
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800',
    detail_image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    description: 'Sourced directly from the looms of Kuthampully, featuring unbleached pure cotton-silk with pure zari tissue border.',
    stock: 12,
  },
  {
    id: 'saree-curated-5',
    name: 'Midnight Navy Handwoven Tussar Silk Saree',
    category: 'Tussar Silk',
    price: 11400,
    original_price: 15000,
    image: 'https://images.unsplash.com/photo-1610030469854-b58cb53ec738?auto=format&fit=crop&q=80&w=800',
    detail_image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
    description: 'Textured wild tussar silk naturally dyed in midnight navy with kantha needlework and matte gold zari.',
    stock: 9,
  },
  {
    id: 'saree-curated-6',
    name: 'Temple Border Aubergine Pure Kanchipuram',
    category: 'Kanchipuram',
    price: 21000,
    original_price: 28000,
    image: 'https://images.unsplash.com/photo-1583391733975-dd28731b81fa?auto=format&fit=crop&q=80&w=800',
    detail_image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=800',
    description: 'Deep royal aubergine silk body contrasted by a vibrant turmeric gold border with sacred gaja-singha motifs.',
    stock: 4,
  },
  {
    id: 'saree-curated-7',
    name: 'Champagne Shimmer Chanderi Tissue Silk',
    category: 'Chanderi',
    price: 9800,
    original_price: 13500,
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=800',
    detail_image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&q=80&w=800',
    description: 'Weightless Chanderi tissue silk woven with fine gold gossamer threads and floral meenakari motifs.',
    stock: 10,
  },
  {
    id: 'saree-curated-8',
    name: 'Peacock Teal Organza Silk Saree with Zari',
    category: 'Organza',
    price: 12500,
    original_price: 16800,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800',
    detail_image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=800',
    description: 'Airy sheer silk organza adorned with delicate scalloped gold borders and hand-embroidered bootis.',
    stock: 7,
  }
];

export default function BoutiqueRailShowcase({ products = [] }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Mode: 'sarees' (our store products) or 'couture' (Maison Verrel runway)
  const [collectionMode, setCollectionMode] = useState('sarees');
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Quick View State
  const [qvOpen, setQvOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [qvTab, setQvTab] = useState('front'); // 'front' or 'back'
  const [selectedSize, setSelectedSize] = useState('Unstitched Blouse');
  const [isAdding, setIsAdding] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Fly to cart animation
  const [flyClone, setFlyClone] = useState(null);

  // Hover state
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // Container refs
  const containerRef = useRef(null);
  const railZoneRef = useRef(null);

  // Combine real store products with fallback curated sarees to ensure at least 16-20 pieces on rail
  const storeSareesList = useMemo(() => {
    let base = Array.isArray(products) && products.length > 0 ? products : CURATED_SAREES;
    // Repeat if needed to ensure 16-20 pieces for a continuous rail experience
    let list = [...base];
    while (list.length < 16) {
      list = [...list, ...base];
    }
    return list.slice(0, 20);
  }, [products]);

  // Current rail items based on mode
  const railItems = useMemo(() => {
    if (collectionMode === 'couture') {
      return MAISON_ORDER.map((k, idx) => ({
        type: 'couture',
        id: `couture-${idx}`,
        k,
        name: MAISON_GARMENTS[k].name,
        price: MAISON_GARMENTS[k].price,
        formattedPrice: '$690.00',
        tagPrice: '$690',
        desc: MAISON_GARMENTS[k].desc,
      }));
    } else {
      return storeSareesList.map((prod, idx) => ({
        type: 'saree',
        id: prod.id || `saree-${idx}`,
        originalProduct: prod,
        name: prod.name,
        price: Number(prod.price) || 14999,
        formattedPrice: formatPrice(Number(prod.price) || 14999),
        tagPrice: `₹${((Number(prod.price) || 14999) / 1000).toFixed(1)}k`,
        category: prod.category || 'Handloom Silk',
        image: getProductImage(prod) || CURATED_SAREES[idx % CURATED_SAREES.length].image,
        detail_image: prod.images?.[1] || CURATED_SAREES[idx % CURATED_SAREES.length].detail_image,
        desc: prod.description || 'Authentic pure Silk Mark certified master weaver drape.',
        stock: prod.stock !== undefined ? prod.stock : 10,
      }));
    }
  }, [collectionMode, storeSareesList]);

  // Physics simulation state (mutable ref to avoid re-renders)
  const physicsRef = useRef({
    target: 0,
    cur: 0,
    vel: 0,
    prevCur: 0,
    maxScroll: 0,
    springs: Array(20).fill(0).map(() => ({ a: 0, av: 0, offset: 0 })),
    isDragging: false,
    startX: 0,
    startTarget: 0,
    lastMoveX: 0,
    lastMoveTime: 0,
    releaseVelocity: 0,
    u: 1,
    railTop: 270,
    railSag: 74,
    gap: 121,
    gs: 0.455,
    start: 113,
    containerWidth: 1440,
    isPhone: false,
  });

  // Recompute design units and layout
  const updateLayout = useCallback(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth || window.innerWidth;
    const height = isFullScreen ? window.innerHeight : 680;

    const isPhone = width <= 820;
    const u = isPhone
      ? Math.min(width / 390, height / 780)
      : Math.min(width / 1440, height / 850);

    const railTop = isPhone ? 280 : 255;
    const railSag = isPhone ? 35 : 68;
    const gap = isPhone ? 95 : 125;
    const gs = isPhone ? 0.32 : 0.455;
    const start = isPhone ? 50 : 115;

    const totalPieces = railItems.length;
    const maxScroll = Math.max(0, (2 * start + (totalPieces - 1) * gap) * u - width);

    physicsRef.current = {
      ...physicsRef.current,
      u,
      railTop,
      railSag,
      gap,
      gs,
      start,
      containerWidth: width,
      isPhone,
      maxScroll,
    };
  }, [railItems.length, isFullScreen]);

  // Rail quadratic curve helper
  const getRailY = useCallback((x, W) => {
    const { railTop, railSag, u } = physicsRef.current;
    const t = (x - W / 2) / (W / 2);
    return (railTop + railSag * (1 - t * t)) * u;
  }, []);

  // rAF Physics Loop
  useEffect(() => {
    let animId;
    let lastTime = performance.now();

    const loop = (now) => {
      const p = physicsRef.current;
      const elapsed = now - lastTime;
      lastTime = now;
      const dt = Math.min(3, elapsed / 16.667);

      // Inertia easing
      p.target = Math.max(0, Math.min(p.maxScroll, p.target));
      p.cur += (p.target - p.cur) * (1 - Math.pow(1 - 0.085, dt));
      p.vel = (p.cur - p.prevCur) / Math.max(0.001, dt);
      p.prevCur = p.cur;

      // Update progress thumb DOM directly
      const thumbEl = document.getElementById('boutique-progress-thumb');
      if (thumbEl && p.maxScroll > 0) {
        const progress = Math.max(0, Math.min(1, p.cur / p.maxScroll));
        thumbEl.style.left = `${progress * 42}%`;
      }

      // Update SVG path directly
      const W = p.containerWidth;
      const y0 = getRailY(0, W);
      const yMid = getRailY(W / 2, W);
      const yc = 2 * yMid - y0;

      const pathTube = document.getElementById('boutique-rail-tube');
      const pathShadow = document.getElementById('boutique-rail-shadow');
      const pathHighlight = document.getElementById('boutique-rail-highlight');

      if (pathTube) {
        pathTube.setAttribute('d', `M 0 ${y0} Q ${W / 2} ${yc} ${W} ${y0}`);
        pathTube.setAttribute('stroke-width', `${5.2 * p.u}`);
      }
      if (pathShadow) {
        pathShadow.setAttribute('d', `M 0 ${y0 + 4 * p.u} Q ${W / 2} ${yc + 4 * p.u} ${W} ${y0 + 4 * p.u}`);
        pathShadow.setAttribute('stroke-width', `${3 * p.u}`);
      }
      if (pathHighlight) {
        pathHighlight.setAttribute('d', `M 0 ${y0 - 1.3 * p.u} Q ${W / 2} ${yc - 1.3 * p.u} ${W} ${y0 - 1.3 * p.u}`);
        pathHighlight.setAttribute('stroke-width', `${1.1 * p.u}`);
      }

      // Damped spring sway
      const targetAngle = Math.max(-7, Math.min(7, -p.vel * 0.22));

      // Update each garment DOM directly for 60fps silk smoothness
      railItems.forEach((_, i) => {
        const gEl = document.getElementById(`boutique-g-${i}`);
        const swayEl = document.getElementById(`boutique-sway-${i}`);
        if (!gEl) return;
        if (!p.springs[i]) p.springs[i] = { a: 0, av: 0, offset: 0 };

        const spring = p.springs[i];
        spring.av += (targetAngle - spring.a) * 0.05 * dt;
        spring.av *= Math.pow(0.88, dt);
        spring.a += spring.av * dt;

        if (swayEl) {
          swayEl.style.transform = `rotate(${spring.a}deg)`;
        }

        // Neighbour displacement
        let targetOffset = 0;
        if (hoveredIdx !== null) {
          const d = i - hoveredIdx;
          const mag = Math.min(Math.abs(d), 4);
          const lookup = [0, 50, 24, 9, 0][mag];
          targetOffset = Math.sign(d) * lookup * (p.gs / 0.48) * p.u;
        }
        spring.offset += (targetOffset - spring.offset) * 0.16 * dt;

        // Position on rail
        const hookX = (p.start + i * p.gap) * p.u - p.cur + spring.offset;
        const hookY = getRailY(hookX, W) - 3 * p.u;

        gEl.style.transform = `translate3d(${hookX}px, ${hookY}px, 0)`;
      });

      animId = requestAnimationFrame(loop);
    };

    updateLayout();
    animId = requestAnimationFrame(loop);
    window.addEventListener('resize', updateLayout);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', updateLayout);
    };
  }, [railItems, hoveredIdx, updateLayout, getRailY]);

  // Wheel scrolling
  const handleWheel = (e) => {
    if (qvOpen) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    physicsRef.current.target += delta * 0.9;
  };

  // Pointer drag gestures
  const handlePointerDown = (e) => {
    const p = physicsRef.current;
    p.isDragging = true;
    p.startX = e.clientX;
    p.startTarget = p.target;
    p.lastMoveX = e.clientX;
    p.lastMoveTime = performance.now();
    p.releaseVelocity = 0;
  };

  const handlePointerMove = (e) => {
    const p = physicsRef.current;
    if (!p.isDragging) return;
    const dx = e.clientX - p.startX;
    const now = performance.now();
    const dt = now - p.lastMoveTime;
    if (dt > 0) {
      p.releaseVelocity = (e.clientX - p.lastMoveX) / dt;
    }
    p.lastMoveTime = now;
    p.lastMoveX = e.clientX;
    p.target = p.startTarget - dx * 1.15;
  };

  const handlePointerUp = () => {
    const p = physicsRef.current;
    if (!p.isDragging) return;
    p.isDragging = false;
    if (Math.abs(p.releaseVelocity) > 0.1) {
      p.target -= p.releaseVelocity * 260;
    }
  };

  // Click garment -> Open Quick View
  const handleGarmentClick = (item, index) => {
    setActiveItem(item);
    setActiveItemIndex(index);
    setQvTab('front');
    setSelectedSize(item.type === 'couture' ? 'S' : 'Unstitched Blouse');
    setQvOpen(true);
  };

  // Add to cart with Arc Flight Animation
  const handleAddToCart = () => {
    if (!activeItem || isAdding) return;
    setIsAdding(true);

    setTimeout(() => {
      // Find navbar cart bag position for arc landing
      const bagEl = document.querySelector('a[href="/cart"]') || document.getElementById('bagBtn');
      const startEl = document.getElementById('qv-active-image-preview');

      if (bagEl && startEl) {
        const startRect = startEl.getBoundingClientRect();
        const bagRect = bagEl.getBoundingClientRect();

        const bagCenterX = bagRect.left + bagRect.width / 2;
        const bagCenterY = bagRect.top + bagRect.height / 2;

        setFlyClone({
          src: activeItem.type === 'couture' ? null : (qvTab === 'back' ? activeItem.detail_image : activeItem.image),
          isCouture: activeItem.type === 'couture',
          k: activeItem.k,
          view: qvTab,
          startX: startRect.left,
          startY: startRect.top,
          startW: startRect.width,
          startH: startRect.height,
          targetX: bagCenterX,
          targetY: bagCenterY,
        });
      }

      // Add to store CartContext
      if (activeItem.type === 'saree' && activeItem.originalProduct) {
        addToCart(activeItem.originalProduct, 1, selectedSize);
      } else {
        // Mock couture item add
        addToCart(
          {
            id: `couture-${activeItem.k}-${Date.now()}`,
            name: activeItem.name,
            price: activeItem.price * 85, // convert to approx INR
            image: RAW_SHEETS.front,
          },
          1,
          selectedSize
        );
      }

      setIsAdding(false);
      setAddedSuccess(true);
      setTimeout(() => {
        setAddedSuccess(false);
        setQvOpen(false);
      }, 700);
    }, 1000);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden transition-all duration-500 rounded-3xl ${
        isFullScreen
          ? 'fixed inset-0 z-50 rounded-none bg-[#FAF7F2] text-[#1A1716]'
          : 'my-6 bg-gradient-to-b from-[#1C120E]/95 via-[#160E0B]/95 to-[#120B09] border border-[#35221B] shadow-[0_16px_50px_rgba(0,0,0,0.7)] text-[#FDF8F4]'
      }`}
      style={{
        height: isFullScreen ? '100vh' : '640px',
      }}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* ── AMBIENT STUDIO LIGHTING BLOOM ── */}
      <div
        className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[320px] rounded-full blur-[120px] pointer-events-none ${
          isFullScreen ? 'bg-[#EFE8DF]/60' : 'bg-[#DFC18A]/[0.07]'
        }`}
        aria-hidden="true"
      />

      {/* ── TOP HEADER CONTROLS STRIP ── */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between z-20 pointer-events-auto">
        {/* Left: Boutique Eyebrow & Mode Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#DFC18A]/35 bg-[#140C08]/85 backdrop-blur-md shadow-sm">
            <LotusEmblem className="w-3.5 h-3.5 text-[#DFC18A]" />
            <span className="text-[11px] font-serif uppercase tracking-[0.22em] text-[#DFC18A] font-medium hidden sm:inline">
              The Luxury Rail
            </span>
          </div>

          {/* Collection Switcher Pills */}
          <div className="flex items-center bg-[#1A100C]/90 p-0.5 rounded-full border border-[#35221B] text-[11px] font-medium shadow-inner">
            <button
              type="button"
              onClick={() => setCollectionMode('sarees')}
              className={`px-3 py-1 rounded-full transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                collectionMode === 'sarees'
                  ? 'bg-gradient-to-r from-[#DFC18A] via-[#E8CD9B] to-[#DFC18A] text-[#120B09] font-bold shadow'
                  : 'text-[#C7B5A7] hover:text-[#FDF8F4]'
              }`}
            >
              <span>Our Sarees</span>
            </button>
            <button
              type="button"
              onClick={() => setCollectionMode('couture')}
              className={`px-3 py-1 rounded-full transition-all duration-300 cursor-pointer flex items-center gap-1.5 ${
                collectionMode === 'couture'
                  ? 'bg-gradient-to-r from-[#DFC18A] via-[#E8CD9B] to-[#DFC18A] text-[#120B09] font-bold shadow'
                  : 'text-[#C7B5A7] hover:text-[#FDF8F4]'
              }`}
            >
              <span>Maison Verrel Couture</span>
            </button>
          </div>
        </div>

        {/* Right: Interactive Instructions & Fullscreen Expand */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden md:flex items-center gap-2 text-[11px] text-[#A69385] font-light bg-[#140C08]/70 px-3 py-1 rounded-full border border-[#35221B]">
            <Sparkles className="w-3 h-3 text-[#DFC18A]" />
            <span>Drag sideways to scroll • Hover to turn • Click to inspect</span>
          </div>

          <button
            type="button"
            onClick={() => setIsFullScreen((v) => !v)}
            className="w-8 h-8 rounded-full bg-[#1C120E] hover:bg-[#2A1B14] border border-[#35221B] hover:border-[#DFC18A]/50 text-[#C7B5A7] hover:text-[#DFC18A] flex items-center justify-center transition-all cursor-pointer shadow-sm"
            title={isFullScreen ? "Exit Fullscreen" : "Full Studio Experience"}
          >
            {isFullScreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {/* ── HEADLINE & EYEBROW TITLE ── */}
      <div className="absolute top-16 sm:top-20 left-1/2 -translate-x-1/2 text-center pointer-events-none z-10 w-full px-4">
        <div className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-semibold tracking-[0.26em] uppercase text-[#DFC18A] mb-1">
          <span>{collectionMode === 'sarees' ? 'Kanchipuram • Banarasi • Kerala Kasavu' : 'NEW COLLECTION • EVENING & TAILORING'}</span>
        </div>
        <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#FDF8F4]">
          {collectionMode === 'sarees' ? (
            <>
              Silhouettes of{' '}
              <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0D4] via-[#DFC18A] to-[#C59B27]">
                Generational Grace
              </span>
            </>
          ) : (
            <>
              <span className="text-[#FDF8F4]">Silhouettes</span>{' '}
              <span className="text-[#C7B5A7]">that</span>{' '}
              <span className="text-[#8E7B6F]">hang</span>{' '}
              <span className="italic font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0D4] via-[#DFC18A] to-[#C59B27]">
                right.
              </span>
            </>
          )}
        </h2>
      </div>

      {/* ── THE RAIL ZONE (SVG CURVED RAIL + SUSPENDED PIECES) ── */}
      <div
        ref={railZoneRef}
        className="absolute inset-0 cursor-grab active:cursor-grabbing overflow-visible z-10"
        style={{
          touchAction: 'pan-y',
        }}
      >
        {/* SVG Quadratic Curved Rail */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
          <defs>
            <linearGradient id="boutiqueGoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF0D4" />
              <stop offset="35%" stopColor="#DFC18A" />
              <stop offset="70%" stopColor="#B38947" />
              <stop offset="100%" stopColor="#6E5023" />
            </linearGradient>
            <linearGradient id="brassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFE6B3" />
              <stop offset="50%" stopColor="#DFC18A" />
              <stop offset="100%" stopColor="#8A6529" />
            </linearGradient>
            <linearGradient id="walnutWoodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3E271D" />
              <stop offset="50%" stopColor="#2A1A12" />
              <stop offset="100%" stopColor="#1A0E08" />
            </linearGradient>
          </defs>
          <path id="boutique-rail-shadow" fill="none" stroke="rgba(0,0,0,0.5)" />
          <path id="boutique-rail-tube" fill="none" stroke="url(#boutiqueGoldGrad)" />
          <path id="boutique-rail-highlight" fill="none" stroke="rgba(255,247,226,0.85)" />
        </svg>

        {/* Garments suspended on the rail */}
        <div className="absolute inset-0 pointer-events-none overflow-visible">
          {railItems.map((item, idx) => {
            const isHov = hoveredIdx === idx;
            const angle = TAG_ANGLES[idx % TAG_ANGLES.length];

            return (
              <div
                key={item.id}
                id={`boutique-g-${idx}`}
                className={`absolute top-0 left-0 pointer-events-none will-change-transform ${
                  isHov ? 'z-30' : 'z-10'
                }`}
              >
                {/* Intro drop container */}
                <div className="relative top-0 left-0">
                  {/* Damped spring sway around hook tip (0, 0) */}
                  <div
                    id={`boutique-sway-${idx}`}
                    className="relative top-0 left-0"
                    style={{ transformOrigin: '0 0' }}
                  >
                    {/* Hover lift & scale */}
                    <div
                      className="relative top-0 left-0 transition-transform duration-400 ease-out"
                      style={{
                        transformOrigin: '0 0',
                        transform: isHov ? 'translateY(12px) scale(1.18)' : 'scale(1)',
                        perspective: '700px',
                      }}
                    >
                      {/* ── SAREE DISPLAY (STORE PRODUCTS) ── */}
                      {item.type === 'saree' ? (
                        <div className="relative flex flex-col items-center">
                          {/* Dark Walnut Wooden Hanger with Brass Hook */}
                          <div className="relative -top-[1px] -left-[85px] w-[170px] h-[48px] pointer-events-none">
                            <svg viewBox="-85 0 170 50" className="w-[170px] h-[50px] overflow-visible">
                              {/* Polished brass hook sitting directly on rail */}
                              <path
                                d="M 0 0 C 4 -1 10 -6 10 -12 C 10 -20 0 -22 -4 -16 C -6 -13 -5 -9 -5 -8"
                                fill="none"
                                stroke="url(#brassGrad)"
                                strokeWidth="2.4"
                                strokeLinecap="round"
                              />
                              <circle cx="0" cy="1" r="2.2" fill="#D4AF37" />
                              {/* Contoured walnut wood body */}
                              <path
                                d="M 0 3 C 25 7 55 18 80 28 C 82 29 82 32 79 33 C 55 26 25 15 0 15 C -25 15 -55 26 -79 33 C -82 32 -82 29 -80 28 C -55 18 -25 7 0 3 Z"
                                fill="url(#walnutWoodGrad)"
                              />
                              <path
                                d="M -75 29 C -50 19 -22 10 0 6 C 22 10 50 19 75 29"
                                fill="none"
                                stroke="rgba(255,235,200,0.25)"
                                strokeWidth="1"
                              />
                              <line x1="-65" y1="36" x2="65" y2="36" stroke="#C2A877" strokeWidth="1.6" strokeLinecap="round" />
                            </svg>
                          </div>

                          {/* Saree Drape Body (Front & Detail 3D Flip) */}
                          <div
                            className="relative -mt-3 w-[150px] sm:w-[175px] h-[220px] sm:h-[260px] rounded-b-2xl overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.65)] border border-[#35221B]/80 transition-transform duration-300"
                            style={{
                              transformStyle: 'preserve-3d',
                              transformOrigin: '50% 0',
                              transform: isHov ? 'rotateY(180deg)' : 'rotateY(0deg)',
                            }}
                          >
                            {/* Front face */}
                            <div
                              className="absolute inset-0 bg-cover bg-center rounded-b-2xl backface-hidden"
                              style={{
                                backgroundImage: `url(${item.image})`,
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden',
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                              <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left">
                                <span className="text-[9px] uppercase tracking-wider text-[#DFC18A] font-semibold block truncate">
                                  {item.category}
                                </span>
                                <h4 className="text-xs font-serif text-[#FDF8F4] font-medium leading-tight truncate">
                                  {item.name}
                                </h4>
                              </div>
                            </div>

                            {/* Back / Pallu detail face (Revealed on 3D turn) */}
                            <div
                              className="absolute inset-0 bg-cover bg-center rounded-b-2xl backface-hidden"
                              style={{
                                backgroundImage: `url(${item.detail_image || item.image})`,
                                transform: 'rotateY(180deg)',
                                backfaceVisibility: 'hidden',
                                WebkitBackfaceVisibility: 'hidden',
                              }}
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 flex flex-col justify-end p-2.5 text-left">
                                <span className="text-[8px] uppercase tracking-wider text-[#DFC18A] font-bold">
                                  Zari Pallu Detail
                                </span>
                                <span className="text-[10px] text-[#FDF8F4] font-light line-clamp-2">
                                  {item.desc}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* ── MAISON VERREL SPRITE SHEET CROPS ── */
                        <div className="relative">
                          {/* Side view face */}
                          <div
                            className="absolute top-0 transition-transform duration-150 ease-out"
                            style={{
                              width: `${340 * (physicsRef.current.gs * physicsRef.current.u)}px`,
                              height: `${(CROPS[item.k].side[1] + 6) * (physicsRef.current.gs * physicsRef.current.u)}px`,
                              left: `${-170 * (physicsRef.current.gs * physicsRef.current.u)}px`,
                              backgroundImage: `url(${SHEET_URLS.side})`,
                              backgroundSize: `${1360 * (physicsRef.current.gs * physicsRef.current.u)}px auto`,
                              backgroundPosition: `${-(CROPS[item.k].side[2] - 170) * (physicsRef.current.gs * physicsRef.current.u)}px ${-CROPS[item.k].side[0] * (physicsRef.current.gs * physicsRef.current.u)}px`,
                              backgroundRepeat: 'no-repeat',
                              transformOrigin: '50% 0',
                              transform: isHov ? 'rotateY(-90deg)' : 'rotateY(0deg)',
                              backfaceVisibility: 'hidden',
                              WebkitBackfaceVisibility: 'hidden',
                            }}
                          />
                          {/* Front view face */}
                          <div
                            className="absolute top-0 transition-transform duration-150 ease-out"
                            style={{
                              width: `${340 * (physicsRef.current.gs * physicsRef.current.u)}px`,
                              height: `${(CROPS[item.k].front[1] + 6) * (physicsRef.current.gs * physicsRef.current.u)}px`,
                              left: `${-170 * (physicsRef.current.gs * physicsRef.current.u)}px`,
                              backgroundImage: `url(${SHEET_URLS.front})`,
                              backgroundSize: `${1360 * (physicsRef.current.gs * physicsRef.current.u)}px auto`,
                              backgroundPosition: `${-(CROPS[item.k].front[2] - 170) * (physicsRef.current.gs * physicsRef.current.u)}px ${-CROPS[item.k].front[0] * (physicsRef.current.gs * physicsRef.current.u)}px`,
                              backgroundRepeat: 'no-repeat',
                              transformOrigin: '50% 0',
                              transform: isHov ? 'rotateY(0deg)' : 'rotateY(90deg)',
                              backfaceVisibility: 'hidden',
                              WebkitBackfaceVisibility: 'hidden',
                            }}
                          />
                        </div>
                      )}

                      {/* Cream Price Tag */}
                      <div
                        className="absolute left-[-6px] top-[48px] w-[36px] h-[20px] rounded-[3px] bg-[#F6F1E7] text-[#2A2420] text-[9.5px] font-semibold flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.3)] pointer-events-none z-20 border border-[#E0D5C3]"
                        style={{
                          transform: `rotate(${angle}deg)`,
                          transformOrigin: '50% 0',
                        }}
                      >
                        <div className="absolute top-[2px] left-1/2 -translate-x-1/2 w-[2.4px] h-[2.4px] rounded-full bg-[#B9AE9C]" />
                        <span>{item.tagPrice}</span>
                      </div>
                    </div>

                    {/* Floor Elliptical Radial Shadow */}
                    <div
                      className="absolute left-0 -translate-x-1/2 h-4 rounded-full pointer-events-none opacity-60"
                      style={{
                        width: `${110 * (physicsRef.current.gs / 0.48) * physicsRef.current.u * 1.3}px`,
                        top: item.type === 'saree' ? '280px' : `${(CROPS[item.k || 0].side[1] + 6) * (physicsRef.current.gs * physicsRef.current.u) + 10}px`,
                        background: 'radial-gradient(closest-side, rgba(70,52,34,0.35), transparent)',
                      }}
                    />

                    {/* Invisible Hit Area Button */}
                    <button
                      type="button"
                      aria-label={`${item.name}, ${item.tagPrice}`}
                      className="absolute top-0 left-0 -translate-x-1/2 w-[120px] h-[280px] bg-transparent border-none cursor-pointer pointer-events-auto z-30 outline-none"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx((prev) => (prev === idx ? null : prev))}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGarmentClick(item, idx);
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── FOOTER BAR: HINT, ACTIVE LABEL, PROGRESS THUMB ── */}
      <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-8 right-4 sm:right-8 flex items-center justify-between z-20 pointer-events-auto">
        {/* Left: Interactive hint & Hover preview */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-[1.5px] bg-[#DFC18A]/50" />
          {hoveredIdx !== null && railItems[hoveredIdx] ? (
            <div className="text-left animate-fadeIn">
              <span className="text-xs font-semibold text-[#FDF8F4] block">
                {railItems[hoveredIdx].name}
              </span>
              <span className="text-[11px] text-[#DFC18A] font-bold">
                {railItems[hoveredIdx].formattedPrice}
              </span>
            </div>
          ) : (
            <span className="text-xs text-[#A69385] font-light">
              Hover a piece • Click to inspect &amp; drape
            </span>
          )}
        </div>

        {/* Center: Rail Progress Bar */}
        <div className="relative w-28 sm:w-40 h-[2.5px] bg-[#35221B] rounded-full overflow-hidden hidden sm:block">
          <div
            id="boutique-progress-thumb"
            className="absolute top-0 left-0 w-[58%] h-full bg-[#DFC18A] rounded-full transition-all duration-75"
          />
        </div>

        {/* Right: Quick CTA Link */}
        <div className="text-right">
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('catalog-grid-start');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#DFC18A] hover:text-[#FFF0D4] transition-colors border-b border-[#DFC18A]/50 pb-0.5 cursor-pointer"
          >
            <span>Browse Full Anthology</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      {/* ── FULLSCREEN QUICK-VIEW MODAL (INSPECTOR & BUY BOX) ── */}
      <AnimatePresence>
        {qvOpen && activeItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl"
            onClick={() => setQvOpen(false)}
          >
            {/* Suspended Brass Rod from top of screen */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 md:left-[35%] w-[1.5px] h-16 sm:h-24 bg-gradient-to-b from-[#DFC18A] to-[#8A6529] pointer-events-none hidden md:block" />

            {/* Modal Dialog Container */}
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 15 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-gradient-to-b from-[#1E130F] to-[#140C08] border border-[#DFC18A]/40 rounded-3xl p-5 sm:p-8 shadow-[0_24px_80px_rgba(0,0,0,0.9)] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setQvOpen(false)}
                className="absolute top-4 sm:top-6 right-4 sm:right-6 w-9 h-9 rounded-full bg-[#2A1B14] hover:bg-[#3A261C] border border-[#35221B] hover:border-[#DFC18A]/50 text-[#C7B5A7] hover:text-[#DFC18A] flex items-center justify-center transition-all cursor-pointer z-20"
                aria-label="Close"
              >
                <X size={16} />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 items-center">
                {/* ── LEFT: PRODUCT IMAGE SHOWCASE ── */}
                <div className="relative flex flex-col items-center justify-center">
                  <div
                    id="qv-active-image-preview"
                    className="relative w-full max-w-[320px] sm:max-w-[360px] h-[360px] sm:h-[440px] rounded-2xl overflow-hidden border border-[#35221B] shadow-2xl bg-[#120B09]"
                  >
                    {activeItem.type === 'saree' ? (
                      <motion.img
                        key={qvTab}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        src={qvTab === 'back' && activeItem.detail_image ? activeItem.detail_image : activeItem.image}
                        alt={activeItem.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      /* Maison Verrel Haute Couture Front / Back crop */
                      <div className="relative w-full h-full flex items-center justify-center">
                        <div
                          style={{
                            width: '280px',
                            height: '400px',
                            backgroundImage: `url(${qvTab === 'back' ? SHEET_URLS.back : SHEET_URLS.front})`,
                            backgroundSize: '1120px auto',
                            backgroundPosition: `${-(CROPS[activeItem.k][qvTab === 'back' ? 'back' : 'front'][2] - 170) * 0.82}px ${-CROPS[activeItem.k][qvTab === 'back' ? 'back' : 'front'][0] * 0.82}px`,
                            backgroundRepeat: 'no-repeat',
                          }}
                        />
                      </div>
                    )}

                    {/* Badge */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#120B09]/80 border border-[#DFC18A]/40 text-[10px] font-semibold text-[#DFC18A] uppercase tracking-wider backdrop-blur-md">
                      {activeItem.type === 'saree' ? 'Silk Mark Certified' : 'Haute Couture Run'}
                    </div>
                  </div>

                  {/* Front / Back Toggle Tabs */}
                  <div className="flex items-center gap-4 mt-4">
                    <button
                      type="button"
                      onClick={() => setQvTab('front')}
                      className={`text-xs font-semibold uppercase tracking-wider pb-1 transition-all cursor-pointer ${
                        qvTab === 'front'
                          ? 'text-[#DFC18A] border-b-2 border-[#DFC18A]'
                          : 'text-[#8E7B6F] hover:text-[#C7B5A7]'
                      }`}
                    >
                      {activeItem.type === 'saree' ? 'Full Drape' : 'Front View'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setQvTab('back')}
                      className={`text-xs font-semibold uppercase tracking-wider pb-1 transition-all cursor-pointer ${
                        qvTab === 'back'
                          ? 'text-[#DFC18A] border-b-2 border-[#DFC18A]'
                          : 'text-[#8E7B6F] hover:text-[#C7B5A7]'
                      }`}
                    >
                      {activeItem.type === 'saree' ? 'Pallu & Weave' : 'Back View'}
                    </button>
                  </div>
                </div>

                {/* ── RIGHT: DETAILS & ACTIONS ── */}
                <div className="space-y-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#DFC18A]">
                      Piece {activeItemIndex + 1} of {railItems.length}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#FDF8F4] font-normal leading-tight">
                      {activeItem.name}
                    </h3>
                    <div className="text-xl sm:text-2xl font-bold text-[#DFC18A] pt-1">
                      {activeItem.formattedPrice}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#C7B5A7] font-light leading-relaxed">
                    {activeItem.desc}
                  </p>

                  {/* Size / Blouse Customization Pills */}
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#A69385]">
                      {activeItem.type === 'saree' ? 'Blouse Tailoring Option:' : 'Garment Size:'}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {(activeItem.type === 'saree'
                        ? ['Unstitched Blouse', 'Stitched Size S', 'Stitched Size M', 'Stitched Size L']
                        : ['S', 'M', 'L', 'XL']
                      ).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setSelectedSize(sz)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                            selectedSize === sz
                              ? 'bg-[#DFC18A] text-[#120B09] border-[#DFC18A] font-bold shadow'
                              : 'bg-[#180F0C] text-[#C7B5A7] border-[#35221B] hover:border-[#DFC18A]/40'
                          }`}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Add to Cart CTA */}
                  <div className="pt-3 space-y-3">
                    <button
                      type="button"
                      disabled={isAdding || addedSuccess}
                      onClick={handleAddToCart}
                      className="w-full h-12 sm:h-14 rounded-full bg-gradient-to-r from-[#DFC18A] via-[#E8CD9B] to-[#DFC18A] hover:opacity-95 text-[#120B09] font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2.5 shadow-[0_8px_24px_rgba(223,193,138,0.35)] cursor-pointer active:scale-98 transition-all disabled:opacity-75"
                    >
                      {isAdding ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-[#120B09]" />
                          <span>Draping &amp; Adding…</span>
                        </>
                      ) : addedSuccess ? (
                        <>
                          <Check className="w-4 h-4 text-[#120B09]" />
                          <span>Added to Cart!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-4 h-4 text-[#120B09]" />
                          <span>Add to Cart • {activeItem.formattedPrice}</span>
                        </>
                      )}
                    </button>

                    {/* View Full Product Page Link */}
                    {activeItem.type === 'saree' && activeItem.originalProduct && (
                      <button
                        type="button"
                        onClick={() => {
                          setQvOpen(false);
                          navigate(`/products/${activeItem.originalProduct.id || activeItem.originalProduct.slug}`);
                        }}
                        className="w-full text-center text-xs text-[#DFC18A] hover:underline pt-1 flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <span>View complete heirloom craft specs &amp; reviews</span>
                        <ArrowRight size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ARC FLIGHT FLY-TO-BAG ELEMENT ── */}
      <AnimatePresence>
        {flyClone && (
          <motion.div
            initial={{
              position: 'fixed',
              left: flyClone.startX,
              top: flyClone.startY,
              width: flyClone.startW,
              height: flyClone.startH,
              scale: 1,
              opacity: 1,
              zIndex: 9999,
            }}
            animate={{
              left: flyClone.targetX - 16,
              top: flyClone.targetY - 16,
              width: 32,
              height: 32,
              scale: 0.15,
              opacity: 0.2,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.82,
              ease: [0.55, 0.05, 0.35, 1],
            }}
            onAnimationComplete={() => setFlyClone(null)}
            className="rounded-full shadow-2xl pointer-events-none bg-cover bg-center overflow-hidden border border-[#DFC18A]"
            style={{
              backgroundImage: flyClone.src ? `url(${flyClone.src})` : undefined,
              backgroundColor: '#DFC18A',
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}


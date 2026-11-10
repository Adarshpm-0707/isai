import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useCart from '../hooks/useCart';
import useWishlist from '../hooks/useWishlist';
import useAuth from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import { productService } from '../services/productService';
import ProductCard from '../components/reusable/ProductCard';
import { FloralOrnament } from '../components/reusable/FloralOrnament';
import { getProductImageList } from '../utils/productHelpers';
import {
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Heart,
  Star,
  Check,
  Truck,
  RotateCcw,
  Award,
  Zap,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  Share2,
  Tag,
} from 'lucide-react';

// ── Fallback placeholder ───────────────────────────────────────────────────────
const PLACEHOLDER_IMG =
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800';

// ── Inline Image Gallery ───────────────────────────────────────────────────────
function ProductImageGallery({ images = [] }) {
  const list = images.filter(Boolean);
  const displayList = list.length > 0 ? list : [PLACEHOLDER_IMG];
  const [activeIdx, setActiveIdx] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setActiveIdx(0);
    setImgError(false);
  }, [images]);

  const prev = () => setActiveIdx((i) => (i === 0 ? displayList.length - 1 : i - 1));
  const next = () => setActiveIdx((i) => (i === displayList.length - 1 ? 0 : i + 1));

  const activeSrc = imgError ? PLACEHOLDER_IMG : (displayList[activeIdx] || PLACEHOLDER_IMG);

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image */}
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl bg-[#1A100C] border border-[#35221B] shadow-[0_8px_40px_rgba(0,0,0,0.6)] group">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIdx}
            src={activeSrc}
            alt="Product"
            loading="eager"
            decoding="async"
            onError={() => setImgError(true)}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.28 }}
            className="w-full h-full object-cover object-center"
          />
        </AnimatePresence>

        {/* Arrow nav (multi-image only) */}
        {displayList.length > 1 && (
          <>
            <button
              onClick={prev}
              type="button"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {displayList.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className={`rounded-full transition-all duration-200 ${
                    i === activeIdx ? 'w-5 h-2 bg-[#DFC18A]' : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Handloom Badge */}
        <div className="absolute top-3 left-3 pointer-events-none">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#C86A27] text-white shadow">
            Handloom
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      {displayList.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {displayList.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => { setActiveIdx(i); setImgError(false); }}
              className={`flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all ${
                i === activeIdx
                  ? 'border-[#DFC18A] shadow-[0_0_12px_rgba(223,193,138,0.4)]'
                  : 'border-[#35221B] opacity-55 hover:opacity-90'
              }`}
            >
              <img src={img} alt={`view-${i}`} className="w-full h-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Star Rating ────────────────────────────────────────────────────────────────
function StarRow({ value = 5, onChange = null, size = 'sm' }) {
  const sz = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange && onChange(s)}
          className={onChange ? 'cursor-pointer' : 'cursor-default pointer-events-none'}
        >
          <Star
            className={`${sz} transition-colors ${
              s <= value ? 'text-[#DFC18A] fill-[#DFC18A]' : 'text-[#35221B] fill-[#35221B]'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ── Main Page Component ────────────────────────────────────────────────────────
export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Hooks: always called at top level
  const { addToCart } = useCart();
  const wishlist = useWishlist();
  const { user } = useAuth();

  // ── State ──
  // Try to show product instantly from localStorage (zero wait)
  const [product, setProduct] = useState(() => {
    try {
      const local = productService.getLocalProducts();
      return local.find((p) => p.id === id || String(p.id) === String(id) || p.slug === id) || null;
    } catch {
      return null;
    }
  });

  const [localLoading, setLocalLoading] = useState(() => {
    try {
      const local = productService.getLocalProducts();
      const found = local.find((p) => p.id === id || String(p.id) === String(id) || p.slug === id);
      return !found;
    } catch {
      return true;
    }
  });

  // All related products from localStorage
  const [allProducts, setAllProducts] = useState(() => {
    try { return productService.getLocalProducts(); } catch { return []; }
  });

  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Standard (5.5m + 0.8m Blouse)');
  const [addedToCart, setAddedToCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  // ── Fetch product in background ──
  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    const load = async () => {
      try {
        const data = await productService.getProductById(id);
        if (!cancelled && data) {
          setProduct(data);
        }
      } catch {
        // silent: show whatever we have from localStorage
      } finally {
        if (!cancelled) setLocalLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [id]);

  // ── Load related products from localStorage ──
  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) setAllProducts(e.detail);
    };
    window.addEventListener('isai:products_updated', handleUpdate);
    return () => window.removeEventListener('isai:products_updated', handleUpdate);
  }, []);

  // ── Fetch reviews (non-blocking, with AbortController timeout) ──
  const fetchReviews = useCallback(async (productId) => {
    if (!productId) return;
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 1500);
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(name, avatar_url)')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })
        .abortSignal(controller.signal);
      clearTimeout(timer);
      if (!error && Array.isArray(data)) setReviews(data);
    } catch {
      // fail silently: reviews are non-critical
    }
  }, []);

  useEffect(() => {
    if (product?.id) fetchReviews(product.id);
  }, [product?.id, fetchReviews]);

  // ── Handlers ──
  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product, qty, selectedSize);
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2500);
    } catch (err) {
      alert(err?.message || 'Failed to add to cart. Please try again.');
    }
  };

  const handleBuyNow = async () => {
    if (!product) return;
    try {
      await addToCart(product, qty, selectedSize);
      navigate('/cart');
    } catch (err) {
      alert(err?.message || 'Could not proceed. Please try again.');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) { alert('Please login to post a review'); return; }
    if (!userComment.trim()) { alert('Please write a comment'); return; }
    setSubmittingReview(true);
    try {
      const { error } = await supabase.from('reviews').insert([{
        product_id: product.id,
        user_id: user.id,
        rating: userRating,
        comment: userComment.trim(),
      }]);
      if (error) throw error;
      setUserComment('');
      fetchReviews(product.id);
    } catch (err) {
      alert(err?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // ── Derived / related ──
  const relatedItems = allProducts
    .filter((p) => p && p.id && String(p.id) !== String(id))
    .slice(0, 4);

  // ── Loading / not found states ──
  if (localLoading && !product) {
    return (
      <div className="min-h-screen bg-[#120B09] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#DFC18A]/30 border-t-[#DFC18A] animate-spin" />
        <p className="font-serif text-sm text-[#DFC18A]/70 tracking-wider">Loading Product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#120B09] flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#1E130F] border border-[#35221B] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-7 h-7 text-[#DFC18A]/40" />
          </div>
          <h2 className="font-serif text-2xl text-[#FDF8F4]">Product Not Found</h2>
          <p className="text-sm text-[#8E7B6F]">This product may have been removed or is unavailable.</p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#DFC18A]/40 text-[#DFC18A] text-xs font-semibold uppercase tracking-wider hover:bg-[#DFC18A]/10 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Collections
        </Link>
      </div>
    );
  }

  // ── Derived product values ──
  const images = getProductImageList(product);
  const hasDiscount = Boolean(
    product.discount_price && Number(product.discount_price) < Number(product.price)
  );
  const displayPrice = hasDiscount ? Number(product.discount_price) : Number(product.price || 0);
  const originalPrice = hasDiscount
    ? Number(product.price)
    : Number(product.original_price || product.originalPrice || Math.round(displayPrice * 1.3));
  const discountPct = hasDiscount && originalPrice > 0
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
    : null;
  const avgRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / reviews.length).toFixed(1)
    : String(product.rating || '5.0');
  const reviewCount = reviews.length || Number(product.reviewsCount || product.review_count || 0);
  const inStock = product.stock === undefined || product.stock === null || Number(product.stock) > 0;
  const inWishlist = wishlist?.isInWishlist ? wishlist.isInWishlist(product.id) : false;

  const SIZES = ['Standard (5.5m + 0.8m Blouse)', 'Custom Stitched Blouse'];

  // ── Render ──
  return (
    <div className="min-h-screen bg-[#120B09] text-[#FDF8F4]">

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-xs text-[#8E7B6F] flex-wrap">
          <Link to="/" className="hover:text-[#DFC18A] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#DFC18A] transition-colors">Collections</Link>
          <span>/</span>
          <span className="text-[#C7B5A7] truncate max-w-[200px] sm:max-w-xs">{product.name || 'Product'}</span>
        </nav>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 lg:pb-12">

        {/* Grid: image + info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 xl:gap-16">

          {/* LEFT: Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <ProductImageGallery images={images} />
          </motion.div>

          {/* RIGHT: Info */}
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
                      navigator.share({ title: product.name, url: window.location.href }).catch(() => {});
                    }
                  }}
                  className="p-2 rounded-full border bg-[#1E130F] border-[#35221B] text-[#8E7B6F] hover:border-[#DFC18A] hover:text-[#DFC18A] transition-all"
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
              <span className={`ml-auto text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                inStock
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                  : 'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
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
                { icon: <ShieldCheck className="w-4 h-4 text-[#DFC18A] shrink-0" />, text: '100% Pure Silk Certified' },
                { icon: <Truck className="w-4 h-4 text-[#DFC18A] shrink-0" />, text: 'Free Pan-India Delivery' },
                { icon: <RotateCcw className="w-4 h-4 text-[#DFC18A] shrink-0" />, text: '7-Day Easy Returns' },
                { icon: <Award className="w-4 h-4 text-[#DFC18A] shrink-0" />, text: 'Silk Mark Assured' },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-[#1A100C] border border-[#2A1B15]">
                  {b.icon}
                  <span className="text-[11px] text-[#C7B5A7] leading-tight">{b.text}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── TABS ── */}
        <section className="mt-14 sm:mt-20">
          <div className="flex border-b border-[#2C1C16] overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
            {[
              { key: 'description', label: 'Description' },
              { key: 'details', label: 'Product Details' },
              { key: 'reviews', label: `Reviews (${reviewCount})` },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`relative shrink-0 px-5 py-3 text-xs font-semibold uppercase tracking-widest transition-colors cursor-pointer ${
                  activeTab === key ? 'text-[#DFC18A]' : 'text-[#8E7B6F] hover:text-[#C7B5A7]'
                }`}
              >
                {label}
                {activeTab === key && (
                  <motion.div
                    layoutId="tabUnderline"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C86A27]"
                  />
                )}
              </button>
            ))}
          </div>

          <div className="py-8">
            <AnimatePresence mode="wait">
              {activeTab === 'description' && (
                <motion.div
                  key="desc"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-3xl text-[#C7B5A7] text-sm leading-relaxed font-light"
                >
                  <p>
                    {product.description ||
                      'An authentic handloom saree woven with pure silk and traditional zari by master artisans. Every thread tells a story of centuries-old craftsmanship, blended with timeless designs that celebrate the heritage of Indian weaving traditions. Comes with Silk Mark purity assurance.'}
                  </p>
                </motion.div>
              )}

              {activeTab === 'details' && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="max-w-2xl"
                >
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        ['Category', product.category || 'Saree'],
                        ['Fabric', product.fabric || 'Pure Silk'],
                        ['Weave', product.weave || 'Handloom'],
                        ['Length', '5.5m + 0.8m Blouse Piece'],
                        ['Care', product.care || 'Dry Clean Only'],
                        ['SKU', product.sku || product.slug || (product.id ? product.id.slice(0, 8) : 'N/A')],
                      ].map(([label, value]) => (
                        <tr key={label} className="border-b border-[#1E130F]">
                          <td className="py-3 pr-6 text-[#8E7B6F] uppercase tracking-wider text-[11px] font-semibold w-36 shrink-0">
                            {label}
                          </td>
                          <td className="py-3 text-[#FDF8F4] text-sm">{value || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </motion.div>
              )}

              {activeTab === 'reviews' && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-8 max-w-3xl"
                >
                  {/* Average Rating Card */}
                  <div className="flex items-center gap-6 p-5 rounded-2xl bg-[#1A100C] border border-[#2A1B15]">
                    <div className="text-center shrink-0">
                      <div className="text-5xl font-bold text-[#DFC18A]" style={{ fontFamily: 'serif' }}>
                        {avgRating}
                      </div>
                      <StarRow value={Math.round(Number(avgRating) || 5)} />
                      <div className="text-xs text-[#8E7B6F] mt-1">{reviewCount} reviews</div>
                    </div>
                    <div className="flex-1 space-y-1.5 min-w-0">
                      {[5, 4, 3, 2, 1].map((s) => {
                        const count = reviews.filter((r) => Math.round(r.rating) === s).length;
                        const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : (s === 5 ? 100 : 0);
                        return (
                          <div key={s} className="flex items-center gap-2">
                            <span className="text-[11px] text-[#8E7B6F] w-3">{s}</span>
                            <Star className="w-3 h-3 text-[#DFC18A] fill-[#DFC18A] shrink-0" />
                            <div className="flex-1 h-1.5 rounded-full bg-[#2A1B15] overflow-hidden">
                              <div
                                className="h-full bg-[#DFC18A] rounded-full transition-all duration-500"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="text-[11px] text-[#8E7B6F] w-6 text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Review List */}
                  {reviews.length > 0 ? (
                    <div className="space-y-4">
                      {reviews.map((r, i) => (
                        <div key={i} className="p-4 rounded-xl bg-[#1A100C] border border-[#2A1B15]">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 rounded-full bg-[#DFC18A]/20 flex items-center justify-center text-[#DFC18A] text-sm font-bold shrink-0">
                              {String(r.profiles?.name || 'C')[0].toUpperCase()}
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-[#FDF8F4]">{r.profiles?.name || 'Customer'}</div>
                              <StarRow value={Math.round(Number(r.rating) || 5)} />
                            </div>
                          </div>
                          {r.comment && (
                            <p className="text-sm text-[#C7B5A7] leading-relaxed mt-1">{r.comment}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#8E7B6F] italic">
                      No reviews yet. Be the first to share your experience!
                    </p>
                  )}

                  {/* Write Review Form */}
                  {user && (
                    <form onSubmit={handleSubmitReview} className="space-y-4 p-5 rounded-2xl bg-[#1A100C] border border-[#2A1B15]">
                      <h4 className="text-sm font-semibold text-[#DFC18A] uppercase tracking-wider">
                        Write a Review
                      </h4>
                      <div>
                        <label className="text-xs text-[#8E7B6F] block mb-1.5">Your Rating</label>
                        <StarRow value={userRating} onChange={setUserRating} size="lg" />
                      </div>
                      <div>
                        <label className="text-xs text-[#8E7B6F] block mb-1.5">Your Comment</label>
                        <textarea
                          value={userComment}
                          onChange={(e) => setUserComment(e.target.value)}
                          rows={3}
                          placeholder="Share your experience with this saree..."
                          className="w-full bg-[#160E0B] border border-[#35221B] rounded-xl px-4 py-3 text-sm text-[#FDF8F4] placeholder:text-[#8E7B6F] focus:outline-none focus:border-[#DFC18A]/60 resize-none"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={submittingReview || !userComment.trim()}
                        className="px-5 py-2.5 rounded-xl bg-[#C86A27] hover:bg-[#DB7B32] text-white text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-40 cursor-pointer"
                      >
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                      </button>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>

        {/* ── RELATED PRODUCTS ── */}
        {relatedItems.length > 0 && (
          <section className="mt-6 pt-10 border-t border-[#2A1B15]">
            <div className="text-center mb-10">
              <p className="text-[10px] font-semibold tracking-[0.3em] uppercase text-[#DFC18A] mb-2">
                You May Also Love
              </p>
              <h3
                className="font-serif text-2xl sm:text-3xl text-[#FDF8F4] font-normal"
                style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
              >
                Similar Sarees
              </h3>
              <FloralOrnament className="mt-2" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 lg:gap-6">
              {relatedItems.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* ── STICKY MOBILE BOTTOM BAR ── */}
      {inStock && (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-[#160E0B]/96 backdrop-blur-md border-t border-[#2A1B15] px-4 py-3">
          <div className="flex gap-3 max-w-sm mx-auto">
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#DFC18A] text-[#DFC18A] font-semibold text-xs uppercase tracking-wider transition-all cursor-pointer hover:bg-[#DFC18A]/10"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Cart
            </button>
            <button
              type="button"
              onClick={handleBuyNow}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#C86A27] hover:bg-[#DB7B32] text-white font-semibold text-xs uppercase tracking-wider transition-all shadow-lg cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              Buy Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

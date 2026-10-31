import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useProducts, { MOCK_PRODUCTS } from '../hooks/useProducts';
import useCart from '../hooks/useCart';
import useWishlist from '../hooks/useWishlist';
import useAuth from '../hooks/useAuth';
import { supabase } from '../lib/supabaseClient';
import ImageGallery from '../components/reusable/ImageGallery';
import QtySelector from '../components/reusable/QtySelector';
import PriceTag from '../components/reusable/PriceTag';
import Badge from '../components/reusable/Badge';
import ProductCard from '../components/reusable/ProductCard';
import Button from '../components/reusable/Button';
import { FloralOrnament } from '../components/reusable/FloralOrnament';
import { getProductImageList } from '../utils/productHelpers';
import { ShoppingBag, ArrowLeft, RefreshCw, ShieldCheck, Heart, Star, Check } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const { fetchProductById, fetchProducts, products } = useProducts();

  const [product, setProduct] = useState(() =>
    MOCK_PRODUCTS.find((p) => p.id === id || String(p.id) === String(id) || p.slug === id) || null
  );
  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState('Standard (5.5m + 0.8m Blouse)');
  const [addedMessage, setAddedMessage] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const local = MOCK_PRODUCTS.find((p) => p.id === id || String(p.id) === String(id) || p.slug === id);
    if (local && isMounted) setProduct(local);

    fetchProductById(id)
      .then((data) => {
        if (isMounted && data) setProduct(data);
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (product?.id) {
      fetchReviews(product.id);
      if (product.category) fetchProducts({ category: product.category });
    }
  }, [product?.id]);

  const fetchReviews = async (productId) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*, profiles(name, avatar_url)')
        .eq('product_id', productId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setReviews(data);
      }
    } catch (err) {
      console.error('Error loading reviews:', err);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product, qty, selectedSize);
      setAddedMessage(true);
      setTimeout(() => setAddedMessage(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to add to cart');
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    try {
      await toggleWishlist(product.id);
    } catch (err) {
      alert(err.message || 'Please login to add to wishlist');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Please login to post a review');
      return;
    }
    setSubmittingReview(true);
    try {
      const { data, error } = await supabase.from('reviews').insert([
        {
          product_id: product.id,
          user_id: user.id,
          rating: userRating,
          comment: userComment,
        },
      ]);
      if (error) throw error;
      setUserComment('');
      fetchReviews(product.id);
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const relatedItems = products
    .filter((p) => String(p.id) !== String(product?.id))
    .slice(0, 4);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6 min-h-[60vh] bg-[#120B09]">
        <h2 className="font-serif text-3xl font-bold text-[#FDF8F4] uppercase">Product Not Found</h2>
        <p className="text-[#C7B5A7]">This product does not exist or has been archived.</p>
        <Link
          to="/products"
          className="inline-flex items-center text-[#DFC18A] font-bold uppercase text-xs tracking-wider border-b border-[#DFC18A] pb-1"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Collections
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : product.rating || '5.0';

  return (
    <div className="min-h-screen bg-[#120B09] text-[#FDF8F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8 sm:space-y-12">
        {/* Back Link */}
        <div>
          <Link
            to="/products"
            className="inline-flex items-center text-[#DFC18A] hover:text-[#FDF8F4] text-xs uppercase tracking-wider font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" /> Back to Collections
          </Link>
        </div>

        {/* Main Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">
          {/* Left Gallery */}
          <div>
            <ImageGallery images={getProductImageList(product)} />
          </div>

          {/* Right Info Card */}
          <div className="flex flex-col justify-between space-y-6 p-6 sm:p-8 bg-[#1E130F] border border-[#35221B] rounded-2xl shadow-2xl">
            <div className="space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-2">
                  {product.category && <Badge text={product.category} variant="gold" />}
                  <h1
                    className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal text-[#FDF8F4] leading-snug"
                    style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
                  >
                    {product.name}
                  </h1>
                </div>

                <button
                  onClick={handleToggleWishlist}
                  className="p-2.5 rounded-full bg-[#160E0B] border border-[#35221B] hover:border-[#DFC18A] text-[#C7B5A7] transition-all shrink-0"
                  title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart
                    className={`w-4 h-4 ${inWishlist ? 'fill-[#C86A27] text-[#C86A27]' : ''}`}
                  />
                </button>
              </div>

              {/* Price Row */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <PriceTag price={product.discount_price || product.price} size="lg" />
                {(product.discount_price || product.originalPrice) && (
                  <span className="line-through text-sm text-[#8E7B6F]">
                    ₹{Number(product.original_price || product.originalPrice || Math.round(product.price * 1.35)).toLocaleString('en-IN')}
                  </span>
                )}
                <div className="flex items-center gap-1 text-xs text-[#DFC18A] bg-[#160E0B] px-2.5 py-1 rounded-full border border-[#35221B] ml-2">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>
                    {avgRating} ({reviews.length || product.reviewsCount || 124} reviews)
                  </span>
                </div>
              </div>

              <div className="h-px bg-[#2C1C16]" />

              <p className="text-xs sm:text-sm text-[#C7B5A7] leading-relaxed font-light">
                {product.description ||
                  'Authentic handloom saree woven with pure silk and traditional zari. Comes with Silk Mark purity assurance.'}
              </p>

              {/* Variant Selector */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] sm:text-xs uppercase font-semibold text-[#DFC18A] tracking-wider">
                  Drape Length & Blouse:
                </label>
                <div className="flex flex-wrap gap-2">
                  {['Standard (5.5m + 0.8m Blouse)', 'Custom Stitched Blouse'].map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`px-3 py-1.5 border text-xs rounded-lg transition-all ${
                        selectedSize === sz
                          ? 'border-[#DFC18A] bg-[#DFC18A]/10 text-[#DFC18A] font-medium'
                          : 'border-[#35221B] text-[#8E7B6F] hover:border-[#DFC18A]/50'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trust assurances */}
              <div className="space-y-2 text-xs text-[#8E7B6F] pt-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#DFC18A] shrink-0" />
                  <span>100% Certified Authentic Pure Silk Guarantee.</span>
                </div>
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-[#DFC18A] shrink-0" />
                  <span>Pan-India complimentary delivery & 7-day easy returns.</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-6 border-t border-[#2C1C16]">
              {product.stock > 0 ? (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="shrink-0">
                    <QtySelector qty={qty} onChange={setQty} stock={product.stock} />
                  </div>

                  <button
                    onClick={handleAddToCart}
                    type="button"
                    className="flex-1 py-3.5 px-6 rounded-full bg-[#C86A27] hover:bg-[#DB7B32] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Shopping Bag</span>
                  </button>
                </div>
              ) : (
                <div className="bg-[#160E0B] border border-[#35221B] text-[#DFC18A] p-3 text-center uppercase text-xs tracking-wider rounded-xl">
                  Currently Sold Out
                </div>
              )}

              {addedMessage && (
                <div className="bg-[#160E0B] border border-[#C86A27] text-[#DFC18A] p-3 text-center text-xs rounded-xl shadow-md flex items-center justify-center gap-2">
                  <Check className="w-4 h-4 text-[#C86A27]" />
                  <span>Added to your shopping bag!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Sarees */}
        {relatedItems.length > 0 && (
          <section className="pt-12 border-t border-[#2A1B15]">
            <div className="text-center mb-8">
              <h3
                className="font-serif text-2xl sm:text-3xl text-[#FDF8F4]"
                style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
              >
                Pairs Excellently With
              </h3>
              <FloralOrnament className="mt-1" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
              {relatedItems.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

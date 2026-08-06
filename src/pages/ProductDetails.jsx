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
import SectionHeading from '../components/reusable/SectionHeading';
import Button from '../components/reusable/Button';
import { getProductImageList } from '../utils/productHelpers';
import { ShoppingBag, ArrowLeft, RefreshCw, ShieldCheck, Heart, Star } from 'lucide-react';

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
  const [selectedSize, setSelectedSize] = useState('Standard');
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
      alert('Please login to leave a review.');
      return;
    }
    if (!userComment.trim()) return;

    setSubmittingReview(true);
    try {
      const { error } = await supabase.from('reviews').insert({
        product_id: product.id,
        user_id: user.id,
        rating: userRating,
        comment: userComment.trim(),
      });

      if (error) throw error;

      setUserComment('');
      await fetchReviews(product.id);
    } catch (err) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const relatedItems = products
    .filter((p) => String(p.id) !== String(product?.id))
    .slice(0, 3);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6 min-h-[60vh]">
        <h2 className="font-playfair text-3xl font-bold text-[#2B1409] uppercase">Product Not Found</h2>
        <p className="text-[#5C2F14]">This product does not exist or has been archived.</p>
        <Link
          to="/products"
          className="inline-flex items-center text-[#2B1409] font-bold uppercase text-xs tracking-wider border-b-2 border-[#D8A55A] pb-1"
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
      : product.rating || 0;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 space-y-8 sm:space-y-16 text-[#E3C381] bg-transparent">
      {/* Back button */}
      <div>
        <Link
          to="/products"
          className="inline-flex items-center text-[#E3C381] hover:text-[#F0DDB0] font-sans font-bold uppercase text-[10px] sm:text-xs tracking-widest transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5 sm:mr-2" /> Back to Collection
        </Link>
      </div>

      {/* Main product showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-10 lg:gap-16">
        <div>
          <ImageGallery images={getProductImageList(product)} />
        </div>

        {/* Product Details Right */}
        <div className="flex flex-col justify-between space-y-6 sm:space-y-8 p-4 sm:p-8 bg-[#E3C381]/10 border border-[#E3C381]/25 rounded-2xl shadow-xl">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1.5 sm:space-y-2">
                {product.category && <Badge text={product.category} variant="gold" />}
                <h1 className="font-playfair text-2xl sm:text-4xl md:text-5xl font-bold text-[#E3C381] tracking-wide uppercase leading-tight">
                  {product.name}
                </h1>
              </div>
              <button
                onClick={handleToggleWishlist}
                className="p-2.5 sm:p-3 bg-[#0F2318] border border-[#E3C381]/30 rounded-full hover:border-[#E3C381] transition-all shrink-0"
                title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${inWishlist ? 'fill-red-500 text-red-500' : 'text-[#E3C381]'}`}
                />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <PriceTag price={product.discount_price || product.price} size="lg" />
              {product.discount_price && product.original_price && (
                <span className="line-through text-xs sm:text-sm text-[#D4AF7A]/60">
                  ₹{Number(product.original_price).toLocaleString('en-IN')}
                </span>
              )}
              <div className="flex items-center gap-1 text-[10px] sm:text-xs text-[#E3C381] bg-[#0F2318] px-2.5 py-1 rounded-full border border-[#E3C381]/20">
                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#E3C381]" />
                <span>
                  {avgRating} ({reviews.length || product.review_count || 0} reviews)
                </span>
              </div>
            </div>

            <div className="h-[1px] bg-[#E3C381]/20" />

            <p className="font-sans text-xs sm:text-sm text-[#D8D0C0] leading-relaxed font-medium">
              {product.description}
            </p>

            {/* Size/Variant selector */}
            <div className="space-y-2">
              <label className="text-[10px] sm:text-xs uppercase font-bold text-[#E3C381] tracking-wider">Select Size / Variant:</label>
              <div className="flex flex-wrap gap-2">
                {['Standard', 'Free Size', 'Custom Stitch'].map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-1.5 border text-[10px] sm:text-xs font-bold rounded-lg transition-all ${
                      selectedSize === sz
                        ? 'border-[#E3C381] bg-[#E3C381]/20 text-[#E3C381]'
                        : 'border-[#E3C381]/30 text-[#D8D0C0] hover:border-[#E3C381]/60'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 text-xs font-sans text-[#D8D0C0] font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E3C381] flex-shrink-0" />
                <span>100% Certified Authentic Product Guarantee.</span>
              </div>
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#E3C381] flex-shrink-0" />
                <span>Easy 7-day exchange and returns policy.</span>
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6 pt-4 sm:pt-6 border-t border-[#E3C381]/20">
            {product.stock > 0 ? (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <div className="space-y-1">
                  <span className="block font-sans text-[10px] uppercase font-bold text-[#D4AF7A] tracking-wider">
                    Quantity
                  </span>
                  <QtySelector qty={qty} onChange={setQty} stock={product.stock} />
                </div>

                <div className="flex-grow flex flex-col justify-end pt-1 sm:pt-0">
                  <Button
                    onClick={handleAddToCart}
                    variant="primary"
                    size="lg"
                    className="w-full justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
                  </Button>
                </div>
              </div>
            ) : (
              <div className="bg-[#E3C381]/10 border border-[#E3C381]/30 text-[#E3C381] p-3 sm:p-4 text-center font-bold font-sans uppercase text-xs tracking-wider rounded-xl">
                Out of Stock
              </div>
            )}

            {addedMessage && (
              <div className="bg-[#E3C381]/20 border border-[#E3C381] text-[#E3C381] p-3 text-center font-sans text-xs rounded-xl shadow-md font-bold">
                Item added to your Shopping Bag successfully!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="pt-12 border-t border-[#F6D18A]/30 space-y-8">
        <SectionHeading title="Customer Reviews" subtitle="Verified ratings & feedback" />

        {/* Submit Review Form */}
        {user && (
          <form
            onSubmit={handleSubmitReview}
            className="bg-[#F6D18A]/10 border border-[#F6D18A]/30 p-6 rounded-lg space-y-4 max-w-2xl"
          >
            <h4 className="font-playfair text-lg font-bold text-[#F6D18A]">Write a Review</h4>
            <div className="flex items-center gap-2">
              <label className="text-xs text-[#D8A55A] font-bold">Rating:</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setUserRating(star)}
                    className="p-1 focus:outline-none"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= userRating ? 'fill-[#F6D18A] text-[#F6D18A]' : 'text-[#D8A55A]/40'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <textarea
              rows={3}
              value={userComment}
              onChange={(e) => setUserComment(e.target.value)}
              placeholder="Share your feedback about this product..."
              className="w-full bg-[#4A0000]/60 border border-[#F6D18A]/30 rounded p-3 text-xs text-[#F6D18A] placeholder:text-[#D8A55A]/50 focus:outline-none focus:border-[#F6D18A]"
              required
            />
            <Button type="submit" variant="primary" size="sm" disabled={submittingReview}>
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-xs text-[#D8A55A]/80 italic">No reviews yet for this product.</p>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#F6D18A]/5 border border-[#F6D18A]/20 p-4 rounded-lg space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-xs text-[#F6D18A]">
                    {rev.profiles?.name || 'Verified Purchaser'}
                  </span>
                  <div className="flex items-center gap-1">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-[#F6D18A] text-[#F6D18A]" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[#D8A55A] leading-relaxed">{rev.comment}</p>
                <span className="text-[10px] text-[#D8A55A]/50">
                  {new Date(rev.created_at).toLocaleDateString()}
                </span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedItems.length > 0 && (
        <section className="pt-16 border-t border-[#F6D18A]/30">
          <SectionHeading
            title="Pairs Excellently With"
            subtitle="Explore other heirloom masterpieces in this style"
          />
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
            {relatedItems.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

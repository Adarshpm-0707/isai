import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useCart from './useCart';
import useWishlist from './useWishlist';
import useAuth from './useAuth';
import { supabase } from '../lib/supabaseClient';
import { productService } from '../services/productService';
import { getProductImageList } from '../utils/productHelpers';

const SIZES = ['Standard (5.5m + 0.8m Blouse)', 'Custom Stitched Blouse'];

export function useProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const wishlist = useWishlist();
  const { user } = useAuth();

  const [product, setProduct] = useState(() => {
    try {
      const local = productService.getLocalProducts();
      return (
        local.find((p) => p.id === id || String(p.id) === String(id) || p.slug === id) ||
        null
      );
    } catch {
      return null;
    }
  });

  const [localLoading, setLocalLoading] = useState(() => {
    try {
      const local = productService.getLocalProducts();
      const found = local.find(
        (p) => p.id === id || String(p.id) === String(id) || p.slug === id
      );
      return !found;
    } catch {
      return true;
    }
  });

  const [allProducts, setAllProducts] = useState(() => {
    try {
      return productService.getLocalProducts();
    } catch {
      return [];
    }
  });

  const [qty, setQty] = useState(1);
  const [selectedSize, setSelectedSize] = useState(SIZES[0]);
  const [addedToCart, setAddedToCart] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

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
        // Fallback silently to local cache
      } finally {
        if (!cancelled) setLocalLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) setAllProducts(e.detail);
    };
    window.addEventListener('isai:products_updated', handleUpdate);
    return () => window.removeEventListener('isai:products_updated', handleUpdate);
  }, []);

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
      // Reviews are non-critical
    }
  }, []);

  useEffect(() => {
    if (product?.id) fetchReviews(product.id);
  }, [product?.id, fetchReviews]);

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
    if (e) e.preventDefault();
    if (!user) {
      alert('Please login to post a review');
      return;
    }
    if (!userComment.trim()) {
      alert('Please write a comment');
      return;
    }
    setSubmittingReview(true);
    try {
      const { error } = await supabase.from('reviews').insert([
        {
          product_id: product.id,
          user_id: user.id,
          rating: userRating,
          comment: userComment.trim(),
        },
      ]);
      if (error) throw error;
      setUserComment('');
      fetchReviews(product.id);
    } catch (err) {
      alert(err?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const relatedItems = useMemo(() => {
    return allProducts
      .filter((p) => p && p.id && String(p.id) !== String(id))
      .slice(0, 4);
  }, [allProducts, id]);

  const images = useMemo(() => {
    return product ? getProductImageList(product) : [];
  }, [product]);

  const hasDiscount = Boolean(
    product?.discount_price && Number(product.discount_price) < Number(product.price)
  );

  const displayPrice = hasDiscount
    ? Number(product.discount_price)
    : Number(product?.price || 0);

  const originalPrice = hasDiscount
    ? Number(product.price)
    : Number(
        product?.original_price ||
          product?.originalPrice ||
          Math.round(displayPrice * 1.3)
      );

  const discountPct =
    hasDiscount && originalPrice > 0
      ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100)
      : null;

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / reviews.length
        ).toFixed(1)
      : String(product?.rating || '5.0');

  const reviewCount =
    reviews.length || Number(product?.reviewsCount || product?.review_count || 0);

  const inStock =
    product?.stock === undefined ||
    product?.stock === null ||
    Number(product?.stock) > 0;

  const inWishlist =
    wishlist?.isInWishlist && product ? wishlist.isInWishlist(product.id) : false;

  return {
    id,
    product,
    localLoading,
    qty,
    setQty,
    selectedSize,
    setSelectedSize,
    addedToCart,
    reviews,
    userRating,
    setUserRating,
    userComment,
    setUserComment,
    submittingReview,
    activeTab,
    setActiveTab,
    handleAddToCart,
    handleBuyNow,
    handleSubmitReview,
    relatedItems,
    images,
    hasDiscount,
    displayPrice,
    originalPrice,
    discountPct,
    avgRating,
    reviewCount,
    inStock,
    inWishlist,
    wishlist,
    SIZES,
  };
}


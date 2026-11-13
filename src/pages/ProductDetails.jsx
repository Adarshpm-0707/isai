import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowLeft, Zap, Sparkles } from 'lucide-react';
import useAuth from '../hooks/useAuth';
import { useProductDetails } from '../hooks/useProductDetails';
import ProductImageGallery from '../components/product/ProductImageGallery';
import ProductBuyBox from '../components/product/ProductBuyBox';
import ProductTabs from '../components/product/ProductTabs';
import ProductCard from '../components/reusable/ProductCard';
import ProductSectionHeader from '../components/reusable/ProductSectionHeader';
import { FloralOrnament } from '../components/reusable/FloralOrnament';

export default function ProductDetails() {
  const { user } = useAuth();
  const {
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
    displayPrice,
    originalPrice,
    discountPct,
    avgRating,
    reviewCount,
    inStock,
    inWishlist,
    wishlist,
    SIZES,
  } = useProductDetails();

  // Loading State
  if (localLoading && !product) {
    return (
      <div className="min-h-screen bg-[#120B09] flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-[#DFC18A]/30 border-t-[#DFC18A] animate-spin" />
        <p className="font-serif text-sm text-[#DFC18A]/70 tracking-wider">
          Loading Product...
        </p>
      </div>
    );
  }

  // Not Found State
  if (!product) {
    return (
      <div className="min-h-screen bg-[#120B09] flex flex-col items-center justify-center gap-6 px-4">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-[#1E130F] border border-[#35221B] flex items-center justify-center mx-auto">
            <ShoppingBag className="w-7 h-7 text-[#DFC18A]/40" />
          </div>
          <h2 className="font-serif text-2xl text-[#FDF8F4]">Product Not Found</h2>
          <p className="text-sm text-[#8E7B6F]">
            This product may have been removed or is unavailable.
          </p>
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

  return (
    <div className="min-h-screen bg-[#120B09] text-[#FDF8F4]">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-xs text-[#8E7B6F] flex-wrap">
          <Link to="/" className="hover:text-[#DFC18A] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-[#DFC18A] transition-colors">
            Collections
          </Link>
          <span>/</span>
          <span className="text-[#C7B5A7] truncate max-w-[200px] sm:max-w-xs">
            {product.name || 'Product'}
          </span>
        </nav>
      </div>

      {/* Main Content Showcase */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 pb-28 lg:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14 xl:gap-16">
          {/* Gallery Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <ProductImageGallery images={images} />
          </motion.div>

          {/* Pricing, Wishlist, Drape, and CTA buy box */}
          <ProductBuyBox
            product={product}
            displayPrice={displayPrice}
            originalPrice={originalPrice}
            discountPct={discountPct}
            avgRating={avgRating}
            reviewCount={reviewCount}
            inStock={inStock}
            inWishlist={inWishlist}
            wishlist={wishlist}
            SIZES={SIZES}
            selectedSize={selectedSize}
            setSelectedSize={setSelectedSize}
            qty={qty}
            setQty={setQty}
            handleAddToCart={handleAddToCart}
            handleBuyNow={handleBuyNow}
            addedToCart={addedToCart}
          />
        </div>

        {/* Tabbed Specification & Reviews Section */}
        <ProductTabs
          product={product}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          reviewCount={reviewCount}
          avgRating={avgRating}
          reviews={reviews}
          user={user}
          userRating={userRating}
          setUserRating={setUserRating}
          userComment={userComment}
          setUserComment={setUserComment}
          submittingReview={submittingReview}
          handleSubmitReview={handleSubmitReview}
        />

        {/* Related Products Section */}
        {relatedItems.length > 0 && (
          <section className="mt-10 sm:mt-14 pt-10 sm:pt-14 border-t border-[#2A1B15] relative">
            <ProductSectionHeader
              badge="Curated Pairings • Matching Drapes"
              badgeIcon={Sparkles}
              title="Similar"
              titleAccent="Sarees"
              subtitle="Handcrafted sarees echoing complementary weaving traditions, color palettes, and celebratory grace."
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
              {relatedItems.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Sticky Mobile Bottom Bar */}
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

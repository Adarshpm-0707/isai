import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight, Trash2 } from 'lucide-react';
import useWishlist from '../hooks/useWishlist';
import useCart from '../hooks/useCart';
import ProductCard from '../components/reusable/ProductCard';
import ProductSectionHeader from '../components/reusable/ProductSectionHeader';

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlistItems, wishlistCount, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Normalize product objects from wishlist items
  const validProducts = wishlistItems
    .map((item) => {
      if (!item) return null;
      const prod = item.product || item;
      const pid = prod.id || item.product_id || item.id;
      return {
        ...prod,
        id: pid,
      };
    })
    .filter((p) => p && p.id);

  const handleMoveAllToCart = () => {
    let addedCount = 0;
    validProducts.forEach((prod) => {
      if (prod.stock > 0 || prod.stock === undefined) {
        addToCart(prod, 1);
        addedCount += 1;
      }
    });
    if (addedCount > 0) {
      navigate('/cart');
    }
  };

  return (
    <div className="min-h-screen pb-24 bg-[#120B09] text-[#FDF8F4]">
      {/* ── HEADER SECTION ── */}
      <section className="pt-10 sm:pt-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <ProductSectionHeader
          badge="Curated Favorites • Private Collection"
          badgeIcon={Heart}
          title="My"
          titleAccent="Wishlist"
          subtitle="Your handpicked collection of master-woven sarees, ready for life's most cherished celebrations."
          actionText={wishlistCount > 0 ? 'Continue Shopping' : null}
          actionLink="/products"
        />

        {/* ── TOOLBAR (Only shown when items exist) ── */}
        {validProducts.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#1A100C] border border-[#35221B] rounded-2xl p-3 sm:p-4 mb-8 sm:mb-10 shadow-lg">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-medium text-[#C7B5A7]">
                Saved Sarees:
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#DFC18A] bg-[#DFC18A]/10 border border-[#DFC18A]/30 px-2.5 py-0.5 rounded-full">
                {validProducts.length} {validProducts.length === 1 ? 'drape' : 'drapes'}
              </span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {/* Move All to Cart */}
              <button
                type="button"
                onClick={handleMoveAllToCart}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#C86A27] to-[#E58535] hover:from-[#DB7B32] hover:to-[#EB9142] text-white text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer active:scale-95"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move All to Cart</span>
              </button>

              {/* Clear Wishlist */}
              <button
                type="button"
                onClick={clearWishlist}
                title="Clear Wishlist"
                className="p-2 rounded-xl border border-[#35221B] bg-[#160E0B] text-[#8E7B6F] hover:text-[#E05353] hover:border-[#E05353]/40 transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── WISHLIST PRODUCTS GRID ── */}
        {validProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-20 px-6 rounded-3xl bg-gradient-to-b from-[#1A100C]/70 to-[#140C08]/90 border border-[#301F18] text-center max-w-lg mx-auto shadow-2xl"
          >
            <div className="w-16 h-16 rounded-full bg-[#1F130F] border border-[#DFC18A]/30 flex items-center justify-center text-[#DFC18A] mx-auto mb-4 shadow-inner">
              <Heart className="w-7 h-7 text-[#DFC18A]/80 stroke-[1.5]" />
            </div>
            <h3
              className="font-serif text-xl sm:text-2xl text-[#FDF8F4]"
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
            >
              Your Wishlist is Empty
            </h3>
            <p className="text-xs sm:text-sm text-[#A69385] mt-2.5 font-light leading-relaxed max-w-sm mx-auto">
              Explore our master-crafted pure silks, Kanchipuram weaves, and soft handlooms to save your dream sarees.
            </p>

            <div className="mt-8">
              <Link
                to="/products"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border border-[#DFC18A]/50 bg-gradient-to-r from-[#1A100C] via-[#221510] to-[#1A100C] hover:bg-[#DFC18A] text-[#DFC18A] hover:text-[#120B09] text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-lg group"
              >
                <span>Discover Handloom Sarees</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6">
            {validProducts.map((product) => (
              <ProductCard
                key={`wish-${product.id}`}
                product={product}
                badge={product.badge}
                rating={product.rating}
                reviewsCount={product.review_count || product.reviewsCount}
                originalPrice={product.original_price || product.price}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}


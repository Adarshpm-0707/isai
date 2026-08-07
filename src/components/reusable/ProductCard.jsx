import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye, Zap } from 'lucide-react';
import useCart from '../../hooks/useCart';
import PriceTag from './PriceTag';
import { getProductImage } from '../../utils/productHelpers';

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=700';

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);
  const primaryImage = imgError ? PLACEHOLDER : getProductImage(product);

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
    navigate('/checkout');
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.stock <= 0) return;
    addToCart(product, 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col h-full bg-[#E3C381]/10 backdrop-blur-md border border-[#E3C381]/20 rounded-xl sm:rounded-2xl overflow-hidden shadow-lg hover:bg-[#E3C381]/15 hover:border-[#E3C381]/45 transition-all duration-500 hover:shadow-[0_10px_35px_rgba(227,195,129,0.12)] hover:-translate-y-1"
    >
      {/* ── IMAGE AREA ── */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#0A1810]/60 flex items-center justify-center p-1.5 sm:p-2">

        {/* Ambient blurred bg layer */}
        <img
          src={primaryImage}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover blur-md opacity-30 scale-110 pointer-events-none"
        />

        {/* Main product image */}
        <Link to={`/products/${product.id}`} className="relative z-10 w-full h-full block">
          <img
            src={primaryImage}
            alt={product.name || 'Saree'}
            onError={() => setImgError(true)}
            className="w-full h-full object-contain object-center transition-transform duration-700 group-hover:scale-105 drop-shadow-md"
          />
        </Link>

        {/* Category badge */}
        {product.category && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-r from-[#E3C381] via-[#D4AF7A] to-[#C8A96E] text-[#0F2318] font-bold text-[7px] sm:text-[9px] uppercase tracking-[0.15em] sm:tracking-[0.2em] px-1.5 sm:px-2.5 py-0.5 sm:py-1 z-20 pointer-events-none shadow-md rounded-full leading-tight">
            {product.category}
          </span>
        )}

        {/* Sold Out overlay */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-20 pointer-events-none">
            <span className="font-bold text-[9px] sm:text-xs uppercase tracking-[0.2em] text-[#E3C381] border border-[#E3C381]/60 px-3 sm:px-5 py-1.5 sm:py-2 rounded-full bg-[#0F2318]/60">
              Sold Out
            </span>
          </div>
        )}

        {/* Action buttons hover overlay */}
        {product.stock > 0 && (
          <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3 flex items-center gap-1.5 opacity-100 sm:opacity-0 sm:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">

            {/* Buy Now Button */}
            <button
              onClick={handleBuyNow}
              type="button"
              title="Buy Now (Instant Checkout)"
              className="flex-1 flex items-center justify-center gap-1 bg-gradient-to-r from-[#E3C381] via-[#D4AF7A] to-[#C8A96E] text-[#0F2318] font-extrabold text-[8px] sm:text-[10px] uppercase tracking-wider py-2 sm:py-2.5 hover:brightness-110 transition-all cursor-pointer shadow-lg rounded-lg sm:rounded-xl"
            >
              <Zap className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0 fill-current" />
              <span>Buy Now</span>
            </button>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              type="button"
              title="Add to Cart"
              className="p-2 sm:px-2.5 bg-[#0F2318]/90 text-[#E3C381] border border-[#E3C381]/40 hover:bg-[#E3C381] hover:text-[#0F2318] transition-colors rounded-lg sm:rounded-xl shadow-lg shrink-0 flex items-center gap-1 text-[8px] sm:text-[10px] font-bold uppercase cursor-pointer"
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span className="hidden md:inline">Cart</span>
            </button>

            {/* View Details Button */}
            <Link
              to={`/products/${product.id}`}
              title="View Details"
              className="flex items-center justify-center w-7 h-7 sm:w-9 sm:h-9 bg-[#0F2318]/80 text-[#E3C381] border border-[#E3C381]/40 hover:bg-[#E3C381] hover:text-[#0F2318] transition-colors duration-300 rounded-lg sm:rounded-xl shadow-lg shrink-0"
            >
              <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* ── DETAILS AREA ── */}
      <div className="p-2.5 sm:p-4 border-t border-[#E3C381]/15 bg-[#E3C381]/5 text-[#E3C381] flex-grow flex flex-col justify-between gap-2.5">

        {/* Product name */}
        <Link
          to={`/products/${product.id}`}
          className="block font-serif text-xs sm:text-sm font-bold text-[#E3C381] hover:text-[#F0DDB0] transition-colors line-clamp-2 sm:line-clamp-1 leading-snug tracking-wide"
        >
          {product.name}
        </Link>

        {/* Price & Buy Now Button Footer */}
        <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-[#E3C381]/10 mt-auto">
          <PriceTag price={product.price} size="sm" />
          
          {product.stock > 0 ? (
            <button
              onClick={handleBuyNow}
              type="button"
              className="px-2.5 py-1 rounded-lg font-extrabold text-[9px] sm:text-[10px] uppercase tracking-wider bg-gradient-to-r from-[#E3C381] to-[#D4AF7A] text-[#0F2318] hover:brightness-110 transition-all flex items-center gap-1 shadow cursor-pointer shrink-0"
            >
              <Zap className="w-3 h-3 fill-current" />
              <span>Buy Now</span>
            </button>
          ) : (
            <span className="font-bold text-[7px] sm:text-[9px] uppercase tracking-[0.1em] text-[#E3C381]/40 bg-black/20 px-1.5 py-0.5 rounded-full w-fit">
              Sold Out
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

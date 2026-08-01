import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Eye } from 'lucide-react';
import useCart from '../../hooks/useCart';
import PriceTag from './PriceTag';
import { getProductImage } from '../../utils/productHelpers';

const PLACEHOLDER =
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=700';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const [imgError, setImgError] = useState(false);
  const primaryImage = imgError ? PLACEHOLDER : getProductImage(product);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col h-full bg-[#FFE8A3]/10 backdrop-blur-md border border-[#FFE8A3]/25 rounded-2xl overflow-hidden shadow-xl hover:bg-[#FFE8A3]/15 hover:border-[#FFE8A3]/50 transition-all duration-500 hover:shadow-[0_12px_40px_rgba(255,232,163,0.12)] hover:-translate-y-1.5"
    >
      {/* ── IMAGE AREA (FULL VISIBILITY DUAL-LAYER) ── */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-[#4A0000]/40 flex items-center justify-center p-2">
        {/* Ambient Blurred Fill Layer */}
        <img
          src={primaryImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover blur-md opacity-35 scale-110 pointer-events-none"
        />

        {/* Main Product Image (Full Image Visible, No Cropping) */}
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
          <span className="absolute top-3 left-3 bg-gradient-to-r from-[#FFE8A3] via-[#F6D18A] to-[#D8A55A] text-[#800202] font-sans font-bold text-[9px] uppercase tracking-[0.2em] px-3 py-1 z-20 pointer-events-none shadow-lg rounded-full">
            {product.category}
          </span>
        )}

        {/* Sold Out overlay */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/75 backdrop-blur-xs flex items-center justify-center z-20 pointer-events-none">
            <span className="font-sans font-bold text-xs uppercase tracking-[0.25em] text-[#FFE8A3] border border-[#FFE8A3]/60 px-5 py-2 rounded-full bg-[#800202]/60">
              Sold Out
            </span>
          </div>
        )}

        {/* Action buttons overlay */}
        {product.stock > 0 && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 opacity-100 sm:opacity-0 sm:translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-20">
            <button
              onClick={(e) => { e.preventDefault(); addToCart(product, 1); }}
              type="button"
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-[#FFE8A3] via-[#F6D18A] to-[#D8A55A] text-[#800202] font-sans font-extrabold text-[10px] uppercase tracking-[0.2em] py-2.5 hover:brightness-110 transition-all duration-300 cursor-pointer shadow-xl rounded-xl"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Cart
            </button>
            <Link
              to={`/products/${product.id}`}
              title="View Details"
              className="flex items-center justify-center w-9 h-9 bg-[#4A0000]/80 text-[#FFE8A3] border border-[#FFE8A3]/40 hover:bg-[#FFE8A3] hover:text-[#800202] transition-colors duration-300 rounded-xl shadow-xl shrink-0"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* ── DETAILS AREA ── */}
      <div className="p-4 sm:p-5 border-t border-[#FFE8A3]/20 space-y-2.5 bg-[#FFE8A3]/5 text-[#FFE8A3] flex-grow flex flex-col justify-between">
        <div>
          <Link
            to={`/products/${product.id}`}
            className="block font-playfair text-sm sm:text-base font-bold text-[#FFE8A3] hover:text-white transition-colors line-clamp-1 tracking-wide"
          >
            {product.name}
          </Link>
          
          {product.description && (
            <p className="mt-1 font-sans text-xs text-[#FFE8A3]/70 line-clamp-1 tracking-wide leading-relaxed">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-[#FFE8A3]/15 mt-auto">
          <PriceTag price={product.price} size="sm" />
          {product.stock > 0 ? (
            <span className="font-sans text-[9px] font-bold uppercase tracking-[0.15em] text-[#FFE8A3]/90 bg-[#FFE8A3]/10 px-2.5 py-1 rounded-full border border-[#FFE8A3]/20">
              In Stock
            </span>
          ) : (
            <span className="font-sans text-[9px] font-bold uppercase tracking-[0.15em] text-[#FFE8A3]/50 bg-black/20 px-2.5 py-1 rounded-full">
              Sold Out
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

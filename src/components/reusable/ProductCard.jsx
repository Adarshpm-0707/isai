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
      className="group flex flex-col bg-[#1a0806] border border-[#c20903]/30 rounded-lg overflow-hidden shadow-xl hover:shadow-2xl hover:border-[#f45d04]/60 transition-all duration-500"
    >
      {/* ── IMAGE AREA ── */}
      <div className="relative block w-full overflow-hidden bg-[#120404] h-48 sm:h-72 md:h-80 lg:h-72 xl:h-80">
        <Link to={`/products/${product.id}`} className="absolute inset-0 z-0">
          <img
            src={primaryImage}
            alt={product.name || 'Saree'}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Dark image bottom gradient fade - NO white shade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a0806] via-transparent to-transparent opacity-80 group-hover:opacity-30 transition-opacity pointer-events-none" />

        {/* Dark scrim overlay on hover for buttons */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 pointer-events-none" />

        {/* Category badge */}
        {product.category && (
          <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-gradient-to-r from-[#f45d04] to-[#c20903] text-[#efcf8b] font-sans font-bold text-[8px] sm:text-[9px] uppercase tracking-[0.15em] sm:tracking-[0.2em] px-2 py-0.5 sm:px-3 sm:py-1 z-10 pointer-events-none shadow-md rounded-full">
            {product.category}
          </span>
        )}

        {/* Sold Out overlay */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/75 flex items-center justify-center z-10 pointer-events-none">
            <span className="font-sans font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#efcf8b] border border-[#f45d04]/60 px-3 py-1 sm:px-5 sm:py-2 rounded-full">
              Sold Out
            </span>
          </div>
        )}

        {/* Action buttons */}
        {product.stock > 0 && (
          <div className="absolute bottom-2 sm:bottom-4 left-2 right-2 sm:left-3 sm:right-3 flex justify-center gap-1.5 sm:gap-2 opacity-100 sm:opacity-0 sm:translate-y-3 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 transition-all duration-300 z-10">
            <button
              onClick={(e) => { e.preventDefault(); addToCart(product, 1); }}
              type="button"
              title="Add to Cart"
              className="flex-1 flex items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-[#f45d04] to-[#c20903] text-[#efcf8b] font-sans font-bold text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.2em] py-2 sm:py-2.5 hover:from-[#c20903] hover:to-[#f45d04] transition-colors duration-300 cursor-pointer shadow-lg rounded-full"
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              Add
            </button>
            <Link
              to={`/products/${product.id}`}
              title="View Details"
              className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-[#120404] text-[#efcf8b] border border-[#f45d04]/40 hover:bg-[#f45d04] hover:text-[#efcf8b] transition-colors duration-300 rounded-full shadow-lg flex-shrink-0"
            >
              <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* ── DETAILS AREA ── */}
      <div className="p-2.5 sm:p-5 border-t border-[#c20903]/30 space-y-1.5 sm:space-y-3 bg-[#1a0806] text-[#efcf8b]">
        <Link
          to={`/products/${product.id}`}
          className="block font-playfair text-xs sm:text-base font-bold text-[#efcf8b] hover:text-[#f45d04] transition-colors line-clamp-1 tracking-wide"
        >
          {product.name}
        </Link>
        
        {product.description && (
          <p className="hidden sm:block font-sans text-[11px] text-[#efcf8b]/70 line-clamp-1 tracking-wide leading-relaxed">
            {product.description}
          </p>
        )}

        <div className="flex items-center justify-between pt-1 sm:pt-2 border-t border-white/10">
          <PriceTag price={product.price} size="sm" />
          {product.stock > 0 ? (
            <span className="font-sans text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.15em] text-[#f45d04]">
              In Stock
            </span>
          ) : (
            <span className="font-sans text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.15em] text-red-400">
              Sold Out
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

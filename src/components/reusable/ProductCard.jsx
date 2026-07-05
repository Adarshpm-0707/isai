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
      className="group flex flex-col bg-white overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500"
    >
      {/* ── IMAGE AREA ── */}
      <div className="relative block w-full overflow-hidden bg-[#F5F0EB] h-80 sm:h-72 md:h-80 lg:h-72 xl:h-80">
        <Link to={`/products/${product.id}`} className="absolute inset-0 z-0">
          <img
            src={primaryImage}
            alt={product.name || 'Saree'}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
        </Link>

        {/* Dark scrim on hover for action buttons */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-all duration-400 pointer-events-none" />

        {/* Category badge */}
        {product.category && (
          <span className="absolute top-3 left-3 bg-[#C9A227] text-[#1a1a1a] font-sans font-bold text-[9px] uppercase tracking-[0.2em] px-2.5 py-1 z-10 pointer-events-none">
            {product.category}
          </span>
        )}

        {/* Sold Out overlay */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 pointer-events-none">
            <span className="font-sans font-bold text-xs uppercase tracking-[0.2em] text-white border border-white/60 px-5 py-2">
              Sold Out
            </span>
          </div>
        )}

        {/* Hover action buttons */}
        {product.stock > 0 && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-400 z-10">
            <button
              onClick={(e) => { e.preventDefault(); addToCart(product, 1); }}
              type="button"
              title="Add to Cart"
              className="flex items-center gap-2 bg-[#6B0F1A] text-white font-sans font-bold text-[10px] uppercase tracking-[0.2em] px-4 py-2 hover:bg-[#C9A227] hover:text-[#1a1a1a] transition-colors duration-300 cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Add to Bag
            </button>
            <Link
              to={`/products/${product.id}`}
              title="View Details"
              className="flex items-center justify-center w-9 bg-white text-[#1a1a1a] hover:bg-[#C9A227] transition-colors duration-300"
            >
              <Eye className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>

      {/* ── DETAILS ── */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        <Link
          to={`/products/${product.id}`}
          className="block font-playfair text-[15px] font-bold text-[#1a1a1a] hover:text-[#6B0F1A] transition-colors line-clamp-1 tracking-wide"
        >
          {product.name}
        </Link>
        <p className="font-sans text-[11px] text-gray-400 line-clamp-1 tracking-wide">
          {product.description}
        </p>
        <div className="flex items-center justify-between pt-1">
          <PriceTag price={product.price} size="md" />
          {product.stock > 0 ? (
            <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-600">
              In Stock
            </span>
          ) : (
            <span className="font-sans text-[9px] font-bold uppercase tracking-[0.2em] text-red-400">
              Sold Out
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

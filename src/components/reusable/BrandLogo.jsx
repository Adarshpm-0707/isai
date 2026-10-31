import React from 'react';
import { Link } from 'react-router-dom';
import officialLogo from '../../assets/isai_logo.png';

/**
 * Official Isai Tarang Brand Logo Image
 */
export function BrandLogoImage({ className = 'h-10 sm:h-12 w-auto object-contain', alt = 'Isaitarang' }) {
  return (
    <img
      src={officialLogo}
      alt={alt}
      className={`${className} transition-transform duration-300 hover:scale-105 filter drop-shadow-[0_2px_12px_rgba(223,193,138,0.35)]`}
    />
  );
}

/**
 * Backward-compatible Lotus Emblem that uses the official gold logo icon or full logo
 */
export function LotusEmblem({ className = 'w-8 h-8 sm:w-10 sm:h-10 object-contain' }) {
  return (
    <img
      src={officialLogo}
      alt="Isaitarang Crest"
      className={`${className} object-contain transition-transform duration-300 hover:scale-110 filter drop-shadow-[0_2px_10px_rgba(223,193,138,0.3)]`}
    />
  );
}

/**
 * Main BrandLogo Component used across all pages
 */
export default function BrandLogo({
  to = '/',
  className = '',
  imgClassName = '',
  size = 'md',
  asImage = false,
}) {
  const sizeClasses = {
    xs: 'h-7 sm:h-8',
    sm: 'h-9 sm:h-11',
    md: 'h-12 sm:h-16',
    lg: 'h-16 sm:h-20',
    xl: 'h-20 sm:h-26',
    '2xl': 'h-24 sm:h-32',
  };

  const selectedSize = imgClassName || sizeClasses[size] || sizeClasses.md;

  const imageElement = (
    <img
      src={officialLogo}
      alt="Isai Tarang — Elegance in Every Thread"
      className={`${selectedSize} w-auto object-contain transition-all duration-300 group-hover:scale-105 filter drop-shadow-[0_3px_15px_rgba(223,193,138,0.35)]`}
    />
  );

  if (asImage || !to) {
    return (
      <div className={`inline-flex items-center justify-center select-none ${className}`}>
        {imageElement}
      </div>
    );
  }

  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center select-none group ${className}`}
      aria-label="Isaitarang Home"
    >
      {imageElement}
    </Link>
  );
}

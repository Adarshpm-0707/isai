import React from 'react';
import formatPrice from '../../utils/formatPrice';

export default function PriceTag({ price, originalPrice, className = '', size = 'md' }) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base font-semibold',
    lg: 'text-xl font-bold md:text-2xl',
  };

  return (
    <div className={`flex items-center gap-2 font-sans ${className}`}>
      <span className={`text-[#efcf8b] ${sizeClasses[size]} tracking-wide`}>
        {formatPrice(price)}
      </span>
      {originalPrice && (
        <span className="text-[#efcf8b]/50 line-through text-xs md:text-sm font-light">
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  );
}

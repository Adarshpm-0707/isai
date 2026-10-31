import React from 'react';
import formatPrice from '../../utils/formatPrice';

export default function PriceTag({ price, originalPrice, className = '', size = 'md' }) {
  const sizeClasses = {
    sm: 'text-xs sm:text-sm',
    md: 'text-sm sm:text-base font-semibold',
    lg: 'text-xl sm:text-2xl md:text-3xl font-bold',
  };

  return (
    <div className={`flex items-baseline gap-2 font-sans ${className}`}>
      <span className={`text-[#FDF8F4] font-bold ${sizeClasses[size]} tracking-tight`}>
        {formatPrice(price)}
      </span>
      {originalPrice && (
        <span className="text-[#8E7B6F] line-through text-xs md:text-sm font-normal">
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  );
}

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
      <span className={`text-[#F6D18A] font-bold ${sizeClasses[size]} tracking-wide`}>
        {formatPrice(price)}
      </span>
      {originalPrice && (
        <span className="text-[#D8A55A]/60 line-through text-xs md:text-sm font-light">
          {formatPrice(originalPrice)}
        </span>
      )}
    </div>
  );
}

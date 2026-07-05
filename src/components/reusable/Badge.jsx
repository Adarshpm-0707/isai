import React from 'react';

export default function Badge({ text, variant = 'default' }) {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider font-sans';
  
  const variants = {
    default: 'bg-ivory-dark text-maroon border border-maroon/20',
    primary: 'bg-maroon text-ivory',
    gold: 'bg-gold text-maroon',
    success: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border border-amber-200',
    danger: 'bg-rose-100 text-rose-800 border border-rose-200',
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.default}`}>
      {text}
    </span>
  );
}

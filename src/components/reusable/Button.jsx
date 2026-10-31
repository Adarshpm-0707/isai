import React from 'react';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-sans font-semibold uppercase tracking-wider transition-all duration-300 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer';

  const variants = {
    primary:
      'bg-[#C86A27] hover:bg-[#DB7B32] text-white font-bold shadow-lg rounded-full active:scale-[0.98]',
    gold:
      'bg-gradient-to-r from-[#DFC18A] to-[#C59B27] text-[#120B09] font-bold hover:brightness-110 shadow-lg rounded-full',
    secondary:
      'bg-[#1E130F] text-[#DFC18A] hover:bg-[#261914] border border-[#35221B] shadow-md rounded-full font-bold',
    outline:
      'bg-transparent text-[#DFC18A] border border-[#DFC18A]/50 hover:border-[#DFC18A] hover:bg-[#DFC18A]/10 font-bold rounded-full',
  };

  const sizes = {
    sm: 'text-[11px] px-4 py-2',
    md: 'text-xs px-6 py-3',
    lg: 'text-sm px-8 py-3.5',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

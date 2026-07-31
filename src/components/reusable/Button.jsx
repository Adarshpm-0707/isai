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
  const baseStyles = 'inline-flex items-center justify-center font-sans font-semibold uppercase tracking-wider transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-[#f45d04] text-[#efcf8b] hover:bg-[#c44900] border border-[#f45d04] hover:border-[#f45d04]',
    secondary: 'bg-[#1a0806] text-[#efcf8b] hover:bg-[#f45d04] border border-[#f45d04]/40',
    outline: 'bg-transparent text-[#efcf8b] border border-[#f45d04] hover:bg-[#f45d04] hover:text-[#efcf8b]',
  };

  const sizes = {
    sm: 'text-xs px-4 py-2',
    md: 'text-sm px-6 py-3',
    lg: 'text-base px-8 py-4',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

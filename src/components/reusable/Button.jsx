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
    primary: 'bg-gradient-to-r from-[#F6D18A] via-[#D8A55A] to-[#B67A2F] text-[#2B1409] font-bold hover:brightness-110 border border-[#F6D18A] shadow-md rounded-full',
    secondary: 'bg-[rgb(249,108,2)] text-[#F6D18A] hover:bg-[#E85E00] border border-[#F6D18A]/50 shadow-md rounded-full font-bold',
    outline: 'bg-transparent text-[#F6D18A] border border-[#F6D18A] hover:bg-[#F6D18A] hover:text-[#2B1409] font-bold rounded-full',
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

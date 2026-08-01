import React from 'react';

export default function Badge({ text, variant = 'default' }) {
  const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider font-sans';
  
  const variants = {
    default: 'bg-[#5C2F14] text-[#F6D18A] border border-[#D8A55A]/30',
    primary: 'bg-gradient-to-r from-[#F6D18A] via-[#D8A55A] to-[#B67A2F] text-[#2B1409] font-bold',
    gold: 'bg-gradient-to-r from-[#F6D18A] to-[#D8A55A] text-[#2B1409] font-bold',
    success: 'bg-[#5C2F14] text-[#F6D18A] border border-[#F6D18A]/40',
    warning: 'bg-[#3E1B0E] text-[#D8A55A] border border-[#B67A2F]/40',
    danger: 'bg-[#2B1409] text-[#B67A2F] border border-[#B67A2F]/40',
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.default}`}>
      {text}
    </span>
  );
}

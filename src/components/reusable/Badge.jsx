import React from 'react';

export default function Badge({ text, variant = 'default' }) {
  const baseStyles =
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-wider font-sans';

  const variants = {
    default: 'bg-[#1E130F] text-[#DFC18A] border border-[#35221B]',
    primary: 'bg-[#C86A27] text-white font-bold shadow-sm',
    gold: 'bg-gradient-to-r from-[#DFC18A] to-[#C59B27] text-[#120B09] font-bold shadow-sm',
    amber: 'bg-[#C86A27] text-white font-bold',
    success: 'bg-[#1E130F] text-[#4ADE80] border border-[#4ADE80]/30',
    warning: 'bg-[#1E130F] text-[#FBBF24] border border-[#FBBF24]/30',
    danger: 'bg-[#1E130F] text-[#F87171] border border-[#F87171]/30',
  };

  return (
    <span className={`${baseStyles} ${variants[variant] || variants.default}`}>
      {text}
    </span>
  );
}

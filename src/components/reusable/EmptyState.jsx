import React from 'react';
import { useNavigate } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import { FloralOrnament } from './FloralOrnament';

export default function EmptyState({
  title = 'No Sarees Found',
  message = 'Explore our handcrafted heirloom collections to find your match.',
  actionText = 'Browse Shop',
  actionPath = '/products',
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center text-center py-12 px-6 bg-[#1E130F] border border-[#35221B] max-w-md mx-auto my-12 rounded-2xl shadow-2xl text-[#FDF8F4]">
      <div className="mb-4">
        <BrandLogo size="md" />
      </div>
      <h3
        className="font-serif text-xl font-normal text-[#FDF8F4] tracking-wide mb-1"
        style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
      >
        {title}
      </h3>
      <FloralOrnament className="mb-2" />
      <p className="text-xs sm:text-sm text-[#C7B5A7] font-light max-w-xs mb-6 leading-relaxed">
        {message}
      </p>
      {actionText && (
        <button
          onClick={() => navigate(actionPath)}
          className="px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#C86A27] hover:bg-[#DB7B32] text-white shadow-lg shadow-[#C86A27]/25 transition-all cursor-pointer"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

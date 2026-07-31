import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import Button from './Button';

export default function EmptyState({
  title = 'No Sarees Found',
  message = 'Explore our handcrafted heirloom collections to find your match.',
  actionText = 'Browse Shop',
  actionPath = '/products',
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center text-center py-16 px-6 bg-[#1a0806] border border-[#f45d04]/30 max-w-md mx-auto my-12 rounded-sm shadow-xl backdrop-blur-sm text-[#efcf8b]">
      <div className="w-14 h-14 bg-[#f45d04]/10 border border-[#f45d04]/30 rounded-full flex items-center justify-center mb-6">
        <ShoppingBag className="w-6 h-6 text-[#f45d04]" />
      </div>
      <h3 className="font-playfair text-xl font-bold text-[#efcf8b] tracking-wider uppercase mb-2">
        {title}
      </h3>
      <p className="text-xs md:text-sm text-[#efcf8b]/70 font-sans tracking-wide max-w-xs mb-6">
        {message}
      </p>
      {actionText && (
        <Button variant="outline" size="sm" onClick={() => navigate(actionPath)}>
          {actionText}
        </Button>
      )}
    </div>
  );
}

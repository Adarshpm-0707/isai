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
    <div className="flex flex-col items-center text-center py-16 px-6 bg-[#F6D18A]/10 border border-[#F6D18A]/40 max-w-md mx-auto my-12 rounded-sm shadow-xl text-[#F6D18A]">
      <div className="w-14 h-14 bg-[#F6D18A]/20 border border-[#F6D18A]/40 rounded-full flex items-center justify-center mb-6">
        <ShoppingBag className="w-6 h-6 text-[#F6D18A]" />
      </div>
      <h3 className="font-playfair text-xl font-bold text-[#F6D18A] tracking-wider uppercase mb-2">
        {title}
      </h3>
      <p className="text-xs md:text-sm text-[#D8A55A] font-sans tracking-wide max-w-xs mb-6 font-medium">
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

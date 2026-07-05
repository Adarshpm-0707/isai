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
    <div className="flex flex-col items-center text-center py-16 px-6 bg-white/40 border border-gold/20 max-w-md mx-auto my-12 rounded-sm shadow-sm backdrop-blur-sm">
      <div className="w-14 h-14 bg-maroon/5 border border-maroon/15 rounded-full flex items-center justify-center mb-6">
        <ShoppingBag className="w-6 h-6 text-maroon" />
      </div>
      <h3 className="font-playfair text-xl font-bold text-maroon tracking-wider uppercase mb-2">
        {title}
      </h3>
      <p className="text-xs md:text-sm text-gray-500 font-sans tracking-wide max-w-xs mb-6">
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

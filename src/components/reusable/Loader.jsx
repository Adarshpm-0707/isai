import React from 'react';

export default function Loader({ fullPage = false }) {
  const loaderContent = (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative w-16 h-16">
        {/* Outer Maroon Spinner */}
        <div className="absolute inset-0 rounded-full border-4 border-maroon/20 border-t-maroon animate-spin"></div>
        {/* Inner Gold Spinner */}
        <div className="absolute inset-2 rounded-full border-4 border-gold/20 border-b-gold animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
      </div>
      <span className="font-playfair text-maroon text-xs uppercase tracking-widest animate-pulse">
        Loading Elegance...
      </span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-ivory/80 backdrop-blur-md z-50 flex items-center justify-center">
        {loaderContent}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-12">
      {loaderContent}
    </div>
  );
}

import React, { useState, useEffect } from 'react';

export default function ImageGallery({ images = [] }) {
  const fallbackImages = [
    'https://images.unsplash.com/photo-1610030470258-a4005cfa2c5a?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=600',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&q=80&w=600'
  ];

  // Clean empty values
  const list = (images && images.length > 0 ? images : fallbackImages).filter(Boolean);
  const [active, setActive] = useState(list[0]);

  // Sync state if images array updates (e.g. switching product detail pages)
  useEffect(() => {
    if (list.length > 0) {
      setActive(list[0]);
    }
  }, [images]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {/* Side Thumbnails */}
      <div className="flex md:flex-col gap-2 order-2 md:order-1 overflow-x-auto md:overflow-x-visible">
        {list.map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(img)}
            className={`relative flex-shrink-0 w-16 sm:w-20 md:w-full aspect-[3/4] overflow-hidden border-2 rounded-sm transition-all ${
              active === img
                ? 'border-[#f45d04] shadow-lg scale-102'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img src={img} alt={`Detail ${i}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className="md:col-span-4 order-1 md:order-2 aspect-[3/4] w-full overflow-hidden border border-[#f45d04]/30 bg-[#1a0806] rounded-sm shadow-xl">
        <img
          src={active || list[0]}
          alt="Main product detail"
          className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
        />
      </div>
    </div>
  );
}

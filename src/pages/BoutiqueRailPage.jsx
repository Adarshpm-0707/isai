import React, { useState } from 'react';
import BoutiqueRailShowcase from '../components/product/BoutiqueRailShowcase';
import useProducts from '../hooks/useProducts';

export default function BoutiqueRailPage() {
  const { products } = useProducts();
  const [viewMode, setViewMode] = useState('interactive'); // 'interactive' or 'standalone-html'

  return (
    <div className="w-full min-h-screen bg-[#120B09] text-[#FDF8F4] flex flex-col">
      {/* Top Bar Switcher */}
      <div className="px-4 py-3 bg-[#1A100C] border-b border-[#35221B] flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-serif text-[#DFC18A] font-medium tracking-wider uppercase">
            Maison Verrel &amp; Isai The Rail
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setViewMode('interactive')}
            className={`px-3 py-1 rounded-full cursor-pointer transition-colors ${
              viewMode === 'interactive'
                ? 'bg-[#DFC18A] text-[#120B09] font-bold'
                : 'text-[#C7B5A7] hover:text-white'
            }`}
          >
            React Showcase
          </button>
          <a
            href="/maison-verrel.html"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1 rounded-full border border-[#DFC18A]/40 text-[#DFC18A] hover:bg-[#DFC18A]/10 transition-colors"
          >
            Open Standalone Studio Hero ↗
          </a>
        </div>
      </div>

      <div className="flex-1 w-full flex items-center justify-center p-2 sm:p-6">
        {viewMode === 'interactive' ? (
          <div className="w-full max-w-7xl">
            <BoutiqueRailShowcase products={products} />
          </div>
        ) : (
          <iframe
            src="/maison-verrel.html"
            title="Maison Verrel The Rail"
            className="w-full h-[90vh] border-0 rounded-2xl shadow-2xl"
          />
        )}
      </div>
    </div>
  );
}


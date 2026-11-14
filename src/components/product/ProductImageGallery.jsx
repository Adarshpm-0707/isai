import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PLACEHOLDER_IMG =
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&q=80&w=800';

export default function ProductImageGallery({ images = [] }) {
  const list = images.filter(Boolean);
  const displayList = list.length > 0 ? list : [PLACEHOLDER_IMG];
  const [activeIdx, setActiveIdx] = useState(0);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setActiveIdx(0);
    setImgError(false);
  }, [images]);

  const prev = () =>
    setActiveIdx((i) => (i === 0 ? displayList.length - 1 : i - 1));
  const next = () =>
    setActiveIdx((i) => (i === displayList.length - 1 ? 0 : i + 1));

  const activeSrc = imgError
    ? PLACEHOLDER_IMG
    : displayList[activeIdx] || PLACEHOLDER_IMG;

  return (
    <div className="flex flex-col gap-3">
      {/* Main Image */}
      <div className="relative w-full aspect-[3/4] overflow-hidden rounded-2xl bg-[#1A100C] border border-[#35221B] shadow-[0_8px_40px_rgba(0,0,0,0.6)] group">
        <AnimatePresence mode="wait">
          <motion.img
            key={activeIdx}
            src={activeSrc}
            alt="Product"
            loading="eager"
            decoding="async"
            onError={() => setImgError(true)}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.28 }}
            className="w-full h-full object-cover object-center"
          />
        </AnimatePresence>

        {/* Arrow nav (multi-image only) */}
        {displayList.length > 1 && (
          <>
            <button
              onClick={prev}
              type="button"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white/80 hover:text-white hover:bg-black/70 transition-all opacity-0 group-hover:opacity-100"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            {/* Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {displayList.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIdx(i)}
                  className={`rounded-full transition-all duration-200 ${
                    i === activeIdx
                      ? 'w-5 h-2 bg-[#DFC18A]'
                      : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {displayList.length > 1 && (
        <div
          className="flex gap-2 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none' }}
        >
          {displayList.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setActiveIdx(i);
                setImgError(false);
              }}
              className={`flex-shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all ${
                i === activeIdx
                  ? 'border-[#DFC18A] shadow-[0_0_12px_rgba(223,193,138,0.4)]'
                  : 'border-[#35221B] opacity-55 hover:opacity-90'
              }`}
            >
              <img
                src={img}
                alt={`view-${i}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


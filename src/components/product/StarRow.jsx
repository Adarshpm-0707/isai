import React from 'react';
import { Star } from 'lucide-react';

export default function StarRow({ value = 5, onChange = null, size = 'sm' }) {
  const sz = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange && onChange(s)}
          className={
            onChange ? 'cursor-pointer' : 'cursor-default pointer-events-none'
          }
        >
          <Star
            className={`${sz} transition-colors ${
              s <= value
                ? 'text-[#DFC18A] fill-[#DFC18A]'
                : 'text-[#35221B] fill-[#35221B]'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

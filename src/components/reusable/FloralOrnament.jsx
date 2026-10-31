import React from 'react';

/**
 * Delicate golden lotus ornament divider seen in headings and section titles
 */
export function FloralOrnament({ className = "my-2" }) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <span className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent to-[#DFC18A]/60" />
      <svg width="20" height="12" viewBox="0 0 20 12" fill="none" className="text-[#DFC18A] shrink-0">
        <path
          d="M10 1C9.2 4.5 8 7 10 11C12 7 10.8 4.5 10 1Z"
          fill="#DFC18A"
        />
        <path
          d="M10 11C7.5 8.5 5 7.5 1 7C4 8.5 7.5 10 10 11Z"
          fill="#C59B27"
          opacity="0.8"
        />
        <path
          d="M10 11C12.5 8.5 15 7.5 19 7C16 8.5 12.5 10 10 11Z"
          fill="#C59B27"
          opacity="0.8"
        />
      </svg>
      <span className="w-8 sm:w-12 h-px bg-gradient-to-l from-transparent to-[#DFC18A]/60" />
    </div>
  );
}

/**
 * Botanical leaf line flourish for footer
 */
export function BotanicalBranch({ className = "", flip = false }) {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      className={`${flip ? "scale-x-[-1]" : ""} text-[#DFC18A]/60 ${className}`}
    >
      <path
        d="M8 40 C 14 34, 22 24, 38 10"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      {/* Leaf 1 */}
      <path
        d="M20 28 C 21 21, 28 20, 27 27 C 24 29, 21 29, 20 28 Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      {/* Leaf 2 */}
      <path
        d="M27 21 C 28 14, 35 15, 33 21 C 31 22, 28 22, 27 21 Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      {/* Leaf 3 */}
      <path
        d="M15 32 C 11 28, 12 21, 18 25 C 17 29, 16 31, 15 32 Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
      {/* Tip leaf */}
      <path
        d="M38 10 C 40 4, 46 6, 43 11 C 41 12, 39 11, 38 10 Z"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
      />
    </svg>
  );
}

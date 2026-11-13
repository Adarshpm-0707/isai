import React from 'react';

/**
 * Royal header ornament with glowing lotus, diamond jewels, and tapering golden filigree lines
 */
export function RoyalHeaderOrnament({ className = "my-3" }) {
  return (
    <div className={`flex items-center justify-center gap-2 sm:gap-3.5 select-none ${className}`}>
      {/* Left tapering line */}
      <span className="w-8 sm:w-20 md:w-28 h-px bg-gradient-to-r from-transparent via-[#DFC18A]/40 to-[#DFC18A]" />
      
      {/* Left diamond dot */}
      <span className="w-1.5 h-1.5 rotate-45 bg-[#DFC18A]/80 shadow-[0_0_6px_rgba(223,193,138,0.7)] shrink-0" />
      
      {/* Center lotus icon */}
      <div className="relative flex items-center justify-center shrink-0">
        <svg width="24" height="14" viewBox="0 0 24 14" fill="none" className="text-[#DFC18A] drop-shadow-[0_0_8px_rgba(223,193,138,0.4)]">
          <path
            d="M12 0.5C10.8 4.5 9.2 8.5 12 13.5C14.8 8.5 13.2 4.5 12 0.5Z"
            fill="#DFC18A"
          />
          <path
            d="M12 13.5C8.8 10.2 5.2 9 1 8.5C4.8 10.5 9 12.5 12 13.5Z"
            fill="#C86A27"
            opacity="0.9"
          />
          <path
            d="M12 13.5C15.2 10.2 18.8 9 23 8.5C19.2 10.5 15 12.5 12 13.5Z"
            fill="#C86A27"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Right diamond dot */}
      <span className="w-1.5 h-1.5 rotate-45 bg-[#DFC18A]/80 shadow-[0_0_6px_rgba(223,193,138,0.7)] shrink-0" />

      {/* Right tapering line */}
      <span className="w-8 sm:w-20 md:w-28 h-px bg-gradient-to-l from-transparent via-[#DFC18A]/40 to-[#DFC18A]" />
    </div>
  );
}

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

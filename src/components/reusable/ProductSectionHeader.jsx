import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { LotusEmblem } from './BrandLogo';
import { RoyalHeaderOrnament } from './FloralOrnament';

export default function ProductSectionHeader({
  badge = 'Curated Collection',
  badgeIcon: BadgeIcon = LotusEmblem,
  title = 'Featured',
  titleAccent = 'Creations',
  subtitle = 'Handwoven heritage weaves meticulously curated for their ethereal drape and timeless grandeur.',
  actionText = 'Show More',
  actionLink = null,
  onAction = null,
  align = 'center',
  className = '',
  hideMobileAction = false,
}) {
  const isCenter = align === 'center';

  return (
    <div className={`relative mb-8 sm:mb-12 ${className}`}>
      {/* Background Ambient Radial Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-[500px] h-32 bg-[#DFC18A]/[0.07] rounded-full blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      <div className={`relative z-10 flex flex-col ${isCenter ? 'items-center text-center' : 'items-start text-left'}`}>
        {/* Eyebrow Badge Pill */}
        {badge && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#DFC18A]/30 bg-gradient-to-r from-[#1E130F]/90 via-[#261712]/90 to-[#1E130F]/90 backdrop-blur-md shadow-[0_2px_12px_rgba(0,0,0,0.4)] mb-3 transition-transform hover:scale-105 duration-300">
            {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5 text-[#DFC18A] shrink-0" />}
            <span className="text-[9px] sm:text-[11px] font-semibold tracking-[0.26em] uppercase text-[#DFC18A]">
              {badge}
            </span>
          </div>
        )}

        {/* Main Majestic Title */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-2.5">
          <h2
            className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-normal text-[#FDF8F4] leading-tight tracking-tight"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            {title}{' '}
            {titleAccent && (
              <span className="italic font-normal font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#FFF0D4] via-[#DFC18A] to-[#C59B27]">
                {titleAccent}
              </span>
            )}
          </h2>
        </div>

        {/* Royal Lotus Filigree Ornament */}
        <RoyalHeaderOrnament className="mt-2.5 mb-1" />

        {/* Subtitle Description */}
        {subtitle && (
          <p className="text-xs sm:text-sm text-[#C7B5A7] max-w-xl mx-auto font-light leading-relaxed mt-2 px-2">
            {subtitle}
          </p>
        )}

        {/* Action Button for Mobile (hidden if hideMobileAction is true) */}
        {!hideMobileAction && (actionLink || onAction) && actionText && (
          <div className="mt-4 sm:hidden">
            {actionLink ? (
              <Link
                to={actionLink}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#DFC18A]/40 bg-[#1A100C]/80 backdrop-blur-md text-xs font-medium text-[#DFC18A] hover:bg-[#DFC18A] hover:text-[#120B09] transition-all duration-300 shadow-md group"
              >
                <span>{actionText}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : (
              <button
                type="button"
                onClick={onAction}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#DFC18A]/40 bg-[#1A100C]/80 backdrop-blur-md text-xs font-medium text-[#DFC18A] hover:bg-[#DFC18A] hover:text-[#120B09] transition-all duration-300 shadow-md group cursor-pointer"
              >
                <span>{actionText}</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Floating Action Button for Tablet/Desktop (placed top-right relative to container) */}
      {(actionLink || onAction) && actionText && (
        <div className="hidden sm:block absolute right-0 top-1/2 -translate-y-1/2 z-20">
          {actionLink ? (
            <Link
              to={actionLink}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#DFC18A]/40 bg-[#1A100C]/90 backdrop-blur-md text-xs font-semibold tracking-wider text-[#DFC18A] hover:bg-[#DFC18A] hover:text-[#120B09] hover:border-[#DFC18A] transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.4)] group cursor-pointer"
            >
              <span>{actionText}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={onAction}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#DFC18A]/40 bg-[#1A100C]/90 backdrop-blur-md text-xs font-semibold tracking-wider text-[#DFC18A] hover:bg-[#DFC18A] hover:text-[#120B09] hover:border-[#DFC18A] transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.4)] group cursor-pointer"
            >
              <span>{actionText}</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}


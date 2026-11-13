import React from 'react';
import { motion } from 'framer-motion';

export default function SectionHeading({
  title,
  subtitle,
  eyebrow = null,
  align = 'center',
  className = '',
}) {
  const isCenter = align === 'center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`space-y-2 mb-8 ${isCenter ? 'text-center' : 'text-left'} ${className}`}
    >
      {eyebrow && (
        <span className="inline-block text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] uppercase text-[#DFC18A] mb-1">
          {eyebrow}
        </span>
      )}
      <h2
        className="text-2xl sm:text-3xl lg:text-4xl font-serif text-[#FDF8F4] tracking-tight leading-tight"
        style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`text-xs sm:text-sm text-[#C7B5A7] max-w-xl font-light leading-relaxed ${isCenter ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
      {/* Decorative Golden Divider */}
      <div className={`flex items-center gap-2 pt-1 ${isCenter ? 'justify-center' : 'justify-start'}`}>
        <span className="h-[2px] w-10 sm:w-16 bg-gradient-to-r from-transparent via-[#DFC18A] to-[#DFC18A]" />
        <span className="w-1.5 h-1.5 rotate-45 bg-[#DFC18A] shadow-[0_0_6px_rgba(223,193,138,0.7)]" />
        <span className="h-[2px] w-10 sm:w-16 bg-gradient-to-l from-transparent via-[#DFC18A] to-[#DFC18A]" />
      </div>
    </motion.div>
  );
}

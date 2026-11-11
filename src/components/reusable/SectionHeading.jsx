import React from 'react';
import { motion } from 'framer-motion';

export default function SectionHeading({ title, subtitle, align = 'center', className = '' }) {
  const isCenter = align === 'center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.4 }}
      className={`space-y-2 mb-8 ${isCenter ? 'text-center' : 'text-left'} ${className}`}
    >
      <h2 className="text-2xl sm:text-3xl font-sans font-bold text-[#FFFFFF] tracking-wide uppercase">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs sm:text-sm text-[#A1A1AA] font-sans tracking-wide max-w-xl font-normal">
          {subtitle}
        </p>
      )}
      <div className={`h-[2px] w-16 bg-gradient-to-r from-[#D4AF37] via-[#B8860B] to-[#8B6508] ${isCenter ? 'mx-auto' : ''}`} />
    </motion.div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';

export default function SectionHeading({ title, subtitle, align = 'center' }) {
  const isCenter = align === 'center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6 }}
      className={`space-y-3 mb-10 ${isCenter ? 'text-center' : 'text-left'}`}
    >
      <h2 className="text-3xl md:text-4xl font-playfair font-bold text-[#F6D18A] tracking-wider uppercase">
        {title}
      </h2>
      {subtitle && (
        <p className="text-xs md:text-sm text-[#D8A55A] font-sans tracking-widest uppercase max-w-xl mx-auto font-medium">
          {subtitle}
        </p>
      )}
      <div className={`h-[2px] w-20 bg-gradient-to-r from-[#F6D18A] via-[#D8A55A] to-[#B67A2F] ${isCenter ? 'mx-auto' : ''}`} />
    </motion.div>
  );
}

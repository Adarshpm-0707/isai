import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BrandLogo from '../components/reusable/BrandLogo';
import { FloralOrnament } from '../components/reusable/FloralOrnament';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center text-center px-4 py-16 bg-[#120B09] text-[#FDF8F4]">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 max-w-md relative z-10"
      >
        <BrandLogo size="lg" className="mx-auto" />

        <h1
          className="text-8xl sm:text-9xl font-normal text-[#DFC18A] tracking-wider opacity-60 font-serif"
          style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
        >
          404
        </h1>

        <div className="space-y-2">
          <h2
            className="font-serif text-2xl sm:text-3xl text-[#FDF8F4]"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            Lost in the Weaves
          </h2>
          <FloralOrnament />
          <p className="text-xs sm:text-sm text-[#C7B5A7] font-light max-w-sm mx-auto leading-relaxed">
            The drape or page you are looking for does not exist or has been archived.
          </p>
        </div>

        <div>
          <button
            onClick={() => navigate('/')}
            type="button"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#C86A27] hover:bg-[#DB7B32] text-white text-xs font-semibold uppercase tracking-wider shadow-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Homepage</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}

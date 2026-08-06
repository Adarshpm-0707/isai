import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Assets
import fabricImg from '../../assets/saree_isai.png';

const FABRIC_WORDS = ['Airy Organza', 'Pure Mulberry Silk', 'Royal Banarasi', 'Temple Kanchipuram'];

export default function HeroSection({
  fabricImageUrl = fabricImg,
}) {
  const navigate = useNavigate();
  const [wordIdx, setWordIdx] = useState(0);
  
  // Mouse parallax effect
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    setMousePos({
      x: (e.clientX / window.innerWidth - 0.5) * 30,
      y: (e.clientY / window.innerHeight - 0.5) * 30,
    });
  };

  useEffect(() => {
    const t = setInterval(() => setWordIdx((i) => (i + 1) % FABRIC_WORDS.length), 3500);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative w-full min-h-[100dvh] h-[100dvh] bg-[#0E2A1C] overflow-hidden select-none flex flex-col justify-between"
    >
      {/* 1. BACKGROUND GLOW - Subtle light following mouse */}
      <div 
        className="absolute inset-0 opacity-25 pointer-events-none transition-all duration-700 ease-out z-0"
        style={{
          background: `radial-gradient(circle at ${50 + mousePos.x/2}% ${50 + mousePos.y/2}%, #D4AF7A 0%, transparent 55%)`,
        }}
      />

      {/* 2. LARGE BACKGROUND TEXT (Watermark) */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.04 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0"
      >
        <h2 className="text-[32vw] font-cinzel-decorative font-black leading-none text-[#F3E5AB]">
          ISAI
        </h2>
      </motion.div>

      {/* 3. MOBILE & TABLET FLEX CONTAINER (< lg screens) */}
      <div className="lg:hidden relative z-20 w-full h-full flex flex-col justify-between items-center text-center px-4 pt-16 pb-6 overflow-y-auto no-scrollbar">
        
        {/* Top Header Block */}
        <div className="flex flex-col items-center max-w-lg w-full z-40">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-cinzel-decorative font-bold uppercase drop-shadow-[0_10px_25px_rgba(0,0,0,0.9)] flex flex-col items-center gap-1 my-2"
            style={{ fontSize: 'clamp(3.5rem, 12vw, 5.2rem)' }}
          >
            <span className="block text-[#E3C381] tracking-wider leading-tight whitespace-nowrap">
              The Art
            </span>
            <span className="block font-bold text-[#F3E5AB] tracking-wider leading-tight whitespace-nowrap">
              of Draping
            </span>
          </motion.h1>

          {/* Selected Material */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col items-center mt-2 w-full"
          >
            <p className="text-xs sm:text-sm font-bold tracking-[0.35em] text-[#D4AF7A] uppercase mb-1">
              Selected Material
            </p>
            <div className="h-[2px] w-14 bg-[#D4AF7A] mx-auto mb-2" />
            
            <AnimatePresence mode="wait">
              <motion.h3
                key={wordIdx}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-[#F3E5AB] font-cinzel-decorative font-bold text-2xl xs:text-3xl sm:text-3xl mb-2"
              >
                {FABRIC_WORDS[wordIdx]}
              </motion.h3>
            </AnimatePresence>

            <p className="text-[#D8D0C0]/90 text-sm leading-relaxed font-light max-w-[340px]">
              Heirlooms hand-spun from pure mulberry silk, capturing centuries of Indian weaving wisdom in every single fold.
            </p>
          </motion.div>
        </div>

        {/* Saree Image Draped at Bottom-Left on Mobile */}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none z-10 flex justify-start items-end overflow-hidden h-[55%]">
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            src={fabricImageUrl}
            alt="Draped Saree"
            className="w-[110%] xs:w-[95%] sm:w-[80%] max-w-[600px] h-auto object-contain origin-bottom-left filter contrast-[1.05] drop-shadow-[0_15px_50px_rgba(0,0,0,0.85)]"
          />
        </div>

        {/* Mobile CTA Button (Moved slightly up on Right Side) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="absolute bottom-12 right-4 xs:right-6 sm:bottom-14 sm:right-8 z-50"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <button
            onClick={() => navigate('/products')}
            className="relative w-24 h-24 xs:w-28 xs:h-28 flex items-center justify-center group pointer-events-auto cursor-pointer"
          >
            <svg className="absolute inset-0 w-full h-full animate-[spin_12s_linear_infinite]" viewBox="0 0 100 100">
              <defs>
                <path id="circlePathMobile" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
              </defs>
              <text fill="#D4AF7A" fontSize="7.5" className="uppercase tracking-[0.1em] font-sans font-bold">
                <textPath xlinkHref="#circlePathMobile">
                  Explore Heritage • Shop Collection • 
                </textPath>
              </text>
            </svg>
            <div className="w-10 h-10 xs:w-12 xs:h-12 rounded-full bg-[#D4AF7A] flex items-center justify-center group-hover:bg-[#F3E5AB] transition-colors duration-300 shadow-xl">
              <span className="text-[#060F0B] text-lg font-bold">→</span>
            </div>
          </button>
        </motion.div>
      </div>


      {/* 4. DESKTOP / LAPTOP LAYOUT (>= lg screens) */}
      <div className="hidden lg:flex relative z-20 w-full h-full items-center justify-center px-8">
        
        {/* Main Heading Overhead */}
        <div className="absolute top-[6%] inset-x-0 z-40 flex flex-col items-center justify-center text-center pointer-events-none px-4 mx-auto max-w-7xl">
          <motion.h1 
            style={{ 
              x: mousePos.x * -0.3, 
              y: mousePos.y * -0.3,
              fontSize: 'clamp(4.2rem, 7.5vw, 6.8rem)' 
            }}
            className="font-cinzel-decorative font-bold text-center flex flex-col items-center justify-center gap-1.5 drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)] uppercase"
          >
            <motion.span 
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, ease: "circOut" }}
              className="block text-[#E3C381] tracking-wider leading-tight whitespace-nowrap"
            >
              The Art
            </motion.span>
            <motion.span 
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: "circOut" }}
              className="block font-bold text-[#F3E5AB] tracking-wider leading-tight whitespace-nowrap"
            >
              of Draping
            </motion.span>
          </motion.h1>
        </div>

        {/* Saree Image on Laptop (Left Side Draped) */}
        <motion.div
          animate={{ 
            x: mousePos.x * 1.2, 
            y: mousePos.y * 1.2 + Math.sin(Date.now()/2000) * 8 
          }}
          transition={{ type: 'spring', stiffness: 50, damping: 20 }}
          className="absolute left-[0%] bottom-0 z-30 w-[52%] xl:w-[50%] max-w-[850px] pointer-events-none drop-shadow-[0_25px_70px_rgba(0,0,0,0.85)]"
        >
          <img
            src={fabricImageUrl}
            alt="Draped Saree"
            className="w-full h-auto object-contain origin-bottom-left filter contrast-[1.05]"
          />
        </motion.div>

        {/* Selected Material Card (Top-Right on Laptop) */}
        <motion.div 
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="absolute top-[52%] xl:top-[55%] right-[6%] xl:right-[10%] text-right flex flex-col items-end z-40 max-w-xs xl:max-w-sm"
        >
          <p className="text-xs font-bold tracking-[0.35em] text-[#D4AF7A] uppercase mb-1.5">Selected Material</p>
          <div className="h-[2px] w-14 bg-[#D4AF7A] ml-auto mb-3" />
          <AnimatePresence mode="wait">
            <motion.h3
              key={wordIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-[#F3E5AB] font-cinzel-decorative font-bold text-2xl xl:text-4xl mb-3"
            >
              {FABRIC_WORDS[wordIdx]}
            </motion.h3>
          </AnimatePresence>
          <p className="text-[#D8D0C0]/90 text-sm leading-relaxed font-light">
            Heirlooms hand-spun from pure mulberry silk, capturing centuries of Indian weaving wisdom in every single fold.
          </p>
        </motion.div>



        {/* Rotating CTA Button (Bottom-Center on Laptop) */}
        <motion.div 
          className="absolute bottom-[5%] xl:bottom-[6%] left-1/2 -translate-x-1/2 z-50"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.92 }}
        >
          <button
            onClick={() => navigate('/products')}
            className="relative w-30 h-30 xl:w-36 xl:h-36 flex items-center justify-center group pointer-events-auto cursor-pointer"
          >
            <svg className="absolute inset-0 w-full h-full animate-[spin_12s_linear_infinite]" viewBox="0 0 100 100">
              <defs>
                <path id="circlePathLaptop" d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
              </defs>
              <text fill="#D4AF7A" fontSize="7.5" className="uppercase tracking-[0.1em] font-sans font-bold">
                <textPath xlinkHref="#circlePathLaptop">
                  Explore Heritage • Shop Collection • 
                </textPath>
              </text>
            </svg>
            <div className="w-12 h-12 xl:w-14 xl:h-14 rounded-full bg-[#D4AF7A] flex items-center justify-center group-hover:bg-[#F3E5AB] transition-colors duration-300 shadow-xl">
              <span className="text-[#060F0B] text-xl font-bold">→</span>
            </div>
          </button>
        </motion.div>
      </div>

      {/* 5. DECORATIVE BORDER ACCENTS */}
      <div className="absolute inset-8 border border-[#D4AF7A]/10 pointer-events-none hidden lg:block z-10" />
    </section>
  );
}
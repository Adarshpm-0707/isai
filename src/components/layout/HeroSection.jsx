import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, Award } from "lucide-react";

import heroDesktopImg from "../../assets/hero_desktop.png";
import heroMobileImg from "../../assets/hero_mobile.png";

/* ── Traditional Kerala Kolam (Pookkalam Mandala) SVG Ring ── */
function KollamRing({ className = "" }) {
  return (
    <svg className={className} width="180" height="180" viewBox="0 0 180 180" fill="none" opacity="0.22">
      <circle cx="90" cy="90" r="84" stroke="#D4AF37" strokeWidth="1" strokeDasharray="6 4" />
      <circle cx="90" cy="90" r="66" stroke="#FFD54F" strokeWidth="1" strokeDasharray="4 6" />
      <circle cx="90" cy="90" r="44" stroke="#D4AF37" strokeWidth="1" />
      <circle cx="90" cy="90" r="22" stroke="#FFD54F" strokeWidth="0.8" />
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => (
        <line
          key={a}
          x1="90"
          y1="90"
          x2={90 + 84 * Math.cos((a * Math.PI) / 180)}
          y2={90 + 84 * Math.sin((a * Math.PI) / 180)}
          stroke="#D4AF37"
          strokeWidth="0.8"
          opacity="0.7"
        />
      ))}
    </svg>
  );
}

/* ── Onam SVG Flower Accent ── */
function SectionFlower({ size = 24, className = "" }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 60 60" fill="none">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
        <g key={i} transform={`rotate(${a},30,30)`}>
          <ellipse cx="30" cy="10" rx="5" ry="12" fill={i % 2 === 0 ? "#FF6B35" : "#FFD54F"} opacity="0.9" />
        </g>
      ))}
      <circle cx="30" cy="30" r="9" fill="#FF8F00" />
      <circle cx="30" cy="30" r="5.5" fill="#FFD54F" />
      <circle cx="30" cy="30" r="2.5" fill="white" opacity="0.8" />
    </svg>
  );
}

export default function HeroSection({ fabricImageUrl }) {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActiveSlide((prev) => (prev + 1) % 3), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative w-full h-[100dvh] min-h-[640px] max-h-[1080px] overflow-hidden select-none flex flex-col justify-between"
      style={{ background: "linear-gradient(135deg,#081A11 0%,#133323 50%,#081A11 100%)" }}
    >
      {/* ── TOP KASAVU GOLD BORDER TRIM ── */}
      <div className="absolute top-0 inset-x-0 h-[4px] z-30" style={{ background: "linear-gradient(90deg,#B8860B 0%,#D4AF37 25%,#FFF5C0 50%,#D4AF37 75%,#B8860B 100%)" }} />

      {/* ── TRADITIONAL KOLLAM MANDALA ACCENTS ── */}
      <KollamRing className="absolute -top-10 -left-10 z-[2] w-44 h-44 sm:w-60 sm:h-60" />
      <KollamRing className="absolute -top-10 -right-10 z-[2] w-44 h-44 sm:w-60 sm:h-60" />

      {/* ── DESKTOP BACKGROUND WITH ROYAL OVERLAY ── */}
      <div className="hidden md:block absolute inset-0 z-0">
        <img
          src={fabricImageUrl || heroDesktopImg}
          alt="Kerala Kasavu Handloom"
          className="w-full h-full object-cover object-center transition-transform duration-1000 scale-105"
        />
        {/* Multi-stage luxury gradient dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#081A11]/95 via-[#081A11]/78 to-transparent w-full lg:w-2/3" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#081A11] via-[#081A11]/60 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-[#081A11]/80 to-transparent" />
      </div>

      {/* ── MOBILE BACKGROUND WITH OPTIMIZED GRADIENT ── */}
      <div className="md:hidden absolute inset-0 z-0">
        <img
          src={fabricImageUrl || heroMobileImg}
          alt="Kerala Kasavu Mobile"
          className="w-full h-full object-cover object-bottom"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#081A11]/95 via-[#081A11]/60 to-[#081A11]/98" />
      </div>

      {/* ── TOP HEADER / ONAM BADGE ── */}
      <div className="relative z-10 w-full pt-8 sm:pt-10 px-4 sm:px-8 md:px-12 lg:px-20 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Onam Festival Announcement Badge with Flowers */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#D4AF37]/80 shadow-2xl backdrop-blur-md"
            style={{ background: "rgba(19,51,35,0.85)", boxShadow: "0 4px 20px rgba(212,175,55,0.25)" }}
          >
            <SectionFlower size={16} />
            <span className="text-[#F3E5AB] text-[10px] sm:text-xs font-bold tracking-[0.28em] uppercase">
              ONAM ROYAL COLLECTION &bull; 2025
            </span>
            <SectionFlower size={16} />
          </motion.div>

        </div>
      </div>

      {/* ── MAIN HERO CONTENT AREA ── */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-20 flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left py-6">
        <div className="max-w-md sm:max-w-2xl lg:max-w-4xl xl:max-w-5xl w-full">

          {/* Sub-heading Badge with Flowers */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-3 flex items-center gap-2 justify-center md:justify-start"
          >
            <SectionFlower size={18} />
            <span className="text-[#FFD54F] font-serif text-xs sm:text-sm tracking-[0.35em] uppercase font-bold drop-shadow">
              PROSPEROUS THIRUVONAM COLLECTION
            </span>
            <SectionFlower size={18} />
          </motion.div>

          {/* MAIN HEADING WITH INCREASED 2-LINE TEXT SIZE */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, ease: "easeOut" }}
            className="uppercase leading-[0.92] font-black tracking-wide text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[9.5rem]"
            style={{
              fontFamily: "'Cinzel Decorative', 'Playfair Display', serif",
              background: "linear-gradient(180deg, #FFFDF5 0%, #F3E5AB 40%, #D4AF37 75%, #B8860B 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 6px 24px rgba(212,175,55,0.4))",
            }}
          >
            <span className="block whitespace-nowrap">THE ART</span>
            <span className="block whitespace-nowrap">OF DRAPING</span>
          </motion.h1>

          {/* Gold Decorative Accent Line with Flower */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.35 }}
            className="flex items-center gap-2 mt-4 mb-4 justify-center md:justify-start"
            style={{ transformOrigin: "left" }}
          >
            <div className="h-[2px] w-20 sm:w-32" style={{ background: "linear-gradient(90deg,#D4AF37,#FFD54F,transparent)" }} />
            <SectionFlower size={20} />
            <div className="h-[2px] w-20 sm:w-32" style={{ background: "linear-gradient(270deg,#D4AF37,#FFD54F,transparent)" }} />
          </motion.div>

          {/* SUBTITLE */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.25, ease: "easeOut" }}
            className="text-[#EADFC9] text-xs sm:text-base md:text-lg leading-relaxed font-light max-w-xs sm:max-w-md mx-auto md:mx-0 text-center md:text-left"
          >
            Woven with pure golden zari in Balaramapuram.{" "}
            <span className="text-[#FFD54F] font-medium">Celebrate Thiruvonam</span> in authentic Kerala handloom grandeur.
          </motion.p>

          {/* CALL TO ACTION BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.4, ease: "easeOut" }}
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3.5 justify-center md:justify-start"
          >
            {/* Primary CTA */}
            <button
              onClick={() => navigate("/products")}
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-4 font-bold text-xs sm:text-sm tracking-[0.24em] uppercase rounded-lg transition-all duration-300 cursor-pointer shadow-xl"
              style={{
                background: "linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)",
                color: "#081A11",
                boxShadow: "0 6px 30px rgba(212,175,55,0.45), inset 0 1px 0 rgba(255,255,255,0.35)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #FFD54F 0%, #D4AF37 100%)";
                e.currentTarget.style.boxShadow = "0 8px 40px rgba(212,175,55,0.65), inset 0 1px 0 rgba(255,255,255,0.5)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg, #D4AF37 0%, #B8860B 100%)";
                e.currentTarget.style.boxShadow = "0 6px 30px rgba(212,175,55,0.45), inset 0 1px 0 rgba(255,255,255,0.35)";
              }}
            >
              <span>EXPLORE ONAM VAULT</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </button>

            {/* Secondary CTA */}
            <button
              onClick={() => navigate("/products?category=KASAVU SAREES")}
              className="inline-flex items-center justify-center gap-2 px-6 py-4 sm:px-8 sm:py-4 font-bold text-xs sm:text-sm tracking-[0.2em] uppercase rounded-lg border-2 border-[#D4AF37]/60 text-[#F3E5AB] hover:border-[#D4AF37] hover:text-[#FFD54F] transition-all duration-300 cursor-pointer backdrop-blur-md"
              style={{ background: "rgba(8,26,17,0.65)" }}
            >
              VIEW KASAVU &rarr;
            </button>
          </motion.div>

          {/* TRUST BADGES */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mt-7 flex items-center gap-5 justify-center md:justify-start flex-wrap"
          >
            {[
              { icon: <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />, label: "Pure Kasavu Zari" },
              { icon: <Award className="w-3.5 h-3.5 text-[#D4AF37]" />, label: "Handloom Certified" },
              { icon: <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />, label: "Kerala Heritage Weave" },
            ].map((badge, idx) => (
              <div key={idx} className="flex items-center gap-2 text-[#EADFC9]/85">
                {badge.icon}
                <span className="text-[10px] sm:text-xs tracking-widest uppercase font-medium">{badge.label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* ── BOTTOM CAROUSEL DOTS & GOLD KASAVU TRIM ── */}
      <div className="relative z-10 w-full flex flex-col items-center pb-3">
        {/* Subtle Kasavu Gold Divider */}
        <div
          className="w-full h-[2px] mb-2"
          style={{ background: "linear-gradient(90deg,transparent,#D4AF37 20%,#FFD54F 50%,#D4AF37 80%,transparent)" }}
        />
        
        {/* Slider Dots */}
        <div className="flex items-center justify-center gap-3">
          {[0, 1, 2].map((idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              aria-label={`Slide ${idx + 1}`}
              style={{
                width: activeSlide === idx ? "28px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: activeSlide === idx ? "linear-gradient(90deg, #D4AF37, #FFD54F)" : "rgba(255,255,255,0.25)",
                boxShadow: activeSlide === idx ? "0 0 12px rgba(212,175,55,0.8)" : "none",
                transition: "all 0.35s ease",
                border: "none",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── BOTTOM GOLD KASAVU BORDER ── */}
      <div className="absolute bottom-0 inset-x-0 h-[4px] z-30" style={{ background: "linear-gradient(90deg,#B8860B 0%,#D4AF37 25%,#FFF5C0 50%,#D4AF37 75%,#B8860B 100%)" }} />
    </section>
  );
}

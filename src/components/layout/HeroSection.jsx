import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import heroDesktopImg from "../../assets/hero_desktop.png";
import heroMobileImg from "../../assets/hero_mobile.png";

function FloatingPetal({ style, delay = 0, color = "#F9A825" }) {
  return (
    <motion.div
      style={style}
      className="absolute pointer-events-none"
      initial={{ opacity: 0, y: -20, rotate: 0 }}
      animate={{ opacity: [0, 0.9, 0.9, 0], y: [0, 90, 180, 260], rotate: [0, 60, 120, 200], x: [0, 12, -8, 4] }}
      transition={{ duration: 7, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
        <ellipse cx="8" cy="10" rx="5" ry="9" fill={color} opacity="0.85" />
        <ellipse cx="8" cy="10" rx="2" ry="4.5" fill="rgba(255,255,255,0.3)" />
      </svg>
    </motion.div>
  );
}

function OnamFlower({ size = 80, className = "" }) {
  const outerCount = 12;
  const innerCount = 8;
  const colors = ["#FF6B35","#F9A825","#FFD54F","#FF8F00","#E65100","#FFB300","#FF7043","#FFA000","#FF6B35","#F9A825","#FFD54F","#FF8F00"];
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 100 100" fill="none">
      {Array.from({ length: outerCount }).map((_, i) => (
        <g key={i} transform={`rotate(${(i / outerCount) * 360}, 50, 50)`}>
          <ellipse cx="50" cy="19" rx="7" ry="17" fill={colors[i]} opacity="0.92" />
        </g>
      ))}
      {Array.from({ length: innerCount }).map((_, i) => (
        <g key={"in" + i} transform={`rotate(${(i / innerCount) * 360 + 22.5}, 50, 50)`}>
          <ellipse cx="50" cy="30" rx="4" ry="11" fill="#FFF176" opacity="0.95" />
        </g>
      ))}
      <circle cx="50" cy="50" r="11" fill="#FF8F00" />
      <circle cx="50" cy="50" r="7" fill="#FFD54F" />
      <circle cx="50" cy="50" r="3.5" fill="white" opacity="0.8" />
    </svg>
  );
}

function MiniFlower({ size = 24, c1 = "#FF6B35", c2 = "#FFD54F" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {[0, 60, 120, 180, 240, 300].map((a, i) => (
        <g key={i} transform={`rotate(${a}, 20, 20)`}>
          <ellipse cx="20" cy="7" rx="4" ry="10" fill={i % 2 === 0 ? c1 : c2} opacity="0.9" />
        </g>
      ))}
      <circle cx="20" cy="20" r="6" fill="#FFA000" />
      <circle cx="20" cy="20" r="3.5" fill="#FFD54F" />
    </svg>
  );
}

function KollamRing({ className = "" }) {
  return (
    <svg className={className} width="150" height="150" viewBox="0 0 150 150" fill="none" opacity="0.18">
      <circle cx="75" cy="75" r="70" stroke="#D4AF37" strokeWidth="1" strokeDasharray="5 4" />
      <circle cx="75" cy="75" r="52" stroke="#D4AF37" strokeWidth="1" strokeDasharray="3 6" />
      <circle cx="75" cy="75" r="33" stroke="#D4AF37" strokeWidth="1" />
      {[0,45,90,135,180,225,270,315].map((a) => (
        <line key={a} x1="75" y1="75"
          x2={75 + 70 * Math.cos(a * Math.PI / 180)}
          y2={75 + 70 * Math.sin(a * Math.PI / 180)}
          stroke="#D4AF37" strokeWidth="0.8" />
      ))}
    </svg>
  );
}

export default function HeroSection({ fabricImageUrl }) {
  const navigate = useNavigate();
  const [dot, setDot] = useState(0);

  const PETALS = [
    { top: "4%", left: "7%", color: "#FF6B35" },
    { top: "9%", left: "22%", color: "#FFD54F" },
    { top: "2%", left: "42%", color: "#FF8F00" },
    { top: "6%", left: "63%", color: "#FF6B35" },
    { top: "1%", left: "78%", color: "#FFA000" },
    { top: "13%", left: "91%", color: "#FFD54F" },
    { top: "7%", left: "53%", color: "#E65100" },
    { top: "3%", left: "33%", color: "#FF7043" },
    { top: "11%", left: "85%", color: "#FFB300" },
  ];

  const GARLAND_COLORS = [
    ["#FF6B35","#FFD54F"],["#FFD54F","#FF8F00"],["#FF8F00","#FF6B35"],
    ["#E65100","#FFA000"],["#FFA000","#FFD54F"],
  ];

  useEffect(() => {
    const t = setInterval(() => setDot((d) => (d + 1) % 3), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <section
      className="relative w-full h-[100dvh] min-h-[620px] max-h-[1080px] overflow-hidden select-none flex flex-col justify-between"
      style={{ background: "linear-gradient(135deg,#0C2317 0%,#1A3C2B 45%,#0C2317 100%)" }}
    >
      {/* FLOATING PETALS */}
      {PETALS.map((p, i) => (
        <FloatingPetal key={i} style={{ top: p.top, left: p.left, zIndex: 5 }} delay={i * 0.65} color={p.color} />
      ))}

      {/* KOLAM CORNER RINGS */}
      <KollamRing className="absolute -top-8 -left-8 z-[2] w-36 h-36 sm:w-48 sm:h-48" />
      <KollamRing className="absolute -top-8 -right-8 z-[2] w-36 h-36 sm:w-48 sm:h-48" />

      {/* DESKTOP BG */}
      <div className="hidden md:block absolute inset-0 z-0">
        <img src={fabricImageUrl || heroDesktopImg} alt="Kerala Kasavu" className="w-full h-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0C2317] via-[#0C2317]/82 to-transparent w-full lg:w-3/5" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0C2317] to-transparent" />
      </div>

      {/* MOBILE BG */}
      <div className="md:hidden absolute inset-0 z-0">
        <img src={fabricImageUrl || heroMobileImg} alt="Kerala Kasavu Mobile" className="w-full h-full object-cover object-bottom" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0C2317]/92 via-[#0C2317]/55 to-[#0C2317]/96" />
      </div>

      {/* FLOWER DECORS RIGHT SIDE */}
      <OnamFlower className="absolute bottom-20 right-6 md:right-14 z-[6] opacity-85" size={58} />
      <OnamFlower className="absolute bottom-14 right-20 md:right-32 z-[6] opacity-60" size={40} />
      <OnamFlower className="absolute top-20 right-8 md:right-20 z-[6] opacity-50 hidden md:block" size={46} />

      {/* TOP HEADER + GARLAND */}
      <div className="relative z-10 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-20 pt-6 sm:pt-9 flex flex-col md:flex-row items-center justify-between gap-2">
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#D4AF37]/70 shadow-lg backdrop-blur-md"
            style={{ background: "rgba(26,60,43,0.88)" }}
          >
            <motion.span animate={{ rotate: [0, 20, -20, 0] }} transition={{ duration: 2.2, repeat: Infinity }}>
              <MiniFlower size={20} />
            </motion.span>
            <span className="text-[#F3E5AB] text-[10px] sm:text-xs font-bold tracking-[0.28em] uppercase">
              ONAM ROYAL COLLECTION &bull; തിരുവോണം 2025
            </span>
            <motion.span animate={{ rotate: [0, -20, 20, 0] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.6 }}>
              <MiniFlower size={20} c1="#FFD54F" c2="#FF6B35" />
            </motion.span>
          </motion.div>
          <span className="hidden md:inline-block text-[#D4AF37] text-xs font-serif tracking-[0.2em] uppercase opacity-90 border border-[#D4AF37]/30 px-3 py-1 rounded-full">
            KERALA HANDLOOM HERITAGE
          </span>
        </div>

        {/* Animated flower garland line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.3, delay: 0.35 }}
          className="flex items-center justify-center gap-0.5 mt-2 px-2 overflow-hidden"
          style={{ transformOrigin: "center" }}
        >
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.span
              key={i}
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 1.6, delay: i * 0.07, repeat: Infinity, ease: "easeInOut" }}
              style={{ display: "inline-block" }}
            >
              <MiniFlower
                size={12 + (i % 4) * 3}
                c1={GARLAND_COLORS[i % 5][0]}
                c2={GARLAND_COLORS[i % 5][1]}
              />
            </motion.span>
          ))}
        </motion.div>
      </div>

      {/* MAIN HERO CONTENT */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-20 flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left py-4">
        <div className="max-w-sm sm:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-auto md:mx-0 w-full">

          {/* Sub-badge with flowers */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="mb-4 flex items-center gap-2 justify-center md:justify-start flex-wrap"
          >
            <div className="flex gap-0.5">
              {[0,1,2,3].map((i) => (
                <motion.span key={i} animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1.5, delay: i * 0.18, repeat: Infinity }}>
                  <MiniFlower size={16} c1="#FF6B35" c2="#FFD54F" />
                </motion.span>
              ))}
            </div>
            <span className="text-[#D4AF37] font-serif text-xs sm:text-sm tracking-[0.32em] uppercase font-bold">
              ഓണം റോയൽ കളക്ഷൻ
            </span>
            <div className="flex gap-0.5">
              {[0,1,2,3].map((i) => (
                <motion.span key={i} animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 1.5, delay: i * 0.18 + 0.5, repeat: Infinity }}>
                  <MiniFlower size={16} c1="#FFD54F" c2="#FF6B35" />
                </motion.span>
              ))}
            </div>
          </motion.div>

          {/* MAIN HEADING */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.95, ease: "easeOut" }}
            className="uppercase leading-[1.0] font-extrabold tracking-wide text-4xl sm:text-6xl md:text-7xl lg:text-8xl"
            style={{
              fontFamily: "'Cinzel Decorative','Playfair Display',serif",
              background: "linear-gradient(180deg,#FFF8E7 0%,#F3E5AB 40%,#D4AF37 72%,#C5A059 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              filter: "drop-shadow(0 2px 18px rgba(212,175,55,0.38))",
            }}
          >
            <span className="block whitespace-nowrap">THE ART</span>
            <span className="block whitespace-nowrap">OF DRAPING</span>
          </motion.h1>

          {/* Flower separator */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.9, delay: 0.4 }}
            className="flex items-center gap-1.5 mt-3 mb-3 justify-center md:justify-start"
          >
            <div className="h-px w-10 sm:w-16" style={{ background: "linear-gradient(to right,transparent,#D4AF37)" }} />
            <OnamFlower size={22} />
            <OnamFlower size={30} />
            <OnamFlower size={22} />
            <div className="h-px w-10 sm:w-16" style={{ background: "linear-gradient(to left,transparent,#D4AF37)" }} />
          </motion.div>

          {/* SUBTITLE */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.22, ease: "easeOut" }}
            className="text-[#EADFC9] text-xs sm:text-base md:text-lg leading-relaxed font-light max-w-xs sm:max-w-md mx-auto md:mx-0 text-center md:text-left"
          >
            Woven with pure golden zari in Balaramapuram.{" "}
            <span className="text-[#FFD54F] font-medium">Celebrate Thiruvonam</span> in authentic Kerala handloom grandeur.
          </motion.p>

          {/* CTA BUTTONS */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.38, ease: "easeOut" }}
            className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 justify-center md:justify-start"
          >
            <button
              onClick={() => navigate("/products")}
              className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 sm:px-10 sm:py-4 font-bold text-xs sm:text-sm tracking-[0.22em] uppercase rounded-md transition-all duration-300 cursor-pointer"
              style={{
                background: "linear-gradient(135deg,#D4AF37,#B8860B)",
                color: "#0C2317",
                boxShadow: "0 4px 26px rgba(212,175,55,0.42),inset 0 1px 0 rgba(255,255,255,0.28)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg,#FFD54F,#D4AF37)";
                e.currentTarget.style.boxShadow = "0 8px 42px rgba(212,175,55,0.68),inset 0 1px 0 rgba(255,255,255,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "linear-gradient(135deg,#D4AF37,#B8860B)";
                e.currentTarget.style.boxShadow = "0 4px 26px rgba(212,175,55,0.42),inset 0 1px 0 rgba(255,255,255,0.28)";
              }}
            >
              <MiniFlower size={18} c1="#0C2317" c2="#1A3C2B" />
              <span>EXPLORE ONAM VAULT</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-2 transition-all duration-300" />
            </button>
            <button
              onClick={() => navigate("/products?category=KASAVU SAREES")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 sm:px-8 sm:py-4 font-bold text-xs sm:text-sm tracking-widest uppercase rounded-md border-2 border-[#D4AF37]/60 text-[#F3E5AB] hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all duration-300 cursor-pointer backdrop-blur-sm"
              style={{ background: "rgba(12,35,23,0.6)" }}
            >
              VIEW KASAVU &rarr;
            </button>
          </motion.div>

          {/* Mini trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.72, duration: 0.8 }}
            className="mt-5 flex items-center gap-4 justify-center md:justify-start flex-wrap"
          >
            {["Pure Kasavu", "Handloom Certified", "Kerala Heritage"].map((label, i) => (
              <div key={i} className="flex items-center gap-1.5 text-[#EADFC9]/80">
                <div className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span className="text-[9px] sm:text-[10px] tracking-widest uppercase">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </main>

      {/* BOTTOM POOKKALAM GARLAND */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.8 }}
          className="flex items-end justify-center gap-0.5 w-full px-1 overflow-hidden"
        >
          {Array.from({ length: 38 }).map((_, i) => {
            const sz = [10, 14, 18, 22, 18, 14][i % 6];
            const [c1, c2] = GARLAND_COLORS[i % 5];
            return (
              <motion.span key={i}
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 1.9, delay: i * 0.055, repeat: Infinity, ease: "easeInOut" }}
                style={{ display: "inline-block" }}
              >
                <MiniFlower size={sz} c1={c1} c2={c2} />
              </motion.span>
            );
          })}
        </motion.div>
        <div className="w-full h-[3px] mt-1" style={{ background: "linear-gradient(90deg,transparent,#D4AF37 18%,#FFD54F 50%,#D4AF37 82%,transparent)" }} />
        <div className="flex items-center justify-center gap-2.5 py-3">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => setDot(i)}
              style={{
                width: dot === i ? "24px" : "8px",
                height: "8px",
                borderRadius: "4px",
                background: dot === i ? "linear-gradient(90deg,#D4AF37,#FFD54F)" : "rgba(255,255,255,0.3)",
                boxShadow: dot === i ? "0 0 10px #D4AF37" : "none",
                transition: "all 0.3s",
                border: "none",
                cursor: "pointer",
              }}
            />
          ))}
        </div>
      </div>

      {/* BOTTOM KASAVU BORDER */}
      <div className="absolute bottom-0 left-0 right-0 h-[3px]" style={{ background: "linear-gradient(90deg,#B8860B,#D4AF37,#FFD54F,#D4AF37,#B8860B)" }} />
    </section>
  );
}

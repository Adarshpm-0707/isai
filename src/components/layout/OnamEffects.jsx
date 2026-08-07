import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

/* ── Shared Onam SVG helpers (used across all pages) ── */
export function MiniFlower({ size = 24, c1 = "#FF6B35", c2 = "#FFD54F" }) {
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

export function SectionFlower({ size = 30, className = "" }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 60 60" fill="none">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
        <g key={i} transform={`rotate(${a},30,30)`}>
          <ellipse cx="30" cy="10" rx="5" ry="12" fill={i % 2 === 0 ? "#FF6B35" : "#FFD54F"} opacity="0.88" />
        </g>
      ))}
      <circle cx="30" cy="30" r="9" fill="#FF8F00" />
      <circle cx="30" cy="30" r="5.5" fill="#FFD54F" />
      <circle cx="30" cy="30" r="2.5" fill="white" opacity="0.75" />
    </svg>
  );
}

export function OnamFlower({ size = 80, className = "" }) {
  const colors = ["#FF6B35","#F9A825","#FFD54F","#FF8F00","#E65100","#FFB300","#FF7043","#FFA000","#FF6B35","#F9A825","#FFD54F","#FF8F00"];
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 100 100" fill="none">
      {Array.from({ length: 12 }).map((_, i) => (
        <g key={i} transform={`rotate(${(i / 12) * 360}, 50, 50)`}>
          <ellipse cx="50" cy="19" rx="7" ry="17" fill={colors[i]} opacity="0.92" />
        </g>
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <g key={"in" + i} transform={`rotate(${(i / 8) * 360 + 22.5}, 50, 50)`}>
          <ellipse cx="50" cy="30" rx="4" ry="11" fill="#FFF176" opacity="0.95" />
        </g>
      ))}
      <circle cx="50" cy="50" r="11" fill="#FF8F00" />
      <circle cx="50" cy="50" r="7" fill="#FFD54F" />
      <circle cx="50" cy="50" r="3.5" fill="white" opacity="0.8" />
    </svg>
  );
}

const GARLAND_COLORS = [
  ["#FF6B35","#FFD54F"],["#FFD54F","#FF8F00"],["#FF8F00","#FF6B35"],
  ["#E65100","#FFA000"],["#FFA000","#FFD54F"],
];

export function PookklamGarland({ count = 22 }) {
  return (
    <div className="flex items-center justify-center gap-0.5 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const [c1, c2] = GARLAND_COLORS[i % 5];
        const sz = [10, 14, 18, 14][i % 4];
        return (
          <motion.span key={i}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.8, delay: i * 0.07, repeat: Infinity, ease: "easeInOut" }}
            style={{ display: "inline-block" }}
          >
            <MiniFlower size={sz} c1={c1} c2={c2} />
          </motion.span>
        );
      })}
    </div>
  );
}

export function GoldLine() {
  return (
    <div className="h-px w-full" style={{ background: "linear-gradient(90deg,transparent,#D4AF37 25%,#FFD54F 50%,#D4AF37 75%,transparent)" }} />
  );
}

export function FlowerDivider({ count = 9 }) {
  return (
    <div className="flex items-center justify-center gap-1 my-2">
      <GoldLine />
      {Array.from({ length: count }).map((_, i) => (
        <SectionFlower key={i} size={i === Math.floor(count / 2) ? 28 : 18} />
      ))}
      <GoldLine />
    </div>
  );
}

export function OnamPageHeading({ malayalam, english }) {
  return (
    <div className="text-center space-y-2 mb-8">
      <div className="flex items-center justify-center gap-2">
        <SectionFlower size={20} />
        <span className="text-[#B8860B] text-[10px] sm:text-xs font-bold tracking-[0.35em] uppercase">{malayalam}</span>
        <SectionFlower size={20} />
      </div>
      <h2
        className="font-serif text-xl sm:text-3xl font-bold tracking-wide uppercase"
        style={{
          background: "linear-gradient(135deg,#FFF8E7,#D4AF37)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}
      >
        {english}
      </h2>
      <FlowerDivider />
    </div>
  );
}

/* Floating petal background overlay – mount once in Layout */
const PETAL_CONFIGS = [
  { top: "5%", left: "3%", color: "#FF6B35", delay: 0 },
  { top: "12%", left: "18%", color: "#FFD54F", delay: 1.2 },
  { top: "3%", left: "48%", color: "#FF8F00", delay: 2.4 },
  { top: "8%", left: "70%", color: "#FF6B35", delay: 0.6 },
  { top: "2%", left: "88%", color: "#FFA000", delay: 3.0 },
  { top: "18%", left: "95%", color: "#FFD54F", delay: 1.8 },
  { top: "6%", left: "58%", color: "#E65100", delay: 0.9 },
  { top: "1%", left: "35%", color: "#FF7043", delay: 2.1 },
  { top: "15%", left: "80%", color: "#FFB300", delay: 3.6 },
  { top: "4%", left: "12%", color: "#FF6B35", delay: 4.2 },
  { top: "10%", left: "28%", color: "#FFD54F", delay: 1.5 },
  { top: "7%", left: "74%", color: "#FF8F00", delay: 3.3 },
];

function FloatingPetal({ top, left, color, delay }) {
  return (
    <motion.div
      className="fixed pointer-events-none"
      style={{ top, left, zIndex: 1 }}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: [0, 0.7, 0.7, 0], y: [0, 100, 200, 300], rotate: [0, 60, 120, 200], x: [0, 10, -8, 4] }}
      transition={{ duration: 8, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
        <ellipse cx="7" cy="9" rx="4.5" ry="8" fill={color} opacity="0.8" />
        <ellipse cx="7" cy="9" rx="2" ry="4" fill="rgba(255,255,255,0.28)" />
      </svg>
    </motion.div>
  );
}

/* Global Onam overlay — add to Layout.jsx */
export function GlobalOnamOverlay() {
  return (
    <>
      {PETAL_CONFIGS.map((p, i) => (
        <FloatingPetal key={i} {...p} />
      ))}
    </>
  );
}

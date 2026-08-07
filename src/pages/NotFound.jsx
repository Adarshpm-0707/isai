import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { OnamPageHeading, SectionFlower, PookklamGarland, GoldLine, MiniFlower } from "../components/layout/OnamEffects";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center text-center px-4 space-y-6 relative"
      style={{ background: "linear-gradient(180deg,#0C2317 0%,#1A3C2B 50%,#0C2317 100%)" }}>
      <div className="absolute top-0 left-0 right-0"><PookklamGarland count={24} /><GoldLine /></div>

      <SectionFlower size={50} className="absolute top-16 left-6 opacity-20 hidden md:block" />
      <SectionFlower size={40} className="absolute top-20 right-8 opacity-15 hidden md:block" />

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-5 relative z-10">
        <div className="flex justify-center gap-2">
          {[...Array(5)].map((_, i) => (
            <motion.span key={i} animate={{ y: [0, -8, 0] }} transition={{ duration: 1.5, delay: i * 0.15, repeat: Infinity }}>
              <SectionFlower size={28} />
            </motion.span>
          ))}
        </div>

        <h1 className="text-8xl md:text-9xl font-extrabold opacity-20 tracking-wider"
          style={{ fontFamily: "'Cinzel Decorative',serif", background: "linear-gradient(135deg,#D4AF37,#FFD54F)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
          404
        </h1>

        <OnamPageHeading malayalam="നഷ്ടപ്പെട്ടു" english="LOST IN WEAVES" />

        <p className="text-sm text-[#EADFC9]/70 max-w-xs mx-auto">
          The heritage pattern or page you seek has either moved or doesn&apos;t exist.
        </p>

        <button onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 px-8 py-3 rounded-lg font-bold text-sm tracking-widest uppercase transition-all"
          style={{ background: "linear-gradient(135deg,#D4AF37,#B8860B)", color: "#0C2317", boxShadow: "0 4px 24px rgba(212,175,55,0.4)" }}
          onMouseEnter={e => { e.currentTarget.style.background = "linear-gradient(135deg,#FFD54F,#D4AF37)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "linear-gradient(135deg,#D4AF37,#B8860B)"; }}>
          <MiniFlower size={16} c1="#0C2317" c2="#1A3C2B" />
          Return Home
        </button>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0"><GoldLine /><PookklamGarland count={24} /></div>
    </div>
  );
}

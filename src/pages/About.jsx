import React from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, ShieldCheck, Globe, Zap, History, MoveDown } from "lucide-react";
import { SectionFlower, PookklamGarland, GoldLine, FlowerDivider, OnamPageHeading, MiniFlower } from "../components/layout/OnamEffects";

const VALUES = [
  { icon: ShieldCheck, title: "Silk Mark Certified", desc: "100% natural fiber purity with authentic gold zari testing." },
  { icon: Globe, title: "Zero Middlemen", desc: "Direct-to-weaver proceeds ensuring ethical wealth distribution." },
  { icon: Zap, title: "Lost Motifs", desc: "Reviving 18th-century patterns found in forgotten royal archives." },
  { icon: History, title: "Slow Production", desc: "A refusal to rush. Each piece represents 40-90 days of human life." },
];

const TIMELINE = [
  { year: "2026", event: "The Startup Initiation", desc: "Founded in 2026 with master weavers in the heart of Varanasi." },
  { year: "2026", event: "Direct Cluster Network", desc: "Connecting Kanchipuram and Bengal artisans directly to conscious patrons." },
  { year: "2026", event: "Global Heritage Movement", desc: "Supporting 500+ families through direct, transparent sustainable luxury." },
];

export default function About() {
  const { scrollYProgress } = useScroll();
  const titleMove = useTransform(scrollYProgress, [0, 0.5], [0, -150]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="overflow-hidden" style={{ background: "linear-gradient(180deg,#0C2317 0%,#1A3C2B 35%,#0C2317 100%)" }}>

      {/* ── 1. EDITORIAL HERO ── */}
      <section className="relative pt-16 sm:pt-28 pb-12 px-4 sm:px-6 lg:px-20 max-w-7xl mx-auto overflow-hidden">
        {/* Top garland */}
        <div className="mb-8"><GoldLine /><PookklamGarland count={24} /><GoldLine /></div>

        <div className="grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 lg:col-span-8">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: [0.16,1,0.3,1] }}>
              <div className="flex items-center gap-2 mb-3">
                <SectionFlower size={24} />
                <span className="text-[#B8860B] text-[10px] font-bold tracking-[0.35em] uppercase">ഞങ്ങളുടെ കഥ</span>
                <SectionFlower size={24} />
              </div>
              <h1
                className="text-6xl sm:text-7xl md:text-8xl lg:text-[9rem] leading-[0.9] tracking-tighter mb-4 sm:mb-6 font-extrabold"
                style={{
                  fontFamily: "'Cinzel Decorative','Playfair Display',serif",
                  background: "linear-gradient(180deg,#FFF8E7 0%,#F3E5AB 45%,#D4AF37 100%)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
                }}
              >
                Pure <br /><span className="italic font-light ml-0 md:ml-20">Lineage.</span>
              </h1>
            </motion.div>
          </div>

          <motion.div style={{ opacity: opacityFade }} className="col-span-12 lg:col-span-4 pb-2 sm:pb-4">
            <p className="text-sm sm:text-lg font-light leading-relaxed mb-4 text-[#EADFC9]/80 border-l-2 pl-4 sm:pl-6" style={{ borderColor: "#D4AF37" }}>
              Founded in 2026, Isai Tarang operates as a new-age living archive — preserving the rhythmic dance of the shuttle and the soul of the weaver.
            </p>
            <div className="flex items-center gap-2 text-[10px] tracking-[0.3em] font-bold uppercase text-[#D4AF37]">
              <SectionFlower size={16} /> Our Evolution <MoveDown size={14} className="animate-bounce" />
            </div>
          </motion.div>
        </div>
        <motion.div style={{ y: titleMove }} className="absolute -right-20 top-20 text-[12rem] sm:text-[18rem] font-extrabold opacity-[0.03] pointer-events-none select-none hidden sm:block"
          style2={{ fontFamily: "'Cinzel Decorative',serif", color: "#D4AF37" }}>
          2026
        </motion.div>
      </section>

      <FlowerDivider count={13} />

      {/* ── 2. PHILOSOPHY ── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-20" style={{ background: "rgba(212,175,55,0.04)" }}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            className="relative min-h-[240px] sm:aspect-[3/4] rounded-2xl flex items-center justify-center p-6 sm:p-12 overflow-hidden shadow-2xl"
            style={{ background: "rgba(212,175,55,0.07)", border: "1.5px solid rgba(212,175,55,0.3)" }}>
            {/* Corner flowers */}
            <SectionFlower size={36} className="absolute top-3 left-3 opacity-40" />
            <SectionFlower size={36} className="absolute top-3 right-3 opacity-40" />
            <SectionFlower size={36} className="absolute bottom-3 left-3 opacity-40" />
            <SectionFlower size={36} className="absolute bottom-3 right-3 opacity-40" />
            <div className="absolute inset-0 opacity-8 flex items-center justify-center rotate-12">
              <span className="text-6xl sm:text-8xl font-serif italic text-[#D4AF37]/20">Silk</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-4xl italic leading-tight text-center relative z-10 text-[#F3E5AB]">
              "We don&apos;t weave sarees; we weave <span className="font-bold not-italic text-[#D4AF37]">time</span> into a wearable form."
            </h2>
          </motion.div>

          <div className="space-y-8 sm:space-y-12">
            {[
              { num: "01", section: "Process", title: "The Art of Slowness", desc: "In an era of instant gratification, our looms remain defiantly slow. A single masterpiece can take up to 90 days, involving master dyers, pattern makers, and weavers." },
              { num: "02", section: "Ethics", title: "Artisan Bankroll", desc: "Our Zero-Middleman policy ensures that 70% of the saree value reaches the artisan's household directly. We maintain the dignity of the craft by valuing the craftsman." },
            ].map((item, i) => (
              <div key={i} className="space-y-3">
                <div className="flex items-center gap-2">
                  <SectionFlower size={18} />
                  <span className="text-[#D4AF37]/70 font-bold text-[10px] tracking-widest uppercase">{item.num} / {item.section}</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-serif text-[#F3E5AB]">{item.title}</h3>
                <p className="text-xs sm:text-base text-[#EADFC9]/75 leading-relaxed font-light">{item.desc}</p>
                {i === 0 && <div className="h-px w-full" style={{ background: "rgba(212,175,55,0.15)" }} />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <FlowerDivider count={13} />

      {/* ── 3. TIMELINE ── */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-20">
        <OnamPageHeading malayalam="ഞങ്ങളുടെ ചരിത്രം" english="OUR CHRONICLE" />
        <div className="max-w-5xl mx-auto relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ background: "rgba(212,175,55,0.25)" }} />
          <div className="space-y-16 sm:space-y-24">
            {TIMELINE.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                className={`relative flex flex-col ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-start md:items-center gap-6 md:gap-20 pl-12 md:pl-0`}>
                <div className="absolute left-4 md:left-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full -translate-x-1/2 flex items-center justify-center z-10 shadow-lg top-1 md:top-auto"
                  style={{ background: "linear-gradient(135deg,#1A3C2B,#0C2317)", border: "2px solid #D4AF37" }}>
                  <SectionFlower size={20} />
                </div>
                <div className="w-full md:w-1/2 text-left md:text-right">
                  <div className={i % 2 === 0 ? "" : "md:text-left"}>
                    <h4 className="text-4xl sm:text-5xl font-serif font-bold mb-1"
                      style={{ background: "linear-gradient(135deg,#FFF8E7,#D4AF37)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                      {item.year}
                    </h4>
                    <p className="text-xs tracking-[0.35em] uppercase text-[#D4AF37]/80 font-bold mb-2">{item.event}</p>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <div className="p-5 sm:p-7 rounded-2xl hover:border-[rgba(212,175,55,0.5)] transition-all shadow-xl"
                    style={{ border: "1px solid rgba(212,175,55,0.2)", background: "rgba(212,175,55,0.06)" }}>
                    <p className="text-xs sm:text-sm text-[#EADFC9]/85 font-light leading-relaxed italic">{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <FlowerDivider count={13} />

      {/* ── 4. VALUES MATRIX ── */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <OnamPageHeading malayalam="ഞങ്ങളുടെ മൂല്യങ്ങൾ" english="CORE ARCHITECTURE" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div key={i} whileHover={{ y: -6, scale: 1.02 }}
                  className="rounded-2xl p-6 sm:p-7 group transition-all duration-500 shadow-xl relative overflow-hidden"
                  style={{ background: "rgba(212,175,55,0.06)", border: "1px solid rgba(212,175,55,0.2)" }}>
                  <SectionFlower size={40} className="absolute top-2 right-2 opacity-15 group-hover:opacity-30 transition-opacity" />
                  <div className="text-[10px] font-bold text-[#D4AF37]/40 mb-4 relative z-10">0{i + 1}</div>
                  <Icon className="w-6 h-6 text-[#D4AF37] mb-4 group-hover:scale-110 transition-all relative z-10" />
                  <h4 className="text-base font-bold uppercase tracking-tight mb-2 text-[#F3E5AB] relative z-10">{v.title}</h4>
                  <p className="text-xs text-[#EADFC9]/75 font-light leading-relaxed relative z-10">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 5. CTA ── */}
      <section className="relative py-16 sm:py-24 overflow-hidden"
        style={{ background: "linear-gradient(135deg,#1A3C2B,#0C2317)", borderTop: "2px solid rgba(212,175,55,0.4)" }}>
        <div className="absolute top-0 left-0 right-0"><PookklamGarland count={28} /><GoldLine /></div>

        {/* Big flowers */}
        <SectionFlower size={80} className="absolute top-8 left-8 opacity-15 hidden md:block" />
        <SectionFlower size={60} className="absolute bottom-8 right-8 opacity-15 hidden md:block" />
        <SectionFlower size={50} className="absolute top-12 right-20 opacity-10 hidden md:block" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 pt-6">
          <div className="text-center md:text-left">
            <div className="flex items-center gap-2 mb-3 justify-center md:justify-start">
              <SectionFlower size={22} />
              <span className="text-[#D4AF37] text-[10px] font-bold tracking-[0.35em] uppercase">ഓണം ഷോപ്പ്</span>
              <SectionFlower size={22} />
            </div>
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-none tracking-tight mb-4"
              style={{ fontFamily: "'Cinzel Decorative','Playfair Display',serif", background: "linear-gradient(180deg,#FFF8E7,#D4AF37)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
              Own a <br className="hidden sm:inline" />
              <span className="italic font-light">Legacy.</span>
            </h2>
            <p className="text-[#EADFC9]/75 text-sm sm:text-lg font-medium max-w-md mx-auto md:mx-0">
              Every drape is a vote for the preservation of human craftsmanship.
            </p>
          </div>

          <Link to="/products"
            className="group relative h-40 w-40 sm:h-56 sm:w-56 rounded-full flex items-center justify-center transition-all duration-700 overflow-hidden shrink-0"
            style={{ border: "2px solid rgba(212,175,55,0.5)", background: "rgba(12,35,23,0.6)" }}>
            <div className="flex flex-col items-center group-hover:text-[#0C2317] transition-colors z-10 text-[#D4AF37]">
              <ArrowUpRight className="w-8 h-8 sm:w-10 sm:h-10 mb-2 group-hover:rotate-45 transition-transform duration-500" />
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em]">View Archive</span>
            </div>
            <div className="absolute inset-0 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out rounded-full"
              style={{ background: "linear-gradient(135deg,#D4AF37,#B8860B)" }} />
          </Link>
        </div>
        <div className="absolute bottom-0 left-0 right-0"><GoldLine /><PookklamGarland count={28} /></div>
      </section>
    </div>
  );
}

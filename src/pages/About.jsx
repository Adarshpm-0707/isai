import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, Globe, Zap, History, MoveDown } from 'lucide-react';

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Silk Mark Certified',
    desc: "100% natural fiber purity with authentic gold zari testing.",
  },
  {
    icon: Globe,
    title: 'Zero Middlemen',
    desc: "Direct-to-weaver proceeds ensuring ethical wealth distribution.",
  },
  {
    icon: Zap,
    title: 'Lost Motifs',
    desc: "Reviving 18th-century patterns found in forgotten royal archives.",
  },
  {
    icon: History,
    title: 'Slow Production',
    desc: "A refusal to rush. Each piece represents 40-90 days of human life.",
  },
];

const TIMELINE = [
  { year: '2026', event: 'The Startup Initiation', desc: 'Founded in 2026 with master weavers in the heart of Varanasi.' },
  { year: '2026', event: 'Direct Cluster Network', desc: 'Connecting Kanchipuram and Bengal artisans directly to conscious patrons.' },
  { year: '2026', event: 'Global Heritage Movement', desc: 'Supporting 500+ families through direct, transparent sustainable luxury.' },
];

export default function About() {
  const { scrollYProgress } = useScroll();
  const titleMove = useTransform(scrollYProgress, [0, 0.5], [0, -150]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="bg-transparent text-[#FFE8A3] selection:bg-[#FFE8A3] selection:text-[#800202] overflow-hidden">
      
      {/* ─── 1. EDITORIAL HERO ─── */}
      <section className="relative pt-24 sm:pt-32 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-20 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-12 gap-6 items-end">
          <div className="col-span-12 lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <h1 className="font-playfair text-7xl sm:text-7xl md:text-8xl lg:text-[9.5rem] leading-[0.9] tracking-tighter mb-4 sm:mb-6">
                Pure <br />
                <span className="italic font-light ml-0 md:ml-28">Lineage.</span>
              </h1>
            </motion.div>
          </div>
          
          <motion.div 
            style={{ opacity: opacityFade }}
            className="col-span-12 lg:col-span-4 pb-2 sm:pb-4"
          >
            <p className="text-sm sm:text-lg text-[#FFE8A3]/80 font-light leading-relaxed mb-4 sm:mb-6 border-l border-[#FFE8A3]/30 pl-4 sm:pl-6">
              Founded in 2026, Isai Tarang operates as a new-age living archive—preserving the rhythmic dance of the shuttle and the soul of the weaver.
            </p>
            <div className="flex items-center gap-3 sm:gap-4 text-[10px] tracking-[0.3em] font-bold uppercase text-[#FFE8A3]">
               Our Evolution <MoveDown size={14} className="animate-bounce" />
            </div>
          </motion.div>
        </div>

        {/* Decorative background year */}
        <motion.div 
          style={{ y: titleMove }}
          className="absolute -right-20 top-20 text-[12rem] sm:text-[20rem] font-playfair font-black opacity-[0.03] pointer-events-none select-none hidden sm:block"
        >
          2026
        </motion.div>
      </section>

      {/* ─── 2. THE PHILOSOPHY (STAGGERED) ─── */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-20 bg-[#FFE8A3]/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative min-h-[240px] sm:aspect-[3/4] bg-[#FFE8A3]/10 backdrop-blur-md border border-[#FFE8A3]/30 rounded-2xl flex items-center justify-center p-6 sm:p-12 overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 opacity-10 flex items-center justify-center rotate-12">
               <span className="text-6xl sm:text-9xl font-playfair italic">Silk</span>
            </div>
            <h2 className="font-playfair text-2xl sm:text-4xl md:text-5xl italic leading-tight text-center relative z-10 text-[#FFE8A3]">
              "We don't weave sarees; we weave <span className="font-bold not-italic">time</span> into a wearable form."
            </h2>
          </motion.div>

          <div className="space-y-8 sm:space-y-12">
             <div className="space-y-3 sm:space-y-4">
                <span className="text-[#FFE8A3]/80 font-bold text-[10px] tracking-widest uppercase">01 / Process</span>
                <h3 className="text-2xl sm:text-4xl font-playfair text-[#FFE8A3]">The Art of Slowness</h3>
                <p className="text-xs sm:text-base text-[#FFE8A3]/80 leading-relaxed font-light">
                  In an era of instant gratification, our looms remain defiantly slow. 
                  A single masterpiece can take up to 90 days, involving the labor of 
                  master dyers, pattern makers, and weavers.
                </p>
             </div>
             <div className="h-px w-full bg-[#FFE8A3]/15" />
             <div className="space-y-3 sm:space-y-4">
                <span className="text-[#FFE8A3]/80 font-bold text-[10px] tracking-widest uppercase">02 / Ethics</span>
                <h3 className="text-2xl sm:text-4xl font-playfair text-[#FFE8A3]">Artisan bankroll</h3>
                <p className="text-xs sm:text-base text-[#FFE8A3]/80 leading-relaxed font-light">
                  Our Zero-Middleman policy ensures that 70% of the saree value reaches 
                  the artisan's household directly. We maintain the dignity of the 
                  craft by valuing the craftsman.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* ─── 3. THE CHRONICLE (VERTICAL TIMELINE) ─── */}
      <section className="py-12 sm:py-24 px-4 sm:px-6 lg:px-20">
        <div className="max-w-5xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-[#FFE8A3]/20 -translate-x-1/2" />

          <div className="space-y-16 sm:space-y-28">
            {TIMELINE.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`relative flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-start md:items-center gap-6 md:gap-24 pl-12 md:pl-0`}
              >
                {/* Year Marker */}
                <div className="absolute left-4 md:left-1/2 w-8 h-8 sm:w-12 sm:h-12 bg-[#800202] border border-[#FFE8A3] rounded-full -translate-x-1/2 flex items-center justify-center z-10 shadow-lg top-1 md:top-auto">
                   <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#FFE8A3] rounded-full" />
                </div>

                <div className="w-full md:w-1/2 text-left md:text-right">
                   {i % 2 !== 0 && <div className="hidden md:block" />}
                   <div className={i % 2 === 0 ? '' : 'md:text-left'}>
                    <h4 className="text-4xl sm:text-6xl font-playfair font-bold text-[#FFE8A3] mb-1 sm:mb-2">{item.year}</h4>
                    <p className="text-xs sm:text-sm tracking-[0.3em] sm:tracking-[0.4em] uppercase text-[#FFE8A3]/80 font-bold mb-2 sm:mb-4">{item.event}</p>
                   </div>
                </div>

                <div className="w-full md:w-1/2">
                  <div className={`p-5 sm:p-8 border border-[#FFE8A3]/20 bg-[#FFE8A3]/10 backdrop-blur-md rounded-2xl hover:border-[#FFE8A3]/50 transition-all shadow-xl text-left`}>
                    <p className="text-xs sm:text-base text-[#FFE8A3]/90 font-light leading-relaxed italic">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. VALUES MATRIX ─── */}
      <section className="py-12 sm:py-24 border-t border-[#FFE8A3]/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="mb-10 sm:mb-16 text-center">
            <h2 className="text-3xl sm:text-5xl font-playfair mb-3 sm:mb-4 text-[#FFE8A3]">Core Architecture</h2>
            <p className="text-[#FFE8A3]/70 tracking-widest uppercase text-[9px] sm:text-[10px] font-bold">The principles that govern our atelier</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="bg-[#FFE8A3]/10 backdrop-blur-md border border-[#FFE8A3]/25 rounded-2xl p-6 sm:p-8 group hover:bg-[#FFE8A3]/20 hover:border-[#FFE8A3]/50 transition-all duration-500 shadow-xl">
                  <div className="text-[10px] font-bold text-[#FFE8A3]/40 mb-6 sm:mb-8">0{i+1}</div>
                  <Icon className="w-6 h-6 text-[#FFE8A3] mb-4 sm:mb-6 group-hover:scale-110 transition-all" />
                  <h4 className="text-base sm:text-lg font-bold uppercase tracking-tight mb-2 sm:mb-3 text-[#FFE8A3]">{v.title}</h4>
                  <p className="text-xs text-[#FFE8A3]/80 font-light leading-relaxed">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── 5. THE FINALE CTA ─── */}
      <section className="relative py-16 sm:py-24 overflow-hidden bg-[#F6D18A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="text-[#2B1409] text-center md:text-left">
            <h2 className="text-4xl sm:text-7xl md:text-9xl font-playfair leading-none tracking-tighter mb-4 sm:mb-6 font-bold">
              Own a <br className="hidden sm:inline" /> <span className="italic font-light">Legacy.</span>
            </h2>
            <p className="text-[#2B1409]/80 text-sm sm:text-xl font-medium max-w-md mx-auto md:mx-0">
              Every drape is a vote for the preservation of human craftsmanship.
            </p>
          </div>
          
          <Link 
            to="/products"
            className="group relative h-44 w-44 sm:h-64 sm:w-64 rounded-full border border-[#2B1409]/30 flex items-center justify-center hover:bg-[#2B1409] transition-all duration-700 overflow-hidden shrink-0"
          >
            <div className="flex flex-col items-center group-hover:text-[#F6D18A] transition-colors z-10">
              <ArrowUpRight className="w-8 h-8 sm:w-12 sm:h-12 mb-2 sm:mb-4 group-hover:rotate-45 transition-transform duration-500" />
              <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] sm:tracking-[0.4em]">View Archive</span>
            </div>
            {/* Liquid hover effect */}
            <div className="absolute inset-0 bg-[#2B1409] translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-in-out" />
          </Link>
        </div>

        {/* Floating background text */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 text-[25vw] font-playfair font-black text-[#2B1409]/5 pointer-events-none whitespace-nowrap hidden sm:block">
           AUTHENTIC HERITAGE
        </div>
      </section>

    </div>
  );
}
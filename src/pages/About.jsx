import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ShieldCheck, Globe, Zap, History } from 'lucide-react';

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Silk Mark Certified',
    desc: "100% natural fiber purity with authentic gold zari testing.",
  },
  {
    icon: Globe,
    title: 'Zero Middlemen',
    desc: "70% of proceeds go directly to the weaver's bank account.",
  },
  {
    icon: Zap,
    title: 'Lost Motifs',
    desc: "Digitizing 18th-century archives to revive extinct patterns.",
  },
  {
    icon: History,
    title: 'Slow Production',
    desc: "Limited drops. 40 days of human effort per masterpiece.",
  },
];

const TIMELINE = [
  { year: '1994', event: 'The Loom Initiation', desc: 'Started with 8 master weavers in the heart of Varanasi.' },
  { year: '2012', event: 'Cluster Expansion', desc: 'Connecting Kanchipuram and Bengal artisans to our network.' },
  { year: '2024', event: 'Global Preservation', desc: 'Now supporting 500+ families through sustainable luxury.' },
];

export default function About() {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], [0, -200]);

  return (
    <div className="bg-[#0F1115] text-[#F4F4F1] selection:bg-[#C58E7E] selection:text-white">
      
      {/* ─── 1. ART-HOUSE HERO (ANIMATED KINETIC BACKGROUND TITLE & GRADIENTS) ─── */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-20 px-6 overflow-hidden bg-[#0A0C0E]">
        
        {/* Animated Moving Background Title Stream 1 (Moving Left) */}
        <div className="absolute top-[18%] inset-x-0 flex items-center pointer-events-none select-none overflow-hidden opacity-10">
          <motion.div 
            animate={{ x: [0, -1600] }}
            transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
            className="whitespace-nowrap flex gap-12 text-[16vw] font-black uppercase text-white/30 tracking-tighter"
          >
            <span>ATELIER ARCHIVES • ISAI TARANG • HANDLOOM PROGRAM • REVIVAL •</span>
            <span>ATELIER ARCHIVES • ISAI TARANG • HANDLOOM PROGRAM • REVIVAL •</span>
          </motion.div>
        </div>

        {/* Animated Moving Background Title Stream 2 (Moving Right) */}
        <div className="absolute bottom-[12%] inset-x-0 flex items-center pointer-events-none select-none overflow-hidden opacity-[0.08]">
          <motion.div 
            animate={{ x: [-1600, 0] }}
            transition={{ repeat: Infinity, duration: 32, ease: "linear" }}
            className="whitespace-nowrap flex gap-12 text-[14vw] font-black uppercase text-[#C58E7E]/30 tracking-tighter italic"
          >
            <span>ARTISAN PRESERVATION • MASTER WEAVERS GUILD • VARANASI •</span>
            <span>ARTISAN PRESERVATION • MASTER WEAVERS GUILD • VARANASI •</span>
          </motion.div>
        </div>

        {/* Ambient Glowing Radial Gradient Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#C58E7E]/20 via-[#6B0F1A]/15 to-[#E2BD45]/10 rounded-full blur-[140px] pointer-events-none" 
        />
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-[#E2BD45]/15 via-[#C58E7E]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto w-full text-center relative z-10 border border-white/10 p-8 sm:p-16 md:p-24 bg-[#0A0C0E]/70 backdrop-blur-xl rounded-2xl shadow-2xl">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            {/* Top Pill / Badge */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-[#C58E7E]/40 bg-gradient-to-r from-[#C58E7E]/15 via-transparent to-[#C58E7E]/10 backdrop-blur-md shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#C58E7E] animate-ping" />
                <span className="text-[11px] font-bold tracking-[0.45em] uppercase text-white/90">
                  Est. 1994 • <span className="text-[#C58E7E]">Artisan Guild Program</span>
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="font-playfair text-5xl sm:text-7xl md:text-9xl leading-[0.92] mb-10 tracking-tighter text-white">
              The Soul <br />
              <span className="italic font-light bg-gradient-to-r from-[#C58E7E] via-[#E2BD45] to-[#C58E7E] bg-clip-text text-transparent">
                of the Loom.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-xl text-white/70 max-w-2xl font-light leading-relaxed mb-14 px-2">
              Since 1994, our initiative has served as a dedicated bridge preserving Varanasi and Kanchipuram's ancient weaving traditions while supporting master artisan families.
            </p>

            {/* Key Indicators Bar */}
            <div className="pt-10 border-t border-white/10 w-full grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="group">
                <p className="font-playfair text-3xl sm:text-4xl font-bold text-white group-hover:text-[#C58E7E] transition-colors mb-1">1994</p>
                <p className="text-[10px] tracking-[0.3em] text-[#C58E7E] uppercase font-semibold">Origin Year</p>
              </div>
              <div className="border-l md:border-x border-white/10 group">
                <p className="font-playfair text-3xl sm:text-4xl font-bold text-white group-hover:text-[#C58E7E] transition-colors mb-1">Varanasi</p>
                <p className="text-[10px] tracking-[0.3em] text-[#C58E7E] uppercase font-semibold">Atelier Hub</p>
              </div>
              <div className="border-t md:border-t-0 border-white/10 pt-4 md:pt-0 group">
                <p className="font-playfair text-3xl sm:text-4xl font-bold text-white group-hover:text-[#C58E7E] transition-colors mb-1">500+</p>
                <p className="text-[10px] tracking-[0.3em] text-[#C58E7E] uppercase font-semibold">Artisan Families</p>
              </div>
              <div className="border-l border-white/10 border-t md:border-t-0 pt-4 md:pt-0 group">
                <p className="font-playfair text-3xl sm:text-4xl font-bold text-white group-hover:text-[#C58E7E] transition-colors mb-1">100%</p>
                <p className="text-[10px] tracking-[0.3em] text-[#C58E7E] uppercase font-semibold">Silk Mark Pure</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 2. THE BIG STATEMENT ─── */}
      <section className="py-40 relative overflow-hidden">
        <motion.div style={{ x }} className="whitespace-nowrap flex gap-10 opacity-[0.03] pointer-events-none absolute top-1/2 -translate-y-1/2">
           <span className="text-[25vh] font-black uppercase">Handcrafted Heritage Slow Fashion Artisanal Soul</span>
        </motion.div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-playfair text-4xl md:text-6xl leading-tight italic font-light"
          >
            "A saree takes <span className="text-[#C58E7E] font-normal">three months</span> of a human's life to manifest. We believe that time is the ultimate luxury."
          </motion.h2>
          <div className="mt-12 h-20 w-px bg-[#C58E7E] mx-auto" />
        </div>
      </section>

      {/* ─── 3. MILESTONES (MINIMALIST LIST) ─── */}
      <section className="py-32 border-y border-white/5 bg-[#14161B]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {TIMELINE.map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-10 border border-white/5 hover:border-[#C58E7E]/30 transition-all"
            >
              <span className="text-[#C58E7E] font-bold text-xs tracking-[0.5em] uppercase block mb-6">Chapter {i + 1}</span>
              <h3 className="text-4xl font-playfair mb-4">{item.year}</h3>
              <p className="text-lg font-playfair italic mb-6 text-white/80">{item.event}</p>
              <p className="text-sm text-white/40 leading-relaxed font-light">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── 4. VALUES GRID (MODERN ASYMMETRY) ─── */}
      <section className="py-40 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 lg:col-span-4 mb-20">
            <h2 className="text-5xl font-playfair mb-8">Our <br /> Foundation</h2>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              We operate on the principles of radical transparency and cultural preservation.
            </p>
          </div>

          <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 border border-white/10">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="bg-[#0F1115] p-12 group hover:bg-[#14161B] transition-colors">
                  <Icon className="w-8 h-8 text-[#C58E7E] mb-8 group-hover:scale-110 transition-transform" />
                  <h4 className="text-xl font-bold uppercase tracking-tighter mb-4">{v.title}</h4>
                  <p className="text-sm text-white/40 font-light leading-relaxed">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── 5. ARTISAN CTA ─── */}
      <section className="py-40 bg-[#C58E7E] text-[#0F1115]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <h2 className="text-6xl md:text-8xl font-playfair leading-[0.85] tracking-tighter mb-6">
              500+ Artisans. <br /> One Heritage.
            </h2>
            <p className="text-[#0F1115]/70 text-lg italic">
              When you wear Isai Tarang, you aren't just wearing silk; you're supporting a lineage.
            </p>
          </div>
          
          <Link 
            to="/products"
            className="group h-48 w-48 rounded-full border border-[#0F1115] flex flex-col items-center justify-center hover:bg-[#0F1115] hover:text-white transition-all duration-500"
          >
            <ArrowUpRight size={32} className="mb-2 group-hover:rotate-45 transition-transform" />
            <span className="text-[10px] font-bold uppercase tracking-widest">Shop Collection</span>
          </Link>
        </div>
      </section>

      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none z-[-1] opacity-20">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C58E7E]/10 blur-[120px] rounded-full" />
         <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 blur-[100px] rounded-full" />
      </div>

    </div>
  );
}
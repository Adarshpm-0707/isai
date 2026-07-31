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
    <div className="bg-[#120404] text-[#1a1a1a] selection:bg-[#120404] selection:text-[#efcf8b]">
      
      {/* ─── 1. ART-HOUSE HERO ─── */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-28 pb-20 px-6 overflow-hidden bg-[#120404]">
        


        {/* Ambient Glowing Radial Gradient Orbs */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
          transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#f45d04]/20 via-[#c20903]/15 to-transparent rounded-full blur-[140px] pointer-events-none" 
        />
        <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-gradient-to-br from-[#c20903]/15 via-[#f45d04]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto w-full text-center relative z-10 border border-gray-200 p-8 sm:p-16 md:p-24 bg-[#1a0806]/80 backdrop-blur-xl rounded-2xl shadow-2xl">
          <motion.div
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            {/* Top Pill / Badge */}
            <div className="mb-8">
              <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-[#f45d04]/40 bg-gradient-to-r from-[#f45d04]/15 via-transparent to-[#c20903]/15 backdrop-blur-md shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#120404] animate-ping" />
                <span className="text-[11px] font-bold tracking-[0.45em] uppercase text-[#efcf8b]/90">
                  Est. 1994 • <span className="text-[#f45d04]">Artisan Guild Program</span>
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="font-playfair text-4xl sm:text-7xl md:text-9xl leading-[0.92] mb-10 tracking-tighter text-[#efcf8b] max-w-full break-words">
              The Soul <br />
              <span className="italic font-light bg-gradient-to-r from-[#f45d04] via-[#f45d04] to-[#c20903] bg-clip-text text-transparent">
                of the Loom.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-xl text-[#efcf8b]/70 max-w-2xl font-light leading-relaxed mb-14 px-2">
              Since 1994, our initiative has served as a dedicated bridge preserving Varanasi and Kanchipuram's ancient weaving traditions while supporting master artisan families.
            </p>

            {/* Key Indicators Bar */}
            <div className="pt-10 border-t border-gray-200 w-full grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="group">
                <p className="font-playfair text-3xl sm:text-4xl font-bold text-[#efcf8b] group-hover:text-[#f45d04] transition-colors mb-1">1994</p>
                <p className="text-[10px] tracking-[0.3em] text-[#f45d04] uppercase font-semibold">Origin Year</p>
              </div>
              <div className="border-l md:border-x border-gray-200 group">
                <p className="font-playfair text-3xl sm:text-4xl font-bold text-[#efcf8b] group-hover:text-[#f45d04] transition-colors mb-1">Varanasi</p>
                <p className="text-[10px] tracking-[0.3em] text-[#f45d04] uppercase font-semibold">Atelier Hub</p>
              </div>
              <div className="border-t md:border-t-0 border-gray-200 pt-4 md:pt-0 group">
                <p className="font-playfair text-3xl sm:text-4xl font-bold text-[#efcf8b] group-hover:text-[#f45d04] transition-colors mb-1">500+</p>
                <p className="text-[10px] tracking-[0.3em] text-[#f45d04] uppercase font-semibold">Artisan Families</p>
              </div>
              <div className="border-l border-gray-200 border-t md:border-t-0 pt-4 md:pt-0 group">
                <p className="font-playfair text-3xl sm:text-4xl font-bold text-[#efcf8b] group-hover:text-[#f45d04] transition-colors mb-1">100%</p>
                <p className="text-[10px] tracking-[0.3em] text-[#f45d04] uppercase font-semibold">Silk Mark Pure</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── 2. THE BIG STATEMENT ─── */}
      <section className="py-40 relative overflow-hidden bg-[#120404]">
        <motion.div style={{ x }} className="whitespace-nowrap flex gap-10 opacity-[0.03] pointer-events-none absolute top-1/2 -translate-y-1/2">
           <span className="text-[25vh] font-black uppercase text-[#efcf8b]">Handcrafted Heritage Slow Fashion Artisanal Soul</span>
        </motion.div>

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-playfair text-4xl md:text-6xl leading-tight italic font-light text-[#efcf8b]"
          >
            "A saree takes <span className="text-[#f45d04] font-normal">three months</span> of a human's life to manifest. We believe that time is the ultimate luxury."
          </motion.h2>
          <div className="mt-12 h-20 w-px bg-[#120404] mx-auto" />
        </div>
      </section>

      {/* ─── 3. MILESTONES ─── */}
      <section className="py-32 border-y border-gray-200 bg-[#1a0806]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {TIMELINE.map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="p-10 border border-gray-200 hover:border-[#f45d04]/40 transition-all rounded-sm bg-[#120404]"
            >
              <span className="text-[#f45d04] font-bold text-xs tracking-[0.5em] uppercase block mb-6">Chapter {i + 1}</span>
              <h3 className="text-4xl font-playfair mb-4 text-[#efcf8b]">{item.year}</h3>
              <p className="text-lg font-playfair italic mb-6 text-[#efcf8b]/80">{item.event}</p>
              <p className="text-sm text-[#efcf8b] leading-relaxed font-light">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── 4. VALUES GRID ─── */}
      <section className="py-40 max-w-7xl mx-auto px-6 bg-[#120404]">
        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 lg:col-span-4 mb-20">
            <h2 className="text-5xl font-playfair mb-8 text-[#efcf8b]">Our <br /> Foundation</h2>
            <p className="text-[#efcf8b] text-sm leading-relaxed max-w-xs">
              We operate on the principles of radical transparency and cultural preservation.
            </p>
          </div>

          <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-100 border border-gray-200">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <div key={i} className="bg-[#1a0806] p-12 group hover:bg-[#200a08] transition-colors">
                  <Icon className="w-8 h-8 text-[#f45d04] mb-8 group-hover:scale-110 transition-transform" />
                  <h4 className="text-xl font-bold uppercase tracking-tighter mb-4 text-[#efcf8b]">{v.title}</h4>
                  <p className="text-sm text-[#efcf8b] font-light leading-relaxed">{v.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ─── 5. ARTISAN CTA ─── */}
      <section className="py-40 bg-gradient-to-r from-[#f45d04] to-[#c20903] text-[#efcf8b]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <h2 className="text-6xl md:text-8xl font-playfair leading-[0.85] tracking-tighter mb-6 text-[#efcf8b]">
              500+ Artisans. <br /> One Heritage.
            </h2>
            <p className="text-[#efcf8b]/90 text-lg italic">
              When you wear Isai Tarang, you aren't just wearing silk; you're supporting a lineage.
            </p>
          </div>
          
          <Link 
            to="/products"
            className="group h-48 w-48 rounded-full border border-white flex flex-col items-center justify-center hover:bg-white hover:text-[#ffffff] transition-all duration-500 shadow-2xl"
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





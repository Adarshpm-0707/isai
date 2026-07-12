import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Award, Users, Leaf, BookOpen } from 'lucide-react';

const VALUES = [
  {
    icon: Award,
    title: '100% Authentic Weaves',
    desc: "Every product carries Silk Mark assurance — pure natural silks and genuine gold zari embroidery, verified from source.",
  },
  {
    icon: Users,
    title: 'Direct Artisan Link',
    desc: "By removing middlemen, up to 70% of each saree's value flows directly to the weaver's family, protecting livelihoods.",
  },
  {
    icon: Leaf,
    title: 'Slow Fashion Philosophy',
    desc: "One saree takes 15 days to 3 months to handcraft. We celebrate the unhurried, the deliberate, the extraordinary.",
  },
  {
    icon: BookOpen,
    title: 'Reviving Lost Motifs',
    desc: "Our design lab works with elders in Varanasi to recreate historical patterns from Mughal-era weaving archives.",
  },
];

const TIMELINE = [
  { year: '1994', event: 'Founded by weavers in Varanasi, with 8 master craftsmen.' },
  { year: '2004', event: 'First Silk Mark certification across all product lines.' },
  { year: '2012', event: 'Expanded to Kanchipuram, Chanderi, and Bengal clusters.' },
  { year: '2018', event: 'Launched online platform connecting 500+ weavers globally.' },
  { year: '2024', event: 'Awarded National Handloom Preservation Excellence Award.' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.1 } }),
};

export default function About() {
  return (
    <div className="bg-[#FAF9F6] text-[#1a1a1a] overflow-x-hidden">

      {/* ─── 1. CINEMATIC HEADER ─── */}
      <section className="relative h-[70vh] flex items-end pb-20 overflow-hidden bg-[#0d0d0d]">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.45 }}
          transition={{ duration: 1.8 }}
          src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=1600"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-[#0d0d0d]/40 to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-[#C9A227]" />
              <span className="text-[#C9A227] tracking-[0.4em] text-[10px] font-sans font-bold uppercase">
                Est. 1994 · Varanasi
              </span>
            </div>
            <h1 className="font-playfair text-[clamp(3rem,8vw,6rem)] text-white leading-[0.9] tracking-tight">
              Our <em className="not-italic text-[#C9A227]">Story</em>
            </h1>
            <p className="font-sans text-white/40 text-sm mt-4 max-w-sm uppercase tracking-[0.15em]">
              Preserving India's handloom weaving masterpieces
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── 2. BRAND MANIFESTO ─── */}
      <section className="max-w-7xl mx-auto px-6 py-28 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="space-y-8"
        >
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-4">The Beginning</p>
            <h2 className="font-playfair text-4xl md:text-5xl leading-tight">The Threads<br />of Time</h2>
          </div>
          <blockquote className="border-l-2 border-[#C9A227] pl-6">
            <p className="font-playfair italic text-xl text-[#6B0F1A] leading-relaxed">
              "A saree is not just an attire; it is a tapestry of memories, woven by hands that hold centuries of artisanal heritage."
            </p>
          </blockquote>
          <div className="space-y-5 font-sans text-[15px] text-gray-600 leading-relaxed font-light">
            <p>
              Founded with a vision to connect rural master weavers directly with connoisseurs of fine silk, Isai Tarang has championed handloom traditions since 1994. We believe in slow fashion — a single Banarasi or Kanchipuram saree takes 15 days to 3 months of meticulous handcrafting.
            </p>
            <p>
              We work closely with weaving clusters in Varanasi, Kanchipuram, Chanderi, and Bengal, ensuring ethical wages, fair trade, and complete structural support for our artisan partners.
            </p>
          </div>
          <Link
            to="/products"
            className="group inline-flex items-center gap-3 font-sans font-bold text-xs uppercase tracking-[0.25em] border border-[#6B0F1A] text-[#6B0F1A] px-8 py-3.5 hover:bg-[#6B0F1A] hover:text-white transition-all duration-300"
          >
            Shop the Collection
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <motion.div
          variants={fadeUp}
          custom={1}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative"
        >
          <div className="aspect-[4/5] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&q=80&w=700"
              alt="Handloom weaving process"
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </div>
          {/* Floating accent box */}
          <div className="absolute -bottom-6 -left-6 bg-[#6B0F1A] text-white p-6 w-40 hidden md:block">
            <p className="font-playfair text-4xl font-bold text-[#C9A227]">30+</p>
            <p className="font-sans text-[9px] uppercase tracking-[0.25em] mt-1 text-white/60">Years of Heritage</p>
          </div>
        </motion.div>
      </section>

      {/* ─── 3. TIMELINE ─── */}
      <section className="bg-[#0d0d0d] py-28 overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C9A227] mb-3">Milestones</p>
            <h2 className="font-playfair text-4xl md:text-5xl text-white">A Legacy in Years</h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px] bg-white/10 hidden md:block" />

            <div className="space-y-12">
              {TIMELINE.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <p className="font-playfair text-5xl font-bold text-[#C9A227]/20 mb-1">{item.year}</p>
                    <p className="font-sans text-sm text-white/60 leading-relaxed max-w-xs ml-auto">{item.event}</p>
                  </div>

                  {/* Dot */}
                  <div className="hidden md:flex w-5 h-5 rounded-full border-2 border-[#C9A227] bg-[#0d0d0d] flex-shrink-0 z-10" />

                  <div className="flex-1" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. CORE VALUES ─── */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-3">Principles</p>
            <h2 className="font-playfair text-4xl md:text-5xl">What We Stand For</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  custom={i}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  className="group p-8 border border-gray-100 bg-white hover:border-[#C9A227] transition-all duration-300 hover:shadow-lg"
                >
                  <div className="w-10 h-10 bg-[#6B0F1A]/5 rounded-full flex items-center justify-center mb-6 group-hover:bg-[#C9A227]/10 transition-colors">
                    <Icon className="w-5 h-5 text-[#6B0F1A] group-hover:text-[#C9A227] transition-colors" />
                  </div>
                  <h3 className="font-playfair text-lg font-bold text-[#6B0F1A] mb-3 leading-tight">{v.title}</h3>
                  <p className="font-sans text-xs text-gray-500 leading-relaxed">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── 5. ARTISAN BAND ─── */}
      <section className="bg-[#6B0F1A] py-20">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-[#C9A227]">The People</p>
          <h2 className="font-playfair text-4xl md:text-5xl text-white">500+ Weavers.<br />One Purpose.</h2>
          <p className="font-sans text-white/50 text-sm max-w-md mx-auto leading-relaxed">
            Every thread we sell is someone's livelihood, someone's pride, and someone's art. We are merely the bridge.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-3 font-sans font-bold text-xs uppercase tracking-[0.25em] bg-[#C9A227] text-[#1a1a1a] px-8 py-3.5 hover:bg-white transition-all duration-300 mt-4"
          >
            Support a Weaver <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
}

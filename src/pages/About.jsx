import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Globe, 
  Sparkles, 
  ArrowRight, 
  Crown, 
  MapPin, 
  CheckCircle2, 
  Feather
} from 'lucide-react';
import BrandLogo, { LotusEmblem } from '../components/reusable/BrandLogo';
import { FloralOrnament } from '../components/reusable/FloralOrnament';
import heroModelImg from '../assets/hero_saree_model.jpg';
import storyModelImg from '../assets/story_saree_model.jpg';
import silkBackdrop from '../assets/newsletter_silk_backdrop.jpg';

/* ── 4 PILLARS OF INTEGRITY ── */
const CRAFT_PILLARS = [
  {
    icon: Globe,
    title: 'Direct-to-Weaver Alliances',
    subtitle: 'Preserving Dignity & Livelihoods',
    desc: 'By sourcing directly from master weaving clusters in Kuthampully, Kanchipuram, and Varanasi, we cut out middlemen to ensure fair wages and honest pricing.',
  },
  {
    icon: ShieldCheck,
    title: 'Purity & Authenticity First',
    subtitle: 'Tested Natural Fibers',
    desc: 'Every warp and weft is held to rigorous standards: certified silk fibers, breathable combed cottons, and authentic tested zari work you can cherish with confidence.',
  },
  {
    icon: Sparkles,
    title: 'Living Heirlooms',
    subtitle: 'Sarees for Generations',
    desc: 'We don’t believe in disposable fashion. Each saree is thoughtfully chosen to withstand time, gathering beauty and sentimental memories through every drape.',
  },
  {
    icon: Feather,
    title: 'Every Occasion, Every You',
    subtitle: 'From Temple Festivities to Galas',
    desc: 'Bridging everyday handloom ease with regal festival grandiosity. A spectrum of textures curated so every Indian woman feels crowned in her heritage.',
  },
];

/* ── 4 STEP WEAVING ODYSSEY ── */
const WEAVING_STEPS = [
  {
    number: '01',
    title: 'Fiber Selection',
    detail: 'Finest hand-picked Kerala cotton yarns and high-grade mulberry silk threads inspected for raw tensile purity.',
  },
  {
    number: '02',
    title: 'Artisan Looming',
    detail: 'Traditional pit looms and hand shuttles operated by generational weavers passing down centuries-old rhythm.',
  },
  {
    number: '03',
    title: 'Zari Architecture',
    detail: 'Intertwining intricate temple towers, mango paisleys, and floral creepers with precision metal-coated warps.',
  },
  {
    number: '04',
    title: 'Your Treasured Story',
    detail: 'Carefully folded, inspected, and delivered to your doorstep ready to embrace your most cherished memories.',
  },
];

export default function About() {
  const location = useLocation();

  // Smooth scroll to #our-story when targeted
  useEffect(() => {
    if (location.hash === '#our-story') {
      const timer = setTimeout(() => {
        const el = document.getElementById('our-story');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [location.hash]);

  return (
    <div className="bg-[#120B09] text-[#FDF8F4] overflow-hidden font-sans selection:bg-[#DFC18A] selection:text-[#120B09]">
      {/* ── SECTION 1: CINEMATIC EDITORIAL HERO ── */}
      <section className="relative pt-6 sm:pt-12 pb-14 sm:pb-20 px-4 sm:px-6 lg:px-8 border-b border-[#2A1B15] overflow-hidden">
        {/* Ambient Silk Backdrop with Depth Gradients */}
        <div className="absolute inset-0 z-0">
          <img
            src={silkBackdrop}
            alt="Handloom Silk Texture"
            className="w-full h-full object-cover opacity-25 filter blur-[1px] scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#120B09] via-[#120B09]/85 to-[#120B09]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#DFC18A]/15 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
          {/* Brand Emblem & Overline */}
          <div className="inline-flex flex-col items-center space-y-2.5">
            <LotusEmblem className="w-10 h-10 sm:w-14 sm:h-14 object-contain filter drop-shadow-[0_0_20px_rgba(223,193,138,0.45)]" />
            <div className="flex items-center gap-3">
              <span className="w-8 sm:w-12 h-px bg-gradient-to-r from-transparent to-[#DFC18A]" />
              <span className="text-[#DFC18A] text-[11px] sm:text-xs font-semibold tracking-[0.32em] uppercase font-sans">
                Curated Indian Heritage & Ethnic Wear
              </span>
              <span className="w-8 sm:w-12 h-px bg-gradient-to-l from-transparent to-[#DFC18A]" />
            </div>
          </div>

          {/* Main Title as Specified */}
          <h1
            className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-normal leading-[1.12] text-[#FDF8F4] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            Discover Timeless Elegance with
            <br />
            <span className="italic font-light text-[#E5C58A] relative inline-block mt-1">
              Isai Tarang
              <span className="absolute left-0 right-0 -bottom-2 h-[2px] bg-gradient-to-r from-transparent via-[#DFC18A] to-transparent opacity-80" />
            </span>
          </h1>

          {/* User's Exact About Narrative Text */}
          <div className="max-w-3xl mx-auto pt-2">
            <p className="text-base sm:text-lg md:text-xl text-[#EADFC9] font-light leading-relaxed drop-shadow-sm font-sans">
              At <strong className="font-medium text-[#FDF8F4]">Isai Tarang</strong>, we bring you the beauty of Indian traditions through carefully curated sarees and ethnic wear. From authentic Kerala sarees sourced directly from the weavers of Kuthampully, with a focus on purity and uniqueness, to the rich silk heritage of Kanchipuram and the exquisite artistry of Banarasi sarees from North India, every collection celebrates craftsmanship and timeless elegance. Explore our beautiful range of Indian ethnic wear, where tradition meets style, bringing you something special for every occasion.
            </p>
          </div>

          {/* Action Hub */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#163326] hover:bg-[#204634] text-[#FDF8F4] text-xs sm:text-sm font-medium tracking-[0.18em] uppercase border border-[#2A563E] shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_35px_rgba(22,51,38,0.6)] cursor-pointer"
            >
              <span>Explore The Collection</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <a
              href="#our-story"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 rounded-full border border-[#C8A27A] hover:border-[#DFC18A] bg-[#1E130F]/60 backdrop-blur-sm hover:bg-[#DFC18A]/10 text-[#DFC18A] hover:text-[#FDF8F4] text-xs sm:text-sm font-medium tracking-[0.18em] uppercase transition-all duration-300 hover:scale-105 cursor-pointer"
            >
              <span>Read Our Story</span>
            </a>
          </div>

          {/* Micro Cluster Highlights */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs text-[#DFC18A]/80 font-serif tracking-wider">
            <span className="flex items-center gap-1.5 bg-[#1E130F]/80 border border-[#35221B] px-3.5 py-1.5 rounded-full">
              <MapPin className="w-3.5 h-3.5 text-[#DFC18A]" /> Kuthampully Weaves
            </span>
            <span className="flex items-center gap-1.5 bg-[#1E130F]/80 border border-[#35221B] px-3.5 py-1.5 rounded-full">
              <Crown className="w-3.5 h-3.5 text-[#DFC18A]" /> Kanchipuram Silks
            </span>
            <span className="flex items-center gap-1.5 bg-[#1E130F]/80 border border-[#35221B] px-3.5 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5 text-[#DFC18A]" /> Banarasi Artistry
            </span>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: "OUR STORY" (ANCHOR TARGET FOR HERO BUTTON) ── */}
      <section
        id="our-story"
        className="scroll-mt-24 py-20 sm:py-28 px-4 sm:px-6 lg:px-8 relative bg-gradient-to-b from-[#120B09] via-[#160E0B] to-[#120B09] border-b border-[#2A1B15]"
      >
        <div className="max-w-7xl mx-auto">
          {/* Editorial Section Header */}
          <div className="text-center max-w-2xl mx-auto mb-14 sm:mb-20 space-y-3">
            <span className="text-[#DFC18A] text-xs font-semibold tracking-[0.3em] uppercase block">
              The Heart Behind The Weave
            </span>
            <h2
              className="font-serif text-3xl sm:text-5xl text-[#FDF8F4] tracking-tight"
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
            >
              OUR STORY
            </h2>
            <FloralOrnament className="mt-2" />
          </div>

          {/* Editorial Exhibition Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Visual Column with Layered Saree Photography */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-[440px] aspect-[4/5] rounded-3xl overflow-hidden border border-[#3A241C] shadow-[0_20px_60px_rgba(0,0,0,0.8)] group">
                <img
                  src={storyModelImg}
                  alt="Isai Tarang Handloom Masterpiece"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#120B09] via-transparent to-transparent opacity-80" />

                {/* Floating Handwritten Style Badge */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#1E130F]/90 backdrop-blur-md border border-[#DFC18A]/30 text-center">
                  <p className="font-serif italic text-sm sm:text-base text-[#DFC18A] leading-snug">
                    “Every thread carries a memory. Every drape celebrates a root.”
                  </p>
                </div>
              </div>

              {/* Decorative Accent Frame Behind */}
              <div className="hidden sm:block absolute -top-4 -left-4 w-full h-full rounded-3xl border border-[#DFC18A]/20 pointer-events-none -z-10" />
            </div>

            {/* Handwritten Story Quotes Recreated with High-End Typography */}
            <div className="lg:col-span-7 space-y-8">
              {/* Card 1: 1st Handwritten Paragraph */}
              <div className="relative p-7 sm:p-9 rounded-2xl bg-[#1A100C]/90 border border-[#35221B] shadow-xl hover:border-[#DFC18A]/40 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#120B09] border border-[#DFC18A]/50 flex items-center justify-center shrink-0 text-[#DFC18A] font-serif font-bold text-sm">
                    I
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[#DFC18A] uppercase">
                      The Textile Heritage
                    </span>
                    <p
                      className="font-serif text-lg sm:text-2xl text-[#FDF8F4] leading-relaxed font-normal"
                      style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
                    >
                      “Inspired by the richness of Indian traditions and the artistry of our textile heritage, we bring together sarees that celebrate the beauty of every thread and the stories woven into every drape.”
                    </p>
                  </div>
                </div>
              </div>

              {/* Card 2: 2nd Handwritten Paragraph */}
              <div className="relative p-7 sm:p-9 rounded-2xl bg-[#1A100C]/90 border border-[#35221B] shadow-xl hover:border-[#DFC18A]/40 transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#120B09] border border-[#DFC18A]/50 flex items-center justify-center shrink-0 text-[#DFC18A] font-serif font-bold text-sm">
                    II
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-[#DFC18A] uppercase">
                      The Roots & Memories
                    </span>
                    <p
                      className="font-serif text-lg sm:text-2xl text-[#FDF8F4] leading-relaxed font-normal"
                      style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
                    >
                      “From the enduring charm of Kerala&apos;s traditional weaves to the regal elegance of silk sarees, every selection is an invitation to celebrate your roots while creating memories of your own.”
                    </p>
                  </div>
                </div>
              </div>

              {/* Trust Indicators in Our Story */}
              <div className="pt-2 grid grid-cols-3 gap-3 text-center">
                <div className="p-3.5 rounded-xl bg-[#1E130F] border border-[#2D1B15]">
                  <p className="font-serif text-xl sm:text-2xl text-[#DFC18A] font-bold">100%</p>
                  <p className="text-[10px] sm:text-xs text-[#C7B5A7] uppercase tracking-wider font-light">Authentic Weave</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#1E130F] border border-[#2D1B15]">
                  <p className="font-serif text-xl sm:text-2xl text-[#DFC18A] font-bold">Direct</p>
                  <p className="text-[10px] sm:text-xs text-[#C7B5A7] uppercase tracking-wider font-light">Artisan Hubs</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#1E130F] border border-[#2D1B15]">
                  <p className="font-serif text-xl sm:text-2xl text-[#DFC18A] font-bold">Heirloom</p>
                  <p className="text-[10px] sm:text-xs text-[#C7B5A7] uppercase tracking-wider font-light">Grace Forever</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: THE FOUR PILLARS OF CRAFTSMANSHIP ── */}
      <section className="py-20 sm:py-28 bg-[#160E0B] border-y border-[#261712] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-[#DFC18A] text-xs font-semibold tracking-[0.3em] uppercase">
              Our Non-Negotiable Standards
            </span>
            <h2
              className="font-serif text-3xl sm:text-5xl text-[#FDF8F4]"
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
            >
              The Isai Tarang Promise
            </h2>
            <FloralOrnament className="mt-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CRAFT_PILLARS.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div
                  key={idx}
                  className="group relative p-7 rounded-2xl bg-[#1E130F] border border-[#35221B] space-y-4 hover:border-[#DFC18A]/50 transition-all duration-300 hover:bg-[#251813] shadow-lg flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-[#120B09] border border-[#DFC18A]/40 flex items-center justify-center text-[#DFC18A] group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg font-medium text-[#FDF8F4] group-hover:text-[#DFC18A] transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-[11px] font-semibold text-[#DFC18A]/75 tracking-wider uppercase pt-0.5">
                        {p.subtitle}
                      </p>
                    </div>
                    <p className="text-xs text-[#A89689] leading-relaxed font-light">
                      {p.desc}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center gap-2 text-[10px] text-[#DFC18A]/60 font-serif">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#DFC18A]" /> Guaranteed Authenticity
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: THE WEAVING ODYSSEY (4 STEPS) ── */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-[#DFC18A] text-xs font-semibold tracking-[0.3em] uppercase">
            From Loom to Legacy
          </span>
          <h2
            className="font-serif text-3xl sm:text-5xl text-[#FDF8F4]"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            How Every Saree Takes Life
          </h2>
          <FloralOrnament className="mt-2" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {WEAVING_STEPS.map((s, idx) => (
            <div
              key={idx}
              className="relative p-6 sm:p-7 rounded-2xl bg-[#180F0C] border border-[#301E17] space-y-3.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-3xl sm:text-4xl text-[#DFC18A] font-light">
                  {s.number}
                </span>
                <span className="w-8 h-px bg-[#DFC18A]/30" />
              </div>
              <h4 className="font-serif text-base sm:text-lg font-semibold text-[#FDF8F4]">
                {s.title}
              </h4>
              <p className="text-xs text-[#A89689] leading-relaxed font-light">
                {s.detail}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 6: GRAND INVITATION BANNER ── */}
      <section className="relative py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#180F0C] via-[#22140F] to-[#180F0C] border-t border-[#35221B] text-center overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 relative z-10">
          <LotusEmblem className="w-8 h-8 sm:w-10 sm:h-10 mx-auto object-contain opacity-90" />
          <h2
            className="font-serif text-3xl sm:text-5xl font-normal text-[#FDF8F4] leading-snug"
            style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
          >
            “Every Saree Tells a Story.
            <br />
            <span className="italic text-[#DFC18A]">Let Yours Begin with Isai Tarang.”</span>
          </h2>
          <p className="text-xs sm:text-base text-[#C7B5A7] max-w-xl mx-auto font-light leading-relaxed">
            Discover our curated drapes handcrafted by traditional artisans across India, delivered with care to honor your heritage.
          </p>

          <div className="pt-2">
            <Link
              to="/products"
              className="inline-flex items-center gap-3 px-9 py-4 rounded-full bg-[#163326] hover:bg-[#204634] text-[#FDF8F4] text-xs sm:text-sm font-medium tracking-[0.18em] uppercase border border-[#2A563E] shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-[0_8px_30px_rgba(22,51,38,0.6)] cursor-pointer"
            >
              <span>Explore The Full Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

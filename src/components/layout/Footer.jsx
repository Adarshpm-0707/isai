import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ArrowUp, 
  MessageCircle, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  ArrowRight 
} from 'lucide-react';
import BrandLogo, { LotusEmblem } from '../reusable/BrandLogo';
import { BotanicalBranch, FloralOrnament } from '../reusable/FloralOrnament';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-b from-[#120B09] via-[#0E0705] to-[#0A0503] text-[#C7B5A7] border-t border-[#2C1B14] font-sans relative overflow-hidden">
      
      {/* ── 1. TOP POETIC FLOURISH & BRAND MOTTO ── */}
      <div className="pt-10 sm:pt-14 pb-8 px-4 text-center border-b border-[#241510] relative">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="flex items-center justify-center gap-3 sm:gap-6 mb-3">
            <BotanicalBranch className="hidden sm:block w-8 h-8 sm:w-12 sm:h-12" />
            <div className="flex flex-col items-center">
              <LotusEmblem className="w-8 h-8 sm:w-9 sm:h-9 mb-2 object-contain" />
              <p
                className="font-serif italic text-lg sm:text-2xl text-[#DFC18A] tracking-wide leading-snug"
                style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
              >
                Sarees for life&apos;s beautiful moments
              </p>
            </div>
            <BotanicalBranch flip={true} className="hidden sm:block w-8 h-8 sm:w-12 sm:h-12" />
          </div>

          <p className="text-xs sm:text-sm text-[#8E7B6F] font-light max-w-lg leading-relaxed mt-1">
            Bringing the authentic soul of Kuthampully, Kanchipuram, and Varanasi to graceful wardrobes across the world.
          </p>

          {/* 3 Value Highlights Strip */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-[11px] sm:text-xs text-[#DFC18A]/90">
            <span className="flex items-center gap-1.5 bg-[#180E0B] px-3.5 py-1.5 rounded-full border border-[#2F1C15]">
              <Sparkles className="w-3.5 h-3.5 text-[#DFC18A]" /> 100% Tested Handloom Purity
            </span>
            <span className="flex items-center gap-1.5 bg-[#180E0B] px-3.5 py-1.5 rounded-full border border-[#2F1C15]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#DFC18A]" /> Direct Weaver Alliance
            </span>
            <span className="flex items-center gap-1.5 bg-[#180E0B] px-3.5 py-1.5 rounded-full border border-[#2F1C15]">
              <Truck className="w-3.5 h-3.5 text-[#DFC18A]" /> Insured Pan-India Delivery
            </span>
          </div>
        </div>
      </div>

      {/* ── 2. MAIN 4-COLUMN RESPONSIVE GRID ── */}
      <div id="footer-contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 text-left">

          {/* COLUMN 1: BRAND STORY & QUICK WHATSAPP (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="inline-block">
              <BrandLogo size="md" />
            </div>

            <p className="text-xs sm:text-sm text-[#9E8B7F] leading-relaxed font-light max-w-sm">
              At Isai Tarang, every warp and weft is chosen with reverence. We preserve centuries-old handloom heritages, honoring generational weavers while crowning your special occasions.
            </p>

            {/* Direct WhatsApp Callout */}
            <div className="pt-2">
              <a
                href="https://wa.me/919048868444"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#163326] hover:bg-[#1E4535] border border-[#2A563E] text-[#FDF8F4] text-xs font-medium tracking-wide transition-all shadow-md group"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Need Styling Advice? Chat on WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#DFC18A] transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* COLUMN 2: COLLECTIONS (lg:col-span-2) */}
          <div className="lg:col-span-2 space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-px bg-[#DFC18A]" />
              <h5 className="font-serif text-xs font-bold uppercase tracking-[0.2em] text-[#DFC18A]">
                Collections
              </h5>
            </div>
            <ul className="space-y-2.5 text-xs text-[#C7B5A7]">
              <li>
                <Link to="/products?category=Kanchipuram" className="hover:text-[#DFC18A] hover:translate-x-1 inline-block transition-all">
                  Kanchipuram Silks
                </Link>
              </li>
              <li>
                <Link to="/products?category=Banarasi" className="hover:text-[#DFC18A] hover:translate-x-1 inline-block transition-all">
                  Banarasi Brocades
                </Link>
              </li>
              <li>
                <Link to="/products?category=Silk" className="hover:text-[#DFC18A] hover:translate-x-1 inline-block transition-all">
                  Pure Silk Sarees
                </Link>
              </li>
              <li>
                <Link to="/products?category=Cotton" className="hover:text-[#DFC18A] hover:translate-x-1 inline-block transition-all">
                  Kerala Cotton Weaves
                </Link>
              </li>
              <li>
                <Link to="/products?category=Georgette" className="hover:text-[#DFC18A] hover:translate-x-1 inline-block transition-all">
                  Georgette &amp; Chiffon
                </Link>
              </li>
              <li>
                <Link to="/products?category=Festive" className="hover:text-[#DFC18A] hover:translate-x-1 inline-block transition-all">
                  Festive Edit
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: INFORMATION & CUSTOMER CARE (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-px bg-[#DFC18A]" />
              <h5 className="font-serif text-xs font-bold uppercase tracking-[0.2em] text-[#DFC18A]">
                Customer Care
              </h5>
            </div>
            <ul className="space-y-2.5 text-xs text-[#C7B5A7]">
              <li>
                <Link to="/about" className="hover:text-[#DFC18A] hover:translate-x-1 inline-block transition-all">
                  Our Story &amp; Lineage
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#DFC18A] hover:translate-x-1 inline-block transition-all">
                  Contact Saree Concierge
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#DFC18A] hover:translate-x-1 inline-block transition-all">
                  Frequently Asked Questions (FAQ)
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-[#DFC18A] hover:translate-x-1 inline-block transition-all">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="hover:text-[#DFC18A] hover:translate-x-1 inline-block transition-all">
                  Terms of Service &amp; Shipping
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-[#DFC18A] hover:translate-x-1 inline-block transition-all">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: DESIGN STUDIO & CONTACT (lg:col-span-3) */}
          <div className="lg:col-span-3 space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-px bg-[#DFC18A]" />
              <h5 className="font-serif text-xs font-bold uppercase tracking-[0.2em] text-[#DFC18A]">
                Design Studio
              </h5>
            </div>

            <div className="p-4 rounded-2xl bg-[#160E0B] border border-[#2C1B14] space-y-3 text-xs">
              {/* Address */}
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#DFC18A] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[#FDF8F4] font-medium leading-snug">
                    Divyadeepam, P.O. Pallikkunnu,
                  </p>
                  <p className="text-[#A89689] font-light">
                    Kannur – 670004, Kerala, India
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#DFC18A] shrink-0" />
                <a
                  href="tel:+919048868444"
                  className="text-[#EADFC9] hover:text-[#DFC18A] font-medium transition-colors"
                >
                  +91 9048868444
                </a>
              </div>

              {/* Email */}
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#DFC18A] shrink-0" />
                <a
                  href="mailto:isaitarang9@gmail.com"
                  className="text-[#EADFC9] hover:text-[#DFC18A] font-medium transition-colors break-all"
                >
                  isaitarang9@gmail.com
                </a>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-2.5 pt-1 border-t border-[#251711]">
                <Clock className="w-4 h-4 text-[#DFC18A] shrink-0 mt-0.5" />
                <div className="text-[11px] leading-tight text-[#8E7B6F]">
                  <p className="text-[#C7B5A7] font-medium">Mon - Sat: 10:00 AM - 5:00 PM</p>
                  <p className="text-[#C86A27] mt-0.5">Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Accepted Payments Info */}
            <div className="pt-1 flex items-center justify-between text-[11px] text-[#8E7B6F] px-1">
              <span>Accepted Modes:</span>
              <span className="text-[#DFC18A] font-medium">GPay &amp; Bank Transfer</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── 3. BOTTOM COPYRIGHT & BACK TO TOP STRIP ── */}
      <div className="border-t border-[#20130E] py-5 px-4 text-xs text-[#8E7B6F] bg-[#0A0503]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          
          <p className="text-[11px]">
            © {new Date().getFullYear()} Isaitarang Private Limited. All rights reserved.
          </p>

          {/* Center Royal Crest */}
          <div className="flex items-center gap-2 text-[#DFC18A]/90 text-[11px] font-serif">
            <LotusEmblem className="w-4 h-4 opacity-80" />
            <span>Crafted with Devotion • Woven in India</span>
          </div>

          {/* Smooth Back to Top Button */}
          <button
            onClick={scrollToTop}
            type="button"
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#C7B5A7] hover:text-[#DFC18A] transition-colors cursor-pointer group"
          >
            <span>Back to Top</span>
            <div className="w-6 h-6 rounded-full bg-[#1C120E] border border-[#2D1B15] flex items-center justify-center group-hover:border-[#DFC18A]/50 transition-colors">
              <ArrowUp className="w-3 h-3 text-[#DFC18A]" />
            </div>
          </button>

        </div>
      </div>

    </footer>
  );
}
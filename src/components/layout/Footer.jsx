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
  ArrowRight,
} from 'lucide-react';
import BrandLogo, { LotusEmblem } from '../reusable/BrandLogo';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#140C0A] via-[#0E0705] to-[#080403] text-[#C7B5A7] border-t border-[#2C1B14] font-sans relative overflow-hidden">
      {/* ── TRUST PILLARS (RESPONSIVE 3-GRID) ── */}
      <div className="border-b border-[#241510] bg-[#0E0705]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            
            {/* Pillar 1 */}
            <div className="flex items-center sm:justify-center gap-3.5 p-3.5 rounded-2xl bg-[#160E0B]/70 border border-[#281812]">
              <div className="w-10 h-10 rounded-xl bg-[#221410] border border-[#DFC18A]/30 flex items-center justify-center shrink-0 text-[#DFC18A]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-semibold text-[#FDF8F4] truncate">
                  100% Tested Pure Silk
                </h4>
                <p className="text-[11px] text-[#8E7B6F] font-light truncate">
                  Certified handloom silk and authentic zari
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="flex items-center sm:justify-center gap-3.5 p-3.5 rounded-2xl bg-[#160E0B]/70 border border-[#281812]">
              <div className="w-10 h-10 rounded-xl bg-[#221410] border border-[#DFC18A]/30 flex items-center justify-center shrink-0 text-[#DFC18A]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-semibold text-[#FDF8F4] truncate">
                  Direct Weaver Alliance
                </h4>
                <p className="text-[11px] text-[#8E7B6F] font-light truncate">
                  Preserving generational weaver dignity
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="flex items-center sm:justify-center gap-3.5 p-3.5 rounded-2xl bg-[#160E0B]/70 border border-[#281812]">
              <div className="w-10 h-10 rounded-xl bg-[#221410] border border-[#DFC18A]/30 flex items-center justify-center shrink-0 text-[#DFC18A]">
                <Truck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs sm:text-sm font-semibold text-[#FDF8F4] truncate">
                  Pan India Safe Delivery
                </h4>
                <p className="text-[11px] text-[#8E7B6F] font-light truncate">
                  Insured express transit to your doorstep
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── 3. MAIN FOOTER CONTENT ── */}
      <div id="footer-contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">
        
        {/* Mobile Brand Top Strip (< lg only) */}
        <div className="lg:hidden mb-8 text-center sm:text-left space-y-4 pb-8 border-b border-[#251711]">
          <div className="inline-flex items-center justify-center sm:justify-start">
            <BrandLogo size="lg" />
          </div>
          <p className="text-xs sm:text-sm text-[#A89689] font-light leading-relaxed max-w-lg mx-auto sm:mx-0">
            Every warp and weft at Isai Tarang carries the heritage of master weavers from Kuthampully, Kanchipuram, and Varanasi.
          </p>
          <div className="pt-1">
            <a
              href="https://wa.me/919048868444"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl bg-[#163326] active:bg-[#204634] border border-[#2A563E] text-[#FDF8F4] text-xs font-semibold tracking-wide transition-all shadow-md active:scale-95"
            >
              <MessageCircle className="w-4 h-4 text-[#25D366] shrink-0" />
              <span>Need Styling Advice? Chat on WhatsApp</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#DFC18A]" />
            </a>
          </div>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">

          {/* Desktop Column 1: Brand & Narrative (hidden on mobile, block on lg) */}
          <div className="hidden lg:block lg:col-span-4 space-y-5">
            <BrandLogo size="lg" />
            <p className="text-xs sm:text-sm text-[#9E8B7F] leading-relaxed font-light pr-4">
              At Isai Tarang, every warp and weft is chosen with reverence. We preserve centuries-old handloom heritages, honoring generational master weavers while crowning your sacred occasions.
            </p>
            <div className="pt-1">
              <a
                href="https://wa.me/919048868444"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#163326] hover:bg-[#1E4535] border border-[#2A563E] text-[#FDF8F4] text-xs font-medium tracking-wide transition-all shadow-md group cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>Need Styling Advice? Chat on WhatsApp</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#DFC18A] transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Column 2: Collections Links (2 cols on desktop, half width on mobile) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h5 className="font-serif text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#DFC18A]">
              Collections
            </h5>
            <ul className="space-y-2.5 text-xs text-[#C7B5A7]">
              <li>
                <Link to="/products?category=Kanchipuram" className="hover:text-[#DFC18A] transition-colors inline-block py-0.5">
                  Kanchipuram Silks
                </Link>
              </li>
              <li>
                <Link to="/products?category=Banarasi" className="hover:text-[#DFC18A] transition-colors inline-block py-0.5">
                  Banarasi Brocades
                </Link>
              </li>
              <li>
                <Link to="/products?category=Silk" className="hover:text-[#DFC18A] transition-colors inline-block py-0.5">
                  Pure Silk Sarees
                </Link>
              </li>
              <li>
                <Link to="/products?category=Cotton" className="hover:text-[#DFC18A] transition-colors inline-block py-0.5">
                  Kerala Cotton Weaves
                </Link>
              </li>
              <li>
                <Link to="/products?category=Georgette" className="hover:text-[#DFC18A] transition-colors inline-block py-0.5">
                  Georgette and Chiffon
                </Link>
              </li>
              <li>
                <Link to="/products?category=Festive" className="hover:text-[#DFC18A] transition-colors inline-block py-0.5">
                  Festive Edit
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Lineage (2 cols on desktop, half width on mobile) */}
          <div className="lg:col-span-2 space-y-3.5">
            <h5 className="font-serif text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#DFC18A]">
              Customer Care
            </h5>
            <ul className="space-y-2.5 text-xs text-[#C7B5A7]">
              <li>
                <Link to="/about" className="hover:text-[#DFC18A] transition-colors inline-block py-0.5">
                  Our Story and Lineage
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#DFC18A] transition-colors inline-block py-0.5">
                  Saree Concierge
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#DFC18A] transition-colors inline-block py-0.5">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-[#DFC18A] transition-colors inline-block py-0.5">
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="hover:text-[#DFC18A] transition-colors inline-block py-0.5">
                  Terms and Shipping
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-[#DFC18A] transition-colors inline-block py-0.5">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Design Studio & Atelier Contact Card (4 cols on desktop, full width on mobile) */}
          <div className="sm:col-span-2 lg:col-span-4 space-y-3.5">
            <h5 className="font-serif text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] text-[#DFC18A]">
              Design Studio and Atelier
            </h5>

            <div className="p-4 sm:p-5 rounded-2xl bg-[#160E0B] border border-[#2C1B14] space-y-3.5 text-xs shadow-lg">
              {/* Address */}
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#DFC18A] shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <p className="text-[#FDF8F4] font-medium">
                    Divyadeepam, P.O. Pallikkunnu
                  </p>
                  <p className="text-[#A89689] font-light">
                    Kannur 670004, Kerala, India
                  </p>
                </div>
              </div>

              {/* Quick Contact Buttons on Mobile / Standard links on Desktop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-[#251711]">
                <a
                  href="tel:+919048868444"
                  className="flex items-center gap-2 p-2 rounded-xl bg-[#1C120E] border border-[#301F18] text-[#EADFC9] hover:text-[#DFC18A] hover:border-[#DFC18A]/40 transition-all"
                >
                  <Phone className="w-3.5 h-3.5 text-[#DFC18A] shrink-0" />
                  <span className="font-medium truncate">+91 9048868444</span>
                </a>

                <a
                  href="mailto:isaitarang9@gmail.com"
                  className="flex items-center gap-2 p-2 rounded-xl bg-[#1C120E] border border-[#301F18] text-[#EADFC9] hover:text-[#DFC18A] hover:border-[#DFC18A]/40 transition-all"
                >
                  <Mail className="w-3.5 h-3.5 text-[#DFC18A] shrink-0" />
                  <span className="font-medium truncate">Email Studio</span>
                </a>
              </div>

              {/* Operating Hours */}
              <div className="flex items-start gap-2.5 pt-2 border-t border-[#251711]">
                <Clock className="w-4 h-4 text-[#DFC18A] shrink-0 mt-0.5" />
                <div className="text-[11px] leading-tight text-[#8E7B6F]">
                  <p className="text-[#C7B5A7] font-medium">Monday to Saturday: 10:00 AM to 5:00 PM</p>
                  <p className="text-[#C86A27] mt-0.5">Sunday: Closed</p>
                </div>
              </div>
            </div>

            {/* Accepted Payments Note */}
            <div className="flex items-center justify-between text-[11px] text-[#8E7B6F] px-1 pt-1">
              <span>Accepted Modes:</span>
              <span className="text-[#DFC18A] font-medium">GPay, UPI and Bank Transfer</span>
            </div>
          </div>

        </div>
      </div>

      {/* ── 4. BOTTOM COPYRIGHT & BACK TO TOP STRIP ── */}
      <div className="border-t border-[#20130E] py-5 px-4 text-xs text-[#8E7B6F] bg-[#0A0503]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3.5 text-center sm:text-left">
          
          <p className="text-[11px]">
            © {currentYear} Isai Tarang Private Limited. All rights reserved.
          </p>

          {/* Center Heritage Tag */}
          <div className="flex items-center gap-2 text-[#DFC18A]/90 text-[11px] font-serif">
            <LotusEmblem className="w-4 h-4 opacity-80" />
            <span>Crafted with Devotion, Woven in India</span>
          </div>

          {/* Smooth Back to Top Button */}
          <button
            onClick={scrollToTop}
            type="button"
            className="inline-flex items-center gap-2 text-[11px] font-medium text-[#C7B5A7] hover:text-[#DFC18A] transition-colors cursor-pointer group active:scale-95"
            aria-label="Scroll back to top"
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

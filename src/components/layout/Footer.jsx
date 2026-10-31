import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import BrandLogo, { LotusEmblem } from '../reusable/BrandLogo';
import { BotanicalBranch } from '../reusable/FloralOrnament';

export default function Footer() {
  return (
    <footer className="bg-[#120B09] text-[#C7B5A7] border-t border-[#2B1B15] font-sans">
      {/* ── BRAND SIGNATURE FLOURISH ── */}
      <div className="pt-10 pb-6 px-4 text-center border-b border-[#241510]">
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          <BotanicalBranch className="hidden sm:block w-8 h-8 sm:w-12 sm:h-12" />
          <div className="flex flex-col items-center">
            <LotusEmblem className="w-7 h-7 sm:w-8 sm:h-8 mb-2" />
            <p
              className="font-serif italic text-base sm:text-xl text-[#DFC18A] tracking-wide"
              style={{ fontFamily: "'Playfair Display', 'Cormorant Garamond', serif" }}
            >
              Sarees for life's
              <br className="sm:hidden" /> beautiful moments
            </p>
          </div>
          <BotanicalBranch flip={true} className="hidden sm:block w-8 h-8 sm:w-12 sm:h-12" />
        </div>
      </div>

      {/* ── 3. DETAILED FOOTER LINKS & CONTACT ── */}
      <div id="footer-contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 text-left">

          {/* Brand Info */}
          <div className="col-span-2 md:col-span-1 space-y-3.5">
            <BrandLogo size="sm" showTagline={true} />
            <p className="text-xs text-[#8E7B6F] leading-relaxed font-light">
              We weave heritage, poetry, and love into every thread. Authentic pure silk & handlooms crafted for every story, every occasion, every you.
            </p>
          </div>

          {/* Collections */}
          <div className="space-y-3">
            <h5 className="font-serif text-xs font-bold uppercase tracking-wider text-[#DFC18A]">
              Collections
            </h5>
            <ul className="space-y-2 text-xs text-[#C7B5A7]">
              <li><Link to="/products?category=Kanchipuram" className="hover:text-[#DFC18A] transition-colors">Kanchipuram Sarees</Link></li>
              <li><Link to="/products?category=Banarasi" className="hover:text-[#DFC18A] transition-colors">Banarasi Brocades</Link></li>
              <li><Link to="/products?category=Silk" className="hover:text-[#DFC18A] transition-colors">Pure Silk Sarees</Link></li>
              <li><Link to="/products?category=Cotton" className="hover:text-[#DFC18A] transition-colors">Soft Cotton Weaves</Link></li>
              <li><Link to="/products?category=Georgette" className="hover:text-[#DFC18A] transition-colors">Georgette & Chiffon</Link></li>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-3">
            <h5 className="font-serif text-xs font-bold uppercase tracking-wider text-[#DFC18A]">
              Information
            </h5>
            <ul className="space-y-2 text-xs text-[#C7B5A7]">
              <li><Link to="/about" className="hover:text-[#DFC18A] transition-colors">Our Story & Craft</Link></li>
              <li><Link to="/contact" className="hover:text-[#DFC18A] transition-colors">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-[#DFC18A] transition-colors">FAQs & Help</Link></li>
              <li><Link to="/orders" className="hover:text-[#DFC18A] transition-colors">Track Your Order</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-[#DFC18A] transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-[#DFC18A] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="col-span-2 md:col-span-1 space-y-3">
            <h5 className="font-serif text-xs font-bold uppercase tracking-wider text-[#DFC18A]">
              Contact Us
            </h5>
            <ul className="space-y-2.5 text-xs text-[#C7B5A7]">
              <li className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#DFC18A] shrink-0 mt-0.5" />
                <span>Divyadeepam, P.O. Pallikkunnu, Kannur – 670004</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-[#DFC18A] shrink-0" />
                <a href="tel:+919048868444" className="hover:text-[#DFC18A] transition-colors">
                  +91 9048868444
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#DFC18A] shrink-0" />
                <a href="mailto:isaitarang9@gmail.com" className="hover:text-[#DFC18A] transition-colors">
                  isaitarang9@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2 pt-1">
                <Clock className="w-3.5 h-3.5 text-[#DFC18A] shrink-0 mt-0.5" />
                <div className="text-[11px] text-[#8E7B6F] leading-tight">
                  <p>Mon - Sat: 10AM - 5PM</p>
                  <p className="text-[#C86A27]/90 mt-0.5">Sunday: Closed</p>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* ── 4. COPYRIGHT ── */}
      <div className="border-t border-[#231510] py-6 px-4 text-center text-[10px] sm:text-xs text-[#8E7B6F]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} Isaitarang Private Limited. All rights reserved.</p>
          <p className="text-[#DFC18A]/80">Crafted with devotion • Woven in India</p>
        </div>
      </div>
    </footer>
  );
}

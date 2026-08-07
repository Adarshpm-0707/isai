import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin, Clock } from 'lucide-react';
import logoImg from '../../assets/ISAI (2).png';

export default function Footer() {
  return (
    <footer className="bg-[#E3C381]/5 text-[#E3C381] border-t border-[#E3C381]/20 pt-10 sm:pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── MOBILE VIEW DESIGN (block sm:hidden) ─── */}
        <div className="block sm:hidden space-y-6 text-center">
          {/* Centered Brand Header */}
          <div className="flex flex-col items-center space-y-2.5 pb-5 border-b border-[#E3C381]/20">
            <Link to="/" className="inline-block">
              <img src={logoImg} alt="Isai Tarang Logo" className="h-12 w-auto object-contain mx-auto" />
            </Link>
            <p className="text-[11px] text-[#D8D0C0] max-w-xs leading-relaxed font-light">
              We weave heritage and love into every thread. Authentic pure silks by master weavers.
            </p>
          </div>

          {/* Compact 2-Column Mobile Links Grid */}
          <div className="grid grid-cols-2 gap-4 text-left border-b border-[#E3C381]/20 pb-5">
            <div className="space-y-2.5">
              <h4 className="font-playfair text-xs font-bold uppercase tracking-wider text-[#E3C381]">
                Collections
              </h4>
              <ul className="space-y-1.5 text-[11px] text-[#D8D0C0]">
                <li><Link to="/products?category=Banarasi" className="hover:text-[#E3C381] transition-colors">Banarasi Silks</Link></li>
                <li><Link to="/products?category=Kanchipuram" className="hover:text-[#E3C381] transition-colors">Kanchipuram</Link></li>
                <li><Link to="/products?category=Organza" className="hover:text-[#E3C381] transition-colors">Organza</Link></li>
                <li><Link to="/products?category=Tussar" className="hover:text-[#E3C381] transition-colors">Tussar Silk</Link></li>
              </ul>
            </div>

            <div className="space-y-2.5">
              <h4 className="font-playfair text-xs font-bold uppercase tracking-wider text-[#E3C381]">
                Information
              </h4>
              <ul className="space-y-1.5 text-[11px] text-[#D8D0C0]">
                <li><Link to="/about" className="hover:text-[#E3C381] transition-colors">Our Story</Link></li>
                <li><Link to="/terms-conditions" className="hover:text-[#E3C381] transition-colors">Terms</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-[#E3C381] transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>

          {/* Compact Mobile Contact Bar */}
          <div className="space-y-2.5 pt-1">
            <h4 className="font-playfair text-xs font-bold uppercase tracking-wider text-[#E3C381]">
              Reach Out
            </h4>
            <div className="flex flex-col items-center space-y-1.5 text-[11px] text-[#D8D0C0]">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E3C381]" /> Pallikkunnu, Kannur, Kerala 670004
              </span>
              <div className="flex items-center justify-center gap-3 pt-0.5">
                <a href="tel:+919048868444" className="flex items-center gap-1 hover:text-[#E3C381] transition-colors">
                  <Phone className="w-3.5 h-3.5 text-[#E3C381]" /> +91 9048868444
                </a>
                <span className="text-[#E3C381]">•</span>
                <a href="mailto:isaitarang9@gmail.com" className="flex items-center gap-1 hover:text-[#E3C381] transition-colors">
                  <Mail className="w-3.5 h-3.5 text-[#E3C381]" /> Email Us
                </a>
              </div>
              <span className="flex items-center gap-1 text-[10px] text-[#D4AF7A] pt-1">
                <Clock className="w-3 h-3 text-[#E3C381]" /> Mon-Sat: 10AM-5PM | Sun: Closed
              </span>
            </div>
          </div>
        </div>

        {/* ─── DESKTOP VIEW DESIGN (hidden sm:grid) ─── */}
        <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3.5">
              <img src={logoImg} alt="Isai Tarang Logo" className="h-20 w-auto object-contain" />
            </Link>
            <p className="text-xs text-[#D8A55A] leading-relaxed font-light">
              We weave heritage and love into every thread. Discover sarees made from authentic pure silks, meticulously crafted by master weavers.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-playfair text-sm font-bold uppercase tracking-wider text-[#F6D18A]">
              Shop Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#D8A55A]">
              <li><Link to="/products?category=Banarasi" className="hover:text-[#F6D18A] transition-colors">Banarasi Silks</Link></li>
              <li><Link to="/products?category=Kanchipuram" className="hover:text-[#F6D18A] transition-colors">Kanchipuram Silks</Link></li>
              <li><Link to="/products?category=Organza" className="hover:text-[#F6D18A] transition-colors">Organza Pastels</Link></li>
              <li><Link to="/products?category=Tussar" className="hover:text-[#F6D18A] transition-colors">Hand-Painted Tussar</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="font-playfair text-sm font-bold uppercase tracking-wider text-[#F6D18A]">
              Information
            </h4>
            <ul className="space-y-2 text-xs text-[#D8A55A]">
              <li><Link to="/about" className="hover:text-[#F6D18A] transition-colors">Our Story</Link></li>
              <li><Link to="/terms-conditions" className="hover:text-[#F6D18A] transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-[#F6D18A] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-playfair text-sm font-bold uppercase tracking-wider text-[#F6D18A]">
              Contact Us
            </h4>
            <ul className="space-y-3 text-xs text-[#D8A55A]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F6D18A] flex-shrink-0 mt-0.5" />
                <span>Pallikkunnu, Kannur, Kerala 670004</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F6D18A] flex-shrink-0" />
                <a href="tel:+919048868444" className="hover:text-[#F6D18A] transition-colors">+91 9048868444</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F6D18A] flex-shrink-0" />
                <a href="mailto:isaitarang9@gmail.com" className="hover:text-[#F6D18A] transition-colors">isaitarang9@gmail.com</a>
              </li>
              <li className="flex items-start gap-2 pt-1 border-t border-[#F6D18A]/20">
                <Clock className="w-4 h-4 text-[#F6D18A] flex-shrink-0 mt-0.5" />
                <span>Mon - Sat: 10AM - 5PM<br /><span className="opacity-75">Sunday: Closed</span></span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright Footer */}
        <div className="border-t border-[#F6D18A]/30 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] sm:text-xs text-[#D8A55A] text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} Isai Tarang Private Limited. All rights reserved.</p>
          <p className="flex items-center justify-center md:justify-start gap-1">
            Designed with passion <Compass className="w-3 h-3 text-[#F6D18A]" /> Woven in India
          </p>
        </div>

      </div>
    </footer>
  );
}

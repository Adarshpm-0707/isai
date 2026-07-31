import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin } from 'lucide-react';
import logoImg from '../../assets/ISAI (2).png';

export default function Footer() {
  return (
    <footer className="bg-[#0d0202] text-[#efcf8b] border-t border-[#f45d04]/30 pt-10 sm:pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ─── MOBILE VIEW DESIGN (block sm:hidden) ─── */}
        <div className="block sm:hidden space-y-8 text-center">
          {/* Centered Brand Header */}
          <div className="flex flex-col items-center space-y-3 pb-6 border-b border-[#f45d04]/20">
            <Link to="/" className="inline-block">
              <img src={logoImg} alt="Isai Tarang Logo" className="h-16 w-auto object-contain mx-auto" />
            </Link>
            <p className="text-[11px] text-[#efcf8b]/80 max-w-xs leading-relaxed font-light">
              We weave heritage and love into every thread. Authentic pure silks by master weavers.
            </p>
          </div>

          {/* Compact 2-Column Mobile Links Grid */}
          <div className="grid grid-cols-2 gap-6 text-left border-b border-[#f45d04]/20 pb-6">
            <div className="space-y-3">
              <h4 className="font-playfair text-xs font-bold uppercase tracking-wider text-[#f45d04]">
                Collections
              </h4>
              <ul className="space-y-2 text-[11px] text-[#efcf8b]/80">
                <li><Link to="/products?category=Banarasi" className="hover:text-[#f45d04] transition-colors">Banarasi Silks</Link></li>
                <li><Link to="/products?category=Kanchipuram" className="hover:text-[#f45d04] transition-colors">Kanchipuram</Link></li>
                <li><Link to="/products?category=Organza" className="hover:text-[#f45d04] transition-colors">Organza</Link></li>
                <li><Link to="/products?category=Tussar" className="hover:text-[#f45d04] transition-colors">Tussar Silk</Link></li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-playfair text-xs font-bold uppercase tracking-wider text-[#f45d04]">
                Information
              </h4>
              <ul className="space-y-2 text-[11px] text-[#efcf8b]/80">
                <li><Link to="/about" className="hover:text-[#f45d04] transition-colors">Our Story</Link></li>
                <li><a href="#" className="hover:text-[#f45d04] transition-colors">Shipping</a></li>
                <li><a href="#" className="hover:text-[#f45d04] transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-[#f45d04] transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>

          {/* Compact Mobile Contact Bar */}
          <div className="space-y-3 pt-2">
            <h4 className="font-playfair text-xs font-bold uppercase tracking-wider text-[#f45d04]">
              Reach Out
            </h4>
            <div className="flex flex-col items-center space-y-2 text-[11px] text-[#efcf8b]/80">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#f45d04]" /> Varanasi & Kanchipuram, India
              </span>
              <div className="flex items-center justify-center gap-4 pt-1">
                <a href="tel:+915422440987" className="flex items-center gap-1 hover:text-[#f45d04] transition-colors">
                  <Phone className="w-3.5 h-3.5 text-[#f45d04]" /> Call Us
                </a>
                <span className="text-[#f45d04]">•</span>
                <a href="mailto:heritage@isaitarang.com" className="flex items-center gap-1 hover:text-[#f45d04] transition-colors">
                  <Mail className="w-3.5 h-3.5 text-[#f45d04]" /> Email Us
                </a>
              </div>
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
            <p className="text-xs text-[#efcf8b]/80 leading-relaxed font-light">
              We weave heritage and love into every thread. Discover sarees made from authentic pure silks, meticulously crafted by master weavers.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-playfair text-sm font-bold uppercase tracking-wider text-[#f45d04]">
              Shop Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#efcf8b]/80">
              <li><Link to="/products?category=Banarasi" className="hover:text-[#f45d04] transition-colors">Banarasi Silks</Link></li>
              <li><Link to="/products?category=Kanchipuram" className="hover:text-[#f45d04] transition-colors">Kanchipuram Silks</Link></li>
              <li><Link to="/products?category=Organza" className="hover:text-[#f45d04] transition-colors">Organza Pastels</Link></li>
              <li><Link to="/products?category=Tussar" className="hover:text-[#f45d04] transition-colors">Hand-Painted Tussar</Link></li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="font-playfair text-sm font-bold uppercase tracking-wider text-[#f45d04]">
              Information
            </h4>
            <ul className="space-y-2 text-xs text-[#efcf8b]/80">
              <li><Link to="/about" className="hover:text-[#f45d04] transition-colors">Our Story</Link></li>
              <li><a href="#" className="hover:text-[#f45d04] transition-colors">Shipping & Returns</a></li>
              <li><a href="#" className="hover:text-[#f45d04] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[#f45d04] transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-playfair text-sm font-bold uppercase tracking-wider text-[#f45d04]">
              Contact Us
            </h4>
            <ul className="space-y-3 text-xs text-[#efcf8b]/80">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#f45d04] flex-shrink-0 mt-0.5" />
                <span>12, Heritage Lane, Silk Quarter, Varanasi, UP, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#f45d04] flex-shrink-0" />
                <span>+91 (542) 244-0987</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#f45d04] flex-shrink-0" />
                <span>heritage@isaitarang.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright Footer */}
        <div className="border-t border-white/10 mt-8 sm:mt-12 pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-3 text-[10px] sm:text-xs text-[#efcf8b]/60 text-center md:text-left">
          <p>&copy; {new Date().getFullYear()} Isai Tarang Private Limited. All rights reserved.</p>
          <p className="flex items-center justify-center md:justify-start gap-1">
            Designed with passion <Compass className="w-3 h-3 text-[#f45d04]" /> Woven in India
          </p>
        </div>

      </div>
    </footer>
  );
}

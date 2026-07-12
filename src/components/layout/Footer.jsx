import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Phone, MapPin } from 'lucide-react';
import logoImg from '../../assets/ISAI.png';

export default function Footer() {
  return (
    <footer className="bg-maroon-dark bg-[#4D0A11] text-ivory border-t border-gold/20 pt-16 pb-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-3.5">
            <img src={logoImg} alt="Isai Tarang Logo" className="h-12 w-auto object-contain" />
            <div className="flex flex-col">
              <span className="font-playfair text-xl font-bold tracking-widest text-gold leading-none">
                ISAI TARANG
              </span>
              <span className="font-sans text-[9px] tracking-[0.25em] text-ivory/80 uppercase mt-0.5">
                Handcrafted Sarees
              </span>
            </div>
          </Link>
          <p className="text-xs text-ivory/60 leading-relaxed font-light">
            We weave heritage and love into every thread. Discover sarees made from authentic pure silks, meticulously crafted by master weavers.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-4">
          <h4 className="font-playfair text-sm font-bold uppercase tracking-wider text-gold">
            Shop Collections
          </h4>
          <ul className="space-y-2 text-xs text-ivory/70">
            <li>
              <Link to="/products?category=Banarasi" className="hover:text-gold transition-colors">Banarasi Silks</Link>
            </li>
            <li>
              <Link to="/products?category=Kanchipuram" className="hover:text-gold transition-colors">Kanchipuram Silks</Link>
            </li>
            <li>
              <Link to="/products?category=Organza" className="hover:text-gold transition-colors">Organza Pastels</Link>
            </li>
            <li>
              <Link to="/products?category=Tussar" className="hover:text-gold transition-colors">Hand-Painted Tussar</Link>
            </li>
          </ul>
        </div>

        {/* Company Links */}
        <div className="space-y-4">
          <h4 className="font-playfair text-sm font-bold uppercase tracking-wider text-gold">
            Information
          </h4>
          <ul className="space-y-2 text-xs text-ivory/70">
            <li>
              <Link to="/about" className="hover:text-gold transition-colors">Our Story</Link>
            </li>
            <li>
              <a href="#" className="hover:text-gold transition-colors">Shipping & Returns</a>
            </li>
            <li>
              <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
            </li>
            <li>
              <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4">
          <h4 className="font-playfair text-sm font-bold uppercase tracking-wider text-gold">
            Contact Us
          </h4>
          <ul className="space-y-3 text-xs text-ivory/70">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" />
              <span>12, Heritage Lane, Silk Quarter, Varanasi, UP, India</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gold flex-shrink-0" />
              <span>+91 (542) 244-0987</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-gold flex-shrink-0" />
              <span>heritage@isaitarang.com</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-gold/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-ivory/40 text-center md:text-left">
        <p>&copy; {new Date().getFullYear()} Isai Tarang Private Limited. All rights reserved.</p>
        <p className="flex items-center justify-center md:justify-start gap-1">
          Designed with passion <Compass className="w-3 h-3 text-gold" /> Woven in India
        </p>
      </div>
    </footer>
  );
}

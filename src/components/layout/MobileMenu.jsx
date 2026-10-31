import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBag, 
  LogIn, 
  LogOut, 
  Home, 
  Info, 
  Phone, 
  X, 
  Heart, 
  User, 
  MessageCircle, 
  ArrowRight,
  ShieldCheck,
  MapPin
} from 'lucide-react';
import BrandLogo, { LotusEmblem } from '../reusable/BrandLogo';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home, subtitle: 'Welcome to Isai Tarang' },
  { to: '/products', label: 'Shop Sarees', icon: ShoppingBag, subtitle: 'Pure Silks & Handlooms' },
  { to: '/about', label: 'Our Story & Craft', icon: Info, subtitle: 'Heritage from Kuthampully' },
  { to: '/contact', label: 'Contact Us', icon: Phone, subtitle: 'Concierge & Studio' },
];

export default function MobileMenu({ isOpen, onClose, user, role, cartCount, logout }) {
  const location = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" aria-modal="true" role="dialog">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="absolute top-0 left-0 h-full w-[85vw] max-w-[340px] bg-gradient-to-b from-[#180E0B] via-[#140C0A] to-[#100806] border-r border-[#35221B] flex flex-col shadow-[0_20px_60px_rgba(0,0,0,0.9)] z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#2C1B14] bg-[#120B09]/80">
              <BrandLogo size="sm" showTagline={true} />
              <button
                onClick={onClose}
                type="button"
                className="w-9 h-9 rounded-xl bg-[#1C120E] border border-[#301F18] flex items-center justify-center text-[#C7B5A7] hover:text-[#DFC18A] transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Nav links */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-2">
              <div className="px-3 pt-2 pb-1 flex items-center justify-between">
                <span className="text-[10px] font-semibold tracking-[0.28em] uppercase text-[#DFC18A]">
                  Navigation
                </span>
                <LotusEmblem className="w-3.5 h-3.5 opacity-70" />
              </div>

              {NAV_LINKS.map(({ to, label, icon: Icon, subtitle }) => {
                const isActive = to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(to);

                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={onClose}
                    className={`flex items-center justify-between p-3.5 rounded-2xl transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-[#2A1810] to-[#1E120D] border border-[#DFC18A]/50 shadow-[0_4px_16px_rgba(0,0,0,0.4)]'
                        : 'hover:bg-[#1C120E] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${
                          isActive
                            ? 'bg-[#DFC18A] text-[#140C0A] border-[#DFC18A]'
                            : 'bg-[#180F0C] text-[#DFC18A] border-[#2C1B14]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <span
                          className={`block text-xs uppercase font-semibold tracking-wider truncate ${
                            isActive ? 'text-[#DFC18A]' : 'text-white'
                          }`}
                        >
                          {label}
                        </span>
                        <span className="block text-[10px] text-[#A69385] font-light truncate mt-0.5">
                          {subtitle}
                        </span>
                      </div>
                    </div>

                    <ArrowRight
                      className={`w-3.5 h-3.5 shrink-0 transition-transform ${
                        isActive ? 'text-[#DFC18A] translate-x-0.5' : 'text-[#5E4C41]'
                      }`}
                    />
                  </Link>
                );
              })}

              {/* Quick WhatsApp Support Card */}
              <div className="pt-3">
                <a
                  href="https://wa.me/919048868444"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3.5 rounded-2xl bg-[#163326]/40 border border-[#2A563E]/60 text-[#FDF8F4] hover:bg-[#163326]/60 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#163326] flex items-center justify-center text-[#DFC18A] shrink-0 border border-[#2A563E]">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#FDF8F4]">WhatsApp Concierge</p>
                      <p className="text-[10px] text-[#A8BEB2] font-light">Instant saree assistance</p>
                    </div>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-[#DFC18A] tracking-wider">Chat</span>
                </a>
              </div>
            </nav>

            {/* Bottom Actions / User State */}
            <div className="p-4 border-t border-[#2C1B14] space-y-3 bg-[#110A08]">
              {user ? (
                <div className="space-y-2.5">
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#180E0B] border border-[#2B1B15]">
                    <div className="w-7 h-7 rounded-full bg-[#DFC18A]/20 flex items-center justify-center text-[#DFC18A] shrink-0">
                      <User className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs text-[#EADFC9] truncate font-medium">{user.email}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/profile"
                      onClick={onClose}
                      className="flex items-center justify-center py-2.5 rounded-xl border border-[#35221B] text-xs font-medium text-[#C7B5A7] hover:bg-[#1E130F] hover:text-[#FDF8F4] transition-all"
                    >
                      <span>My Orders</span>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        onClose();
                      }}
                      type="button"
                      className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-[#35221B] text-xs font-medium text-[#D4855A] hover:bg-[#1E130F] transition-all cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#C86A27] to-[#DC7B34] text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:brightness-110 transition-all"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Customer Sign In</span>
                </Link>
              )}

              {/* Direct Studio Address Micro Line */}
              <div className="flex items-center justify-center gap-1.5 text-[9px] text-[#7A695E] pt-1 text-center">
                <MapPin className="w-2.5 h-2.5 text-[#DFC18A]" />
                <span>Pallikkunnu, Kannur, Kerala • 10AM - 5PM</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
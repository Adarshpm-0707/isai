import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, LogIn, LogOut, Clipboard, Settings, Home, BookOpen, Info, Phone, X, Heart } from 'lucide-react';
import BrandLogo from '../reusable/BrandLogo';

const NAV_LINKS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/products', label: 'Shop', icon: ShoppingBag },
  { to: '/about', label: 'About', icon: Info },
  { to: '/contact', label: 'Contact', icon: Phone },
];

export default function MobileMenu({ isOpen, onClose, user, role, cartCount, logout }) {
  const location = useLocation();

  const handleAnchorClick = (e, targetHash) => {
    e.preventDefault();
    onClose();
    setTimeout(() => {
      const el = document.querySelector(targetHash);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.location.hash = targetHash;
      }
    }, 150);
  };

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
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 280 }}
            className="absolute top-0 left-0 h-full w-[85vw] max-w-[340px] bg-[#160E0B] border-r border-[#35221B] flex flex-col shadow-2xl z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#301F18]">
              <BrandLogo size="sm" showTagline={true} />
              <button
                onClick={onClose}
                type="button"
                className="p-1.5 rounded-full text-[#C7B5A7] hover:text-[#FDF8F4] hover:bg-[#1E130F] transition-colors"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Nav links - ONLY the Laptop View Navbar Items */}
            <nav className="flex-1 overflow-y-auto p-5 space-y-1.5">
              <span className="text-[10px] font-semibold tracking-[0.25em] uppercase text-[#8E7B6F] block mb-3 px-3">
                Navigation
              </span>

              {NAV_LINKS.map(({ to, label, icon: Icon, isAnchor }) => {
                if (isAnchor) {
                  return (
                    <a
                      key={to}
                      href={to}
                      onClick={(e) => handleAnchorClick(e, to)}
                      className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs uppercase tracking-wider font-medium text-[#C7B5A7] hover:bg-[#1E130F]/60 hover:text-[#FDF8F4] transition-all cursor-pointer"
                    >
                      <Icon className="w-4 h-4 text-[#8E7B6F]" />
                      <span>{label}</span>
                    </a>
                  );
                }

                const isActive = to === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(to);

                return (
                  <Link
                    key={to}
                    to={to}
                    onClick={onClose}
                    className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs uppercase tracking-wider font-medium transition-all ${
                      isActive
                        ? 'bg-[#1E130F] text-[#DFC18A] border border-[#DFC18A]/30 font-semibold shadow-inner'
                        : 'text-[#C7B5A7] hover:bg-[#1E130F]/60 hover:text-[#FDF8F4]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#DFC18A]' : 'text-[#8E7B6F]'}`} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Bottom Actions */}
            <div className="p-5 border-t border-[#301F18] space-y-3 bg-[#130B09]">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-[#C7B5A7] px-1">
                    <span className="truncate max-w-[180px]">{user.email}</span>
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    type="button"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-[#35221B] text-xs font-semibold text-[#C7B5A7] hover:bg-[#1E130F] hover:text-[#FDF8F4] transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-[#C86A27] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#DB7B32] transition-colors shadow-lg"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

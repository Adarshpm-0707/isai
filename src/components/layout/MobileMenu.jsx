import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, LogIn, LogOut, Clipboard, Settings } from 'lucide-react';
import logoImg from '../../assets/ISAI (2).png';

export default function MobileMenu({ isOpen, onClose, user, role, cartCount, logout }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="absolute top-0 right-0 w-80 max-w-xs h-full bg-[#120404] border-l border-[#f45d04]/30 shadow-2xl flex flex-col p-6 space-y-6 text-[#efcf8b]"
          >
            {/* Drawer Header */}
            <div className="flex justify-between items-center pb-4 border-b border-[#f45d04]/20">
              <div className="flex items-center gap-2">
                <img src={logoImg} alt="Isai Tarang Logo" className="h-8 w-auto object-contain" />
                <span className="font-playfair text-lg font-bold text-[#efcf8b] tracking-widest uppercase">
                  Isai Tarang
                </span>
              </div>
              <button
                onClick={onClose}
                type="button"
                className="text-[#efcf8b] hover:text-[#f45d04] transition-colors p-1"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Navigation links */}
            <nav className="flex flex-col space-y-5 font-sans font-medium uppercase tracking-wider text-xs text-[#efcf8b]">
              <Link to="/" onClick={onClose} className="hover:text-[#f45d04] transition-colors py-1">
                Home
              </Link>
              <Link to="/products" onClick={onClose} className="hover:text-[#f45d04] transition-colors py-1">
                Collection
              </Link>
              <Link to="/about" onClick={onClose} className="hover:text-[#f45d04] transition-colors py-1">
                Our Story
              </Link>

              {user && (
                <>
                  <Link
                    to="/orders"
                    onClick={onClose}
                    className="hover:text-[#f45d04] transition-colors py-1 flex items-center gap-2"
                  >
                    <Clipboard className="w-4 h-4" /> My Orders
                  </Link>
                  {(role === 'admin' || role === 'superadmin') && (
                    <Link
                      to="/admin"
                      onClick={onClose}
                      className="hover:text-[#f45d04] transition-colors py-1 flex items-center gap-2 text-[#f45d04] font-bold"
                    >
                      <Settings className="w-4 h-4" /> Admin Panel
                    </Link>
                  )}
                </>
              )}
            </nav>

            {/* Action buttons */}
            <div className="flex flex-col space-y-4 pt-6 border-t border-[#f45d04]/20 mt-auto">
              <Link
                to="/cart"
                onClick={onClose}
                className="relative flex items-center justify-center gap-2 bg-[#f45d04] text-[#efcf8b] py-3 text-xs font-semibold uppercase tracking-wider hover:bg-[#c44900] transition-all rounded-full shadow-md"
              >
                <ShoppingBag className="w-4 h-4" />
                Cart ({cartCount})
              </Link>

              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="flex items-center justify-center gap-2 bg-transparent text-[#efcf8b] border border-[#f45d04] py-3 text-xs font-semibold uppercase tracking-wider hover:bg-[#f45d04] hover:text-white transition-all rounded-full"
                >
                  <LogOut className="w-4 h-4" /> Log Out
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 bg-[#f45d04] text-[#efcf8b] py-3 text-xs font-semibold uppercase tracking-wider hover:bg-[#c44900] transition-all rounded-full shadow-md"
                >
                  <LogIn className="w-4 h-4" /> Sign In
                </Link>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

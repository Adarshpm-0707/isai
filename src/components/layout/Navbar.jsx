import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, User, LogOut, Settings } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import MobileMenu from './MobileMenu';
import logoImg from '../../assets/ISAI (2).png';
import navbarBg from '../../assets/navbarbg.png';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header
        className="sticky top-0 z-40 bg-cover bg-center bg-no-repeat border-b border-[#F6D18A]/40 shadow-xl transition-all duration-300"
        style={{ backgroundImage: `url(${navbarBg})` }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-14 sm:h-16 md:h-18">

            {/* Left Section: Mobile Menu Toggle / Desktop Nav Links */}
            <div className="flex items-center">
              {/* ── Animated Hamburger → X button ── */}
              <button
                onClick={() => setMobileOpen(o => !o)}
                type="button"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                className="lg:hidden relative flex flex-col items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl transition-colors duration-200 hover:bg-white/10 shrink-0"
                style={{ border: '1px solid rgba(212,175,122,0.2)' }}
              >
                {/* Top bar */}
                <motion.span
                  animate={mobileOpen
                    ? { rotate: 45, y: 6, width: '16px' }
                    : { rotate: 0,  y: 0, width: '16px' }
                  }
                  transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                  className="block h-[1.8px] rounded-full absolute"
                  style={{ background: '#E3C381', top: '12px' }}
                />
                {/* Middle bar */}
                <motion.span
                  animate={mobileOpen
                    ? { opacity: 0, scaleX: 0 }
                    : { opacity: 1, scaleX: 1 }
                  }
                  transition={{ duration: 0.2 }}
                  className="block h-[1.8px] rounded-full"
                  style={{ background: '#E3C381', width: '12px' }}
                />
                {/* Bottom bar */}
                <motion.span
                  animate={mobileOpen
                    ? { rotate: -45, y: -6, width: '16px' }
                    : { rotate: 0,   y: 0,  width: '16px' }
                  }
                  transition={{ type: 'spring', damping: 22, stiffness: 300 }}
                  className="block h-[1.8px] rounded-full absolute"
                  style={{ background: '#E3C381', bottom: '12px' }}
                />
              </button>

              <nav className="hidden lg:flex space-x-8 font-sans text-xs font-bold uppercase tracking-wider text-[#E3C381]">
                <Link to="/" className="hover:text-[#F0DDB0] transition-colors relative py-1 group">
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#E3C381] transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link to="/products" className="hover:text-[#F0DDB0] transition-colors relative py-1 group">
                  Collection
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#E3C381] transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link to="/about" className="hover:text-[#F0DDB0] transition-colors relative py-1 group">
                  Our Story
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#E3C381] transition-all duration-300 group-hover:w-full" />
                </Link>
              </nav>
            </div>

            {/* Centralized Logo (Compact & Sleek) */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
              <Link to="/" className="flex items-center p-1">
                <img src={logoImg} alt="Isai Tarang Logo" className="h-8 xs:h-9 sm:h-11 md:h-12 lg:h-14 w-auto object-contain transition-transform duration-300 hover:scale-105 filter drop-shadow-sm" />
              </Link>
            </div>

            {/* Right Icons / Auth */}
            <div className="flex items-center space-x-1.5 sm:space-x-4">
              {user && (role === 'admin' || role === 'superadmin') && (
                <Link
                  to="/admin"
                  className="hidden lg:flex items-center gap-1.5 text-[#E3C381] hover:text-[#F0DDB0] font-sans text-xs font-bold uppercase tracking-wider transition-colors"
                  title="Admin Dashboard"
                >
                  <Settings className="w-4 h-4 text-[#E3C381]" />
                  Admin
                </Link>
              )}

              {user && (
                <Link
                  to="/orders"
                  className="hidden lg:flex items-center gap-1 text-[#E3C381] hover:text-[#F0DDB0] font-sans text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  My Orders
                </Link>
              )}

              <Link
                to="/cart"
                className="relative p-2 text-[#E3C381] hover:text-[#F0DDB0] transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[2]" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-4 h-4 sm:w-5 sm:h-5 bg-[#E3C381] text-[#0F2318] font-sans font-bold text-[9px] sm:text-[10px] rounded-full flex items-center justify-center border border-[#0F2318] shadow">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="hidden lg:block">
                {user ? (
                  <div className="flex items-center gap-4">
                    <span className="font-sans text-xs text-[#E3C381] font-bold max-w-[120px] truncate" title={user.email}>
                      {user.email.split('@')[0]}
                    </span>
                    <button
                      onClick={logout}
                      type="button"
                      className="p-1 text-[#E3C381] hover:text-[#F0DDB0] transition-colors"
                      title="Log Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-1 bg-[#E3C381] text-[#0F2318] hover:bg-[#F0DDB0] font-sans text-xs font-bold uppercase tracking-wider transition-all px-4 py-2 rounded-full shadow-md border border-[#E3C381]"
                  >
                    <User className="w-3.5 h-3.5" />
                    Sign In
                  </Link>
                )}
              </div>
            </div>

          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        user={user}
        role={role}
        cartCount={cartCount}
        logout={logout}
      />
    </>
  );
}





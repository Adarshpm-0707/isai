import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, User, Settings, X } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import useWishlist from '../../hooks/useWishlist';
import BrandLogo from '../reusable/BrandLogo';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist ? useWishlist() : { wishlistCount: 0 };
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* ── MAIN HEADER NAVBAR (CENTRALIZED LOGO) ── */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 font-sans ${
          scrolled
            ? 'bg-[#120B09]/98 backdrop-blur-xl border-b border-[#2C1B14] shadow-[0_6px_28px_rgba(0,0,0,0.7)] py-1.5'
            : 'bg-[#140C0A]/95 backdrop-blur-md border-b border-[#261610] py-2 sm:py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center justify-between h-[70px] sm:h-20 lg:h-24">

            {/* ── LEFT: Mobile Hamburger OR Desktop Navigation Links ── */}
            <div className="flex items-center z-10">
              {/* Mobile Hamburger Button */}
              <button
                onClick={() => setMobileOpen((o) => !o)}
                type="button"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                className="lg:hidden w-10 h-10 rounded-xl bg-[#1C120E] border border-[#301F18] flex items-center justify-center text-white hover:text-[#DFC18A] transition-all cursor-pointer shadow-sm"
              >
                <div className="w-4 flex flex-col items-center gap-1">
                  <span className={`block h-[1.8px] bg-current transition-all duration-300 ${mobileOpen ? 'w-4 rotate-45 translate-y-[5.5px]' : 'w-4'}`} />
                  <span className={`block h-[1.8px] bg-current transition-all duration-200 ${mobileOpen ? 'opacity-0' : 'w-3.5'}`} />
                  <span className={`block h-[1.8px] bg-current transition-all duration-300 ${mobileOpen ? 'w-4 -rotate-45 -translate-y-[5.5px]' : 'w-4'}`} />
                </div>
              </button>

              {/* Desktop Nav Links (Clean, 100% visible, high-contrast white text) */}
              <nav className="hidden lg:flex items-center gap-7 xl:gap-8 text-xs sm:text-[13px] uppercase tracking-[0.20em] font-medium">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `relative py-1.5 transition-colors duration-200 ${
                        isActive
                          ? 'text-[#DFC18A] font-semibold'
                          : 'text-white hover:text-[#DFC18A]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="drop-shadow-sm">{item.label}</span>
                        {isActive && (
                          <motion.span
                            layoutId="activeNavUnderline"
                            className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#DFC18A] shadow-[0_0_10px_rgba(223,193,138,0.8)]"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* ── CENTER: MATHEMATICALLY CENTRALIZED BRAND LOGO (ENLARGED) ── */}
            <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 pointer-events-auto flex items-center justify-center z-20">
              <BrandLogo
                to="/"
                imgClassName="h-[52px] sm:h-16 lg:h-20 xl:h-[88px]"
              />
            </div>

            {/* ── RIGHT: Search, Wishlist, Account, Cart ── */}
            <div className="flex items-center gap-2 sm:gap-3 z-10">

              {/* Desktop Pill Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="hidden xl:flex items-center relative w-52 2xl:w-60"
              >
                <Search className="w-3.5 h-3.5 text-[#A89689] absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search sarees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1C120E] text-white placeholder-[#8E7B6F] text-xs pl-9 pr-4 py-2 rounded-full border border-[#35221B] focus:border-[#DFC18A] focus:outline-none transition-all shadow-inner"
                />
              </form>

              {/* Search Toggle Icon (for Mobile & Tablet) */}
              <button
                type="button"
                onClick={() => setSearchOpen((s) => !s)}
                className="xl:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1C120E] border border-[#2F1C15] flex items-center justify-center text-white hover:text-[#DFC18A] hover:border-[#DFC18A]/40 transition-all cursor-pointer"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>

              {/* Wishlist Link (Tablet & Desktop, accessible in mobile drawer) */}
              <Link
                to="/cart"
                className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1C120E] border border-[#2F1C15] items-center justify-center text-white hover:text-[#DFC18A] hover:border-[#DFC18A]/40 transition-all cursor-pointer relative"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[#C86A27] text-white text-[9px] font-bold flex items-center justify-center leading-none shadow">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* User Profile (Tablet & Desktop, accessible in mobile drawer) */}
              <div className="hidden sm:block relative">
                {user ? (
                  <Link
                    to="/profile"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1C120E] border border-[#2F1C15] flex items-center justify-center text-[#DFC18A] hover:border-[#DFC18A]/50 transition-all"
                    title="Account Profile"
                  >
                    <User className="w-4 h-4" />
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1C120E] border border-[#2F1C15] flex items-center justify-center text-white hover:text-[#DFC18A] hover:border-[#DFC18A]/40 transition-all"
                    title="Sign In"
                  >
                    <User className="w-4 h-4" />
                  </Link>
                )}
              </div>

              {/* Shopping Bag / Cart */}
              <Link
                to="/cart"
                className="flex items-center gap-2 px-3 sm:px-3.5 py-2 rounded-xl bg-[#1C120E] hover:bg-[#251813] border border-[#35221B] hover:border-[#DFC18A]/50 text-white transition-all cursor-pointer shadow-md group"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-4 h-4 text-[#DFC18A] transition-transform group-hover:scale-110" />
                <span className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-[#C86A27] text-white text-[10px] font-bold flex items-center justify-center leading-none shadow-sm">
                  {cartCount || 0}
                </span>
              </Link>

              {/* Admin Badge (Desktop) */}
              {user && (role === 'admin' || role === 'superadmin') && (
                <Link
                  to="/admin"
                  className="hidden md:flex items-center gap-1.5 text-xs text-[#DFC18A] border border-[#DFC18A]/30 bg-[#1F1410] px-3 py-1.5 rounded-xl hover:bg-[#DFC18A]/10 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span className="font-semibold text-[11px] uppercase tracking-wider">Admin</span>
                </Link>
              )}

            </div>

          </div>
        </div>

        {/* ── MOBILE SEARCH SLIDE-DOWN BAR ── */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="xl:hidden border-t border-[#2C1B14] bg-[#170E0B] px-4 py-3 overflow-hidden shadow-2xl"
            >
              <form onSubmit={handleSearchSubmit} className="relative flex items-center mb-2">
                <Search className="w-4 h-4 text-[#8E7B6F] absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search pure silk, banarasi, kanchipuram..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-[#110A08] text-white placeholder-[#7E6D62] text-xs pl-10 pr-9 py-2.5 rounded-xl border border-[#35221B] focus:border-[#DFC18A] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-3 text-[#8E7B6F] hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Filter Tags */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
                <span className="text-[10px] text-[#A89689] uppercase tracking-wider shrink-0 font-medium">Trending:</span>
                {['Kanchipuram', 'Banarasi', 'Kerala Cotton', 'Festive'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSearchQuery(tag);
                      navigate(`/products?search=${encodeURIComponent(tag)}`);
                      setSearchOpen(false);
                    }}
                    className="text-[10px] text-[#DFC18A] bg-[#1E130F] border border-[#35221B] px-2.5 py-0.5 rounded-full shrink-0 hover:bg-[#DFC18A]/10 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── MOBILE DRAWER MENU ── */}
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
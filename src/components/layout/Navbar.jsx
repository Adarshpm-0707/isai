import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, User, LogOut, Settings, X } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import BrandLogo from '../reusable/BrandLogo';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* ── 1. TOP ANNOUNCEMENT BAR ── */}
   
      {/* ── 2. MAIN HEADER ── */}
      <header className="sticky top-0 z-40 bg-[#160E0B]/95 backdrop-blur-xl border-b border-[#301F18] transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">

            {/* Mobile: Hamburger Menu Button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileOpen((o) => !o)}
                type="button"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                className="p-2 -ml-2 text-[#DFC18A] hover:text-[#FDF8F4] transition-colors"
              >
                <div className="w-5 flex flex-col items-start gap-1">
                  <span className={`block h-[1.8px] bg-current transition-all ${mobileOpen ? 'w-5 rotate-45 translate-y-1.5' : 'w-5'}`} />
                  <span className={`block h-[1.8px] bg-current transition-all ${mobileOpen ? 'opacity-0' : 'w-3.5'}`} />
                  <span className={`block h-[1.8px] bg-current transition-all ${mobileOpen ? 'w-5 -rotate-45 -translate-y-1.5' : 'w-4'}`} />
                </div>
              </button>
            </div>

            {/* Brand Logo (Left on Desktop, Center on Mobile) */}
            <div className="flex-1 lg:flex-initial flex justify-center lg:justify-start">
              <BrandLogo size="md" />
            </div>

            {/* Desktop Center Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7 text-xs tracking-wider uppercase font-medium text-[#C7B5A7]">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `relative py-1 transition-colors hover:text-[#DFC18A] ${
                    isActive ? 'text-[#DFC18A] font-semibold' : ''
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Home</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-[#DFC18A]" />
                    )}
                  </>
                )}
              </NavLink>

              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `relative py-1 transition-colors hover:text-[#DFC18A] ${
                    isActive ? 'text-[#DFC18A] font-semibold' : ''
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Shop</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-[#DFC18A]" />
                    )}
                  </>
                )}
              </NavLink>

             

              <NavLink
                to="/about"
                className={({ isActive }) =>
                  `relative py-1 transition-colors hover:text-[#DFC18A] ${
                    isActive ? 'text-[#DFC18A] font-semibold' : ''
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>About</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-[#DFC18A]" />
                    )}
                  </>
                )}
              </NavLink>


              <NavLink
                to="/contact"
                className={({ isActive }) =>
                  `relative py-1 transition-colors hover:text-[#DFC18A] ${
                    isActive ? 'text-[#DFC18A] font-semibold' : ''
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>Contact</span>
                    {isActive && (
                      <span className="absolute -bottom-1 left-0 w-full h-[1.5px] bg-[#DFC18A]" />
                    )}
                  </>
                )}
              </NavLink>
            </nav>

            {/* Right Action Icons & Search */}
            <div className="flex items-center space-x-2 sm:space-x-4">

              {/* Desktop Pill Search Bar */}
              <form
                onSubmit={handleSearchSubmit}
                className="hidden lg:flex items-center relative w-52 xl:w-64"
              >
                <Search className="w-3.5 h-3.5 text-[#8E7B6F] absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search sarees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1E130F] text-[#FDF8F4] placeholder-[#8E7B6F] text-xs pl-9 pr-3 py-1.5 rounded-full border border-[#35221B] focus:border-[#DFC18A]/60 focus:outline-none transition-all"
                />
              </form>

              {/* Mobile Search Toggle */}
              <button
                type="button"
                onClick={() => setSearchOpen((s) => !s)}
                className="lg:hidden p-2 text-[#C7B5A7] hover:text-[#DFC18A] transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* User Account / Profile */}
              <div className="relative">
                {user ? (
                  <Link
                    to="/profile"
                    className="p-2 text-[#C7B5A7] hover:text-[#DFC18A] transition-colors flex items-center"
                    title="Account Profile"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                ) : (
                  <Link
                    to="/login"
                    className="p-2 text-[#C7B5A7] hover:text-[#DFC18A] transition-colors flex items-center"
                    title="Sign In"
                  >
                    <User className="w-5 h-5" />
                  </Link>
                )}
              </div>

              {/* Wishlist Heart Icon */}
              <Link
                to="/cart"
                className="p-2 text-[#C7B5A7] hover:text-[#DFC18A] transition-colors relative"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </Link>

              {/* Shopping Bag / Cart */}
              <Link
                to="/cart"
                className="p-2 text-[#C7B5A7] hover:text-[#DFC18A] transition-colors relative"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute top-1 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#C86A27] text-white text-[9px] font-bold flex items-center justify-center leading-none">
                  {cartCount || 0}
                </span>
              </Link>

              {/* Admin Panel Link if Admin */}
              {user && (role === 'admin' || role === 'superadmin') && (
                <Link
                  to="/admin"
                  className="hidden md:flex items-center gap-1.5 text-xs text-[#DFC18A] border border-[#DFC18A]/30 px-2.5 py-1 rounded-full hover:bg-[#DFC18A]/10 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </Link>
              )}
            </div>

          </div>
        </div>

        {/* Mobile Search Dropdown Bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden border-t border-[#301F18] bg-[#1E130F] px-4 py-2.5 overflow-hidden"
            >
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search className="w-4 h-4 text-[#8E7B6F] absolute left-3 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search pure silk, banarasi, kanchipuram..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full bg-[#160E0B] text-[#FDF8F4] placeholder-[#8E7B6F] text-xs pl-9 pr-8 py-2 rounded-lg border border-[#35221B] focus:border-[#DFC18A] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-2.5 text-[#8E7B6F] hover:text-[#FDF8F4]"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Drawer Menu */}
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

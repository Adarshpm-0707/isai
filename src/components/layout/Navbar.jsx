import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, User, Settings } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import useWishlist from '../../hooks/useWishlist';
import BrandLogo from '../reusable/BrandLogo';
import MobileMenu from './MobileMenu';
import navbarBg from '../../assets/navbarbg.png';

export default function Navbar() {
  const { user, role, logout } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    let lastScrolled = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 20;
          if (isScrolled !== lastScrolled) {
            lastScrolled = isScrolled;
            setScrolled(isScrolled);
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];

  return (
    <>
      {/* ── MAIN HEADER NAVBAR ── */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 font-sans bg-cover bg-center bg-no-repeat ${
          scrolled
            ? 'border-b border-[#F6D18A]/45 shadow-[0_6px_28px_rgba(0,0,0,0.85)] py-1'
            : 'border-b border-[#F6D18A]/35 py-1.5'
        }`}
        style={{
          backgroundImage: `url(${navbarBg})`,
        }}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[60px] sm:h-[68px] lg:h-[80px]">

            {/* ── 1. LEFT: MOBILE HAMBURGER + DESKTOP NAV LINKS ── */}
            <div className="flex-1 flex items-center justify-start gap-3 sm:gap-4 lg:gap-6 min-w-0">
              {/* Mobile Hamburger Button (Hidden on laptop and desktop) */}
              <button
                onClick={() => setMobileOpen((o) => !o)}
                type="button"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1C120E]/85 border border-[#35221B] hover:border-[#DFC18A]/50 flex items-center justify-center text-white hover:text-[#DFC18A] transition-all cursor-pointer shadow-sm shrink-0"
              >
                <div className="w-4 flex flex-col items-center gap-1">
                  <span
                    className={`block h-[1.8px] bg-current transition-all duration-300 ${
                      mobileOpen ? 'w-4 rotate-45 translate-y-[5.5px]' : 'w-4'
                    }`}
                  />
                  <span
                    className={`block h-[1.8px] bg-current transition-all duration-200 ${
                      mobileOpen ? 'opacity-0' : 'w-3.5'
                    }`}
                  />
                  <span
                    className={`block h-[1.8px] bg-current transition-all duration-300 ${
                      mobileOpen ? 'w-4 -rotate-45 -translate-y-[5.5px]' : 'w-4'
                    }`}
                  />
                </div>
              </button>

              {/* Desktop Nav Links (Clean, high-contrast, evenly spaced) */}
              <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs sm:text-[13px] uppercase tracking-[0.20em] font-medium shrink-0">
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

            {/* ── 2. CENTER: MATHEMATICALLY BALANCED BRAND LOGO ── */}
            <div className="shrink-0 flex items-center justify-center px-2">
              <BrandLogo
                to="/"
                imgClassName="h-[52px] xs:h-[56px] sm:h-[64px] lg:h-[72px] xl:h-[80px]"
              />
            </div>

            {/* ── 3. RIGHT: WISHLIST, ACCOUNT, CART, ADMIN ── */}
            <div className="flex-1 flex items-center justify-end gap-2 sm:gap-2.5 xl:gap-3 min-w-0">
              {/* Wishlist Button (Mobile, Tablet & Desktop) */}
              <Link
                to="/wishlist"
                className="flex w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1C120E]/85 border border-[#35221B] hover:border-[#DFC18A]/50 items-center justify-center text-white hover:text-[#DFC18A] transition-all cursor-pointer relative shrink-0 shadow-sm"
                aria-label="Wishlist"
                title="Wishlist"
              >
                <Heart className="w-4 h-4" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 rounded-full bg-[#C86A27] text-white text-[9px] font-bold flex items-center justify-center leading-none shadow">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* User Profile (Tablet & Desktop) */}
              <Link
                to={user ? '/profile' : '/login'}
                className="hidden sm:flex w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#1C120E]/85 border border-[#35221B] hover:border-[#DFC18A]/50 items-center justify-center text-white hover:text-[#DFC18A] transition-all cursor-pointer shrink-0 shadow-sm"
                title={user ? 'Account Profile' : 'Sign In'}
                aria-label="Account Profile"
              >
                <User className="w-4 h-4" />
              </Link>

              {/* Shopping Bag / Cart */}
              <Link
                to="/cart"
                className="flex items-center gap-2 h-9 sm:h-10 px-2.5 sm:px-3 rounded-xl bg-[#1C120E]/90 hover:bg-[#251813] border border-[#35221B] hover:border-[#DFC18A]/50 text-white transition-all cursor-pointer shadow-md group shrink-0"
                aria-label="Shopping Cart"
                title="Shopping Bag"
              >
                <ShoppingBag className="w-4 h-4 text-[#DFC18A] transition-transform group-hover:scale-110" />
                <span className="min-w-[18px] h-[18px] px-1.5 rounded-full bg-[#C86A27] text-white text-[10px] font-bold flex items-center justify-center leading-none shadow-sm">
                  {cartCount || 0}
                </span>
              </Link>

              {/* Admin Button (if user is admin) */}
              {user && (role === 'admin' || role === 'superadmin') && (
                <Link
                  to="/admin"
                  className="hidden md:flex items-center gap-1.5 h-9 sm:h-10 px-3 rounded-xl text-xs text-[#DFC18A] border border-[#DFC18A]/40 bg-[#1F1410] hover:bg-[#DFC18A]/10 transition-colors shadow-sm shrink-0"
                  title="Admin Dashboard"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span className="font-semibold text-[11px] uppercase tracking-wider">
                    Admin
                  </span>
                </Link>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* ── DRAWER MENU (OPENS ON BOTH LAPTOP & MOBILE) ── */}
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

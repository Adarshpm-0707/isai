import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, ShoppingBag, User, LogOut, Settings } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useCart from '../../hooks/useCart';
import MobileMenu from './MobileMenu';

export default function Navbar() {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 bg-ivory/95 backdrop-blur-md border-b border-gold/15 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex flex-col">
                <span className="font-playfair text-xl sm:text-2xl font-bold tracking-widest text-maroon leading-none">
                  ISAI
                </span>
                <span className="font-sans text-[8px] sm:text-[9px] tracking-[0.25em] text-gold uppercase mt-0.5">
                  Handcrafted Sarees
                </span>
              </Link>
            </div>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex space-x-10 font-sans text-[11px] font-semibold uppercase tracking-wider text-maroon">
              <Link to="/" className="hover:text-gold transition-colors relative py-1 group">
                Home
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link to="/products" className="hover:text-gold transition-colors relative py-1 group">
                Collection
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
              <Link to="/about" className="hover:text-gold transition-colors relative py-1 group">
                Our Story
                <span className="absolute bottom-0 left-0 w-0 h-[1.5px] bg-gold transition-all duration-300 group-hover:w-full" />
              </Link>
            </nav>

            {/* Right Icons / Auth */}
            <div className="flex items-center space-x-2 sm:space-x-5">
              {/* Admin Button */}
              {user && (role === 'admin' || role === 'superadmin') && (
                <Link
                  to="/admin"
                  className="hidden lg:flex items-center gap-1.5 text-gold hover:text-gold-dark font-sans text-[11px] font-semibold uppercase tracking-wider transition-colors"
                  title="Admin Dashboard"
                >
                  <Settings className="w-4 h-4" />
                  Admin
                </Link>
              )}

              {/* Order History */}
              {user && (
                <Link
                  to="/orders"
                  className="hidden lg:flex items-center gap-1 text-maroon hover:text-gold font-sans text-[11px] font-semibold uppercase tracking-wider transition-colors"
                >
                  My Orders
                </Link>
              )}

              {/* Cart Icon */}
              <Link
                to="/cart"
                className="relative p-2.5 text-maroon hover:text-gold transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-gold text-maroon font-sans font-bold text-[9px] rounded-full flex items-center justify-center border border-ivory">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Auth Button (Desktop) */}
              <div className="hidden lg:block">
                {user ? (
                  <div className="flex items-center gap-4">
                    <span className="font-sans text-xs text-maroon/70 max-w-[120px] truncate" title={user.email}>
                      {user.email.split('@')[0]}
                    </span>
                    <button
                      onClick={logout}
                      type="button"
                      className="p-2 text-maroon hover:text-gold transition-colors"
                      title="Log Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-1 text-maroon hover:text-gold font-sans text-[11px] font-semibold uppercase tracking-wider transition-colors border border-maroon/20 px-4 py-2 hover:border-gold"
                  >
                    <User className="w-3.5 h-3.5" />
                    Sign In
                  </Link>
                )}
              </div>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileOpen(true)}
                type="button"
                className="lg:hidden p-2 text-maroon hover:text-gold transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                <Menu className="w-6 h-6 stroke-[1.8]" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Slideout mobile drawer */}
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

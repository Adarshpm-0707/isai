import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, ShoppingBag, User, LogOut, Settings } from 'lucide-react';
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
        className="sticky top-0 z-40 bg-cover bg-center bg-no-repeat border-b border-[#f45d04]/40 shadow-2xl transition-all duration-300"
        style={{ backgroundImage: `linear-gradient(to right, rgba(18, 4, 4, 0.75), rgba(18, 4, 4, 0.75)), url(${navbarBg})` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-20">

            {/* Left Section: Mobile Menu Toggle / Desktop Nav Links */}
            <div className="flex items-center">
              <button
                onClick={() => setMobileOpen(true)}
                type="button"
                className="lg:hidden p-2 text-[#efcf8b] hover:text-[#f45d04] transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                <Menu className="w-6 h-6 stroke-[1.8]" />
              </button>

              <nav className="hidden lg:flex space-x-8 font-sans text-[11px] font-semibold uppercase tracking-wider text-[#efcf8b]">
                <Link to="/" className="hover:text-[#f45d04] transition-colors relative py-1 group">
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#f45d04] transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link to="/products" className="hover:text-[#f45d04] transition-colors relative py-1 group">
                  Collection
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#f45d04] transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link to="/about" className="hover:text-[#f45d04] transition-colors relative py-1 group">
                  Our Story
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#f45d04] transition-all duration-300 group-hover:w-full" />
                </Link>
              </nav>
            </div>

            {/* Centralized Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
              <Link to="/" className="flex items-center">
                <img src={logoImg} alt="Isai Tarang Logo" className="h-12 sm:h-16 w-auto object-contain transition-transform hover:scale-105" />
              </Link>
            </div>

            {/* Right Icons / Auth */}
            <div className="flex items-center space-x-2 sm:space-x-5">
              {user && (role === 'admin' || role === 'superadmin') && (
                <Link
                  to="/admin"
                  className="hidden lg:flex items-center gap-1.5 text-[#efcf8b] hover:text-[#f45d04] font-sans text-[11px] font-semibold uppercase tracking-wider transition-colors"
                  title="Admin Dashboard"
                >
                  <Settings className="w-4 h-4" />
                  Admin
                </Link>
              )}

              {user && (
                <Link
                  to="/orders"
                  className="hidden lg:flex items-center gap-1 text-[#efcf8b] hover:text-[#f45d04] font-sans text-[11px] font-semibold uppercase tracking-wider transition-colors"
                >
                  My Orders
                </Link>
              )}

              <Link
                to="/cart"
                className="relative p-2.5 text-[#efcf8b] hover:text-[#f45d04] transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#f45d04] text-[#efcf8b] font-sans font-bold text-[9px] rounded-full flex items-center justify-center border-2 border-[#f45d04]">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="hidden lg:block">
                {user ? (
                  <div className="flex items-center gap-4">
                    <span className="font-sans text-xs text-[#efcf8b]/80 max-w-[120px] truncate" title={user.email}>
                      {user.email.split('@')[0]}
                    </span>
                    <button
                      onClick={logout}
                      type="button"
                      className="p-2 text-[#efcf8b] hover:text-[#f45d04] transition-colors"
                      title="Log Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-1 bg-[#f45d04] text-[#efcf8b] hover:bg-white hover:text-[#f45d04] font-sans text-[11px] font-semibold uppercase tracking-wider transition-all px-5 py-2 rounded-full shadow-md"
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





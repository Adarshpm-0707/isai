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
        className="sticky top-0 z-40 bg-cover bg-center bg-no-repeat border-b border-[#F6D18A]/40 shadow-xl transition-all duration-300"
        style={{ backgroundImage: `url(${navbarBg})` }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-20">

            {/* Left Section: Mobile Menu Toggle / Desktop Nav Links */}
            <div className="flex items-center">
              <button
                onClick={() => setMobileOpen(true)}
                type="button"
                className="lg:hidden p-2 text-[#FFE8A3] hover:text-[#F6D18A] transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                <Menu className="w-6 h-6 stroke-[2]" />
              </button>

              <nav className="hidden lg:flex space-x-8 font-sans text-xs font-bold uppercase tracking-wider text-[#FFE8A3]">
                <Link to="/" className="hover:text-[#F6D18A] transition-colors relative py-1 group">
                  Home
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FFE8A3] transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link to="/products" className="hover:text-[#F6D18A] transition-colors relative py-1 group">
                  Collection
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FFE8A3] transition-all duration-300 group-hover:w-full" />
                </Link>
                <Link to="/about" className="hover:text-[#F6D18A] transition-colors relative py-1 group">
                  Our Story
                  <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#FFE8A3] transition-all duration-300 group-hover:w-full" />
                </Link>
              </nav>
            </div>

            {/* Centralized Logo */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center">
              <Link to="/" className="flex items-center p-1.5">
                <img src={logoImg} alt="Isai Tarang Logo" className="h-12 sm:h-16 w-auto object-contain transition-transform hover:scale-105" />
              </Link>
            </div>

            {/* Right Icons / Auth */}
            <div className="flex items-center space-x-2 sm:space-x-5">
              {user && (role === 'admin' || role === 'superadmin') && (
                <Link
                  to="/admin"
                  className="hidden lg:flex items-center gap-1.5 text-[#FFE8A3] hover:text-[#F6D18A] font-sans text-xs font-bold uppercase tracking-wider transition-colors"
                  title="Admin Dashboard"
                >
                  <Settings className="w-4 h-4 text-[#FFE8A3]" />
                  Admin
                </Link>
              )}

              {user && (
                <Link
                  to="/orders"
                  className="hidden lg:flex items-center gap-1 text-[#FFE8A3] hover:text-[#F6D18A] font-sans text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  My Orders
                </Link>
              )}

              <Link
                to="/cart"
                className="relative p-2 text-[#FFE8A3] hover:text-[#F6D18A] transition-colors"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 stroke-[2]" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-[#FFE8A3] text-[#800202] font-sans font-bold text-[10px] rounded-full flex items-center justify-center border border-[#800202] shadow">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="hidden lg:block">
                {user ? (
                  <div className="flex items-center gap-4">
                    <span className="font-sans text-xs text-[#FFE8A3] font-bold max-w-[120px] truncate" title={user.email}>
                      {user.email.split('@')[0]}
                    </span>
                    <button
                      onClick={logout}
                      type="button"
                      className="p-1 text-[#FFE8A3] hover:text-[#F6D18A] transition-colors"
                      title="Log Out"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center gap-1 bg-[#FFE8A3] text-[#800202] hover:bg-[#F6D18A] font-sans text-xs font-bold uppercase tracking-wider transition-all px-5 py-2 rounded-full shadow-md border border-[#FFE8A3]"
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





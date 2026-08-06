import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, LogIn, LogOut, Clipboard, Settings, Home, BookOpen, Info } from 'lucide-react';
import logoImg from '../../assets/ISAI (2).png';

// ── Nav link data ─────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { to: '/',         label: 'Home',       icon: Home      },
  { to: '/products', label: 'Collection', icon: BookOpen  },
  { to: '/about',    label: 'Our Story',  icon: Info      },
];

// ── Stagger variants ──────────────────────────────────────────────────────────
const backdropVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.35 } },
  exit:    { opacity: 0, transition: { duration: 0.28 } },
};

const panelVariants = {
  hidden:  { x: '100%', opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', damping: 28, stiffness: 280, mass: 0.9 },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { type: 'tween', duration: 0.28, ease: 'easeInOut' },
  },
};

const listContainerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.18 } },
  exit:    { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

const listItemVariants = {
  hidden:  { opacity: 0, x: 32, filter: 'blur(4px)' },
  visible: {
    opacity: 1, x: 0, filter: 'blur(0px)',
    transition: { type: 'spring', damping: 22, stiffness: 260 },
  },
  exit:    { opacity: 0, x: 20, filter: 'blur(4px)', transition: { duration: 0.15 } },
};

const bottomVariants = {
  hidden:  { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.38, duration: 0.45, ease: 'easeOut' } },
  exit:    { opacity: 0, y: 16, transition: { duration: 0.18 } },
};

// ════════════════════════════════════════════════════════════════════════════
export default function MobileMenu({ isOpen, onClose, user, role, cartCount, logout }) {
  const location = useLocation();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" aria-modal="true" role="dialog">

          {/* ── Frosted-glass backdrop ── */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="absolute inset-0"
            style={{
              background: 'rgba(5, 14, 9, 0.72)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          />

          {/* ── Glass drawer panel ── */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-0 right-0 h-full w-[82vw] max-w-[320px] flex flex-col"
            style={{
              background:
                'linear-gradient(135deg, rgba(20,42,28,0.82) 0%, rgba(12,28,18,0.90) 100%)',
              backdropFilter: 'blur(32px)',
              WebkitBackdropFilter: 'blur(32px)',
              borderLeft: '1px solid rgba(212,175,122,0.22)',
              boxShadow: '-8px 0 60px rgba(0,0,0,0.55)',
            }}
          >
            {/* Decorative top-right radial glow */}
            <div
              className="pointer-events-none absolute top-0 right-0 w-48 h-48 rounded-full"
              style={{
                background: 'radial-gradient(circle at top right, rgba(212,175,122,0.12) 0%, transparent 70%)',
              }}
            />

            {/* ── Header ── */}
            <div
              className="flex items-center justify-between px-6 pt-6 pb-5"
              style={{ borderBottom: '1px solid rgba(212,175,122,0.15)' }}
            >
              <div className="flex items-center gap-2.5">
                <img src={logoImg} alt="Isai Tarang" className="h-9 w-auto object-contain" />
                <div>
                  <p
                    className="font-bold leading-none tracking-[0.1em] uppercase"
                    style={{
                      fontFamily: "'Playfair Display', serif",
                      color: '#E3C381',
                      fontSize: '0.85rem',
                    }}
                  >
                    Isai Tarang
                  </p>
                  <p
                    className="leading-none mt-0.5 tracking-[0.25em] uppercase"
                    style={{ color: '#C8A96E', fontSize: '0.5rem' }}
                  >
                    Elegance in every weave
                  </p>
                </div>
              </div>

              {/* X close button */}
              <button
                onClick={onClose}
                type="button"
                aria-label="Close menu"
                className="relative flex items-center justify-center w-9 h-9 rounded-full transition-all duration-200 hover:bg-white/10"
                style={{ border: '1px solid rgba(212,175,122,0.25)' }}
              >
                <span
                  className="absolute block w-4 h-[1.5px] rotate-45"
                  style={{ background: '#E3C381' }}
                />
                <span
                  className="absolute block w-4 h-[1.5px] -rotate-45"
                  style={{ background: '#E3C381' }}
                />
              </button>
            </div>

            {/* ── Nav links — staggered ── */}
            <nav className="flex-grow px-5 pt-8 pb-4 overflow-y-auto">
              <p
                className="mb-5 tracking-[0.45em] uppercase"
                style={{ color: '#8A7A5A', fontSize: '0.55rem', fontWeight: 700 }}
              >
                Navigation
              </p>

              <motion.ul
                variants={listContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-1"
              >
                {NAV_LINKS.map(({ to, label, icon: Icon }) => {
                  const isActive = location.pathname === to;
                  return (
                    <motion.li key={to} variants={listItemVariants}>
                      <Link
                        to={to}
                        onClick={onClose}
                        className="group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200"
                        style={{
                          background: isActive ? 'rgba(212,175,122,0.12)' : 'transparent',
                          border: isActive
                            ? '1px solid rgba(212,175,122,0.3)'
                            : '1px solid transparent',
                        }}
                        onMouseEnter={e => {
                          if (!isActive) e.currentTarget.style.background = 'rgba(212,175,122,0.06)';
                        }}
                        onMouseLeave={e => {
                          if (!isActive) e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        {/* Icon */}
                        <span
                          className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                          style={{
                            background: isActive
                              ? 'rgba(212,175,122,0.2)'
                              : 'rgba(212,175,122,0.08)',
                          }}
                        >
                          <Icon
                            size={15}
                            style={{ color: isActive ? '#E3C381' : '#C8A96E' }}
                          />
                        </span>

                        {/* Label */}
                        <span
                          className="font-bold uppercase tracking-[0.2em]"
                          style={{
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            fontSize: '0.72rem',
                            color: isActive ? '#E3C381' : '#A89880',
                          }}
                        >
                          {label}
                        </span>

                        {/* Active dot */}
                        {isActive && (
                          <span
                            className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: '#D4AF7A' }}
                          />
                        )}
                      </Link>
                    </motion.li>
                  );
                })}

                {/* User-specific links */}
                {user && (
                  <>
                    <motion.li variants={listItemVariants}>
                      <Link
                        to="/orders"
                        onClick={onClose}
                        className="group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200"
                        style={{ border: '1px solid transparent' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,122,0.06)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <span
                          className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                          style={{ background: 'rgba(212,175,122,0.08)' }}
                        >
                          <Clipboard size={15} style={{ color: '#C8A96E' }} />
                        </span>
                        <span
                          className="font-bold uppercase tracking-[0.2em]"
                          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.72rem', color: '#A89880' }}
                        >
                          My Orders
                        </span>
                      </Link>
                    </motion.li>

                    {(role === 'admin' || role === 'superadmin') && (
                      <motion.li variants={listItemVariants}>
                        <Link
                          to="/admin"
                          onClick={onClose}
                          className="group flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200"
                          style={{ border: '1px solid transparent' }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,122,0.06)'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                        >
                          <span
                            className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                            style={{ background: 'rgba(212,175,122,0.08)' }}
                          >
                            <Settings size={15} style={{ color: '#C8A96E' }} />
                          </span>
                          <span
                            className="font-bold uppercase tracking-[0.2em]"
                            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.72rem', color: '#A89880' }}
                          >
                            Admin Panel
                          </span>
                        </Link>
                      </motion.li>
                    )}
                  </>
                )}
              </motion.ul>
            </nav>

            {/* ── Bottom action buttons ── */}
            <motion.div
              variants={bottomVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="px-5 pb-8 pt-4 space-y-3 shrink-0"
              style={{ borderTop: '1px solid rgba(212,175,122,0.12)' }}
            >
              {/* User greeting */}
              {user && (
                <div
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl mb-4"
                  style={{ background: 'rgba(212,175,122,0.08)', border: '1px solid rgba(212,175,122,0.15)' }}
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: 'rgba(212,175,122,0.25)', color: '#E3C381' }}
                  >
                    {user.email?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span
                    className="text-xs font-semibold truncate"
                    style={{ color: '#C8A96E', maxWidth: '160px' }}
                  >
                    {user.email?.split('@')[0]}
                  </span>
                </div>
              )}

              {/* Cart button */}
              <Link
                to="/cart"
                onClick={onClose}
                className="relative flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-[0.3em] transition-all duration-300 hover:brightness-105 active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #E3C381 0%, #D4AF7A 50%, #C8A96E 100%)',
                  color: '#0F2318',
                  boxShadow: '0 4px 20px rgba(212,175,122,0.25)',
                }}
              >
                <ShoppingBag size={15} />
                View Cart
                {cartCount > 0 && (
                  <span
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{ background: '#0F2318', color: '#E3C381' }}
                  >
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Sign In / Log Out */}
              {user ? (
                <button
                  type="button"
                  onClick={() => { logout(); onClose(); }}
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-[0.3em] transition-all duration-300 active:scale-[0.98]"
                  style={{
                    background: 'rgba(212,175,122,0.08)',
                    border: '1px solid rgba(212,175,122,0.25)',
                    color: '#C8A96E',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(212,175,122,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(212,175,122,0.08)'; }}
                >
                  <LogOut size={15} />
                  Log Out
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl font-bold text-[11px] uppercase tracking-[0.3em] transition-all duration-300 active:scale-[0.98]"
                  style={{
                    background: 'rgba(212,175,122,0.08)',
                    border: '1px solid rgba(212,175,122,0.28)',
                    color: '#D4AF7A',
                  }}
                >
                  <LogIn size={15} />
                  Sign In
                </Link>
              )}
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

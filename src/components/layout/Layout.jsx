import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';
import navbarBg from '../../assets/navbarbg.png';

export default function Layout() {
  const location = useLocation();

  return (
    <div 
      className="flex flex-col min-h-screen text-[#FFE8A3] bg-gradient-to-br from-[#800202] via-[#B42802] to-[#F15502] selection:bg-[#FFE8A3] selection:text-[#800202]"
    >
      {/* Premium Header/Navigation */}
      <Navbar />

      {/* Main Page Area wrapped with page transition animations */}
      <main className="flex-grow relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}

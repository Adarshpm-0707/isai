import React, { useState, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import AuthProvider from './context/AuthContext';
import CartProvider from './context/CartContext';
import WishlistProvider from './context/WishlistContext';
import AppRoutes from './routes/AppRoutes';
import ScrollToTop from './components/reusable/ScrollToTop';
import SareeLoader from './components/common/SareeLoader';
import BrandLogo from './components/reusable/BrandLogo';

export default function App() {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.__sareeLoaderDone = false;
    }
  }, []);

  const handleLoaderComplete = () => {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('isai_loader_seen', 'true');
      } catch {}
      window.__sareeLoaderDone = true;
      window.dispatchEvent(new CustomEvent('saree-loader-complete'));
    }
    setShowLoader(false);
  };

  return (
    <BrowserRouter>
      <ScrollToTop />
      <AnimatePresence>
        {showLoader && (
          <SareeLoader
            minDuration={2200}
            logo={<BrandLogo asImage={true} size="2xl" imgClassName="h-28 sm:h-36 md:h-48 lg:h-56 max-h-[45vh] w-auto object-contain" />}
            onComplete={handleLoaderComplete}
          />
        )}
      </AnimatePresence>

      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppRoutes />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

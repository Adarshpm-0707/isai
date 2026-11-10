import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop component automatically scrolls the window to the top (0,0)
 * on page transition, or scrolls smoothly to the target hash element if present.
 */
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // Disable browser's automatic scroll restoration so it never keeps stale scroll offset
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  useEffect(() => {
    if (hash) {
      const timer = setTimeout(() => {
        try {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            return;
          }
        } catch {
          // Fallback if hash is invalid selector
        }
      }, 120);
      return () => clearTimeout(timer);
    }

    const resetToTop = () => {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
      if (typeof document !== 'undefined') {
        if (document.documentElement) document.documentElement.scrollTop = 0;
        if (document.body) document.body.scrollTop = 0;
      }
    };

    // Immediate scroll reset
    resetToTop();

    // In next animation frame after paint
    const rafId = requestAnimationFrame(resetToTop);

    // After animation transitions (e.g. AnimatePresence route exit/enter)
    const t1 = setTimeout(resetToTop, 60);
    const t2 = setTimeout(resetToTop, 320);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [pathname, search, hash]);

  return null;
}

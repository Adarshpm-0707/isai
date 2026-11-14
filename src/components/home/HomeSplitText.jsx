import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';

// Register GSAP SplitText plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(SplitText);
}

/**
 * HomeSplitText - Automatic GSAP Characters Animation for Home Page
 *
 * Automatically triggers the kinetic character animation right AFTER the loading screen
 * (SareeLoader) completes and unveils the home page.
 * Applies exclusively the characters animation, fully responsive for both mobile and laptop.
 */
export default function HomeSplitText({
  variant = 'desktop', // 'desktop' | 'mobile'
  className = '',
}) {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const splitRef = useRef(null);
  const animRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  const isMobile = variant === 'mobile';

  /**
   * Run the GSAP SplitText Characters animation
   */
  const playCharactersAnimation = useCallback(() => {
    if (!textRef.current) return;

    // 1. Revert any previous animation & split
    if (animRef.current) {
      animRef.current.revert();
    }
    if (splitRef.current) {
      splitRef.current.revert();
    }

    // Ensure the text container is visible before animating
    if (textRef.current) {
      textRef.current.style.opacity = '1';
      textRef.current.style.visibility = 'visible';
    }

    // 2. Create fresh SplitText for characters
    try {
      splitRef.current = new SplitText(textRef.current, {
        type: 'chars,words,lines',
        linesClass: 'split-line block will-change-transform',
        wordsClass: 'split-word inline-block will-change-transform',
        charsClass: 'split-char inline-block will-change-transform',
      });
    } catch (err) {
      console.warn('SplitText initialization error:', err);
      return;
    }

    const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 1024;

    // 3. Characters Animation: letters fly in with power4 easing and staggered timing
    animRef.current = gsap.from(splitRef.current.chars, {
      x: isSmallScreen ? 70 : 130,
      opacity: 0,
      duration: isSmallScreen ? 0.7 : 0.75,
      ease: 'power4.out',
      stagger: isSmallScreen ? 0.024 : 0.035,
      clearProps: 'transform',
      onComplete: () => {
        hasAnimatedRef.current = true;
      },
    });
  }, []);

  useEffect(() => {
    let isMounted = true;
    let resizeTimer;

    const startAnimation = () => {
      if (!isMounted) return;
      if (typeof document !== 'undefined' && document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          if (isMounted) playCharactersAnimation();
        });
      } else {
        playCharactersAnimation();
      }
    };

    const timer = setTimeout(startAnimation, 80);

    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (isMounted && hasAnimatedRef.current) {
          if (splitRef.current) splitRef.current.revert();
          if (animRef.current) animRef.current.revert();
          if (textRef.current) {
            textRef.current.style.opacity = '1';
            textRef.current.style.visibility = 'visible';
          }
        }
      }, 150);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      isMounted = false;
      clearTimeout(timer);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      if (animRef.current) animRef.current.revert();
      if (splitRef.current) splitRef.current.revert();
    };
  }, [playCharactersAnimation]);

  return (
    <div
      ref={containerRef}
      id="chars"
      data-testid="chars-animation-container"
      className={`container relative w-full flex flex-col items-start text-left ${className}`}
      style={{
        perspective: '500px',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* ── MAIN HEADLINE WITH CHARACTERS GSAP SPLITTEXT ANIMATION ── */}
      {isMobile ? (
        <h1
          ref={textRef}
          className="text font-serif leading-[1.1] text-[#FDF8F4] drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]"
          style={{
            fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
            fontSize: 'clamp(1.95rem, 8.5vw, 2.75rem)',
          }}
        >
          <span className="block text-[#FDF8F4] font-normal">Woven in Heritage.</span>
          <span className="block italic font-light text-[#D4855A] mt-0.5">Worn with Grace.</span>
        </h1>
      ) : (
        <h1
          ref={textRef}
          className="text font-serif text-5xl xl:text-6xl 2xl:text-7xl font-normal text-[#FDF8F4] leading-[1.1] drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]"
          style={{
            fontFamily: "'Playfair Display', 'Cormorant Garamond', serif",
          }}
        >
          Woven in Heritage.
          <br />
          <span className="italic font-light text-[#D4855A]">
            Worn with Grace.
          </span>
        </h1>
      )}
    </div>
  );
}

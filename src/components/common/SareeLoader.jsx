import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const WEAVING_STAGES = [
  'Sweeping Royal Silk Drapes...',
  'Surrounding the Heritage Loom...',
  'Embracing the Crest in Gold Zari...',
  'Unveiling Isai Tarang...',
];

// Smooth interpolation helpers
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const smoothstep = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;

export default function SareeLoader({
  onComplete,
  minDuration = 4400,
  logo = null, // Pass your <BrandLogo size="lg" /> here!
}) {
  const [progress, setProgress] = useState(0);
  const [stageIndex, setStageIndex] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const canvasRef = useRef(null);
  const progressRef = useRef(0);

  // Prevent background scrolling while weaving loader is active, restore immediately on exit
  useEffect(() => {
    if (isExiting || isDone) {
      document.body.style.overflow = '';
    } else {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isExiting, isDone]);

  // =========================================================================
  // 60FPS CINEMATIC 3D SILK SAREE CHOREOGRAPHY ENGINE
  // =========================================================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;

    let W = window.innerWidth;
    let H = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const handleResize = () => {
      W = window.innerWidth;
      H = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Floating golden zari embers
    const particles = Array.from({ length: 65 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.8 + 0.5,
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.9 + 0.3,
      alpha: Math.random() * 0.7 + 0.25,
      twinkleOffset: Math.random() * 10,
    }));

    // Build and render one realistic twisted, multi-pleated silk saree ribbon
    const drawRealisticSaree = (side, p, time) => {
      // 4-Act Choreography Curves
      const p1 = smoothstep(0.0, 0.34, p);  // Act 1: Wave in from Left (-1) & Right (+1)
      const p2 = smoothstep(0.24, 0.68, p); // Act 2: Smoothly enter surrounding orbital rotation
      const p3 = smoothstep(0.60, 0.82, p); // Act 3: Tighten inward & wrap/protect logo center
      const p4 = smoothstep(0.80, 1.00, p); // Act 4: Unfurl outward & reveal logo

      const cx = W / 2;
      const cy = H / 2;
      const minDim = Math.min(W, H);
      const maxDim = Math.max(W, H);

      const segments = 58;
      const spine = [];

      // Compute spine points along the flowing length of the saree (u: 0 = tail, 1 = pallu head)
      for (let i = 0; i <= segments; i++) {
        const u = i / segments;

        // --- ACT 1: Cartesian Wave Entry from Left (-1) or Right (+1) ---
        const entryProgress = lerp(W * 0.72, -W * 0.12, p1);
        const trailSpan = W * 0.68;
        const waveX = cx + side * (entryProgress + (1 - u) * trailSpan);
        const waveY =
          cy +
          side * H * 0.06 +
          Math.sin(u * 5.2 - time * 3.6 + (side === 1 ? 1.4 : 0)) * H * 0.16;

        // --- ACT 2, 3, 4: Polar Surrounding Orbit -> Protect -> Reveal ---
        const baseOrbitAngle =
          (side === -1 ? Math.PI : 0) +
          p2 * Math.PI * 2.35 +
          p3 * Math.PI * 0.85 +
          p4 * Math.PI * 0.65;

        // Saree wraps ~240 degrees around the center
        const theta = baseOrbitAngle + (u - 0.5) * Math.PI * 1.45;

        // Dynamic Radius: Wide orbit -> Contracts to wrap/protect center -> Sweeps off-screen to reveal
        const orbitRadius = minDim * 0.33;
        const protectRadius = minDim * 0.11;
        const revealRadius = maxDim * 0.92;

        let R = lerp(orbitRadius, protectRadius, p3);
        R = lerp(R, revealRadius, Math.pow(p4, 1.35));

        // Add organic wind-billow ripples along the orbit
        R += Math.sin(u * 6.5 - time * 4.2 + side) * minDim * 0.055 * (1 - p4 * 0.7);

        const orbitX = cx + Math.cos(theta) * R;
        const orbitY = cy + Math.sin(theta) * R;

        // Seamless blend from Left/Right Entry -> Swirling Orbit
        const x = lerp(waveX, orbitX, p2);
        const y = lerp(waveY, orbitY, p2);

        spine.push({ x, y, u });
      }

      // Compute normals & 3D ribbon twist widths along the spine
      const topEdge = [];
      const botEdge = [];
      const baseRibbonHalfW = clamp(minDim * 0.15, 55, 130);

      for (let i = 0; i <= segments; i++) {
        const curr = spine[i];
        const prev = spine[Math.max(0, i - 1)];
        const next = spine[Math.min(segments, i + 1)];

        const dx = next.x - prev.x;
        const dy = next.y - prev.y;
        const len = Math.hypot(dx, dy) || 1;
        const nx = -dy / len;
        const ny = dx / len;

        // 3D cloth twist simulates real silk flipping & catching specular light
        const twistPhase = curr.u * 4.2 - time * 2.4 + (side === 1 ? 1.8 : 0);
        const twistFactor = 0.36 + 0.64 * Math.abs(Math.sin(twistPhase));

        // Natural taper at the very ends of the drape
        const endTaper = 0.45 + 0.55 * Math.sin(curr.u * Math.PI);
        const hw = baseRibbonHalfW * twistFactor * endTaper;

        topEdge.push({ x: curr.x + nx * hw, y: curr.y + ny * hw, nx, ny, hw });
        botEdge.push({ x: curr.x - nx * hw, y: curr.y - ny * hw, nx, ny, hw });
      }

      // Fade out smoothly right at the end of the reveal
      const revealAlpha = 1 - smoothstep(0.88, 1.0, p);
      if (revealAlpha <= 0.01) return;

      ctx.save();
      ctx.globalAlpha = revealAlpha;

      // 1. Cast Deep 3D Studio Drop Shadow
      ctx.beginPath();
      ctx.moveTo(topEdge[0].x, topEdge[0].y);
      for (let i = 1; i <= segments; i++) ctx.lineTo(topEdge[i].x, topEdge[i].y);
      for (let i = segments; i >= 0; i--) ctx.lineTo(botEdge[i].x, botEdge[i].y);
      ctx.closePath();

      ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
      ctx.shadowBlur = 34;
      ctx.shadowOffsetY = 12;

      // Rich Kanjivaram Silk Multi-Stop Body Gradient
      const silkGrad = ctx.createLinearGradient(
        spine[0].x,
        spine[0].y,
        spine[segments].x,
        spine[segments].y
      );
      if (side === -1) {
        // Left Saree: Deep Royal Crimson & Ruby Silk
        silkGrad.addColorStop(0, '#360406');
        silkGrad.addColorStop(0.3, '#7C0C10');
        silkGrad.addColorStop(0.55, '#B81B18');
        silkGrad.addColorStop(0.8, '#6B090C');
        silkGrad.addColorStop(1, '#2D0304');
      } else {
        // Right Saree: Deep Burgundy & Saffron Silk
        silkGrad.addColorStop(0, '#2B0408');
        silkGrad.addColorStop(0.3, '#690814');
        silkGrad.addColorStop(0.55, '#A31522');
        silkGrad.addColorStop(0.8, '#5C0710');
        silkGrad.addColorStop(1, '#240205');
      }
      ctx.fillStyle = silkGrad;
      ctx.fill();

      // Clear shadow before drawing surface pleats & zari borders
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;

      // 2. Render 6 Realistic Translucent Silk Fold Pleats inside the Drape
      const pleatRatios = [-0.65, -0.38, -0.12, 0.14, 0.42, 0.68];
      pleatRatios.forEach((ratio, idx) => {
        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
          const s = spine[i];
          const t = topEdge[i];
          const px = s.x + t.nx * (t.hw * ratio);
          const py = s.y + t.ny * (t.hw * ratio);
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        // Alternate shadow folds and satin light-catching ridges
        const isHighlight = idx % 2 === 1;
        ctx.strokeStyle = isHighlight
          ? 'rgba(255, 205, 165, 0.20)'
          : 'rgba(20, 2, 3, 0.42)';
        ctx.lineWidth = isHighlight ? 2.5 : 4.5;
        ctx.stroke();
      });

      // 3. Draw Shimmering Gold Zari Borders along BOTH Edges of the Saree
      const drawZariBorder = (edgeArr, isTop) => {
        const zariWidth = 10;
        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
          const pt = edgeArr[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        for (let i = segments; i >= 0; i--) {
          const pt = edgeArr[i];
          const dir = isTop ? -1 : 1;
          ctx.lineTo(pt.x + pt.nx * zariWidth * dir, pt.y + pt.ny * zariWidth * dir);
        }
        ctx.closePath();

        const zariGrad = ctx.createLinearGradient(
          edgeArr[0].x,
          edgeArr[0].y,
          edgeArr[segments].x,
          edgeArr[segments].y
        );
        zariGrad.addColorStop(0, '#784E10');
        zariGrad.addColorStop(0.25, '#DFC18A');
        zariGrad.addColorStop(0.5, '#FFF2C6');
        zariGrad.addColorStop(0.75, '#C88D2B');
        zariGrad.addColorStop(1, '#6E450B');
        ctx.fillStyle = zariGrad;
        ctx.fill();

        // Crisp luminous gold rim thread
        ctx.beginPath();
        for (let i = 0; i <= segments; i++) {
          const pt = edgeArr[i];
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = 'rgba(255, 244, 208, 0.85)';
        ctx.lineWidth = 1.4;
        ctx.stroke();
      };

      drawZariBorder(topEdge, true);
      drawZariBorder(botEdge, false);

      // 4. Subtle Woven Gold Zari Diamond Motifs (Butti) along center spine
      for (let i = 4; i < segments - 4; i += 5) {
        const pt = spine[i];
        const hw = topEdge[i].hw;
        if (hw < 14) continue; // Hide when edge-on

        ctx.save();
        ctx.translate(pt.x, pt.y);
        ctx.rotate(Math.atan2(spine[i + 1].y - pt.y, spine[i + 1].x - pt.x));
        ctx.beginPath();
        ctx.moveTo(0, -3.5);
        ctx.lineTo(4.5, 0);
        ctx.lineTo(0, 3.5);
        ctx.lineTo(-4.5, 0);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255, 232, 168, 0.55)';
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
    };

    const startClock = performance.now();

    const renderLoop = (now) => {
      const time = (now - startClock) * 0.001;
      const p = progressRef.current;

      // Clear with deep luxury obsidian-velvet backdrop
      ctx.fillStyle = '#090303';
      ctx.fillRect(0, 0, W, H);

      // Central Protective Golden Halo (glows brightly during Act 3 & Act 4)
      const protectGlow = smoothstep(0.45, 0.82, p);
      if (protectGlow > 0.01) {
        const rad = Math.min(W, H) * (0.28 + 0.16 * smoothstep(0.78, 1.0, p));
        const glowGrad = ctx.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, rad);
        glowGrad.addColorStop(0, `rgba(223, 193, 138, ${0.32 * protectGlow})`);
        glowGrad.addColorStop(0.5, `rgba(200, 106, 39, ${0.14 * protectGlow})`);
        glowGrad.addColorStop(1, 'rgba(9, 3, 3, 0)');
        ctx.fillStyle = glowGrad;
        ctx.fillRect(0, 0, W, H);
      }

      // Draw Left & Right Sarees with crossing depth alternation
      if (Math.sin(time * 1.5) > 0) {
        drawRealisticSaree(-1, p, time);
        drawRealisticSaree(1, p, time);
      } else {
        drawRealisticSaree(1, p, time);
        drawRealisticSaree(-1, p, time);
      }

      // Render Floating Gold Zari Dust Particles
      particles.forEach((pt) => {
        // Orbit particles gently around center during Act 2 & 3
        const dx = pt.x - W / 2;
        const dy = pt.y - H / 2;
        const dist = Math.hypot(dx, dy) || 1;
        pt.x += Math.cos(pt.angle) * pt.speed - (dy / dist) * 0.65 * smoothstep(0.2, 0.8, p);
        pt.y += Math.sin(pt.angle) * pt.speed + (dx / dist) * 0.65 * smoothstep(0.2, 0.8, p);

        if (pt.x < -10) pt.x = W + 10;
        if (pt.x > W + 10) pt.x = -10;
        if (pt.y < -10) pt.y = H + 10;
        if (pt.y > H + 10) pt.y = -10;

        const twinkle = 0.45 + 0.55 * Math.sin(time * 3.8 + pt.twinkleOffset);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 232, 175, ${pt.alpha * twinkle})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(renderLoop);
    };

    animId = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // =========================================================================
  // TIMELINE PROGRESSION CONTROLLER
  // =========================================================================
  useEffect(() => {
    const startTime = performance.now();
    let rafId;
    let lastPct = -1;

    const tick = (now) => {
      const elapsed = now - startTime;
      const normalized = Math.min(elapsed / minDuration, 1);
      progressRef.current = normalized;

      const pct = Math.floor(normalized * 100);
      if (pct !== lastPct) {
        lastPct = pct;
        setProgress(pct);
        const stage = Math.min(
          Math.floor(normalized * WEAVING_STAGES.length),
          WEAVING_STAGES.length - 1
        );
        setStageIndex(stage);
      }

      if (normalized < 1) {
        rafId = requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          setIsExiting(true);
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('saree-loader-exiting'));
          }
          setTimeout(() => {
            setIsDone(true);
            if (typeof window !== 'undefined') {
              window.__sareeLoaderDone = true;
              window.dispatchEvent(new CustomEvent('saree-loader-complete'));
            }
            if (onComplete) onComplete();
          }, 550);
        }, 350);
      }
    };

    // Absolute maximum failsafe timer so the loader can NEVER freeze or block the page
    const failsafeTimer = setTimeout(() => {
      setIsDone(true);
      if (typeof window !== 'undefined') {
        window.__sareeLoaderDone = true;
        window.dispatchEvent(new CustomEvent('saree-loader-complete'));
      }
      if (onComplete) onComplete();
    }, (minDuration || 2200) + 800);

    rafId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(failsafeTimer);
    };
  }, [minDuration, onComplete]);

  const handleSkip = () => {
    setIsDone(true);
    if (typeof window !== 'undefined') {
      window.__sareeLoaderDone = true;
      window.dispatchEvent(new CustomEvent('saree-loader-complete'));
    }
    if (onComplete) onComplete();
  };

  // Logo reveals cleanly as the protecting sarees part open in Act 4 (76%+)
  const isLogoRevealed = progress >= 76;

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-[#090303] select-none cursor-pointer"
          onClick={handleSkip}
          initial={{ opacity: 1 }}
          animate={{ opacity: isExiting ? 0 : 1 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Subtle click to enter hint */}
          <div className="absolute top-6 right-6 z-40 text-[10px] text-[#DFC18A]/60 uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full border border-[#35221B] pointer-events-auto">
            Click to Skip ✕
          </div>
          {/* 3D TWISTED SILK SAREE CANVAS */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
          />

          {/* =============================================================== */}
          {/* CENTRAL PROTECTED BRAND LOGO (REVEALED WHEN SAREES PART)        */}
          {/* =============================================================== */}
          <div className="relative z-20 flex flex-col items-center justify-center text-center px-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.72 }}
              animate={{
                opacity: isLogoRevealed ? 1 : 0,
                scale: isLogoRevealed ? 1 : 0.78,
              }}
              transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
              className="relative flex flex-col items-center"
            >
              {logo ? (
                <div className="drop-shadow-[0_20px_60px_rgba(0,0,0,0.95)] transform scale-105 sm:scale-115 md:scale-125 transition-transform duration-500">
                  {React.isValidElement(logo)
                    ? React.cloneElement(logo, { asImage: true, to: null })
                    : logo}
                </div>
              ) : (
                /* Default fallback matching Isai Tarang aesthetic */
                <div className="flex flex-col items-center space-y-3">
                  <svg
                    viewBox="0 0 80 48"
                    className="w-20 h-12 sm:w-24 sm:h-16 text-[#DFC18A] drop-shadow-[0_0_24px_rgba(223,193,138,0.7)]"
                    fill="none"
                  >
                    <path
                      d="M40 4 L48 16 L64 14 L52 26 L58 40 L40 32 L22 40 L28 26 L16 14 L32 16 Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      fill="rgba(223, 193, 138, 0.15)"
                    />
                    <circle cx="40" cy="24" r="4" fill="#FFF3D6" />
                  </svg>
                  <h1
                    className="font-serif text-5xl sm:text-6xl md:text-7xl tracking-[0.24em] font-extrabold uppercase text-transparent bg-clip-text bg-gradient-to-r from-[#DFC18A] via-[#FFF6DE] to-[#C86A27] drop-shadow-[0_10px_35px_rgba(0,0,0,0.95)] pl-[0.24em]"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                  >
                    ISAI TARANG
                  </h1>
                  <p className="text-xs sm:text-sm tracking-[0.42em] uppercase text-[#F5E6BE] font-light">
                    Elegance in Every Thread
                  </p>
                </div>
              )}
            </motion.div>
          </div>

          {/* =============================================================== */}
          {/* MINIMAL GOLD TIMELINE BAR AT BOTTOM (FADES OUT AT REVEAL)       */}
          {/* =============================================================== */}
          <motion.footer
            animate={{ opacity: isLogoRevealed ? 0 : 1 }}
            transition={{ duration: 0.45 }}
            className="absolute bottom-10 left-0 right-0 z-30 px-6 max-w-sm mx-auto space-y-2 text-center pointer-events-none"
          >
            <div className="w-full h-[2px] bg-[#2D1A12]/90 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#8C150D] via-[#DFC18A] to-[#FFF2CC] shadow-[0_0_10px_#DFC18A]"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono">
              <motion.span
                key={stageIndex}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-sans italic tracking-wide text-[#DFC18A]/90 truncate pr-3"
              >
                {WEAVING_STAGES[stageIndex]}
              </motion.span>
              <span className="text-[#FFF2CC] font-bold tracking-widest">
                {progress}%
              </span>
            </div>
          </motion.footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

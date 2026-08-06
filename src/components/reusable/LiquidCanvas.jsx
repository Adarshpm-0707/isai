import React, { useEffect, useRef } from 'react';

/**
 * LiquidCanvas component - Interactive fluid ether particle background canvas
 * inspired by LiquidEther in elfekky-portfolio.
 */
export default function LiquidCanvas({ color = '#D4AF7A', density = 45 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      vx: 0,
      vy: 0,
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = e.clientY - rect.top;
      mouse.vx = newX - mouse.targetX;
      mouse.vy = newY - mouse.targetY;
      mouse.targetX = newX;
      mouse.targetY = newY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Create particles
    const particleCount = density;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      baseRadius: Math.random() * 180 + 60,
      angle: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.008 + 0.003,
      alpha: Math.random() * 0.45 + 0.15,
      pulseSpeed: Math.random() * 0.02 + 0.005,
    }));

    let time = 0;

    const render = () => {
      time += 0.015;

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // Render liquid glow background patches
      const gradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        10,
        mouse.x,
        mouse.y,
        Math.max(width, height) * 0.6
      );
      gradient.addColorStop(0, 'rgba(212, 175, 122, 0.14)');
      gradient.addColorStop(0.4, 'rgba(227, 195, 129, 0.05)');
      gradient.addColorStop(1, 'rgba(6, 15, 11, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Render connected fluid particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.angle += p.speed;

        // Orbital motion around base anchor point
        const offsetX = Math.cos(p.angle + time) * p.baseRadius * 0.3;
        const offsetY = Math.sin(p.angle * 1.2 + time) * p.baseRadius * 0.3;

        const targetPX = p.x + offsetX;
        const targetPY = p.y + offsetY;

        // Mouse influence
        const dx = mouse.x - targetPX;
        const dy = mouse.y - targetPY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 280;

        let pushX = 0;
        let pushY = 0;
        if (dist < maxDist) {
          const force = (1 - dist / maxDist) * 35;
          pushX = -(dx / dist) * force;
          pushY = -(dy / dist) * force;
        }

        const renderX = targetPX + pushX;
        const renderY = targetPY + pushY;

        // Draw particle node
        ctx.beginPath();
        ctx.arc(renderX, renderY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(227, 195, 129, ${p.alpha * (0.6 + Math.sin(time * p.pulseSpeed) * 0.4)})`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = color;
        ctx.fill();

        // Connect nearby particles with subtle liquid lines
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx2 = p2.x - renderX;
          const dy2 = p2.y - renderY;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist2 < 140) {
            const lineAlpha = (1 - dist2 / 140) * 0.18;
            ctx.beginPath();
            ctx.moveTo(renderX, renderY);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(212, 175, 122, ${lineAlpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [color, density]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.9 }}
    />
  );
}

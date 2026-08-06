import React from 'react';

/**
 * GradualBlur component creates a soft, layered depth-of-field gradient blur overlay
 * inspired by elfekky-portfolio.
 *
 * Props:
 * - position: 'top' | 'bottom' | 'both' (default 'both')
 * - height: CSS height string (default '140px')
 * - strength: number multiplier for blur intensity (default 1)
 */
export default function GradualBlur({ position = 'both', height = '140px', strength = 1 }) {
  const steps = [
    { blur: 1 * strength, opacity: 0.1 },
    { blur: 2 * strength, opacity: 0.2 },
    { blur: 4 * strength, opacity: 0.4 },
    { blur: 8 * strength, opacity: 0.7 },
    { blur: 16 * strength, opacity: 1.0 },
  ];

  const renderBlurOverlay = (pos) => {
    const isTop = pos === 'top';
    return (
      <div
        key={pos}
        aria-hidden="true"
        className={`pointer-events-none fixed left-0 right-0 z-40 overflow-hidden ${
          isTop ? 'top-0' : 'bottom-0'
        }`}
        style={{ height }}
      >
        {steps.map((step, idx) => {
          const maskGradient = isTop
            ? `linear-gradient(to bottom, rgba(0,0,0,${step.opacity}) 0%, transparent 100%)`
            : `linear-gradient(to top, rgba(0,0,0,${step.opacity}) 0%, transparent 100%)`;

          return (
            <div
              key={idx}
              className="absolute inset-0 transition-all duration-300"
              style={{
                backdropFilter: `blur(${step.blur}px)`,
                WebkitBackdropFilter: `blur(${step.blur}px)`,
                maskImage: maskGradient,
                WebkitMaskImage: maskGradient,
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <>
      {(position === 'top' || position === 'both') && renderBlurOverlay('top')}
      {(position === 'bottom' || position === 'both') && renderBlurOverlay('bottom')}
    </>
  );
}

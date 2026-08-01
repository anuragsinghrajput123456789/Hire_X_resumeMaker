/**
 * Centralized Motion Architecture - Transitions
 * Duration, Spring Physics, and Easing Curve Presets
 */

// Standard Durations (in seconds)
export const durationFast = 0.15;
export const durationNormal = 0.25;
export const durationSlow = 0.4;
export const durationExtraSlow = 0.6;

// Spring Physics Presets
export const springSmooth = { type: "spring", stiffness: 350, damping: 30 };
export const springBouncy = { type: "spring", stiffness: 450, damping: 25 };
export const springSnappy = { type: "spring", stiffness: 500, damping: 35 };
export const springGentle = { type: "spring", stiffness: 220, damping: 28 };
export const springElastic = { type: "spring", stiffness: 600, damping: 15 };

// Standard Easing Curves
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
export const easeInOutCubic = [0.65, 0, 0.35, 1] as const;
export const easeOutBack = [0.34, 1.56, 0.64, 1] as const;
export const easeFastOutSlowIn = [0.4, 0, 0.2, 1] as const;
export const easeInQuad = [0.55, 0.085, 0.68, 0.53] as const;

// Transition Objects for Motion Variants
export const transitions = {
  fast: { duration: durationFast, ease: easeOutExpo },
  normal: { duration: durationNormal, ease: easeOutExpo },
  slow: { duration: durationSlow, ease: easeOutExpo },
  extraSlow: { duration: durationExtraSlow, ease: easeOutExpo },
  smooth: springSmooth,
  bouncy: springBouncy,
  snappy: springSnappy,
  gentle: springGentle,
  elastic: springElastic,
  easeOutExpo: { duration: durationNormal, ease: easeOutExpo },
  easeInOutCubic: { duration: durationNormal, ease: easeInOutCubic },
  easeOutBack: { duration: durationNormal, ease: easeOutBack },
  stagger: (staggerChildren = 0.05, delayChildren = 0.02) => ({
    staggerChildren,
    delayChildren,
  }),
};

export default transitions;

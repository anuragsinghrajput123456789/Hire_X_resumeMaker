import { Variants } from "framer-motion";

/**
 * Returns a reduced opacity-only variant if reduced motion is requested
 */
export const getReducedMotionVariant = (
  originalVariant: Variants
): Variants => {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.15 },
    },
    exit: { opacity: 0, transition: { duration: 0.1 } },
  };
};

/**
 * Checks if user prefers reduced motion
 */
export const checkPrefersReducedMotion = (): boolean => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export const accessibility = {
  getReducedMotionVariant,
  checkPrefersReducedMotion,
};

export default accessibility;

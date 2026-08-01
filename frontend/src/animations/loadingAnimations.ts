import { Variants } from "framer-motion";
import { durationSlow, easeInOutCubic } from "./transitions";

/** Skeleton Shimmer Effect */
export const skeletonShimmerVariants: Variants = {
  initial: { opacity: 0.5 },
  animate: {
    opacity: [0.4, 0.85, 0.4],
    transition: {
      duration: 1.4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/** Loading Pulse Effect */
export const loadingPulseVariants: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 1.2,
      repeat: Infinity,
      ease: easeInOutCubic,
    },
  },
};

/** AI Typing Bouncing Dots Variants */
export const typingDotVariants: Variants = {
  initial: { y: 0, opacity: 0.4 },
  animate: {
    y: [0, -6, 0],
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export const typingContainerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      repeat: Infinity,
    },
  },
};

/** AI Stream Character Reveal Variants */
export const aiMessageStreamVariants: Variants = {
  hidden: { opacity: 0, y: 4 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: "easeOut" },
  },
};

export const loadingAnimations = {
  skeleton: skeletonShimmerVariants,
  pulse: loadingPulseVariants,
  typingDot: typingDotVariants,
  typingContainer: typingContainerVariants,
  aiStream: aiMessageStreamVariants,
};

export default loadingAnimations;

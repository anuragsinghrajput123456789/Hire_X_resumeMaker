import { Variants } from "framer-motion";

// Standard Spring Configurations
export const springSmooth = { type: "spring", stiffness: 350, damping: 30 };
export const springBouncy = { type: "spring", stiffness: 450, damping: 25 };
export const springSnappy = { type: "spring", stiffness: 500, damping: 35 };

// Standard Easing Curves
export const easeOutExpo = [0.16, 1, 0.3, 1];
export const easeInOutCubic = [0.65, 0, 0.35, 1];
export const easeOutBack = [0.34, 1.56, 0.64, 1];

// Standard Durations
export const durationFast = 0.15;
export const durationNormal = 0.25;
export const durationSlow = 0.4;

// Shared Variants

/** Page Route Transition */
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 10,
    filter: "blur(4px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: durationNormal,
      ease: easeOutExpo,
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    filter: "blur(2px)",
    transition: {
      duration: durationFast,
      ease: [0.4, 0, 1, 1],
    },
  },
};

/** Fade Up Variant for Sections and Cards */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durationNormal, ease: easeOutExpo },
  },
};

/** Fade In Variant */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durationNormal, ease: "easeOut" },
  },
};

/** Scale In Variant for Modals, Cards, Popovers */
export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: durationNormal, ease: easeOutExpo },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: durationFast, ease: "easeIn" },
  },
};

/** Slide In Variants */
export const slideInLeftVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: durationNormal, ease: easeOutExpo },
  },
};

export const slideInRightVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: durationNormal, ease: easeOutExpo },
  },
};

/** Stagger Parent Container */
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.02,
    },
  },
};

/** Stagger Child Item */
export const staggerChildVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durationNormal, ease: easeOutExpo },
  },
};

/** Button Motion Variants */
export const buttonMotionProps = {
  whileHover: { scale: 1.025, y: -1 },
  whileTap: { scale: 0.97, y: 0 },
  transition: springSnappy,
};

/** Card Motion Variants */
export const cardMotionProps = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-30px" },
  whileHover: { y: -4, scale: 1.012 },
  transition: springSmooth,
};

/** Modal Backdrop Variant */
export const modalBackdropVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durationNormal },
  },
  exit: {
    opacity: 0,
    transition: { duration: durationFast },
  },
};

/** Toast Variant */
export const toastVariants: Variants = {
  hidden: { opacity: 0, x: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: springSmooth,
  },
  exit: {
    opacity: 0,
    x: 20,
    scale: 0.96,
    transition: { duration: durationFast },
  },
};

/** AI Typing Bouncing Dots */
export const typingDotVariants: Variants = {
  initial: { y: 0, opacity: 0.4 },
  animate: {
    y: [-3, 3, -3],
    opacity: [0.4, 1, 0.4],
    transition: {
      duration: 0.7,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/** AI Message Streaming Reveal */
export const aiMessageVariants: Variants = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.25, ease: easeOutExpo },
  },
};

/** Error Shake Variant */
export const errorShakeVariants: Variants = {
  shake: {
    x: [0, -6, 6, -4, 4, 0],
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

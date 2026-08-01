import { Variants } from "framer-motion";
import {
  durationFast,
  durationNormal,
  durationSlow,
  easeOutExpo,
  easeOutBack,
  springSmooth,
  springSnappy,
  springBouncy,
} from "./transitions";

/** Fade Variants */
export const fadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durationNormal, ease: "easeOut" },
  },
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durationNormal, ease: easeOutExpo },
  },
};

export const fadeDownVariants: Variants = {
  hidden: { opacity: 0, y: -18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durationNormal, ease: easeOutExpo },
  },
};

export const fadeLeftVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: durationNormal, ease: easeOutExpo },
  },
};

export const fadeRightVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: durationNormal, ease: easeOutExpo },
  },
};

/** Scale Variants */
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

export const scaleOutVariants: Variants = {
  hidden: { opacity: 1, scale: 1 },
  visible: {
    opacity: 0,
    scale: 0.96,
    transition: { duration: durationFast, ease: "easeIn" },
  },
};

/** Slide Variants */
export const slideInLeftVariants: Variants = fadeLeftVariants;
export const slideInRightVariants: Variants = fadeRightVariants;

export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durationNormal, ease: easeOutExpo },
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { duration: durationFast },
  },
};

export const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durationNormal, ease: easeOutExpo },
  },
};

/** Stagger Container & Child Variants */
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

export const staggerChildVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durationNormal, ease: easeOutExpo },
  },
};

/** Modal Backdrop & Content Variants */
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

export const modalContentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: durationNormal, ease: easeOutExpo },
  },
  exit: {
    opacity: 0,
    scale: 0.96,
    y: 8,
    transition: { duration: durationFast, ease: "easeIn" },
  },
};

/** Toast Variants */
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

/** Dropdown Variants */
export const dropdownVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: -4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: durationNormal, ease: easeOutExpo },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -4,
    transition: { duration: durationFast },
  },
};

/** Accordion Variants */
export const accordionVariants: Variants = {
  collapsed: { height: 0, opacity: 0, overflow: "hidden" },
  expanded: {
    height: "auto",
    opacity: 1,
    transition: { duration: durationNormal, ease: easeOutExpo },
  },
};

/** Success & Error Feedback Variants */
export const successPopVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: [0.8, 1.12, 1],
    opacity: 1,
    transition: { duration: 0.35, ease: easeOutBack },
  },
};

export const errorShakeVariants: Variants = {
  shake: {
    x: [0, -6, 6, -4, 4, 0],
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

export const variants = {
  fadeIn: fadeInVariants,
  fadeUp: fadeUpVariants,
  fadeDown: fadeDownVariants,
  fadeLeft: fadeLeftVariants,
  fadeRight: fadeRightVariants,
  scaleIn: scaleInVariants,
  scaleOut: scaleOutVariants,
  slideUp: slideUpVariants,
  slideDown: slideDownVariants,
  staggerContainer: staggerContainerVariants,
  staggerChild: staggerChildVariants,
  modalBackdrop: modalBackdropVariants,
  modalContent: modalContentVariants,
  toast: toastVariants,
  dropdown: dropdownVariants,
  accordion: accordionVariants,
  successPop: successPopVariants,
  errorShake: errorShakeVariants,
};

export default variants;

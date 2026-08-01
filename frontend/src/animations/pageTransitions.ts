import { Variants } from "framer-motion";
import { durationFast, durationNormal, easeOutExpo } from "./transitions";

/** Standard Page Route Transition */
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

/** Cross Fade Page Transition */
export const pageCrossFade: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: durationNormal, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    transition: { duration: durationFast, ease: "easeIn" },
  },
};

/** Slide Up Page Transition */
export const pageSlideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: durationNormal, ease: easeOutExpo },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: { duration: durationFast },
  },
};

export const routeTransitionProps = {
  variants: pageVariants,
  initial: "initial",
  animate: "animate",
  exit: "exit",
};

export const pageTransitions = {
  default: pageVariants,
  crossFade: pageCrossFade,
  slideUp: pageSlideUp,
  props: routeTransitionProps,
};

export default pageTransitions;

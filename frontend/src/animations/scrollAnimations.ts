import { Variants } from "framer-motion";
import { durationNormal, easeOutExpo } from "./transitions";

export const scrollFadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durationNormal, ease: easeOutExpo },
  },
};

export const scrollFadeInVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durationNormal, ease: "easeOut" },
  },
};

export const scrollStaggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

export const scrollSlideLeftVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: durationNormal, ease: easeOutExpo },
  },
};

export const scrollSlideRightVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: durationNormal, ease: easeOutExpo },
  },
};

export const scrollReveal = {
  fadeUp: scrollFadeUpVariants,
  fadeIn: scrollFadeInVariants,
  staggerContainer: scrollStaggerContainerVariants,
  slideLeft: scrollSlideLeftVariants,
  slideRight: scrollSlideRightVariants,
  defaultViewport: { once: true, margin: "-40px" },
};

export default scrollReveal;

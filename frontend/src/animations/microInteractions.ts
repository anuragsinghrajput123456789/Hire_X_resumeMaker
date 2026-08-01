import { Variants } from "framer-motion";
import { springSnappy, springBouncy, easeOutBack } from "./transitions";

/** Checkbox Checkmark Draw Variants */
export const checkmarkVariants: Variants = {
  unchecked: { pathLength: 0, opacity: 0 },
  checked: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
};

/** Switch Toggle Handle Variants */
export const switchToggleVariants: Variants = {
  off: { x: 0 },
  on: {
    x: 20,
    transition: springSnappy,
  },
};

/** Tab Active Indicator Motion Props */
export const activeTabIndicatorProps = {
  layoutId: "activeTabIndicator",
  transition: springSnappy,
};

/** Copy Feedback Pop Variants */
export const copyPopVariants: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: [0.8, 1.15, 1],
    opacity: 1,
    transition: { duration: 0.3, ease: easeOutBack },
  },
};

/** Download Pulse Variants */
export const downloadPopVariants: Variants = {
  idle: { y: 0 },
  downloading: {
    y: [0, 4, -4, 0],
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

export const microInteractions = {
  checkmark: checkmarkVariants,
  switchToggle: switchToggleVariants,
  activeTab: activeTabIndicatorProps,
  copyPop: copyPopVariants,
  downloadPop: downloadPopVariants,
};

export default microInteractions;

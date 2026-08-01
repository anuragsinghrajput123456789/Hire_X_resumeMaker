import { springSmooth, springSnappy, springBouncy } from "./transitions";

/** Button Motion Props */
export const buttonMotionProps = {
  whileHover: { scale: 1.025, y: -1 },
  whileTap: { scale: 0.97, y: 0 },
  transition: springSnappy,
};

/** Card Motion Props */
export const cardMotionProps = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-30px" },
  whileHover: { y: -4, scale: 1.012 },
  transition: springSmooth,
};

/** Badge Motion Props */
export const badgeMotionProps = {
  whileHover: { scale: 1.05, y: -1 },
  whileTap: { scale: 0.95 },
  transition: springSnappy,
};

/** Icon Motion Props */
export const iconMotionProps = {
  whileHover: { scale: 1.15, rotate: 4 },
  whileTap: { scale: 0.9 },
  transition: springBouncy,
};

export const hover = {
  button: buttonMotionProps,
  card: cardMotionProps,
  badge: badgeMotionProps,
  icon: iconMotionProps,
  lift: {
    whileHover: { y: -3, scale: 1.01 },
    transition: springSmooth,
  },
  glow: {
    whileHover: { scale: 1.02, boxShadow: "0 0 25px rgba(0, 242, 254, 0.25)" },
    transition: springSmooth,
  },
};

export default hover;

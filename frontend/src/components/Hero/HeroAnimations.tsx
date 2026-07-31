import React from 'react';
import { Variants, motion, useReducedMotion } from 'framer-motion';

// Common Framer Motion Easing
export const defaultEase = [0.16, 1, 0.3, 1];

// Staggered Container Variant
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

// Fade & Slide Up Variant
export const fadeInUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: defaultEase,
    },
  },
};

// Scale & Fade Variant
export const scaleInVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: defaultEase,
    },
  },
};

// Floating Card Motion Props
export const floatVariants: Variants = {
  initial: { y: 0, rotate: 0 },
  animate: (custom: number = 0) => ({
    y: [0, -10, 0],
    rotate: [0, custom % 2 === 0 ? 1 : -1, 0],
    transition: {
      duration: 6 + (custom % 3),
      repeat: Infinity,
      repeatType: 'reverse',
      ease: 'easeInOut',
      delay: custom * 0.4,
    },
  }),
};

interface AccessibleMotionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const AccessibleFadeIn: React.FC<AccessibleMotionProps> = ({
  children,
  className = '',
  delay = 0,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: defaultEase }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

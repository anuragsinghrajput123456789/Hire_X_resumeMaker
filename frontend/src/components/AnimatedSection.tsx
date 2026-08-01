import React from 'react';
import { motion, useReducedMotion, Variants } from 'framer-motion';
import { fadeUpVariants, staggerContainerVariants } from '@/lib/animations';

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stagger?: boolean;
  variants?: Variants;
  viewportMargin?: string;
}

export const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = "",
  delay = 0,
  stagger = false,
  variants = fadeUpVariants,
  viewportMargin = "-40px"
}) => {
  const selectedVariants = stagger ? staggerContainerVariants : variants;

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: viewportMargin }}
      variants={selectedVariants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

export default AnimatedSection;

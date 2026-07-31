import React from 'react';
import { motion } from 'framer-motion';
import { HeroTypingEffect } from './HeroTypingEffect';

export const HeroHeadline: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-2.5 mb-5"
    >
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-[1.12] font-poppins">
        The Complete{' '}
        <span className="bg-gradient-to-r from-[#8B5CF6] via-[#D946EF] to-[#EC4899] bg-clip-text text-transparent">
          AI Career
        </span>{' '}
        Platform.
      </h1>

      {/* Dynamic Typing Effect Sub-Headline */}
      <div className="flex items-center gap-2 mt-1">
        <HeroTypingEffect />
      </div>

      {/* Supporting Value Proposition Description */}
      <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-[540px] font-normal mt-2">
        Supercharge your job search with neural resume optimization, instant ATS keyword scoring, custom cover letter generation, and real-time AI interview practice.
      </p>
    </motion.div>
  );
};


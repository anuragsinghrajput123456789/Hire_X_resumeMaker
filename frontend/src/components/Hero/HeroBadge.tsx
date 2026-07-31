import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Bot } from 'lucide-react';

interface HeroBadgeProps {
  onBadgeClick?: () => void;
}

export const HeroBadge: React.FC<HeroBadgeProps> = ({ onBadgeClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="inline-flex items-center gap-2 self-start"
    >
      <button
        type="button"
        onClick={onBadgeClick}
        className="group relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.1] hover:border-[#00F2FE]/40 transition-all duration-200 backdrop-blur-md focus:outline-none text-xs font-medium text-slate-300 cursor-pointer overflow-hidden"
        aria-label="Launch Hire-X Interactive AI Career Platform Demo"
      >
        <span className="relative flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00F2FE]/15 text-[10px] font-bold text-[#00F2FE]">
          <Sparkles className="w-3 h-3 text-[#00F2FE]" />
          AI 2.0
        </span>

        <span className="relative text-slate-300 font-medium text-xs flex items-center gap-1.5">
          <Bot className="w-3.5 h-3.5 text-[#8B5CF6]" />
          <span>Next-Gen AI Career Platform</span>
          <span className="text-slate-500 font-normal hidden sm:inline">• Interactive Demo</span>
        </span>

        <ArrowRight className="relative w-3.5 h-3.5 text-slate-400 group-hover:text-white group-hover:translate-x-0.5 transition-transform duration-200" />
      </button>
    </motion.div>
  );
};


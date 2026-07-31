import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroButtonsProps {
  onWatchDemo: () => void;
}

export const HeroButtons: React.FC<HeroButtonsProps> = ({ onWatchDemo }) => {
  const [isPrimaryLoading, setIsPrimaryLoading] = useState(false);

  const handlePrimaryClick = () => {
    setIsPrimaryLoading(true);
    setTimeout(() => setIsPrimaryLoading(false), 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col gap-3.5 mb-6"
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Primary CTA Button */}
        <Link to="/generator" onClick={handlePrimaryClick} className="w-full sm:w-auto">
          <Button
            size="lg"
            disabled={isPrimaryLoading}
            className="btn-premium w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-bold tracking-wide shadow-md flex items-center justify-center gap-2 cursor-pointer focus:ring-2 focus:ring-purple-400/40"
            aria-label="Start Building for Free with Hire-X AI Platform"
          >
            {isPrimaryLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Launching AI Builder...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-white/90" />
                <span>Start Building for Free</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </>
            )}
          </Button>
        </Link>

        {/* Secondary CTA Button */}
        <Button
          type="button"
          size="lg"
          onClick={onWatchDemo}
          className="btn-outline-premium w-full sm:w-auto px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer focus:ring-2 focus:ring-white/20"
          aria-label="Explore AI Features Interactive Demo"
        >
          <div className="w-5 h-5 rounded-full bg-[#00F2FE]/15 border border-[#00F2FE]/30 flex items-center justify-center text-[#00F2FE]">
            <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
          </div>
          <span>Explore AI Features</span>
        </Button>
      </div>

      {/* Trust micro guarantee */}
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-slate-400 font-medium pl-0.5">
        <span className="flex items-center gap-1 text-slate-300">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00F5A0]" />
          Free tier included
        </span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span>No credit card required</span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span>Setup in &lt; 60s</span>
      </div>
    </motion.div>
  );
};


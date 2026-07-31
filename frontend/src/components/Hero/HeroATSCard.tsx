import React from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

export const HeroATSCard: React.FC = () => {
  return (
    <div className="w-full bg-[#0B1020]/80 dark:bg-[#0B1020]/90 backdrop-blur-2xl border border-[#00F2FE]/20 rounded-2xl p-4 shadow-xl relative overflow-hidden group hover:border-[#00F2FE]/40 transition-all duration-300">
      {/* Background glow accent */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-[#00F2FE]/15 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#00F2FE]/15 border border-[#00F2FE]/30 flex items-center justify-center text-[#00F2FE]">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white">ATS Neural Match</div>
            <div className="text-[10px] text-slate-400">Target Role: Senior Software Engineer</div>
          </div>
        </div>

        <span className="text-xs font-black text-[#00F5A0] bg-[#00F5A0]/10 border border-[#00F5A0]/25 px-2.5 py-1 rounded-full flex items-center gap-1">
          <TrendingUp className="w-3 h-3" />
          96% Excellent
        </span>
      </div>

      {/* Progress Metric Bar */}
      <div className="space-y-1.5 mb-3">
        <div className="flex justify-between text-[11px] font-semibold">
          <span className="text-slate-300">Keyword Compatibility</span>
          <span className="text-[#00F2FE] font-bold">96 / 100</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '96%' }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-[#00F2FE] via-[#8B5CF6] to-[#00F5A0] rounded-full shadow-[0_0_10px_#00F2FE]"
          />
        </div>
      </div>

      {/* Extracted Keyword Pills */}
      <div className="flex flex-wrap gap-1.5">
        <span className="px-2 py-0.5 rounded-md bg-[#00F2FE]/10 border border-[#00F2FE]/20 text-[10px] font-bold text-[#00F2FE] flex items-center gap-1">
          <CheckCircle2 className="w-2.5 h-2.5" /> TypeScript
        </span>
        <span className="px-2 py-0.5 rounded-md bg-[#00F2FE]/10 border border-[#00F2FE]/20 text-[10px] font-bold text-[#00F2FE] flex items-center gap-1">
          <CheckCircle2 className="w-2.5 h-2.5" /> System Design
        </span>
        <span className="px-2 py-0.5 rounded-md bg-[#D946EF]/10 border border-[#D946EF]/20 text-[10px] font-bold text-[#D946EF] flex items-center gap-1">
          <AlertCircle className="w-2.5 h-2.5" /> GraphQL (Added)
        </span>
      </div>
    </div>
  );
};

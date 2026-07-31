import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroDashboard } from './HeroDashboard';
import { HeroChat } from './HeroChat';
import { HeroATSCard } from './HeroATSCard';
import { FeatureTabId } from './HeroFeatures';
import { Wand2, Search, Mail, MessageSquare, Bot, Sparkles, CheckCircle2, FileText, ArrowRight } from 'lucide-react';

interface HeroPreviewProps {
  activeTab: FeatureTabId;
  onSelectTab: (tab: FeatureTabId) => void;
}

const TABS: { id: FeatureTabId; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'resume', label: 'Resume AI', icon: Wand2, color: 'text-[#D946EF]' },
  { id: 'analyzer', label: 'ATS Scan', icon: Search, color: 'text-[#00F2FE]' },
  { id: 'cover-letter', label: 'Cover Letter', icon: Mail, color: 'text-[#FF0844]' },
  { id: 'interview', label: 'Interview Prep', icon: Bot, color: 'text-[#00F5A0]' },
  { id: 'assistant', label: 'Career Bot', icon: MessageSquare, color: 'text-[#8B5CF6]' },
];

export const HeroPreview: React.FC<HeroPreviewProps> = ({ activeTab, onSelectTab }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full max-w-2xl mx-auto"
    >
      {/* Outer Glow Background */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#00F2FE]/20 via-[#8B5CF6]/20 to-[#EC4899]/20 rounded-3xl blur-2xl opacity-40 pointer-events-none" />

      {/* Main Interactive AI Showcase Container */}
      <div className="relative z-10 glass-card rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-[#070B19]/90">
        
        {/* Top Control Bar with Feature Tabs */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#050814]/90 border-b border-white/[0.08]">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-white/10 text-white border border-white/15 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${tab.color}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-white/10 shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#00F5A0] animate-pulse" />
            <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">AI Studio</span>
          </div>
        </div>

        {/* Dynamic Display Area with AnimatePresence */}
        <div className="p-4 sm:p-5 min-h-[380px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            {activeTab === 'resume' && (
              <motion.div
                key="resume"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <HeroDashboard activeTab={activeTab} />
              </motion.div>
            )}

            {activeTab === 'analyzer' && (
              <motion.div
                key="analyzer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <HeroATSCard />
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#00F2FE]" />
                    <span className="text-slate-300 font-medium">Auto-detected 6 missing high-yield JD keywords</span>
                  </div>
                  <span className="text-[#00F2FE] font-bold cursor-pointer hover:underline">Apply All</span>
                </div>
              </motion.div>
            )}

            {activeTab === 'assistant' && (
              <motion.div
                key="assistant"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <HeroChat />
              </motion.div>
            )}

            {activeTab === 'cover-letter' && (
              <motion.div
                key="cover-letter"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-3.5"
              >
                <div className="p-4 rounded-xl bg-[#050814] border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#FF0844]" />
                      <span className="text-xs font-extrabold text-white">Targeted Recruiter Cover Letter</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#00F5A0] bg-[#00F5A0]/10 px-2 py-0.5 rounded">98% Fit</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    "Dear Hiring Manager at Stripe, I am writing to express my strong interest in the Senior React Architect position. With over 6 years leading cloud frontend systems..."
                  </p>
                  <div className="flex items-center justify-between pt-2 border-t border-white/[0.06] text-[11px]">
                    <span className="text-slate-400">Tone: Executive & Technical</span>
                    <span className="text-[#00F2FE] font-semibold flex items-center gap-1 cursor-pointer">
                      Copy Draft <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'interview' && (
              <motion.div
                key="interview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-3.5"
              >
                <div className="p-4 rounded-xl bg-[#050814] border border-white/[0.08] space-y-3">
                  <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
                    <div className="flex items-center gap-2">
                      <Bot className="w-4 h-4 text-[#00F5A0]" />
                      <span className="text-xs font-extrabold text-white">AI Mock Interview Simulator</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#00F5A0] bg-[#00F5A0]/10 px-2 py-0.5 rounded">Live Coach</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] text-xs text-slate-300">
                    <span className="text-[#00F5A0] font-bold block mb-1">AI Coach Question:</span>
                    "How do you handle state re-render optimizations when building large-scale micro-frontends?"
                  </div>
                  <div className="p-3 rounded-lg bg-[#00F2FE]/10 border border-[#00F2FE]/20 text-xs text-slate-200">
                    <span className="text-[#00F2FE] font-bold block mb-1">Feedback & Tip:</span>
                    "Strong focus on memoization. Add a quantifiable metric regarding DOM layout paint reduction for +15% impact score."
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-2.5 bg-[#050814]/70 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#00F5A0]" />
            <span>AI model calibrated to hiring benchmarks</span>
          </div>
          <span className="text-slate-500 font-mono text-[10px]">HIRE-X AI v2.4</span>
        </div>
      </div>
    </motion.div>
  );
};


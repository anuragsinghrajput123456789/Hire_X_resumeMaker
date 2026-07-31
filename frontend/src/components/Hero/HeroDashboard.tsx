import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  TrendingUp,
  CheckCircle2,
  FileText,
  Briefcase,
  Award,
  Zap,
  Bot,
  Layers,
} from 'lucide-react';
import { FeatureTabId } from './HeroFeatures';

interface HeroDashboardProps {
  activeTab: FeatureTabId;
}

export const HeroDashboard: React.FC<HeroDashboardProps> = ({ activeTab }) => {
  return (
    <div className="w-full bg-[#070B19]/85 dark:bg-[#070B19]/90 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 sm:p-6 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden group">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-[#00F2FE]/15 via-[#8B5CF6]/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-[#D946EF]/15 via-[#00F5A0]/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Application Bar Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono text-slate-400 pl-2 border-l border-white/10 hidden sm:inline">
            Hire-X Workspace // AI Neural Engine
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-[#00F5A0]/10 border border-[#00F5A0]/30 text-[#00F5A0] text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00F5A0] animate-ping" />
            Live Sync Active
          </span>
        </div>
      </div>

      {/* Metrics Row Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        {/* Metric 1: Resume Score Ring */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-3 flex flex-col items-center justify-center relative overflow-hidden group/metric hover:border-[#00F2FE]/40 transition-all">
          <div className="relative w-14 h-14 flex items-center justify-center my-1">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-white/10"
                strokeWidth="3.5"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <motion.path
                initial={{ strokeDasharray: '0, 100' }}
                animate={{ strokeDasharray: '94, 100' }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="text-[#00F2FE]"
                strokeWidth="3.5"
                strokeDasharray="94, 100"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <span className="absolute text-xs font-black text-white">94</span>
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Resume Score</span>
        </div>

        {/* Metric 2: ATS Score Bar */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-3 flex flex-col justify-between hover:border-[#8B5CF6]/40 transition-all">
          <div className="flex items-center justify-between text-[#8B5CF6]">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-black text-white">96%</span>
          </div>
          <div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
              <div className="w-[96%] h-full bg-[#8B5CF6] rounded-full" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ATS Score</span>
          </div>
        </div>

        {/* Metric 3: Interview Readiness */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-3 flex flex-col justify-between hover:border-[#00F5A0]/40 transition-all">
          <div className="flex items-center justify-between text-[#00F5A0]">
            <Bot className="w-4 h-4" />
            <span className="text-xs font-black text-white">92%</span>
          </div>
          <div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
              <div className="w-[92%] h-full bg-[#00F5A0] rounded-full" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Interview Ready</span>
          </div>
        </div>

        {/* Metric 4: Job Match % */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-3 flex flex-col justify-between hover:border-[#D946EF]/40 transition-all">
          <div className="flex items-center justify-between text-[#D946EF]">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-black text-white">98%</span>
          </div>
          <div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-1">
              <div className="w-[98%] h-full bg-[#D946EF] rounded-full" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Job Match %</span>
          </div>
        </div>
      </div>

      {/* Main Document / Content Preview Area */}
      <div className="bg-[#050814] border border-white/[0.08] rounded-2xl p-4 sm:p-5 relative overflow-hidden">
        <div className="flex items-center justify-between mb-3 border-b border-white/[0.06] pb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#00F2FE]" />
            <span className="text-xs font-extrabold text-white">
              {activeTab === 'resume' && 'AI Resume Optimization Preview'}
              {activeTab === 'analyzer' && 'ATS Keyword Gap Analysis'}
              {activeTab === 'cover-letter' && 'Tailored Cover Letter Generator'}
              {activeTab === 'interview' && 'AI Mock Interview Simulator'}
              {activeTab === 'assistant' && 'Career Guidance Assistant'}
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">FORMAT: ATS-COMPLIANT PDF</span>
        </div>

        {/* Interactive Snippet Content */}
        <div className="space-y-3 font-sans text-xs">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-extrabold text-white flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-[#00F2FE]" />
                Senior Software Architect <span className="text-slate-500">• Stripe</span>
              </span>
              <span className="text-[10px] font-semibold text-[#00F5A0] bg-[#00F5A0]/10 px-2 py-0.5 rounded-full">
                High Impact
              </span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              "Architected multi-tenant cloud microservices scaling to <b className="text-white font-semibold">4.2M daily active users</b>, reducing p99 latency by <b className="text-[#00F5A0]">38%</b> using Go and Kafka."
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#D946EF]" />
              <span className="text-[11px] text-slate-300 font-medium">
                AI Suggestion: Quantify leadership results for +8% ATS Boost
              </span>
            </div>
            <span className="text-[10px] font-bold text-[#D946EF] underline cursor-pointer hover:text-white">
              Apply Fix
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

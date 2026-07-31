import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, Mail, MessageSquare, Award, CheckCircle2 } from 'lucide-react';

export interface WorkflowStep {
  id: number;
  title: string;
  shortDesc: string;
  icon: React.ElementType;
  color: string;
  glow: string;
}

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 1,
    title: 'Resume',
    shortDesc: 'Build & Format',
    icon: FileText,
    color: 'from-[#8B5CF6] to-[#A855F7]',
    glow: 'shadow-purple-500/30',
  },
  {
    id: 2,
    title: 'ATS Scan',
    shortDesc: 'Match & Optimize',
    icon: Search,
    color: 'from-[#00F2FE] to-[#4FACFE]',
    glow: 'shadow-cyan-500/30',
  },
  {
    id: 3,
    title: 'Cover Letter',
    shortDesc: 'AI Auto-Draft',
    icon: Mail,
    color: 'from-[#D946EF] to-[#EC4899]',
    glow: 'shadow-pink-500/30',
  },
  {
    id: 4,
    title: 'Interview Prep',
    shortDesc: 'Mock AI Simulations',
    icon: MessageSquare,
    color: 'from-[#00F5A0] to-[#00D2FF]',
    glow: 'shadow-emerald-500/30',
  },
  {
    id: 5,
    title: 'Career Success',
    shortDesc: 'Get Hired Fast',
    icon: Award,
    color: 'from-[#FF0844] to-[#FF4E50]',
    glow: 'shadow-rose-500/30',
  },
];

export const HeroWorkflow: React.FC = () => {
  const [activeStep, setActiveStep] = useState(1);

  // Auto-progress active step in a smooth loop
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev % WORKFLOW_STEPS.length) + 1);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl rounded-2xl p-4 sm:p-5 shadow-2xl relative overflow-hidden">
      {/* Glow background pulse */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#00F2FE]/5 via-[#8B5CF6]/5 to-[#D946EF]/5 pointer-events-none" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00F2FE] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00F2FE]" />
          </span>
          <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
            End-to-End AI Career Workflow
          </span>
        </div>

        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-slate-400">
          Step {activeStep} of {WORKFLOW_STEPS.length}
        </span>
      </div>

      {/* Progress Track Line */}
      <div className="relative mb-6">
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/[0.08] -translate-y-1/2 rounded-full" />
        <motion.div
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-[#00F2FE] via-[#8B5CF6] to-[#D946EF] -translate-y-1/2 rounded-full transition-all duration-700 ease-out"
          style={{ width: `${((activeStep - 1) / (WORKFLOW_STEPS.length - 1)) * 100}%` }}
        />

        {/* Steps Grid */}
        <div className="relative z-10 flex justify-between items-center">
          {WORKFLOW_STEPS.map((step) => {
            const Icon = step.icon;
            const isActive = activeStep === step.id;
            const isCompleted = activeStep > step.id;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id)}
                className="flex flex-col items-center group cursor-pointer focus:outline-none"
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-br ${step.color} text-white scale-110 shadow-lg ${step.glow} ring-4 ring-white/20`
                      : isCompleted
                      ? 'bg-[#00F5A0]/20 text-[#00F5A0] border border-[#00F5A0]/40'
                      : 'bg-[#070A18] text-slate-500 border border-white/10 hover:border-white/30 hover:text-slate-300'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 text-[#00F5A0]" />
                  ) : (
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>

                {/* Step Title Label */}
                <span
                  className={`text-[11px] font-bold mt-2 transition-colors ${
                    isActive
                      ? 'text-white'
                      : isCompleted
                      ? 'text-slate-300'
                      : 'text-slate-500 group-hover:text-slate-300'
                  }`}
                >
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Details Sub-Card */}
      <AnimatePresence mode="wait">
        {WORKFLOW_STEPS.filter((s) => s.id === activeStep).map((step) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${step.color} text-white`}>
                <step.icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-white">{step.title} Stage</div>
                <div className="text-[11px] text-slate-400">{step.shortDesc}</div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#00F2FE]/15 border border-[#00F2FE]/30 text-[#00F2FE]">
                AI Automated
              </span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

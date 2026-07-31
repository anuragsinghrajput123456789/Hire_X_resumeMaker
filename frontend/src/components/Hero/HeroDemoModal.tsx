import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  UploadCloud,
  FileText,
  Sparkles,
  CheckCircle2,
  TrendingUp,
  Search,
  Mail,
  Bot,
  ArrowRight,
  RotateCcw,
  Zap,
} from 'lucide-react';

interface HeroDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HeroDemoModal: React.FC<HeroDemoModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [score, setScore] = useState(62);
  const [atsScore, setAtsScore] = useState(58);
  const [isSimulating, setIsSimulating] = useState(false);

  // Reset state when opening modal
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setScore(62);
      setAtsScore(58);
      setIsSimulating(false);
    }
  }, [isOpen]);

  const handleStartSimulation = () => {
    setIsSimulating(true);
    setCurrentStep(1);

    // Step 1 -> 2: Upload -> Analyze
    setTimeout(() => {
      setCurrentStep(2);
      setScore(78);
      setAtsScore(74);
    }, 1500);

    // Step 2 -> 3: Score Increase -> ATS Updates
    setTimeout(() => {
      setCurrentStep(3);
      setScore(94);
      setAtsScore(96);
    }, 3200);

    // Step 3 -> 4: AI Improvements -> Cover Letter
    setTimeout(() => {
      setCurrentStep(4);
    }, 4800);

    // Step 4 -> 5: Complete readiness
    setTimeout(() => {
      setCurrentStep(5);
      setIsSimulating(false);
    }, 6200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl bg-[#070B19] border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden z-10 text-white"
        >
          {/* Background Ambient Lights */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#00F2FE]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D946EF]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="mb-6 flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-r from-[#8B5CF6] to-[#D946EF] text-white">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white font-poppins">
                Interactive AI Hero Simulation
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                Experience real-time resume optimization, ATS scoring, and interview preparation.
              </p>
            </div>
          </div>

          {/* Progress Timeline Tracker */}
          <div className="grid grid-cols-5 gap-2 mb-6">
            {[
              { id: 1, label: 'Upload' },
              { id: 2, label: 'Analyze' },
              { id: 3, label: 'ATS Boost' },
              { id: 4, label: 'Cover Letter' },
              { id: 5, label: 'Interview Ready' },
            ].map((st) => (
              <div
                key={st.id}
                className={`p-2 rounded-xl border text-center transition-all duration-300 ${
                  currentStep >= st.id
                    ? 'bg-[#00F2FE]/15 border-[#00F2FE]/40 text-[#00F2FE] font-bold'
                    : 'bg-white/[0.03] border-white/[0.08] text-slate-500'
                }`}
              >
                <div className="text-[10px] font-extrabold uppercase">Step 0{st.id}</div>
                <div className="text-xs truncate">{st.label}</div>
              </div>
            ))}
          </div>

          {/* Interactive Simulation Display Area */}
          <div className="bg-[#050814] border border-white/10 rounded-2xl p-6 mb-6 relative min-h-[260px] flex flex-col justify-center">
            {currentStep === 0 && (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-white/[0.05] border border-white/10 flex items-center justify-center mx-auto text-[#00F2FE] shadow-inner">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Simulate Resume Analysis Flow</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
                    Watch the AI extract skills, calculate your live ATS match rating, and auto-generate tailored application assets.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleStartSimulation}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#00F2FE] via-[#8B5CF6] to-[#D946EF] text-white font-extrabold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-transform cursor-pointer inline-flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>Start Live AI Demo</span>
                </button>
              </div>
            )}

            {currentStep > 0 && (
              <div className="space-y-6">
                {/* Live Scores Gauge Header */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-400">Overall Resume Score</div>
                      <div className="text-2xl font-black text-[#00F2FE] font-poppins">{score} / 100</div>
                    </div>
                    <TrendingUp className="w-6 h-6 text-[#00F2FE]" />
                  </div>

                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-slate-400">ATS Keyword Match</div>
                      <div className="text-2xl font-black text-[#00F5A0] font-poppins">{atsScore}%</div>
                    </div>
                    <Search className="w-6 h-6 text-[#00F5A0]" />
                  </div>
                </div>

                {/* Log Activities */}
                <div className="space-y-2">
                  {currentStep >= 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 rounded-lg bg-[#00F2FE]/10 border border-[#00F2FE]/25 text-xs text-[#00F2FE] flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>Resume uploaded: Senior_Developer_Resume.pdf (Processed in 120ms)</span>
                    </motion.div>
                  )}

                  {currentStep >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/25 text-xs text-[#8B5CF6] flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 shrink-0" />
                      <span>AI Neural Scan completed: 22 technical keywords matched to target JD.</span>
                    </motion.div>
                  )}

                  {currentStep >= 4 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 rounded-lg bg-[#D946EF]/10 border border-[#D946EF]/25 text-xs text-[#D946EF] flex items-center gap-2"
                    >
                      <Mail className="w-4 h-4 shrink-0" />
                      <span>Cover Letter auto-generated & customized for hiring manager outreach.</span>
                    </motion.div>
                  )}

                  {currentStep >= 5 && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 rounded-lg bg-[#00F5A0]/10 border border-[#00F5A0]/25 text-xs text-[#00F5A0] flex items-center gap-2 font-bold"
                    >
                      <Bot className="w-4 h-4 shrink-0" />
                      <span>Candidate ready! AI Mock Interview prep questions unlocked.</span>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer Controls */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleStartSimulation}
              className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Replay Simulation
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold cursor-pointer"
            >
              Close Showcase
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

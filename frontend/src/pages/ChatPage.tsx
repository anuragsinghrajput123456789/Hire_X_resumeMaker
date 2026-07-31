import Chatbot from '../components/Chatbot';
import InterviewWorkspace from '../components/InterviewWorkspace';
import { MessageCircle, Bot, Sparkles, GraduationCap, Zap, Award, BookOpen, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const ChatPage = () => {
  const [viewMode, setViewMode] = useState<'advisor' | 'interview'>('advisor');

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030712] text-slate-100 font-sans pb-16">
       {/* Background Glow Mesh & Grid Elements */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-grid-soft opacity-30"></div>
          <div className="absolute top-[5%] left-[15%] h-[500px] w-[500px] rounded-full bg-cyan-500/10 blur-[150px] animate-pulse"></div>
          <div className="absolute top-[25%] right-[10%] h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[150px]"></div>
          <div className="absolute bottom-[10%] left-[30%] h-[400px] w-[400px] rounded-full bg-pink-500/10 blur-[140px]"></div>
       </div>

      <div className="container relative z-10 mx-auto px-4 py-6 sm:px-6 md:py-10 max-w-7xl">
        {/* Workspace HUD Stats Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 p-3.5 sm:p-4 rounded-2xl glass-card bg-[#0B1020]/80 border border-white/10 shadow-2xl flex flex-wrap items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="relative rounded-xl bg-gradient-to-br from-cyan-400 via-sky-500 to-purple-600 p-[1.5px] shadow-lg shadow-cyan-500/20">
              <div className="bg-[#050814] rounded-xl p-2.5 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400 font-poppins">
                  Hire-X AI Intelligence Suite
                </span>
                <span className="text-[9px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> Live Calibrated
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Neural Career Counseling, STAR Mock Simulations & RAG Knowledge Engine</p>
            </div>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs font-semibold">
            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-xl">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-slate-400">Response Mode:</span>
              <span className="text-white font-extrabold">Ultra-Low Latency</span>
            </div>

            <div className="flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-slate-400">RAG Context:</span>
              <span className="text-purple-300 font-extrabold">Active</span>
            </div>
          </div>
        </motion.div>

        {/* Mode Selector Header */}
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 flex flex-col items-center"
        >
          <div className="relative mb-4 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <h1 className="text-center text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl font-poppins">
              {viewMode === 'advisor' ? (
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-sky-300 to-purple-400">
                  AI Career Assistant
                </span>
              ) : (
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-amber-300">
                  AI Interview Workspace
                </span>
              )}
            </h1>
          </div>
          
          <p className="mx-auto mb-6 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-300">
            {viewMode === 'advisor'
              ? 'Get personalized career guidance, ATS resume point optimization, compensation negotiation strategies, and recruiter outreach.'
              : 'Master job interviews through custom RAG roadmaps, multi-stage mock simulations, live timer HUDs, and granular feedback audits.'
            }
          </p>
          
          {/* Enhanced Unified Mode Selector Header */}
          <div className="grid grid-cols-2 gap-3 max-w-lg w-full bg-[#050814]/80 border border-white/10 p-1.5 rounded-2xl shadow-xl backdrop-blur-xl">
            <button
              onClick={() => setViewMode('advisor')}
              className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer ${
                viewMode === 'advisor' 
                  ? 'bg-gradient-to-r from-cyan-500/20 via-sky-500/20 to-purple-500/20 border border-cyan-400/40 text-white shadow-lg shadow-cyan-500/10 font-bold' 
                  : 'text-slate-400 hover:text-white border border-transparent hover:bg-white/[0.03] font-medium'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${viewMode === 'advisor' ? 'bg-cyan-500/20 text-cyan-300' : 'bg-white/5 text-slate-400'}`}>
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold font-poppins">Career Advisor</span>
                <span className="text-[9px] text-slate-400 font-medium">Chat & Audit Studio</span>
              </div>
            </button>

            <button
              onClick={() => setViewMode('interview')}
              className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer ${
                viewMode === 'interview' 
                  ? 'bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20 border border-purple-400/40 text-white shadow-lg shadow-purple-500/10 font-bold' 
                  : 'text-slate-400 hover:text-white border border-transparent hover:bg-white/[0.03] font-medium'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${viewMode === 'interview' ? 'bg-purple-500/20 text-purple-300' : 'bg-white/5 text-slate-400'}`}>
                <GraduationCap className="w-4 h-4" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold font-poppins">Interview Workspace</span>
                <span className="text-[9px] text-slate-400 font-medium">RAG Mock Simulations</span>
              </div>
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
           key={viewMode}
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.4 }}
        >
           {viewMode === 'advisor' ? <Chatbot /> : <InterviewWorkspace />}
        </motion.div>
      </div>
    </div>
  );
};

export default ChatPage;

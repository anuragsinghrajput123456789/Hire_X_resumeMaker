import Chatbot from '../components/Chatbot';
import InterviewWorkspace from '../components/InterviewWorkspace';
import { MessageCircle, Bot, Sparkles, HelpCircle, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

const ChatPage = () => {
  const [viewMode, setViewMode] = useState<'advisor' | 'interview'>('advisor');

  return (
    <div className="relative min-h-screen overflow-hidden bg-career-gradient">
       {/* Background Elements */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute inset-0 bg-grid-soft"></div>
          <div className="absolute top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-cyan-500/5 blur-[120px]"></div>
          <div className="absolute top-[40%] -right-[10%] h-[40%] w-[40%] rounded-full bg-sky-500/5 blur-[120px]"></div>
       </div>

      <div className="container relative z-10 mx-auto px-4 py-8 sm:px-6 md:py-12 max-w-6xl">
        {/* Enhanced Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 flex flex-col items-center"
        >
          <div className="relative mb-6 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <div className="absolute inset-0 rounded-full bg-cyan-500/10 blur-xl"></div>
            <div className="relative rounded-2xl bg-gradient-to-br from-cyan-400 to-sky-500 p-3.5 shadow-xl shadow-cyan-500/10">
              <MessageCircle className="w-8 h-8 text-white animate-pulse" />
            </div>
            <h1 className="text-center text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
              {viewMode === 'advisor' ? 'AI Career Assistant' : 'AI Interview Workspace'}
            </h1>
          </div>
          
          <p className="mx-auto mb-6 max-w-2xl text-sm sm:text-base leading-relaxed text-gray-300">
            {viewMode === 'advisor'
              ? 'Get personalized career advice, resume tips, and job search strategy from our neural career counselor.'
              : 'Evolve your interview readiness with customized RAG roadmaps, mock simulations, and skill gap metrics.'
            }
          </p>
          
          {/* Unified Mode Selector Header */}
          <div className="grid grid-cols-2 gap-4 max-w-md w-full bg-white/[0.02] border border-white/[0.06] p-1.5 rounded-2xl mb-4">
            <button
              onClick={() => setViewMode('advisor')}
              className={`py-3.5 px-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                viewMode === 'advisor' 
                  ? 'bg-gradient-to-r from-cyan-500/10 to-sky-500/10 border border-cyan-500/20 text-white shadow-lg font-bold' 
                  : 'text-slate-400 hover:text-slate-200 border border-transparent font-medium'
              }`}
            >
              <Bot className="w-5 h-5 text-cyan-400" />
              <span className="text-xs">Career Advisor Chat</span>
            </button>
            <button
              onClick={() => setViewMode('interview')}
              className={`py-3.5 px-4 rounded-xl flex flex-col items-center gap-2 transition-all ${
                viewMode === 'interview' 
                  ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-white shadow-lg font-bold' 
                  : 'text-slate-400 hover:text-slate-200 border border-transparent font-medium'
              }`}
            >
              <GraduationCap className="w-5 h-5 text-purple-400" />
              <span className="text-xs">Interview Preparation</span>
            </button>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ delay: 0.2, duration: 0.6 }}
        >
           {viewMode === 'advisor' ? <Chatbot /> : <InterviewWorkspace />}
        </motion.div>
      </div>
    </div>
  );
};

export default ChatPage;

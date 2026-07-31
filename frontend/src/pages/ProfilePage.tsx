import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Shield, Sparkles, Zap, ArrowRight, FileText, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import AIUsageWidget from '../components/AIUsageWidget';

const ProfilePage = () => {
  const authContext = useContext(AuthContext);
  const user = authContext?.user;

  return (
    <div className="relative min-h-screen overflow-hidden bg-career-gradient pb-16">
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute inset-0 bg-grid-soft"></div>
        <div className="absolute top-[10%] left-[20%] h-[50%] w-[50%] rounded-full bg-violet-500/10 blur-[140px]"></div>
        <div className="absolute top-[40%] right-[10%] h-[40%] w-[40%] rounded-full bg-pink-500/10 blur-[140px]"></div>
      </div>

      <div className="container relative z-10 mx-auto px-4 py-8 sm:px-6 md:py-12 max-w-5xl space-y-8">
        {/* Profile User Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="p-6 md:p-8 rounded-2xl border border-white/10 bg-[#0F1424]/80 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-violet-500/20 to-pink-500/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left">
              {/* User Avatar */}
              <div className="relative">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00F2FE] via-[#8B5CF6] to-[#EC4899] p-1 shadow-lg shadow-violet-500/20 flex items-center justify-center">
                  <div className="w-full h-full rounded-[14px] bg-[#0A0D1A] flex items-center justify-center text-white">
                    <User className="w-9 h-9 text-violet-400" />
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 border-2 border-[#0A0D1A] text-white">
                  <Shield className="w-3 h-3" />
                </div>
              </div>

              {/* User Info */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <h1 className="text-2xl md:text-3xl font-black text-white">{user?.name || 'User Profile'}</h1>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-bold uppercase tracking-wider">
                    Free Tier
                  </span>
                </div>
                <p className="text-sm text-gray-400 flex items-center justify-center md:justify-start gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-gray-500" />
                  {user?.email || 'user@example.com'}
                </p>
                <p className="text-xs text-gray-500 pt-1">
                  Account Protected by Hire-X AI Security Layer
                </p>
              </div>
            </div>

            {/* Quick Action Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <Link to="/generator">
                <button className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-300 hover:text-white transition-all flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-violet-400" />
                  Resume Generator
                </button>
              </Link>
              <Link to="/chat">
                <button className="px-3.5 py-2 rounded-xl bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 text-xs font-bold text-violet-300 transition-all flex items-center gap-1.5">
                  <MessageCircle className="w-3.5 h-3.5 text-violet-400" />
                  AI Chat
                </button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* AI Usage & Quotas Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-400" />
              AI Usage & Quotas Dashboard
            </h2>
          </div>

          {/* Full Dashboard Widget */}
          <AIUsageWidget />
        </motion.div>
      </div>
    </div>
  );
};

export default ProfilePage;

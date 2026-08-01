import React from 'react';
import { motion } from 'framer-motion';
import { Star, ShieldCheck, Sparkles, CheckCircle2, Lock, Zap } from 'lucide-react';

const FEATURED_COMPANIES = [
  'Stripe', 'Google', 'Meta', 'Amazon', 'Microsoft', 'Netflix'
];

export const HeroTrust: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="pt-5 border-t border-white/[0.08] mt-2"
    >
      {/* Social Proof Header & Rating */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
          <span className="text-xs font-bold text-white">4.9/5</span>
          <span className="text-xs text-slate-400 font-medium">(14,000+ candidate hires)</span>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-bold text-[#00F5A0] bg-[#00F5A0]/10 border border-[#00F5A0]/25 px-2.5 py-0.5 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>ATS Verified System</span>
        </div>
      </div>

      {/* Company Pills */}
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
          Candidates hired at top companies:
        </p>
        <div className="flex flex-wrap items-center gap-1.5">
          {FEATURED_COMPANIES.map((company) => (
            <span
              key={company}
              className="text-xs font-extrabold text-slate-300 bg-white/[0.04] border border-white/[0.08] hover:border-white/20 hover:text-white px-3 py-1 rounded-xl transition-all duration-300 shadow-sm"
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};



import React from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  CheckCircle2,
  Lock,
  Zap,
  ShieldCheck,
  Smartphone,
} from 'lucide-react';

const TRUST_BADGES = [
  { label: 'AI Powered', icon: Cpu, color: 'text-[#00F2FE]' },
  { label: 'ATS Optimized', icon: CheckCircle2, color: 'text-[#00F5A0]' },
  { label: 'Privacy First', icon: Lock, color: 'text-[#8B5CF6]' },
  { label: 'Fast Analysis', icon: Zap, color: 'text-[#FF0844]' },
  { label: 'Secure Platform', icon: ShieldCheck, color: 'text-[#D946EF]' },
  { label: 'Responsive Design', icon: Smartphone, color: 'text-[#4FACFE]' },
];

export const HeroTrust: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="pt-4 border-t border-white/[0.06]"
    >
      <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#00F5A0]" />
        <span>Enterprise Platform Guarantees</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {TRUST_BADGES.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-colors"
            >
              <Icon className={`w-3.5 h-3.5 ${item.color} shrink-0`} />
              <span className="text-[11px] font-medium text-slate-300">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};


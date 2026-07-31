import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, Search, Mail, MessageSquare, Bot, ArrowUpRight } from 'lucide-react';

export type FeatureTabId = 'resume' | 'analyzer' | 'cover-letter' | 'interview' | 'assistant';

interface FeatureItem {
  id: FeatureTabId;
  label: string;
  badge: string;
  icon: React.ElementType;
  color: string;
  activeBg: string;
  activeBorder: string;
}

const FEATURE_TABS: FeatureItem[] = [
  {
    id: 'resume',
    label: 'Resume Builder',
    badge: 'Step-by-step AI',
    icon: Wand2,
    color: 'text-[#D946EF]',
    activeBg: 'bg-[#D946EF]/15',
    activeBorder: 'border-[#D946EF]/50',
  },
  {
    id: 'analyzer',
    label: 'ATS Score',
    badge: 'Neural Scan',
    icon: Search,
    color: 'text-[#00F2FE]',
    activeBg: 'bg-[#00F2FE]/15',
    activeBorder: 'border-[#00F2FE]/50',
  },
  {
    id: 'cover-letter',
    label: 'Cover Letter',
    badge: '1-Click Match',
    icon: Mail,
    color: 'text-[#FF0844]',
    activeBg: 'bg-[#FF0844]/15',
    activeBorder: 'border-[#FF0844]/50',
  },
  {
    id: 'interview',
    label: 'Interview AI',
    badge: 'Mock Coach',
    icon: Bot,
    color: 'text-[#00F5A0]',
    activeBg: 'bg-[#00F5A0]/15',
    activeBorder: 'border-[#00F5A0]/50',
  },
  {
    id: 'assistant',
    label: 'Career Bot',
    badge: '24/7 Advisor',
    icon: MessageSquare,
    color: 'text-[#8B5CF6]',
    activeBg: 'bg-[#8B5CF6]/15',
    activeBorder: 'border-[#8B5CF6]/50',
  },
];

interface HeroFeaturesProps {
  activeTab: FeatureTabId;
  onSelectTab: (tab: FeatureTabId) => void;
}

export const HeroFeatures: React.FC<HeroFeaturesProps> = ({ activeTab, onSelectTab }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="mb-8"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00F2FE]" />
          Explore Platform Capabilities:
        </span>
        <span className="text-[11px] text-slate-500 font-medium hidden sm:inline">Click to switch live preview</span>
      </div>

      <div className="flex flex-wrap gap-2">
        {FEATURE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`group relative flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all duration-300 cursor-pointer ${
                isActive
                  ? `${tab.activeBg} ${tab.activeBorder} text-white shadow-lg shadow-black/40 scale-[1.02]`
                  : 'bg-white/[0.03] border-white/[0.08] hover:border-white/20 text-slate-300 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${tab.color}`} />
              <span>{tab.label}</span>
              {isActive && (
                <motion.span
                  layoutId="activeFeatureBadge"
                  className="px-1.5 py-0.5 rounded-md bg-white/20 text-[9px] font-black uppercase text-white tracking-wider ml-0.5"
                >
                  Active
                </motion.span>
              )}
            </button>
          );
        })}
      </div>
    </motion.div>
  );
};

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Wand2,
  Search,
  Mail,
  Bot,
  MessageSquare,
  Target,
  Sparkles,
  TrendingUp,
  Award,
} from 'lucide-react';

interface FloatingCardData {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconBg: string;
  textColor: string;
  borderColor: string;
  positionClass: string;
  floatClass: string;
}

const FLOATING_CARDS: FloatingCardData[] = [
  {
    id: 'resume-builder',
    title: 'AI Resume Builder',
    subtitle: 'ATS-Optimized Formatting',
    icon: Wand2,
    iconBg: 'bg-[#D946EF]/15 text-[#D946EF] border-[#D946EF]/30',
    textColor: 'text-white',
    borderColor: 'border-[#D946EF]/30 hover:border-[#D946EF]/60',
    positionClass: '-top-6 -left-6 sm:-top-8 sm:-left-8',
    floatClass: 'animate-float',
  },
  {
    id: 'ats-score',
    title: 'ATS Score 96%',
    subtitle: 'Instant Keyword Scan',
    icon: Search,
    iconBg: 'bg-[#00F2FE]/15 text-[#00F2FE] border-[#00F2FE]/30',
    textColor: 'text-[#00F2FE]',
    borderColor: 'border-[#00F2FE]/30 hover:border-[#00F2FE]/60',
    positionClass: '-top-7 -right-4 sm:-top-10 sm:-right-6',
    floatClass: 'animate-float-delayed',
  },
  {
    id: 'interview-ai',
    title: 'Interview AI',
    subtitle: 'Real-time Mock Prep',
    icon: Bot,
    iconBg: 'bg-[#00F5A0]/15 text-[#00F5A0] border-[#00F5A0]/30',
    textColor: 'text-white',
    borderColor: 'border-[#00F5A0]/30 hover:border-[#00F5A0]/60',
    positionClass: '-bottom-6 -left-6 sm:-bottom-8 sm:-left-8',
    floatClass: 'animate-float-reverse',
  },
  {
    id: 'job-match',
    title: '98% Job Match',
    subtitle: 'Tailored Applications',
    icon: Target,
    iconBg: 'bg-[#FF0844]/15 text-[#FF0844] border-[#FF0844]/30',
    textColor: 'text-[#FF0844]',
    borderColor: 'border-[#FF0844]/30 hover:border-[#FF0844]/60',
    positionClass: '-bottom-7 -right-4 sm:-bottom-10 sm:-right-6',
    floatClass: 'animate-float-delayed',
  },
];

export const HeroFloatingCards: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      {FLOATING_CARDS.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.id}
            className={`absolute ${card.positionClass} ${
              shouldReduceMotion ? '' : card.floatClass
            } pointer-events-auto hidden md:block`}
          >
            <motion.div
              whileHover={{ scale: 1.05, y: -4, rotate: 1 }}
              transition={{ duration: 0.25 }}
              className={`glass-card border rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl backdrop-blur-xl transition-colors duration-300 ${card.borderColor}`}
            >
              <div
                className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-sm ${card.iconBg}`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className={`text-xs font-extrabold tracking-tight ${card.textColor}`}>
                  {card.title}
                </div>
                <div className="text-[10px] font-semibold text-slate-400">
                  {card.subtitle}
                </div>
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Sparkles, CheckCircle2, Loader2, MessageSquareText } from 'lucide-react';

interface ChatMessage {
  id: number;
  text: string;
  isComplete: boolean;
  statusType: 'loading' | 'success' | 'highlight';
}

const CHAT_SEQUENCE: { text: string; statusType: 'loading' | 'success' | 'highlight' }[] = [
  { text: 'Analyzing uploaded resume document...', statusType: 'loading' },
  { text: '✓ 18 core technical skills extracted', statusType: 'success' },
  { text: '✓ ATS Match Score verified: 92%', statusType: 'highlight' },
  { text: '✓ Identified 3 high-value missing keywords', statusType: 'success' },
  { text: '✓ Personalized Cover Letter generated & ready', statusType: 'highlight' },
];

export const HeroChat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (currentIndex < CHAT_SEQUENCE.length) {
      const step = CHAT_SEQUENCE[currentIndex];
      
      // Push message into list
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          text: step.text,
          isComplete: true,
          statusType: step.statusType,
        },
      ]);

      timer = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
      }, 1800);
    } else {
      // Loop sequence smoothly after pause
      timer = setTimeout(() => {
        setMessages([]);
        setCurrentIndex(0);
      }, 3500);
    }

    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div className="w-full bg-[#0B1020]/80 dark:bg-[#0B1020]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#00F2FE]/15 border border-[#00F2FE]/30 flex items-center justify-center text-[#00F2FE]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Hire-X AI Assistant</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F5A0] animate-pulse" />
            </div>
            <div className="text-[10px] text-slate-400">Live Resume Stream</div>
          </div>
        </div>

        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#8B5CF6] flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 animate-spin" />
          Streaming
        </span>
      </div>

      {/* Messages Stream Container */}
      <div className="space-y-2 min-h-[140px] flex flex-col justify-end">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, x: -10, y: 5 }}
              animate={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.3 }}
              className={`p-2.5 rounded-xl border text-xs font-medium flex items-start gap-2.5 ${
                msg.statusType === 'highlight'
                  ? 'bg-gradient-to-r from-[#00F2FE]/10 to-[#8B5CF6]/10 border-[#00F2FE]/30 text-white font-bold'
                  : msg.statusType === 'success'
                  ? 'bg-white/[0.03] border-white/[0.08] text-slate-200'
                  : 'bg-white/[0.02] border-white/[0.05] text-slate-400'
              }`}
            >
              {msg.statusType === 'highlight' ? (
                <Sparkles className="w-4 h-4 text-[#00F2FE] shrink-0 mt-0.5" />
              ) : msg.statusType === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-[#00F5A0] shrink-0 mt-0.5" />
              ) : (
                <Loader2 className="w-4 h-4 text-[#8B5CF6] animate-spin shrink-0 mt-0.5" />
              )}
              <span className="leading-snug">{msg.text}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

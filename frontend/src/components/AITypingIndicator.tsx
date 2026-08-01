import React from 'react';
import { motion } from 'framer-motion';

export const AITypingIndicator: React.FC<{ label?: string }> = ({ label = "AI is thinking..." }) => {
  return (
    <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] w-fit backdrop-blur-md">
      <div className="flex items-center gap-1">
        {[0, 1, 2].map((idx) => (
          <motion.span
            key={idx}
            className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#00F2FE] to-[#D946EF]"
            animate={{
              y: [-2, 2, -2],
              opacity: [0.4, 1, 0.4],
              scale: [0.8, 1.1, 0.8],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: idx * 0.18,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <span className="text-xs font-semibold text-slate-400 font-mono tracking-tight">{label}</span>
    </div>
  );
};

export default AITypingIndicator;

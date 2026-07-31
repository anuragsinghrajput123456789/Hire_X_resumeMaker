import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TYPING_MESSAGES = [
  'Build an ATS-Friendly Resume',
  'Generate Personalized Cover Letters',
  'Prepare for Interviews with AI',
  'Analyze Any Job Description',
  'Improve Your ATS Score',
  'Get Hired Faster with AI',
];

export const HeroTypingEffect: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentFullText = TYPING_MESSAGES[messageIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayedText.length < currentFullText.length) {
        timer = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length + 1));
        }, 45);
      } else {
        // Pause at full text before deleting
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (displayedText.length > 0) {
        timer = setTimeout(() => {
          setDisplayedText(currentFullText.slice(0, displayedText.length - 1));
        }, 25);
      } else {
        setIsDeleting(false);
        setMessageIndex((prev) => (prev + 1) % TYPING_MESSAGES.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, messageIndex]);

  return (
    <div
      className="inline-flex items-center min-h-[44px] text-lg sm:text-xl md:text-2xl font-bold tracking-tight text-[#00F2FE] font-poppins"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="bg-gradient-to-r from-[#00F2FE] via-[#4FACFE] to-[#8B5CF6] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(0,242,254,0.3)]">
        {displayedText}
      </span>
      {/* Animated Glowing Cursor */}
      <span
        className="inline-block w-2.5 h-6 sm:h-7 ml-1.5 bg-[#00F2FE] rounded-xs animate-cursor shadow-[0_0_10px_#00F2FE]"
        aria-hidden="true"
      />
    </div>
  );
};

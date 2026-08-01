import React, { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { springSmooth } from '@/lib/animations';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  enableTilt?: boolean;
}

export const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className = "",
  glowColor = "rgba(0, 242, 254, 0.12)",
  enableTilt = true
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const checkIsMobile = () => {
      const isCoarse = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
      setIsMobile(isCoarse || !!shouldReduceMotion);
    };
    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, [shouldReduceMotion]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (enableTilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3;
      const rotateY = ((x - centerX) / centerX) * 3;
      setRotate({ x: rotateX, y: rotateY });
    }
  };

  const handleMouseEnter = () => {
    if (!isMobile) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: isHovered ? rotate.x : 0,
        rotateY: isHovered ? rotate.y : 0,
        y: isHovered ? -3 : 0,
        scale: isHovered ? 1.012 : 1,
      }}
      transition={springSmooth}
      style={{ transformStyle: 'preserve-3d' }}
      className={`relative overflow-hidden transition-shadow duration-300 ${className}`}
    >
      {/* Dynamic Cursor Follow Glow */}
      {!isMobile && (
        <div
          className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300 z-0"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(350px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 80%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default InteractiveCard;

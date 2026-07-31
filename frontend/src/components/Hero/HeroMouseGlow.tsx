import React, { useEffect, useState, useRef } from 'react';

interface HeroMouseGlowProps {
  children: React.ReactNode;
  className?: string;
}

export const HeroMouseGlow: React.FC<HeroMouseGlowProps> = ({ children, className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if device supports fine cursor (mouse) or reduced motion
    const checkIsMobile = () => {
      const isCoarse = window.matchMedia('(pointer: coarse)').matches || window.innerWidth < 768;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      setIsMobile(isCoarse || prefersReduced);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => {
    if (!isMobile) setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  if (isMobile) {
    return <div className={`relative ${className}`}>{children}</div>;
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative ${className}`}
    >
      {/* Interactive mouse follow spotlight glow */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-500 z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(0, 242, 254, 0.12), rgba(139, 92, 246, 0.08) 40%, transparent 80%)`,
        }}
      />

      {/* Subtle spotlight ring */}
      <div
        className="pointer-events-none absolute -inset-px rounded-3xl transition-opacity duration-300 z-0"
        style={{
          opacity: isHovered ? 0.6 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(217, 70, 239, 0.08), transparent 70%)`,
        }}
      />

      {/* Children elements with higher z-index */}
      <div className="relative z-10">{children}</div>
    </div>
  );
};


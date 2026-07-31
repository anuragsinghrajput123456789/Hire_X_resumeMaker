import React from 'react';

export const HeroBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* Dynamic Theme Radial Mesh Gradients */}
      <div className="absolute inset-0 dark:bg-[#050816] bg-slate-950 transition-colors duration-500" />

      {/* Primary Ambient Glowing Blur Orbs */}
      <div className="ambient-orb w-[500px] h-[500px] -top-24 -left-20 bg-gradient-to-tr from-[#00F2FE]/25 via-[#8B5CF6]/20 to-transparent blur-[120px] dark:opacity-60 opacity-40" />
      <div className="ambient-orb w-[550px] h-[550px] top-1/4 -right-28 bg-gradient-to-br from-[#D946EF]/20 via-[#FF0844]/15 to-transparent blur-[140px] dark:opacity-50 opacity-30" />
      <div className="ambient-orb w-[450px] h-[450px] -bottom-20 left-1/3 bg-gradient-to-t from-[#00F5A0]/15 via-[#4FACFE]/20 to-transparent blur-[110px] dark:opacity-50 opacity-30" />

      {/* Precision Grid Pattern with Vignette Fade */}
      <div className="absolute inset-0 bg-grid-soft opacity-40 dark:opacity-50 mix-blend-screen" />

      {/* Soft Glow Radial Core Center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-r from-[#00F2FE]/5 via-[#8B5CF6]/5 to-[#D946EF]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Top & Bottom Subtle Fade Shadows */}
      <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-[#050816] to-transparent opacity-80" />
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-[#050816] to-transparent opacity-90" />
    </div>
  );
};

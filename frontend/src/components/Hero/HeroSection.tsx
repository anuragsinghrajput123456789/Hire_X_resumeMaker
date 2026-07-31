import React, { useState } from 'react';
import { HeroBackground } from './HeroBackground';
import { HeroMouseGlow } from './HeroMouseGlow';
import { HeroContent } from './HeroContent';
import { HeroButtons } from './HeroButtons';
import { HeroTrust } from './HeroTrust';
import { HeroPreview } from './HeroPreview';
import { HeroDemoModal } from './HeroDemoModal';
import { FeatureTabId } from './HeroFeatures';

export const HeroSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<FeatureTabId>('resume');
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);

  const handleOpenDemo = () => setIsDemoModalOpen(true);
  const handleCloseDemo = () => setIsDemoModalOpen(false);

  return (
    <section className="relative px-4 sm:px-6 md:px-8 pt-8 pb-12 md:pt-12 md:pb-16 lg:pt-16 lg:pb-20 z-10 max-w-7xl mx-auto overflow-hidden">
      {/* Background layer stack */}
      <HeroBackground />

      {/* Interactive Desktop Spotlight Glow & Depth Wrapper */}
      <HeroMouseGlow>
        {/* Balanced Two-Column Hero Grid */}
        <div className="relative z-10 grid gap-8 lg:gap-12 lg:grid-cols-12 items-center">
          
          {/* LEFT COLUMN: Core Value Proposition & CTAs */}
          <div className="flex flex-col lg:col-span-5">
            {/* Badge & Headline with Live Typing Effect */}
            <HeroContent onOpenDemo={handleOpenDemo} />

            {/* Primary & Secondary Call to Actions */}
            <HeroButtons onWatchDemo={handleOpenDemo} />

            {/* Trust Indicators Strip */}
            <HeroTrust />
          </div>

          {/* RIGHT COLUMN: Interactive AI Showcase Studio */}
          <div className="w-full mt-4 lg:mt-0 lg:col-span-7">
            <HeroPreview activeTab={activeTab} onSelectTab={setActiveTab} />
          </div>
        </div>
      </HeroMouseGlow>

      {/* Interactive AI Hero Step-by-Step Demo Modal */}
      <HeroDemoModal isOpen={isDemoModalOpen} onClose={handleCloseDemo} />
    </section>
  );
};


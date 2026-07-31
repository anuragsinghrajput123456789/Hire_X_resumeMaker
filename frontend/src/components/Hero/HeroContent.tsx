import React from 'react';
import { HeroBadge } from './HeroBadge';
import { HeroHeadline } from './HeroHeadline';

interface HeroContentProps {
  onOpenDemo?: () => void;
}

export const HeroContent: React.FC<HeroContentProps> = ({ onOpenDemo }) => {
  return (
    <div className="flex flex-col">
      {/* AI Announcement Badge */}
      <div className="mb-5">
        <HeroBadge onBadgeClick={onOpenDemo} />
      </div>

      {/* Main SaaS Headline & Sub-Headline Typing Effect */}
      <HeroHeadline />
    </div>
  );
};

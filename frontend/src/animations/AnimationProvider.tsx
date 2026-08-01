import React, { createContext, useContext } from "react";
import { MotionConfig } from "framer-motion";
import { transitions } from "./transitions";
import { variants } from "./variants";
import { hover } from "./hoverEffects";

export interface AnimationContextType {
  transitions: typeof transitions;
  variants: typeof variants;
  hover: typeof hover;
  reducedMotion: "user" | "always" | "never";
}

const AnimationContext = createContext<AnimationContextType>({
  transitions,
  variants,
  hover,
  reducedMotion: "never",
});

export interface AnimationProviderProps {
  children: React.ReactNode;
  reducedMotion?: "user" | "always" | "never";
}

export const AnimationProvider: React.FC<AnimationProviderProps> = ({
  children,
  reducedMotion = "never",
}) => {
  return (
    <AnimationContext.Provider
      value={{
        transitions,
        variants,
        hover,
        reducedMotion,
      }}
    >
      <MotionConfig reducedMotion={reducedMotion}>{children}</MotionConfig>
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => useContext(AnimationContext);

export default AnimationProvider;

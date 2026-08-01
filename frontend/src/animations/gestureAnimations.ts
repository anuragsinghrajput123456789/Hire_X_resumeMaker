import React from "react";

export interface TiltCoordinates {
  rotateX: number;
  rotateY: number;
  glowX: number;
  glowY: number;
}

/**
 * Calculates 3D tilt angles and lighting glow offset based on mouse pointer position
 */
export const calculateCardTilt = (
  e: React.MouseEvent<HTMLDivElement>,
  maxTiltDegrees = 8
): TiltCoordinates => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = -((y - centerY) / centerY) * maxTiltDegrees;
  const rotateY = ((x - centerX) / centerX) * maxTiltDegrees;

  const glowX = (x / rect.width) * 100;
  const glowY = (y / rect.height) * 100;

  return { rotateX, rotateY, glowX, glowY };
};

/**
 * Detects desktop pointers with hover support (ignores touch screens for 3D tilt)
 */
export const isDesktopPointer = (): boolean => {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
};

export const gestures = {
  calculateCardTilt,
  isDesktopPointer,
};

export default gestures;

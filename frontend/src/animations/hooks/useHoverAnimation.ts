import { useState, useCallback } from "react";
import { calculateCardTilt, isDesktopPointer, TiltCoordinates } from "../gestureAnimations";

export const useHoverAnimation = (maxTiltDegrees = 8) => {
  const [tilt, setTilt] = useState<TiltCoordinates>({
    rotateX: 0,
    rotateY: 0,
    glowX: 50,
    glowY: 50,
  });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isDesktopPointer()) return;
      const coords = calculateCardTilt(e, maxTiltDegrees);
      setTilt(coords);
    },
    [maxTiltDegrees]
  );

  const handleMouseEnter = useCallback(() => {
    if (!isDesktopPointer()) return;
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ rotateX: 0, rotateY: 0, glowX: 50, glowY: 50 });
  }, []);

  return {
    tilt,
    isHovered,
    bind: {
      onMouseMove: handleMouseMove,
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
    },
  };
};

export default useHoverAnimation;

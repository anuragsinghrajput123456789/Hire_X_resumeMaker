import { scrollReveal } from "../scrollAnimations";

export const useScrollReveal = (
  preset: "fadeUp" | "fadeIn" | "staggerContainer" | "slideLeft" | "slideRight" = "fadeUp",
  viewportMargin = "-40px"
) => {
  const selectedVariant = scrollReveal[preset] || scrollReveal.fadeUp;

  return {
    initial: "hidden",
    whileInView: "visible",
    viewport: { once: true, margin: viewportMargin },
    variants: selectedVariant,
  };
};

export default useScrollReveal;

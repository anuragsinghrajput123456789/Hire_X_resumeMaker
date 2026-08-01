import { pageVariants, pageCrossFade, pageSlideUp } from "../pageTransitions";

export const usePageTransition = (type: "default" | "crossFade" | "slideUp" = "default") => {
  switch (type) {
    case "crossFade":
      return pageCrossFade;
    case "slideUp":
      return pageSlideUp;
    default:
      return pageVariants;
  }
};

export default usePageTransition;

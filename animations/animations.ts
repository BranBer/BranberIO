import { AnimationProps } from "framer-motion";

const variants: AnimationProps["variants"] = {
  fadeInit: {
    opacity: 0,
  },
  fadeAnimate: {
    opacity: 1,
  },
  fadeExit: {
    opacity: 0,
  },
  slideUpInit: {
    y: "-100vh",
  },
  slideUpAnimate: {
    y: 0,
  },
  slideUpExit: {
    y: "100vh",
  },
  slideUpFadeInit: {
    y: "-100vh",
    opacity: 0,
  },
  slideUpFadeAnimate: {
    y: 0,
    opacity: 1,
  },
  slideUpFadeExit: {
    y: "100vh",
    opacity: 0,
  },
};

export default variants;

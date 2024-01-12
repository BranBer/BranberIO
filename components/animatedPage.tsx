import React from "react";
import { motion } from "framer-motion";
import variants from "../animations/animations";

interface animatedPageProps {
  children: React.ReactNode;
  className: string;
}

const AnimatedPage: React.FC<animatedPageProps> = ({ children, className }) => {
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="fadeInit"
      animate="fadeAnimate"
      exit="fadeExit"
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedPage;

import "../styles/globals.css";
import Lavalamp from "../components/lavalamp";
import { AnimatePresence } from "framer-motion";
import styles from "../styles/page.module.scss";
import variants from "../animations/animations";
import { motion } from "framer-motion";
import type { AppProps } from "next/app";
import { useNextCssRemovalPrevention } from "@madeinhaus/nextjs-page-transition";
import "@madeinhaus/nextjs-page-transition/dist/index.css";

function MyApp({ Component, pageProps: { ...pageProps }, router }: AppProps) {
  const removeStyles = useNextCssRemovalPrevention();
  return (
    <>
      <div className={styles.background} />
      <Lavalamp />
      <div className={styles.pageContainer}>
        <div className={styles.page}>
          <AnimatePresence
            mode="wait"
            onExitComplete={() => {
              removeStyles();
            }}
          >
            <motion.div
              variants={variants}
              initial="fadeInit"
              animate="fadeAnimate"
              exit="fadeExit"
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className={styles.pageMotion}
              key={router.route}
            >
              <Component {...pageProps} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
export default MyApp;

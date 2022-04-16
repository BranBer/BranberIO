import "../styles/globals.css";
import type { AppProps } from "next/app";
import Lavalamp from "../components/lavalamp";
import { AnimatePresence } from "framer-motion";
import styles from "../styles/page.module.scss";

function MyApp({ Component, pageProps: { ...pageProps }, router }: AppProps) {
  return (
    <>
      <Lavalamp />
      <AnimatePresence>
        <div className={styles.pageBackground} />

        <Component {...pageProps} key={router.route} />
      </AnimatePresence>
    </>
  );
}
export default MyApp;

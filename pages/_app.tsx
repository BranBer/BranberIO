import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import { AnimatePresence, motion } from "framer-motion";
import type { AppProps } from "next/app";
import { Sora, Inter } from "next/font/google";
import RouteProgress from "../components/RouteProgress";

/**
 * Display font: Sora (geometric-humanist) → --font-display
 * Body/UI font: Inter (neutral, legible) → --font-sans
 * Loaded via next/font to eliminate render-blocking @imports (spec §2.3, AC-15).
 */
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["400", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/**
 * Page enter variants — opacity-only crossfade.
 * Dropping the y-offset removes the "shifty" feel; mode="wait" is kept
 * but with a very short duration so total serialized cost is ≤ 0.2s exit
 * + 0.18s enter ≈ 0.38s max, and in practice the exit fires while the
 * next page is already fetched so the perceived gap is much smaller.
 * framer-motion handles useReducedMotion via AnimatePresence + variants;
 * the global CSS guard catches any CSS animation.
 */
const pageVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    /**
     * next-themes ThemeProvider:
     * - attribute="class" → adds/removes .dark on <html>
     * - defaultTheme="system" → respects prefers-color-scheme on first visit
     * - enableSystem → reads the OS preference
     * - disableTransitionOnChange=false → our CSS transition handles the swap
     * suppressHydrationWarning is set on <html> in the Document (or handled
     * by next-themes itself in modern versions) to prevent the FOUC flash.
     */
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <div className={`${sora.variable} ${inter.variable}`}>
        {/* Slim top progress bar for slow navigations (ISR fetches, first-visit compile).
            Debounced 150ms so instant navigations never flash it. */}
        <RouteProgress />
        {/*
          Fixed background layer — shared across all pages (one paint, §3.3).
          The bg image + scrim are rendered here so they persist during page
          transitions. The actual images are set via CSS in globals to allow
          theme-driven switching.
        */}
        <div
          aria-hidden="true"
          id="page-bg"
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          {/* Light mesh background */}
          <img
            src="/mesh-bg-light.svg"
            alt=""
            aria-hidden="true"
            className="dark:opacity-0"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "opacity 200ms ease",
            }}
          />
          {/* Dark mesh background */}
          <img
            src="/mesh-bg-dark.svg"
            alt=""
            aria-hidden="true"
            className="opacity-0 dark:opacity-100"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "opacity 200ms ease",
            }}
          />
          {/* Scrim layer — always on top of the bg image */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "var(--scrim)",
              transition: "background 200ms ease",
            }}
          />
        </div>

        {/* Page content layer */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            minHeight: "100vh",
          }}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={router.route}
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.18, ease: "easeOut" }}
              style={{ minHeight: "100vh" }}
            >
              <Component {...pageProps} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default MyApp;

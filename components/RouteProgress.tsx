/**
 * RouteProgress — slim top progress bar driven by next/router events.
 *
 * Behaviour:
 * - Listens for routeChangeStart / routeChangeComplete / routeChangeError.
 * - Debounced 150 ms: the bar only appears when a navigation takes longer
 *   than the debounce, so fast / instant navigations (pre-rendered ISR pages
 *   already in the browser cache) never produce a flash.
 * - Themed with var(--accent) so it follows the light/dark toggle automatically.
 * - Respects prefers-reduced-motion: no easing animation when reduced, just
 *   an instant show/hide toggle.
 *
 * No third-party dependency — self-contained, ~55 lines.
 */
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

const BAR_HEIGHT = 2; // px
const DEBOUNCE_MS = 150;

export default function RouteProgress() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Respect prefers-reduced-motion at the JS level too
  const prefersReduced =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

  const startProgress = () => {
    // Clear any previous timers
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (tickTimer.current) clearTimeout(tickTimer.current);

    setWidth(0);

    debounceTimer.current = setTimeout(() => {
      setVisible(true);
      // Simulate progress: jump to 30%, then crawl slowly toward 85%
      setWidth(30);
      const tick = () => {
        setWidth((prev) => {
          if (prev >= 85) return prev;
          // Ease: larger steps early, smaller as we approach 85
          const step = Math.max(1, (85 - prev) * 0.08);
          return Math.min(85, prev + step);
        });
        tickTimer.current = setTimeout(tick, 300);
      };
      tickTimer.current = setTimeout(tick, 300);
    }, DEBOUNCE_MS);
  };

  const finishProgress = () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    if (tickTimer.current) clearTimeout(tickTimer.current);

    // If the bar was never shown (fast nav), just reset silently
    setWidth(100);
    // Small delay so the "100%" fill is visible before we hide
    setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 200);
  };

  useEffect(() => {
    router.events.on("routeChangeStart", startProgress);
    router.events.on("routeChangeComplete", finishProgress);
    router.events.on("routeChangeError", finishProgress);

    return () => {
      router.events.off("routeChangeStart", startProgress);
      router.events.off("routeChangeComplete", finishProgress);
      router.events.off("routeChangeError", finishProgress);
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      if (tickTimer.current) clearTimeout(tickTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.events]);

  if (!visible) return null;

  return (
    <div
      role="progressbar"
      aria-label="Page loading"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={width}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: BAR_HEIGHT,
        zIndex: 9999,
        pointerEvents: "none",
        // Background track (subtle, near-transparent)
        background: "var(--glass-bg-chip, rgba(255,255,255,0.08))",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${width}%`,
          background: "var(--accent)",
          boxShadow: "0 0 6px var(--accent)",
          // Only animate width when reduced-motion is NOT set
          transition: prefersReduced
            ? "none"
            : "width 0.3s ease, opacity 0.2s ease",
        }}
      />
    </div>
  );
}

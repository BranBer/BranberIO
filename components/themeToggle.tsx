import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

/**
 * ThemeToggle — pill button with sun/moon SVG icons.
 * Spec: design/02-2-visual-redesign-spec.md §6
 *
 * aria-label reflects the *next* action ("Switch to dark theme").
 * A visually-hidden aria-live region announces the current state on change
 * so screen-reader users get feedback without relying solely on aria-pressed.
 */
const SunIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="12" cy="12" r="4.25" />
    <line x1="12" y1="2.5" x2="12" y2="5" />
    <line x1="12" y1="19" x2="12" y2="21.5" />
    <line x1="2.5" y1="12" x2="5" y2="12" />
    <line x1="19" y1="12" x2="21.5" y2="12" />
    <line x1="5.1" y1="5.1" x2="6.9" y2="6.9" />
    <line x1="17.1" y1="17.1" x2="18.9" y2="18.9" />
    <line x1="5.1" y1="18.9" x2="6.9" y2="17.1" />
    <line x1="17.1" y1="6.9" x2="18.9" y2="5.1" />
  </svg>
);

const MoonIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M20.5 14.2A8.5 8.5 0 0 1 9.8 3.5a7 7 0 1 0 10.7 10.7Z" />
    <path
      d="M16.2 4.2l.5 1.4 1.4.5-1.4.5-.5 1.4-.5-1.4-1.4-.5 1.4-.5Z"
      fill="currentColor"
      stroke="none"
    />
  </svg>
);

const ThemeToggle: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [announcement, setAnnouncement] = useState("");

  // Avoid hydration mismatch: only render the real icon after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  // ARIA must match the mounted/resolved state, not the SSR default.
  // Before mount, resolvedTheme is undefined (isDark is false) — omit aria-pressed
  // and use a neutral label so the SSR HTML is never wrong.
  // After mount, derive from the same isDark that drives the icon and visible text.
  const ariaPressed: boolean | undefined = mounted ? isDark : undefined;
  const ariaLabel = mounted
    ? isDark
      ? "Switch to light theme"
      : "Switch to dark theme"
    : "Toggle theme";

  const handleToggle = () => {
    const next = isDark ? "light" : "dark";
    setTheme(next);
    setAnnouncement(next === "dark" ? "Dark theme enabled" : "Light theme enabled");
  };

  return (
    <>
      {/* Screen-reader live announcement */}
      <span
        role="status"
        aria-live="polite"
        className="sr-only"
        style={{
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: 0,
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        {announcement}
      </span>

      <button
        type="button"
        onClick={handleToggle}
        aria-pressed={ariaPressed}
        aria-label={ariaLabel}
        className="glass-chip"
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          padding: "6px 14px",
          color: "var(--fg)",
          cursor: "pointer",
          border: "1px solid var(--glass-border)",
          background: "var(--glass-bg-chip)",
          transition: "transform 120ms ease, border-color 120ms ease",
          fontSize: "var(--text-sm)",
          fontFamily: "var(--font-sans)",
          lineHeight: 1,
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.03)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--glass-highlight)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
          (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--glass-border)";
        }}
      >
        {/* Only show the icon after mount to prevent hydration mismatch */}
        {mounted ? (
          <span
            style={{
              display: "inline-flex",
              transition: "transform 200ms ease, opacity 200ms ease",
            }}
          >
            {isDark ? <SunIcon /> : <MoonIcon />}
          </span>
        ) : (
          // Placeholder to avoid layout shift
          <span style={{ width: 18, height: 18, display: "inline-block" }} />
        )}
        <span style={{ fontSize: "var(--text-sm)", fontWeight: 500 }}>
          {mounted ? (isDark ? "Light" : "Dark") : ""}
        </span>
      </button>
    </>
  );
};

export default ThemeToggle;

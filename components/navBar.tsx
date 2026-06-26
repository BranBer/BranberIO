import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ThemeToggle from "./themeToggle";

/**
 * NavBar — persistent top navigation.
 * Spec: design/02-2-visual-redesign-spec.md §6 (toggle placement).
 * Left: logo monogram + brand name. Right: nav links + theme toggle.
 * Uses glass-chip style on active link; plain text on inactive.
 */
const LogoMonogram = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 32 32"
    fill="none"
    aria-hidden="true"
    focusable="false"
  >
    <rect
      x="1.5"
      y="1.5"
      width="29"
      height="29"
      rx="8"
      stroke="currentColor"
      strokeWidth="1.75"
      fill="none"
    />
    <path
      d="M11 9h6.2a4 4 0 0 1 0 8H11V9Zm0 8h6.8a4 4 0 0 1 0 8H11v-8Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      fill="none"
    />
  </svg>
);

const NAV_LINKS = [
  { text: "Projects", href: "/projects" },
  { text: "Skills", href: "/skills" },
  { text: "About", href: "/about" },
];

const NavBar: React.FC = () => {
  const { pathname } = useRouter();

  return (
    <header
      className="glass-chip"
      style={{
        position: "fixed",
        top: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(calc(100vw - 2rem), var(--container))",
        zIndex: 1000,
        padding: "0.625rem 1.25rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1rem",
        /* Override chip radius to slightly smaller pill on the header itself */
        borderRadius: "var(--radius-pill)",
      }}
    >
      {/* Logo / brand */}
      <Link
        href="/"
        aria-label="branber.io home"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.5rem",
          color: "var(--fg)",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "1rem",
          letterSpacing: "-0.01em",
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        <LogoMonogram />
        <span>branber.io</span>
      </Link>

      {/* Nav links + toggle */}
      <nav aria-label="Main navigation">
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
            flexWrap: "wrap",
          }}
        >
          {NAV_LINKS.map(({ text, href }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  style={{
                    display: "inline-block",
                    padding: "0.375rem 0.875rem",
                    borderRadius: "var(--radius-pill)",
                    color: isActive ? "var(--accent)" : "var(--fg-muted)",
                    fontFamily: "var(--font-sans)",
                    fontSize: "var(--text-sm)",
                    fontWeight: isActive ? 600 : 400,
                    textDecoration: "none",
                    transition: "color 150ms ease",
                    background: isActive ? "var(--glass-bg-chip)" : "transparent",
                    border: isActive ? "1px solid var(--glass-border)" : "1px solid transparent",
                  }}
                >
                  {text}
                </Link>
              </li>
            );
          })}

          {/* Theme toggle — always last in tab order */}
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;

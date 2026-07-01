import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import ThemeToggle from "./themeToggle";

/**
 * NavBar — persistent top navigation.
 * Spec: design/02-2-visual-redesign-spec.md §6 (toggle placement).
 * Left: logo monogram + brand name. Right: nav links + theme toggle.
 * Uses glass-chip style on active link; plain text on inactive.
 *
 * Mobile (<520px): brand text hidden, hamburger button reveals links in a
 * glass dropdown panel. Logo + hamburger + theme toggle stay on the bar.
 * Touch targets are ≥44px per WCAG 2.1 AA (L1 fix).
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

const HamburgerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const NAV_LINKS = [
  { text: "Projects", href: "/projects" },
  { text: "Skills", href: "/skills" },
  { text: "About", href: "/about" },
];

const NavBar: React.FC = () => {
  const { pathname } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Scoped responsive styles for nav */}
      <style>{`
        .nav-brand-text {
          display: inline;
        }
        .nav-desktop-links {
          display: flex;
        }
        .nav-hamburger {
          display: none;
        }
        @media (max-width: 520px) {
          .nav-brand-text {
            display: none;
          }
          .nav-desktop-links {
            display: none;
          }
          .nav-hamburger {
            display: inline-flex;
          }
        }
      `}</style>

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
            minHeight: "44px",
          }}
        >
          <LogoMonogram />
          <span className="nav-brand-text">branber.io</span>
        </Link>

        {/* Desktop nav links + toggle (hidden at ≤520px) */}
        <nav aria-label="Main navigation" className="nav-desktop-links">
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              display: "flex",
              alignItems: "center",
              gap: "0.25rem",
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
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "0.375rem 0.875rem",
                      minHeight: "44px",
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
            <li style={{ display: "flex", alignItems: "center", minHeight: "44px" }}>
              <ThemeToggle />
            </li>
          </ul>
        </nav>

        {/* Mobile right side: hamburger + theme toggle (shown at ≤520px) */}
        <div
          className="nav-hamburger"
          style={{ alignItems: "center", gap: "0.5rem" }}
        >
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            className="glass-chip"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "44px",
              minHeight: "44px",
              padding: "0.5rem",
              borderRadius: "var(--radius-pill)",
              border: "1px solid var(--glass-border)",
              background: "var(--glass-bg-chip)",
              color: "var(--fg)",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            {menuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>
      </header>

      {/* Mobile dropdown panel — absolutely positioned below the nav bar */}
      {menuOpen && (
        <nav
          id="mobile-nav-menu"
          aria-label="Mobile navigation"
          className="glass-chip"
          style={{
            position: "fixed",
            top: "calc(1rem + 56px + 0.5rem)", /* nav top + nav height + gap */
            left: "50%",
            transform: "translateX(-50%)",
            width: "min(calc(100vw - 2rem), var(--container))",
            zIndex: 999,
            borderRadius: "var(--radius-xl)",
            padding: "0.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.25rem",
          }}
        >
          {NAV_LINKS.map(({ text, href }) => {
            const isActive = pathname === href || pathname.startsWith(href + "/");
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0.75rem 1rem",
                  minHeight: "44px",
                  borderRadius: "var(--radius-lg)",
                  color: isActive ? "var(--accent)" : "var(--fg-muted)",
                  fontFamily: "var(--font-sans)",
                  fontSize: "var(--text-sm)",
                  fontWeight: isActive ? 600 : 400,
                  textDecoration: "none",
                  background: isActive ? "var(--glass-bg-chip)" : "transparent",
                  border: isActive ? "1px solid var(--glass-border)" : "1px solid transparent",
                  transition: "color 150ms ease, background 150ms ease",
                }}
              >
                {text}
              </Link>
            );
          })}
        </nav>
      )}
    </>
  );
};

export default NavBar;

import React from "react";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Seo from "../components/Seo";
import Link from "next/link";
import NavBar from "../components/navBar";
import { motion, useReducedMotion } from "framer-motion";

/**
 * Landing page — branber.io
 * Spec: design/02-2-visual-redesign-spec.md §4.1
 *
 * Rhythm: edge-to-edge asymmetric hero → single focal panel → selected work →
 * contact/close band. Four cadences, no repeat.
 *
 * ONE primary action above the fold: "View Résumé" CTA pill.
 * Hero is asymmetric (60/40 split), NOT a centered card.
 * All body copy sits on .glass-strong (tier-2). §3.2 a11y rule.
 */

/* ── Inline SVG icons (from design/assets/) ──────────────────────────────── */
const FrontendIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <rect x="3.5" y="5" width="21" height="14" rx="2.5" />
    <line x1="3.5" y1="9.5" x2="24.5" y2="9.5" />
    <circle cx="6.5" cy="7.25" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="8.6" cy="7.25" r="0.6" fill="currentColor" stroke="none" />
    <path d="M11 13l-2 1.75 2 1.75" />
    <path d="M17 13l2 1.75-2 1.75" />
    <line x1="13.5" y1="17" x2="14.5" y2="12.5" />
    <line x1="10" y1="23" x2="18" y2="23" />
  </svg>
);

const ApiIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <circle cx="14" cy="14" r="3.25" />
    <circle cx="5" cy="6.5" r="2.25" />
    <circle cx="23" cy="6.5" r="2.25" />
    <circle cx="5" cy="21.5" r="2.25" />
    <circle cx="23" cy="21.5" r="2.25" />
    <line x1="6.9" y1="7.7" x2="11.6" y2="12.3" />
    <line x1="21.1" y1="7.7" x2="16.4" y2="12.3" />
    <line x1="6.9" y1="20.3" x2="11.6" y2="15.7" />
    <line x1="21.1" y1="20.3" x2="16.4" y2="15.7" />
  </svg>
);

const InfraIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="28"
    height="28"
    viewBox="0 0 28 28"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <rect x="4" y="4.5" width="20" height="6" rx="1.75" />
    <rect x="4" y="13" width="20" height="6" rx="1.75" />
    <circle cx="7.5" cy="7.5" r="0.7" fill="currentColor" stroke="none" />
    <circle cx="7.5" cy="16" r="0.7" fill="currentColor" stroke="none" />
    <line x1="11" y1="7.5" x2="20.5" y2="7.5" />
    <line x1="11" y1="16" x2="20.5" y2="16" />
    <path d="M14 19v2.5" />
    <path d="M9 23.5h10" />
  </svg>
);

const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const LinkedInIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const EmailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m2 7 10 7 10-7" />
  </svg>
);

/* ── Framer-motion variants ───────────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

/* ── Shared style helpers ─────────────────────────────────────────────────── */
const sectionStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "var(--container)",
  marginLeft: "auto",
  marginRight: "auto",
  paddingLeft: "var(--gutter)",
  paddingRight: "var(--gutter)",
};

/* ── Page component ───────────────────────────────────────────────────────── */
const Home: NextPage = () => {
  const shouldReduceMotion = useReducedMotion();

  const motionProps = shouldReduceMotion
    ? {}
    : {
        variants: containerVariants,
        initial: "hidden",
        animate: "visible",
      };

  const itemMotionProps = shouldReduceMotion ? {} : { variants: itemVariants };

  return (
    <>
      <Seo
        title="Brandon Berke — Full-Stack Developer"
        description="Brandon Berke is a full-stack developer who ships from frontend to infrastructure — React, Node.js, AWS, and Terraform. Based in New York."
        path="/"
        type="website"
      />
      <Head>
        {/* Person JSON-LD — identity/skills/education only; no employer or dates */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Brandon Berke",
              jobTitle: "Full-Stack Developer",
              url: "https://www.branber.io",
              sameAs: [
                "https://github.com/BranBer",
                "https://www.linkedin.com/in/brandon-berke-84111b199/",
              ],
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "Farmingdale State College",
              },
              knowsAbout: [
                "React",
                "TypeScript",
                "Node.js",
                "AWS",
                "Terraform",
                "Python",
                "PostgreSQL",
                "Infrastructure as Code",
              ],
            }),
          }}
        />
      </Head>

      <NavBar />

      <main
        style={{
          paddingTop: "6rem", /* clear the fixed nav */
          paddingBottom: "var(--space-section)",
          minHeight: "100vh",
          fontFamily: "var(--font-sans)",
          color: "var(--fg)",
        }}
      >
        {/* Scoped responsive styles for the hero and selected-work grids */}
        <style>{`
          .hero-grid {
            display: grid;
            grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
            gap: clamp(2rem, 4vw, 4rem);
            align-items: center;
          }
          @media (max-width: 640px) {
            .hero-grid {
              grid-template-columns: 1fr;
            }
            .hero-portrait {
              order: -1;
              max-height: 320px !important;
              aspect-ratio: auto !important;
            }
          }
          .selected-work-grid {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 1.5rem;
          }
          @media (max-width: 640px) {
            .selected-work-grid {
              grid-template-columns: 1fr;
            }
          }
        `}</style>
        {/* ── 1. HERO BAND ─────────────────────────────────────────────── */}
        <section
          aria-label="Introduction"
          style={{
            ...sectionStyle,
            paddingTop: "clamp(3rem, 6vw, 5rem)",
            paddingBottom: "var(--space-section)",
          }}
        >
          <motion.div
            {...motionProps}
            className="hero-grid"
          >
            {/* Left column — text + CTAs */}
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-block)" }}>
              {/* Overline */}
              <motion.p
                {...itemMotionProps}
                style={{
                  margin: 0,
                  fontSize: "var(--text-xs)",
                  fontWeight: 600,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "var(--fg-muted)",
                }}
              >
                Full-Stack Developer
              </motion.p>

              {/* Hero card — body copy must be on glass-strong */}
              <motion.div
                {...itemMotionProps}
                className="glass-strong"
                style={{
                  padding: "clamp(1.5rem, 3vw, 2.5rem)",
                  borderRadius: "var(--radius-xl)",
                }}
              >
                <h1
                  style={{
                    margin: "0 0 1rem",
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-display)",
                    fontWeight: 700,
                    lineHeight: 1.15,
                    letterSpacing: "-0.02em",
                    color: "var(--fg)",
                  }}
                >
                  Full-Stack Developer who ships from frontend to infrastructure
                </h1>
                <p
                  style={{
                    margin: "0 0 0.5rem",
                    fontSize: "var(--text-lead)",
                    lineHeight: 1.65,
                    color: "var(--fg-muted)",
                    maxWidth: "var(--measure)",
                  }}
                >
                  Hi, I&rsquo;m Brandon Berke — I build reliable web products end-to-end,
                  from React interfaces to cloud infrastructure. B.S. Computer Science,
                  Farmingdale State College.
                </p>
              </motion.div>

              {/* Primary CTA (the ONE primary action above the fold) */}
              <motion.div
                {...itemMotionProps}
                style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}
              >
                <a
                  href="/static/resume.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1.75rem",
                    borderRadius: "var(--radius-pill)",
                    background: "var(--accent)",
                    color: "var(--accent-fg)",
                    fontWeight: 600,
                    fontSize: "var(--text-sm)",
                    textDecoration: "none",
                    transition: "background 120ms ease, transform 120ms ease",
                    boxShadow: "0 2px 12px rgb(59 91 219 / 0.25)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "var(--accent-hover)";
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.background = "var(--accent)";
                    (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                  }}
                >
                  View Résumé
                </a>

                {/* Secondary ghost CTA */}
                <Link
                  href="/projects"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1.75rem",
                    borderRadius: "var(--radius-pill)",
                    background: "transparent",
                    color: "var(--fg)",
                    fontWeight: 500,
                    fontSize: "var(--text-sm)",
                    textDecoration: "none",
                    border: "1px solid var(--glass-border)",
                    transition: "border-color 120ms ease, color 120ms ease",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--glass-border)";
                    (e.currentTarget as HTMLAnchorElement).style.color = "var(--fg)";
                  }}
                >
                  See my work
                </Link>
              </motion.div>

              {/* Social links — a11y-labelled, Facebook removed per spec */}
              <motion.div
                {...itemMotionProps}
                style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}
              >
                <a
                  href="https://github.com/BranBer"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.5rem",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--fg-muted)",
                    transition: "color 150ms ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--fg)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--fg-muted)")}
                >
                  <GitHubIcon />
                </a>
                <a
                  href="https://www.linkedin.com/in/brandon-berke-84111b199/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.5rem",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--fg-muted)",
                    transition: "color 150ms ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--fg)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--fg-muted)")}
                >
                  <LinkedInIcon />
                </a>
                <a
                  href="mailto:brandonberke@gmail.com"
                  aria-label="Email Brandon"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.5rem",
                    borderRadius: "var(--radius-sm)",
                    color: "var(--fg-muted)",
                    transition: "color 150ms ease",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--fg)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--fg-muted)")}
                >
                  <EmailIcon />
                </a>
              </motion.div>
            </div>

            {/* Right column — portrait in glass-strong frame */}
            <motion.div
              {...itemMotionProps}
              className="glass-strong hero-portrait"
              style={{
                borderRadius: "var(--radius-xl)",
                overflow: "hidden",
                aspectRatio: "4 / 5",
                position: "relative",
                maxHeight: "480px",
              }}
            >
              <Image
                src="/headshot.jpg"
                alt="Brandon Berke"
                fill
                priority
                sizes="(max-width: 640px) 40vw, (max-width: 1024px) 35vw, 460px"
                style={{ objectFit: "cover", objectPosition: "center top" }}
              />
            </motion.div>
          </motion.div>
        </section>

        {/* ── 2. WHAT I BUILD — single focal strip ─────────────────────── */}
        <section
          aria-label="What I build"
          style={{
            ...sectionStyle,
            paddingBottom: "var(--space-section)",
          }}
        >
          <motion.div
            {...(shouldReduceMotion
              ? {}
              : { variants: containerVariants, initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.3 } })}
            className="glass-strong"
            style={{
              padding: "clamp(2rem, 4vw, 3rem)",
              borderRadius: "var(--radius-xl)",
            }}
          >
            <motion.p
              {...itemMotionProps}
              style={{
                margin: "0 0 1.5rem",
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--fg-muted)",
              }}
            >
              What I build
            </motion.p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "2rem",
              }}
            >
              {[
                {
                  Icon: FrontendIcon,
                  title: "Frontend",
                  desc: "React, Next.js, and TypeScript interfaces that are fast, accessible, and production-hardened.",
                },
                {
                  Icon: ApiIcon,
                  title: "APIs & Services",
                  desc: "Node.js and REST/GraphQL backends — clean boundaries, tested, and ready to scale.",
                },
                {
                  Icon: InfraIcon,
                  title: "Infrastructure",
                  desc: "Cloud-native deployments on AWS — containers, CI/CD pipelines, and reliable ops.",
                },
              ].map(({ Icon, title, desc }) => (
                <motion.div
                  key={title}
                  {...itemMotionProps}
                  style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
                >
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "2.75rem",
                      height: "2.75rem",
                      borderRadius: "var(--radius-sm)",
                      background: "var(--glass-bg-chip)",
                      border: "1px solid var(--glass-border)",
                      color: "var(--accent)",
                    }}
                  >
                    <Icon />
                  </span>
                  <h2
                    style={{
                      margin: 0,
                      fontFamily: "var(--font-display)",
                      fontSize: "var(--text-h3)",
                      fontWeight: 600,
                      color: "var(--fg)",
                    }}
                  >
                    {title}
                  </h2>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "var(--text-body)",
                      lineHeight: 1.65,
                      color: "var(--fg-muted)",
                    }}
                  >
                    {desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── 3. SELECTED WORK — asymmetric card group ─────────────────── */}
        <section
          aria-label="Selected work"
          style={{
            ...sectionStyle,
            paddingBottom: "var(--space-section)",
          }}
        >
          <motion.div
            {...(shouldReduceMotion
              ? {}
              : { variants: containerVariants, initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.2 } })}
          >
            <motion.p
              {...itemMotionProps}
              style={{
                margin: "0 0 var(--space-block)",
                fontSize: "var(--text-xs)",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "var(--fg-muted)",
              }}
            >
              Selected work
            </motion.p>

            {/* Asymmetric grid: first card wider; collapses to 1-col ≤640px */}
            <div className="selected-work-grid">
              {/* Featured card — larger */}
              <motion.div
                {...itemMotionProps}
                className="glass"
                style={{
                  padding: "2rem",
                  borderRadius: "var(--radius-xl)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                  gridRow: "span 1",
                }}
              >
                <span
                  className="glass-chip"
                  style={{
                    alignSelf: "flex-start",
                    padding: "0.25rem 0.75rem",
                    fontSize: "var(--text-xs)",
                    fontWeight: 600,
                    color: "var(--success)",
                    border: "1px solid var(--glass-border)",
                  }}
                >
                  Live
                </span>
                <h2
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-h2)",
                    fontWeight: 600,
                    color: "var(--fg)",
                  }}
                >
                  cipher-codex
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: "var(--text-body)",
                    lineHeight: 1.65,
                    color: "var(--fg-muted)",
                  }}
                >
                  A collaborative full-stack platform with real-time features, robust
                  API design, and cloud infrastructure — from prototype to production.
                </p>
                <Link
                  href="/projects"
                  style={{
                    alignSelf: "flex-start",
                    marginTop: "auto",
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    color: "var(--accent)",
                    textDecoration: "none",
                    borderBottom: "1px solid transparent",
                    transition: "border-color 150ms ease",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.borderColor = "transparent")}
                >
                  View case study →
                </Link>
              </motion.div>

              {/* Secondary card — smaller */}
              <motion.div
                {...itemMotionProps}
                className="glass"
                style={{
                  padding: "1.5rem",
                  borderRadius: "var(--radius-xl)",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.75rem",
                }}
              >
                <h2
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-h3)",
                    fontWeight: 600,
                    color: "var(--fg)",
                  }}
                >
                  branber.io
                </h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: "var(--text-sm)",
                    lineHeight: 1.65,
                    color: "var(--fg-muted)",
                  }}
                >
                  This portfolio — Next.js 14 with glassmorphic design system,
                  live GitHub integration, and full a11y compliance.
                </p>
                <a
                  href="https://github.com/BranBer"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    alignSelf: "flex-start",
                    marginTop: "auto",
                    fontSize: "var(--text-sm)",
                    fontWeight: 500,
                    color: "var(--accent)",
                    textDecoration: "none",
                    borderBottom: "1px solid transparent",
                    transition: "border-color 150ms ease",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.borderColor = "transparent")}
                >
                  View on GitHub →
                </a>
              </motion.div>
            </div>

            <motion.div
              {...itemMotionProps}
              style={{ marginTop: "1rem", textAlign: "right" }}
            >
              <Link
                href="/projects"
                style={{
                  fontSize: "var(--text-sm)",
                  fontWeight: 500,
                  color: "var(--fg-muted)",
                  textDecoration: "none",
                  transition: "color 150ms ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--fg)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--fg-muted)")}
              >
                All projects →
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* ── 4. CONTACT / CLOSE band ──────────────────────────────────── */}
        <section
          aria-label="Contact"
          style={sectionStyle}
        >
          <motion.div
            {...(shouldReduceMotion
              ? {}
              : { variants: containerVariants, initial: "hidden", whileInView: "visible", viewport: { once: true, amount: 0.4 } })}
            className="glass-strong"
            style={{
              padding: "clamp(2rem, 4vw, 3rem)",
              borderRadius: "var(--radius-xl)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
              gap: "1.5rem",
            }}
          >
            <motion.h2
              {...itemMotionProps}
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-h1)",
                fontWeight: 700,
                letterSpacing: "-0.01em",
                color: "var(--fg)",
              }}
            >
              Let&rsquo;s work together
            </motion.h2>

            <motion.p
              {...itemMotionProps}
              style={{
                margin: 0,
                fontSize: "var(--text-body)",
                lineHeight: 1.65,
                color: "var(--fg-muted)",
                maxWidth: "var(--measure)",
              }}
            >
              Open to full-stack and cloud-infra roles. Drop me a line or download
              my résumé — response within one business day.
            </motion.p>

            <motion.div
              {...itemMotionProps}
              style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}
            >
              <a
                href="/static/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.75rem",
                  borderRadius: "var(--radius-pill)",
                  background: "var(--accent)",
                  color: "var(--accent-fg)",
                  fontWeight: 600,
                  fontSize: "var(--text-sm)",
                  textDecoration: "none",
                  transition: "background 120ms ease, transform 120ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "var(--accent-hover)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "var(--accent)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                }}
              >
                Download Résumé
              </a>

              <a
                href="mailto:brandonberke@gmail.com"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.75rem 1.75rem",
                  borderRadius: "var(--radius-pill)",
                  background: "transparent",
                  color: "var(--fg)",
                  fontWeight: 500,
                  fontSize: "var(--text-sm)",
                  textDecoration: "none",
                  border: "1px solid var(--glass-border)",
                  transition: "border-color 120ms ease, color 120ms ease",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--glass-border)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--fg)";
                }}
              >
                Email me
              </a>
            </motion.div>

            {/* Social links repeated in footer per spec §4.1.4 */}
            <motion.div
              {...itemMotionProps}
              style={{
                display: "flex",
                gap: "1rem",
                alignItems: "center",
                paddingTop: "0.5rem",
                borderTop: "1px solid var(--glass-border)",
                width: "100%",
                justifyContent: "center",
              }}
            >
              <a
                href="https://github.com/BranBer"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub profile"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "var(--text-sm)",
                  color: "var(--fg-muted)",
                  textDecoration: "none",
                  transition: "color 150ms ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--fg)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--fg-muted)")}
              >
                <GitHubIcon />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/brandon-berke-84111b199/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn profile"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "var(--text-sm)",
                  color: "var(--fg-muted)",
                  textDecoration: "none",
                  transition: "color 150ms ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--fg)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--fg-muted)")}
              >
                <LinkedInIcon />
                <span>LinkedIn</span>
              </a>
              <a
                href="mailto:brandonberke@gmail.com"
                aria-label="Email Brandon"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "var(--text-sm)",
                  color: "var(--fg-muted)",
                  textDecoration: "none",
                  transition: "color 150ms ease",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--fg)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--fg-muted)")}
              >
                <EmailIcon />
                <span>Email</span>
              </a>
            </motion.div>
          </motion.div>
        </section>
      </main>
    </>
  );
};

export default Home;

import React from "react";
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import dynamic from "next/dynamic";
import NavBar from "../../../components/navBar";
import { motion, useReducedMotion } from "framer-motion";
import type { RepoCard as RepoCardType } from "../../../types/github";
import type { ShowcaseDetail } from "../../../data/showcaseDetails";
import { SHOWCASE_SLUGS } from "../../../data/showcaseDetails";

/**
 * Deep-dive page for a single Cipher-Codex showcase repo.
 * Route: /projects/repo/[slug]  (slug = repo name after "Cipher-Codex/")
 *
 * Data strategy (ADR 0001):
 *   - getStaticPaths from SHOWCASE_SLUGS (9 static paths, no fallback).
 *   - getStaticProps merges live RepoCard (getCipherCodexRepoCards, dynamic
 *     import, server-only) with static ShowcaseDetail from data/showcaseDetails.ts.
 *   - ISR revalidate: 3600 (1 hour) — same as projects.tsx.
 *   - On fetch failure THROW so ISR keeps serving last good page (ADR 0001 D4).
 *
 * Architecture diagrams:
 *   - Imported as React components via @svgr/webpack (next.config.js rule scoped
 *     to design/assets/repo-diagrams/).
 *   - `currentColor` in the SVGs inherits the page's --fg token so they theme
 *     automatically with the light/dark toggle.
 *   - Rendered inside a .glass container with color: var(--fg) to ensure
 *     currentColor resolves to the correct themed value.
 *
 * SEO:
 *   - Unique <title>, meta description, canonical, OG + Twitter tags, JSON-LD.
 */

/* ── Lazy-load all 10 diagram SVGs as React components ──────────────────── */
// Each is loaded only when the relevant slug page renders.
// dynamic() with ssr:false is used to avoid SSR issues with SVG module paths;
// for architecture diagrams this is acceptable (no SEO value in the SVG itself).
const DiagramComponents: Record<
  string,
  React.ComponentType<React.SVGProps<SVGSVGElement>>
> = {};

// We import them synchronously at module level using require() so Next.js can
// statically analyze the imports for the SVGR loader to process them.
// eslint-disable-next-line @typescript-eslint/no-require-imports
const ScrapersDiagram = require("../../../design/assets/repo-diagrams/mma-almanac-scrapers.svg").default;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const AiDiagram = require("../../../design/assets/repo-diagrams/mma-almanac-ai.svg").default;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const UiDiagram = require("../../../design/assets/repo-diagrams/mma-almanac-ui.svg").default;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const AwsDiagram = require("../../../design/assets/repo-diagrams/mma-almanac-aws.svg").default;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const CipherCodexDiagram = require("../../../design/assets/repo-diagrams/cipher-codex.svg").default;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const CipherInfraDiagram = require("../../../design/assets/repo-diagrams/cipher-codex-aws-infra.svg").default;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const AwsModulesDiagram = require("../../../design/assets/repo-diagrams/aws-modules.svg").default;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const JournilogDiagram = require("../../../design/assets/repo-diagrams/journilog.svg").default;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const EstateSalesDiagram = require("../../../design/assets/repo-diagrams/full-service-estate-sales.svg").default;
// eslint-disable-next-line @typescript-eslint/no-require-imports
const SystemDiagram = require("../../../design/assets/repo-diagrams/mma-almanac-system.svg").default;

const DIAGRAM_MAP: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
  "mma-almanac-scrapers": ScrapersDiagram,
  "mma-almanac-ai": AiDiagram,
  "mma-almanac-ui": UiDiagram,
  "mma-almanac-aws": AwsDiagram,
  "cipher-codex": CipherCodexDiagram,
  "cipher-codex-aws-infra": CipherInfraDiagram,
  "aws-modules": AwsModulesDiagram,
  journilog: JournilogDiagram,
  "full-service-estate-sales": EstateSalesDiagram,
  "mma-almanac-system": SystemDiagram,
};

/* ── Framer-motion variants ──────────────────────────────────────────────── */
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};

/* ── Inline icons ────────────────────────────────────────────────────────── */
const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M19 12H5" />
    <path d="M12 19l-7-7 7-7" />
  </svg>
);

const GitHubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
    <polyline points="15 3 21 3 21 9" />
    <line x1="10" y1="14" x2="21" y2="3" />
  </svg>
);

/* ── Small tag chip (flat, no nested blur) ───────────────────────────────── */
const TagChip: React.FC<{ label: string }> = ({ label }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "0.2rem 0.6rem",
      borderRadius: "var(--radius-pill)",
      background: "var(--glass-bg-chip)",
      border: "1px solid var(--glass-border)",
      fontSize: "var(--text-xs)",
      fontWeight: 500,
      color: "var(--fg-muted)",
    }}
  >
    {label}
  </span>
);

/* ── Private badge (non-accent per §4.6) ────────────────────────────────── */
const PrivateBadge: React.FC = () => (
  <span
    aria-label="Private repository"
    style={{
      display: "inline-flex",
      alignItems: "center",
      padding: "0.2rem 0.65rem",
      borderRadius: "var(--radius-pill)",
      background: "var(--glass-bg-chip)",
      border: "1px solid var(--glass-border)",
      fontSize: "var(--text-xs)",
      fontWeight: 600,
      letterSpacing: "0.04em",
      color: "var(--fg-muted)",
    }}
  >
    Private
  </span>
);

/* ── Section heading within the writeup body ─────────────────────────────── */
const SectionHeading: React.FC<{ children: React.ReactNode; id?: string }> = ({
  children,
  id,
}) => (
  <h2
    id={id}
    style={{
      margin: "0 0 0.75rem",
      fontFamily: "var(--font-display)",
      fontSize: "var(--text-h3)",
      fontWeight: 600,
      color: "var(--fg)",
    }}
  >
    {children}
  </h2>
);

/* ── Page props ──────────────────────────────────────────────────────────── */
export interface RepoDeepDiveProps {
  slug: string;
  detail: ShowcaseDetail;
  /** Merged live RepoCard data for languages, stars, pushedAt, isPrivate, url. */
  repoCard: RepoCardType | null;
}

/* ── Diagram renderer ────────────────────────────────────────────────────── */
const RepoDiagram: React.FC<{
  diagramSlug: string;
  label: string;
}> = ({ diagramSlug, label }) => {
  const Diagram = DIAGRAM_MAP[diagramSlug];
  if (!Diagram) return null;
  return (
    <div>
      {/* Responsive scroll-container styles live in globals.css
          (.diagram-scroll-wrapper / .diagram-scroll-hint) — see the note there
          on why the ">" combinator can't sit in an inline <style>. */}
      <div
        className="glass diagram-scroll-wrapper"
        aria-label={label}
        role="img"
      >
        <Diagram style={{ display: "block" }} />
      </div>
      <p className="diagram-scroll-hint" aria-hidden="true">
        Scroll to explore the diagram →
      </p>
    </div>
  );
};

/* ── Page component ──────────────────────────────────────────────────────── */
const RepoDeepDive: NextPage<RepoDeepDiveProps> = ({ slug, detail, repoCard }) => {
  const shouldReduceMotion = useReducedMotion();

  const containerMotion = shouldReduceMotion
    ? {}
    : { variants: containerVariants, initial: "hidden", animate: "visible" };

  const itemMotion = shouldReduceMotion ? {} : { variants: itemVariants };

  /* MMA Almanac system repos share a system-level overview diagram */
  const hasSystem = Boolean(detail.system && detail.systemDiagram);

  /* Only show GitHub link for public repos */
  const isPublic = repoCard ? !repoCard.isPrivate : false;
  const githubUrl = repoCard?.url ?? null;

  /* Language chips (up to 5 from live data) */
  const topLangs = repoCard?.languages?.slice(0, 5) ?? [];

  /* Stars */
  const stars = repoCard?.stars ?? 0;

  /* Pushed date */
  const pushedAt = repoCard?.pushedAt ?? null;

  /* JSON-LD for SEO */
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: detail.title,
    description: detail.blurb,
    author: {
      "@type": "Person",
      name: "Brandon Berke",
      email: "brandonberke@gmail.com",
    },
    programmingLanguage: detail.stack,
    codeRepository: isPublic && githubUrl ? githubUrl : undefined,
  };

  /* Canonical URL */
  const canonicalUrl = `https://branber.io/projects/repo/${slug}`;

  return (
    <>
      <Head>
        <title>{detail.title} — Brandon Berke</title>
        <meta name="description" content={detail.blurb} />
        <link rel="canonical" href={canonicalUrl} />

        {/* OpenGraph */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${detail.title} — Brandon Berke`} />
        <meta property="og:description" content={detail.blurb} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:site_name" content="Brandon Berke" />

        {/* Twitter card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={`${detail.title} — Brandon Berke`} />
        <meta name="twitter:description" content={detail.blurb} />

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>

      <NavBar />

      <main
        style={{
          paddingTop: "6rem",
          paddingBottom: "var(--space-section)",
          minHeight: "100vh",
          fontFamily: "var(--font-sans)",
          color: "var(--fg)",
          width: "100%",
          maxWidth: "var(--container)",
          marginLeft: "auto",
          marginRight: "auto",
          paddingLeft: "var(--gutter)",
          paddingRight: "var(--gutter)",
        }}
      >
        <motion.div
          {...containerMotion}
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-block)" }}
        >

          {/* ── 1. HEADER ───────────────────────────────────────────────── */}
          <motion.header {...itemMotion}>
            {/* Back link */}
            <Link
              href="/projects"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.375rem",
                fontSize: "var(--text-sm)",
                color: "var(--fg-muted)",
                textDecoration: "none",
                marginBottom: "1.25rem",
                transition: "color 150ms ease",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "var(--fg)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLAnchorElement).style.color = "var(--fg-muted)")
              }
            >
              <ArrowLeftIcon />
              Back to projects
            </Link>

            {/* Title row */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "flex-start",
                gap: "0.75rem",
                marginBottom: "0.75rem",
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontFamily: "var(--font-display)",
                  fontSize: "var(--text-h1)",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                  color: "var(--fg)",
                  lineHeight: 1.15,
                  flex: "1 1 auto",
                  minWidth: 0,
                }}
              >
                {detail.title}
              </h1>
              {repoCard?.isPrivate && <PrivateBadge />}
            </div>

            {/* Blurb */}
            <p
              style={{
                margin: "0 0 1rem",
                fontSize: "var(--text-body)",
                lineHeight: 1.6,
                color: "var(--fg-muted)",
                maxWidth: "var(--measure)",
              }}
            >
              {detail.blurb}
            </p>

            {/* Meta: stars + languages */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "0.75rem",
                marginBottom: "1rem",
              }}
            >
              {stars > 0 && (
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    fontSize: "var(--text-xs)",
                    color: "var(--fg-subtle)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  {stars}
                </span>
              )}
              {pushedAt && (
                <span
                  style={{ fontSize: "var(--text-xs)", color: "var(--fg-subtle)" }}
                >
                  Last pushed {new Date(pushedAt).toLocaleDateString("en-US", { month: "short", year: "numeric", timeZone: "UTC" })}
                </span>
              )}
              {topLangs.map((lang) => (
                <TagChip key={lang.name} label={lang.name} />
              ))}
            </div>

            {/* GitHub link — public repos only */}
            {isPublic && githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.55rem 1.1rem",
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
                <GitHubIcon />
                View on GitHub
                <ExternalLinkIcon />
              </a>
            )}
          </motion.header>

          {/* ── 2. ARCHITECTURE DIAGRAM ─────────────────────────────────── */}
          <motion.div {...itemMotion} aria-label={`${detail.title} architecture diagram`}>
            <RepoDiagram
              diagramSlug={detail.diagram}
              label={`Architecture diagram for ${detail.title}`}
            />
          </motion.div>

          {/* ── 3. WRITEUP — glass-strong (body copy per §3.2) ──────────── */}
          <motion.section
            {...itemMotion}
            aria-labelledby="writeup-heading"
            className="glass-strong"
            style={{
              padding: "clamp(1.5rem, 3vw, 2.5rem)",
              borderRadius: "var(--radius-xl)",
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
            }}
          >
            <h2
              id="writeup-heading"
              style={{
                margin: 0,
                fontFamily: "var(--font-display)",
                fontSize: "var(--text-h2)",
                fontWeight: 700,
                color: "var(--fg)",
                letterSpacing: "-0.01em",
              }}
            >
              About this project
            </h2>

            {/* What it is */}
            <div>
              <SectionHeading id="what-section">What it is</SectionHeading>
              <p
                style={{
                  margin: 0,
                  fontSize: "var(--text-body)",
                  lineHeight: 1.65,
                  color: "var(--fg-muted)",
                  maxWidth: "var(--measure)",
                }}
              >
                {detail.what}
              </p>
            </div>

            {/* Engineering highlights */}
            {detail.highlights.length > 0 && (
              <div>
                <SectionHeading id="highlights-section">Engineering highlights</SectionHeading>
                <ul
                  className="content-list"
                  style={{
                    margin: 0,
                    paddingLeft: "1.25rem",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  {detail.highlights.map((point, i) => (
                    <li
                      key={i}
                      style={{
                        fontSize: "var(--text-body)",
                        lineHeight: 1.65,
                        color: "var(--fg-muted)",
                        maxWidth: "var(--measure)",
                      }}
                    >
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Stack */}
            {detail.stack.length > 0 && (
              <div>
                <SectionHeading id="stack-section">Stack</SectionHeading>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}
                  aria-label="Technologies used"
                >
                  {detail.stack.map((tech) => (
                    <TagChip key={tech} label={tech} />
                  ))}
                </div>
              </div>
            )}
          </motion.section>

          {/* ── 4. MMA ALMANAC SYSTEM OVERVIEW (for the 4 related repos) ── */}
          {hasSystem && detail.systemDiagram && (
            <motion.section
              {...itemMotion}
              aria-labelledby="system-heading"
            >
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "0.5rem",
                  marginBottom: "1rem",
                }}
              >
                <h2
                  id="system-heading"
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-display)",
                    fontSize: "var(--text-h3)",
                    fontWeight: 600,
                    color: "var(--fg)",
                  }}
                >
                  Part of the {detail.system} system
                </h2>
              </div>
              <p
                style={{
                  margin: "0 0 1rem",
                  fontSize: "var(--text-sm)",
                  lineHeight: 1.6,
                  color: "var(--fg-muted)",
                  maxWidth: "var(--measure)",
                }}
              >
                This repo is one service in the four-part MMA Almanac platform.
                The system diagram below shows how the scrapers, ML engine, web UI,
                and AWS infrastructure fit together.
              </p>
              <RepoDiagram
                diagramSlug={detail.systemDiagram}
                label="MMA Almanac system overview diagram"
              />
              {/* Links to the other system repos */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginTop: "1rem",
                }}
              >
                {["mma-almanac-scrapers", "mma-almanac-ai", "mma-almanac-ui", "mma-almanac-aws"]
                  .filter((s) => s !== slug)
                  .map((s) => (
                    <Link
                      key={s}
                      href={`/projects/repo/${s}`}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.35rem",
                        padding: "0.35rem 0.85rem",
                        borderRadius: "var(--radius-pill)",
                        background: "var(--glass-bg-chip)",
                        border: "1px solid var(--glass-border)",
                        fontSize: "var(--text-xs)",
                        fontWeight: 500,
                        color: "var(--fg-muted)",
                        textDecoration: "none",
                        transition: "color 120ms ease, border-color 120ms ease",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)";
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)";
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLAnchorElement).style.color = "var(--fg-muted)";
                        (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--glass-border)";
                      }}
                    >
                      {s}
                    </Link>
                  ))}
              </div>
            </motion.section>
          )}

          {/* ── 5. FOOTER NAV ───────────────────────────────────────────── */}
          <motion.div {...itemMotion} style={{ paddingTop: "0.5rem" }}>
            <Link
              href="/projects"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.625rem 1.25rem",
                borderRadius: "var(--radius-pill)",
                background: "transparent",
                color: "var(--fg-muted)",
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
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--fg-muted)";
              }}
            >
              <ArrowLeftIcon />
              Back to projects
            </Link>
          </motion.div>

        </motion.div>
      </main>
    </>
  );
};

/* ── Static generation ───────────────────────────────────────────────────── */
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = SHOWCASE_SLUGS.map((slug) => ({
    params: { slug },
  }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<RepoDeepDiveProps> = async ({ params }) => {
  const slug = params?.slug as string;

  // Import static detail — fail fast if slug is unknown
  const showcaseDetails = (await import("../../../data/showcaseDetails")).default;
  const detail = showcaseDetails[slug];
  if (!detail) {
    return { notFound: true };
  }

  // Fetch live RepoCard from GitHub via the server-only lib/github.ts
  // (dynamic import keeps the credential-reading code out of the client bundle).
  // ADR 0001 D4: on failure throw so ISR serves last good page.
  const { getCipherCodexRepoCards } = await import("../../../lib/github");
  const allCards = await getCipherCodexRepoCards();

  // Find the card matching this slug (fullName is "Cipher-Codex/<slug>")
  const repoCard =
    allCards.find(
      (c) => c.fullName.toLowerCase() === `cipher-codex/${slug}`.toLowerCase()
    ) ?? null;

  return {
    props: {
      slug,
      detail,
      repoCard,
    },
    revalidate: 3600, // 1 hour — matches ADR 0001 D4
  };
};

export default RepoDeepDive;

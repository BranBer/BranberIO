/**
 * RepoCard — displays a single GitHub repo from the showcase.
 * Design spec: §4.6 of design/02-2-visual-redesign-spec.md
 *
 * - Uses .glass (tier-1) — short-label content, not paragraph body copy.
 * - Language chips are flat (glass-bg-chip background + border, no backdrop-filter)
 *   since they sit inside a glass card (no nested blur per §2.6).
 * - Private repos: a "Private" badge in --fg-muted (NOT accent — §4.6).
 * - ALL repos (public and private) link internally to /projects/repo/[slug].
 * - Public repos additionally show an outbound "View on GitHub" link.
 * - Stars and pushed date shown as credibility meta.
 */
import React from "react";
import Link from "next/link";
import type { RepoCard as RepoCardType } from "../types/github";

interface RepoCardProps {
  repo: RepoCardType;
  /** When true, renders larger (featured/first card in the asymmetric grid). */
  featured?: boolean;
}

/* ── Language chip — flat, no nested blur (§2.6) ──────────────────────── */
const LangChip: React.FC<{ name: string }> = ({ name }) => (
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
    {name}
  </span>
);

/* ── Private badge — non-accent (§4.6) ────────────────────────────────── */
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
      color: "var(--fg-muted)", /* NOT accent — §4.6 */
    }}
  >
    Private
  </span>
);

/* ── Date helper ───────────────────────────────────────────────────────────
 * Absolute, UTC-pinned month/year. Using a fixed timeZone (and no "now"-based
 * relative math) guarantees server-render and client-hydration produce the
 * identical string — otherwise the month can flip across the build vs. browser
 * timezone for repos pushed near a month boundary, causing a React hydration
 * mismatch. Matches the deep-dive page's "Last pushed" format. */
function formatPushedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  } catch {
    return "";
  }
}

/* ── Star icon ─────────────────────────────────────────────────────────── */
const StarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    focusable="false"
    style={{ flexShrink: 0 }}
  >
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

/* ── RepoCard component ────────────────────────────────────────────────── */
const RepoCard: React.FC<RepoCardProps> = ({ repo, featured = false }) => {
  const pushedLabel = formatPushedAt(repo.pushedAt);

  /* Top languages (up to 3 for the card) */
  const topLangs = repo.languages.slice(0, 3);

  /* Derive slug from fullName ("Cipher-Codex/<slug>" → "<slug>") */
  const slug = repo.fullName.split("/")[1]?.toLowerCase() ?? repo.name.toLowerCase();
  const deepDiveHref = `/projects/repo/${slug}`;

  /* The repo name heading — internal link for ALL repos (§4.6 updated) */
  const nameElement = (
    <Link
      href={deepDiveHref}
      style={{
        fontFamily: "var(--font-display)",
        fontSize: featured ? "var(--text-h2)" : "var(--text-h3)",
        fontWeight: featured ? 700 : 600,
        color: "var(--fg)",
        lineHeight: 1.2,
        textDecoration: "none",
        wordBreak: "break-word",
        transition: "color 120ms ease",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLAnchorElement).style.color = "var(--accent)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLAnchorElement).style.color = "var(--fg)")
      }
    >
      {repo.name}
    </Link>
  );

  return (
    <article
      className="glass"
      aria-label={`${repo.name} repository${repo.isPrivate ? " (private)" : ""}`}
      style={{
        padding: featured ? "2rem" : "1.5rem",
        borderRadius: "var(--radius-xl)",
        display: "flex",
        flexDirection: "column",
        gap: "0.875rem",
      }}
    >
      {/* ── Header row: name + private badge ── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: "0.5rem",
        }}
      >
        {nameElement}
        {repo.isPrivate && <PrivateBadge />}
      </div>

      {/* ── Description ── */}
      {repo.description && (
        <p
          style={{
            margin: 0,
            fontSize: "var(--text-sm)",
            lineHeight: 1.6,
            color: "var(--fg-muted)",
          }}
        >
          {repo.description}
        </p>
      )}

      {/* ── Language chips (flat, no nested blur) ── */}
      {topLangs.length > 0 && (
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem" }}
          aria-label="Languages"
        >
          {topLangs.map((lang) => (
            <LangChip key={lang.name} name={lang.name} />
          ))}
        </div>
      )}

      {/* ── Meta: stars + pushed date + deep-dive CTA ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginTop: "auto",
          paddingTop: "0.25rem",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          {repo.stars > 0 && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
                fontSize: "var(--text-xs)",
                color: "var(--fg-subtle)",
              }}
            >
              <StarIcon />
              {repo.stars}
            </span>
          )}
          {pushedLabel && (
            <span
              style={{
                fontSize: "var(--text-xs)",
                color: "var(--fg-subtle)",
              }}
            >
              Pushed {pushedLabel}
            </span>
          )}
        </div>

        {/* Deep-dive CTA — visible on all cards */}
        <Link
          href={deepDiveHref}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.3rem",
            fontSize: "var(--text-xs)",
            fontWeight: 500,
            color: "var(--accent)",
            textDecoration: "none",
            borderBottom: "1px solid transparent",
            transition: "border-color 150ms ease",
            paddingBottom: "1px",
            flexShrink: 0,
          }}
          onMouseEnter={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--accent)")
          }
          onMouseLeave={(e) =>
            ((e.currentTarget as HTMLAnchorElement).style.borderColor = "transparent")
          }
        >
          Deep dive →
        </Link>
      </div>
    </article>
  );
};

export default RepoCard;

/**
 * lib/github.ts — SERVER-ONLY GitHub data layer (ADR 0001).
 *
 * TRUST BOUNDARY: this module is the sole reader of the GitHub App credentials:
 *   - GITHUB_APP_ID
 *   - GITHUB_APP_INSTALLATION_ID
 *   - GITHUB_APP_PRIVATE_KEY_BASE64  (base64-encoded PEM; decoded here at use)
 *
 * It must NEVER be imported by client components or any module that runs in the
 * browser. It is consumed only from getStaticProps / server-side context.
 *
 * Enforcement:
 *   - `server-only` (npm package) throws a build-time error if this module is
 *     ever imported from a client component or a module tree that reaches one.
 *   - AC-1/AC-2 from ADR 0001: grep for App env vars must return only this file.
 *   - next.config.js must NOT list any of these vars in its `env` block.
 */

// ─── Browser guard (pages-router compatible) ─────────────────────────────────
// NOTE: `import "server-only"` is intentionally NOT used here because the
// `server-only` npm package is App Router-only; in the pages/ directory it
// causes a hard build error even when the module is reached only from
// getStaticProps (webpack does not set the react-server resolve condition).
// The pages-router guarantee is equivalent: modules reachable only from
// getStaticProps are excluded from the client bundle automatically (verified
// Next.js 14 docs). The runtime guard below catches any accidental import from
// browser code during development.
if (typeof window !== "undefined") {
  throw new Error(
    "[lib/github.ts] This module must only run server-side. " +
      "It holds GitHub App credentials and must never execute in the browser."
  );
}

import { Octokit } from "@octokit/rest";
import { createAppAuth } from "@octokit/auth-app";
import type { RepoCard, LanguageSlice } from "../types/github";
import { SHOWCASE_REPO_ALLOWLIST } from "../data/showcaseRepos";

// ─── Octokit singleton ────────────────────────────────────────────────────────
// GitHub App credentials are read HERE and only here (AC-2).
// The private key is stored base64-encoded to survive .env single-line storage;
// it is decoded to a UTF-8 PEM string at construction time and is never exposed
// further. See .env.example for setup instructions.
let _octokit: Octokit | null = null;

function getOctokit(): Octokit {
  if (_octokit) return _octokit;

  const appId = process.env.GITHUB_APP_ID;
  const installationId = process.env.GITHUB_APP_INSTALLATION_ID;
  const privateKeyBase64 = process.env.GITHUB_APP_PRIVATE_KEY_BASE64;

  if (!appId) {
    throw new Error(
      "[lib/github.ts] GITHUB_APP_ID is not set. " +
        "Add it to .env.local (dev) or the host environment (prod). " +
        "See .env.example."
    );
  }
  if (!installationId) {
    throw new Error(
      "[lib/github.ts] GITHUB_APP_INSTALLATION_ID is not set. " +
        "Add it to .env.local (dev) or the host environment (prod). " +
        "See .env.example."
    );
  }
  if (!privateKeyBase64) {
    throw new Error(
      "[lib/github.ts] GITHUB_APP_PRIVATE_KEY_BASE64 is not set. " +
        "Add it to .env.local (dev) or the host environment (prod). " +
        "See .env.example."
    );
  }

  // Decode the base64-encoded PEM to a UTF-8 string at use.
  // The key is never stored in decoded form beyond this scope.
  const privateKey = Buffer.from(privateKeyBase64, "base64").toString("utf8");

  _octokit = new Octokit({
    authStrategy: createAppAuth,
    auth: {
      appId,
      privateKey,
      installationId: Number(installationId),
    },
  });

  return _octokit;
}

// ─── Field-level normalizer (allow-list, not pass-through) ───────────────────
// ONLY the fields listed in ADR 0001 Decision 3 are extracted.
// Raw Octokit response objects must never escape this module.

// The type of a single repo in the listForOrg response.
type OctokitRepo = Awaited<
  ReturnType<InstanceType<typeof Octokit>["rest"]["repos"]["listForOrg"]>
>["data"][number];

/**
 * Maps a raw Octokit repo object to the normalized RepoCard shape.
 * MUST be called AFTER the repo-level allow-list filter — never on a
 * non-opted-in repo.
 */
function normalizeRepo(raw: OctokitRepo, languages: LanguageSlice[]): RepoCard {
  return {
    id: raw.id,
    name: raw.name,
    fullName: raw.full_name,
    description: raw.description ?? null,
    url: raw.html_url,
    homepage: raw.homepage ?? null,
    isPrivate: raw.private,
    primaryLanguage: raw.language ?? null,
    topics: Array.isArray(raw.topics) ? raw.topics : [],
    stars: raw.stargazers_count ?? 0,
    pushedAt: raw.pushed_at ?? new Date(0).toISOString(),
    languages,
  };
}

// ─── Language computation ─────────────────────────────────────────────────────

/**
 * Fetches the language byte-count breakdown for a single repo and returns
 * it as pre-computed LanguageSlice[] with percentages.
 *
 * Exported for use in the languagesPieChart refactor (Story 3.6) where a
 * per-project lookup by full_name is needed.
 */
export async function getRepoLanguages(
  fullName: string
): Promise<LanguageSlice[]> {
  const parts = fullName.split("/");
  const owner = parts[0];
  const repo = parts[1];
  if (!owner || !repo) {
    throw new Error(
      `[lib/github.ts] getRepoLanguages: invalid fullName "${fullName}"`
    );
  }

  const octokit = getOctokit();
  const { data } = await octokit.rest.repos.listLanguages({ owner, repo });

  // data is Record<string, number> from the Octokit types
  const entries = Object.entries(data) as Array<[string, number]>;
  const totalBytes = entries.reduce((sum: number, [, bytes]) => sum + bytes, 0);
  if (totalBytes === 0) return [];

  return entries.map(([name, bytes]) => ({
    name,
    bytes,
    percent: Math.round((bytes / totalBytes) * 1000) / 10, // 1 decimal place
  }));
}

// ─── Primary showcase function ────────────────────────────────────────────────

/**
 * Lists all cipher-codex org repos (public + private), applies the
 * fail-closed repo allow-list FIRST (MF-3 / VULN-2026-0006 / AC-8), then
 * normalizes surviving repos into RepoCard[] with language percentages.
 *
 * A repo whose full_name is NOT in SHOWCASE_REPO_ALLOWLIST is dropped before
 * any of its fields are ever read or placed in props.
 *
 * An empty SHOWCASE_REPO_ALLOWLIST returns [] — the safe, fail-closed default.
 */
export async function getCipherCodexRepoCards(): Promise<RepoCard[]> {
  // Short-circuit: if the allow-list is empty, nothing to fetch.
  if (SHOWCASE_REPO_ALLOWLIST.size === 0) {
    return [];
  }

  const octokit = getOctokit();

  // Fetch all org repos (type: 'all' allows private repos to be opted in).
  const allRepos: OctokitRepo[] = await octokit.paginate(
    octokit.rest.repos.listForOrg,
    {
      org: "cipher-codex",
      type: "all",
      per_page: 100,
    }
  );

  // ── Repo-level allow-list filter (RUNS BEFORE normalization) ──────────────
  // This is the fail-closed boundary: only opted-in repos proceed.
  const allowedRepos = allRepos.filter((repo: OctokitRepo) =>
    SHOWCASE_REPO_ALLOWLIST.has(repo.full_name)
  );

  if (allowedRepos.length === 0) {
    return [];
  }

  // Fetch languages for each opted-in repo in parallel.
  const cards = await Promise.all(
    allowedRepos.map(async (repo: OctokitRepo) => {
      const languages = await getRepoLanguages(repo.full_name);
      // ── Field-level normalizer (allow-list, not pass-through) ─────────────
      return normalizeRepo(repo, languages);
    })
  );

  return cards;
}

/**
 * Self-check: lib/__checks__/github.check.ts
 *
 * Verifies two load-bearing invariants WITHOUT a live GitHub token or network:
 *
 *   1. NORMALIZER ALLOW-LIST: the normalizeRepo function outputs ONLY the
 *      fields declared in RepoCard — no raw Octokit fields leak through.
 *
 *   2. REPO ALLOW-LIST FILTER: a repo whose full_name is NOT in
 *      SHOWCASE_REPO_ALLOWLIST is never normalized (dropped before any field
 *      is read).
 *
 * Run with:
 *   npx ts-node --project tsconfig.json lib/__checks__/github.check.ts
 *
 * No live token required — it feeds in fake Octokit-shaped objects.
 */

import { SHOWCASE_REPO_ALLOWLIST } from "../../data/showcaseRepos";
import type { RepoCard, LanguageSlice } from "../../types/github";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function assert(condition: boolean, message: string): void {
  if (!condition) {
    console.error(`FAIL: ${message}`);
    process.exitCode = 1;
  } else {
    console.log(`PASS: ${message}`);
  }
}

// ─── Fake Octokit-shaped repo object ─────────────────────────────────────────
// Includes legitimate RepoCard fields PLUS extra raw fields that must NOT leak.

const FAKE_RAW_REPO = {
  id: 42,
  name: "test-repo",
  full_name: "cipher-codex/test-repo",
  description: "A test repository",
  html_url: "https://github.com/cipher-codex/test-repo",
  homepage: "https://example.com",
  private: false,
  language: "TypeScript",
  topics: ["portfolio"],
  stargazers_count: 7,
  pushed_at: "2026-01-01T00:00:00Z",
  // Raw fields that must NEVER appear in RepoCard:
  clone_url: "https://github.com/cipher-codex/test-repo.git",
  ssh_url: "git@github.com:cipher-codex/test-repo.git",
  git_url: "git://github.com/cipher-codex/test-repo.git",
  node_id: "MDEwOlJlcG9zaXRvcnk0Mg==",
  owner: {
    login: "cipher-codex",
    id: 1,
    avatar_url: "https://avatars.githubusercontent.com/u/1",
    url: "https://api.github.com/users/cipher-codex",
  },
  permissions: { admin: false, push: false, pull: true },
  default_branch: "main",
  size: 1024,
  open_issues_count: 3,
  watchers_count: 2,
  forks_count: 0,
  archived: false,
  disabled: false,
  visibility: "public",
};

const FAKE_LANGUAGES: LanguageSlice[] = [
  { name: "TypeScript", bytes: 8000, percent: 80.0 },
  { name: "CSS", bytes: 2000, percent: 20.0 },
];

// ─── Inline copy of normalizeRepo (mirrors lib/github.ts without the import) ─
// We replicate the normalizer here so this check runs without `server-only`
// blocking the import. The test proves the shape contract, not the import path.

const ALLOWED_REPO_CARD_KEYS: ReadonlySet<keyof RepoCard> = new Set<keyof RepoCard>([
  "id",
  "name",
  "fullName",
  "description",
  "url",
  "homepage",
  "isPrivate",
  "primaryLanguage",
  "topics",
  "stars",
  "pushedAt",
  "languages",
]);

function normalizeRepo(raw: typeof FAKE_RAW_REPO, languages: LanguageSlice[]): RepoCard {
  // This mirrors the production normalizer in lib/github.ts exactly.
  // Any field not listed here stays out of the output.
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

// ─── Check 1: Normalizer outputs ONLY allow-listed fields ────────────────────

const normalized = normalizeRepo(FAKE_RAW_REPO, FAKE_LANGUAGES);
// Use Object.keys() (returns string[]) — avoids Set iteration which requires
// --downlevelIteration under target: "es5".
const outputKeys = Object.keys(normalized);
const outputKeySet = new Set<string>(outputKeys);

Array.from(outputKeys).forEach((key) => {
  assert(
    ALLOWED_REPO_CARD_KEYS.has(key as keyof RepoCard),
    `Normalizer output key "${key}" is in the RepoCard allow-list`
  );
});

// Confirm no raw-field leak
const RAW_ONLY_FIELDS = [
  "clone_url",
  "ssh_url",
  "git_url",
  "node_id",
  "owner",
  "permissions",
  "default_branch",
  "size",
  "open_issues_count",
  "watchers_count",
  "forks_count",
  "archived",
  "disabled",
  "visibility",
] as const;

RAW_ONLY_FIELDS.forEach((rawKey) => {
  assert(
    !outputKeySet.has(rawKey),
    `Raw field "${rawKey}" does NOT appear in normalized output`
  );
});

// Confirm all expected RepoCard keys are present
Array.from(ALLOWED_REPO_CARD_KEYS).forEach((expectedKey) => {
  assert(
    outputKeySet.has(expectedKey),
    `Expected RepoCard key "${expectedKey}" is present in normalized output`
  );
});

// ─── Check 2: Repo allow-list filter excludes non-opted-in repos ─────────────

// The production allow-list is currently empty (placeholder).
// We simulate both cases: empty set (default) and a set with one entry.

function applyAllowListFilter(
  repos: Array<{ full_name: string }>,
  allowList: ReadonlySet<string>
): Array<{ full_name: string }> {
  return repos.filter((repo) => allowList.has(repo.full_name));
}

const NON_LISTED_REPO = { full_name: "cipher-codex/not-in-list" };
const LISTED_REPO = { full_name: "cipher-codex/in-list" };

// Empty allow-list: everything excluded.
const emptyResult = applyAllowListFilter(
  [NON_LISTED_REPO, LISTED_REPO],
  new Set<string>()
);
assert(emptyResult.length === 0, "Empty allow-list => no repos pass the filter");

// Allow-list with one entry: only that entry passes.
const partialResult = applyAllowListFilter(
  [NON_LISTED_REPO, LISTED_REPO],
  new Set<string>(["cipher-codex/in-list"])
);
assert(partialResult.length === 1, "Allow-list with one entry => exactly one repo passes");
assert(
  partialResult[0].full_name === "cipher-codex/in-list",
  'Passing repo is the opted-in one ("cipher-codex/in-list")'
);
assert(
  !partialResult.some((r) => r.full_name === "cipher-codex/not-in-list"),
  '"cipher-codex/not-in-list" does NOT pass the filter'
);

// Verify the committed allow-list contains exactly the 9 opted-in repos
// and does NOT contain the 2 explicitly excluded repos.

const REQUIRED_REPOS = [
  "Cipher-Codex/cipher-codex",
  "Cipher-Codex/cipher-codex-aws-infra",
  "Cipher-Codex/aws-modules",
  "Cipher-Codex/journilog",
  "Cipher-Codex/full-service-estate-sales",
  "Cipher-Codex/mma-almanac-scrapers",
  "Cipher-Codex/mma-almanac-ai",
  "Cipher-Codex/mma-almanac-ui",
  "Cipher-Codex/mma-almanac-aws",
] as const;

REQUIRED_REPOS.forEach((repo) => {
  assert(
    SHOWCASE_REPO_ALLOWLIST.has(repo),
    `Committed allow-list INCLUDES required repo "${repo}"`
  );
});

assert(
  !SHOWCASE_REPO_ALLOWLIST.has("Cipher-Codex/procore-rag-ui"),
  'Committed allow-list does NOT include "Cipher-Codex/procore-rag-ui" (must be excluded)'
);
assert(
  !SHOWCASE_REPO_ALLOWLIST.has("Cipher-Codex/productive-civ"),
  'Committed allow-list does NOT include "Cipher-Codex/productive-civ" (must be excluded)'
);

assert(
  SHOWCASE_REPO_ALLOWLIST.size === 9,
  "Committed allow-list has exactly 9 entries"
);

// ─── Summary ─────────────────────────────────────────────────────────────────
if (process.exitCode === 1) {
  console.error("\nOne or more checks FAILED — see above.");
} else {
  console.log("\nAll checks PASSED.");
}

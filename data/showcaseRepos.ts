/**
 * Repo-level showcase allow-list (ADR 0001, Decision 3 / MF-3 / VULN-2026-0006).
 *
 * FAIL-CLOSED OPT-IN: a cipher-codex repo is shown in the live GitHub showcase
 * ONLY if its full_name appears in this set. An empty set => empty showcase
 * (safe default). A new private repo created in the org is invisible until
 * its full_name is added here — the failure mode is "absent", never "exposed".
 *
 * NOT a secret — this is a list of repo names Brandon is choosing to publicise.
 * Safe to import anywhere in the app (lib/github.ts imports it; components may
 * import it for display logic if needed).
 *
 * Explicitly EXCLUDED (must never appear in this set):
 *   - "cipher-codex/procore-rag-ui"
 *   - "cipher-codex/productive-civ"
 */
export const SHOWCASE_REPO_ALLOWLIST: ReadonlySet<string> = new Set<string>([
  "Cipher-Codex/cipher-codex",
  "Cipher-Codex/cipher-codex-aws-infra",
  "Cipher-Codex/aws-modules",
  "Cipher-Codex/journilog",
  "Cipher-Codex/full-service-estate-sales",
  "Cipher-Codex/mma-almanac-scrapers",
  "Cipher-Codex/mma-almanac-ai",
  "Cipher-Codex/mma-almanac-ui",
  "Cipher-Codex/mma-almanac-aws",
]);

// ─── Self-check assertions ────────────────────────────────────────────────────
// These run at module load time in non-production environments to catch
// accidental inclusion of excluded repos or accidental omission of required ones.
// In production (Next.js build) this is harmless — a throw here would fail the
// build visibly, which is the correct fail-closed behavior.

const REQUIRED_REPOS: readonly string[] = [
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

const EXCLUDED_REPOS: readonly string[] = [
  "Cipher-Codex/procore-rag-ui",
  "Cipher-Codex/productive-civ",
] as const;

for (const repo of REQUIRED_REPOS) {
  if (!SHOWCASE_REPO_ALLOWLIST.has(repo)) {
    throw new Error(
      `[data/showcaseRepos.ts] Required repo "${repo}" is missing from SHOWCASE_REPO_ALLOWLIST.`
    );
  }
}

for (const repo of EXCLUDED_REPOS) {
  if (SHOWCASE_REPO_ALLOWLIST.has(repo)) {
    throw new Error(
      `[data/showcaseRepos.ts] Excluded repo "${repo}" must NOT appear in SHOWCASE_REPO_ALLOWLIST.`
    );
  }
}

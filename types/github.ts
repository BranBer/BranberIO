/**
 * Normalized GitHub data shapes — the ONLY GitHub-derived structures that
 * cross the server→client wire (via getStaticProps page props).
 *
 * These types are defined by ADR 0001 (Decision 3) and must not be modified
 * to add raw Octokit fields. All math (percentages) is pre-computed
 * server-side in lib/github.ts before these objects are serialized into props.
 */

export interface LanguageSlice {
  /** Human-readable language name, e.g. "TypeScript". */
  name: string;
  /** Raw byte count as returned by the GitHub languages endpoint. */
  bytes: number;
  /**
   * Pre-computed percentage (0–100, rounded to 1 decimal).
   * Computed server-side so the client does no math.
   */
  percent: number;
}

export interface RepoCard {
  /** GitHub repo numeric ID. */
  id: number;
  /** Short repo name, e.g. "my-project". */
  name: string;
  /** Full namespaced name, e.g. "cipher-codex/my-project". */
  fullName: string;
  /** Repository description, or null if unset. */
  description: string | null;
  /** Browser URL (html_url), e.g. "https://github.com/cipher-codex/my-project". */
  url: string;
  /** Homepage URL set on the repo (may be null). */
  homepage: string | null;
  /**
   * Whether the repository is private.
   * Surfaced so the UI can show a "Private" badge; private repos are eligible
   * only when explicitly opted in via SHOWCASE_REPO_ALLOWLIST.
   */
  isPrivate: boolean;
  /** The repo's detected primary language (null if none detected). */
  primaryLanguage: string | null;
  /** GitHub Topics attached to the repo. */
  topics: string[];
  /** Stargazer count. */
  stars: number;
  /**
   * ISO 8601 timestamp of the last push.
   * Used for "recently active" sorting; client treats it as an opaque string.
   */
  pushedAt: string;
  /**
   * Pre-aggregated language breakdown (percentages computed server-side).
   * Empty array if no language data is available.
   */
  languages: LanguageSlice[];
}

# lib/ — Server-only modules

This directory holds modules that run exclusively on the server (build/ISR time).
They must never be imported by client components or any module tree that reaches one.

## Key module: lib/github.ts

The **sole reader** of the GitHub App credentials in the entire codebase (ADR 0001, AC-2).
Auth uses `@octokit/auth-app` (GitHub App installation token strategy) — tokens are
auto-renewed by the library; no manual rotation is needed.

### Env vars (read only in lib/github.ts)

| Variable | Description |
|---|---|
| `GITHUB_APP_ID` | Numeric App ID from the GitHub App settings page |
| `GITHUB_APP_INSTALLATION_ID` | Installation ID for the cipher-codex org |
| `GITHUB_APP_PRIVATE_KEY_BASE64` | Base64-encoded PEM private key (decoded at use) |

The private key is base64-encoded for safe single-line `.env` storage.
`lib/github.ts` decodes it with `Buffer.from(val, 'base64').toString('utf8')` before
passing it to `createAppAuth` — the decoded key never leaves that scope.

Encode a key file in PowerShell:
```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("key.pem"))
```

### Trust boundary rules (non-negotiable)

- **Browser runtime guard** at the top of `lib/github.ts`: `if (typeof window !== "undefined") throw`.
  This fires during development if the module is accidentally reached from client code.
  NOTE: `import "server-only"` was intentionally removed — the `server-only` npm package
  is App-Router-only and causes a hard build error in the pages/ directory (verified 2026).
  The pages-router equivalent guarantee is structural: `getStaticProps` imports are
  excluded from the client bundle automatically by Next.js. See docs/research/server-only-pages-router.md.
- None of the three App env vars must ever appear in `next.config.js` `env` block (that
  block inlines everything client-side at build time regardless of variable name).
- Never use `NEXT_PUBLIC_` prefix on any of these vars.
- Only `getStaticProps` functions should import from `lib/github.ts` (via dynamic import
  to keep the import out of the client module graph).
- If any env var is missing, `getOctokit()` throws immediately — ISR serves the last
  good page and the build log surfaces the error (fail-closed, never silently empty).

### Fail-closed repo allow-list (MF-3 / VULN-2026-0006)

`getCipherCodexRepoCards()` applies `SHOWCASE_REPO_ALLOWLIST` (from `data/showcaseRepos.ts`)
**before** the field-level normalizer. A repo not in that set is dropped before any of its
fields are read. An empty allow-list returns `[]` — safe default, not an error.

### Exported functions

- `getCipherCodexRepoCards(): Promise<RepoCard[]>` — lists cipher-codex org repos
  (`type: 'all'`, so private repos can be opted in), filters against allow-list,
  normalizes to `RepoCard[]` with language percentages pre-computed.
- `getRepoLanguages(fullName: string): Promise<LanguageSlice[]>` — per-repo language
  breakdown; used by `getCipherCodexRepoCards()` and exported for the languagesPieChart
  refactor (Story 3.6).

### Self-check

`lib/__checks__/github.check.ts` — runnable without live credentials. Verifies:
1. The normalizer outputs only the 12 `RepoCard` allow-listed fields (no raw leak).
2. The repo allow-list filter blocks non-opted-in repos.

The check uses an inline copy of the normalizer and fake Octokit-shaped objects, so it
never triggers `server-only` and does not need real App credentials to run.

Run: `npm run check:github`

### Data shapes

Defined in `types/github.ts` (`RepoCard`, `LanguageSlice`). These are the **only**
GitHub-derived structures that cross the server→client wire. Never modify them to add
raw Octokit fields.

### Populating the allow-list

`data/showcaseRepos.ts` holds `SHOWCASE_REPO_ALLOWLIST`. To populate it:
enumerate `GET /orgs/cipher-codex/repos?type=all` with the App token, take each `full_name`,
exclude `cipher-codex/procore-rag-ui` and `cipher-codex/productive-civ`, paste the rest
into the Set. The file has a documented TODO and concept code showing this.

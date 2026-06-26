# ADR 0001 — GitHub data & trust boundary (live repo showcase)

- **Status:** Accepted (design-time). Amended 2026-06-25 to close **MF-3 / VULN-2026-0006** (repo-level showcase inclusion — fail-closed opt-in); see Decision 3, Decision 5, and AC-8. Amended 2026-06-25 **(auth mechanism change): fine-grained PAT → GitHub App installation token** — the user chose the App for **zero-renewal operations** (installation tokens auto-rotate hourly; no long-lived credential to schedule-rotate or let expire). The fetch tier, fail-closed allow-list, normalizer, separate-section, and single-reader decisions are unchanged; only the credential and its mint flow change. See Decision 2, Decision 4, Decision 5, and the Security review handoff.
- **Date:** 2026-06-25
- **Stories:** 3.2 (this ADR) → gates 3.3, 3.4, 3.5, 3.6.
- **Context source:** [spec §3 EPIC 3](../planning/portfolio-modernization-spec.md), [research brief §2](../research/portfolio-modernization-brief.md).
- **Stack:** Next.js 14 (pages-router), React 18, TS 5.3. No DB. Deploy target assumed Vercel/Node serverless (host-agnostic; see Consequences).

## Locked context (not relitigated here)

The user has locked the auth mechanism: a **read-only GitHub App installation**,
scoped to the personal `cipher codex` org repos, with **read-only Metadata +
Contents** permissions on the selected repos, **server-side only — never
`NEXT_PUBLIC_`, never sent to the browser**. The App's identifiers and signing key
live in three env vars consumed only by `lib/github.ts`, which mints a short-lived
installation token at build/ISR time (see Decision 2). This ADR designs the fetch
tier, secret boundary, data shape, and caching *within* that locked decision.

> **Auth-mechanism amendment (2026-06-25).** This ADR originally locked a
> **read-only fine-grained PAT** (`GITHUB_TOKEN`). The user has since chosen a
> **GitHub App installation** instead, for **zero-renewal operations**: installation
> access tokens are minted on demand and **expire after ~1 hour, auto-refreshed by
> the SDK** — there is no long-lived token to schedule-rotate or to silently expire
> (the PAT's ≤366-day rotation chore, old Decision 4, is gone). The trade is that
> the durable on-disk secret is now an **RSA private key** rather than a scoped
> read token (see the security note in Decision 2). The fetch tier, the fail-closed
> repo allow-list, the field normalizer, GitHub-as-a-separate-section, and the
> single-reader boundary are **unchanged** — only the credential and the line that
> mints the token from it change.

---

## Decision 1 — Fetch tier: build-time + ISR `getStaticProps`, NOT a runtime proxy

**Decision:** Fetch GitHub data on the **server at build/ISR time** in
`getStaticProps` with `revalidate`. Do **not** stand up a runtime `pages/api/`
proxy that the browser calls, and do **not** call GitHub from the browser.

Rationale (recruiter-facing data that changes rarely):

- **Rate limits are a non-issue this way.** A GitHub App installation token has a
  5,000 req/hr ceiling (scaling with installation size). With ISR
  at `revalidate: 3600` (1 hour) the showcase page regenerates at most ~once/hour
  per active instance regardless of visitor count — a handful of GitHub calls per
  hour vs. 5,000 available. A per-request runtime proxy would couple GitHub call
  volume to recruiter traffic and re-introduce the abuse surface we are trying to
  remove. (VERIFIED limits: research brief §2.)
- **Resilience to GitHub outages is free.** In pages-router ISR, if
  `getStaticProps` throws during background regeneration, **Next.js keeps serving
  the last successfully generated page** and retries on the next request — it does
  not invalidate the cached page. So a GitHub outage degrades to "slightly stale
  repo cards," never a broken recruiter page. (VERIFIED: Next.js 14 ISR docs.)
  This requires that `getStaticProps` **throw on a failed/non-OK GitHub response**
  rather than returning empty data (see Decision 4) — returning empties would
  poison the cache with a blank showcase.
- **No live token-bearing endpoint to attack.** A runtime proxy is an
  attacker-reachable surface (SSRF if it takes a repo/owner param, abuse/DoS that
  burns rate limit, a path where the token could leak through error messages).
  Build/ISR fetch keeps the token's blast radius inside the server build context.

**Where a runtime route still applies (narrow):** an **on-demand revalidation
route** (`pages/api/revalidate.ts`) is optional and acceptable because it does
**not** call GitHub with user input and does **not** return GitHub data — it only
calls `res.revalidate(path)` after verifying a shared secret (and ideally the
GitHub webhook HMAC signature). It is a write-trigger, not a data proxy. Treat it
as out-of-scope-deferrable for Sprint 2; the `revalidate` timer alone satisfies
the requirement. If built, the secret/HMAC verification is a **must-fix** for the
security review.

**Rejected:** runtime `pages/api/github` data proxy (couples to traffic, new
attack surface); client-side fetch (cannot hold any GitHub App credential at all,
and `@octokit/auth-app` is explicitly not for browser use — this is the status quo
we are removing).

## Decision 2 — Secret storage & the server-only trust boundary

**The boundary:** everything inside `lib/github.ts` and the `getStaticProps`
functions that call it runs **server-side only**. The browser bundle must never
contain the App private key, the minted installation token, nor any code path that
reads them.

**Credentials — three env vars, read ONLY in `lib/github.ts`:**

| Env var | What it is | Secret? |
|---|---|---|
| `GITHUB_APP_ID` | the App's numeric identifier | no — an identifier |
| `GITHUB_APP_INSTALLATION_ID` | the installation's numeric identifier | no — an identifier |
| `GITHUB_APP_PRIVATE_KEY_BASE64` | base64-encoded RSA PEM private key | **YES — THE secret** |

The two IDs are not sensitive (they merely name the App and its installation); the
**private key is the sole durable secret** and the only one that must never leave
the server. It is stored **base64-encoded** specifically so a multi-line PEM
survives single-line env stores (`.env.local`, host env UIs) without newline
mangling; `lib/github.ts` base64-decodes it back to PEM in memory at mint time.

**Auth flow (server-only, build/ISR time):** `lib/github.ts` uses
**`@octokit/auth-app`'s `createAppAuth`** with `{ appId, installationId, privateKey }`
to **mint a short-lived installation access token on demand** (the SDK transparently
creates it on first request and refreshes it when it expires — installation tokens
last ~1 hour). **No long-lived token is ever stored**; only the private key persists
at rest, and only on the server. (VERIFIED: octokit/auth-app README; GitHub Docs —
installation access tokens expire after 1 hour and the SDK regenerates them.)

Rules (these are the constraints the security review should hold the line on — they
now apply to the **private key** as the secret):

- **No `NEXT_PUBLIC_` prefix, ever.** None of the three vars may be prefixed
  `NEXT_PUBLIC_`. Next.js only inlines `NEXT_PUBLIC_*` vars into the client bundle;
  bare `process.env.GITHUB_APP_*` reads are server-only by construction. This is the
  load-bearing rule — and it is **most critical for `GITHUB_APP_PRIVATE_KEY_BASE64`**.
- **Single reader:** all three vars (`GITHUB_APP_ID`,
  `GITHUB_APP_INSTALLATION_ID`, `GITHUB_APP_PRIVATE_KEY_BASE64`) are read in
  **exactly one module**, `lib/github.ts`, and nowhere else. No component, no client
  hook, no shared util reads them. This keeps the boundary auditable by grep.
- **`next.config.js` exclusion (explicit).** The current config exposes
  `env.api_url` (and `projects_per_page`) — **everything listed under the
  `env` key in `next.config.js` is inlined into the client bundle.** **None** of the
  three GitHub App vars may be added to that `env` block under any name —
  emphatically not `GITHUB_APP_PRIVATE_KEY_BASE64`. Leave them out of
  `next.config.js` entirely; they are consumed directly via `process.env` in server
  code. (The pre-existing `api_url` exposure is a separate audit item — spec §2 —
  and is not this story's fix, but it is the cautionary example of exactly the
  mistake to avoid.)
- **Never crosses into props.** `getStaticProps` may return *derived* GitHub data
  (the normalized shape in Decision 3) but never the private key, never the minted
  installation token, never raw auth headers, never anything a credential can be
  reconstructed from.
- **`.env*` hygiene:** the three vars live in `.env.local` (git-ignored) for dev and
  in the host's encrypted env store for deploy. An `.env.example` documents the var
  names with placeholder values only (and a note that the key value is base64 of the
  PEM). Confirm `.env.local` / `.env*.local` are git-ignored as part of Story 3.4.
- **Scope minimization (already locked, restated as a constraint):** the App's
  installation permissions are **read-only Metadata + Contents** (Contents only if
  private-language byte counts are needed), granted on the **selected `cipher codex`
  repos only**. A leak of the minted token's blast radius is then read-only
  visibility of those repos; the installation is **instantly revocable** from the
  App/installation settings, and rotating the App private key invalidates all future
  mints.

**Security note — the secret is now an RSA private key, not a scoped read token.**
This is a *more sensitive* credential if it leaks: the private key can mint fresh
installation tokens at will, whereas a leaked PAT was a single bounded token. The
mitigations: (a) the App's installation permissions remain **read-only Metadata +
Contents on selected repos only** — the blast radius of any token the key mints is
still read-only visibility of those repos, nothing else; (b) the installation is
**instantly revocable** and the **key is rotatable**, both without code change. The
heightened sensitivity makes the post-dev security exploit pass (Story 3.4
follow-up) load-bearing: it must verify that the **base64 PEM never reaches the
client bundle, and never appears in page props, logs, or error messages** (see the
Security review handoff, item 1, and AC-9).

**Trust-boundary summary (for the threat model to attack):**

| Tier | Runs where | Holds private key / minted token? | Holds GitHub data? |
|---|---|---|---|
| `lib/github.ts` + `getStaticProps` | server (build/ISR) | **yes** (reads key; mints + holds token in memory) | yes (fetches) |
| serialized page props | wire → client | **no (must verify — neither key nor token)** | yes (normalized only) |
| React components / browser | client | **no** | yes (normalized only, read) |
| optional `pages/api/revalidate.ts` | server (runtime) | no (uses a *separate* revalidate secret; never the App key) | no |

## Decision 3 — Data shape

Two normalized server-owned types, defined in `types/github.ts`, produced by
`lib/github.ts`. These are the *only* GitHub-derived structures that cross to the
client.

```ts
// types/github.ts  (shape, not implementation)
export interface RepoCard {
  id: number;
  name: string;
  fullName: string;          // "cipher-codex/<repo>"
  description: string | null;
  url: string;               // html_url
  homepage: string | null;
  isPrivate: boolean;        // drives a "Private" badge in the UI
  primaryLanguage: string | null;
  topics: string[];
  stars: number;
  pushedAt: string;          // ISO; for "recently active" sort
  languages: LanguageSlice[]; // normalized breakdown (Decision 5 folds the pie chart here)
}

export interface LanguageSlice {
  name: string;              // "TypeScript"
  bytes: number;
  percent: number;           // pre-computed 0–100, rounded; client does no math
}
```

Notes that are load-bearing for the security review and the UI story (3.5):

- **`languages` is pre-aggregated server-side.** The percent math currently done
  in the browser (`languagesPieChart.tsx`) moves into `lib/github.ts`. The client
  receives finished slices.
- **`isPrivate` is intentionally surfaced** so the UI can badge private repos, but
  **only safe metadata crosses the wire** — name, description, language byte
  counts, topics, stars. No clone URLs with embedded creds, no source content, no
  raw API payloads. The normalizer is an allow-list (map only the named fields),
  not a pass-through of the Octokit/REST object — this prevents accidental leakage
  of fields GitHub may add later.

#### Repo-level inclusion is a SECOND, fail-closed allow-list (MF-3 / VULN-2026-0006)

The field-level allow-list above controls **which fields** of a repo cross the
wire. It does **not** control **which repos** are shown. Those are two different
boundaries, and the design originally addressed only the first. Fetching every
cipher-codex repo with `listForOrg({ type: 'all' })` and rendering each as a card
means **every private repo** — client engagements, internal tooling, anything
with a revealing name/description/topic — is published to recruiters by default.
That is a confidentiality leak (CWE-200 / CWE-639). This amendment adds the
missing repo-level boundary.

**Decision (fail-closed opt-in allow-list):** `getCipherCodexRepoCards()` showcases
a repo **only if its `full_name` appears in an explicit opt-in allow-list**.
Nothing is shown unless the user chose it. The set lives in committed config:

```ts
// data/showcaseRepos.ts  (committed config — NOT a secret)
// The user's recruiter-worthy selections (content spec, planner) land here.
// Empty set => empty showcase. A new private repo is invisible until added.
export const SHOWCASE_REPO_ALLOWLIST: ReadonlySet<string> = new Set<string>([
  // "cipher-codex/<repo>",  // full_name, exactly as GitHub returns it
]);
```

**Why fail-closed (opt-in), not opt-out (exclusion list) — recommended and chosen:**

- The audience is **recruiters / the public web**, and the data is **private by
  default**. The only safe default for a public surface fed by private data is
  "show nothing unless explicitly chosen."
- An **exclusion list leaks by omission**: the moment a new private repo is
  created in the org (`client-acme-internal`, an unannounced product), it appears
  on the public page until someone remembers to add it to the deny-list. The
  failure mode is *silent exposure* — exactly the leak we are closing. An opt-in
  list's failure mode is the safe one: a repo the user *wanted* shown is merely
  absent until added (visible, harmless, self-correcting).
- A **topic-based opt-in** (e.g. show repos tagged `portfolio`) is acceptable in
  principle and also fail-closed, but it pushes the trust decision into GitHub
  repo settings where it is easy to set-and-forget and harder to review in one
  place. A committed `full_name` allow-list keeps the entire published set
  **auditable in one file in the repo**, diff-reviewable in PRs, and decoupled
  from GitHub UI state. (If the user later prefers topic-driven curation, it is a
  contained swap behind `lib/github.ts` — the seam is the same.)
- It is **not a secret** (it is a list of repo names the user is choosing to
  publicize), so it belongs in committed config — `data/showcaseRepos.ts` — or
  equivalently inside the normalizer in `lib/github.ts`. It must never live behind
  the token boundary as if it were sensitive.

**How it is applied (in `lib/github.ts`):** `getCipherCodexRepoCards()` may still
list with `type: 'all'` (so the user *can* opt private repos in), but it
**filters the listing against `SHOWCASE_REPO_ALLOWLIST` before normalizing** —
the filter runs first, then the field-level normalizer maps the surviving repos.
A repo whose `full_name` is not in the set is dropped before any of its fields are
ever placed in props. An empty allow-list yields an empty showcase (a valid,
fail-closed state — the UI shows its empty/placeholder treatment, not an error).

### Relation to `data/projects.ts` — GitHub is a SEPARATE section, not a merge

**Decision:** Keep the two sources distinct.

- `data/projects.ts` stays the **curated case-study** source (Epic 1.3 expands it
  into long-form writeups with hand-picked S3 images and narrative). It is
  authored content; it is not GitHub-derived.
- The GitHub layer powers a **new "Live from GitHub" / repo-showcase section**
  (Story 3.5) listing public + private `cipher-codex` repos as cards. It is
  generated, breadth-oriented, and auto-refreshing.

Rationale: they have different lifecycles (curated narrative vs. live metadata),
different cardinality (2 deep case studies vs. N repo cards), and different trust
properties (one is static repo content, the other crosses a token boundary).
Merging them would force the curated content through the GitHub normalizer and
couple a recruiter-critical narrative to GitHub availability. The **only** join
point: a curated project in `data/projects.ts` whose `repo.owner` is the
cipher-codex org **may** optionally render its `LanguageSlice[]` from the cached
GitHub layer (this is exactly the `languagesPieChart` refactor, Story 3.6) — a
lookup by `fullName`, not a structural merge. `types/project.tsx` is unchanged by
this ADR.

## Decision 4 — Caching / rate-limit / fallback strategy

- **`revalidate: 3600`** (1 hour) on every page that surfaces GitHub data. Tunable
  later; 1h keeps us at a few calls/hour against the 5,000/hr installation-token
  ceiling and is fresh enough for repo metadata that changes rarely.
- **Fail-by-throwing for resilience:** in `getStaticProps`, a non-OK GitHub
  response (or Octokit throw) **must propagate as a thrown error**, so ISR retains
  the last good page (Decision 1). Do not `return { props: { repos: [] } }` on
  error — that would cache an empty showcase. (VERIFIED Next.js 14 ISR semantics.)
- **First-build dependency:** the initial build calls GitHub; a GitHub outage at
  build time fails the build (acceptable, visible, not a silent prod break).
- **One request fan-in:** `lib/github.ts` batches the list + per-repo languages
  calls and is the single rate-limit consumer. With ISR this is bounded regardless
  of traffic.
- **Zero-renewal tokens (the reason the App was chosen):** installation access
  tokens are **minted on demand and auto-refreshed by `@octokit/auth-app` (~1-hour
  lifetime)**, so there is **no long-lived token to schedule-rotate or to let
  expire**. The old PAT rotation chore (≤366-day max lifetime, with the invisible
  401→stale-page failure mode it created) is **eliminated** by this amendment. The
  remaining operational concern is the App **private key** itself: it does not
  expire on a clock, but should be rotatable on demand and revocable via the
  installation. (VERIFIED: octokit/auth-app README; GitHub Docs — installation
  tokens expire after 1 hour and the SDK regenerates them.)
- **Auth-failure resilience is unchanged:** if a mint fails (key revoked/rotated,
  GitHub auth outage), the Octokit call throws → `getStaticProps` throws → ISR
  serves the last good page (Decision 1). A persistent mint failure should surface a
  build/log signal rather than hide behind the stale-page fallback (see AC-7).

### Folding in the existing unauthenticated client call (`languagesPieChart.tsx`)

Today `components/languagesPieChart.tsx` fetches
`api.github.com/repos/{owner}/{repo}/languages` **client-side, unauthenticated**
(60 req/hr/IP, and it cannot see private repos at all). The fold:

- The languages fetch + percent aggregation **moves server-side** into
  `lib/github.ts`, producing `LanguageSlice[]` (Decision 3).
- `languagesPieChart.tsx` becomes a **pure presentational component**: it receives
  `slices: LanguageSlice[]` as a prop and renders the chart. It **drops the
  `useEffect`/`fetch`/`useState` entirely** and no longer needs `owner`/`repo` to
  call the network.
- The `dynamic(..., { ssr: false })` import in `pages/projects/[id].tsx` can stay
  for bundle reasons (Nivo is heavy) but the **data no longer comes from the
  browser** — it arrives via `getStaticProps` props. This removes the last
  client-side GitHub call and gains private-repo language data for free.
- This is **Story 3.6**, gated behind 3.4; this ADR only fixes the seam and shape.

## Decision 5 — Concrete file seam for Sprint 2

The developer (Story 3.4, then 3.5/3.6) builds into these exact paths:

- **`lib/github.ts`** *(new — the entire credential boundary)*. Reads
  `process.env.GITHUB_APP_ID`, `process.env.GITHUB_APP_INSTALLATION_ID`, and
  `process.env.GITHUB_APP_PRIVATE_KEY_BASE64` (base64-decoded to PEM in memory),
  uses `@octokit/auth-app`'s `createAppAuth` to mint a short-lived installation
  token, instantiates Octokit (REST) with that auth strategy, and exposes
  server-only functions returning the Decision 3 shapes, e.g.:
  - `getCipherCodexRepoCards(): Promise<RepoCard[]>` — list org repos
    (`type: 'all'` so private are *eligible* to be opted in) + languages,
    normalized + percent-computed. **Filters the listing against
    `SHOWCASE_REPO_ALLOWLIST` (fail-closed opt-in, Decision 3 / MF-3) before
    normalizing** — a repo not in the allow-list is dropped before any field is
    read. An empty allow-list returns `[]` (empty showcase, not an error).
  - `getRepoLanguages(fullName: string): Promise<LanguageSlice[]>` — for the
    `languagesPieChart` refactor / per-project lookup.
  This module is the **only** reader of the three `GITHUB_APP_*` vars (and the only
  place the private key is base64-decoded and the installation token is minted).
  Must never be imported by a client component.
- **`data/showcaseRepos.ts`** *(new — committed config, NOT a secret, MF-3)* —
  exports `SHOWCASE_REPO_ALLOWLIST: ReadonlySet<string>`, the user's explicit
  opt-in set of `cipher-codex/<repo>` full-names that may appear on the public
  showcase. This is exactly where the planner's content-spec selection ("which
  private repos are recruiter-worthy") lands. Imported by `lib/github.ts`; safe to
  import anywhere (it holds no secret). Empty set => empty showcase.
- **`types/github.ts`** *(new)* — `RepoCard`, `LanguageSlice` (Decision 3).
- **`getStaticProps`** in the page that hosts the showcase (Story 3.5 picks the
  page; default expectation `pages/projects.tsx`, replacing its current
  `getInitialProps`) and in **`pages/projects/[id].tsx`** (replacing
  `getInitialProps` with `getStaticProps` + `getStaticPaths`, coordinating with
  perf Story 4.4) — each calls `lib/github.ts` and sets `revalidate: 3600`.
- **`components/languagesPieChart.tsx`** *(modified, Story 3.6)* — prop-driven,
  network-free (Decision 4 fold).
- **`.env.example`** *(new)* — documents `GITHUB_APP_ID=`,
  `GITHUB_APP_INSTALLATION_ID=`, and `GITHUB_APP_PRIVATE_KEY_BASE64=` placeholders
  (with a note that the last is base64 of the RSA PEM private key).
- **`pages/api/revalidate.ts`** *(optional, deferrable)* — on-demand revalidation
  trigger only; verifies a separate shared secret + (ideally) GitHub webhook HMAC;
  never calls GitHub with request input; never returns GitHub data.
- **`next.config.js`** — **no change for the credentials.** The `env` block must not
  gain any of `GITHUB_APP_ID`, `GITHUB_APP_INSTALLATION_ID`, or (above all)
  `GITHUB_APP_PRIVATE_KEY_BASE64`.

**Parallel-ownership note:** `lib/github.ts`, `types/github.ts`,
`data/showcaseRepos.ts`, and the showcase `getStaticProps` are the developer's
seam for Sprint 2's GitHub track and are disjoint from the redesign track (Epic 2.3/2.4 components/tokens) and the SEO/a11y
track (Epic 4.2/4.3 `next/head`), so they parallelize cleanly. The one shared
file is `pages/projects/[id].tsx` (GitHub data fold + perf `getStaticProps`
conversion both touch it) — sequence 3.6 with 4.4 or assign single ownership.

---

## Security review handoff (Story 3.3 — threat-model THIS boundary)

The boundary to attack and the must-fix constraints to validate:

1. **Private key (and minted token) never reach the client.** Verify the production
   client bundle contains no value of `GITHUB_APP_PRIVATE_KEY_BASE64` (the base64
   PEM), no decoded PEM, no minted installation token, and no
   `process.env.GITHUB_APP_*` reader. The base64 PEM must **never** appear in the
   client bundle, in page props / `__NEXT_DATA__`, in logs, or in error messages
   (the App private key is more sensitive than a scoped read token — it can mint
   fresh tokens). None of the three `GITHUB_APP_*` vars are in the `next.config.js`
   `env` block. **(must-fix)**
2. **Single-reader invariant.** The three `GITHUB_APP_*` vars (and the
   base64-decode + token mint) are referenced only in `lib/github.ts`. **(must-fix)**
3. **No token-bearing runtime data proxy.** No `pages/api/*` route accepts a
   repo/owner/url param and proxies an authenticated GitHub call (SSRF/abuse).
   If `pages/api/revalidate.ts` exists, it verifies a secret/HMAC and returns no
   GitHub data. **(must-fix if a proxy/route is introduced)**
4. **Normalizer is allow-list, not pass-through.** Only the Decision 3 fields
   cross the wire; no raw Octokit payload, no clone URLs with creds, no source
   content. **(must-fix)**
4b. **Repo set is a fail-closed opt-in allow-list (MF-3 / VULN-2026-0006).** No
   cipher-codex repo appears in page props unless its `full_name` is in
   `SHOWCASE_REPO_ALLOWLIST` (`data/showcaseRepos.ts`). The filter runs before the
   field normalizer; an empty allow-list yields an empty showcase, never a
   default-exposure of every private repo. **(must-fix)**
5. **Fail-closed-to-stale, not fail-to-empty.** `getStaticProps` throws on GitHub
   failure so ISR serves the last good page; it does not cache an empty showcase.
   **(advisory — correctness/resilience, rolls into post-dev pass)**
6. **`.env*.local` git-ignored; App permissions read-only Metadata + Contents on
   selected cipher-codex repos only; installation revocable and key rotatable.**
   **(advisory)**
7. **Mint-failure visibility.** A persistent installation-token mint failure
   (key revoked/rotated, GitHub auth outage) must surface (build/log signal), not
   hide indefinitely behind the stale-page fallback. (Note: routine ~1-hour token
   expiry is auto-refreshed by the SDK and needs no operator action — the old PAT
   ≤366-day rotation chore no longer applies.) **(advisory)**

Findings classified **must-fix** revise this ADR before Story 3.4; **advisory**
findings roll into the post-dev security pass and the relevant acceptance criteria.

---

## Acceptance criteria for the planner (conditions, not implementations)

Attach to the relevant Epic 3 stories:

- **AC-1 (3.4):** No GitHub App credential or credential-reading code path appears
  in the production client bundle — no `GITHUB_APP_PRIVATE_KEY_BASE64` value, no
  decoded PEM, no minted installation token, no `process.env.GITHUB_APP_*` reader;
  and none of the three `GITHUB_APP_*` vars are present in the `next.config.js`
  `env` block.
- **AC-2 (3.4):** The three `GITHUB_APP_*` vars (and the base64-decode + installation-
  token mint via `@octokit/auth-app`) are referenced in exactly one module
  (`lib/github.ts`).
- **AC-3 (3.4):** The repo showcase renders only **opted-in** cipher-codex repos
  (public **or** private) as cards — a repo is shown iff its `full_name` is in
  `SHOWCASE_REPO_ALLOWLIST`; private opted-in repos are visibly badged; data is
  fetched server-side via ISR with `revalidate` set.
- **AC-4 (3.4):** When the GitHub API is unavailable at request time, the showcase
  page still serves the last good content (no blank/empty showcase, no error
  page) — i.e. `getStaticProps` fails by throwing, not by returning empty data.
- **AC-5 (3.6):** `components/languagesPieChart.tsx` performs no network request
  and receives its data as props; no unauthenticated client-side call to
  `api.github.com` remains anywhere in the app.
- **AC-6 (3.5):** Only the normalized `RepoCard`/`LanguageSlice` fields cross to
  the client; no raw GitHub API object is serialized into page props.
- **AC-7 (3.2/3.4):** The curated `data/projects.ts` case studies and the live
  GitHub showcase remain distinct sections; the only coupling is an optional
  language-breakdown lookup by repo full name.
- **AC-8 (3.4 build; post-dev security pass) — fail-closed repo opt-in (MF-3 /
  VULN-2026-0006):** **No cipher-codex repo appears in page props unless its
  `full_name` is in the opt-in set `SHOWCASE_REPO_ALLOWLIST`
  (`data/showcaseRepos.ts`).** The repo filter is applied in `lib/github.ts`
  before normalization. Verifiable conditions: (a) with an empty allow-list the
  showcase props contain zero repo cards (no error page); (b) a private repo whose
  `full_name` is **not** in the set never appears in `__NEXT_DATA__` /
  `/_next/data/<buildId>/*.json` for the showcase page; (c) only repos whose
  `full_name` is in the set are present, public or private alike. (This is a
  **must-fix** condition, not advisory.)
- **AC-9 (3.4 build; post-dev security exploit pass — Story 3.4 follow-up):** The
  App **RSA private key** never crosses the server boundary. Verifiable conditions:
  (a) the base64 PEM (`GITHUB_APP_PRIVATE_KEY_BASE64`) and its decoded PEM appear in
  **no** production client bundle, in `__NEXT_DATA__`, or in any
  `/_next/data/<buildId>/*.json`; (b) neither the key nor a minted installation
  token appears in page props, build logs, runtime logs, or any error/exception
  message surfaced to a response; (c) the three `GITHUB_APP_*` vars are read only in
  `lib/github.ts`. The exploit pass must actively probe error/failure paths (e.g. a
  forced mint failure) to confirm no credential leaks through an error message.
  (**must-fix** — the private key is more sensitive than the former scoped PAT.)

---

## Consequences

- **One-way doors:** none locked here. `revalidate` window and an on-demand
  revalidation route are reversible later. The auth mechanism is now a **GitHub App
  installation** (the user's locked call, this amendment); it remains a contained
  choice behind `lib/github.ts` — reverting to a PAT, or graduating to multi-org/
  multi-installation, is a swap inside that single module and does not touch the
  rest of the design.
- **Host portability:** ISR `revalidate` and `res.revalidate()` assume a Next.js
  Node server (Vercel or self-hosted `next start`). A future static-only export
  (`output: 'export'`) would forfeit ISR and force build-time-only refresh — note,
  not a today problem.
- **`lib/github.ts` is a hard server boundary** — importing it (even transitively)
  from a client component would pull the private-key-reading / token-minting code
  (and `@octokit/auth-app`, which is explicitly not for browser use) toward the
  bundle; the single-reader rule plus normalized-prop rule keep that from happening.

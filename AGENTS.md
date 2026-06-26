# How development works here

This file is the orchestration layer. It describes the development process and
points to the specialist subagents that carry the detailed standards. It does
**not** restate those standards — each subagent's prompt owns them, and loads
only when that agent runs. Keep this file thin; depth lives in the agents and in
the nested `AGENTS.md` files.

> **Starter note.** This is a stack-neutral starter assuming a TypeScript/React
> web app backed by Postgres — adjust the specifics to your project. The agents
> and the workflow are the reusable part; the guardrail sections below start
> empty and the agents fill them in as the project grows.

## Delegation model (who may spawn whom)

The lead orchestrates; specialists report back to it. Claude Code lets a subagent
spawn another subagent (nested several levels deep), but this repo keeps that
power **deliberately narrow**: only the `developer` and `debugger` hold the
`Agent` tool, and only to pull in the **researcher** for an external-fact gap
mid-task. The researcher is a leaf — it spawns nothing. Every other agent
(planner, architect, ux-designer, cyber-security-engineer, qa-engineer) reports
its findings to the lead, which dispatches the next specialist. Do not widen
these spawn rights without a reason: broad nested fan-out costs the lead its
visibility into the work and compounds token use.

## The cadence: plan → (architect) → (design) → research → implement → test → (fidelity + security)

For any non-trivial feature, the lead orchestrates this flow rather than coding
straight away:

1. **Plan.** Delegate to the **planner** to turn the request into a spec and a
   set of epics/stories. Don't skip to implementation on ambiguous requests.
2. **Architect (when flagged).** When the planner tags a story
   `architecture: required` — data model, service boundary, external-integration
   shape, non-functional requirements, or infrastructure topology — delegate the
   design to the **architect** before implementation stories are written. Its
   design doc and acceptance criteria fold into the spec. Architecture decisions
   touching authn/authz/data boundaries trigger a design-time threat-model review
   by the **cyber-security-engineer** (once: must-fix changes the design, advisory
   rolls into the post-dev security pass).
3. **Design (when flagged).** When the planner tags a story `design: required` —
   any new or materially changed user-facing UI — delegate to the **ux-designer**
   before implementation stories are written. It returns a design spec (intent,
   visual hierarchy, section rhythm, tokens, SVG assets, motion) and acceptance
   criteria that fold into the spec, so the developer builds to the design rather
   than inventing layout. If a story is both `architecture: required` and
   `design: required`, the architect runs first (its structural call constrains
   the layout), then the ux-designer designs within it.
4. **Research first (always).** Every epic begins with a research/fact-finding
   story, run **before** writing implementation stories. Use the configured web
   search MCP for anything not knowable from the repo — don't guess from training
   data. That opening story is the **planner**'s *strategic* research. For
   *tactical* gaps that surface mid-story — an API's real behavior, a correct
   code example, a library/tool evaluation, "is this guidance still current" —
   the **researcher** (web search + WebFetch, returns cited, confidence-tagged
   findings) is dispatched. The lead can call it, and so can the `developer` and
   `debugger` agents directly — they carry the `Agent` tool and pull the
   researcher in when they hit a gap mid-task. The researcher is a leaf — it
   spawns nothing further.
5. **Implement.** Each implementation story carries an implementation plan, a
   testing plan, and the actual tests. Delegate the build to the **developer**.
6. **Test.** UI and end-to-end coverage goes to the **qa-engineer**. Non-UI
   logic tests are part of the developer's story.
7. **Fidelity & security (when flagged).** After the feature lands: for
   `design: required` stories the **ux-designer** runs a non-blocking Playwright
   design-fidelity audit (does the built UI match the intended hierarchy);
   findings return to the planner as stories. For `security-review: required`
   stories — new/bumped dependency, authn/authz change, or a data/trust boundary
   — the **qa-engineer** hands off to the **cyber-security-engineer** for an
   exploit pass, dependency CVE scan, and auth probing; CRITICAL findings go back
   to the **planner** as blocking or spawned stories (see its intake rules).

Pause for human review after the research story before committing to the
implementation stories it shaped.

## Who does what — routing

The lead delegates by matching the task to a subagent's description. Name an
agent explicitly when you want to be sure. If you are about to do specialist
work **directly in the main session**, prefer delegating so the specialist's
standards and context apply — the standards are NOT in this file, they're in the
agent.

| Task                                                                         | Agent                                                          |
| ---------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Turn a request into spec/epics/stories; research stories                     | **planner**                                                    |
| Technical design: data model, service/trust boundaries, integration shape, infra topology | **architect** (read/design; ADRs + acceptance criteria, no code) |
| Design or audit UX/visual: hierarchy, theme/tokens, interaction, SVG/infographics, when to reuse vs. vary | **ux-designer** (read-only on app source; specs + SVG + Playwright audit, hands build to developer) |
| Build a feature: frontend (React), backend, SQL/migrations, access policies  | **developer**                                                  |
| Write/run UI + e2e tests, browser QA (Playwright MCP)                        | **qa-engineer**                                                |
| Exploit testing, dependency CVE scans, auth/authz attack review (Playwright + web search MCP) | **cyber-security-engineer** (finds & proves; files CRITICAL stories, no app fixes) |
| Investigate a bug, test failure, or unexpected behavior → root cause         | **debugger** (read-mostly)                                     |
| Tactical fact-finding when the repo can't answer: API behavior, code examples, library evaluation, "is this current" (web search + WebFetch) | **researcher** (read-only on app source; cited findings, writes `docs/research/`; callable by the lead and directly by developer/debugger) |

Notes on overlaps:

- **Design split.** The **ux-designer** owns look/feel/flow, visual hierarchy,
  the token system, and when to reuse vs. vary a component; it hands specs + SVG
  to the **developer** to build. Structural calls within a design (a new route,
  data the page needs, render tier) belong to the **architect**; the designer
  works within that shape. *Design* fidelity is the ux-designer's Playwright
  audit; *behavioral* testing is the qa-engineer's — disjoint specs.
- **Design vs. architecture.** Architect sets structure (routes, data shape,
  boundaries); ux-designer sets the experience within it. When both apply to a
  story, architect first, then designer.
- **Write access.** Only **developer**, **qa-engineer**,
  **cyber-security-engineer**, **architect**, **ux-designer**, and **researcher**
  write files, each to a disjoint target: developer → app source (incl.
  migrations/policies); qa-engineer → `e2e/` + component tests;
  cyber-security-engineer → `security/`; architect → `docs/adr/`; ux-designer →
  `design/`; researcher → `docs/research/`. In shared `AGENTS.md` files each
  writes only its own named section (see below). planner and debugger are
  read-only.
- **Research split.** The **planner** runs the strategic research story that
  opens an epic; the **researcher** handles tactical, just-in-time gaps that
  surface during a story. Both use web search; the researcher also fetches full
  pages and persists reusable notes to `docs/research/`. The researcher reports
  facts and options — it does not make scope (planner), architecture (architect),
  or design (ux-designer) decisions.

## Running work in parallel

Independent stories can run as parallel subagents (or background sessions),
**three to five at a time** is the practical sweet spot. The rule that keeps
them from clobbering each other: **each parallel worker owns a disjoint set of
files.** Partition along the repo's natural seams (the nested-AGENTS.md
subtrees). The planner assigns ownership when it writes parallelizable stories;
stories that depend on another's output must NOT be parallelized. When parallel
sessions edit overlapping areas, isolate them with git worktrees.

Typical disjoint ownership: app source (**developer**) · `e2e` and component
tests (**qa-engineer**) · `security/` (**cyber-security-engineer**) ·
`docs/adr/` (**architect**) · `design/` (**ux-designer**) · `docs/research/`
(**researcher**).

---

# Nested AGENTS.md — repository knowledge map

This repo can have **directory-scoped `AGENTS.md` files** that capture hard-won,
non-obvious knowledge for the area they live in. Agentic tools load every
`AGENTS.md` on the path from the repo root down to the file being edited, so the
nearest one is the most specific context you have. Read the relevant one
**before** working in that area.

_No nested `AGENTS.md` files yet._

---

# Developer context (maintained by developer agent — do NOT remove)

Standing implementation notes, gotchas, and recipes for the app source tree. The
**developer** owns this section; other agents do not edit it.

## Theme system (Sprint 2 — Stories 2.3 + 2.4)

- **Provider:** `next-themes@0.4.6`, `attribute="class"`, `defaultTheme="system"`, `enableSystem`.
  Installed in `pages/_app.tsx`. `suppressHydrationWarning` not needed on `<html>` with
  this version — next-themes handles FOUC via inline script.
- **Token layer:** All CSS custom properties in `styles/globals.css` on `:root` (light) and
  `.dark` (dark). Three glass tiers `.glass`, `.glass-strong`, `.glass-chip` defined once there.
  Do NOT re-define backdrop-filter per component.
- **Tailwind surface:** Tokens surfaced via `tailwind.config.ts` `theme.extend` (colors,
  fontFamily, fontSize, spacing, maxWidth, borderRadius). Use token names (`bg-accent`,
  `text-fg-muted`, etc.) in Tailwind classes, or `var(--token)` in inline styles.
- **Font variables:** `--font-sora` (display, `--font-display`) and `--font-inter` (body,
  `--font-sans`) injected via `next/font` in `_app.tsx`. Both variables must be on the root
  `div` wrapper for CSS to resolve them.
- **Background:** Two SVGs (`public/mesh-bg-light.svg`, `public/mesh-bg-dark.svg`) rendered in
  `_app.tsx` as a fixed `position: fixed` layer. Scrim (`var(--scrim)`) is always on top of
  them. Light/dark swap is driven by Tailwind `dark:` classes (`dark:opacity-100` /
  `opacity-0`). Real raster photos go here (DEP-1) when supplied — replace the SVG `<img>`
  tags with `next/image priority`.
- **Headshot:** moved from repo root → `public/headshot.jpg`.

## Retired (do not reintroduce)

- `components/lavalamp.tsx` — deleted (Story 0.5). Infinite CSS blob animation retired.
- `@madeinhaus/nextjs-page-transition` hook (`useNextCssRemovalPrevention`) — no longer used in
  `_app.tsx`. The package still exists in `node_modules` (dep cleanup is Story 0.2). Do not
  re-import it.
- Orbital SCSS-var-in-JS pattern in `index.tsx` — reading `styles.orbitalCount`/`styles.rotateN`
  from a CSS module to drive JS animation. Deleted in landing rebuild (Story 2.4).
- No infinite/perpetual animation anywhere (RULE from spec §7, enforced by arch guardrail).

## Page layout structure (post-Sprint 2 batch 2)

- `pages/index.tsx` — standalone layout (no `Page` wrapper), own NavBar import.
- `pages/projects.tsx` and `pages/projects/[id].tsx` — migrated in Sprint 2 batch 2:
  standalone layout, own NavBar import, no `Page`/`PageHeader` wrapper. Uses
  `getStaticPaths`/`getStaticProps` on the detail page (replaced `getInitialProps`).
- `pages/about.tsx` — migrated in Sprint 2 batch 2 (this story): standalone layout,
  own NavBar import, no `Page`/`PageHeader` wrapper, no Modal usage. PDF embed removed;
  résumé CTA is now a `mailto:` link only. Achievement cards are anonymized — no employer
  names, dates, or phone numbers anywhere. `components/education.tsx` restyled to `.glass`.
- `pages/skills.tsx` — migrated in Sprint 2 batch 2 (this story): standalone layout,
  own NavBar import, no `Page`/`PageHeader` wrapper. `data/skills.ts` fully replaced with
  expanded taxonomy (11 categories, react-icons). `components/skill.tsx` is now a flat pill
  (no backdrop-filter) — blur lives on the category `.glass` panel, not per-skill.
- `components/page.tsx` — thin compatibility wrapper. Only used by surviving legacy pages;
  delete once all pages migrate.

## About + Skills pages — glass migration notes (Sprint 2 batch 2)

- `pages/about.tsx`: Six-section rhythm (bio → quick-facts chips → achievement cards →
  industry tags → education → contact). Body copy on `.glass-strong` (§3.2). Achievement
  cards on `.glass` tier-1 (titles only, ≥20px large-text). No employer names, dates, or
  phone number anywhere — hard privacy rule.
- `pages/skills.tsx`: Category panels on `.glass` (one blur per panel). Skill pills are flat
  (`--glass-bg-chip` background + border, no `backdrop-filter`). Two largest categories
  (AWS, Frameworks & Libraries) span full 2-column grid width as feature panels (spec §4.3).
- `data/skills.ts`: Exports `SkillsMap = Record<string, SkillEntry[]>` and `SkillEntry`
  interface (skill + IconType). Hardware/OS categories removed. 11 public-safe categories.
- `components/skill.tsx`: Pure token-based styling, no SCSS module.
- `components/education.tsx`: Pure token-based `.glass` styling, no SCSS module.
- Deleted: `styles/about.module.scss`, `styles/skills.module.scss`, `styles/education.module.scss`.
  All styling now uses design tokens and the `.glass*` utility classes.

## Projects pages — glass migration notes (Sprint 2 batch 2)

- **`pages/projects.tsx`:** Asymmetric grid — first project card spans a wider column
  (featured), subsequent projects go into narrower columns. Scoped `<style>` tag inside
  the component drives responsive column spans (no SCSS needed). Status badges use
  `--fg-muted` / `--success` / `--warning` per §4.6 — **NOT accent** (accent budget is
  for actions only). Has a MMA Almanac system callout strip in the showcase section header
  that links to the 4 system repo deep-dive pages.
- **`pages/projects/[id].tsx`:** Detail page sections: header → carousel → case-study body
  (`.glass-strong` for body copy per §3.2) → languages chart (`.glass`) → footer nav.
  Gracefully omits empty `impact[]` sections (Air PnP has none). Switched from
  `getInitialProps` to `getStaticPaths`/`getStaticProps` for proper static generation.
- **`pages/projects/repo/[slug].tsx`:** Deep-dive pages for the 9 Cipher-Codex showcase
  repos. Slug = repo name after "Cipher-Codex/" (e.g. "mma-almanac-ai"). Merges live
  `RepoCard` data (from `getCipherCodexRepoCards()`) with static `ShowcaseDetail` from
  `data/showcaseDetails.ts`. Architecture diagrams are inlined as React SVG components via
  `@svgr/webpack` (scoped to `design/assets/repo-diagrams/` in `next.config.js`).
  `currentColor` on the SVGs inherits `color: var(--fg)` from the `.glass` container so
  diagrams theme with light/dark toggle. MMA Almanac repos additionally render the
  `mma-almanac-system.svg` system overview and cross-link the 4 related repos.
  Public repos show an outbound "View on GitHub" link; private repos do not.
  ISR revalidate: 3600. On fetch failure: throws (ADR 0001 D4).
- **`components/repoCard.tsx`:** Updated — ALL cards (public AND private) now link
  internally to `/projects/repo/[slug]`. Slug derived from `repo.fullName.split("/")[1]`.
  Public repos still show their github.com URL, but via the deep-dive page header only.
  Added "Deep dive →" CTA in the card footer row.
- **`components/carousel.tsx`:** Fully rewritten — glass frame (tier-1), real `<img src>`
  (not the broken `src="url(...)"` from the old version), `useReducedMotion`, inline SVG
  nav buttons, caption support via `captions?: Record<string, string>` prop.
- **`components/modal.tsx`:** Added `role="dialog"`, `aria-modal`, Esc-to-close, focus trap,
  focus restoration, native `<button>` close. Removed stray `console.log`. No SCSS import.
- **`components/languagesPieChart.tsx`:** Container restyled to inline tokens; fetch logic
  untouched. Story 3.6 reroutes it through `lib/github.ts`.
- **`components/skill.tsx`:** Prop type widened to union `IconType | React.ComponentType<...>`
  to fix a pre-existing type error in `pages/skills.tsx` that blocked the build.

## Repo deep-dive pages — SVGR wiring (next.config.js)

Architecture diagrams in `design/assets/repo-diagrams/*.svg` are imported as React
components via a path-scoped `@svgr/webpack` rule in `next.config.js`. The rule matches
only `/design\/assets\/repo-diagrams\/` — all other SVG imports use Next.js's default
static-file URL loader. The SVGR options keep `svgo: false` so the hand-authored SVG
structure is preserved. Type declarations are in `types/svg.d.ts`.

**Critical pattern:** render each diagram inside a container with `color: var(--fg)` so
`currentColor` in the SVG resolves to the themed foreground value. Without this the diagram
renders in the browser default black on both light and dark themes.

## Static detail data — data/showcaseDetails.ts

Contains `ShowcaseDetail` records keyed by slug for all 9 showcase repos. Each record has:
`slug`, `title`, `blurb` (meta description), `what` (prose writeup), `highlights` (string[]),
`stack` (string[]), `diagram` (SVG slug), and optionally `system` / `systemDiagram` for the
MMA Almanac group. Content is sourced from `docs/research/cipher-codex-repos.md`. Do not
invent metrics or employer names. Also exports `SHOWCASE_SLUGS` (order for getStaticPaths).

## Deleted SCSS modules (Sprint 2 batch 2)

These files are fully replaced by glass token classes and were removed:
- `styles/Projects.module.scss`
- `styles/Carousel.module.scss`
- `styles/modal.module.scss`
- `styles/languagesPieChart.module.scss`

---

# Security guardrails (maintained by cybersec agent — do NOT remove)

Standing security rules live here: safe-usage rules for latent CVEs (the
dependency is safe only as currently used) and "do not reintroduce" rules from
resolved findings (with their `VULN-`/CVE references). The
**cyber-security-engineer** owns this section; other agents do not edit it but
must treat its rules as hard constraints.

## GitHub App private key — never in bundle/props/logs/errors (VULN-2026-0010 / ADR-0001 AC-9)

**Verified empirically on 2026-06-25 production build.** The RSA private key (`GITHUB_APP_PRIVATE_KEY_BASE64`
and its decoded PEM form) must never appear in any `.next/` artifact, `__NEXT_DATA__` prop, server-side log, or error message. Standing rule: this boundary was verified by exhaustive scan of all 76 `.next/` build output files — zero key material found. Do not reintroduce.

Attack: `GITHUB_APP_PRIVATE_KEY_BASE64` in a client chunk → attacker reads `window.__NEXT_DATA__` or fetches `/_next/data/<id>/projects.json` → base64 PEM extracted → attacker mints fresh installation tokens → reads all cipher-codex org repos at will. The key is more sensitive than a scoped PAT because it can mint unlimited tokens.

Standing checks that must pass after every build touching `lib/github.ts` or `pages/projects.tsx`:
1. `grep -r "BEGIN\|PRIVATE KEY\|GITHUB_APP_PRIVATE_KEY_BASE64" .next/static/ ` must return empty.
2. `grep -r "getOctokit\|createAppAuth\|getCipherCodexRepoCards" .next/static/` must return empty.
3. `__NEXT_DATA__` on `/projects` contains only `{ githubRepos: RepoCard[] }` — 12 allow-listed fields per card, no raw Octokit fields.
4. `grep -r "GITHUB_APP_" --include="*.ts" --include="*.tsx" . | grep -v lib/github.ts` must return empty (single-reader invariant).

**Note on `server-only` removal:** `import "server-only"` was removed from `lib/github.ts` (it is App-Router-only). The replacement is a runtime `typeof window !== "undefined"` throw (dev-mode only; webpack strips it in production server bundles) plus the structural guarantee: `lib/github.ts` is only ever imported via dynamic `await import(...)` inside `getStaticProps`, which is excluded from the client module graph by Next.js pages-router. This was verified empirically. Do not add a top-level static `import` of `lib/github.ts` in any client component — that would pull the key-reading code into the client bundle despite the webpack build condition.

## GitHub App credentials — never in next.config.js env block (VULN-2026-0002 / ADR-0001)

`next.config.js` `env` block inlines every listed value into the client JS bundle.
`GITHUB_APP_ID`, `GITHUB_APP_INSTALLATION_ID`, and `GITHUB_APP_PRIVATE_KEY_BASE64`
must NEVER appear in that block under any name. The pre-existing `api_url` and
`projects_per_page` entries are non-secrets and may stay; they are the cautionary
example of the pattern to avoid for secrets. Attack: any visitor runs
`window.__NEXT_DATA__` or reads page source → private key exposed → attacker mints
installation tokens → reads all cipher-codex private repos. Rule: add secrets to the host
env store and read them via bare `process.env.X` in server-only code only. (Verified clean 2026-06-25: `next.config.js` env block contains only `projects_per_page` and `api_url`.)

## GitHub App credentials — single reader, server-only (ADR-0001 AC-2)

All three `GITHUB_APP_*` vars (and the base64-decode + token mint) must be read in
exactly one module: `lib/github.ts`. No component, hook, shared util, or API route
may read them directly. No client import (even transitive) of `lib/github.ts` is
permitted. Enforced by grep in CI:
`grep -r "GITHUB_APP_" --include="*.ts" --include="*.tsx" . | grep -v lib/github.ts`
must return zero results. Do not reintroduce. See VULN-2026-0002 / ADR-0001.
(Verified clean 2026-06-25: only `lib/github.ts` reads these vars.)

## .gitignore must cover all .env.* variants (VULN-2026-0003 — resolved; do not reintroduce)

RESOLVED 2026-06-25. `.gitignore` now covers `.env.local`, `.env.production`, `.env.test`, `.env.staging`, `.env.development`, `.env`, and `*.env`. Do not remove any of these patterns. Do not create any `.env.*` file without first confirming it is git-ignored (`git check-ignore -v .env.<name>`). Attack: a new `.env.production` with `GITHUB_APP_PRIVATE_KEY_BASE64` committed to git → private key permanently in git history → anyone with repo access can mint installation tokens.

## getStaticProps props serialization — no raw GitHub payloads, no token (VULN-2026-0004 / ADR-0001 — resolved; do not reintroduce)

RESOLVED 2026-06-25. `__NEXT_DATA__` (embedded in page HTML) and `/_next/data/<buildId>/<page>.json` are publicly accessible to any unauthenticated requester. `getStaticProps` must return ONLY the allow-listed `RepoCard[]` / `LanguageSlice[]` types from `types/github.ts` — verified empirically: `/projects` `__NEXT_DATA__` contains exactly the 12 `RepoCard` allow-listed fields and nothing else. The normalizer in `lib/github.ts` is an explicit field map, not a spread/pass-through. Do not change the normalizer to a spread/pass-through or add raw Octokit fields to `RepoCard` — doing so immediately leaks those fields to every unauthenticated browser. VULN-2026-0004 / ADR-0001 AC-6.

## pages/api/revalidate.ts — HMAC + hard-coded path required (VULN-2026-0005 / ADR-0001)

If `pages/api/revalidate.ts` is implemented: (1) verify GitHub webhook HMAC
(`X-Hub-Signature-256`) against a separate `REVALIDATE_SECRET` env var before
calling `res.revalidate()`; (2) the revalidation path must be hard-coded in the
module — never derived from request body/query (`body.path` is an SSRF/traversal
vector); (3) the route must return no GitHub data whatsoever. Without HMAC
verification any unauthenticated attacker can trigger repeated regeneration,
exhaust the GitHub API rate limit, and force the showcase into permanent stale
mode. Attack class: CWE-918 + CWE-306.

## next dependency — do not downgrade below 14.2.35 (VULN-2026-0001 / CVE-2024-34351 — resolved; standing floor)

RESOLVED 2026-06-25. `next` is now at **14.2.35** (verified). CVE-2024-34351 (SSRF via Server Actions, CVSS 8.1, fixed in 14.1.1) is patched. Do not pin `next` below 14.1.1 under any circumstance. The resolved version floor is 14.2.35; upgrades are welcome, downgrades are not. See VULN-2026-0001 / VULN-2026-0009.

## flatted (dev) — safe only as a build-time eslint transitive dep (CVE-2026-32141)

`flatted` 3.2.9 is pulled in by `flat-cache` → `file-entry-cache` → `eslint`
(devDep). CVE-2026-32141 crashes Node via unbounded recursion in `flatted.parse()`
when given attacker-crafted input. Fixed in flatted 3.4.0. This dep is SAFE as
currently used: eslint only calls `flatted.parse()` on its own cache files, not
on web request input. Do not add any runtime code path that passes untrusted
network input to `flatted.parse()`. Upgrade flatted to >=3.4.0 at the next
routine dep bump. CWE-674.

## immutable (devOptional via sass) — safe only as build-time SCSS dep (CVE-2026-29063)

`immutable` 4.3.4 is used by `sass` during SCSS compilation. CVE-2026-29063 allows
prototype pollution via `mergeDeep()`/`merge()` with attacker-controlled keys.
Attack not reachable: sass uses immutable internally for its AST, with no
attacker-controlled input path at production runtime. Do not add any runtime
import of `immutable` that operates on untrusted data. CWE-1321.

---

# Architecture guardrails (maintained by architect agent — do NOT remove)

Standing design constraints and one-way-door decisions live here: trust-boundary
rules, secret-placement rules, and migration seams that must not be foreclosed.
The **architect** owns this section; other agents do not edit it. A durable rule
that emerges from a resolved `VULN-` whose fix implies a design constraint is
mirrored here from the Security guardrails section.

_No guardrails recorded yet. Format per entry:_

<!--
## <short title> (ADR-NNNN)

The standing constraint in one or two lines; the full reasoning lives in the
linked ADR under `docs/adr/`.
-->

## GitHub App data trust boundary (ADR-0001)

> **Amended 2026-06-25: PAT → GitHub App.** The credential was a read-only
> fine-grained PAT (`GITHUB_TOKEN`); it is now a **GitHub App installation**, chosen
> for zero-renewal operations (installation tokens auto-rotate ~hourly, so there is
> no long-lived token to schedule-rotate or let silently expire). The trust-boundary
> rules below are unchanged in shape; they now bind the App's **private key** as the
> secret. Reasoning in the ADR's auth-mechanism amendment.

GitHub auth is a read-only **GitHub App installation**, **server-only**. The App is
authenticated by three env vars; only one is a secret. Standing constraints (full
reasoning in
[docs/adr/0001-github-data-trust-boundary.md](docs/adr/0001-github-data-trust-boundary.md)):

- Credentials are three env vars — `GITHUB_APP_ID` and `GITHUB_APP_INSTALLATION_ID`
  (identifiers, not secrets) and **`GITHUB_APP_PRIVATE_KEY_BASE64`** (THE secret — a
  base64-encoded RSA PEM private key). **None** may be `NEXT_PUBLIC_`-prefixed, added
  to the `env` block of `next.config.js` (that block is inlined into the client
  bundle), passed into page props, logged, or read from client code — **emphatically
  not the private key**, which can mint fresh tokens and is more sensitive than a
  scoped read PAT was.
- `lib/github.ts` mints a **short-lived installation token** from the private key via
  `@octokit/auth-app` (`createAppAuth`) at build/ISR time; **no long-lived token is
  stored**. The three `GITHUB_APP_*` vars (and the base64-decode + token mint) are
  read in **exactly one module, `lib/github.ts`** — a hard server boundary that must
  not be imported (even transitively) by client code (`@octokit/auth-app` is not for
  browser use).
- Only normalized, allow-listed GitHub data (`RepoCard` / `LanguageSlice` in
  `types/github.ts`) crosses to the client — never a raw GitHub/Octokit payload.
- GitHub data is fetched server-side via ISR `getStaticProps` + `revalidate`, not
  from the browser. No runtime `pages/api/` route may fetch GitHub with
  request-supplied input (SSRF/abuse). An on-demand `pages/api/revalidate.ts` is
  allowed only if it verifies a secret/HMAC and returns no GitHub data.
- GitHub `getStaticProps` must **fail by throwing** on a non-OK response so ISR
  keeps serving the last good page; it must not cache an empty result.
- **Repo showcase is fail-closed opt-in (MF-3 / VULN-2026-0006).** The cipher-codex
  org is private-by-default and the showcase is recruiter/public-facing, so a repo
  is published **only if its `full_name` is in the explicit opt-in allow-list**
  `SHOWCASE_REPO_ALLOWLIST` (`data/showcaseRepos.ts`, committed config — not a
  secret). `getCipherCodexRepoCards()` filters the listing against the allow-list
  **before** the field normalizer runs; a repo not opted in must never reach page
  props. An empty allow-list => empty showcase (a valid state). **Do not** switch
  to an exclusion/deny-list or unfiltered `type: 'all'` rendering — both leak new
  private repos by default.

---

# Design system (maintained by ux-designer agent — do NOT remove)

Standing UX/visual constraints live here: confirmed token additions, intended
section-rhythm rules for key pages, and reuse-vs-vary decisions the developer
must preserve. The **ux-designer** owns this section; other agents do not edit
it. This section records only project-specific design decisions that aren't
obvious from the code.

<!--
## <short title>

The standing decision and why; what the developer must preserve when building.
-->

## Glassmorphic light/dark token system (design/02-2-visual-redesign-spec.md)

The visual language is **glassmorphic, light-mode default with toggleable dark
mode**, over a single fixed background image. The old cosmic/lavalamp/orbital
aesthetic is **fully retired** — do not reintroduce perpetual background
animation. Full spec + SVG: `design/02-2-visual-redesign-spec.md`,
`design/assets/`. Standing constraints the developer must preserve:

- **Tokens are CSS variables** on `:root` (light) + `.dark` (dark), surfaced via
  Tailwind `theme.extend`. No hard-coded hex/rgba glass values in components.
  Token table is canonical in the spec §2; add new tokens there before use.
- **One glass recipe, three tiers only:** `.glass` (tier-1 cards),
  `.glass-strong` (tier-2 text-heavy panels), `.glass-chip` (tier-3 inert chips),
  defined once in `globals.css`. Do not re-tune backdrop-filter per component or
  invent a fourth tier. `@supports not (backdrop-filter)` → opaque-surface
  fallback is required.
- **Accessibility is blocking (spec §3):** body/paragraph text may sit **only** on
  `.glass-strong`, **never** directly on the background image or on chip glass.
  All §3.4 contrast pairs must hold ≥AA in both themes against the *composited*
  background. The `--scrim` layer over the bg image is non-optional (it is what
  guarantees AA). Cap: ≤6 blurred elements and ≤2 blur radii per viewport; blur
  the container of long lists, not each item; **never nest `.glass` in `.glass`**
  (nested backdrop-filter breaks + perf).
- **Section rhythm (spec §4):** never stack >2 identical section layouts
  back-to-back. Landing hero is asymmetric (not a centered card) with exactly one
  primary action above the fold (resume/contact CTA). Skills/projects use a
  feature-span variation, not N identical rows. `--accent` ≤20% of any viewport.
- **Theme toggle (spec §6, story 2.3):** top-right of nav, pill `.glass-chip`,
  sun/moon hand-authored SVG, `next-themes` class strategy, `defaultTheme=system`
  but visible control toggles light↔dark; `aria-label` = next action, change
  announced (`aria-pressed` or `aria-live`), keyboard-activatable, no FOUC/no
  layout shift, choice persists.
- **Motion (spec §7):** no infinite animation; entrance/interaction only; every
  animation guarded by `prefers-reduced-motion` (global CSS guard +
  framer-motion `useReducedMotion`). No bg parallax. Do not add motion libraries
  (framer-motion already present).
- **Reuse vs vary:** reuse the resume/contact CTA band component across landing +
  about (identical purpose). Vary hero/feature/grid treatments per page per §4.
- **Repo-showcase hook (story 3.5, deferred):** future repo cards use `.glass`
  tier-1 + flat language chips + a **non-accent** "Private" badge, within the §4.4
  asymmetric-grid rhythm. Layout finalized only after the architect's GitHub data
  shape (ADR / story 3.2) lands — do not design repo cards before then.

---

# Keep nested AGENTS.md current (required)

These files are living wikis: a local explanation of an area's context and
purpose, cross-linked to related wikis. Treat them as part of the change, not an
afterthought.

When a change **materially alters the knowledge captured in an `AGENTS.md`** — a
new or changed API recipe, header/auth rule, architecture change, a new run
command or flag, a removed gotcha — **update the relevant `AGENTS.md` in the same
change**, just as you would update a test or a type. Specifically:

- Edit the nested `AGENTS.md` that owns the area you changed. If your change
  spans areas, update each affected file, and keep the cross-links between
  related wikis accurate.
- When you create a significant new subsystem directory that needs substantial
  documentation, add a new `AGENTS.md` for it, link it in the map above, and
  connect it to related wikis. Reserve this for areas with genuinely non-obvious,
  costly-to-rediscover knowledge — do not add boilerplate files to
  self-explanatory leaf directories.
- Keep these files **complement-only**: document what the code _can't_ tell a
  newcomer (the "why", the gotcha, the recipe), not a restatement of the code.
  Keep them concise.
- **Section ownership in shared files.** Root and nested `AGENTS.md` files carry
  agent-owned sections: `## Security guardrails` → cyber-security-engineer,
  `## Architecture guardrails` → architect, `## Design system` → ux-designer,
  area conventions → the area's writer. When editing an `AGENTS.md`, edit only
  your agent's section. This is the disjoint-ownership rule applied to docs, so
  the agents can touch the same file in parallel without clobbering each other.
- Treat a stale `AGENTS.md` as a bug. If you notice one that no longer matches
  the code, fix it.

When a story that touched a documented area completes, updating its wiki (and any
related wiki) is part of "done".

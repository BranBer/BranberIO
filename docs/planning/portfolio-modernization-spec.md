# Portfolio Modernization Spec — branber.io

Planning doc. No code. Audience for the *site*: **recruiters** (not only developers).
Companion research: [../research/portfolio-modernization-brief.md](../research/portfolio-modernization-brief.md).

## Locked decisions (2026-06-25)
- **Kickoff:** persist this spec first; human review before any code.
- **Aesthetic:** **replace** the dark lavalamp/orbital cosmic look entirely with a clean
  glassmorphic light/dark design + background images. Retire `lavalamp.tsx` and the
  `index.tsx` orbital animation. (Removes the SCSS-var-in-JS migration blocker.)
- **GitHub auth:** **read-only fine-grained PAT** scoped to the `cipher codex` org repos,
  **server-side only** — never `NEXT_PUBLIC_`, never sent to the browser. Graduate to a
  GitHub App only if multi-org later. Architect still writes the ADR for the fetch tier.

## Research verdict (settled)
- **No official Anthropic glassmorphic theme.** `anthropics/skills` `theme-factory` ships
  10 color/font palettes only; the glassmorphism style list is a *community* skill. Skip as
  a theme source.
- **Glass stack:** `next-themes` (toggle) + Tailwind `backdrop-blur` glass utilities +
  **shadcn/ui** base. Hard rule: glass lowers contrast — enforce WCAG text separation,
  especially over background images.

---

## 1. Current State Inventory

**Tech:** Next.js 14 pages-router, React 18, TS 5.3. Styling is **100% SCSS modules**
(20 `.module.scss` + `globals.css`), *not* styled-components. Legacy `getInitialProps` on
`projects.tsx` / `projects/[id].tsx` despite hardcoded data. Two Google Fonts via render-
blocking CSS `@import`. `next/image` allowlist = one S3 bucket.

**Pages:** `index` (BRANBER.IO + orbital graphic + 3 social links), `about` (bio, email,
resume PDF modal, 1 education entry), `skills` (react-icons tiles from `data/skills.ts`),
`projects` (2 projects from `data/projects.ts`), `projects/[id]` (carousel + repo/site links
+ live GitHub languages pie chart).

**Existing GitHub touchpoint:** `components/languagesPieChart.tsx` calls
`api.github.com/repos/{owner}/{repo}/languages` **client-side, unauthenticated** (60 req/hr/IP).
Seed for Epic 3.

**Dead dependencies (zero imports — pure bloat):** `@apollo/client`,
`@types/apollo-upload-client`, `@reduxjs/toolkit`, `styled-components` +
`babel-plugin-styled-components`, `@emotion/react`, `@emotion/styled`, `@mui/icons-material`,
`next-auth` + `@types/next-auth`, `cookies-next`, `@types/react-facebook-login`.
**Actually used:** next, react, framer-motion, react-icons, `@fortawesome/*`, `@nivo/*`,
`@madeinhaus/nextjs-page-transition`, sass. (Two icon systems coexist — FontAwesome + react-icons.)

---

## 2. Gap Analysis

**Styling bloat:** remove the 10 dead deps; migrate 20 SCSS modules → Tailwind; consolidate to
one icon library; reassess `@nivo/pie` (heavy for one chart) and the `@madeinhaus` transition hack.

**Missing features:** light/dark toggle (none today); glassmorphism + background images;
live GitHub repo showcase; private cipher-codex repos (server-side auth — see decision);
recruiter content (clear value-prop/headline, role targeting, prominent resume download + CTA,
case-study-depth project writeups — currently 2 projects, one paragraph each).

**Security (planning-level):** private repos need a server-side fetch boundary + secret storage
(PAT decided; architect picks tier). Current client-side unauth GitHub call should move behind a
cached server proxy. Audit `next.config.js` `env.api_url` exposure once auth lands.

**SEO/a11y/perf:** no `next/head`/title/meta/OG/Twitter/canonical/sitemap/robots/JSON-LD
(`Person` schema would help recruiters); `getInitialProps` blocks SSG for static data; render-
blocking font `@import`s (→ `next/font`); icon-only social links lack `aria-label`; `modal.tsx`
has a stray `console.log`, no focus trap / Esc / `role="dialog"`.

---

## 3. Epics & Stories

Each epic opens with a research story. Tags per AGENTS.md cadence. Architect-before-designer
when both fire. **Pause for human review after the research/design stories.**

### EPIC 0 — Foundation: dep purge & Tailwind
- **0.1 Research** Tailwind on Next 14 pages-router + SCSS→Tailwind + `next/font` migration.
- **0.2 Remove 10 dead deps.** `security-review: required` (dep-set/lockfile CVE sanity).
- **0.3 Install/config Tailwind + `next/font`** (replace `@import` fonts).
- **0.4 Migrate SCSS → Tailwind**, component by component; delete `.module.scss` as converted.
  *Aesthetic decision removes the orbital SCSS-var blocker — no reimplementation needed.*
- **0.5 Retire `lavalamp.tsx` + orbital animation; reassess `@madeinhaus` hack.**

### EPIC 1 — Recruiter content & IA (parallel; content-led)
- **1.1 Research** portfolio patterns that convert recruiters.
- **1.2 Value prop / headline / role targeting / contact CTA** (content spec → feeds Epic 2).
- **1.3 Expand project data into case studies** (`data/projects.ts`, `types/project.tsx`).
- **1.4 Real resume download + accessible contact.** `design: required`.

### EPIC 2 — Visual redesign: light/dark + glassmorphism
- **2.1 Research** glass + light/dark best practice (research brief intake).
- **2.2 `design: required`** Design spec: tokens, light/dark palettes, glass surfaces, section
  rhythm, background-image treatment, motion. **Runs before 2.3–2.5.** Writes `design/`.
- **2.3 Build** `next-themes` provider + accessible persisted dark-mode toggle (`navBar.tsx`, `_app.tsx`).
- **2.4 Build** apply glass tokens across migrated components + background images (partition by page).
- **2.5 `design: required` (audit)** post-build Playwright fidelity pass → findings to planner.

### EPIC 3 — Live GitHub integration (public + private cipher-codex)
- **3.1 Research** GitHub auth (PAT decided) + rate limits/caching + **threat-model note**.
- **3.2 `architecture: required`** GitHub data/trust boundary: API route vs build-time ISR fetch,
  PAT secret storage, caching, repo-card + languages data shape, relation to `data/projects.ts`.
  Writes ADR. **Runs before 3.4+.**
- **3.3 `security-review: required` (design-time)** threat-model the PAT + server fetch boundary
  (token never client-side, SSRF/abuse on any proxy route, harden the unauth fallback).
- **3.4 `security-review: required`** build server-side fetch layer + secret (per 3.2/3.3).
  New `lib/` / `pages/api/` seam (architect names paths). Post-dev exploit pass after.
- **3.5 `design: required`** repo-showcase UI (public + private cards, languages, filtering),
  within 3.2's data shape; folds into Epic 2 tokens.
- **3.6 Refactor `languagesPieChart`** onto the new cached server layer.
- **3.7 Follow-up** update tests touching project/repo rendering.

### EPIC 4 — SEO, a11y & performance hardening (parallelizable after foundation)
- **4.1 Research** pages-router SEO + a11y baseline + Lighthouse targets.
- **4.2 SEO** per-page `next/head` meta/OG/Twitter/canonical, `Person` JSON-LD, sitemap, robots.
- **4.3 A11y** `aria-label` social links, modal focus-trap/Esc/`role="dialog"`, remove
  `console.log`, contrast verification, keyboard toggle (coord. 2.3).
- **4.4 Perf** `getInitialProps` → `getStaticProps`/`getStaticPaths`; single icon lib; reassess `@nivo`.
- **4.5 QA** Playwright e2e (nav, toggle, resume, repo showcase) + Lighthouse regression. Writes `e2e/`.

---

## 4. Sprint Sequencing & Ownership

- **Sprint 1 (parallel, disjoint trees):** Epic 0 (`package.json`, `styles/`, config) ‖
  Epic 1 content (`data/`, `types/`) ‖ Epic 2.2 design (`design/`) ‖ Epic 3.1–3.3
  research/arch/security (`docs/research/`, `docs/adr/`, `security/`). **Human review gate after research/design.**
- **Sprint 2:** Epic 2.3+2.4 redesign build ‖ Epic 3.4+3.5 GitHub build ‖ Epic 4.2/4.3 SEO/a11y.
- **Sprint 3:** Epic 3.6 + 4.4 perf, 2.5 fidelity audit, 4.5 QA/Lighthouse, post-dev security pass.

**Sequential gates (do NOT parallelize):** 0.2→0.3→0.4; 2.2 before 2.3/2.4; 3.2→3.3→3.4→3.6.
0.4 can split across 3–5 developers by disjoint component groups.

## 5. Agent Routing

| Phase | Agent | Why |
|---|---|---|
| Epic-opening research (0.1/1.1/2.1/3.1/4.1) | **planner** | strategic research; 2.1/3.1 intake research brief |
| Mid-build fact gaps | **researcher** | just-in-time cited API/config facts |
| 3.2 boundary; 4.4 fetch-tier interplay | **architect** | trust boundary, secret placement, data shape, ADRs |
| 2.2 spec; 1.4/3.5 UI; 2.5 audit | **ux-designer** | tokens, glass, hierarchy, SVG, motion, fidelity audit |
| All build stories | **developer** | dep purge, Tailwind, toggle, server GitHub layer, SEO/a11y/perf |
| 0.2 dep scan; 3.3 threat model; 3.4/3.6 exploit pass | **cyber-security-engineer** | dep CVE, PAT boundary, post-dev exploit |
| 4.5 + UI e2e | **qa-engineer** | Playwright + Lighthouse; owns `e2e/` |
| Risky migrations / failures | **debugger** | root-cause for transition-hack removal etc. |

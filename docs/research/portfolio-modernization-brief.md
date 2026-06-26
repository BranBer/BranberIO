# Portfolio modernization research brief

> Question: For a Next.js 14 (pages router) + Tailwind portfolio going
> glassmorphic light/dark with live GitHub (incl. private org repos), what is the
> real state of (1) Anthropic's published skills/themes, (2) GitHub connectivity
> + private-repo auth, (3) glassmorphism + light/dark in Tailwind/Next.js?

Date: 2026-06-25. Researcher: tactical fact-find. Confidence tags per finding.

---

## 1. Anthropic skills / "glassmorphic theme"

**Short answer: There is NO official Anthropic skill that ships a "glassmorphic
theme." The video claim is a misremembering.** Anthropic publishes design-related
skills, but the only one that provides *predefined themes* is `theme-factory`,
and its 10 themes are color/font palettes (no glassmorphism). The glassmorphism /
claymorphism / neumorphism preset lists circulating online belong to a popular
**community** skill ("UI/UX Pro Max", ~88k stars), not to Anthropic.

Findings:

- **`anthropics/skills`** (https://github.com/anthropics/skills) is the official
  public Agent Skills repo. Its `.claude-plugin/marketplace.json` declares three
  plugins: `document-skills` (xlsx/docx/pptx/pdf), `example-skills`, and
  `claude-api`. The `example-skills` set contains: `algorithmic-art`,
  `brand-guidelines`, `canvas-design`, `doc-coauthoring`, **`frontend-design`**,
  `internal-comms`, `mcp-builder`, `skill-creator`, `slack-gif-creator`,
  **`theme-factory`**, **`web-artifacts-builder`**, `webapp-testing`. VERIFIED
  (https://github.com/anthropics/skills/blob/main/.claude-plugin/marketplace.json).
- **`theme-factory`** = "a curated collection of professional font and color
  themes" for slides/docs/landing pages. 10 themes: Ocean Depths, Sunset
  Boulevard, Forest Canopy, Modern Minimalist, Golden Hour, Arctic Frost, Desert
  Rose, Tech Innovation, Botanical Garden, Midnight Galaxy. Each is hex palette +
  font pairing. **No glassmorphism; framework-agnostic (not Tailwind/React
  output).** VERIFIED (SKILL.md via raw.githubusercontent.com).
- **`frontend-design`** skill is methodology prose only — its directory is just
  `SKILL.md` + `LICENSE.txt`. It teaches "avoid generic AI aesthetics" and names
  styles only as *cautionary examples to avoid* (cream/serif/terracotta;
  near-black + acid-green; broadsheet). It does **not** ship a glassmorphism
  preset or any style-preset library, and it is stack-agnostic. VERIFIED
  (https://raw.githubusercontent.com/anthropics/skills/main/skills/frontend-design/SKILL.md
  + directory listing showing only 2 files).
- The `claude.com/plugins/frontend-design` marketing page lists supported
  aesthetics as "brutalist, maximalist, retro-futuristic, luxury, playful, etc."
  — still **no glassmorphism**, and these are described directions, not a preset
  library. VERIFIED (https://claude.com/plugins/frontend-design).
- Third-party catalog pages (crossaitools.com, pasqualepillitteri.it) list
  "Styles: glassmorphism, claymorphism, minimalism, brutalism, neumorphism,
  bento grid..." under a "Frontend Design" heading. This is **conflation**: the
  same pages attribute that 50+ style list to the community "UI/UX Pro Max" skill
  (~88k stars), not to Anthropic's `frontend-design`. UNCERTAIN/CONFLICTING on
  attribution, but the official SKILL.md (primary source) settles it — no such
  list exists in Anthropic's skill.

How you'd consume it if you wanted it (Claude Code):
`/plugin marketplace add anthropics/skills` then
`/plugin install example-skills@anthropic-agent-skills`. VERIFIED (repo README).
These are agent skills (SKILL.md instructions that steer Claude during a coding
session) — **not an npm package, component library, or CSS you import into the
app**. They influence how the assistant builds; they ship no runtime artifact.

**Recommendation:** Not worth pulling in as a *theme source* — no official
glassmorphic theme exists. The `frontend-design`/`theme-factory` skills can
optionally guide the assistant's design choices during the build, but the
glassmorphic look should come from Tailwind + a glass component library (sec. 3),
not from an Anthropic "theme."

---

## 2. GitHub connectivity (incl. private org repos)

**Short answer:** Use a server-side data fetch (ISR / route handler) with
**Octokit** against the REST API, authenticated by a **fine-grained PAT** (or a
GitHub App for stricter scope) scoped to the "cipher codex" org with read-only
`metadata`/`contents` permission. **Never expose the token client-side.** For a
solo portfolio a fine-grained PAT is the pragmatic choice; a GitHub App is the
"correct" higher-ceiling option.

Findings:

- **REST vs GraphQL / octokit vs fetch.** REST + Octokit is the simplest
  ergonomic path; `octokit.rest.repos.listForAuthenticatedUser` /
  `listForOrg({ org, type: 'all' })` returns private repos when the token is
  authorized. GraphQL is worth it only if you want repos + languages + pinned
  items + stars in one round trip (fewer calls = friendlier to rate limits).
  INFERRED from API capabilities; both are first-class.
- **Auth options for private org repos:**
  - **Fine-grained PAT** — generally available since 2025-03-18, can be scoped to
    specific repos and to read-only permissions; for org repos the token (and/or
    org policy) must grant the org access. VERIFIED
    (https://github.blog/changelog/2025-03-18-fine-grained-pats-are-now-generally-available/).
    Caveat: a single fine-grained PAT **cannot span multiple orgs**. VERIFIED
    (same changelog, limitations list).
  - **GitHub App (installation token)** — least-privilege, org-installable,
    higher rate ceiling, tokens auto-expire; best practice for anything beyond
    one person but more setup. INFERRED.
  - **OAuth** — only if visitors authenticate as themselves; irrelevant for
    showing *your own* private repos. INFERRED.
- **NEVER client-side.** The token must live only in server-side env
  (`process.env.GITHUB_TOKEN`) used in `getStaticProps`/`getServerSideProps`/API
  route. Do **not** prefix with `NEXT_PUBLIC_`, do not pass it into client props,
  do not call the GitHub API from the browser with it. A leaked read token
  exposes the private "cipher codex" repos. VERIFIED principle (fine-grained PAT
  least-privilege guidance, github.blog intro post). Mitigation: scope to
  read-only + only the repos you display, so a leak's blast radius is minimal.
- **Rate limits** (REST, per hour): unauthenticated **60**; authenticated
  PAT/user **5,000**; GitHub App installation **5,000** (up to 12,500 non-EMU /
  15,000 EMU as it scales). VERIFIED
  (https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api).
- **Caching/ISR strategy:** This data changes rarely, so render at build/ISR with
  `revalidate` (e.g. 3600s) rather than per-request — keeps you far under any
  limit and survives GitHub outages with the last good build. For pages-router:
  `getStaticProps` + `revalidate`. Optionally an on-demand revalidation webhook
  on push. INFERRED (standard Next.js pages-router ISR; aligns with low limits).

**Recommendation:** Worth doing. Fine-grained PAT (read-only, scoped to the
cipher-codex repos), stored server-side only, consumed via Octokit REST in
`getStaticProps` with ISR `revalidate`. Graduate to a GitHub App only if you
later need multiple orgs or tighter token lifecycle.

---

## 3. Glassmorphism + light/dark in Tailwind/Next.js

**Short answer:** Use **next-themes** for the toggle (class strategy,
`suppressHydrationWarning`); build glass with Tailwind `backdrop-blur` +
semi-transparent `bg-white/10`-style layers + a subtle border; treat
contrast as a hard accessibility constraint, not an afterthought. shadcn/ui is
the sensible base to standardize on, with a glass component layer on top.

Findings:

- **Toggle: next-themes is the consensus 2025-2026 default** for Next.js +
  Tailwind (class-based dark mode, no FOUC, system preference). Manual is only
  worth it if you want zero deps. VERIFIED as common best practice across
  multiple 2025 guides (eastondev.com 2025-12 guide; multiple Medium/DEV guides).
  Note: works in pages router via `_app` `<ThemeProvider>`.
- **Glass recipe (Tailwind):** core classes are a translucent background
  (`bg-white/10`–`/30` or dark equiv), `backdrop-blur-md`/`-lg`/`-xl`, a faint
  border (`border border-white/20`), and rounded corners; optional inner
  highlight. VERIFIED (https://flyonui.com/blog/glassmorphism-with-tailwind-css/).
  Tailwind v4 changes some opacity syntax — confirm against your installed
  Tailwind version before copying snippets.
- **Accessibility caveat (load-bearing):** glassmorphism reduces contrast by
  design (transparency + blur), so text over glass must keep WCAG contrast —
  maintain strong text/background separation, avoid placing body text directly on
  busy background images, and test with a contrast checker. VERIFIED
  (https://uxpilot.ai/blogs/glassmorphism-ui;
  https://www.w3.org reasoning echoed across sources). Also: `backdrop-filter` has
  a performance cost — limit the number of simultaneously blurred layers.
  INFERRED/VERIFIED (2026 technique articles).
- **Component libraries:** **shadcn/ui** is the de-facto standard base
  (copy-in, Tailwind-native, owns its code) and pairs with a glass layer such as
  "Glass UI / All Shadcn" components (backdrop blur, translucent layers, adaptive
  borders, Framer Motion). VERIFIED that such glass-on-shadcn libraries exist
  (https://allshadcn.com/components/glass-ui/). Treat third-party glass kits as
  starting points to copy and audit, not as a dependency to trust blindly.

**Recommendation:** Worth standardizing on next-themes + Tailwind glass
utilities, with shadcn/ui as the component base. Bake an accessible-contrast rule
into the design system (this is the main risk of the glass aesthetic).

---

## Caveats / guardrails

- No `AGENTS.md` security/architecture/design guardrails are recorded yet, so no
  conflicts. When the token work lands, the cyber-security-engineer should record
  a guardrail: GitHub token is read-only, server-only, never `NEXT_PUBLIC_`.
- Project currently has NO Tailwind, NO next-themes, and uses
  emotion/styled-components/MUI (package.json). Adopting Tailwind + shadcn is a
  real migration, not a drop-in — flag for the architect/planner.
- Tailwind v3 vs v4 opacity/`backdrop` syntax differs; pin the version before
  using any copied glass snippet.

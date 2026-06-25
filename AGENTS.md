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

<!-- As you add subsystem directories with non-obvious knowledge, add an
     AGENTS.md there and link it here, e.g.:
     - [`lib/<area>/AGENTS.md`](lib/<area>/AGENTS.md) — what the code can't tell
       a newcomer: the why, the gotcha, the recipe. -->

_No nested `AGENTS.md` files yet._

---

# Security guardrails (maintained by cybersec agent — do NOT remove)

Standing security rules live here: safe-usage rules for latent CVEs (the
dependency is safe only as currently used) and "do not reintroduce" rules from
resolved findings (with their `VULN-`/CVE references). The
**cyber-security-engineer** owns this section; other agents do not edit it but
must treat its rules as hard constraints.

_No guardrails recorded yet. Format per entry:_

<!--
## <short title> (VULN-YYYY-NNNN / CVE-... )

What the risk is, the attack pattern, and the strict safe-usage or
do-not-reintroduce rule. Include the condition that retires it, if any.
-->

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

---

# Design system (maintained by ux-designer agent — do NOT remove)

Standing UX/visual constraints live here: confirmed token additions, intended
section-rhythm rules for key pages, and reuse-vs-vary decisions the developer
must preserve. The **ux-designer** owns this section; other agents do not edit
it. This section records only project-specific design decisions that aren't
obvious from the code.

_No design decisions recorded yet. Format per entry:_

<!--
## <short title>

The standing decision and why; what the developer must preserve when building.
-->

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

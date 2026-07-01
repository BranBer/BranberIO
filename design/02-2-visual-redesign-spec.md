# Design Spec — branber.io Visual Redesign (Glassmorphic Light/Dark)

> Story 2.2 (`design: required`). Author: ux-designer. Read-only on app source.
> Inputs: `docs/planning/portfolio-modernization-spec.md`,
> `docs/research/portfolio-modernization-brief.md` §3.
> This spec is the build contract for stories 2.3 (theme provider/toggle) and
> 2.4 (apply glass tokens + background images). Story 2.5 is the Playwright
> fidelity audit that checks the built UI against §9 of this doc.
>
> **Stack the developer builds to:** Next.js 14 pages-router · Tailwind (adopted
> Epic 0) · `next-themes` (class strategy) · shadcn/ui component base. Glass is
> CSS-variable-driven so it is Tailwind-version-agnostic (see §2.6 v3/v4 note).

---

## 1. Intent / art direction

### Design-intent block

- **Who is the human?** A technical recruiter or hiring manager who opened
  branber.io from a LinkedIn message or an application, on a laptop between
  candidate reviews, with maybe 40 seconds before they decide whether to keep
  reading or close the tab. Possibly on a phone on a train. They are not a
  developer evaluating clever animation — they are scanning for *credibility,
  role fit, and a fast path to the resume and contact*.
- **The page's single job (landing):** In one glance, answer "who is this person,
  what do they build, and are they worth a callback" — and route them to the
  resume / contact CTA. The ONE primary action above the fold is the contact /
  resume CTA; the secondary is "see the work."
- **What it should feel like:** *Calm, premium, and orderly — like the lobby of a
  well-run studio, not a nightclub.* Frosted glass over soft, out-of-focus
  imagery; lots of air; type that carries the hierarchy. Confident and quiet, not
  flashy. The old cosmic lavalamp read as "developer playing with shaders"; this
  reads as "professional who ships." Polished credibility over spectacle.
- **How the user moves through it:** Eye lands first on the name + one-line value
  proposition (largest type, highest contrast), then the primary CTA pill, then
  drifts down to a focal "what I build" statement, then the proof (selected
  projects), then the easy exits (resume, contact, socials) that repeat in the
  footer. We deliberately keep the background imagery *quiet* (blurred, dimmed) so
  it never competes with text.

### Why glass serves recruiters (not just a developer flex)

Glass is the vehicle, not the message. It lets a single calm photographic
backdrop unify every page while the content sits on legible frosted cards — so
the site feels *designed and cohesive* (a credibility signal) without forcing the
recruiter to read text on busy imagery. The discipline below (dim the image, never
put body text directly on the photo, cap blur layers) is what keeps it
"professional" instead of "trendy and unreadable." If the glass ever fights
legibility, legibility wins — that is RULE-equivalent and enforced in §3.

---

## 2. Design token system

All tokens are **CSS custom properties** defined on `:root` (light) and
`.dark` (dark, toggled by `next-themes` `class` strategy), then surfaced to
Tailwind via `theme.extend` so they're usable as `bg-surface`, `text-fg`,
`border-glass-border`, etc. **New tokens are defined here before any use** —
this table is canonical; the developer adds nothing ad-hoc.

### 2.1 Color tokens — semantic, theme-paired

Values are authored as raw channels where useful so opacity modifiers work
(`rgb(var(--fg) / <alpha>)`). Hex shown for reference/contrast-checking.

| Token | Role | Light | Dark |
|---|---|---|---|
| `--bg` | page base behind the background image | `#F4F6FB` | `#0B1020` |
| `--fg` | primary body/heading text | `#10131C` | `#EEF2FB` |
| `--fg-muted` | secondary text, captions, meta | `#3A4154` | `#A9B2C7` |
| `--fg-subtle` | tertiary / disabled / placeholder | `#5C6478` | `#7B859C` |
| `--surface` | opaque card fallback (no-blur / `@supports` off) | `#FFFFFF` | `#141A2E` |
| `--surface-raised` | elevated opaque (modals, popovers fallback) | `#FFFFFF` | `#1B2238` |
| `--accent` | primary action, links, focus ring | `#3B5BDB` | `#7C93FF` |
| `--accent-fg` | text/icon on accent fill | `#FFFFFF` | `#0B1020` |
| `--accent-hover` | accent hover/active | `#2F49B8` | `#9AACFF` |
| `--success` | "live site" / positive status dots | `#1E7F4F` | `#4ADE80` |
| `--warning` | "WIP" tags | `#9A6B00` | `#FBBF24` |
| `--ring` | focus outline (= accent unless contrast forces) | `#3B5BDB` | `#9AACFF` |

### 2.2 Glass surface tokens (the named, reusable recipe)

Glass is **one named recipe**, not re-tuned per component. There are exactly
**three glass tiers** plus the imagery scrim. Do not invent a fourth.

| Token | Use | Light value | Dark value |
|---|---|---|---|
| `--glass-bg` | tier-1 content cards (project cards, about card, skill groups) | `rgb(255 255 255 / 0.55)` | `rgb(20 26 46 / 0.45)` |
| `--glass-bg-strong` | tier-2 text-heavy panels (hero card, project detail body, modal) — more opaque for AA | `rgb(255 255 255 / 0.72)` | `rgb(16 20 34 / 0.66)` |
| `--glass-bg-chip` | tier-3 small inert chips (tags, skill pills, nav) | `rgb(255 255 255 / 0.40)` | `rgb(40 48 74 / 0.40)` |
| `--glass-border` | hairline edge that catches "light" | `rgb(255 255 255 / 0.65)` | `rgb(255 255 255 / 0.12)` |
| `--glass-highlight` | optional 1px top inner highlight | `rgb(255 255 255 / 0.85)` | `rgb(255 255 255 / 0.10)` |
| `--glass-shadow` | soft drop shadow for lift | `0 8px 30px rgb(16 19 28 / 0.10)` | `0 8px 30px rgb(0 0 0 / 0.45)` |
| `--glass-blur` | backdrop blur radius | `14px` | `14px` |
| `--glass-blur-strong` | blur for tier-2 panels | `20px` | `20px` |
| `--scrim` | dim layer between bg image and glass (see §5) | `rgb(244 246 251 / 0.55)` | `rgb(11 16 32 / 0.62)` |

The reusable surface is delivered as **one utility class `.glass`** (and
`.glass-strong`, `.glass-chip`) defined once in `globals.css`, consumed
everywhere. Canonical recipe (developer authors once):

```css
/* globals.css — authored once, used everywhere. Do not redefine per component. */
.glass {
  background: var(--glass-bg);
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(125%);
  backdrop-filter: blur(var(--glass-blur)) saturate(125%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow), inset 0 1px 0 0 var(--glass-highlight);
  border-radius: var(--radius-lg);
}
.glass-strong {
  background: var(--glass-bg-strong);
  -webkit-backdrop-filter: blur(var(--glass-blur-strong)) saturate(125%);
  backdrop-filter: blur(var(--glass-blur-strong)) saturate(125%);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow), inset 0 1px 0 0 var(--glass-highlight);
  border-radius: var(--radius-lg);
}
.glass-chip {
  background: var(--glass-bg-chip);
  -webkit-backdrop-filter: blur(8px) saturate(120%);
  backdrop-filter: blur(8px) saturate(120%);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-pill);
}

/* Graceful fallback: browsers without backdrop-filter get opaque surfaces so
   text never lands on a transparent layer over a photo (a11y, §3). */
@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .glass        { background: var(--surface); }
  .glass-strong { background: var(--surface-raised); }
  .glass-chip   { background: var(--surface); }
}
```

### 2.3 Typography scale

Two fonts via `next/font` (replaces the render-blocking `@import`s, Epic 0.3):
**Display/headings:** a geometric-humanist sans with personality (e.g.
*Sora* or *Space Grotesk*) → `--font-display`. **Body/UI:** a neutral, highly
legible sans (e.g. *Inter*) → `--font-sans`. Confirm exact families with the
developer at install; the token names are fixed.

| Token | rem / px | Use | Weight | Tracking |
|---|---|---|---|---|
| `--text-display` | 3.5rem / 56px (clamp to 2.5rem mobile) | hero name | 700 | -0.02em |
| `--text-h1` | 2.25rem / 36px | page titles | 700 | -0.01em |
| `--text-h2` | 1.5rem / 24px | section headings | 600 | -0.01em |
| `--text-h3` | 1.25rem / 20px | card titles | 600 | normal |
| `--text-lead` | 1.25rem / 20px | hero value-prop sub-line | 400 | normal |
| `--text-body` | 1rem / 16px | body copy | 400 | normal |
| `--text-sm` | 0.875rem / 14px | meta, tags, captions | 500 | normal |
| `--text-xs` | 0.75rem / 12px | overlines/labels | 600 (uppercase, +0.08em) | wide |

Line-height: headings `1.15`, body `1.65` (recruiters skim — generous leading).
Max measure for body paragraphs: **66ch** (`max-w-[66ch]`).

Use `clamp()` for `--text-display` and `--text-h1` so the hero scales smoothly
375 → 1280 without per-breakpoint overrides.

### 2.4 Spacing & layout

Use Tailwind's default 4px scale. Section rhythm uses a fixed vertical scale so
pages share cadence:

| Token | Value | Use |
|---|---|---|
| `--space-section` | 6rem (96px) desktop / 4rem mobile | gap between page sections |
| `--space-block` | 2rem (32px) | gap between blocks within a section |
| `--gutter` | 1.5rem (24px) mobile / 2rem desktop | page side padding |
| `--container` | 72rem (1152px) max | content column; wider hero band may go edge-to-edge |
| `--measure` | 66ch | paragraph max width |

### 2.5 Radii & elevation

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 8px | inputs, small controls |
| `--radius-lg` | 20px | glass cards, panels |
| `--radius-xl` | 28px | hero card |
| `--radius-pill` | 9999px | chips, the CTA pill, theme toggle |

Elevation is carried by `--glass-shadow` only — do not stack additional drop
shadows on glass (muddies the frosted look and adds paint cost).

### 2.6 Tailwind v3/v4 + nested-blur notes (load-bearing for the developer)

- **Version-agnostic by design.** Because glass lives in `.glass*` utility
  classes backed by CSS variables, the v3↔v4 opacity-modifier and
  `blur-sm`→`blur-xs` renames (confirmed current, 2026) **do not** touch the
  glass recipe. If you *also* use Tailwind opacity utilities (`bg-fg/10`), pin
  behavior to your installed major version.
- **Nested `backdrop-filter` breaks.** A `backdrop-filter` element inside another
  `backdrop-filter` element does not blur as expected (browser spec behavior, not
  a Tailwind bug). **Rule: never nest a `.glass*` surface inside another `.glass*`
  surface.** Chips on a glass card use `.glass-chip` only if the parent card is
  NOT itself blurred in that region; otherwise render chips as flat
  `--glass-bg-chip` *without* their own backdrop-filter. Tags-on-a-card is the
  common case → tags get background + border, **no** backdrop-filter.

---

## 3. ACCESSIBILITY (acceptance criterion, not a footnote)

Glass lowers contrast by design. These are hard rules; story 2.5 audit fails the
build if violated.

### 3.1 WCAG AA contrast rules

- Body text: **≥ 4.5:1** against its *effective* background (the glass fill
  composited over the dimmed image — measure the worst-case spot, not the token).
- Large text (≥24px or ≥18.66px bold) and UI/icon affordances: **≥ 3:1**.
- Focus ring and interactive borders: **≥ 3:1** against adjacent colors.
- Because the effective background varies with the photo, AA is guaranteed by the
  **scrim + glass opacity floor**, not by the photo. Tier-2 (`.glass-strong`, ≥
  0.66/0.72 opacity) is mandatory for any panel containing **paragraph body
  copy**. Tier-1 is for short labels/titles only.

### 3.2 Where body text MAY and MAY NOT sit

- **MAY NOT:** body/paragraph text directly on a background image. Ever.
- **MAY NOT:** body text on tier-3 chip glass (`--glass-bg-chip` is for inert
  short tags/labels with `--text-sm`+ only, which clear 3:1 large-text rules at
  their weight, verified in §3.4).
- **MAY:** body text on `.glass-strong` (tier-2) over the dimmed/scrimmed image.
- **MAY:** the hero *name* and *value-prop* sit on `.glass-strong`; the hero must
  not place the value-prop directly on the photo.
- Decorative-only imagery (the photo) has `aria-hidden`/empty alt; it carries no
  information, so it is exempt from text-alternative rules but NOT from the scrim.

### 3.3 Performance — max simultaneous blurred layers

`backdrop-filter` is GPU-expensive and compounds.

- **Cap: at most 6 actively-blurred glass elements in the viewport at once**, and
  **never more than 2 different blur radii** on screen simultaneously.
- The fixed background image + scrim is **one** layer (not blurred itself).
- Long lists (skills grid, project grid): the *container* may be one glass panel;
  inner items are flat (`--glass-bg-chip` background, **no** backdrop-filter) so a
  grid of 20 skills is 1 blur, not 20. This also dovetails with the nested-blur
  rule (§2.6).
- The fixed/parallax-free background is a single `position: fixed` layer reused
  across pages — do not re-blur it per section.

### 3.4 Contrast-checked color pairs (must hold; re-verify at build with a checker)

Computed on the *effective* composited background (glass fill over scrim over a
mid-tone image), worst case.

| Pair | Context | Light ratio | Dark ratio | Pass |
|---|---|---|---|---|
| `--fg` on `.glass-strong` | body copy, headings | ~12.4:1 (#10131C on ~#F4F6FB eff.) | ~11.8:1 (#EEF2FB on ~#141A2E eff.) | AA/AAA |
| `--fg-muted` on `.glass-strong` | secondary text | ~6.9:1 | ~5.6:1 | AA |
| `--fg` on `.glass` (tier-1, titles only) | card titles ≥20px | ~9.5:1 | ~7.8:1 | AA large |
| `--accent` link on `.glass-strong` | links/CTA text | ~6.1:1 (#3B5BDB) | ~6.4:1 (#7C93FF) | AA |
| `--accent-fg` on `--accent` | CTA pill label | ~7.0:1 (#FFF on #3B5BDB) | ~9.1:1 (#0B1020 on #7C93FF) | AA |
| `--fg-muted` on `.glass-chip` | tag text ≥14px/500 | ~4.8:1 | ~4.3:1 (large-text 3:1 ✓) | AA large |
| `--ring` vs adjacent surface | focus visibility | ~4.0:1 | ~3.6:1 | AA non-text |

If any pair drops below threshold at build (different photo, theme tuning),
**raise the glass opacity floor or darken the scrim — do not lower text weight.**

---

## 4. Section rhythm & hierarchy (per page)

Anti-pattern to avoid: the current/likely instinct is a uniform stack of
identical glass cards on every page. That flattens importance. Each page below
specifies what **varies** vs **repeats**. **Never stack >2 identical section
layouts back-to-back.**

### 4.1 Landing / `index` (the highest-stakes page)

Replaces the orbital graphic + 3 social links entirely. Reading order is the
spine of the design.

1. **Hero band (above the fold, edge-to-edge).** Asymmetric, NOT a centered card.
   Left column (≈60%): overline (`--text-xs` uppercase, e.g. "FULL-STACK
   DEVELOPER"), the **name/value-prop** in `--text-display` ("I build reliable
   web products end-to-end — frontend to infra."), one `--text-lead` support
   line, then the **primary CTA pill** (`View Résumé`) + a **secondary ghost
   button** (`See my work`). Right column (≈40%): the profile portrait inside a
   `.glass-strong` rounded frame with the glass-highlight edge. This is the ONE
   primary action on the page. Everything else is quieter.
2. **"What I build" focal strip.** A single wide `.glass-strong` panel — a short
   three-clause statement of specialties (frontend / APIs / infra), each with a
   hand-authored line icon (§8). NOT three equal cards — one panel, three inline
   items, so it reads as a sentence, not a menu.
3. **Selected work (proof).** 2–3 project cards in an **asymmetric** layout: the
   first project featured larger (image-led, `.glass` overlay), the rest in a
   smaller row. This deliberately differs in cadence from section 2.
4. **Contact / close.** A calm `.glass-strong` band: resume download + email CTA
   + the three social links (now with `aria-label`s). The exits repeat here so a
   scanner who skipped to the bottom still finds them.

Rhythm summary: edge-to-edge asymmetric hero → single focal panel → asymmetric
card group → centered close band. Four different cadences, no repeats.

### 4.2 About

1. **Bio block:** asymmetric — portrait/illustration left, two short paragraphs
   right inside `.glass-strong` (body copy → tier-2 required). Keep the existing
   bio voice but tightened for skim.
2. **Quick-facts row:** 3–4 `.glass-chip` stats (years, primary stack, location,
   "open to: roles") — different shape from the bio, breaks monotony, recruiter
   candy.
3. **Education:** the existing `Education` component, restyled to `.glass` cards,
   single column. Distinct from the chips above.
4. **Resume CTA band** echoing the landing close (reuse the same component →
   identical purpose, so reuse is correct here).

### 4.3 Skills

1. **Intro line** (one sentence framing, not just a bare "Skills" title).
2. **Category groups:** each category is **one** `.glass` panel containing a grid
   of flat skill pills (icon + label). Per §3.3 this is 1 blur per category, not
   per skill. Categories are ordered by size (as today). To avoid monotony across
   many categories, the **largest 1–2 categories render as a wider feature panel**
   (2-col span) and the rest as standard panels — a masonry-ish rhythm, not N
   identical rows.
3. No CTA band needed here; keep it focused.

### 4.4 Projects (index)

1. **Intro line.**
2. **Project grid:** image-forward `.glass` cards. Featured/first project spans
   wider (asymmetric), matching the landing "selected work" treatment so the two
   pages feel related but here the full set shows. Each card: image (dimmed),
   title, tag chips (flat, no nested blur), `Read more` ghost link. WIP projects
   get a `--warning` "WIP" chip; live projects a `--success` "Live" dot.

### 4.5 Project detail / `projects/[id]`

Replaces the `<hr>`-separated stack with structured sections.

1. **Header:** back-link (ghost), project title `--text-h1`, tag chips, and the
   two action buttons (`Visit Repo` / `Visit Site`) as a primary + secondary pair
   — repo is primary unless a live site exists, then live site is primary.
2. **Carousel** in a `.glass` frame (restyle existing `Carousel`).
3. **Case-study body** (`.glass-strong`, body copy → tier-2): problem / what I
   built / stack. Epic 1.3 expands the data; design supports headings within.
4. **Languages** chart (`languagesPieChart`, later moved server-side in 3.6) in
   its own `.glass` panel with a heading — distinct block, not an `<hr>` afterthought.
5. **Footer nav** back to projects (ghost).

### 4.6 Repo showcase (story 3.5) — HOOK ONLY, do not design in detail

Story 3.5 will add a live GitHub repo-card UI within the architect's data shape
(story 3.2). **Leave these hooks so it drops into this system cleanly:**

- Repo cards use **`.glass`** (tier-1) — short-label content, not paragraph copy.
- A repo card = image/avatar or language-color bar, repo name (`--text-h3`),
  one-line description (`--text-sm`, `--fg-muted`), language chips (flat
  `.glass-chip` style, no nested blur), star/meta in `--fg-subtle`.
- Private cipher-codex repos: a `.glass-chip` "Private" badge in `--fg-muted`
  (NOT accent — accent budget is for actions, §8).
- They live in the same asymmetric-grid rhythm as §4.4 so a future "Projects +
  Repos" page stays coherent. **Do not finalize layout until 3.2's data shape
  lands.** This is intentionally just the token/shape hook.

---

## 5. Background-image treatment

The unifying device. One quiet, abstract/architectural photographic backdrop per
theme, fixed behind all glass.

- **Selection:** soft, low-contrast, abstract or architectural imagery — frosted
  light, gradient bokeh, soft concrete/paper texture, or a calm gradient mesh.
  **No** busy scenes, faces, text, or high-frequency detail (they fight legibility
  and the blur). Light theme: airy, cool-neutral, high-key. Dark theme: deep
  blue-black with subtle luminance, low-key. **These are PNG/WebP raster assets,
  not SVG** — request from the image-generation MCP at build, or the human
  supplies them; flagged as a dependency in §9. A pure CSS gradient-mesh fallback
  (no photo) is acceptable and ships as the default if no raster is ready.
- **Positioning:** single `position: fixed; inset: 0; object-fit: cover;` layer
  behind everything, shared across pages (one paint, supports the §3.3 "one bg
  layer" rule). No parallax (motion budget §7). `next/image` with `priority` and a
  blurred placeholder; add the host to the `next.config.js` image allowlist.
- **Dimming (the legibility guarantee):** the image is ALWAYS covered by the
  `--scrim` token layer (0.55 light / 0.62 dark) before any glass sits on top.
  The image itself may also be pre-dimmed/desaturated (brightness ~0.9, saturate
  ~0.85) so even tier-1 glass clears contrast. The scrim is what makes AA hold
  regardless of which photo is chosen — it is non-optional.
- **Theme swap:** light and dark use *different* source images (or different
  gradient stops), cross-faded by the theme transition (§7). Both must pass §3.4
  with their respective scrim.

Layer stack (bottom→top): `bg image` → `--scrim` → page content (glass surfaces)
→ modal/overlay. Only glass surfaces blur; the bg layer does not.

---

## 6. Theme toggle (build contract for story 2.3)

- **Placement:** top-right of the persistent nav/header, after the nav links. On
  mobile it stays visible in the header bar (not buried in a menu) — a recruiter
  toggling theme is a trust/quality signal we want easy to reach.
- **Control:** a single pill toggle (`--radius-pill`, `.glass-chip` background)
  with a sun icon (light) / moon icon (dark) — hand-authored SVG (§8). It is a
  **button** that switches between two states, not a 3-way (system option is honored
  on first load via `next-themes` `defaultTheme="system"`, but the visible control
  toggles light↔dark explicitly).
- **States:** default / hover (border brightens to `--glass-highlight`, subtle
  scale 1.0→1.03) / focus-visible (`--ring` 2px outline, 2px offset) / pressed.
  The icon **cross-fades + 180° rotates** between sun and moon (≤200ms, guarded —
  §7).
- **Accessible behavior the developer MUST build:**
  - `role="button"` (native `<button>`), `aria-label` that reflects the *action*:
    `"Switch to dark theme"` / `"Switch to light theme"` (label is the next state,
    not the current).
  - `aria-pressed` reflecting whether dark is active, OR expose current theme via
    an `aria-live="polite"` visually-hidden announcement ("Dark theme enabled") on
    change. Pick one; announcement is required so screen-reader users get feedback.
  - Keyboard: focusable in tab order, `Enter`/`Space` activate.
  - No layout shift on toggle; no FOUC — `next-themes` with
    `suppressHydrationWarning` on `<html>` and the inline theme script. Persist to
    `localStorage` (next-themes default).
  - Respect `prefers-color-scheme` for the *initial* value only; user choice wins
    and persists.
- Coordinate with Epic 4.3 (a11y) — this is the shared keyboard-toggle item.

---

## 7. Motion (replaces the orbital animation)

The orbital/lavalamp perpetual motion is retired. Motion is now an attention tool,
restrained, and **every animation ships inside a `prefers-reduced-motion` guard.**

| Motion | Purpose | Spec | Reduced-motion |
|---|---|---|---|
| Theme cross-fade | soften the light/dark swap | bg image + scrim + token colors transition `200ms ease` | instant swap, no transition |
| Glass card entrance | direct eye down the page on load | fade + 8px rise, `staggerChildren ~60ms`, once per mount (keep framer-motion, already a dep) | appear at final position, no transform |
| Toggle icon | confirm state change | sun↔moon cross-fade + 180° rotate, ≤200ms | swap icon instantly |
| CTA / button hover | affordance | background/border shift + 1px lift, 120ms | color change only, no transform |
| Link/nav underline | affordance | underline grows from left, 150ms | underline appears instantly |

Rules:
- **No** infinite/perpetual animation anywhere (that was the old aesthetic's
  flaw). Motion fires on *interaction* or *entrance*, then stops.
- No parallax on the bg image (perf + reduced-motion simplicity).
- Prefer CSS transitions for hover/toggle; framer-motion only for the staggered
  entrance (already in deps — do not add libraries).
- Global guard (developer authors once):
  ```css
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.001ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.001ms !important;
      scroll-behavior: auto !important;
    }
  }
  ```
  framer-motion entrances additionally gate on `useReducedMotion()` to render at
  final state.

---

## 8. Hand-authored SVG assets

Delivered as ready-to-drop SVG in `design/assets/` (this file set). All use
`currentColor` / token vars so they theme automatically. Accent budget reminder:
accent fills ≤20% of surface; icons are `--fg`/`--fg-muted` by default, accent
only on the primary CTA and active states.

1. **`theme-toggle-sun.svg`** + **`theme-toggle-moon.svg`** — the toggle icons
   (stroke, `currentColor`, 24×24, 1.75 stroke). For the rotate/cross-fade.
2. **`icon-frontend.svg`, `icon-api.svg`, `icon-infra.svg`** — the three line
   icons for the landing "What I build" focal strip (§4.1.2). 28×28, stroke,
   `currentColor`.
3. **`logo-monogram.svg`** — a compact `B` monogram mark for the nav (replaces the
   text-only "BRANBER.IO"), works at 28–32px, single-color `currentColor`.
4. **`mesh-bg-light.svg` / `mesh-bg-dark.svg`** — *fallback* gradient-mesh
   backgrounds (used when no raster photo is supplied; §5). These are legitimately
   vector (gradients), so they're authored, not requested from the image MCP.

See the individual files in `design/assets/`. The developer imports them as React
components (SVGR is already a devDependency) or inlines them.

---

## 9. Acceptance criteria (build to these; story 2.5 audits them)

**Tokens & glass**
- [ ] AC-1 All color/glass/type/space/radii tokens from §2 exist as CSS vars on
  `:root` and `.dark`, surfaced through Tailwind `theme.extend`. No hard-coded
  hex/rgba glass values in components.
- [ ] AC-2 Exactly one glass recipe set (`.glass`, `.glass-strong`, `.glass-chip`)
  defined once in `globals.css` and reused; no per-component backdrop-filter
  re-tuning.
- [ ] AC-3 `@supports not (backdrop-filter)` fallback renders opaque surfaces
  (`--surface`/`--surface-raised`) — verified by disabling backdrop-filter.

**Accessibility (blocking)**
- [ ] AC-4 No paragraph/body text sits directly on a background image or on
  tier-3 chip glass anywhere. Body copy is on `.glass-strong` only.
- [ ] AC-5 Every contrast pair in §3.4 measures ≥ its threshold in BOTH themes
  with a contrast checker against the *composited* background (worst-case spot).
- [ ] AC-6 ≤6 actively-blurred elements and ≤2 blur radii in any viewport at any
  breakpoint; long lists blur the container, not each item; no `.glass` nested in
  `.glass`.
- [ ] AC-7 Theme toggle: keyboard-reachable, `Enter`/`Space` activate, focus-
  visible `--ring`, `aria-label` reflects next action, change announced
  (`aria-pressed` or `aria-live`). No FOUC, no layout shift, choice persists.
- [ ] AC-8 Decorative bg image is `aria-hidden`/empty-alt; social/icon links have
  `aria-label`s.

**Hierarchy & rhythm**
- [ ] AC-9 Landing has one primary action above the fold (resume/contact CTA);
  all other actions are secondary/ghost. Hero is asymmetric, not a centered card.
- [ ] AC-10 No page stacks >2 identical section layouts back-to-back; each page
  follows its §4 rhythm (asymmetric hero/feature where specified; skills & projects
  use the feature-span variation, not N identical rows).
- [ ] AC-11 Accent (`--accent`) covers ≤20% of any viewport surface; high-frequency
  surfaces use glass/`--surface`, never accent fills.

**Background & motion**
- [ ] AC-12 One fixed bg layer shared across pages, always covered by `--scrim`;
  light/dark use distinct sources; image dimmed per §5.
- [ ] AC-13 No infinite/perpetual animation; all motion guarded by
  `prefers-reduced-motion` (global CSS guard + framer-motion `useReducedMotion`);
  reduced-motion renders final states with no transforms.

**Hooks**
- [ ] AC-14 Repo-showcase styling hook (§4.6) preserved: repo cards map to `.glass`
  + flat language chips + non-accent "Private" badge; layout deferred to story 3.5
  within 3.2's data shape.

**Fonts/dep hygiene (coordinated with Epic 0)**
- [ ] AC-15 Fonts load via `next/font` (no `@import`), bound to `--font-display` /
  `--font-sans`.

**Dependencies for the human / other agents**
- [ ] DEP-1 Background raster images (light + dark) — request from the connected
  image-generation MCP at build, or human supplies. Until then ship the
  `mesh-bg-*.svg` gradient fallback (AC-12 still holds with the mesh).
- [ ] DEP-2 Confirm final font families (`--font-display`, `--font-sans`) at
  install (developer + designer sign-off).
- [ ] DEP-3 Add bg-image host to `next.config.js` image allowlist (developer).

# `server-only` package + Next.js 14 Pages Router compatibility

**Question:** Can `import "server-only"` be used in a module imported by `getStaticProps`
in the Next.js 14 Pages Router, and if not, how do we keep credential-holding modules
(e.g. `lib/github.ts`) out of the client bundle without it?

_Researched 2026-06-25. Stack: `next@^14.2.35`, Pages Router, `server-only@^0.0.1`._

---

## Short answer

`server-only` is **not compatible with the Pages Router**. It is designed for the
App Router / React Server Components and **always throws in `pages/`** — including from
`getStaticProps` — because the Pages Router bundler does not activate the
`react-server` export condition the package depends on. Remove the `import "server-only"`
line. The Pages Router already gives an equivalent guarantee: **imports used only inside
`getStaticProps`/`getServerSideProps` are stripped from the client bundle** by Next.js.

## How `server-only` actually works (VERIFIED — read from `node_modules/server-only`)

The package is a "marker" with conditional exports (`node_modules/server-only/package.json`):

```json
"exports": { ".": { "react-server": "./empty.js", "default": "./index.js" } }
```

- `index.js` is literally `throw new Error("This module cannot be imported from a Client Component module...")`.
- `empty.js` is empty (no-op).

The mechanism: in an **RSC (App Router server) bundle**, Next.js sets the `react-server`
resolve condition, so the import resolves to the harmless `empty.js`. In a **client**
bundle the condition is absent, so it resolves to `index.js` and the build fails — that
is how it catches "server module reached the client." Source: package source above +
Next.js security blog, https://nextjs.org/blog/security-nextjs-server-components-actions
("Next.js will fail the build if `server-only` modules are imported from a Client Component").

## Why it fails in the Pages Router (VERIFIED)

The Pages Router bundler is **not RSC-aware** — it never sets the `react-server`
condition for *any* file, so `server-only` resolves to `index.js` everywhere in `pages/`,
including server-only paths like `getStaticProps`. Next.js surfaces this as a dedicated
build error:

> You're importing a component that needs server-only. That only works in a Server
> Component which is not supported in the pages/ directory.

This exact incompatibility is confirmed in:
- vercel/next.js Discussion #66015 — https://github.com/vercel/next.js/discussions/66015
  ("server-only ... only works in a Server Component which is not supported in the
  pages/ directory"; recommended fix is architectural, not a flag).
- vercel/next.js Discussion #67125 — https://github.com/vercel/next.js/discussions/67125
  (same error class for `next/headers` / `server-only` in `pages/`).
- Community explanation of the root cause (RSC export condition not honored by the Pages
  bundler): https://www.reddit.com/r/nextjs/comments/15g039v/

**Note on Q3:** The dynamic `await import("../lib/github")` inside `getStaticProps` does
**not** dodge the check. Webpack still statically discovers the dynamic import as a module
in the graph and resolves `server-only` to `index.js`, so the build fails regardless of
static vs. dynamic import. (INFERRED from the resolution model above + the fact that the
reported error occurs with the current dynamic-import code in `pages/projects.tsx`.)

## The correct Pages-Router guarantee (VERIFIED — primary doc)

Next.js `getStaticProps` docs, https://nextjs.org/docs/pages/api-reference/functions/get-static-props :

> "You can import modules in top-level scope for use in `getStaticProps`. Imports used
> will **not be bundled for the client-side**. This means you can write **server-side
> code directly in `getStaticProps`**, including fetching data from your database."

So a module reachable **only** from `getStaticProps`/`getServerSideProps` (and never from
component render or any client import) is already excluded from the browser bundle. This
is the Pages-Router equivalent of what `server-only` enforces in the App Router.

## Recommendation for this repo

1. **Delete `import "server-only";` from `lib/github.ts`.** It is the direct cause of the
   build failure and provides nothing usable in the Pages Router.
2. **Keep the existing dynamic import** `const { getCipherCodexRepoCards } = await import("../lib/github")`
   inside `getStaticProps` (it is fine; a top-level import used only in `getStaticProps`
   would also be stripped). The real guarantee is "only `getStaticProps` reaches this
   module," not the `import "server-only"` line.
3. **Replace the lost build-time guard** with a Pages-Router-appropriate one so the
   credential boundary in ADR 0001 / `lib/AGENTS.md` stays enforced. Options:
   - A **runtime tripwire** at the top of `lib/github.ts`:
     ```ts
     if (typeof window !== "undefined") {
       throw new Error("lib/github.ts must never run in the browser (ADR 0001 trust boundary).");
     }
     ```
     This throws if the module ever ends up client-side. (INFERRED; idiomatic, but it is a
     *runtime* check, not a *build-time* one — validation: not run by researcher.)
   - A **CI grep/lint check** asserting that `lib/github` is imported only from
     `getStaticProps`/`getServerSideProps`/`pages/api` (extends the AC-1/AC-2 grep already
     in ADR 0001). This restores a *build-time*/CI guard equivalent to what `server-only`
     gave. (INFERRED.)
   - The Node-built-in `import "node:..."`-style poisoning is not applicable here.

## Caveats / guardrail interactions

- ADR 0001 and `lib/AGENTS.md` currently name `import "server-only"` as "the primary
  guard" for the credential trust boundary. Removing it **changes a documented control**,
  so the fix must update both docs and substitute an equivalent guard (above). This is a
  guardrail-touching change — surface to the architect/cybersec owners, do not silently drop
  the protection.
- The `webpack externals` idea (Q4) does **not** help: `externals` tells webpack to leave a
  module as an external `require` rather than excluding it from analysis, and it would not
  prevent `server-only` from resolving to `index.js`. Aliasing `server-only` →
  `server-only/empty.js` in `next.config.js` webpack config *would* technically silence the
  throw, but it defeats the package's entire purpose and is a hack the official guidance
  warns against — prefer removing the import. (INFERRED from webpack `externals` semantics +
  the package's resolution model.)

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **bun** (lockfile: `bun.lock`).

| Task | Command |
| --- | --- |
| Install deps | `bun install` |
| Dev server (port **1000**) | `bun run dev` |
| Production build | `bun run build` (React Router build → `build/client/`) |
| Preview the production build | `bun run preview` |
| Typecheck | `bun run typecheck` (runs `tsc -b`) |

**Always use `bun run <script>`, not `bun <script>`, for `build`/`test`** — `bun build` and `bun test` are bun's own built-in bundler/test-runner and would bypass the package.json scripts. (`bun install` is the built-in installer and is correct.)

There is **no test suite** (no test runner is configured) — verify changes with `bun run typecheck` and `bun run build`. **Important:** a bare `tsc --noEmit` is a **no-op** here because the root `tsconfig.json` uses `files: []` + project references, so it checks nothing; always go through `bun run typecheck` (which runs `tsc -b`). CI (`.github/workflows/ci.yml`) runs typecheck + build on every push and PR.

The GitHub-contributions endpoint (`api/github-contributions.js`) is a Vercel serverless function. Locally, a small Vite plugin in `vite.config.ts` (`local-github-contributions-api`) runs that same handler in-process for both `bun run dev` and `bun run preview`, reading `GITHUB_TOKEN` from `.env.local` (server-side only — never bundled into the client). Without a token the widget degrades gracefully. On Vercel the platform serves the function and injects the token from the project's env vars.

## Stack

React 18 + TypeScript + Vite + **React Router v7 framework mode** (SSG), portfolio site deployed on **Vercel** (deploys from `main`). Every route is prerendered to static HTML at build time (`build/client/`) so non-JS crawlers and AI engines see full per-route content. Tailwind CSS + shadcn/ui (Radix) for UI, framer-motion for animation, `@tanstack/react-query` for async data. Path alias `@/` → `src/`.

## Architecture

**Composition root.** React Router v7 framework mode. `entry.client.tsx` / `entry.server.tsx` → `root.tsx`, whose `Layout` is the HTML document (constant `<head>` + the site-wide JSON-LD graphs) and whose default export wraps the providers (QueryClient, Tooltip, Toasters) → `PageLayout` (Theme + Language providers, `Navbar`, `Footer`, a lazy WebGL `ThemedBackground` — variant `grainient` (default) or `caustic`) → a framer-motion-wrapped `<Outlet />` (`lib/transitions.ts`). Routes are declared in `src/routes.ts` (code-split automatically); pages are route modules with **default** exports. `entry.server.tsx` splices react-helmet-async's per-route head into the prerendered HTML.

**i18n is hand-rolled — there is no i18n library.** `src/config/languages.ts` is the source of truth for supported languages (`en`, `de`, `zh`, `fr`) and exports the `Language` type. UI copy lives in `src/lib/translations/` (one module per language, recomposed in `index.ts` into a single `translations` object). Components read copy with `const t = translations[useLanguage().language]`.

**SEO is a first-class concern, not an afterthought.** Each page renders the `<SEO>` component (`components/seo/`) which, via `lib/seo-utils.ts`, emits JSON-LD structured data (Person / FAQ / HowTo schemas) and Helmet tags. The FAQ/HowTo content that feeds these schemas lives in `src/config/seo-data/` (one module per page). When changing page content, check whether its structured data in `seo-data/` needs to match.

**Content data uses a split-module + recomposing-index pattern.** Large datasets are folders of small modules with an `index.ts` that rebuilds a stable public API:
- `src/lib/translations/` → `{ en, de, fr, zh }` (per language)
- `src/constants/projects/` → `getProjects(lang)` / `getProject(slug, lang)` (per project; `<slug>.ts` holds localized content, `index.ts` joins it with base metadata)
- `src/config/seo-data/` → `get<Page>Faqs(lang)` / `get<Page>HowTo(lang)` (per page)

When adding a language, project, or page, add a module and wire it into that folder's `index.ts` — **keep the index's exported API stable** so consumers don't change. A new language additionally requires updating `config/languages.ts`.

**Chunking is handled by the React Router/Vite build** (per-route code-splitting); there is no manual `manualChunks` config. Keep heavy/optional things (e.g. the WebGL background) lazy/client-only so they stay off the critical path — and **SSR-safe**, since routes are prerendered at build time: no `window`/`localStorage`/`navigator` access during render (guard with `typeof window !== "undefined"` or move it into an effect).

## Conventions

**Export style is deliberate and load-bearing:**
- **Components** use **named** exports, re-exported through barrels (`components/<group>/index.ts`).
- **Route modules** (every page in `src/pages/`) and any **lazily-imported** component (e.g. `LightVeilBackground`) use **default** exports — React Router route modules and `lazy(() => import(...))` both require it. Do not convert these to named exports.

**Adding a nav route** touches: a page in `src/pages/`, a `route(...)` entry in `src/routes.ts`, the `prerender` list in `react-router.config.ts`, a `<loc>` in `public/sitemap.xml` (the CI sitemap-parity guard enforces this), an entry in `NAV_LINKS` (`src/constants/index.ts`), and the `NAV_KEY_BY_PATH` map + a `nav` translation key used by `Navbar`.

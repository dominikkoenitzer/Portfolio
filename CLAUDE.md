# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Package manager is **pnpm**.

| Task | Command |
| --- | --- |
| Dev server (port **8080**) | `pnpm dev` |
| Production build | `pnpm build` |
| Build in development mode | `pnpm build:dev` |
| Preview the production build | `pnpm preview` |
| Lint | `pnpm lint` (ultracite/Biome) |
| Auto-fix + format | `pnpm format` |
| Typecheck | `npx tsc --noEmit` |

There is **no test suite** (no test runner is configured) — verify changes with `npx tsc --noEmit` and `pnpm build`.

The dev server proxies `/api` → `http://localhost:3000`. The GitHub-contributions endpoint (`api/github-contributions.js`) is a Vercel serverless function; to exercise it locally run `vercel dev` alongside, otherwise that one widget just degrades gracefully.

## Stack

React 18 + TypeScript + Vite (SWC plugin), single-page portfolio site deployed on **Vercel** (deploys from `main`). Tailwind CSS + shadcn/ui (Radix) for UI, framer-motion for animation, `@tanstack/react-query` for async data. Path alias `@/` → `src/`.

## Architecture

**Composition root.** `main.tsx` → `App.tsx` (QueryClient, Tooltip, Toasters, Router) → `PageLayout` (Theme + Language providers, `Navbar`, `Footer`, a lazy WebGL `LightVeilBackground`) → `AnimatedRoutes`. All page routes except Home are `React.lazy`-loaded in `AnimatedRoutes.tsx` and wrapped in framer-motion page transitions (`lib/transitions.ts`).

**i18n is hand-rolled — there is no i18n library.** `src/config/languages.ts` is the source of truth for supported languages (`en`, `de`, `zh`, `fr`) and exports the `Language` type. UI copy lives in `src/lib/translations/` (one module per language, recomposed in `index.ts` into a single `translations` object). Components read copy with `const t = translations[useLanguage().language]`.

**SEO is a first-class concern, not an afterthought.** Each page renders the `<SEO>` component (`components/seo/`) which, via `lib/seo-utils.ts`, emits JSON-LD structured data (Person / FAQ / HowTo schemas), hreflang alternates, and Helmet tags. The FAQ/HowTo content that feeds these schemas lives in `src/config/seo-data/` (one module per page). When changing page content, check whether its structured data in `seo-data/` needs to match.

**Content data uses a split-module + recomposing-index pattern.** Large datasets are folders of small modules with an `index.ts` that rebuilds a stable public API:
- `src/lib/translations/` → `{ en, de, fr, zh }` (per language)
- `src/constants/projects/` → `getProjects(lang)` / `getProject(slug, lang)` (per project; `<slug>.ts` holds localized content, `index.ts` joins it with base metadata)
- `src/config/seo-data/` → `get<Page>Faqs(lang)` / `get<Page>HowTo(lang)` (per page)

When adding a language, project, or page, add a module and wire it into that folder's `index.ts` — **keep the index's exported API stable** so consumers don't change. A new language additionally requires updating `config/languages.ts`.

**Build is manually chunked** (`vite.config.ts`): `react-vendor`, `framer-motion`, `ui-vendor`, `query-vendor`. Keep heavy/optional things (e.g. the WebGL background) lazy so they stay off the critical path.

## Conventions

**Export style is deliberate and load-bearing:**
- **Components** use **named** exports, re-exported through barrels (`components/<group>/index.ts`).
- **Pages** and any **`React.lazy`-loaded** component (currently every page + `LightVeilBackground`) use **default** exports — `lazy(() => import(...))` requires it. Do not convert these to named exports.

**Adding a nav route** touches four places: a page in `src/pages/`, a lazy route in `AnimatedRoutes.tsx`, an entry in `NAV_LINKS` (`src/constants/index.ts`), and the `NAV_KEY_BY_PATH` map + a `nav` translation key used by `Navbar`.

**Linting caveats.** `pnpm lint` runs ultracite (a Biome wrapper); `biome.jsonc` makes it respect `.gitignore` (so it skips `dist/`) and pins 2-space indentation. Two known quirks: ultracite bundles Biome 2.4.16 while the dev dependency is 2.3.8, and `pnpm lint` prints a cosmetic `Failed to parse Biome output` line — diagnostics still come through. The existing code predates strict formatting, so lint surfaces many style-level findings on untouched files; these are opinions, not build errors.

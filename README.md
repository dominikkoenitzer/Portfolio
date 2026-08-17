<div align="center">

# Dominik Könitzer — Portfolio

**A fast, multilingual, SEO-obsessed personal portfolio for a Swiss software engineer.**

[![CI](https://github.com/dominikkoenitzer/Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/dominikkoenitzer/Portfolio/actions/workflows/ci.yml)
[![License: All Rights Reserved](https://img.shields.io/badge/license-All%20Rights%20Reserved-red.svg)](./LICENSE)
[![Deployed on Vercel](https://img.shields.io/badge/deployed%20on-Vercel-000.svg?logo=vercel)](https://dominikkoenitzer.ch)

[**Live → dominikkoenitzer.ch**](https://dominikkoenitzer.ch)

</div>

---

A single-page portfolio built with React, TypeScript, and Vite. It's a personal
site, but engineered like a product: four languages, structured data and AI-SEO
throughout, a WebGL background, page transitions, and a live GitHub-contributions
widget.

## Features

- ⚡ **Fast SPA** — React 18 + Vite, manually code-split, lazy WebGL background kept off the critical path
- 🌍 **Four languages** — English, German, French, Chinese (hand-rolled i18n, no library)
- 🎨 **Theme system** — Bloom (default), Glass, Forest, Sunset, with two animated background variants
- 🔎 **SEO / AI-SEO as a first-class concern** — JSON-LD (Person / FAQ / HowTo / Service), `llms.txt`, and per-page Open Graph cards
- 📄 **Prerendered routes** — the build emits a real HTML document per route (20 of them) with that route's own title, description, canonical and OG image, so link unfurlers that don't run JavaScript still get the right preview
- 📊 **Live GitHub contributions** widget via a Vercel serverless function
- ♿ **Accessible & responsive**, with reduced-motion-aware animation

## Tech stack

| | |
| --- | --- |
| Framework | React 18 + TypeScript + Vite (SWC) |
| Styling | Tailwind CSS + shadcn/ui (Radix) |
| Animation | framer-motion + WebGL (`ogl`) |
| Data | `@tanstack/react-query` |
| Package manager | [bun](https://bun.sh) |
| Hosting | Vercel (deploys from `main`) |

## Quick start

Requires [bun](https://bun.sh).

```bash
bun install
bun run dev     # → http://localhost:1000
```

| Task | Command |
| --- | --- |
| Dev server (port **1000**) | `bun run dev` |
| Production build | `bun run build` |
| Preview the build | `bun run preview` |
| Typecheck | `bun run typecheck` |

> The GitHub-contributions widget reads a `GITHUB_TOKEN` from `.env.local`
> (server-side only — never bundled into the client). Without one it degrades
> gracefully. CI runs `typecheck` + `build` on every push and PR.

## Project structure

| Path | What |
| --- | --- |
| `src/pages/` | Route pages (default exports, lazy-loaded) |
| `src/components/` | UI components (named exports via barrels) |
| `src/components/seo/` | `<SEO>` component → meta tags + JSON-LD |
| `src/lib/translations/` | Hand-rolled i18n, one module per language |
| `src/constants/projects/` | Project data, one module per project |
| `src/config/seo-data/` | FAQ / HowTo content feeding the structured data |
| `public/` | Static assets, `og/` social cards, `llms.txt`, `sitemap.xml` |
| `api/` | Vercel serverless function (GitHub contributions) |
| `CLAUDE.md` | Architecture & conventions, in depth |

## Contributing

It's a personal project, but bug reports, accessibility issues, and suggestions
are welcome — see [CONTRIBUTING.md](./CONTRIBUTING.md). For security reports, see
[SECURITY.md](./SECURITY.md).

## License

**All rights reserved.** The code is published for reference and learning; it —
along with the personal content and branding — is **not** licensed for reuse or
redistribution. See [LICENSE](./LICENSE).

## Author

**Dominik Könitzer** — software engineer in Zürich, Switzerland.

[dominikkoenitzer.ch](https://dominikkoenitzer.ch) · [CV](https://dominikkoenitzer.ch/cv) · [@dominikkoenitzer](https://github.com/dominikkoenitzer) · [dominik.koenitzer@gmail.com](mailto:dominik.koenitzer@gmail.com)

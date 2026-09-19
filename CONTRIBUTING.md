# Contributing

Thanks for your interest! This is my personal portfolio, so it's primarily a
solo project, but bug reports, accessibility issues, typo fixes and
suggestions are genuinely welcome.

> **On licensing:** the code is published for reference and is **all rights
> reserved** (see [LICENSE](./LICENSE)). You're welcome to read it and open
> issues or small PRs against this repo, but it is not licensed for reuse or
> republishing as your own.

## Getting started

Requires [bun](https://bun.sh).

```bash
bun install
bun run dev     # dev server on http://localhost:1000
```

| Task | Command |
| --- | --- |
| Dev server (port **1000**) | `bun run dev` |
| Production build | `bun run build` |
| Preview the build | `bun run preview` |
| Typecheck | `bun run typecheck` |
| Lint | `bun run lint` |
| Unit tests | `bun run test` |
| Sitemap parity | `bun run check:sitemap` |
| JSON-LD validation | `bun run check:jsonld` |

Before pushing, run `bun run typecheck`, `bun run lint`, `bun run test` and
`bun run build`. CI runs those four plus the two SEO guards on every push/PR.
The tests are vitest in a node environment with no DOM, so they cover pure
modules only; anything that changes what a component renders has to be checked
in a browser. There is no formatter, so match the surrounding code style:
2-space indentation, as described in `.editorconfig`.

## Conventions

A few things are deliberate and load-bearing:

- **Exports.** Components use **named** exports through barrels
  (`components/<group>/index.ts`); pages and any `React.lazy`-loaded component
  use **default** exports.
- **i18n is hand-rolled** (`src/lib/translations/`, languages `en` / `de` /
  `fr` / `zh`); there is no i18n library. Add copy to **every** language.
- **SEO is first-class.** If you change page content, check whether its
  structured data in `src/config/seo-data/` needs to match.

## Pull requests

- Keep PRs focused and fill in the template.
- Make sure `bun run typecheck`, `bun run lint`, `bun run test` and `bun run build` pass.
- Never commit secrets, tokens, or personal absolute paths.

## Reporting bugs & ideas

Use the [issue templates](https://github.com/dominikkoenitzer/Portfolio/issues/new/choose).
For anything sensitive, email **dominik.koenitzer@gmail.com** instead of opening
a public issue.

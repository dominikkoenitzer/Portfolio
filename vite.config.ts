import path from "node:path";
import { pathToFileURL } from "node:url";
import react from "@vitejs/plugin-react-swc";
import {
  defineConfig,
  loadEnv,
  type Plugin,
  type PreviewServer,
  type ViteDevServer,
} from "vite";

/** The serverless routes in `api/` that the local servers should answer. */
const LOCAL_API_ROUTES = ["github-contributions", "contact", "keepalive"] as const;

/** Server-side secrets copied from `.env.local` into the handlers' environment. */
const SERVER_ENV_KEYS = [
  "GITHUB_TOKEN",
  "VITE_GITHUB_TOKEN",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "GMAIL_USER",
  "GMAIL_APP_PASSWORD",
  "CONTACT_TO",
] as const;

/** Reads a JSON request body the way Vercel hands it to a function. */
const readJsonBody = (req: import("node:http").IncomingMessage) =>
  new Promise<unknown>((resolve) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) return resolve(undefined);
      try {
        resolve(JSON.parse(raw));
      } catch {
        resolve(raw);
      }
    });
    req.on("error", () => resolve(undefined));
  });

/**
 * Runs the real `api/*.js` serverless handlers in-process for local `vite dev`
 * AND `vite preview`, so the contributions widget and the contact form work
 * without `vercel dev`. The secrets are read server-side from the environment
 * (`.env.local`) and used only here: they are never exposed to the client
 * bundle. On Vercel the platform serves the functions itself; this plugin is
 * dev/preview only (the hooks don't run during `vite build`).
 */
function localApi(env: Record<string, string>): Plugin {
  const attach = (server: ViteDevServer | PreviewServer) => {
    for (const key of SERVER_ENV_KEYS) {
      if (env[key]) process.env[key] = env[key];
    }

    server.middlewares.use(async (req, res, next) => {
      const reqUrl = req.url || "";
      const route = LOCAL_API_ROUTES.find((r) =>
        reqUrl.startsWith(`/api/${r}`),
      );
      if (!route) {
        next();
        return;
      }

      try {
        const handlerUrl = pathToFileURL(
          path.resolve(__dirname, `api/${route}.js`),
        ).href;
        const mod = await import(handlerUrl);
        const parsed = new URL(reqUrl, "http://localhost");

        // Shim the Vercel-style req/res the handler expects onto Node's raw ones.
        const vreq = {
          method: req.method,
          headers: req.headers,
          socket: req.socket,
          query: Object.fromEntries(parsed.searchParams),
          body: req.method === "POST" ? await readJsonBody(req) : undefined,
        };
        const vres = {
          setHeader: (key: string, value: string) => res.setHeader(key, value),
          status(code: number) {
            res.statusCode = code;
            return this;
          },
          json(body: unknown) {
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(body));
            return this;
          },
          end() {
            res.end();
            return this;
          },
        };

        await mod.default(vreq, vres);
      } catch (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            error: "Local dev API failed",
            details: err instanceof Error ? err.message : String(err),
          }),
        );
      }
    });
  };

  return {
    name: "local-api",
    configureServer: attach,
    configurePreviewServer: attach,
  };
}

/**
 * Declares UTF-8 on the plain-text files in dev and preview.
 *
 * `vercel.json` sends `text/plain; charset=utf-8` for these in production, but
 * Vite's static middleware sends a bare `text/plain`, so a browser falls back
 * to its own default encoding and renders llms.txt as "Dominik KÃ¶nitzer". The
 * bytes were always correct UTF-8; only the local header was missing, which
 * made the file look broken in the one place it gets proofread.
 */
function textCharset(): Plugin {
  const attach = (server: ViteDevServer | PreviewServer) => {
    server.middlewares.use((req, res, next) => {
      if (req.url && /\.txt(\?|$)/.test(req.url)) {
        res.setHeader("Content-Type", "text/plain; charset=utf-8");
      }
      next();
    });
  };
  return {
    name: "text-charset",
    configureServer: attach,
    configurePreviewServer: attach,
  };
}

/**
 * Vendor chunks, keyed by the npm package a module comes from.
 *
 * This is the function form of `manualChunks` on purpose. The object form
 * (`{ "react-vendor": ["react", …] }`) matches bare specifiers, and several of
 * ours never bound to a real module: `react` itself landed in `query-vendor`
 * and `scheduler`, which react-dom needs, ended up in a lazy vendor chunk that
 * the entry then had to preload. Matching resolved ids makes the assignment
 * exact. Order is the assignment order: first match wins, so React's own
 * runtime is listed before anything that depends on it.
 */
const VENDOR_CHUNKS: ReadonlyArray<readonly [string, RegExp]> = [
  // React runtime. `scheduler` and the useSyncExternalStore shim are React's
  // own dependencies and must stay on this side of the split.
  [
    "react-vendor",
    /[\\/]node_modules[\\/](react|react-dom|react-is|react-router|react-router-dom|scheduler|use-sync-external-store)[\\/]/,
  ],
  ["framer-motion", /[\\/]node_modules[\\/](framer-motion|motion-dom|motion-utils)[\\/]/],
  // three.js + r3f and the state/measure helpers r3f pulls in. Reached only
  // through the lazy SkillSphere (/skills) and ServiceExplorer (/services), so
  // nothing here may be reachable from the entry chunk.
  [
    "three-vendor",
    /[\\/]node_modules[\\/](three|@react-three[\\/]fiber|zustand|its-fine|react-use-measure)[\\/]/,
  ],
  ["lenis", /[\\/]node_modules[\\/]lenis[\\/]/],
  // Radix primitives plus the scroll-lock / focus / floating helpers they
  // depend on, so the popover, toast and tooltip travel as one unit.
  [
    "ui-vendor",
    /[\\/]node_modules[\\/](@radix-ui[\\/]|@floating-ui[\\/]|react-remove-scroll|react-remove-scroll-bar|react-style-singleton|use-callback-ref|use-sidecar|aria-hidden|get-nonce|detect-node-es)/,
  ],
  ["query-vendor", /[\\/]node_modules[\\/]@tanstack[\\/]/],
];

/**
 * react-dom's server renderer, 494 kB of source across the modern and legacy
 * browser builds. Nothing on the critical path touches it (the service tree
 * rasterises its icon textures through `lib/svg-string` instead). Should a
 * lazy chunk ever import it, the `react-dom` rule above would sweep it into
 * `react-vendor`, which every route preloads, so it is kept out of the vendor
 * split and can only travel with whatever imports it.
 */
const REACT_DOM_SERVER =
  /[\\/]node_modules[\\/]react-dom[\\/](server|static|cjs[\\/]react-dom-(server|static))/;

function vendorChunk(id: string): string | undefined {
  if (!id.includes("node_modules")) return undefined;
  if (REACT_DOM_SERVER.test(id)) return undefined;
  for (const [name, test] of VENDOR_CHUNKS) {
    if (test.test(id)) return name;
  }
  return undefined;
}

/**
 * Preloads the woff2 files that paint the first screen (the hero name's
 * M PLUS Rounded face and the body font's three weights) straight from the HTML. Without this
 * the browser only learns about them after the stylesheet has arrived and been
 * parsed, one full round trip later, and on a phone that hop sat right on the
 * LCP text. Vite hashes the file names, so the tags are injected at build time
 * from the emitted bundle rather than hand-written in index.html. The
 * prerender script reuses dist/index.html as its shell, so every route gets
 * them. Zen Maru Gothic is not preloaded: no heading is on the home page's
 * first screen, and preloading a font that is not used within seconds earns a
 * console warning instead of a win.
 */
const FIRST_SCREEN_FONTS: ReadonlyArray<RegExp> = [
  /^assets[\\/]m-plus-rounded-1c-latin-800-normal-[\w-]+\.woff2$/,
  /^assets[\\/]zen-kaku-gothic-new-latin-(400|500|700)-normal-[\w-]+\.woff2$/,
  // The heading face. It paints on every route but was the only first-screen
  // font left for the CSS to discover, so headings were the last thing on the
  // page to stop swapping.
  /^assets[\\/]zen-maru-gothic-latin-700-normal-[\w-]+\.woff2$/,
];

function preloadFirstScreenFonts(): Plugin {
  return {
    name: "preload-first-screen-fonts",
    apply: "build",
    transformIndexHtml: {
      order: "post",
      handler(_html, ctx) {
        const files = Object.keys(ctx.bundle ?? {}).filter((file) =>
          FIRST_SCREEN_FONTS.some((re) => re.test(file)),
        );
        return files.map((file) => ({
          tag: "link",
          attrs: {
            rel: "preload",
            as: "font",
            type: "font/woff2",
            href: `/${file.replace(/\\/g, "/")}`,
            crossorigin: true,
          },
          // Appended, not prepended: the charset and viewport metas keep the
          // top of <head>, and the preload scanner finds these in the same
          // pass either way.
          injectTo: "head",
        }));
      },
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Empty prefix loads every var (incl. the non-public GITHUB_TOKEN) from
  // .env files for server-side use; only VITE_-prefixed vars reach the client.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 1000,
    },
    plugins: [
      react(),
      localApi(env),
      textCharset(),
      preloadFirstScreenFonts(),
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    esbuild: {
      target: "es2020",
      legalComments: "none",
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: vendorChunk,
        },
      },
      chunkSizeWarningLimit: 600,
    },
  };
});

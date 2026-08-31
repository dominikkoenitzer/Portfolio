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

/**
 * Runs the real `/api/github-contributions` serverless handler in-process for
 * local `vite dev` AND `vite preview`, so the contributions widget works without
 * `vercel dev`. The GitHub token is read server-side from the environment
 * (`.env.local`) and used only here: it is never exposed to the client bundle.
 * On Vercel the platform serves the function itself; this plugin is dev/preview
 * only (the hooks don't run during `vite build`).
 */
function localGithubApi(env: Record<string, string>): Plugin {
  const attach = (server: ViteDevServer | PreviewServer) => {
    if (env.GITHUB_TOKEN) {
      process.env.GITHUB_TOKEN = env.GITHUB_TOKEN;
    } else if (env.VITE_GITHUB_TOKEN) {
      process.env.VITE_GITHUB_TOKEN = env.VITE_GITHUB_TOKEN;
    }

    server.middlewares.use(async (req, res, next) => {
      const reqUrl = req.url || "";
      if (!reqUrl.startsWith("/api/github-contributions")) {
        next();
        return;
      }

      try {
        const handlerUrl = pathToFileURL(
          path.resolve(__dirname, "api/github-contributions.js"),
        ).href;
        const mod = await import(handlerUrl);
        const parsed = new URL(reqUrl, "http://localhost");

        // Shim the Vercel-style req/res the handler expects onto Node's raw ones.
        const vreq = {
          method: req.method,
          query: Object.fromEntries(parsed.searchParams),
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
    name: "local-github-contributions-api",
    configureServer: attach,
    configurePreviewServer: attach,
  };
}

/**
 * Vendor chunks, keyed by the npm package a module comes from.
 *
 * This is the function form of `manualChunks` on purpose. The object form
 * (`{ "react-vendor": ["react", …] }`) matches bare specifiers, and several of
 * ours never bound to a real module: `react` itself was landing in
 * `query-vendor`, and `scheduler`, which react-dom needs, was being swallowed
 * by `three-vendor`. That last one was the expensive part: it gave the entry
 * chunk a static `import … from "./three-vendor.js"`, so **every** route
 * modulepreloaded and evaluated 896 kB of three.js before first paint, even
 * though SkillSphere and ServiceExplorer are the only things that use it and
 * both are `React.lazy`. Matching resolved ids instead makes the assignment
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
 * browser builds. Nothing on the critical path touches it; it is reached only
 * from the lazy SkillSphere and ServiceExplorer, which rasterise react-icons
 * SVGs to textures with `renderToStaticMarkup`. The `react-dom` rule above
 * would otherwise sweep it into `react-vendor`, which every route preloads, so
 * it is excluded here and gets its own chunk behind those two dynamic imports.
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
 * Preloads the woff2 files that paint the first screen (the hero name's Bowlby
 * face and the body font's three weights) straight from the HTML. Without this
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
  /^assets[\\/]bowlby-one-sc-latin-400-normal-[\w-]+\.woff2$/,
  /^assets[\\/]zen-kaku-gothic-new-latin-(400|500|700)-normal-[\w-]+\.woff2$/,
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
    plugins: [react(), localGithubApi(env), preloadFirstScreenFonts()],
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

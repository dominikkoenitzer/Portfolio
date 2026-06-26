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
 * (`.env.local`) and used only here — it is never exposed to the client bundle.
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
 * Runs the real `/api/contact` serverless handler in-process for local dev and
 * preview, mirroring `localGithubApi` but reading a POST JSON body. RESEND_API_KEY
 * is read server-side from the environment and never reaches the client bundle.
 */
function localContactApi(env: Record<string, string>): Plugin {
  const attach = (server: ViteDevServer | PreviewServer) => {
    if (env.RESEND_API_KEY) {
      process.env.RESEND_API_KEY = env.RESEND_API_KEY;
    }

    server.middlewares.use(async (req, res, next) => {
      if (!(req.url || "").startsWith("/api/contact")) {
        next();
        return;
      }

      try {
        const chunks: Buffer[] = [];
        for await (const chunk of req) {
          chunks.push(chunk as Buffer);
        }
        const raw = Buffer.concat(chunks).toString("utf8");
        let parsedBody: unknown = {};
        try {
          parsedBody = raw ? JSON.parse(raw) : {};
        } catch {
          parsedBody = {};
        }

        const handlerUrl = pathToFileURL(
          path.resolve(__dirname, "api/contact.js"),
        ).href;
        const mod = await import(handlerUrl);
        const vreq = { method: req.method, body: parsedBody, query: {} };
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
    name: "local-contact-api",
    configureServer: attach,
    configurePreviewServer: attach,
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
    plugins: [react(), localGithubApi(env), localContactApi(env)],
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
          manualChunks: {
            // Vendor chunks
            "react-vendor": ["react", "react-dom", "react-router-dom"],
            "framer-motion": ["framer-motion"],
            // three.js + r3f isolated in their own chunk, fetched lazily with the
            // SkillSphere — kept out of the main bundle.
            "three-vendor": ["three", "@react-three/fiber"],
            lenis: ["lenis", "lenis/react"],
            "ui-vendor": [
              "@radix-ui/react-popover",
              "@radix-ui/react-slot",
              "@radix-ui/react-toast",
              "@radix-ui/react-tooltip",
            ],
            "query-vendor": ["@tanstack/react-query"],
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },
  };
});

// The diagnostic page posts its report to VITE_DIAG_ENDPOINT. The browser only
// lets it if the Content-Security-Policy in vercel.json allows that origin in
// connect-src, and a blocked report fails quietly on the visitor's side. So a
// build with the endpoint set and the origin missing from the policy stops here.
//
//   node scripts/diag-csp.mjs     exits 1 when the endpoint's origin is not allowed
//
// Reads the variable the way Vite does: the environment first, then the .env
// files of the production build.

import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));

export function readVercelConfig() {
  return JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
}

/** Every connect-src source of every Content-Security-Policy header. */
export function connectSources(config) {
  const policies = (config.headers ?? []).flatMap((rule) =>
    rule.headers.filter((h) => h.key.toLowerCase() === "content-security-policy").map((h) => h.value),
  );
  return policies.map((policy) => {
    const directive = policy
      .split(";")
      .map((d) => d.trim().split(/\s+/))
      .find(([name]) => name === "connect-src");
    // Without connect-src the browser falls back to default-src.
    const fallback = policy
      .split(";")
      .map((d) => d.trim().split(/\s+/))
      .find(([name]) => name === "default-src");
    return (directive ?? fallback ?? ["connect-src", "*"]).slice(1);
  });
}

function allows(source, url) {
  if (source === "*") return url.protocol === "https:" || url.protocol === "http:";
  if (/^[a-z][a-z0-9+.-]*:$/i.test(source)) return url.protocol === source.toLowerCase();
  const match = /^(?:([a-z][a-z0-9+.-]*):\/\/)?(\*\.)?([^/:]+)(?::(\d+|\*))?/i.exec(source);
  if (!match) return false;
  const [, scheme, wildcard, host, port] = match;
  if (scheme && `${scheme.toLowerCase()}:` !== url.protocol) return false;
  const hostname = url.hostname.toLowerCase();
  const wanted = host.toLowerCase();
  if (wildcard ? !hostname.endsWith(`.${wanted}`) : hostname !== wanted) return false;
  if (port === "*") return true;
  const defaultPort = url.protocol === "https:" ? "443" : url.protocol === "http:" ? "80" : "";
  return (port ?? defaultPort) === (url.port || defaultPort);
}

/**
 * The endpoint's origin when some policy in the config would block a request
 * to it; null when there is no endpoint or every policy allows it.
 */
export function blockedDiagOrigin(endpoint, config = readVercelConfig()) {
  if (!endpoint) return null;
  const url = new URL(endpoint);
  const lists = connectSources(config);
  const blocked = lists.length > 0 && lists.some((sources) => !sources.some((s) => allows(s, url)));
  return blocked ? url.origin : null;
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const { loadEnv } = await import("vite");
  const endpoint = process.env.VITE_DIAG_ENDPOINT || loadEnv("production", root, "VITE_").VITE_DIAG_ENDPOINT;
  const origin = blockedDiagOrigin(endpoint);
  if (origin) {
    console.error(
      `VITE_DIAG_ENDPOINT is set, but connect-src in vercel.json does not allow ${origin}: add it to the Content-Security-Policy, or the diagnostic report cannot be sent.`,
    );
    process.exit(1);
  }
  console.log(endpoint ? `diag endpoint ${new URL(endpoint).origin} allowed by connect-src` : "no diag endpoint set");
}

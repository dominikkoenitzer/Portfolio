import { PassThrough } from "node:stream";
import { renderToPipeableStream } from "react-dom/server";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";

const ABORT_DELAY = 10_000;

/**
 * Server entry used at build time for prerendering (ssr:false).
 *
 * IMPORTANT: this must render through React's streaming pipeline
 * (`renderToPipeableStream`), not `renderToString`. React Router serializes the
 * client hydration data into trailing inline scripts that close
 * `window.__reactRouterContext.stream`; `renderToString` never emits those, so
 * the client's `hydrateRoot` waits forever for a stream that never closes and
 * the page stays frozen on its prerendered (opacity:0) frame.
 *
 * We still need react-helmet-async's per-route <head> in the static HTML, so we
 * buffer the fully-resolved stream (`onAllReady`) and splice Helmet's
 * title/meta/link into <head> before serializing. (Per-route JSON-LD is
 * rendered in-tree by <SEO>, so it's already captured by the stream.)
 */
export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext
): Promise<Response> {
  return new Promise((resolve, reject) => {
    const helmetContext: { helmet?: HelmetServerState } = {};
    let status = responseStatusCode;

    const { pipe, abort } = renderToPipeableStream(
      <HelmetProvider context={helmetContext}>
        <ServerRouter context={routerContext} url={request.url} />
      </HelmetProvider>,
      {
        // onAllReady (not onShellReady): prerendering wants the complete,
        // fully-resolved document, including the trailing hydration scripts.
        onAllReady() {
          const sink = new PassThrough();
          const chunks: Buffer[] = [];
          sink.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
          sink.on("end", () => {
            let html = Buffer.concat(chunks).toString("utf8");
            const { helmet } = helmetContext;
            if (helmet) {
              const head = [
                helmet.title.toString(),
                helmet.meta.toString(),
                helmet.link.toString(),
              ]
                .join("")
                .trim();
              if (head) {
                html = html.replace("</head>", `${head}</head>`);
              }
            }
            responseHeaders.set("Content-Type", "text/html; charset=utf-8");
            resolve(
              new Response(`<!DOCTYPE html>${html}`, {
                headers: responseHeaders,
                status,
              })
            );
          });
          pipe(sink);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          status = 500;
          // Surfaced in the build log if a route fails to prerender.
          console.error(error);
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });
}

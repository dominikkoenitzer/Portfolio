import { renderToString } from "react-dom/server";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import type { EntryContext } from "react-router";
import { ServerRouter } from "react-router";

/**
 * Custom server entry used at build time for prerendering (ssr:false).
 *
 * The per-route <SEO> components emit their head tags through
 * react-helmet-async. React Router has no built-in awareness of Helmet, so we
 * render inside a HelmetProvider, then splice Helmet's collected title/meta/
 * link/script (incl. per-route JSON-LD) into <head> before serializing — that
 * is what makes the dynamic, per-route SEO land in the static HTML that non-JS
 * crawlers and AI engines read.
 */
export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  routerContext: EntryContext
) {
  const helmetContext: { helmet?: HelmetServerState } = {};

  let markup = renderToString(
    <HelmetProvider context={helmetContext}>
      <ServerRouter context={routerContext} url={request.url} />
    </HelmetProvider>
  );

  const { helmet } = helmetContext;
  if (helmet) {
    const headTags = [
      helmet.title.toString(),
      helmet.meta.toString(),
      helmet.link.toString(),
      helmet.script.toString(),
    ]
      .join("")
      .trim();
    if (headTags) {
      markup = markup.replace("</head>", `${headTags}</head>`);
    }
  }

  responseHeaders.set("Content-Type", "text/html; charset=utf-8");
  return new Response(`<!DOCTYPE html>${markup}`, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}

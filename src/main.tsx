import { SpeedInsights } from "@vercel/speed-insights/react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
// Self-hosted fonts (fontsource), no third-party origin before the first
// glyph. Geist is the reading face: one variable file for all weights, with
// Latin Extended split off by unicode-range so it only downloads when a page
// needs it. Kaisei Decol sets every title, at 700 only because nothing
// paints a title at another weight. Umlauts and accents (Könitzer, Zürich,
// Français) are in the Latin files; Chinese falls back to the system CJK
// font. The hero name uses Kaisei Decol too. M PLUS 1 Code sets the code
// excerpts in the case studies and Klee One, a hand-lettered Japanese face,
// the small accents such as the section numbers. Both are imported for Latin
// only: their full sets add about 240 @font-face rules (one per slice of the
// Japanese character set) to the render-blocking stylesheet, which took it
// from 16 kB to 83 kB gzipped, and the site sets no Japanese text in them.
import "@fontsource-variable/geist/wght.css";
import "@fontsource/kaisei-decol/latin-700.css";
import "@fontsource/hina-mincho/latin-400.css";
import "@fontsource/klee-one/latin-600.css";
import "@fontsource/m-plus-1-code/latin-400.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
    <SpeedInsights />
  </HelmetProvider>,
);

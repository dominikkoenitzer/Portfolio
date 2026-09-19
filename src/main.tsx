import { SpeedInsights } from "@vercel/speed-insights/react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
// Self-hosted Latin subsets of the three site fonts (fontsource). Google's
// stylesheet for the same families was 672 kB with 731 @font-face rules,
// almost all of them Japanese unicode-range slices this site never uses, and
// it cost two extra origins before the first glyph could paint. Umlauts and
// accents (Könitzer, Zürich, Français) are Latin-1 and inside these subsets;
// Chinese text falls back to the system CJK font, which renders Simplified
// forms correctly where the Japanese-designed Zen glyphs did not.
import "@fontsource/zen-kaku-gothic-new/latin-400.css";
import "@fontsource/zen-kaku-gothic-new/latin-500.css";
import "@fontsource/zen-kaku-gothic-new/latin-700.css";
// 700 only: measured across all 11 routes in all four languages, the browser
// never requests the 500 or the 900 cut, because nothing on the site paints at those
// weights, and a heading at 600 resolves upward to 700 either way. The two
// unused faces were ~23 kB of woff2 (plus their woff fallbacks) shipped in
// every build for nobody.
import "@fontsource/zen-maru-gothic/latin-700.css";
import "@fontsource/m-plus-rounded-1c/latin-800.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
    <SpeedInsights />
  </HelmetProvider>,
);

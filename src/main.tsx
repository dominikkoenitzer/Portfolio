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
// font. M PLUS Rounded 1c stays for the hero name alone.
import "@fontsource-variable/geist/wght.css";
import "@fontsource/kaisei-decol/latin-700.css";
import "@fontsource/m-plus-rounded-1c/latin-800.css";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <App />
    <SpeedInsights />
  </HelmetProvider>,
);

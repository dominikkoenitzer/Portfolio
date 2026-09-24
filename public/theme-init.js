// Runs in <head>, before the stylesheet paints anything, so a visitor on the
// dark theme never sees the cream page flash first. A choice made with the
// toggle wins; without one the system setting decides. It is a same-origin
// file rather than an inline script because the production CSP allows no
// inline script. `src/lib/theme.ts` owns the same key and colours.
(function () {
  var stored = null;
  try {
    stored = localStorage.getItem("theme");
  } catch (e) {
    // Storage blocked: fall through to the system setting.
  }
  var dark =
    stored === "dark" ||
    (stored !== "light" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches);
  var root = document.documentElement;
  root.classList.toggle("dark", dark);
  root.style.colorScheme = dark ? "dark" : "light";
  var meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", dark ? "#0d0a13" : "#f6f0e6");
})();

import { flushSync } from "react-dom";
/**
 * The two themes: bloom, the bright page, and its night side. The theme is a
 * `dark` class on <html>, set before first paint by `public/theme-init.js`
 * (same storage key, same colours) and kept here afterwards.
 *
 * A visitor's own choice is stored and wins from then on. Until they make
 * one, the page follows the system setting, including when it changes while
 * the page is open.
 */

export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

/** The browser chrome colour per theme: each theme's page colour. */
export const THEME_COLOR: Record<Theme, string> = {
  light: "#f6f0e6",
  dark: "#0d0a13",
};

const listeners = new Set<() => void>();

export const currentTheme = (): Theme =>
  typeof document !== "undefined" &&
  document.documentElement.classList.contains("dark")
    ? "dark"
    : "light";

const storedTheme = (): Theme | null => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
};

const apply = (theme: Theme) => {
  const root = document.documentElement;
  if (root.classList.contains("dark") === (theme === "dark")) return;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", THEME_COLOR[theme]);
  for (const listener of listeners) listener();
};

/**
 * Switches the theme and remembers it as the visitor's choice. Where the
 * browser has view transitions the page crossfades into the other theme over
 * about a second, the way evening falls or morning comes, instead of cutting.
 * Reduced motion, and browsers without the API, switch at once. `flushSync`
 * makes React paint the new theme inside the transition, so the snapshot it
 * fades to is the finished page.
 */
export const setTheme = (theme: Theme) => {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Storage blocked: the switch still holds for this page view.
  }
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || typeof document.startViewTransition !== "function") {
    apply(theme);
    return;
  }
  document.startViewTransition(() => flushSync(() => apply(theme)));
};

let watching = false;

/**
 * Subscribes to theme changes. The first subscriber also starts following the
 * system setting (for visitors who have not chosen) and other tabs (for
 * visitors who choose in one of them).
 */
export const subscribeTheme = (listener: () => void) => {
  listeners.add(listener);
  if (!watching && typeof window !== "undefined") {
    watching = true;
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (event) => {
        if (!storedTheme()) apply(event.matches ? "dark" : "light");
      });
    window.addEventListener("storage", (event) => {
      if (event.key !== STORAGE_KEY) return;
      const theme = storedTheme();
      if (theme) apply(theme);
    });
  }
  return () => {
    listeners.delete(listener);
  };
};

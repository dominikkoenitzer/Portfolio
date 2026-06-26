import type { Theme } from "@/config/themes";

/**
 * Design tokens for the Services skill-tree sapling, lifted verbatim from the
 * `Services Skill Tree` handoff. Kept in a three.js-free module so the eagerly
 * loaded {@link ServicesSection} can read the CSS gradient / accent colours
 * without pulling the lazy WebGL `ServiceExplorer` (and three.js) into its
 * chunk — the section paints the gradient backdrop, the explorer paints the
 * transparent canvas on top.
 */

export type Group3 = "build" | "protect" | "grow";

export type ServiceTreeTheme = "Blue" | "Violet" | "Midnight";

export interface ServiceTreePalette {
  /** CSS background gradient for the section panel (behind the canvas). */
  bg: string;
  /** Scene fog colour — also the colour dimmed branches lerp toward. */
  fog: number;
  /** Seed / core / ground-ring colour. */
  core: number;
  /** Big soft halo behind the tree. */
  halo: number;
  /** Ambient particle colour. */
  particle: number;
}

/**
 * Only background, fog, core, halo and particle change between themes — the
 * three category accents stay constant (see {@link CATEGORY_ACCENT_NUM}).
 */
export const SERVICE_TREE_THEMES: Record<ServiceTreeTheme, ServiceTreePalette> =
  {
    Blue: {
      bg: "radial-gradient(110% 80% at 100% 100%, rgba(20,180,210,0.55) 0%, rgba(20,180,210,0) 50%),radial-gradient(90% 70% at 0% 35%, rgba(120,70,200,0.45) 0%, rgba(120,70,200,0) 55%),radial-gradient(120% 90% at 75% 0%, rgba(60,90,230,0.5) 0%, rgba(60,90,230,0) 60%),linear-gradient(150deg,#16267a 0%,#21399c 45%,#2b62c6 100%)",
      fog: 0x21399c,
      core: 0xbcd6ff,
      halo: 0x4f7bff,
      particle: 0xacc8ff,
    },
    Violet: {
      bg: "radial-gradient(100% 80% at 100% 100%, rgba(210,70,170,0.45) 0%, rgba(210,70,170,0) 55%),radial-gradient(90% 80% at 0% 30%, rgba(90,40,170,0.6) 0%, rgba(90,40,170,0) 55%),linear-gradient(150deg,#2a1066 0%,#4a1f8f 50%,#7a2bb0 100%)",
      fog: 0x4a1f8f,
      core: 0xe9ccff,
      halo: 0x9b5cff,
      particle: 0xceb0ff,
    },
    Midnight: {
      bg: "radial-gradient(100% 80% at 90% 100%, rgba(30,90,200,0.35) 0%, rgba(30,90,200,0) 55%),radial-gradient(90% 80% at 10% 20%, rgba(40,30,120,0.45) 0%, rgba(40,30,120,0) 55%),linear-gradient(160deg,#05060f 0%,#0a1330 55%,#101c44 100%)",
      fog: 0x0a1330,
      core: 0x9fd0ff,
      halo: 0x2f6bff,
      particle: 0x6f9fff,
    },
  };

/** Radial vignette painted above the canvas to sink the far branches. */
export const SERVICE_TREE_VIGNETTE =
  "radial-gradient(120% 90% at 50% 32%, transparent 52%, rgba(3,7,28,0.55) 100%)";

/** Category accents — constant across themes. `*_NUM` feeds three.js. */
export const CATEGORY_ACCENT_NUM: Record<Group3, number> = {
  build: 0x36d0ff,
  protect: 0xff5fa2,
  grow: 0x46e08f,
};

/** Category accents as CSS hex — for the card accent bar / pill / tab dot. */
export const CATEGORY_ACCENT_HEX: Record<Group3, string> = {
  build: "#36d0ff",
  protect: "#ff5fa2",
  grow: "#46e08f",
};

/** Mint trunk colour, tying the stem to the sprout at the seed. */
export const TRUNK_COLOR = 0x8fe9cf;

/**
 * Map the site palette onto a design theme: the light "Bloom" theme gets the
 * brighter default Blue sapling; the dark "Glass" theme gets deep Midnight so
 * the panel sits naturally against the rest of the dark UI. (The sapling is a
 * luminous dark scene either way — it never renders on a light backdrop.)
 */
export const serviceTreeThemeFor = (theme: Theme): ServiceTreeTheme =>
  theme === "glass" ? "Midnight" : "Blue";

import type { Theme } from "@/config/themes";

/**
 * Design tokens for the Services skill-tree sapling.
 *
 * Kept in a three.js-free module so the eagerly loaded {@link ServicesSection}
 * can read the accent colours without pulling the lazy WebGL `ServiceExplorer`
 * (and three.js) into its chunk.
 *
 * The sapling used to sit inside its own dark panel, so every element could be
 * additive glow. It now renders directly on the page, which means on a light
 * theme there is nothing to add light *to* — additive blending is invisible
 * against near-white. Each palette therefore declares `onLight`, and the
 * explorer swaps blending and colour weights accordingly: emissive on dark,
 * drawn on light.
 */

export type Group3 = "build" | "protect" | "grow";

export type ServiceTreeTheme = "Blue" | "Violet" | "Midnight";

export interface ServiceTreePalette {
  /**
   * The plant is drawing onto a light page. Turns off additive blending (which
   * cannot darken) and selects the darker, saturated colour set.
   */
  onLight: boolean;
  /** Scene fog colour — also the colour dimmed branches lerp toward, so it
   *  should match the page behind the canvas for branches to fade *out*. */
  fog: number;
  /** Seed / core / ground-ring colour. */
  core: number;
  /** Big soft halo behind the tree. */
  halo: number;
  /** Ambient particle colour. */
  particle: number;
  /** Trunk colour, tying the stem to the sprout at the seed. */
  trunk: number;
  /** Category accents — darker on a light page so the branches read. */
  accent: Record<Group3, number>;
}

export const SERVICE_TREE_THEMES: Record<ServiceTreeTheme, ServiceTreePalette> =
  {
    // Bloom — a light page. Saturated mid-tones that hold against near-white.
    Blue: {
      onLight: true,
      fog: 0xfdf0f2,
      core: 0x1e4fd8,
      halo: 0x8fb4ff,
      particle: 0x7089c4,
      trunk: 0x1f9e7a,
      accent: { build: 0x0e7490, protect: 0xbe185d, grow: 0x047857 },
    },
    Violet: {
      onLight: false,
      fog: 0x4a1f8f,
      core: 0xe9ccff,
      halo: 0x9b5cff,
      particle: 0xceb0ff,
      trunk: 0x8fe9cf,
      accent: { build: 0x36d0ff, protect: 0xff5fa2, grow: 0x46e08f },
    },
    // Glass — a dark page. The original luminous scene.
    Midnight: {
      onLight: false,
      fog: 0x0a1330,
      core: 0x9fd0ff,
      halo: 0x2f6bff,
      particle: 0x6f9fff,
      trunk: 0x8fe9cf,
      accent: { build: 0x36d0ff, protect: 0xff5fa2, grow: 0x46e08f },
    },
  };

/** Category accents as CSS hex — decorative use (glows, washes, icon tiles). */
export const CATEGORY_ACCENT_HEX: Record<Group3, string> = {
  build: "#36d0ff",
  protect: "#ff5fa2",
  grow: "#46e08f",
};

/**
 * The same accents at text contrast. The decorative set above is tuned to glow
 * on dark and is unreadable as small text on a light background — cyan #36d0ff
 * on #fdf0f2 is roughly 1.5:1. Use these wherever an accent carries words.
 */
export const CATEGORY_ACCENT_TEXT: Record<
  "light" | "dark",
  Record<Group3, string>
> = {
  // On a light page: darkened, still recognisably the same hue.
  light: { build: "#0e7490", protect: "#be185d", grow: "#047857" },
  // On a dark page: the decorative accents already pass comfortably.
  dark: { build: "#5adcff", protect: "#ff86bb", grow: "#6ceaa7" },
};

/** Whether the site theme paints a dark page behind the plant. */
export const isDarkTheme = (theme: Theme) => theme === "glass";

/**
 * Map the site palette onto a design theme: light "Bloom" gets the drawn Blue
 * sapling, dark "Glass" gets the luminous Midnight one.
 */
export const serviceTreeThemeFor = (theme: Theme): ServiceTreeTheme =>
  isDarkTheme(theme) ? "Midnight" : "Blue";

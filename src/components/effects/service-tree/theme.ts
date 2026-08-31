/**
 * Design tokens for the Services skill-tree sapling.
 *
 * Kept in a three.js-free module so the eagerly loaded {@link ServicesSection}
 * can read the accent colours without pulling the lazy WebGL `ServiceExplorer`
 * (and three.js) into its chunk.
 *
 * The sapling used to sit inside its own dark panel, so every element could be
 * additive glow. It now renders directly on the page, which means on a light
 * theme there is nothing to add light *to*: additive blending is invisible
 * against near-white. Each palette therefore declares `onLight`, and the
 * explorer swaps blending and colour weights accordingly: emissive on dark,
 * drawn on light.
 */

export type Group3 = "build" | "protect" | "grow";

export type ServiceTreeTheme = "Bloom" | "Violet" | "Midnight";

export interface ServiceTreePalette {
  /**
   * The plant is drawing onto a light page. Turns off additive blending (which
   * cannot darken) and selects the darker, saturated colour set.
   */
  onLight: boolean;
  /** Scene fog colour: also the colour dimmed branches lerp toward, so it
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
  /** Category accents: darker on a light page so the branches read. */
  accent: Record<Group3, number>;
}

export const SERVICE_TREE_THEMES: Record<ServiceTreeTheme, ServiceTreePalette> =
  {
    // Bloom, the light page (see the token table in index.css). The three
    // branches wear the illustration's three colours, each a dusty mid-tone
    // that still holds against the cream page: build is the violet backdrop,
    // protect the blush of her cheeks, grow the sage of her eyes. Core and
    // halo are the primary violet and its lilac; the trunk is the deep sage
    // the eyebrows use.
    Bloom: {
      onLight: true,
      fog: 0xf6f0e6,
      core: 0x62477f,
      halo: 0xb9a6cc,
      particle: 0x8d74a8,
      trunk: 0x4e7040,
      accent: { build: 0x7358a0, protect: 0xb06a7a, grow: 0x7aa36a },
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
    // Glass, a dark page. The original luminous scene.
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

/** Category accents as CSS hex: decorative use (glows, washes, icon tiles). */
export const CATEGORY_ACCENT_HEX: Record<Group3, string> = {
  build: "#8d74a8",
  protect: "#c9a0a8",
  grow: "#97b78a",
};

/**
 * The same accents at text contrast. The decorative set above is tuned for
 * glows and tints and is unreadable as small text on the light bloom page
 * (the sage #97b78a on #f6f0e6 is about 2:1). Use these wherever an accent
 * carries words.
 */
export const CATEGORY_ACCENT_TEXT: Record<
  "light" | "dark",
  Record<Group3, string>
> = {
  // On a light page: the same hues pulled down to AA. These are the site's
  // own text-strength tokens (primary, blush-deep, sage-deep in index.css),
  // 6.8:1, 4.9:1 and 5.0:1 on the page, and still over 4.5:1 on the tinted
  // chip fill, which is the accent at 7% and near enough to the page.
  light: { build: "#62477f", protect: "#8b5761", grow: "#4e7040" },
  // On a dark page: the pastel set, which already passes comfortably.
  dark: { build: "#c3b0dc", protect: "#e2b4bc", grow: "#b9d3ad" },
};

/**
 * The site has one palette, bloom, which is a light page: it gets the drawn
 * Bloom sapling. Midnight and Violet stay defined as tuned token sets, nothing
 * selects them.
 */
export const SITE_SERVICE_TREE_THEME: ServiceTreeTheme = "Bloom";

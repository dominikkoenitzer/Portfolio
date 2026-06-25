import { Droplets, Film, Flower2, Sparkles } from "lucide-react";
import type { ElementType } from "react";

export type Theme = "glass" | "bloom";

export interface ThemeConfig {
  value: Theme;
  label: string;
  icon: ElementType;
}

export const THEMES: ThemeConfig[] = [
  { value: "bloom", label: "Bloom", icon: Flower2 },
  { value: "glass", label: "Glass", icon: Sparkles },
];

export const ALL_THEME_VALUES: Theme[] = THEMES.map((t) => t.value);

/**
 * Background style is a second, orthogonal axis to the colour palette: every
 * variant renders the *same* palette colour stops, just through a different
 * full-viewport effect. "caustic" is the original water-caustic veil; "grainient"
 * is the grainy-gradient field.
 */
export type BackgroundVariant = "caustic" | "grainient";

export interface BackgroundVariantConfig {
  value: BackgroundVariant;
  label: string;
  icon: ElementType;
}

export const BACKGROUND_VARIANTS: BackgroundVariantConfig[] = [
  { value: "grainient", label: "Grainy Gradient", icon: Film },
  { value: "caustic", label: "Water Caustic", icon: Droplets },
];

export const ALL_VARIANT_VALUES: BackgroundVariant[] = BACKGROUND_VARIANTS.map(
  (v) => v.value,
);

// Only the two compositing modes the veil actually uses.
type BlendMode = "multiply" | "screen";

export type VeilPreset = {
  colorStops: [string, string, string];
  blendMode: BlendMode;
  intensity: number;
  blend: number;
  scale: number;
  feather: number;
  alphaGamma: number;
  saturation: number;
  minAlpha: number;
  base: number;
  /** Strength of the caustic veins (0 = none). */
  caustic: number;
};

export const VEIL_PRESETS: Record<Theme, VeilPreset> = {
  glass: {
    colorStops: ["#1E5BFF", "#8B5CF6", "#22D3EE"],
    blendMode: "screen",
    intensity: 0.7,
    blend: 0.7,
    scale: 0.9,
    feather: 0.5,
    alphaGamma: 1.1,
    saturation: 1.15,
    minAlpha: 0.0,
    base: 0.3,
    caustic: 0.6,
  },
  bloom: {
    colorStops: ["#453161", "#B6D088", "#FFE8EA"],
    blendMode: "multiply",
    intensity: 0.5,
    blend: 0.62,
    scale: 0.85,
    feather: 0.48,
    alphaGamma: 1.1,
    saturation: 1.05,
    base: 0.22,
    minAlpha: 0.03,
    caustic: 1.0,
  },
};

export const getVeilPreset = (theme: Theme): VeilPreset =>
  VEIL_PRESETS[theme] ?? VEIL_PRESETS.glass;

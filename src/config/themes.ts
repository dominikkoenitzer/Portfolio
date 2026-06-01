import { Flower2, Sparkles, Sunset, TreePine } from "lucide-react";
import type { ElementType } from "react";

export type Theme = "glass" | "bloom" | "forest" | "sunset";

export interface ThemeConfig {
  value: Theme;
  label: string;
  icon: ElementType;
}

export const THEMES: ThemeConfig[] = [
  { value: "glass", label: "Glass", icon: Sparkles },
  { value: "bloom", label: "Bloom", icon: Flower2 },
  { value: "forest", label: "Forest", icon: TreePine },
  { value: "sunset", label: "Sunset", icon: Sunset },
];

export const ALL_THEME_VALUES: Theme[] = THEMES.map((t) => t.value);

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
  forest: {
    colorStops: ["#2F6B43", "#7A5230", "#CDE8C4"],
    blendMode: "multiply",
    intensity: 0.5,
    blend: 0.58,
    scale: 0.88,
    feather: 0.5,
    alphaGamma: 1.1,
    saturation: 1.0,
    base: 0.24,
    minAlpha: 0.03,
    caustic: 0.9,
  },
  sunset: {
    colorStops: ["#FF4D8D", "#FF7E5F", "#FFD27D"],
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
};

export const getVeilPreset = (theme: Theme): VeilPreset =>
  VEIL_PRESETS[theme] ?? VEIL_PRESETS.glass;

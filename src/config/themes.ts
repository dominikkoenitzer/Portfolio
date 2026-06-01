import { Coffee, Flower2, Sparkles, TreePine } from "lucide-react";
import type { ElementType } from "react";

export type Theme = "glass" | "bloom" | "forest" | "coffee";

export interface ThemeConfig {
  value: Theme;
  label: string;
  icon: ElementType;
}

export const THEMES: ThemeConfig[] = [
  { value: "glass", label: "Glass", icon: Sparkles },
  { value: "bloom", label: "Bloom", icon: Flower2 },
  { value: "forest", label: "Forest", icon: TreePine },
  { value: "coffee", label: "Coffee", icon: Coffee },
];

export const ALL_THEME_VALUES: Theme[] = THEMES.map((t) => t.value);

type BlendMode =
  | "normal"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "soft-light"
  | "difference"
  | "exclusion"
  | "hue"
  | "saturation"
  | "color"
  | "luminosity";

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
};

export const VEIL_PRESETS: Record<Theme, VeilPreset> = {
  glass: {
    colorStops: ["#BFD7FF", "#D9C8FF", "#B4ECFF"],
    blendMode: "multiply",
    intensity: 0.5,
    blend: 0.6,
    scale: 0.85,
    feather: 0.45,
    alphaGamma: 1.15,
    saturation: 1.05,
    minAlpha: 0.04,
    base: 0.22,
  },
  bloom: {
    colorStops: ["#453161", "#B6D088", "#FFE8EA"],
    blendMode: "multiply",
    intensity: 0.45,
    blend: 0.62,
    scale: 0.85,
    feather: 0.48,
    alphaGamma: 1.2,
    saturation: 1.0,
    base: 0.22,
    minAlpha: 0.03,
  },
  forest: {
    colorStops: ["#C8F2D6", "#A8E6C5", "#E0F5E3"],
    blendMode: "multiply",
    intensity: 0.5,
    blend: 0.55,
    scale: 0.88,
    feather: 0.5,
    alphaGamma: 1.15,
    saturation: 1.02,
    minAlpha: 0.04,
    base: 0.24,
  },
  coffee: {
    colorStops: ["#F4D9BA", "#E8C49A", "#FFEEDC"],
    blendMode: "multiply",
    intensity: 0.42,
    blend: 0.62,
    scale: 0.82,
    feather: 0.5,
    alphaGamma: 1.12,
    saturation: 1.0,
    minAlpha: 0.05,
    base: 0.28,
  },
};

export const getVeilPreset = (theme: Theme): VeilPreset =>
  VEIL_PRESETS[theme] ?? VEIL_PRESETS.glass;

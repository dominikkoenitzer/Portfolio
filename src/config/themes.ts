import { Coffee, Sparkles, TreePine, Zap } from "lucide-react";
import type { ElementType } from "react";

export interface ThemeConfig {
  value: string;
  label: string;
  icon: ElementType;
  type: "light" | "dark";
}

export const THEMES: ThemeConfig[] = [
  { value: "glass", label: "Glass", icon: Sparkles, type: "dark" },
  { value: "cyberpunk", label: "Cyberpunk", icon: Zap, type: "dark" },
  { value: "forest", label: "Forest", icon: TreePine, type: "light" },
  { value: "coffee", label: "Coffee", icon: Coffee, type: "light" },
];

export const ALL_THEME_VALUES = THEMES.map((t) => t.value);
export type Theme = (typeof ALL_THEME_VALUES)[number];

export const getThemeType = (currentTheme: Theme): "light" | "dark" => {
  const cfg = THEMES.find((t) => t.value === currentTheme);
  return cfg?.type || "dark";
};

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

export type AuroraPreset = {
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

export const AURORA_PRESETS: Record<Theme, AuroraPreset> = {
  glass: {
    colorStops: ["#7FB8FF", "#9C7BFF", "#5EE6F0"],
    blendMode: "screen",
    intensity: 0.82,
    blend: 0.6,
    scale: 1.0,
    feather: 0.3,
    alphaGamma: 1.12,
    saturation: 1.18,
    minAlpha: 0.0,
    base: 0.24,
  },
  cyberpunk: {
    colorStops: ["#E879F9", "#A78BFA", "#60A5FA"],
    blendMode: "screen",
    intensity: 0.9,
    blend: 0.58,
    scale: 1.05,
    feather: 0.22,
    alphaGamma: 1.12,
    saturation: 1.25,
    minAlpha: 0.0,
    base: 0.22,
  },
  forest: {
    colorStops: ["#A7F3D0", "#34D399", "#D1FAE5"],
    blendMode: "screen",
    intensity: 0.58,
    blend: 0.52,
    scale: 0.95,
    feather: 0.46,
    alphaGamma: 1.18,
    saturation: 1.04,
    minAlpha: 0.0,
    base: 0.26,
  },
  coffee: {
    colorStops: ["#F6E7D8", "#EAD0B6", "#FFF9F2"],
    blendMode: "overlay",
    intensity: 0.72,
    blend: 0.64,
    scale: 0.85,
    feather: 0.52,
    alphaGamma: 1.12,
    saturation: 0.98,
    minAlpha: 0.05,
    base: 0.3,
  },
};

export const AURORA_THEME_CLASS_KEYS = Object.keys(AURORA_PRESETS) as Theme[];

export const getAuroraPreset = (theme: Theme): AuroraPreset =>
  AURORA_PRESETS[theme] ?? AURORA_PRESETS.glass;

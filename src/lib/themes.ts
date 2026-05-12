export interface ThemeColors {
  name: string;
  displayName: string;
  description: string;
  icon: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  gradient: string;
  shadow: string;
}

export const themes: Record<string, ThemeColors> = {
  cyberpunk: {
    name: "cyberpunk",
    displayName: "Cyberpunk",
    description: "Neon digital future",
    icon: "Zap",
    primary: "316 100% 67%",
    primaryForeground: "270 100% 4%",
    secondary: "270 65% 14%",
    secondaryForeground: "180 100% 85%",
    accent: "270 65% 17%",
    accentForeground: "180 100% 85%",
    background: "270 70% 9%",
    foreground: "200 80% 92%",
    card: "270 65% 11%",
    cardForeground: "200 80% 92%",
    popover: "270 65% 11%",
    popoverForeground: "200 80% 92%",
    muted: "270 60% 15%",
    mutedForeground: "270 30% 62%",
    border: "270 55% 23%",
    input: "270 55% 23%",
    ring: "316 100% 67%",
    gradient:
      "linear-gradient(135deg, hsl(316 100% 67%) 0%, hsl(180 100% 60%) 100%)",
    shadow: "316 100% 67%",
  },
  forest: {
    name: "forest",
    displayName: "Forest",
    description: "Deep woodland vibes",
    icon: "TreePine",
    primary: "120 60% 25%",
    primaryForeground: "120 100% 95%",
    secondary: "120 30% 90%",
    secondaryForeground: "120 60% 15%",
    accent: "120 30% 90%",
    accentForeground: "120 60% 15%",
    background: "120 50% 96%",
    foreground: "120 60% 12%",
    card: "120 50% 96%",
    cardForeground: "120 60% 12%",
    popover: "120 50% 96%",
    popoverForeground: "120 60% 12%",
    muted: "120 30% 90%",
    mutedForeground: "120 40% 40%",
    border: "120 40% 83%",
    input: "120 40% 83%",
    ring: "120 60% 25%",
    gradient:
      "linear-gradient(135deg, hsl(120 60% 25%) 0%, hsl(90 60% 35%) 100%)",
    shadow: "120 60% 25%",
  },
  glass: {
    name: "glass",
    displayName: "Glass",
    description: "Deep glassmorphism",
    icon: "Sparkles",
    primary: "210 100% 65%",
    primaryForeground: "210 50% 5%",
    secondary: "220 25% 16%",
    secondaryForeground: "210 30% 90%",
    accent: "220 25% 20%",
    accentForeground: "210 30% 90%",
    background: "222 30% 5%",
    foreground: "210 30% 94%",
    card: "220 26% 8%",
    cardForeground: "210 30% 94%",
    popover: "220 26% 8%",
    popoverForeground: "210 30% 94%",
    muted: "220 22% 13%",
    mutedForeground: "215 18% 56%",
    border: "220 18% 20%",
    input: "220 18% 20%",
    ring: "210 100% 65%",
    gradient:
      "linear-gradient(135deg, hsl(210 100% 65%) 0%, hsl(260 100% 72%) 50%, hsl(185 100% 62%) 100%)",
    shadow: "210 100% 65%",
  },
  coffee: {
    name: "coffee",
    displayName: "Coffee",
    description: "Rich café atmosphere",
    icon: "Coffee",
    primary: "30 100% 30%",
    primaryForeground: "30 100% 95%",
    secondary: "30 20% 88%",
    secondaryForeground: "30 100% 15%",
    accent: "30 20% 88%",
    accentForeground: "30 100% 15%",
    background: "30 40% 94%",
    foreground: "30 100% 10%",
    card: "30 40% 94%",
    cardForeground: "30 100% 10%",
    popover: "30 40% 94%",
    popoverForeground: "30 100% 10%",
    muted: "30 20% 88%",
    mutedForeground: "30 50% 40%",
    border: "30 30% 80%",
    input: "30 30% 80%",
    ring: "30 100% 30%",
    gradient:
      "linear-gradient(135deg, hsl(30 100% 30%) 0%, hsl(20 100% 40%) 100%)",
    shadow: "30 100% 30%",
  },
};

export const getTheme = (themeName: string): ThemeColors =>
  themes[themeName] || themes.glass;

export const applyTheme = (theme: ThemeColors) => {
  const root = document.documentElement;

  Object.entries(theme).forEach(([key, value]) => {
    if (
      key !== "name" &&
      key !== "displayName" &&
      key !== "description" &&
      key !== "icon"
    ) {
      root.style.setProperty(
        `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`,
        value
      );
    }
  });

  // Set theme-specific custom properties
  root.style.setProperty("--theme-gradient", theme.gradient);
  root.style.setProperty("--theme-shadow-color", theme.shadow);
  root.setAttribute("data-theme", theme.name);
};

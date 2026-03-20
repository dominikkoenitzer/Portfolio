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
  light: {
    name: "light",
    displayName: "Light",
    description: "Clean & bright",
    icon: "Sun",
    primary: "45 100% 60%",
    primaryForeground: "0 0% 0%",
    secondary: "210 20% 95%",
    secondaryForeground: "0 0% 20%",
    accent: "210 20% 90%",
    accentForeground: "0 0% 20%",
    background: "0 0% 100%",
    foreground: "0 0% 10%",
    card: "0 0% 100%",
    cardForeground: "220.9 39.3% 11%",
    popover: "0 0% 100%",
    popoverForeground: "220.9 39.3% 11%",
    muted: "220 14.3% 95.9%",
    mutedForeground: "220 8.9% 46.1%",
    border: "220 13% 91%",
    input: "220 13% 91%",
    ring: "220 98% 61%",
    gradient:
      "linear-gradient(135deg, hsl(220 98% 61%) 0%, hsl(240 98% 71%) 100%)",
    shadow: "220 98% 61%",
  },
  dark: {
    name: "dark",
    displayName: "Dark",
    description: "Easy on eyes",
    icon: "Moon",
    primary: "220 100% 70%",
    primaryForeground: "0 0% 0%",
    secondary: "220 10% 20%",
    secondaryForeground: "0 0% 90%",
    accent: "220 10% 24%",
    accentForeground: "0 0% 90%",
    background: "220 12% 9%",
    foreground: "0 0% 95%",
    card: "220 12% 12%",
    cardForeground: "210 40% 98%",
    popover: "220 12% 12%",
    popoverForeground: "210 40% 98%",
    muted: "220 10% 18%",
    mutedForeground: "215 20.2% 65.1%",
    border: "220 9% 28%",
    input: "220 9% 28%",
    ring: "220 98% 61%",
    gradient:
      "linear-gradient(135deg, hsl(220 98% 61%) 0%, hsl(240 98% 71%) 100%)",
    shadow: "220 98% 61%",
  },
  cyberpunk: {
    name: "cyberpunk",
    displayName: "Cyberpunk",
    description: "Neon digital future",
    icon: "Zap",
    primary: "316 100% 50%",
    primaryForeground: "0 0% 0%",
    secondary: "270 100% 8%",
    secondaryForeground: "316 100% 90%",
    accent: "270 100% 8%",
    accentForeground: "316 100% 90%",
    background: "270 100% 3%",
    foreground: "316 100% 90%",
    card: "270 100% 3%",
    cardForeground: "316 100% 90%",
    popover: "270 100% 3%",
    popoverForeground: "316 100% 90%",
    muted: "270 100% 8%",
    mutedForeground: "316 50% 65%",
    border: "270 100% 12%",
    input: "270 100% 12%",
    ring: "316 100% 50%",
    gradient:
      "linear-gradient(135deg, hsl(316 100% 50%) 0%, hsl(180 100% 50%) 100%)",
    shadow: "316 100% 50%",
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
  amethyst: {
    name: "amethyst",
    displayName: "Amethyst",
    description: "Mystical purple gem",
    icon: "Gem",
    primary: "270 95% 60%",
    primaryForeground: "270 100% 95%",
    secondary: "270 30% 92%",
    secondaryForeground: "270 95% 15%",
    accent: "270 30% 92%",
    accentForeground: "270 95% 15%",
    background: "270 50% 97%",
    foreground: "270 95% 12%",
    card: "270 50% 97%",
    cardForeground: "270 95% 12%",
    popover: "270 50% 97%",
    popoverForeground: "270 95% 12%",
    muted: "270 30% 92%",
    mutedForeground: "270 50% 45%",
    border: "270 40% 85%",
    input: "270 40% 85%",
    ring: "270 95% 60%",
    gradient:
      "linear-gradient(135deg, hsl(270 95% 60%) 0%, hsl(300 95% 70%) 100%)",
    shadow: "270 95% 60%",
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
  themes[themeName] || themes.light;

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

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { applyTheme, getTheme, type ThemeColors, themes } from "@/lib/themes";

type Theme =
  | "light"
  | "dark"
  | "system"
  | "solarpunk"
  | "cyberpunk"
  | "cloud"
  | "forest"
  | "amethyst"
  | "vintage"
  | "coffee";

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  themeColors: ThemeColors;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
  themeColors: themes.light,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Theme background hex colors for meta tag
const THEME_HEX_COLORS: Record<string, string> = {
  light: "#ffffff",
  dark: "#080808",
  solarpunk: "#f7fff7",
  cyberpunk: "#0a0014",
  cloud: "#f7fbfd",
  forest: "#f5fdf5",
  amethyst: "#f9f7fd",
  vintage: "#faf8f5",
  coffee: "#faf6f0",
};

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "portfolio-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );
  const [themeColors, setThemeColors] = useState<ThemeColors>(themes.light);

  const getSystemTheme = (): "light" | "dark" =>
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  const resolveTheme = useCallback(
    (currentTheme: Theme): keyof typeof themes => {
      if (currentTheme === "system") {
        return getSystemTheme();
      }
      return currentTheme;
    },
    []
  );

  // Update meta theme-color tag
  const updateMetaThemeColor = (themeName: string) => {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      const hexColor = THEME_HEX_COLORS[themeName] || THEME_HEX_COLORS.light;
      metaThemeColor.setAttribute("content", hexColor);
    }
  };

  // Apply theme changes
  const applyThemeChanges = useCallback((themeName: keyof typeof themes) => {
    const root = window.document.documentElement;
    const selectedTheme = getTheme(themeName);
    const bgColor = `hsl(${selectedTheme.background})`;

    // Apply theme CSS variables
    applyTheme(selectedTheme);
    setThemeColors(selectedTheme);

    // Update CSS custom property
    root.style.setProperty("--background", selectedTheme.background);

    // Set background colors (html::before will handle overscroll)
    root.style.backgroundColor = bgColor;
    document.body.style.backgroundColor = bgColor;

    // Update data attribute for potential CSS hooks
    root.setAttribute("data-theme", themeName);

    // Update meta theme-color for mobile browser UI
    updateMetaThemeColor(themeName);

    // Update theme class
    Object.keys(themes).forEach((name) => root.classList.remove(name));
    root.classList.add(themeName);
  }, []);

  useEffect(() => {
    const resolvedTheme = resolveTheme(theme);
    applyThemeChanges(resolvedTheme);

    // Listen for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        const newResolvedTheme = getSystemTheme();
        applyThemeChanges(newResolvedTheme);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, resolveTheme, applyThemeChanges]);

  const handleSetTheme = (newTheme: Theme) => {
    localStorage.setItem(storageKey, newTheme);
    setTheme(newTheme);
  };

  const value = {
    theme,
    setTheme: handleSetTheme,
    themeColors,
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};

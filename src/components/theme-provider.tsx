import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ALL_THEME_VALUES, getThemeType, type Theme } from "@/config/themes";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme, event?: React.MouseEvent | MouseEvent) => void;
};

const initialState: ThemeProviderState = {
  theme: "glass",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

const THEME_META_HEX: Record<string, string> = {
  glass: "#07090f",
  cyberpunk: "#0a0014",
  forest: "#f5fdf5",
  coffee: "#faf6f0",
};

const isValidTheme = (value: string | null): value is Theme =>
  value !== null && (ALL_THEME_VALUES as string[]).includes(value);

export function ThemeProvider({
  children,
  defaultTheme = "glass",
  storageKey = "portfolio-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem(storageKey);
    return isValidTheme(stored) ? stored : defaultTheme;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(...ALL_THEME_VALUES, "dark", "light");
    root.classList.add(theme);
    if (getThemeType(theme) === "dark") root.classList.add("dark");
    root.setAttribute("data-theme", theme);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", THEME_META_HEX[theme] || "#07090f");
    }
  }, [theme]);

  const handleSetTheme = useCallback(
    (newTheme: Theme, event?: React.MouseEvent | MouseEvent) => {
      const applyTheme = () => {
        localStorage.setItem(storageKey, newTheme);
        setTheme(newTheme);
      };

      const shouldAnimate =
        "startViewTransition" in document &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        event &&
        theme !== newTheme;

      if (!shouldAnimate) {
        applyTheme();
        return;
      }

      const { clientX: x, clientY: y } = event;
      const { innerWidth: w, innerHeight: h } = window;

      const maxRadius = Math.ceil(
        Math.max(
          Math.hypot(x, y),
          Math.hypot(w - x, y),
          Math.hypot(x, h - y),
          Math.hypot(w - x, h - y)
        ) * 1.05
      );

      const root = document.documentElement;
      root.style.setProperty("--theme-transition-x", `${x}px`);
      root.style.setProperty("--theme-transition-y", `${y}px`);
      root.style.setProperty("--theme-transition-radius", `${maxRadius}px`);

      (
        document as Document & {
          startViewTransition: (cb: () => void) => { finished: Promise<void> };
        }
      )
        .startViewTransition(applyTheme)
        .finished.then(() => {
          root.style.removeProperty("--theme-transition-x");
          root.style.removeProperty("--theme-transition-y");
          root.style.removeProperty("--theme-transition-radius");
        });
    },
    [storageKey, theme]
  );

  return (
    <ThemeProviderContext.Provider
      {...props}
      value={{ theme, setTheme: handleSetTheme }}
    >
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

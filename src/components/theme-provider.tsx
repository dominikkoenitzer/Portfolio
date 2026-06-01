import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { ALL_THEME_VALUES, type Theme } from "@/config/themes";

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

const THEME_META_HEX: Record<Theme, string> = {
  glass: "#080c16",
  bloom: "#fdf0f2",
  forest: "#f6faf2",
  sunset: "#fdf6f1",
};

const isTheme = (v: string | null): v is Theme =>
  v !== null && (ALL_THEME_VALUES as string[]).includes(v);

export function ThemeProvider({
  children,
  defaultTheme = "glass",
  storageKey = "portfolio-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(storageKey);
    return isTheme(stored) ? stored : defaultTheme;
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove(...ALL_THEME_VALUES);
    root.classList.add(theme);
    root.setAttribute("data-theme", theme);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", THEME_META_HEX[theme]);
    }
  }, [theme]);

  const setTheme = useCallback(
    (newTheme: Theme, event?: React.MouseEvent | MouseEvent) => {
      if (newTheme === theme) return;

      const apply = () => {
        localStorage.setItem(storageKey, newTheme);
        setThemeState(newTheme);
      };

      const canAnimate =
        "startViewTransition" in document &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches &&
        event;

      if (!canAnimate) {
        apply();
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
        .startViewTransition(apply)
        .finished.then(() => {
          root.style.removeProperty("--theme-transition-x");
          root.style.removeProperty("--theme-transition-y");
          root.style.removeProperty("--theme-transition-radius");
        });
    },
    [storageKey, theme]
  );

  return (
    <ThemeProviderContext.Provider {...props} value={{ theme, setTheme }}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

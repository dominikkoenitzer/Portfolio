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
  forest: "#f5f8f2",
  sunset: "#190b0e",
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

      const commit = () => {
        localStorage.setItem(storageKey, newTheme);
        setThemeState(newTheme);
      };

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (
        !(event && !prefersReducedMotion && "startViewTransition" in document)
      ) {
        commit();
        return;
      }

      // Grow a circle from the click point out to the farthest viewport
      // corner, animated on the view-transition snapshot via the Web
      // Animations API — no CSS state is involved.
      const x = event.clientX;
      const y = event.clientY;
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y)
      );

      const transition = (
        document as Document & {
          startViewTransition: (cb: () => void) => { ready: Promise<void> };
        }
      ).startViewTransition(commit);

      transition.ready.then(() => {
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${endRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 480,
            easing: "cubic-bezier(0.4, 0, 0.2, 1)",
            pseudoElement: "::view-transition-new(root)",
          }
        );
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

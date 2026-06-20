import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  ALL_THEME_VALUES,
  ALL_VARIANT_VALUES,
  type BackgroundVariant,
  type Theme,
} from "@/config/themes";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  defaultVariant?: BackgroundVariant;
  storageKey?: string;
  variantStorageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme, event?: React.MouseEvent | MouseEvent) => void;
  variant: BackgroundVariant;
  setVariant: (
    variant: BackgroundVariant,
    event?: React.MouseEvent | MouseEvent,
  ) => void;
};

const initialState: ThemeProviderState = {
  theme: "bloom",
  setTheme: () => null,
  variant: "grainient",
  setVariant: () => null,
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

const isVariant = (v: string | null): v is BackgroundVariant =>
  v !== null && (ALL_VARIANT_VALUES as string[]).includes(v);

/**
 * Commit a theme/variant change, wrapping it in a circular view-transition
 * reveal grown from the click point when the browser supports it and the user
 * hasn't asked to reduce motion. Falls back to an instant commit otherwise.
 */
const commitWithReveal = (
  commit: () => void,
  event?: React.MouseEvent | MouseEvent,
) => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (!(event && !prefersReducedMotion && "startViewTransition" in document)) {
    commit();
    return;
  }

  const x = event.clientX;
  const y = event.clientY;
  const endRadius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
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
      },
    );
  });
};

export function ThemeProvider({
  children,
  defaultTheme = "bloom",
  defaultVariant = "grainient",
  storageKey = "portfolio-theme",
  variantStorageKey = "portfolio-bg-variant",
  ...props
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(storageKey);
    return isTheme(stored) ? stored : defaultTheme;
  });

  const [variant, setVariantState] = useState<BackgroundVariant>(() => {
    const stored = localStorage.getItem(variantStorageKey);
    return isVariant(stored) ? stored : defaultVariant;
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

  useEffect(() => {
    document.documentElement.setAttribute("data-bg-variant", variant);
  }, [variant]);

  const setTheme = useCallback(
    (newTheme: Theme, event?: React.MouseEvent | MouseEvent) => {
      if (newTheme === theme) return;
      commitWithReveal(() => {
        localStorage.setItem(storageKey, newTheme);
        setThemeState(newTheme);
      }, event);
    },
    [storageKey, theme],
  );

  const setVariant = useCallback(
    (newVariant: BackgroundVariant, event?: React.MouseEvent | MouseEvent) => {
      if (newVariant === variant) return;
      commitWithReveal(() => {
        localStorage.setItem(variantStorageKey, newVariant);
        setVariantState(newVariant);
      }, event);
    },
    [variantStorageKey, variant],
  );

  return (
    <ThemeProviderContext.Provider
      {...props}
      value={{ theme, setTheme, variant, setVariant }}
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

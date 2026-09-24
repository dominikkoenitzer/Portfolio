import { useSyncExternalStore } from "react";
import { currentTheme, subscribeTheme, type Theme } from "@/lib/theme";

/** The active theme, re-rendering whenever it changes. */
export function useTheme(): Theme {
  return useSyncExternalStore(subscribeTheme, currentTheme, () => "light");
}

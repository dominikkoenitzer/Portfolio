import { createContext, useContext } from "react";
import type { BackgroundVariant, Theme } from "@/config/themes";

/**
 * The context and its hook live apart from `ThemeProvider` so that the provider
 * module exports nothing but the component. A module that exports both a
 * component and a hook loses Fast Refresh for every consumer of that hook.
 */
export type ThemeProviderState = {
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

export const ThemeProviderContext =
  createContext<ThemeProviderState>(initialState);

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

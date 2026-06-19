import { lazy, Suspense } from "react";
import { useTheme } from "@/components/theme-provider";

// Both variants pull in the ~70KB ogl lib, so keep them lazy — only the active
// one is ever fetched, and never on the critical path.
const LightVeilBackground = lazy(() => import("./LightVeilBackground"));
const GrainientBackground = lazy(() => import("./GrainientBackground"));

/**
 * Picks the active background variant. Lives inside the ThemeProvider so it can
 * react to variant changes; the palette itself is read by each variant.
 */
export function ThemedBackground() {
  const { variant } = useTheme();

  return (
    <Suspense fallback={null}>
      {variant === "grainient" ? <GrainientBackground /> : <LightVeilBackground />}
    </Suspense>
  );
}

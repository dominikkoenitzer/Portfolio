// Re-export all components from their respective modules

export * from "./layout";

// Sections are deliberately NOT re-exported here. A barrel that pulls in every
// section makes them all — plus everything they import, including all project
// content in all four languages — a static dependency of whichever chunk touches
// the barrel, defeating the per-page code splitting. Measured cost when pages
// imported sections through here: +281 kB (+113 kB gzip) on the entry chunk.
// Import sections by module path: `@/components/sections/HeroSection`.
//
// Note: UI components can be imported directly from '@/components/ui'
// to avoid potential circular imports and keep bundle size optimized

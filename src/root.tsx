import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  Links,
  type LinksFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import { PageLayout } from "@/components/layout/PageLayout";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { pageTransition, pageTransitionVariants } from "@/lib/transitions";
import stylesheet from "./index.css?url";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: stylesheet },
];

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap";

// Site-wide JSON-LD graphs (constant across routes). Per-route JSON-LD
// (FAQ/HowTo/Breadcrumb/Person-on-home) is emitted by <SEO> via Helmet.
const STRUCTURED_DATA: Record<string, unknown>[] = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": "https://dominikkoenitzer.ch/#person",
    name: "Dominik Könitzer",
    alternateName: ["Dominik Konitzer", "D. Könitzer"],
    url: "https://dominikkoenitzer.ch",
    image: {
      "@type": "ImageObject",
      url: "https://dominikkoenitzer.ch/og-image.png",
      width: 1200,
      height: 630,
    },
    sameAs: ["https://github.com/dominikkoenitzer"],
    jobTitle: "Software Engineer",
    email: "dominik.koenitzer@gmail.com",
    description:
      "Swiss Software Engineer specializing in modern web development with React, TypeScript, Next.js and full-stack engineering. Currently open to software engineering roles, internships, and freelance opportunities — in Switzerland or remote.",
    knowsLanguage: ["en", "de", "fr"],
    knowsAbout: [
      "Software Engineering",
      "Web Development",
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "Node.js",
      "Java",
      "Spring Framework",
      "Full-Stack Development",
      "Frontend Architecture",
      "DevOps",
      "Docker",
      "PostgreSQL",
      "MongoDB",
    ],
    nationality: { "@type": "Country", name: "Switzerland" },
    hasOccupation: {
      "@type": "Occupation",
      name: "Software Engineer",
      occupationalCategory: "15-1252.00",
      occupationLocation: { "@type": "Country", name: "Switzerland" },
      skills:
        "React, Next.js, TypeScript, JavaScript, Node.js, Java, Spring Framework, Full-Stack Development, Docker, PostgreSQL",
    },
    seeks: {
      "@type": "Demand",
      name: "Software engineering roles, internships, and freelance opportunities",
    },
    alumniOf: {
      "@type": "EducationalOrganization",
      name: "WISS Schulen für Wirtschaft Informatik Immobilien",
      url: "https://www.wiss.ch",
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: "CH",
      addressRegion: "Zürich",
      addressLocality: "Zürich",
    },
    worksFor: { "@id": "https://dominikkoenitzer.ch/#organization" },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://dominikkoenitzer.ch/#website",
    name: "Dominik Könitzer Portfolio",
    alternateName: "Dominik Könitzer — Software Engineer",
    url: "https://dominikkoenitzer.ch",
    description:
      "Portfolio of Dominik Könitzer — Swiss Software Engineer specializing in modern web development.",
    inLanguage: "en",
    publisher: { "@id": "https://dominikkoenitzer.ch/#person" },
    author: { "@id": "https://dominikkoenitzer.ch/#person" },
    copyrightHolder: { "@id": "https://dominikkoenitzer.ch/#person" },
  },
  {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": "https://dominikkoenitzer.ch/#service",
    name: "Dominik Könitzer — Software Engineering Services",
    description:
      "Professional software engineering and web development services delivered from Switzerland to clients worldwide.",
    url: "https://dominikkoenitzer.ch",
    image: "https://dominikkoenitzer.ch/og-image.png",
    priceRange: "CHF 30–500",
    email: "dominik.koenitzer@gmail.com",
    provider: { "@id": "https://dominikkoenitzer.ch/#person" },
    areaServed: [
      { "@type": "Country", name: "Switzerland" },
      { "@type": "Place", name: "Europe" },
      { "@type": "Place", name: "Worldwide" },
    ],
    serviceType: [
      "Web Development",
      "Software Engineering",
      "Frontend Development",
      "Backend Development",
      "Full-Stack Development",
      "React Development",
      "TypeScript Development",
      "Website Maintenance",
      "SEO Optimization",
      "Custom Software Development",
    ],
    address: {
      "@type": "PostalAddress",
      addressCountry: "CH",
      addressRegion: "Zürich",
      addressLocality: "Zürich",
    },
    geo: { "@type": "GeoCoordinates", latitude: 47.3769, longitude: 8.5417 },
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://dominikkoenitzer.ch/#organization",
    name: "Dominik Könitzer",
    alternateName: "Dominik Könitzer Portfolio",
    url: "https://dominikkoenitzer.ch",
    logo: {
      "@type": "ImageObject",
      url: "https://dominikkoenitzer.ch/og-image.png",
      width: 1200,
      height: 630,
    },
    founder: { "@id": "https://dominikkoenitzer.ch/#person" },
    sameAs: ["https://github.com/dominikkoenitzer"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: "dominik.koenitzer@gmail.com",
      availableLanguage: ["English", "German", "French"],
    },
  },
];

// Applies the saved theme class before React mounts so there is no FOUC, and
// syncs the mobile browser-chrome color. Runs as a blocking inline script.
const THEME_BOOTSTRAP = `"use strict";
(() => {
  const THEMES = ["glass", "bloom", "forest", "sunset"];
  const stored = localStorage.getItem("portfolio-theme");
  const theme = THEMES.indexOf(stored) >= 0 ? stored : "glass";
  const bgHex = { glass: "#080c16", bloom: "#fdf0f2", forest: "#f5f8f2", sunset: "#190b0e" }[theme];
  document.documentElement.classList.add(theme);
  document.documentElement.setAttribute("data-theme", theme);
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", bgHex);
})();`;

const CRITICAL_CSS = `html,body{background-color:hsl(var(--background)) !important;margin:0;padding:0;width:100%;min-height:100vh}
html::before{content:"";position:fixed;top:-100vh;left:-100vw;right:-100vw;bottom:-100vh;width:300vw;height:300vh;background-color:hsl(var(--background));z-index:-999999;pointer-events:none}`;

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta
          content="width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover"
          name="viewport"
        />
        <meta content="Vite + React" name="generator" />
        <meta content="strict-origin-when-cross-origin" name="referrer" />
        <meta content="telephone=no" name="format-detection" />
        <meta content="nositelinkssearchbox" name="google" />

        {/* Geographic SEO (site-wide constant — Zürich, Switzerland) */}
        <meta content="CH-ZH" name="geo.region" />
        <meta content="CH" name="geo.country" />
        <meta content="Zürich, Switzerland" name="geo.placename" />
        <meta content="47.3769, 8.5417" name="ICBM" />
        <meta content="47.3769;8.5417" name="geo.position" />

        {/* Performance / preconnect */}
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link crossOrigin="" href="https://fonts.gstatic.com" rel="preconnect" />
        <link href="https://fonts.googleapis.com" rel="dns-prefetch" />
        <link href="https://fonts.gstatic.com" rel="dns-prefetch" />
        <link href="https://github.com" rel="dns-prefetch" />
        <link href="https://avatars.githubusercontent.com" rel="preconnect" />
        <link href="https://avatars.githubusercontent.com" rel="dns-prefetch" />

        {/* Fonts */}
        <link as="style" href={FONT_HREF} rel="preload" />
        <link href={FONT_HREF} rel="stylesheet" />

        {/* Icons & PWA */}
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <link
          href="/android-chrome-192x192.png"
          rel="icon"
          sizes="32x32"
          type="image/png"
        />
        <link
          href="/apple-touch-icon.png"
          rel="apple-touch-icon"
          sizes="180x180"
        />
        <link href="/site.webmanifest" rel="manifest" />
        <meta content="yes" name="apple-mobile-web-app-capable" />
        <meta content="yes" name="mobile-web-app-capable" />
        <meta
          content="black-translucent"
          name="apple-mobile-web-app-status-bar-style"
        />
        <meta content="Dominik Könitzer" name="apple-mobile-web-app-title" />
        <meta content="Dominik Könitzer Portfolio" name="application-name" />
        <meta content="#2563eb" name="msapplication-TileColor" />
        <meta content="/browserconfig.xml" name="msapplication-config" />
        <meta content="#080c16" id="theme-color-meta" name="theme-color" />

        {/* Identity / IndieWeb */}
        <link href="https://github.com/dominikkoenitzer" rel="me" />
        <link href="https://dominikkoenitzer.ch/about" rel="author" />

        {/* Sitemap + AI/LLM discovery */}
        <link
          href="/sitemap.xml"
          rel="sitemap"
          title="Sitemap"
          type="application/xml"
        />
        <link
          href="/llms.txt"
          rel="alternate"
          title="llms.txt"
          type="text/plain"
        />
        <link
          href="/llms-full.txt"
          rel="alternate"
          title="llms-full.txt"
          type="text/plain"
        />
        <meta content="https://github.com/dominikkoenitzer" property="og:see_also" />

        {/* Dublin Core */}
        <meta
          content="Dominik Könitzer — Software Engineer Portfolio"
          name="DC.title"
        />
        <meta content="Dominik Könitzer" name="DC.creator" />
        <meta
          content="Software Engineering, Web Development, React, TypeScript, Next.js"
          name="DC.subject"
        />
        <meta
          content="Portfolio of Dominik Könitzer — Software Engineer specializing in modern web development."
          name="DC.description"
        />
        <meta content="Dominik Könitzer" name="DC.publisher" />
        <meta content="Dominik Könitzer" name="DC.contributor" />
        <meta content="InteractiveResource" name="DC.type" />
        <meta content="text/html" name="DC.format" />
        <meta content="https://dominikkoenitzer.ch/" name="DC.identifier" />
        <meta content="en" name="DC.language" />
        <meta content="Switzerland" name="DC.coverage" />
        <meta content="© Dominik Könitzer" name="DC.rights" />

        {/* Site-wide JSON-LD graphs */}
        {STRUCTURED_DATA.map((data) => (
          <script
            // biome lint not in use; raw JSON-LD injection is intentional
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
            key={String(data["@id"])}
            type="application/ld+json"
          />
        ))}

        {/* Apply theme before paint (FOUC guard) */}
        {/* biome-disabled: inline bootstrap must run before hydration */}
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
        <style dangerouslySetInnerHTML={{ __html: CRITICAL_CSS }} />

        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const queryClient = new QueryClient();

// Framer-motion page transition around the routed outlet (replaces the old
// AnimatedRoutes wrapper), re-keyed on pathname so exit/enter runs per page.
function AnimatedOutlet() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        animate="animate"
        className="flex min-h-full flex-1 flex-col"
        exit="exit"
        initial="initial"
        key={location.pathname}
        transition={pageTransition}
        variants={pageTransitionVariants}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <PageLayout>
          <AnimatedOutlet />
        </PageLayout>
        <Analytics />
        <SpeedInsights />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

// Rendered into the SPA-fallback HTML at build time (ssr:false requires it).
// All real routes are prerendered, so this only flashes during hydration.
export function HydrateFallback() {
  return null;
}

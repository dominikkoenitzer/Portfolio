import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense, useCallback, useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useRouteAnnouncer } from "@/hooks/use-route-announcer";
import { useRoutePrefetch } from "@/hooks/use-route-prefetch";
import { useScrollRestoration } from "@/hooks/use-scroll-restoration";
import { useLanguage } from "@/lib/language-context";
import { ROUTE_CHUNKS } from "@/lib/route-chunks";
import { translations } from "@/lib/translations";
import { pageTransitionVariants } from "@/lib/transitions";
import Home from "@/pages/Home";

// Every route but Home is lazy, and its import specifier lives in
// lib/route-chunks so the prefetcher can warm the exact same chunk on hover.
const About = lazy(ROUTE_CHUNKS["/about"]);
const Experience = lazy(ROUTE_CHUNKS["/experience"]);
const Skills = lazy(ROUTE_CHUNKS["/skills"]);
const Projects = lazy(ROUTE_CHUNKS["/projects"]);
const ProjectDetails = lazy(ROUTE_CHUNKS["/projects/:projectSlug"]);
const Services = lazy(ROUTE_CHUNKS["/services"]);
const Contact = lazy(ROUTE_CHUNKS["/contact"]);
const Donate = lazy(ROUTE_CHUNKS["/donate"]);
const Privacy = lazy(ROUTE_CHUNKS["/privacy"]);
const NotFound = lazy(() => import("@/pages/NotFound"));

/**
 * Signals that the route's own subtree has committed. It sits inside the
 * Suspense boundary, so a lazy chunk that is still in flight keeps it
 * unmounted: with `mode="wait"` this is therefore the first moment the
 * incoming document exists and can be measured or announced.
 */
function RouteReady({
  onReady,
  path,
}: {
  onReady: (path: string) => void;
  path: string;
}) {
  useEffect(() => {
    onReady(path);
  }, [onReady, path]);
  return null;
}

export const AnimatedRoutes = () => {
  const location = useLocation();
  const { language } = useLanguage();
  const t = translations[language];

  const { onExitComplete, onRouteReady } = useScrollRestoration();
  const { announce, liveRef } = useRouteAnnouncer(location.pathname);
  // Called here rather than per link: one idle callback arms the prefetcher for
  // every link on the site.
  useRoutePrefetch();

  const handleRouteReady = useCallback(
    (path: string) => {
      onRouteReady(path);
      announce();
    },
    [announce, onRouteReady],
  );

  // One motion wrapper around the route outlet, re-keyed on the path so
  // AnimatePresence runs the exit/enter between pages. The outgoing copy keeps
  // the previous `location` because AnimatePresence holds it mounted until its
  // exit finishes.
  return (
    <>
      {/* The site's only route announcement. A client-side navigation never
          makes the browser read the new page out, so the title Helmet has just
          written is echoed here. One node for every route, outside
          AnimatePresence: a live region has to be in the DOM before its text
          changes or the change is never announced. */}
      <p aria-atomic="true" aria-live="polite" className="sr-only" ref={liveRef} />

      <AnimatePresence mode="wait" onExitComplete={onExitComplete}>
        <motion.div
          animate="animate"
          className="flex min-h-full flex-1 flex-col"
          exit="exit"
          initial="initial"
          key={location.pathname}
          variants={pageTransitionVariants}
        >
          <ErrorBoundary>
            <Suspense
              fallback={
                // A route chunk usually arrives inside a frame or two, and a
                // spinner that flashes for 80ms is noise stacked on top of the
                // page transition. The fade is held back 300ms with a both fill
                // mode, so the marker stays invisible until the wait is real
                // while the status role still announces straight away. The delay
                // sits on the wrapper because the spinner's own animation slot is
                // taken by its rotation.
                <div
                  aria-busy="true"
                  className="fade-in-0 flex min-h-[60vh] animate-in items-center justify-center duration-200 [animation-delay:300ms] fill-mode-both"
                >
                  <div
                    aria-label={t.nav.loading}
                    className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-primary"
                    role="status"
                  />
                </div>
              }
            >
              <Routes location={location}>
                <Route element={<Home />} path="/" />
                <Route element={<About />} path="/about" />
                <Route element={<Experience />} path="/experience" />
                <Route element={<Skills />} path="/skills" />
                <Route element={<Projects />} path="/projects" />
                <Route element={<ProjectDetails />} path="/projects/:projectSlug" />
                <Route element={<Services />} path="/services" />
                <Route element={<Contact />} path="/contact" />
                <Route element={<Donate />} path="/donate" />
                <Route element={<Privacy />} path="/privacy" />
                <Route element={<NotFound />} path="*" />
              </Routes>
              <RouteReady onReady={handleRouteReady} path={location.pathname} />
            </Suspense>
          </ErrorBoundary>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

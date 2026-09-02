import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { pageTransitionVariants } from "@/lib/transitions";
import Home from "@/pages/Home";

const About = lazy(() => import("@/pages/About"));
const Experience = lazy(() => import("@/pages/Experience"));
const Skills = lazy(() => import("@/pages/Skills"));
const Projects = lazy(() => import("@/pages/Projects"));
const ProjectDetails = lazy(() => import("@/pages/ProjectDetails"));
const Services = lazy(() => import("@/pages/Services"));
const Contact = lazy(() => import("@/pages/Contact"));
const Donate = lazy(() => import("@/pages/Donate"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const NotFound = lazy(() => import("@/pages/NotFound"));

export const AnimatedRoutes = () => {
  const location = useLocation();
  const lenis = useLenis();
  const { language } = useLanguage();
  const t = translations[language];

  // Reset to the top once the outgoing page has finished exiting (just before
  // the next one mounts), so navigation always lands at the top instead of
  // wherever the previous page was scrolled. Jump through Lenis (immediate, no
  // animation) so its internal scroll target stays in sync; native fallback
  // when Lenis is off.
  const handleExitComplete = () => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  };

  // One motion wrapper around the route outlet, re-keyed on the path so
  // AnimatePresence runs the exit/enter between pages. The outgoing copy keeps
  // the previous `location` because AnimatePresence holds it mounted until its
  // exit finishes.
  return (
    <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
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
              <div className="fade-in-0 flex min-h-[60vh] animate-in items-center justify-center duration-200 [animation-delay:300ms] [animation-fill-mode:both]">
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
          </Suspense>
        </ErrorBoundary>
      </motion.div>
    </AnimatePresence>
  );
};

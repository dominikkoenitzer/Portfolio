import { AnimatePresence, motion } from "framer-motion";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { pageTransition, pageTransitionVariants } from "@/lib/transitions";
import Home from "@/pages/Home";

const About = lazy(() => import("@/pages/About"));
const Skills = lazy(() => import("@/pages/Skills"));
const Projects = lazy(() => import("@/pages/Projects"));
const ProjectDetails = lazy(() => import("@/pages/ProjectDetails"));
const Services = lazy(() => import("@/pages/Services"));
const Contact = lazy(() => import("@/pages/Contact"));
const Donate = lazy(() => import("@/pages/Donate"));
const Privacy = lazy(() => import("@/pages/Privacy"));

export const AnimatedRoutes = () => {
  const location = useLocation();

  // One motion wrapper around the route outlet, re-keyed on the path so
  // AnimatePresence runs the exit/enter between pages. The outgoing copy keeps
  // the previous `location` because AnimatePresence holds it mounted until its
  // exit finishes.
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
        <Suspense fallback={null}>
          <Routes location={location}>
            <Route element={<Home />} path="/" />
            <Route element={<About />} path="/about" />
            <Route element={<Skills />} path="/skills" />
            <Route element={<Projects />} path="/projects" />
            <Route element={<ProjectDetails />} path="/projects/:projectSlug" />
            <Route element={<Services />} path="/services" />
            <Route element={<Contact />} path="/contact" />
            <Route element={<Donate />} path="/donate" />
            <Route element={<Privacy />} path="/privacy" />
            <Route element={<Navigate replace to="/" />} path="*" />
          </Routes>
        </Suspense>
      </motion.div>
    </AnimatePresence>
  );
};

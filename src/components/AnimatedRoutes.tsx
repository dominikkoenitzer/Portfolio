import { AnimatePresence, motion } from "framer-motion";
import { lazy, type ReactNode, Suspense } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Home from "@/pages/Home";
import { pageTransition, pageTransitionVariants } from "@/lib/transitions";

const About = lazy(() => import("@/pages/About"));
const Skills = lazy(() => import("@/pages/Skills"));
const Projects = lazy(() => import("@/pages/Projects"));
const ProjectDetails = lazy(() => import("@/pages/ProjectDetails"));
const Services = lazy(() => import("@/pages/Services"));
const Contact = lazy(() => import("@/pages/Contact"));
const Donate = lazy(() => import("@/pages/Donate"));
const Privacy = lazy(() => import("@/pages/Privacy"));

const PageTransition = ({ children }: { children: ReactNode }) => (
  <motion.div
    animate="animate"
    className="flex flex-1 flex-col"
    exit="exit"
    initial="initial"
    transition={pageTransition}
    variants={pageTransitionVariants}
  >
    {children}
  </motion.div>
);

export const AnimatedRoutes = () => {
  const location = useLocation();

  const withTransition = (Component: React.ComponentType) => (
    <AnimatePresence mode="wait">
      <PageTransition key={location.pathname}>
        <Suspense fallback={<div className="flex-1" />}>
          <Component />
        </Suspense>
      </PageTransition>
    </AnimatePresence>
  );

  return (
    <Routes location={location}>
      <Route element={withTransition(Home)} path="/" />
      <Route element={withTransition(About)} path="/about" />
      <Route element={withTransition(Skills)} path="/skills" />
      <Route element={withTransition(Projects)} path="/projects" />
      <Route
        element={withTransition(ProjectDetails)}
        path="/projects/:projectSlug"
      />
      <Route element={withTransition(Services)} path="/services" />
      <Route element={withTransition(Contact)} path="/contact" />
      <Route element={withTransition(Donate)} path="/donate" />
      <Route element={withTransition(Privacy)} path="/privacy" />
      <Route element={<Navigate replace to="/" />} path="*" />
    </Routes>
  );
};

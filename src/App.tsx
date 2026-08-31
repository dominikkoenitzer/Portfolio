import { Analytics } from "@vercel/analytics/react";
import { MotionConfig } from "framer-motion";
import { BrowserRouter } from "react-router-dom";
import { AnimatedRoutes } from "@/components/AnimatedRoutes";
import { PageLayout } from "@/components/layout/PageLayout";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// No data-fetching provider at the root: the only query on the site is the
// About page's GitHub calendar, which carries its own QueryClientProvider, so
// react-query loads with that route instead of with every page.
const App = () => (
  /* reducedMotion="user" makes framer-motion collapse transform/layout
     animations to instant for visitors who prefer reduced motion, while
     keeping opacity fades: one site-wide a11y default for every reveal. */
  <MotionConfig reducedMotion="user">
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <SmoothScroll>
          <PageLayout>
            <AnimatedRoutes />
          </PageLayout>
        </SmoothScroll>
      </BrowserRouter>
      <Analytics />
    </TooltipProvider>
  </MotionConfig>
);

export default App;

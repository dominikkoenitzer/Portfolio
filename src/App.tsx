import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
import { MotionConfig } from "framer-motion";
import { BrowserRouter } from "react-router-dom";
import { AnimatedRoutes } from "@/components/AnimatedRoutes";
import { PageLayout } from "@/components/layout/PageLayout";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* reducedMotion="user" makes framer-motion collapse transform/layout
        animations to instant for visitors who prefer reduced motion, while
        keeping opacity fades — one site-wide a11y default for every reveal. */}
    <MotionConfig reducedMotion="user">
      <TooltipProvider>
        <Toaster />
        <Sonner />
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
  </QueryClientProvider>
);

export default App;

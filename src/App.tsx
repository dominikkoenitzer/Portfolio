import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Analytics } from "@vercel/analytics/react";
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
  </QueryClientProvider>
);

export default App;

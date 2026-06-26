import { Component, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Route-level error boundary. Catches render errors and lazy-chunk `import()`
 * failures — the latter happen when a visitor holds a stale chunk URL after a
 * redeploy — and shows a branded recovery card instead of white-screening the
 * whole SPA. Rendered inside the per-route, pathname-keyed wrapper in
 * AnimatedRoutes, so navigating elsewhere mounts a fresh boundary and clears
 * the error without a manual reset.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Dev visibility today; the natural hook point for an error reporter later.
    console.error("Route error boundary caught:", error);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="space-y-3">
          <p className="eyebrow">Something went wrong</p>
          <h1 className="font-bold text-2xl md:text-3xl">This page hit a snag</h1>
          <p className="mx-auto max-w-md text-muted-foreground text-sm leading-relaxed">
            An unexpected error occurred while loading this view. Reloading
            usually fixes it — this can happen right after the site is updated.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={() => window.location.reload()} variant="cta">
            Reload page
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Go home</Link>
          </Button>
        </div>
      </div>
    );
  }
}

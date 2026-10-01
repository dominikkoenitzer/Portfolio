import { Component, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

interface Props {
  children: ReactNode;
  /**
   * What to render instead of the recovery card. Pass `null` for decoration:
   * a background that fails to load should disappear, not replace the page
   * with an apology.
   */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Route-level error boundary. Catches render errors and lazy-chunk `import()`
 * failures, the latter happen when a visitor holds a stale chunk URL after a
 * redeploy, and shows a branded recovery card instead of white-screening the
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

    if (this.props.fallback !== undefined) {
      return this.props.fallback;
    }

    return <RecoveryCard />;
  }
}

/**
 * The card itself, a function component so it can read the visitor's language:
 * the boundary is a class, and classes cannot call hooks. Every boundary sits
 * inside the LanguageProvider, so the copy is always loaded.
 */
function RecoveryCard() {
  const t = translations[useLanguage().language].errorBoundary;
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="space-y-3">
        <p className="eyebrow">{t.eyebrow}</p>
        <h1 className="font-bold text-2xl md:text-3xl">{t.heading}</h1>
        <p className="mx-auto max-w-md text-muted-foreground text-sm leading-relaxed">
          {t.body}
        </p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button onClick={() => window.location.reload()} variant="cta">
          {t.reload}
        </Button>
        <Button asChild variant="outline">
          <Link to="/">{t.home}</Link>
        </Button>
      </div>
    </div>
  );
}

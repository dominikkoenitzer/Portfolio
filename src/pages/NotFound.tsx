import { ArrowLeft } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

/**
 * 404 page for unmatched routes. Default-exported for React.lazy. Marked
 * noindex so crawlers don't index soft-404s, but follow so they keep crawling
 * the links back into the site.
 */
export default function NotFound() {
  return (
    <section className="section-padding flex min-h-[60vh] flex-col items-center justify-center text-center">
      <Helmet>
        <title>Page not found — Dominik Könitzer</title>
        <meta content="noindex, follow" name="robots" />
      </Helmet>
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-bold text-4xl md:text-5xl">Page not found</h1>
      <p className="mt-4 max-w-md text-muted-foreground leading-relaxed">
        The page you’re looking for doesn’t exist or may have moved.
      </p>
      <Button asChild className="group mt-8 rounded-lg px-6" variant="cta">
        <Link to="/">
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
          Back home
        </Link>
      </Button>
    </section>
  );
}

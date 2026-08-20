import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";

/**
 * 404 page for unmatched routes. Default-exported for React.lazy.
 *
 * The SEO component is what marks it noindex, rather than a bare robots meta:
 * Google reads the bot-specific `googlebot` tag ahead of the generic `robots`
 * one, so setting only the latter left the page indexable. dist/404.html says
 * the same thing statically for crawlers that never run the app.
 */
export default function NotFound() {
  return (
    <section className="section-padding flex min-h-[60vh] flex-col items-center justify-center text-center">
      <SEO
        description="This page does not exist."
        noindex
        title="Page not found"
      />
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

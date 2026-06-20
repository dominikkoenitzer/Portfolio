import { startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { HydratedRouter } from "react-router/dom";

// Hydrate the prerendered document. HelmetProvider mirrors the server wrapper
// in entry.server so react-helmet-async takes over the head after hydration.
startTransition(() => {
  hydrateRoot(
    document,
    <HelmetProvider>
      <HydratedRouter />
    </HelmetProvider>
  );
});

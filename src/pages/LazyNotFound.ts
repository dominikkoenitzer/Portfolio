import { lazy } from "react";

/** The 404 page as one lazy component, shared by the `*` route and a project slug with no project. */
export const NotFound = lazy(() => import("@/pages/NotFound"));

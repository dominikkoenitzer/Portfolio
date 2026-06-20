import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("pages/Home.tsx"),
  route("about", "pages/About.tsx"),
  route("skills", "pages/Skills.tsx"),
  route("projects", "pages/Projects.tsx"),
  route("projects/:projectSlug", "pages/ProjectDetails.tsx"),
  route("services", "pages/Services.tsx"),
  route("contact", "pages/Contact.tsx"),
  route("donate", "pages/Donate.tsx"),
  route("privacy", "pages/Privacy.tsx"),
  // Unknown paths fall back to the home route (mirrors the old <Navigate to="/">).
  route("*", "pages/CatchAll.tsx"),
] satisfies RouteConfig;

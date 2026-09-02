import type { Language } from "@/config/languages";
// Module path, not the seo-data barrel: that barrel also re-exports the
// project schemas, which have nothing to do with the search index.
import {
  getServicesFaqs,
  getServicesHowTo,
} from "@/config/seo-data/services";
import { NAV_LINKS } from "@/constants";
import { getProjects } from "@/constants/projects";
import { SKILL_CATEGORIES } from "@/constants/skills";
import { getTimeline } from "@/constants/timeline";
import { primeSearchRecords, type SearchRecord } from "@/lib/search";
import type { Translation } from "@/lib/translations";

/**
 * Everything searchable, in the visitor's language, built out of the copy the
 * pages already render. Nothing here is a second hand-written copy of a title
 * or a description: if a project is renamed or a service reworded, the search
 * follows on the next build.
 *
 * This module is only ever reached through the lazily imported dialog, so the
 * project catalogue, the timeline and the FAQ copy it pulls in stay off the
 * entry chunk and are fetched the first time the search is opened.
 */

/**
 * The eight route keys, as the type system sees them: the nav labels and the
 * SEO copy are keyed by the same words, and only the routes appear in both.
 */
type PageKey = keyof Translation["nav"] & keyof Translation["seo"];

/**
 * A route's copy key is its path without the slash ("/about" → `nav.about` +
 * `seo.about`), so it is derived rather than mapped. `NAV_KEY_BY_PATH` already
 * exists twice (Navbar and Footer) and a third copy here would be a third
 * thing to remember on a rename; the guard means a path that ever stops
 * matching its key drops out of the index instead of crashing the dialog.
 */
function pageKey(t: Translation, path: string): PageKey | null {
  const key = (path === "/" ? "home" : path.slice(1)) as PageKey;
  return key in t.nav && key in t.seo ? key : null;
}

/**
 * Words a page renders that its nav label and SEO line leave out. Both of
 * these are visible copy, not invented handles: /contact renders the intent
 * picker ("a role", "a freelance project"), and /services renders the two
 * section headings. Without them "job", "role" and "faq" found nothing.
 */
function extraKeywords(
  t: Translation,
  path: string,
): { keywords: string[]; body: string[] } {
  if (path === "/contact") {
    const intents = Object.values(t.contact.intents);
    return {
      keywords: intents.flatMap((intent) => [intent.label, intent.subject]),
      body: intents.map((intent) => intent.body),
    };
  }
  if (path === "/services") {
    // "faq" is a handle: the section is headed "Questions" in every language
    // and nobody types that.
    return {
      keywords: [t.services.processTitle, t.services.faqTitle, "faq"],
      body: [],
    };
  }
  return { keywords: [], body: [] };
}

/**
 * One index per language, kept for the life of the page. The palette is
 * re-created on every opening (so it always starts on an empty query), and
 * rebuilding 90-odd records with it would put that work on the frame the panel
 * arrives on. Copy is static once a language module is loaded, so a cache hit
 * is always correct.
 */
const CACHE = new Map<Language, SearchRecord[]>();

export function buildSearchIndex(
  language: Language,
  t: Translation,
): SearchRecord[] {
  const cached = CACHE.get(language);
  if (cached) return cached;
  const records = collect(language, t);
  // Normalized here, not on the first keystroke: the cost of the whole index
  // belongs to the build, not to a character of typing.
  primeSearchRecords(records);
  CACHE.set(language, records);
  return records;
}

function collect(language: Language, t: Translation): SearchRecord[] {
  const records: SearchRecord[] = [];

  // Routes. The SEO title joins the keywords because it names the thing the
  // page is about ("Experience & Education", "…in Zürich") in words the nav
  // label leaves out; the SEO keyword list stays out, because it is written
  // for crawlers and would make every page match every technology.
  //
  // The path joins them too. A visitor who half-remembers a URL types what was
  // in it, and the localized label will not help them: "donate" found nothing
  // in any of the four languages, because the page is called Tip Jar, Trinkgeld,
  // Cagnotte and 打赏 and the word only ever appears in `/donate`.
  for (const link of NAV_LINKS) {
    const key = pageKey(t, link.targetId);
    if (!key) continue;
    const extra = extraKeywords(t, link.targetId);
    records.push({
      id: `page:${link.targetId}`,
      kind: "page",
      title: t.nav[key],
      context: t.seo[key].description,
      href: link.targetId,
      keywords: [t.seo[key].title, link.targetId.slice(1), ...extra.keywords],
      body: extra.body,
    });
  }

  // The privacy policy is a real page with real copy, linked from the footer
  // and the drawer, and it had no record at all: "privacy" answered with a
  // project, and "datenschutz", "confidentialité" and "隐私" answered with
  // nothing. It is not in NAV_LINKS, and its nav key ("privacyPolicy") does not
  // match its SEO key ("privacy"), so the derived-key loop above cannot reach
  // it. The id deliberately omits the slash, so it stays out of the suggestion
  // list, which is the nav and only the nav.
  records.push({
    id: "page:privacy",
    kind: "page",
    title: t.nav.privacyPolicy,
    context: t.seo.privacy.description,
    href: "/privacy",
    keywords: [t.seo.privacy.title, "privacy"],
  });

  // The CV, which is a button on /about rather than a route of its own. A
  // recruiter's first query is "cv" or "resume", and without this record both
  // returned nothing; the synonym group in `lib/search` carries the rest of
  // the words, so one Latin keyword is enough for all four languages.
  records.push({
    id: "page:cv",
    kind: "page",
    title: t.about.viewCv,
    context: t.about.cards.educationSubtitle,
    href: "/about",
    keywords: ["CV"],
  });

  for (const project of getProjects(language)) {
    records.push({
      id: `project:${project.slug}`,
      kind: "project",
      title: project.title,
      context: project.tagline,
      href: `/projects/${project.slug}`,
      // The slug is searchable too: it is what the URL says, so someone who
      // half-remembers a link still lands on the project.
      keywords: [...project.tags, project.year, project.slug],
      body: [project.description],
    });
  }

  for (const [key, item] of Object.entries(t.services.items)) {
    records.push({
      id: `service:${key}`,
      kind: "service",
      title: item.title,
      context: item.description,
      href: "/services",
      keywords: item.features,
    });
  }

  // How it works: the five process steps rendered on /services. They are the
  // answer to "process", "how long", "budget" and "hire", none of which the
  // service cards say. The schema name ("How to Hire ...") is searchable as
  // body text while the visible heading stays the row title.
  const howTo = getServicesHowTo(language);
  records.push({
    id: "service:process",
    kind: "service",
    title: t.services.processTitle,
    context: howTo.description,
    href: "/services",
    // "process" is a search handle rather than copy, like the CV record's one
    // Latin keyword: the section is called "How it works" in all four
    // languages and never uses the word anybody would type to find it. The
    // synonym group carries Prozess, Ablauf, processus and 流程 from here.
    keywords: ["process", ...howTo.step.map((step) => step.name)],
    body: [howTo.name, ...howTo.step.map((step) => step.text)],
  });

  for (const category of SKILL_CATEGORIES) {
    const label = t.skills.categories[category.key];
    for (const name of category.skills) {
      records.push({
        id: `skill:${name}`,
        kind: "skill",
        title: name,
        context: label,
        href: "/skills",
      });
    }
  }

  // Spoken languages sit in their own card on /skills. The keys come from the
  // copy itself, so this list cannot drift out of step with the page.
  for (const [key, name] of Object.entries(t.skills.langNames)) {
    records.push({
      id: `skill:language-${key}`,
      kind: "skill",
      title: name,
      context: t.skills.categories.languages,
      href: "/skills",
    });
  }

  const timeline = getTimeline(language);
  for (const entry of [...timeline.experience, ...timeline.education]) {
    records.push({
      id: `experience:${entry.organization}-${entry.start}`,
      kind: "experience",
      title: entry.role,
      context: `${entry.organization} · ${entry.period}`,
      href: "/experience",
      keywords: [...entry.tags, entry.location, entry.organization],
      body: entry.points,
    });
  }

  // The FAQ copy lives with the schema that describes it, and /services is the
  // one page allowed to render it, so that is where a question links.
  for (const [index, faq] of getServicesFaqs(language).entries()) {
    records.push({
      id: `faq:${index}`,
      kind: "faq",
      title: faq.question,
      context: faq.answer,
      href: "/services",
    });
  }

  return records;
}

/**
 * The empty-state list: the nav routes, in nav order. Keyed on the id rather
 * than the kind, because the CV shares the `page` kind without being a route.
 */
export const suggestedRecords = (records: readonly SearchRecord[]) =>
  records.filter((record) => record.id.startsWith("page:/"));

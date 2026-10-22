import type { Story } from "./types";

/**
 * Each project's story is its own chunk, and only the visited one downloads.
 * The route's loader starts that download together with the page's own code
 * (see `lib/route-chunks.ts`), so the story is usually in memory before the
 * page can render and arrives with the title instead of after it.
 */
const STORIES = import.meta.glob<{ story: Story }>("./stories/*.ts");

const done = new Map<string, Story | null>();
const pending = new Map<string, Promise<Story | null>>();

/** Whether a project has a story at all. */
export const hasStory = (slug: string): boolean => Boolean(STORIES[`./stories/${slug}.ts`]);

/** Starts (or joins) the download of a project's story. */
export function loadStory(slug: string): Promise<Story | null> {
  const load = STORIES[`./stories/${slug}.ts`];
  if (!load) return Promise.resolve(null);
  let job = pending.get(slug);
  if (!job) {
    job = load().then(
      (module) => {
        done.set(slug, module.story);
        return module.story;
      },
      () => {
        done.set(slug, null);
        return null;
      },
    );
    pending.set(slug, job);
  }
  return job;
}

/** The story if it has already arrived, without waiting: undefined while it has not. */
export const storyNow = (slug: string): Story | null | undefined => (done.has(slug) ? done.get(slug) : undefined);

/** Starts the story for a /projects/<slug> path, so it downloads beside the page's code. */
export function prefetchStoryFor(path: string): void {
  const slug = /^\/projects\/([^/?#]+)/.exec(path)?.[1];
  if (slug) void loadStory(slug);
}

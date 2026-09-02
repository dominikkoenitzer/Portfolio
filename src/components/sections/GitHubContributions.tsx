import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { motion, useReducedMotion } from "framer-motion";
import { GitCommit } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SITE_CONFIG } from "@/constants";
import { revealOnScroll, revealStagger } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { DATE_FNS_LOCALE, LOCALE_TAG } from "@/lib/locale";
import { REVEAL, stagger } from "@/lib/motion";
import { translations } from "@/lib/translations";

interface ContributionDay {
  color: string;
  contributionCount: number;
  date: string;
  weekday: number;
}

interface Week {
  contributionDays: ContributionDay[];
}

interface RecentCommit {
  message: string;
  date: string;
  url: string;
  sha: string;
  repository: string;
}

interface GitHubData {
  total: number;
  weeks: Week[];
  recentCommits: RecentCommit[];
}

// Heatmap scale: a neutral empty cell that blends into the card, then a ramp of
// the page's violet instead of the fixed GitHub greens, which read as pasted in.
const GITHUB_COLORS = {
  "0": "hsl(var(--foreground) / 0.08)",
  "1": "hsl(var(--primary) / 0.3)",
  "2": "hsl(var(--primary) / 0.5)",
  "3": "hsl(var(--primary) / 0.72)",
  "4": "hsl(var(--primary))",
};

class ContributionsError extends Error {
  constructor(readonly status: number) {
    super(`GitHub contributions request failed with ${status}`);
  }
}

// Answers the endpoint gives when nothing will change on a retry: a bad
// username, a missing or revoked server token, an unknown user.
const PERMANENT_FAILURES = new Set([400, 401, 403, 404, 500]);

const fetchGitHubData = async (username: string): Promise<GitHubData> => {
  const response = await fetch(
    `/api/github-contributions?username=${username}`,
  );
  if (!response.ok) {
    throw new ContributionsError(response.status);
  }
  return response.json();
};

// The calendar is the only consumer of react-query on the site, so the client
// lives here rather than at the app root; that keeps the library out of the
// entry chunk and loads it with the About route.
const queryClient = new QueryClient();

export function GitHubContributions() {
  return (
    <QueryClientProvider client={queryClient}>
      <ContributionsCalendar />
    </QueryClientProvider>
  );
}

function ContributionsCalendar() {
  const { language } = useLanguage();
  const t = translations[language].github;
  const localeTag = LOCALE_TAG[language];
  const dfLocale = DATE_FNS_LOCALE[language];
  const username = SITE_CONFIG.github.split("/").pop() || "dominikkoenitzer";
  const reduceMotion = useReducedMotion();

  // The ~365-cell calendar wraps every cell in a Radix Tooltip + motion node.
  // That's fine to mount on desktop but blocks the first scroll on a phone,
  // and touch devices can't hover, so those tooltips never show anyway. Resolve
  // the pointer type synchronously (lazy initial state) so the grid's very first
  // render on mobile already uses the cheap path, never the heavy one.
  const [isCoarsePointer] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches,
  );

  const { data, isLoading, error } = useQuery<GitHubData>({
    queryKey: ["github-contributions", username],
    queryFn: () => fetchGitHubData(username),
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: (failureCount, err) =>
      failureCount < 2 &&
      !(err instanceof ContributionsError && PERMANENT_FAILURES.has(err.status)),
  });

  // Use weeks directly from API (each week is a column)
  const weeks = data?.weeks || [];

  // Get month labels for the top row (localized to the active language)
  const monthLabels: { index: number; label: string }[] = [];
  let lastMonth = -1;

  weeks.forEach((week, weekIndex) => {
    if (week.contributionDays.length > 0) {
      const firstDay = new Date(week.contributionDays[0].date);
      const month = firstDay.getMonth();

      // Show label at the start of each month
      if (month !== lastMonth) {
        monthLabels.push({
          index: weekIndex,
          label: firstDay.toLocaleDateString(localeTag, { month: "short" }),
        });
        lastMonth = month;
      }
    }
  });

  const getColorIntensity = (count: number): string => {
    if (count === 0) return GITHUB_COLORS["0"];
    if (count <= 3) return GITHUB_COLORS["1"];
    if (count <= 6) return GITHUB_COLORS["2"];
    if (count <= 9) return GITHUB_COLORS["3"];
    return GITHUB_COLORS["4"];
  };

  // The calendar is a nice-to-have under the bio, and the endpoint does fail
  // (the server token has been revoked once already). Waiting and failing both
  // render nothing: a card sized to a calendar that never arrives is a few
  // hundred pixels of empty page above the footer, which is worse than no
  // widget at all. The card carries its own top margin, so the section closes
  // cleanly at the bio either way.
  if (isLoading || error || !data) return null;

  // The loaded card is a sequence: the panel, its count, then the calendar. The
  // commits block below keeps a trigger of its own, since it sits far enough
  // down the card to still be under the fold when the card arrives.
  return (
    <motion.div
      className="mt-12 w-full rounded-2xl border border-border/60 bg-card p-3 sm:p-4 md:mt-16 md:p-6"
      {...revealOnScroll(reduceMotion, revealStagger())}
    >
      <motion.div className="mb-3 sm:mb-4" variants={REVEAL}>
        <h2 className="mb-0.5 font-semibold text-foreground text-sm sm:text-base md:text-lg">
          {data?.total?.toLocaleString() || 0} {t.contributionsSuffix}
        </h2>
        <p className="text-muted-foreground text-xs sm:text-sm">
          {t.activityNote}
        </p>
      </motion.div>

      {/* Contribution Calendar Grid */}
      <motion.div className="mb-4 w-full sm:mb-6" variants={REVEAL}>
        <TooltipProvider delayDuration={200}>
          <div className="w-full">
            {/* Month labels: one grid track per week, sharing the grid's columns */}
            <div
              className="mb-1 grid gap-[2px]"
              style={{
                gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
              }}
            >
              {weeks.map((_week, weekIndex) => {
                const monthLabel = monthLabels.find(
                  (m) => m.index === weekIndex,
                );
                return (
                  <span
                    className="overflow-visible whitespace-nowrap font-medium text-[8px] text-muted-foreground leading-none sm:text-[10px]"
                    key={weekIndex}
                  >
                    {monthLabel?.label ?? ""}
                  </span>
                );
              })}
            </div>

            {/* Heatmap: 53 equal columns fill the width with square cells, so it
                never overflows or hijacks vertical scroll on touch. */}
            <div
              className="grid gap-[2px]"
              style={{
                gridTemplateColumns: `repeat(${weeks.length}, minmax(0, 1fr))`,
              }}
            >
              {weeks.map((week, weekIndex) => {
                // Place each day at its weekday row so partial first/last weeks
                // stay aligned and every column keeps the same height.
                const slots: (ContributionDay | null)[] = Array(7).fill(null);
                for (const day of week.contributionDays) {
                  slots[day.weekday] = day;
                }
                return (
                  <div className="grid gap-[2px]" key={weekIndex}>
                    {slots.map((day, dayIndex) => {
                      if (!day) {
                        return (
                          <div
                            className="aspect-square w-full"
                            key={dayIndex}
                          />
                        );
                      }
                      const color = getColorIntensity(day.contributionCount);
                      const countLabel =
                        day.contributionCount === 1
                          ? t.contribution
                          : t.contributions;

                      // Touch: plain square + native title (no Radix/motion node).
                      if (isCoarsePointer) {
                        return (
                          <div
                            className="aspect-square w-full rounded-[2px]"
                            key={dayIndex}
                            style={{ backgroundColor: color }}
                            title={`${day.contributionCount} ${countLabel} · ${day.date}`}
                          />
                        );
                      }

                      const formattedDate = new Date(
                        day.date,
                      ).toLocaleDateString(localeTag, {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      });

                      return (
                        <Tooltip key={dayIndex}>
                          <TooltipTrigger asChild>
                            <div
                              className="aspect-square w-full cursor-pointer rounded-[2px] border border-transparent transition-colors duration-200 ease-out hover:border-primary/50"
                              style={{ backgroundColor: color }}
                            />
                          </TooltipTrigger>
                          <TooltipContent
                            className="px-3 py-2 text-xs"
                            side="top"
                            sideOffset={8}
                          >
                            <div className="font-semibold text-foreground">
                              {day.contributionCount} {countLabel}
                            </div>
                            <div className="mt-0.5 text-muted-foreground">
                              {formattedDate}
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </TooltipProvider>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-center gap-2 border-border/20 border-t pt-3 sm:mt-4 sm:justify-start">
          <span className="font-medium text-muted-foreground text-xs">
            {t.less}
          </span>
          <div className="flex gap-[2px]">
            {Object.values(GITHUB_COLORS).map((color, index) => (
              <div
                className="h-2.5 w-2.5 flex-none rounded-sm border border-border/20 sm:h-3 sm:w-3"
                key={index}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
          <span className="font-medium text-muted-foreground text-xs">
            {t.more}
          </span>
        </div>
      </motion.div>

      {/* Recent Commits */}
      {data?.recentCommits && data.recentCommits.length > 0 && (
        // The block is one sequence: its heading, then the commits down the
        // list. The plain list wrapper is transparent to the cascade, so the
        // rows are still this parent's children.
        <motion.div
          className="mt-4 border-border/20 border-t pt-4 sm:mt-6 sm:pt-6"
          {...revealOnScroll(reduceMotion, stagger(0.04, 0.045))}
        >
          <motion.div
            className="mb-2 flex items-center gap-2 sm:mb-3"
            variants={REVEAL}
          >
            <GitCommit className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            <h3 className="font-semibold text-foreground text-sm sm:text-base">
              {t.recentActivity}
            </h3>
          </motion.div>
          <div className="space-y-1 sm:space-y-1.5">
            {data.recentCommits.map((commit) => (
              <motion.a
                className="group block rounded-lg border border-transparent px-2 py-1.5 transition-colors duration-200 ease-out hover:border-border/30 hover:bg-muted/60 active:bg-muted/80 sm:px-3 sm:py-2"
                href={commit.url}
                key={commit.sha}
                rel="noopener noreferrer"
                target="_blank"
                variants={REVEAL}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 font-medium text-foreground text-xs transition-colors duration-200 ease-out group-hover:text-primary sm:text-sm">
                      {commit.message.split("\n")[0]}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span className="rounded bg-muted/50 px-1.5 py-0.5 text-[10px] text-muted-foreground sm:text-xs">
                        {commit.repository}
                      </span>
                      <span className="text-[10px] text-muted-foreground sm:text-xs">
                        ·
                      </span>
                      <span className="text-[10px] text-muted-foreground sm:text-xs">
                        {formatDistanceToNow(new Date(commit.date), {
                          addSuffix: true,
                          locale: dfLocale,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

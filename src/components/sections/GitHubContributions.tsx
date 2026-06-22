import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { AlertCircle, GitCommit, Loader2 } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SITE_CONFIG } from "@/constants";
import { fadeInUp } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-provider";
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

const GITHUB_COLORS = {
  "0": "#ebedf0",
  "1": "#9be9a8",
  "2": "#40c463",
  "3": "#30a14e",
  "4": "#216e39",
};

const fetchGitHubData = async (username: string): Promise<GitHubData> => {
  const response = await fetch(
    `/api/github-contributions?username=${username}`,
  );
  if (!response.ok) {
    throw new Error("Failed to fetch GitHub contributions");
  }
  return response.json();
};

export function GitHubContributions() {
  const { language } = useLanguage();
  const t = translations[language].github;
  const username = SITE_CONFIG.github.split("/").pop() || "dominikkoenitzer";

  // The ~365-cell calendar wraps every cell in a Radix Tooltip + motion node.
  // That's fine to mount on desktop but blocks the first scroll on a phone —
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
    retry: 2,
  });

  // Use weeks directly from API (each week is a column)
  const weeks = data?.weeks || [];

  // Get month labels for the top row
  const monthLabels: { index: number; label: string }[] = [];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  let lastMonth = -1;

  weeks.forEach((week, weekIndex) => {
    if (week.contributionDays.length > 0) {
      const firstDay = new Date(week.contributionDays[0].date);
      const month = firstDay.getMonth();

      // Show label at the start of each month
      if (month !== lastMonth) {
        monthLabels.push({ index: weekIndex, label: monthNames[month] });
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

  if (isLoading) {
    return (
      <motion.div
        className="glass-card rounded-2xl p-6 sm:p-8"
        {...fadeInUp}
      >
        {/* Reserve ~the loaded height so the calendar/commits popping in after
            the API resolves doesn't shove the page (layout shift / jank). */}
        <div className="flex min-h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="glass-card rounded-2xl p-6 sm:p-8"
        {...fadeInUp}
      >
        <div className="flex items-center gap-3 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">{t.loadError}</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="glass-card w-full rounded-2xl p-3 sm:p-4 md:p-6"
      {...fadeInUp}
    >
      <div className="mb-3 sm:mb-4">
        <h3 className="mb-0.5 font-semibold text-foreground text-sm sm:text-base md:text-lg">
          {data?.total?.toLocaleString() || 0} {t.contributionsSuffix}
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm">
          {t.activityNote}
        </p>
      </div>

      {/* Contribution Calendar Grid */}
      <div className="mb-4 w-full sm:mb-6">
        <TooltipProvider delayDuration={200}>
          <div className="w-full">
            {/* Month labels — one grid track per week, sharing the grid's columns */}
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

            {/* Heatmap — 53 equal columns fill the width with square cells, so it
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
                      ).toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      });

                      return (
                        <Tooltip key={dayIndex}>
                          <TooltipTrigger asChild>
                            <motion.div
                              className="aspect-square w-full cursor-pointer rounded-[2px] border border-transparent transition-colors duration-200 hover:border-border/60"
                              style={{ backgroundColor: color }}
                              whileHover={{ scale: 1.35, zIndex: 10 }}
                            />
                          </TooltipTrigger>
                          <TooltipContent
                            className="border border-border/50 bg-popover/95 px-3 py-2 text-xs shadow-xl backdrop-blur-sm"
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
          <div className="flex" style={{ gap: "2px" }}>
            {Object.values(GITHUB_COLORS).map((color, index) => (
              <div
                className="rounded-sm border border-border/20"
                key={index}
                style={{
                  backgroundColor: color,
                  width: "clamp(10px, 1.3vw, 14px)",
                  height: "clamp(10px, 1.3vw, 14px)",
                  minWidth: "clamp(10px, 1.3vw, 14px)",
                  minHeight: "clamp(10px, 1.3vw, 14px)",
                }}
              />
            ))}
          </div>
          <span className="font-medium text-muted-foreground text-xs">
            {t.more}
          </span>
        </div>
      </div>

      {/* Recent Commits */}
      {data?.recentCommits && data.recentCommits.length > 0 && (
        <div className="mt-4 border-border/20 border-t pt-4 sm:mt-6 sm:pt-6">
          <div className="mb-2 flex items-center gap-2 sm:mb-3">
            <GitCommit className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            <h4 className="font-semibold text-foreground text-sm sm:text-base">
              {t.recentActivity}
            </h4>
          </div>
          <div className="space-y-1 sm:space-y-1.5">
            {data.recentCommits.map((commit, index) => (
              <motion.a
                className="group block rounded-lg border border-transparent px-2 py-1.5 transition-all duration-200 hover:border-border/30 hover:bg-muted/60 active:bg-muted/80 sm:px-3 sm:py-2"
                href={commit.url}
                initial={{ opacity: 0, y: 10 }}
                key={commit.sha}
                rel="noopener noreferrer"
                target="_blank"
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
                whileInView={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 font-medium text-foreground text-xs transition-colors group-hover:text-primary sm:text-sm">
                      {commit.message.split("\n")[0]}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <span className="rounded bg-muted/50 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:text-xs">
                        {commit.repository}
                      </span>
                      <span className="text-[10px] text-muted-foreground sm:text-xs">
                        ·
                      </span>
                      <span className="text-[10px] text-muted-foreground sm:text-xs">
                        {formatDistanceToNow(new Date(commit.date), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { AlertCircle, GitCommit, Loader2 } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { SITE_CONFIG } from "@/constants";
import { fadeInUp } from "@/lib/framer-animations";

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
    `/api/github-contributions?username=${username}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch GitHub contributions");
  }
  return response.json();
};

export default function GitHubContributions() {
  const username = SITE_CONFIG.github.split("/").pop() || "dominikkoenitzer";

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
        className="glass-card rounded-2xl border border-border/20 p-6 shadow-sm backdrop-blur-sm sm:p-8"
        {...fadeInUp}
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="glass-card rounded-2xl border border-border/20 p-6 shadow-sm backdrop-blur-sm sm:p-8"
        {...fadeInUp}
      >
        <div className="flex items-center gap-3 text-destructive">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">Failed to load GitHub contributions</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="glass-card w-full rounded-2xl border border-border/20 p-3 shadow-sm backdrop-blur-sm sm:p-4 md:p-6"
      {...fadeInUp}
    >
      <div className="mb-3 sm:mb-4">
        <h3 className="mb-0.5 font-semibold text-foreground text-sm sm:text-base md:text-lg">
          {data?.total?.toLocaleString() || 0} contributions in the last year
        </h3>
        <p className="text-muted-foreground text-xs sm:text-sm">
          GitHub activity over the past 12 months
        </p>
      </div>

      {/* Contribution Calendar Grid */}
      <div className="mb-4 w-full sm:mb-6">
        <TooltipProvider delayDuration={200}>
          <div className="w-full overflow-x-auto">
            <div
              className="w-full"
              style={
                {
                  "--cell-size": "clamp(10px, calc((100vw - 4rem) / 60), 14px)",
                } as React.CSSProperties
              }
            >
              {/* Month labels row */}
              <div
                className="mb-1.5 flex w-full"
                style={{
                  gap: "2px",
                  paddingLeft: "clamp(20px, 2.5vw, 30px)",
                }}
              >
                {weeks.map((week, weekIndex) => {
                  const monthLabel = monthLabels.find(
                    (m) => m.index === weekIndex
                  );
                  return (
                    <div
                      className="flex items-start"
                      key={weekIndex}
                      style={{
                        width: "var(--cell-size)",
                        minWidth: "var(--cell-size)",
                        flexShrink: 0,
                      }}
                    >
                      {monthLabel && (
                        <span
                          className="whitespace-nowrap font-medium text-muted-foreground leading-none"
                          style={{ fontSize: "clamp(9px, 1vw, 11px)" }}
                        >
                          {monthLabel.label}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Calendar grid */}
              <div className="flex w-full" style={{ gap: "2px" }}>
                {/* Day labels (Sun-Sat) */}
                <div
                  className="mr-1.5 flex flex-shrink-0 flex-col"
                  style={{ gap: "2px", width: "clamp(20px, 2.5vw, 30px)" }}
                >
                  {["", "M", "", "W", "", "F", ""].map((day, index) => (
                    <div
                      className="flex items-center justify-end pr-1"
                      key={index}
                      style={{
                        height: "var(--cell-size)",
                        minHeight: "var(--cell-size)",
                      }}
                    >
                      {day && (
                        <span
                          className="font-medium text-muted-foreground leading-none"
                          style={{ fontSize: "clamp(9px, 1vw, 11px)" }}
                        >
                          {day}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Calendar cells - weeks as columns */}
                <div className="flex" style={{ gap: "2px" }}>
                  {weeks.map((week, weekIndex) => (
                    <div
                      className="flex flex-col"
                      key={weekIndex}
                      style={{ gap: "2px" }}
                    >
                      {week.contributionDays.map((day, dayIndex) => {
                        const color = getColorIntensity(day.contributionCount);
                        const date = new Date(day.date);
                        const formattedDate = date.toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        });

                        return (
                          <Tooltip key={`${weekIndex}-${dayIndex}`}>
                            <TooltipTrigger asChild>
                              <motion.div
                                className="cursor-pointer rounded-sm border border-transparent transition-all duration-200 hover:border-border/60"
                                style={{
                                  backgroundColor: color,
                                  width: "var(--cell-size)",
                                  height: "var(--cell-size)",
                                  minWidth: "var(--cell-size)",
                                  minHeight: "var(--cell-size)",
                                  flexShrink: 0,
                                }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                whileHover={{ scale: 1.15, zIndex: 10 }}
                                whileTap={{ scale: 1.05 }}
                              />
                            </TooltipTrigger>
                            <TooltipContent
                              className="border border-border/50 bg-popover/95 px-3 py-2 text-xs shadow-xl backdrop-blur-sm"
                              side="top"
                              sideOffset={8}
                            >
                              <div className="font-semibold text-foreground">
                                {day.contributionCount}{" "}
                                {day.contributionCount === 1
                                  ? "contribution"
                                  : "contributions"}
                              </div>
                              <div className="mt-0.5 text-muted-foreground">
                                {formattedDate}
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TooltipProvider>

        {/* Legend */}
        <div className="mt-3 flex items-center justify-center gap-2 border-border/20 border-t pt-3 sm:mt-4 sm:justify-start">
          <span className="font-medium text-muted-foreground text-xs">
            Less
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
            More
          </span>
        </div>
      </div>

      {/* Recent Commits */}
      {data?.recentCommits && data.recentCommits.length > 0 && (
        <div className="mt-4 border-border/20 border-t pt-4 sm:mt-6 sm:pt-6">
          <div className="mb-2 flex items-center gap-2 sm:mb-3">
            <GitCommit className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            <h4 className="font-semibold text-foreground text-sm sm:text-base">
              Recent activity
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

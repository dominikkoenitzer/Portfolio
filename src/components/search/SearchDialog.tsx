import { AnimatePresence, motion } from "framer-motion";
import Lenis from "lenis";
import {
  Briefcase,
  CircleHelp,
  FileText,
  FolderGit2,
  Layers,
  Search,
  Wrench,
} from "lucide-react";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import { setCursorMagnetRect } from "@/lib/cursor-magnet";
import { useLanguage } from "@/lib/language-context";
import { DUR, EASE_OUT } from "@/lib/motion";
import { prefersReducedMotion } from "@/lib/prefers-reduced-motion";
import {
  groupHits,
  type SearchHit,
  type SearchKind,
  type SearchRecord,
  searchRecords,
} from "@/lib/search";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { buildSearchIndex, suggestedRecords } from "./search-index";

/**
 * The site search panel: a command palette over the index in `search-index.ts`,
 * built to the shape of shadcn's command dialog (a borderless field on a
 * hairline row, grouped rows under a muted heading, a key-hint footer, and
 * nothing else: no clear button, no close button, because Escape and the
 * backdrop already do that job).
 *
 * Default-exported and `React.lazy`-loaded from the Navbar, because everything
 * it reaches (the project catalogue, the timeline, the FAQ copy) would
 * otherwise land in the entry chunk that every visitor downloads, search or no
 * search.
 */
interface SearchDialogProps {
  open: boolean;
  onClose: () => void;
  /**
   * What had focus when the search was asked for, captured by the Navbar at
   * click time. It cannot be read here: the drawer restores focus to the
   * hamburger as it closes, and that cleanup runs before this component's
   * effects, so by then the button the visitor actually pressed is gone.
   */
  returnFocusTo?: RefObject<HTMLElement | null>;
}

/**
 * One arrival and one departure, both transform and opacity only so neither
 * can trigger layout. The panel comes in on the slower of the two durations
 * because it has to read as arriving; it leaves on the faster one, because a
 * dismissal that lingers feels like lag. No spring: a bounce here would be the
 * kind of decoration this design has spent a pass removing.
 */
const PANEL_IN = { duration: DUR.base, ease: EASE_OUT } as const;
const PANEL_OUT = { duration: DUR.fast, ease: EASE_OUT } as const;
const WASH = { duration: DUR.fast, ease: EASE_OUT } as const;

/** Breathing room kept between the highlighted row and the list's edges. */
const ROW_MARGIN = 12;

/** One glyph per kind, so a row says what it is before it is read. */
const KIND_ICON: Record<SearchKind, ReactNode> = {
  page: <FileText aria-hidden className="size-4 shrink-0 opacity-60" />,
  project: <FolderGit2 aria-hidden className="size-4 shrink-0 opacity-60" />,
  service: <Wrench aria-hidden className="size-4 shrink-0 opacity-60" />,
  skill: <Layers aria-hidden className="size-4 shrink-0 opacity-60" />,
  experience: <Briefcase aria-hidden className="size-4 shrink-0 opacity-60" />,
  faq: <CircleHelp aria-hidden className="size-4 shrink-0 opacity-60" />,
};

/** The footer's key caps, in the same style as the trigger's shortcut chip. */
function Key({ children }: { children: ReactNode }) {
  return (
    <kbd className="rounded border border-border/60 bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
      {children}
    </kbd>
  );
}

export default function SearchDialog({
  onClose,
  open,
  returnFocusTo,
}: SearchDialogProps) {
  const { language } = useLanguage();
  const t = translations[language];
  const copy = t.search;
  const navigate = useNavigate();
  const reduceMotion = prefersReducedMotion();

  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  /** Set when the panel closes because a result was opened. */
  const selected = useRef(false);
  const baseId = useId();
  const listId = `${baseId}-results`;
  /**
   * The option id follows the record, not its position: the DOM node is reused
   * across keystrokes (it is keyed by record) while its index shifts, and an
   * id that shifted with the index left `aria-activedescendant` pointing at a
   * different row than the one highlighted. Record ids carry spaces and
   * brackets ("skill:JavaScript (ES6+)"), which an id attribute may not.
   */
  const optionId = (record: SearchRecord) =>
    `${baseId}-option-${record.id.replace(/[^\w-]+/g, "_")}`;

  // Built and normalized once per language, and cached in the index module, so
  // reopening the palette costs nothing and no keystroke pays for the index.
  const index = useMemo(() => buildSearchIndex(language, t), [language, t]);

  const trimmed = query.trim();
  // Keyed on the trimmed query, so the results keep their identity while the
  // query stands still and the rows below are never asked to re-render.
  // Ranked, then deduped by destination, then capped: three rows that all open
  // /services are one destination as far as the visitor is concerned, and a
  // one-letter query matches most of the 48 skill chips, which would bury
  // everything else under a wall of them.
  const ranked = useMemo(
    () => (trimmed ? searchRecords(index, trimmed) : []),
    [index, trimmed],
  );
  const unique = useMemo(() => {
    const seen = new Set<string>();
    return ranked.filter((hit) => {
      if (seen.has(hit.record.href)) return false;
      seen.add(hit.record.href);
      return true;
    });
  }, [ranked]);
  const totals = useMemo(() => {
    const counts = new Map<SearchKind, number>();
    for (const hit of unique) {
      counts.set(hit.record.kind, (counts.get(hit.record.kind) ?? 0) + 1);
    }
    return counts;
  }, [unique]);
  const results = useMemo(
    () => groupHits(unique, { perGroup: 5, total: 16 }),
    [unique],
  );
  const hitCount = useMemo(
    () => results.reduce((sum, group) => sum + group.hits.length, 0),
    [results],
  );
  const suggestions = useMemo(
    () => suggestedRecords(index).map((record) => ({ record, score: 0 })),
    [index],
  );
  // A query with no hits still offers the routes: a panel holding one line of
  // apology is a dead end, and the visitor came here to go somewhere.
  const groups = useMemo(
    () =>
      hitCount > 0
        ? results
        : [{ kind: "page" as SearchKind, hits: suggestions }],
    [hitCount, results, suggestions],
  );
  const showingSuggestions = hitCount === 0;

  // One flat list behind the groups: the arrow keys walk it, and the row index
  // in it is the option id the input points `aria-activedescendant` at.
  const flat = useMemo(() => groups.flatMap((group) => group.hits), [groups]);
  // Clamped rather than reset from an effect: the query and the highlight are
  // set together in the change handler, but the group caps can still shrink
  // the list under a highlight that was legal a keystroke ago.
  const activeIndex = Math.min(active, Math.max(flat.length - 1, 0));

  const go = useCallback(
    (hit: SearchHit | undefined) => {
      if (!hit) return;
      // A visitor who picked a result wants to be on that page, not back on
      // the header button they came from with the whole nav to tab through.
      selected.current = true;
      onClose();
      navigate(hit.record.href);
    },
    [navigate, onClose],
  );

  /**
   * Bring a row into view through Lenis, so the list glides like the rest of
   * the site instead of jumping. The target is measured against Lenis's
   * destination rather than the live scroll position, so a held key cannot
   * compound the error, and a held key also asks for `immediate`, which drops
   * the animation queue and keeps the highlight and the scroll together.
   */
  const revealRow = (hit: SearchHit | undefined, immediate: boolean) => {
    const wrapper = scrollerRef.current;
    const row = hit ? document.getElementById(optionId(hit.record)) : null;
    if (!wrapper || !row) return;
    const lenis = lenisRef.current;
    const view = wrapper.clientHeight;
    const top = row.offsetTop;
    const bottom = top + row.offsetHeight;
    const current = lenis ? lenis.targetScroll : wrapper.scrollTop;
    let target = current;
    if (top - ROW_MARGIN < current) {
      target = top - ROW_MARGIN;
    } else if (bottom + ROW_MARGIN > current + view) {
      target = bottom + ROW_MARGIN - view;
    }
    if (target === current) return;
    const clamped = Math.max(0, Math.min(target, wrapper.scrollHeight - view));
    if (lenis) lenis.scrollTo(clamped, { immediate });
    else wrapper.scrollTop = clamped;
  };

  const move = (delta: number, immediate: boolean) => {
    if (flat.length === 0) return;
    const next = (activeIndex + delta + flat.length) % flat.length;
    setActive(next);
    // The row exists already, only its highlight is about to change, so it can
    // be scrolled now instead of from an effect a frame later.
    revealRow(flat[next], immediate);
  };

  const onKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const immediate = event.repeat;
    const jump = event.metaKey || event.ctrlKey;
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        // Meta/Ctrl jumps to the ends, which is where Home and End would go if
        // the field were not a text field with a caret of its own.
        move(jump ? flat.length - 1 - activeIndex : 1, immediate);
        break;
      case "ArrowUp":
        event.preventDefault();
        move(jump ? -activeIndex : -1, immediate);
        break;
      case "Home":
      case "End":
        // Only while there is nothing to put a caret in: cmdk takes these keys
        // outright, but that leaves a visitor unable to reach the start of
        // their own query, which the APG editable-combobox pattern is right
        // about. Meta+Arrow covers the list either way.
        if (flat.length === 0 || query.length > 0) break;
        event.preventDefault();
        move(event.key === "Home" ? -activeIndex : flat.length - 1, immediate);
        break;
      case "Enter":
        event.preventDefault();
        go(flat[activeIndex]);
        break;
      case "Escape":
        event.preventDefault();
        onClose();
        break;
      case "Tab":
        // The field is the only focusable thing in here (the rows answer to
        // the arrow keys and there are no buttons), so Tab has nowhere to go
        // and must not walk out of the dialog.
        event.preventDefault();
        inputRef.current?.focus({ preventScroll: true });
        break;
      default:
        break;
    }
  };

  /**
   * The list gets its own Lenis, because a raw wheel inside a palette that
   * sits on a site which glides everywhere else is exactly the seam the owner
   * noticed. It is nested (the root instance is stopped by the body lock, and
   * `data-lenis-prevent` keeps it out of this element), it runs its own rAF,
   * and it is destroyed with the panel. Under reduced motion it is never
   * created at all, the way `SmoothScroll` handles the root instance.
   */
  useEffect(() => {
    if (!open || reduceMotion) return;
    const wrapper = scrollerRef.current;
    const content = listRef.current;
    if (!wrapper || !content) return;
    const instance = new Lenis({
      autoRaf: true,
      content,
      lerp: 0.1,
      smoothWheel: true,
      // Native momentum on a phone beats anything we would smooth by hand.
      syncTouch: false,
      wrapper,
    });
    lenisRef.current = instance;
    return () => {
      lenisRef.current = null;
      instance.destroy();
    };
  }, [open, reduceMotion]);

  // The caret has to be in the field the moment the panel is on screen, so the
  // focus call is not deferred; `preventScroll` because the body is locked
  // under the overlay and the browser would otherwise try to reveal the input.
  // On close, focus goes back where it came from, unless that is the document
  // itself (a shortcut pressed with nothing focused) or a node the drawer took
  // with it as it closed, in which case it goes to the header's own trigger.
  useEffect(() => {
    if (!open) return;
    previousFocus.current =
      returnFocusTo?.current ?? (document.activeElement as HTMLElement | null);
    inputRef.current?.focus({ preventScroll: true });
    return () => {
      if (selected.current) {
        const main = document.getElementById("main-content");
        if (main) {
          main.focus({ preventScroll: true });
          return;
        }
      }
      const previous = previousFocus.current;
      const usable =
        previous?.isConnected &&
        previous !== document.body &&
        previous !== document.documentElement;
      if (usable) {
        previous.focus({ preventScroll: true });
        return;
      }
      const triggers = [
        ...document.querySelectorAll<HTMLElement>(
          "header [data-search-trigger]",
        ),
      ];
      triggers
        .find((el) => el.getBoundingClientRect().width > 0)
        ?.focus({ preventScroll: true });
    };
  }, [open, returnFocusTo]);

  if (typeof window === "undefined") {
    return null;
  }

  // Counts what the list is actually offering, so the suggestions on open are
  // announced too rather than opening on silence.
  const status =
    flat.length === 1
      ? copy.resultsOne
      : copy.results.replace("{count}", String(flat.length));
  const rest = reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.98, y: 6 };

  return createPortal(
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop: the same cream wash the drawer and the lightbox use, so
              an overlay always reads the same way on this site. Opacity only. */}
          <motion.div
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-80 bg-background/95"
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            onClick={onClose}
            transition={WASH}
          />

          {/* The panel's own box, out of the backdrop's way: clicks that land
              beside the card fall through to the backdrop and close it.
              `items-start`, so the card is as tall as its rows. Flush to the
              top edge on a phone, where the palette is a sheet rather than a
              shrunken dialog. */}
          <div className="pointer-events-none fixed inset-0 z-90 flex items-start justify-center sm:px-4 sm:pt-28">
            <motion.div
              animate={{ opacity: 1, scale: 1, y: 0 }}
              aria-label={copy.label}
              aria-modal="true"
              className="pointer-events-auto flex max-h-full w-full max-w-lg flex-col overflow-hidden rounded-b-xl border-border/60 border-b bg-card shadow-xl sm:rounded-xl sm:border"
              data-no-callout
              exit={{ ...rest, transition: PANEL_OUT }}
              initial={rest}
              onKeyDown={onKeyDown}
              ref={panelRef}
              role="dialog"
              style={{
                paddingTop: "var(--safe-top, 0px)",
                paddingBottom: "var(--safe-bottom, 0px)",
              }}
              transition={reduceMotion ? PANEL_OUT : PANEL_IN}
            >
              {/* The field carries no box of its own: the row's hairline is
                  the entire chrome. The page's global focus ring is switched
                  off here rather than drawing a second border around a
                  borderless field; the dialog is the focus context, and the
                  caret says where the typing goes. */}
              <div className="flex shrink-0 items-center gap-2 border-border/60 border-b px-3">
                <Search aria-hidden className="size-4 shrink-0 opacity-50" />
                {/* 16px, not 14: anything smaller and iOS Safari zooms the
                    whole page the moment the field takes focus. */}
                <input
                  aria-activedescendant={
                    flat[activeIndex]
                      ? optionId(flat[activeIndex].record)
                      : undefined
                  }
                  aria-autocomplete="list"
                  aria-controls={listId}
                  aria-expanded="true"
                  aria-label={copy.open}
                  autoCapitalize="none"
                  autoComplete="off"
                  autoCorrect="off"
                  className="h-12 w-full min-w-0 bg-transparent text-base text-foreground placeholder:text-muted-foreground"
                  enterKeyHint="go"
                  onChange={(event) => {
                    setQuery(event.target.value);
                    setActive(0);
                  }}
                  placeholder={copy.placeholder}
                  ref={inputRef}
                  role="combobox"
                  spellCheck={false}
                  style={{ outline: "none" }}
                  type="text"
                  value={query}
                />
              </div>

              {/* Announced to a screen reader, which cannot see the list
                  change under a highlight that never moves focus. */}
              <p aria-live="polite" className="sr-only">
                {status}
              </p>

              {trimmed && showingSuggestions ? (
                // The query, handed back, with the routes still underneath.
                <p className="shrink-0 px-3 pt-3 text-muted-foreground text-sm">
                  {copy.noResults.replace("{query}", trimmed)}
                </p>
              ) : null}

              {/* Lenis needs a wrapper to scroll and a content element to
                  measure, and the listbox has to own its options directly, so
                  the roles sit on the inner element. `relative` makes the
                  wrapper the offset parent that keyboard scrolling measures
                  against. */}
              <div
                className="relative max-h-[min(400px,60vh)] min-h-0 flex-1 scroll-py-1 overflow-y-auto overflow-x-hidden overscroll-contain p-1"
                data-lenis-prevent
                ref={scrollerRef}
              >
                <div
                  aria-label={copy.resultsLabel}
                  id={listId}
                  ref={listRef}
                  role="listbox"
                >
                  {groups.map((group, groupIndex) => {
                    const headingId = `${baseId}-${group.kind}-heading`;
                    // The offset of this group's first row in the flat list.
                    const offset = groups
                      .slice(0, groupIndex)
                      .reduce((sum, before) => sum + before.hits.length, 0);
                    return (
                      <div
                        aria-labelledby={headingId}
                        className="mb-2 last:mb-0"
                        key={group.kind}
                        role="group"
                      >
                        <p
                          aria-hidden="true"
                          className="flex items-center justify-between gap-2 px-2 py-1.5 font-medium text-muted-foreground text-xs"
                          id={headingId}
                        >
                          <span>
                            {showingSuggestions
                              ? copy.suggestions
                              : copy.groups[group.kind]}
                          </span>
                          {/* Only when rows were left out, so the heading says
                              how much more there is rather than restating what
                              is already on screen. */}
                          {(totals.get(group.kind) ?? 0) > group.hits.length ? (
                            <span className="opacity-70 tabular-nums">
                              {totals.get(group.kind)}
                            </span>
                          ) : null}
                        </p>
                        {group.hits.map((hit, hitIndex) => {
                          const rowIndex = offset + hitIndex;
                          const isActive = rowIndex === activeIndex;
                          return (
                            // Keyed by record, so a keystroke that keeps a row
                            // updates it instead of remounting it. No entrance
                            // animation on a row: a list that cascades on every
                            // keystroke is noise, not motion.
                            <Link
                              aria-selected={isActive}
                              className={cn(
                                "flex select-none items-center gap-2 rounded-sm border px-2 py-1.5 text-sm transition-colors duration-200 ease-out",
                                isActive
                                  ? "border-primary/30 bg-primary/10 text-primary"
                                  : "border-transparent text-foreground",
                              )}
                              id={optionId(hit.record)}
                              key={hit.record.id}
                              draggable={false}
                              onClick={(event: ReactMouseEvent) => {
                                // A modifier click is "open this in a new
                                // tab", which is the whole reason these rows
                                // are real links; closing the palette under it
                                // would throw away the query it came from.
                                if (
                                  event.metaKey ||
                                  event.ctrlKey ||
                                  event.shiftKey ||
                                  event.altKey ||
                                  event.button !== 0
                                ) {
                                  return;
                                }
                                selected.current = true;
                                onClose();
                              }}
                              /* `pointermove`, not `pointerenter`: arrowing
                                 scrolls a row under a pointer that never
                                 moved, and enter would fire there and drag the
                                 highlight back. A real pointer move wins, a
                                 keyboard move is never overruled. */
                              onPointerMove={() => setActive(rowIndex)}
                              /* The site's cursor morphs onto any anchor, so
                                 pointing at a row drew a second full-width
                                 highlight (fill, ring and halo) on top of the
                                 row's own. An explicit null releases the
                                 morph and leaves the plain dot, so the only
                                 highlight in this list is the list's. */
                              ref={(el) => {
                                if (el) setCursorMagnetRect(el, null);
                              }}
                              role="option"
                              tabIndex={-1}
                              to={hit.record.href}
                            >
                              {KIND_ICON[hit.record.kind]}
                              <span className="min-w-0 flex-1">
                                <span className="block truncate">
                                  {hit.record.title}
                                </span>
                                {/* The suggestion list is terse on purpose:
                                    the eight route names say what they are,
                                    and eight SEO sentences under them all
                                    starting with the same three words is
                                    noise. Search results keep the line, which
                                    is what tells two similar titles apart. */}
                                {!showingSuggestions && hit.record.context ? (
                                  <span
                                    className={cn(
                                      "block truncate text-xs",
                                      isActive
                                        ? "text-primary/70"
                                        : "text-muted-foreground",
                                    )}
                                  >
                                    {hit.record.context}
                                  </span>
                                ) : null}
                              </span>
                            </Link>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* The keys, for the people who will use them. Hidden on a
                  phone, where there is no keyboard to hint at. */}
              <div
                aria-hidden="true"
                className="hidden shrink-0 items-center gap-4 border-border/60 border-t px-3 py-2 text-muted-foreground text-xs sm:flex"
              >
                <span className="flex items-center gap-1">
                  <Key>↑</Key>
                  <Key>↓</Key>
                  {copy.hintNavigate}
                </span>
                <span className="flex items-center gap-1">
                  <Key>↵</Key>
                  {copy.hintSelect}
                </span>
                <span className="ml-auto flex items-center gap-1">
                  <Key>esc</Key>
                  {copy.hintClose}
                </span>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>,
    document.body,
  );
}

import { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { fitTags } from "@/lib/fit-tags";

/**
 * The tag row on a timeline card.
 *
 * The chips are the stack a role was actually built on, so the row shows as
 * many as the card is wide enough to hold — measured, not capped at a number —
 * and hands the rest to a "+N" chip that reveals them on hover, focus or tap.
 * Nothing is dropped: what does not fit is one interaction away.
 */

const CHIP = "rounded-full border border-border/40 px-3 py-1 text-xs";
/** The off-layout copies must report their natural width: never shrunk, never wrapped. */
const MEASURED = "shrink-0 whitespace-nowrap";
const TAG_CHIP = `${CHIP} bg-secondary/40 text-foreground/80`;
const TAG_HOVER =
  "transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/[0.07] hover:text-primary hover:shadow-[0_6px_18px_-6px_hsl(var(--primary)/0.35)]";
const MORE_CHIP = `${CHIP} bg-secondary/30 text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/[0.07] hover:text-primary hover:shadow-[0_6px_18px_-6px_hsl(var(--primary)/0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background data-[state=open]:border-primary/40 data-[state=open]:bg-primary/[0.07] data-[state=open]:text-primary`;

/** Matches the `gap-2` on the row below; the packer needs it as a number. */
const GAP = 8;
/** Two rows of chips keeps the cards even. Past that, the "+N" chip takes over. */
const MAX_ROWS = 2;

export function TimelineTags({
  tags,
  moreLabel,
}: {
  tags: string[];
  moreLabel: (count: number) => string;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(tags.length);
  const [open, setOpen] = useState(false);
  // A hover must not pull focus out of the page; a click or Enter should.
  const hoverOpened = useRef(false);

  useEffect(() => {
    const row = rowRef.current;
    const measure = measureRef.current;
    if (!row || !measure) return;

    const recount = () => {
      const chips = [...measure.children] as HTMLElement[];
      const badge = chips.pop();
      if (!badge) return;
      setVisible(
        fitTags({
          widths: chips.map((chip) => Math.ceil(chip.getBoundingClientRect().width)),
          badgeWidth: Math.ceil(badge.getBoundingClientRect().width),
          containerWidth: row.clientWidth,
          gap: GAP,
          maxRows: MAX_ROWS,
        }),
      );
    };

    // Fires once on observe, so the first count lands before the row is painted.
    const observer = new ResizeObserver(recount);
    observer.observe(row);

    // Inter loads with `display: swap`, and the fallback measures narrower than
    // it does — without this the first count outlives the font it was taken in.
    let live = true;
    document.fonts?.ready.then(() => {
      if (live) recount();
    });

    return () => {
      live = false;
      observer.disconnect();
    };
  }, [tags]);

  const shown = tags.slice(0, visible);
  const hidden = tags.slice(visible);

  return (
    <div className="relative mt-4">
      {/*
       * Every chip at its natural width, clipped out of the layout. The visible
       * row cannot be measured for this: it only holds the chips that already
       * fit, so widening the window would never bring the others back.
       */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-0 overflow-hidden"
      >
        <div className="flex w-max flex-nowrap gap-2" ref={measureRef}>
          {tags.map((tag) => (
            <span className={`${TAG_CHIP} ${MEASURED}`} key={tag}>
              {tag}
            </span>
          ))}
          <span className={`${CHIP} ${MEASURED}`}>+{tags.length}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2" ref={rowRef}>
        {shown.map((tag) => (
          <span className={`${TAG_CHIP} ${TAG_HOVER}`} key={tag}>
            {tag}
          </span>
        ))}

        {hidden.length > 0 && (
          <Popover onOpenChange={setOpen} open={open}>
            <PopoverTrigger asChild>
              <button
                aria-label={moreLabel(hidden.length)}
                className={MORE_CHIP}
                onClick={() => {
                  hoverOpened.current = false;
                }}
                onPointerEnter={(event) => {
                  if (event.pointerType !== "mouse") return;
                  hoverOpened.current = true;
                  setOpen(true);
                }}
                onPointerLeave={(event) => {
                  if (event.pointerType === "mouse") setOpen(false);
                }}
                type="button"
              >
                +{hidden.length}
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="start"
              className="w-auto max-w-64 border-border/60 p-2"
              onOpenAutoFocus={(event) => {
                if (hoverOpened.current) event.preventDefault();
              }}
              side="top"
            >
              <div className="flex flex-wrap gap-1.5">
                {hidden.map((tag) => (
                  <span className={TAG_CHIP} key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </div>
  );
}

import { motion } from "framer-motion";
import { type CSSProperties, type KeyboardEvent, type ReactNode, useId } from "react";
import { useMotionSafe } from "./motion";

/** The shared controls of layout e's live demos: one demo box, pills and actions. */

/**
 * The one demo box: the column's width, a fixed height (so nothing on the
 * page moves while the demo changes), radius 16, the card tone and a hairline.
 * The caption below says what to do and what to watch.
 */
export function Demo({
  label,
  caption,
  height,
  phoneHeight,
  children,
  live,
  className = "",
}: {
  /** What the demo shows, for screen readers. */
  label: string;
  caption: string;
  /** Box height in px from `sm`, and on a phone. */
  height: number;
  phoneHeight?: number;
  children: ReactNode;
  /** The demo's state in words, announced politely as it changes. */
  live?: string;
  className?: string;
}) {
  const style = {
    "--demo-h": `${height}px`,
    "--demo-h-phone": `${phoneHeight ?? height}px`,
  } as CSSProperties;
  return (
    <figure aria-label={label} className="m-0" role="group">
      <div
        className={`relative h-[var(--demo-h-phone)] overflow-hidden rounded-2xl bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04)] ring-1 ring-black/[0.06] sm:h-[var(--demo-h)] dark:ring-white/[0.08] ${className}`}
        style={style}
      >
        {children}
      </div>
      <figcaption className="mt-3.5 text-balance text-center text-[0.8125rem] text-muted-foreground leading-[1.625]">
        {caption}
      </figcaption>
      {live !== undefined ? (
        <p aria-live="polite" className="sr-only">
          {live}
        </p>
      ) : null}
    </figure>
  );
}

/** A control row inside a demo: pills that share one sliding indicator. */
/**
 * One tab stop for the whole group, like any radio group: the arrow keys move
 * the choice, and the focus goes with it.
 */
export function Pills<T extends string>({
  options,
  value,
  onChange,
  label,
  dark = false,
}: {
  options: ReadonlyArray<{ value: T; label: string }>;
  value: T;
  onChange: (next: T) => void;
  label: string;
  /** On a dark app surface rather than the card. */
  dark?: boolean;
}) {
  const id = useId();
  const { spring } = useMotionSafe();
  const step = (event: KeyboardEvent<HTMLDivElement>) => {
    const forward = event.key === "ArrowRight" || event.key === "ArrowDown";
    const back = event.key === "ArrowLeft" || event.key === "ArrowUp";
    if (!forward && !back) return;
    event.preventDefault();
    const at = options.findIndex((o) => o.value === value);
    const next = options[(at + (forward ? 1 : -1) + options.length) % options.length];
    onChange(next.value);
    const buttons = event.currentTarget.querySelectorAll<HTMLButtonElement>("button");
    buttons[options.indexOf(next)]?.focus();
  };
  return (
    <div aria-label={label} className="flex flex-wrap items-center gap-1" onKeyDown={step} role="radiogroup">
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            aria-checked={active}
            className={`relative inline-flex h-8 items-center rounded-full px-3 font-medium text-[0.8125rem] transition-colors duration-200 ease-bloom ${
              dark
                ? active
                  ? "text-white"
                  : "text-white/55 hover:text-white/85"
                : active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
            }`}
            key={option.value}
            onClick={() => onChange(option.value)}
            role="radio"
            tabIndex={active ? 0 : -1}
            type="button"
          >
            {active ? (
              <motion.span
                aria-hidden
                className={`absolute inset-0 rounded-full ${dark ? "bg-white/12" : "bg-foreground/[0.07] dark:bg-foreground/[0.1]"}`}
                layoutId={`pill-${id}`}
                transition={spring}
              />
            ) : null}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/** An action inside a demo: a verb on a quiet pill, with a press. */
export function Action({
  children,
  onClick,
  disabled,
  dark = false,
  primary = false,
}: {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
  dark?: boolean;
  primary?: boolean;
}) {
  const { reduced } = useMotionSafe();
  const tone = dark
    ? primary
      ? "bg-white text-neutral-900 hover:bg-white/90"
      : "bg-white/10 text-white/90 hover:bg-white/15"
    : primary
      ? "bg-foreground text-background hover:bg-foreground/90"
      : "bg-foreground/[0.07] text-foreground hover:bg-foreground/[0.11]";
  return (
    <motion.button
      className={`inline-flex h-8 items-center gap-1.5 rounded-full px-3.5 font-medium text-[0.8125rem] transition-colors duration-200 ease-bloom disabled:pointer-events-none disabled:opacity-40 ${tone}`}
      disabled={disabled}
      onClick={onClick}
      type="button"
      whileTap={reduced ? undefined : { scale: 0.97 }}
    >
      {children}
    </motion.button>
  );
}

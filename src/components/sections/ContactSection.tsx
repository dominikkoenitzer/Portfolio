import {
  AnimatePresence,
  motion,
  type MotionProps,
  useReducedMotion,
} from "framer-motion";
import { ArrowUpRight, Check, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SITE_CONFIG } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { revealOnScroll } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { DUR, EASE_OUT, REVEAL, stagger } from "@/lib/motion";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { SectionHeading } from "../layout/SectionHeading";

const EMAIL = SITE_CONFIG.email;

// Display order of the subject options. Keys must exist under `contact.intents`
// in every language module (typecheck enforces the shape via `Translation`).
const INTENT_KEYS = ["job", "freelance", "collab", "other"] as const;
type IntentKey = (typeof INTENT_KEYS)[number];

/** What the sentence and the mail link are built from, whatever the source. */
type Draft = { label: string; subject: string; body: string };

/**
 * The Services page hands us an enquiry through router state (see
 * `buildInquiry` there): the service title plus a fully composed subject and
 * message in the visitor's language. Read defensively: `state` is whatever the
 * previous route chose to put there, and it survives reloads via history.
 */
function readRouterState(state: unknown): {
  service: Draft | null;
  intent: IntentKey | null;
} {
  if (!state || typeof state !== "object") {
    return { service: null, intent: null };
  }
  const s = state as Record<string, unknown>;

  const service =
    typeof s.subject === "string" && typeof s.message === "string"
      ? {
          label: typeof s.label === "string" ? s.label : s.subject,
          subject: s.subject,
          body: s.message,
        }
      : null;

  const intent =
    typeof s.intent === "string" &&
    (INTENT_KEYS as readonly string[]).includes(s.intent)
      ? (s.intent as IntentKey)
      : null;

  return { service, intent };
}

/**
 * `encodeURIComponent` turns the template's newlines into %0A, which every mail
 * client understands: no need to hand-write CRLF pairs.
 */
const mailtoFor = (subject: string, body: string) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

/**
 * Swapping the label crossfades it with a small lift, so the sentence reads as
 * being rewritten rather than flickering. Opacity and transform only: the cell
 * the labels share is fixed by the widest of them and never animates.
 */
const LABEL_SWAP: MotionProps = {
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  initial: { opacity: 0, y: 6 },
  transition: { duration: DUR.fast, ease: EASE_OUT },
};

/** Same exchange, cut to a hard swap when the visitor asked for less motion. */
const LABEL_SWAP_STILL: MotionProps = {
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  initial: { opacity: 1 },
  transition: { duration: 0 },
};

/**
 * One option as the trigger paints it: the underlined phrase with the chevron
 * glued to its last word. The visible copy and the invisible sizing copies both
 * render through here, so the cell is measured against exactly the box it will
 * later paint. The underline stays on the text (not on the button), so it wraps
 * with the phrase and stops before the chevron, and `overflow-wrap: anywhere`
 * keeps an unbounded service label from pushing its own min-content width past
 * a 375px viewport.
 */
function IntentLabel({ label }: { label: string }) {
  return (
    <>
      <span className="underline decoration-2 decoration-primary/45 underline-offset-[6px] transition-[text-decoration-color] duration-200 ease-out [overflow-wrap:anywhere] group-hover/intent:decoration-primary">
        {label}
      </span>
      {/* The chevron flips once the list is open, so the control says which
          state it is in. */}
      <ChevronDown
        aria-hidden
        className="ml-1.5 inline-block h-[0.6em] w-[0.6em] align-middle text-primary/70 transition-transform duration-200 ease-out group-data-[state=open]/intent:rotate-180"
      />
    </>
  );
}

/**
 * The contact page is one sentence the visitor finishes, and one link.
 *
 * There is no backend by design: the picked subject prefills a mailto template,
 * so the message is sent by the visitor's own mail client. Nothing to deploy, no
 * API key, no third-party service.
 */
export function ContactSection() {
  const { language } = useLanguage();
  const t = translations[language].contact;
  const { toast } = useToast();
  const reduceMotion = useReducedMotion();

  // Arriving from a service card ("Get in touch") pre-selects that service, so
  // the page you land on is already about the thing you clicked.
  const { state } = useLocation();
  const { service, intent: incomingIntent } = useMemo(
    () => readRouterState(state),
    [state],
  );

  const [intent, setIntent] = useState<IntentKey | "service">(
    service ? "service" : (incomingIntent ?? "job"),
  );
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const selected: Draft =
    intent === "service" && service ? service : t.intents[intent as IntentKey];

  // The service, when there is one, leads the list; it's why they're here.
  const options: Array<{ key: IntentKey | "service"; label: string }> = [
    ...(service ? [{ key: "service" as const, label: service.label }] : []),
    ...INTENT_KEYS.map((key) => ({ key, label: t.intents[key].label })),
  ];

  // Clipboard needs a secure context; if it's unavailable or denied, spell the
  // address out in the toast rather than failing silently.
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: t.copyFailed, variant: "destructive" });
    }
  };

  return (
    <section
      // The block is the whole page, so it centres in the viewport and owns
      // its own height. `section-padding` on top of the centring left 300 to
      // 400px of dead page above the footer.
      className="mx-auto flex min-h-[calc(100vh-10rem)] w-full max-w-7xl flex-col justify-center px-6 sm:px-8 md:px-12 lg:px-16"
      id="contact"
    >
      {/* Headline, the sentence the visitor finishes, then the address: one
          cascade, so the page assembles itself in reading order. The block is
          centred in the viewport because it is the whole page: top-aligned, it
          left a screen of dead space under the address. */}
      <motion.div
        className="w-full max-w-3xl"
        {...revealOnScroll(reduceMotion, stagger())}
      >
        {/* The shared page title, left-aligned for this editorial layout, so
            the type is identical to every other page's. The German line
            carries a soft hyphen (U+00AD) and only breaks there if it must. */}
        <SectionHeading
          align="left"
          className="mb-0"
          eyebrow={t.eyebrow}
          title={`${t.headlineLine1} ${t.headlineLine2}`}
        />

        {/* The visitor's half of the exchange: a line they finish. The rule on
            the left marks it as their draft rather than more of the headline. */}
        <motion.p
          className="mt-10 border-primary/35 border-l-2 pl-5 text-muted-foreground leading-snug sm:pl-6"
          style={{ fontSize: "clamp(1.15rem, 3vw, 1.75rem)" }}
          variants={REVEAL}
        >
          {t.sentenceLead}{" "}
          <Popover onOpenChange={setOpen} open={open}>
            {/* Every option is laid into one grid cell of this wrapper, so the
                cell is as wide and as tall as the longest label of the current
                language (the service label from the Services page included)
                whatever is selected. The sentence's line count therefore never
                changes and nothing below it moves; picking a subject was
                reflowing the page down to the response-time line before this.
                The copies stay `visibility: hidden`: they still size the cell,
                but they are out of the accessibility tree, unselectable and
                unclickable, so only the chosen phrase is ever read out.
                The button is a grid child of that cell rather than the cell
                itself, and hugs its own label: its box is what the focus ring
                and the custom cursor's magnet wrap, and at 1440px the cell is
                381px wide against a 81px phrase. */}
            <span className="inline-grid items-start align-baseline">
              {options.map(({ key, label }) => (
                <span
                  aria-hidden
                  className="invisible col-start-1 row-start-1"
                  key={key}
                >
                  <IntentLabel label={label} />
                </span>
              ))}
              <PopoverTrigger asChild>
                <button
                  aria-label={t.changeSubject}
                  className="group/intent col-start-1 row-start-1 inline-grid justify-self-start rounded-sm text-left font-medium text-foreground transition-colors duration-200 ease-out hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                  type="button"
                >
                  <AnimatePresence initial={false}>
                    <motion.span
                      className="col-start-1 row-start-1"
                      key={intent}
                      {...(reduceMotion ? LABEL_SWAP_STILL : LABEL_SWAP)}
                    >
                      <IntentLabel label={selected.label} />
                    </motion.span>
                  </AnimatePresence>
                </button>
              </PopoverTrigger>
            </span>
            <PopoverContent align="start" className="w-72 p-1.5">
              <div className="grid gap-0.5">
                {options.map(({ key, label }) => {
                  const isActive = key === intent;
                  return (
                    <button
                      aria-pressed={isActive}
                      className={cn(
                        "flex min-h-[44px] items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors duration-200 ease-out",
                        isActive
                          ? "bg-primary/5 font-medium text-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                      key={key}
                      onClick={() => {
                        setIntent(key);
                        setOpen(false);
                      }}
                      type="button"
                    >
                      <span className="min-w-0 [overflow-wrap:anywhere]">
                        {label}
                      </span>
                      {isActive ? (
                        <Check aria-hidden className="h-4 w-4 shrink-0" />
                      ) : null}
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </motion.p>

        {/* The address is the button, with no card, wrapper or icon tile. */}
        <motion.div className="mt-12 sm:mt-16" variants={REVEAL}>
          <a
            className="group inline-flex max-w-full items-start gap-2 font-semibold tracking-tight transition-colors duration-200 ease-out hover:text-primary active:text-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:items-center"
            href={mailtoFor(selected.subject, selected.body)}
            style={{ fontSize: "clamp(1.25rem, 4.5vw, 2.25rem)" }}
          >
            {/* Underlined at rest, because it is the one link the page is for.
                The rule deepens with the pointer: a colour change, not a wipe. */}
            <span className="min-w-0 break-all underline decoration-2 decoration-primary/30 underline-offset-[0.2em] transition-[text-decoration-color] duration-200 ease-out group-hover:decoration-primary">
              {EMAIL}
            </span>
            <ArrowUpRight
              aria-hidden
              className="mt-[0.35em] h-[0.55em] w-[0.55em] shrink-0 text-primary transition-transform duration-200 ease-out group-hover:-translate-y-1 group-hover:translate-x-1 sm:mt-0"
            />
          </a>

          {/* Two quiet lines. mailto: is a dead end for anyone on webmail
              without a registered handler, so the copy fallback sits right
              beside it, and what happens next sits under both. */}
          <p className="mt-5 text-muted-foreground text-sm leading-relaxed">
            {t.emailHint}{" "}
            {/* The same single-cell stack as the subject trigger, for the same
                reason: the confirmation is far shorter than the invitation, and
                on a 375px screen that changed this paragraph's line count and
                pulled the response-time line up under it. The cell holds the
                longer of the two; the button hugs whichever is showing, so its
                box is the size of the words it is under. The 44px touch target
                is spent on coarse pointers only, where it is what the finger
                needs; on a mouse it would only inflate the cursor's magnet. */}
            <span className="inline-grid align-baseline">
              <span aria-hidden className="invisible col-start-1 row-start-1">
                {t.copyEmail}
              </span>
              <span aria-hidden className="invisible col-start-1 row-start-1">
                {t.copied}
              </span>
              <button
                className="col-start-1 row-start-1 inline-grid items-center justify-self-start rounded-sm text-left underline decoration-muted-foreground/40 underline-offset-2 transition-colors duration-200 ease-out hover:text-foreground hover:decoration-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background [@media(pointer:coarse)]:min-h-[44px]"
                onClick={copyEmail}
                type="button"
              >
                <AnimatePresence initial={false}>
                  <motion.span
                    className="col-start-1 row-start-1"
                    key={copied ? "copied" : "copy"}
                    {...(reduceMotion ? LABEL_SWAP_STILL : LABEL_SWAP)}
                  >
                    {copied ? t.copied : t.copyEmail}
                  </motion.span>
                </AnimatePresence>
              </button>
            </span>
          </p>
          <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
            {t.responseTime}
          </p>
        </motion.div>
      </motion.div>
    </section>
  );
}

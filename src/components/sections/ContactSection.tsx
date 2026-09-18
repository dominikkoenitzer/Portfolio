import {
  AnimatePresence,
  motion,
  type MotionProps,
  useReducedMotion,
} from "framer-motion";
import { ArrowRight, ArrowUpRight, Check, ChevronDown } from "lucide-react";
import { type FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { SITE_CONFIG } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { revealOnScroll } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { DUR, EASE_OUT, REVEAL, stagger } from "@/lib/motion";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";
import { SectionHeading } from "../layout/SectionHeading";

const EMAIL = SITE_CONFIG.email;

/**
 * One recipe for every field, the card recipe turned inwards: the same hairline
 * border and surface as a card, the primary ring on focus. `text-base` on
 * touch screens, because iOS zooms into anything smaller than 16px.
 */
const FIELD =
  "w-full rounded-lg border border-border/60 bg-card px-3.5 py-2.5 text-base text-foreground placeholder:text-muted-foreground/70 transition-colors duration-200 ease-out hover:border-primary/30 focus-visible:border-primary/45 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 sm:text-sm";

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
 * The contact page is one sentence the visitor finishes, then a short form.
 *
 * The form posts to `/api/contact` (same origin, so the CSP is untouched), which
 * stores the message in Supabase and mails it on. The picked subject travels
 * with it. The mailto link stays underneath as the fallback for anyone who
 * would rather use their own mail client, with the same prefilled subject.
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

  /*
   * Only an explicit choice is stored. Everything else is derived from the
   * router, because this component outlives the navigations that change it:
   * /contact → /contact is a `replace` and the route is keyed on the pathname,
   * so it never remounts. Storing the *derived* value instead was the bug in
   * both directions — with no service it left `intent` pointing at one that no
   * longer existed (`t.intents.service` is undefined, and reading `.label` off
   * it took the page to the error boundary), and once corrected, pressing Back
   * restored the service to the router but not to the picker, so the form sent
   * the wrong subject.
   */
  const [chosen, setChosen] = useState<IntentKey | "service" | null>(null);
  // A new navigation — including Back and Forward — drops the explicit choice,
  // so arriving from a service card always opens on that service.
  const [seenState, setSeenState] = useState(state);
  if (seenState !== state) {
    setSeenState(state);
    setChosen(null);
  }
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // An explicit "service" only counts while there is one; otherwise follow the
  // router: the service it carried, the intent it named, or a role.
  const effectiveIntent: IntentKey | "service" =
    chosen && (chosen !== "service" || service)
      ? chosen
      : service
        ? "service"
        : (incomingIntent ?? "job");

  const selected: Draft =
    effectiveIntent === "service" && service
      ? service
      : t.intents[effectiveIntent as IntentKey];

  // The service, when there is one, leads the list; it's why they're here.
  const options: Array<{ key: IntentKey | "service"; label: string }> = [
    ...(service ? [{ key: "service" as const, label: service.label }] : []),
    ...INTENT_KEYS.map((key) => ({ key, label: t.intents[key].label })),
  ];

  // Clipboard needs a secure context; if it's unavailable or denied, spell the
  // address out in the toast rather than failing silently.
  const copiedTimer = useRef<number | null>(null);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      // Tracked, so a second copy inside two seconds does not let the first
      // timer clear the confirmation the second one just put up.
      if (copiedTimer.current !== null) {
        window.clearTimeout(copiedTimer.current);
      }
      copiedTimer.current = window.setTimeout(() => {
        copiedTimer.current = null;
        setCopied(false);
      }, 2000);
    } catch {
      toast({ title: t.copyFailed, variant: "destructive" });
    }
  };
  useEffect(
    () => () => {
      if (copiedTimer.current !== null) {
        window.clearTimeout(copiedTimer.current);
      }
    },
    [],
  );

  // The form. `startedAt` is when the page mounted: the API drops anything
  // "filled in" faster than a person can type, and `website` is the honeypot
  // no person sees. Both are read by `api/contact.js`.
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const startedAt = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  // Sending disables the button, and disabling the focused element drops focus
  // to <body>. On a failure the toast is the only sign anything happened, and a
  // keyboard visitor was left at the top of the document with no way back to
  // the form but to tab through the whole page again.
  const submitRef = useRef<HTMLButtonElement>(null);
  // Not a bare `.focus()`: at the moment the failure branch runs, React has not
  // re-rendered yet, so the button is still `disabled` and focusing it does
  // nothing at all. The frame after the commit is the first moment it can take
  // focus again.
  const restoreFocus = () =>
    requestAnimationFrame(() => submitRef.current?.focus());
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    const data = new FormData(event.currentTarget);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        // Without a deadline a hung request parked the button on "Sending…"
        // forever: disabled, focus dropped, and no way to try again short of
        // reloading and retyping. An abort lands in the catch below, which
        // already restores the button, the focus and the typed message.
        signal: AbortSignal.timeout(20000),
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          website: data.get("website"),
          subject: selected.subject,
          intent: effectiveIntent,
          language,
          startedAt: startedAt.current,
        }),
      });
      if (!res.ok) {
        toast({
          title: res.status === 429 ? t.form.tooMany : t.form.failed,
          variant: "destructive",
        });
        setStatus("idle");
        restoreFocus();
        return;
      }
      setStatus("sent");
    } catch {
      toast({ title: t.form.failed, variant: "destructive" });
      setStatus("idle");
      restoreFocus();
    }
  };

  const reset = () => {
    formRef.current?.reset();
    startedAt.current = Date.now();
    setStatus("idle");
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
                      key={effectiveIntent}
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
                  const isActive = key === effectiveIntent;
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
                        setChosen(key);
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

        {/* The form. Plain fields on the page column, no card around them:
            the sentence above is the subject line, so the form only needs the
            three things the sentence cannot say. Labels sit above the fields
            and stay visible, placeholders only hint. */}
        <motion.div className="mt-10 sm:mt-12" variants={REVEAL}>
          {status === "sent" ? (
            <div
              aria-live="polite"
              className="max-w-xl rounded-2xl border border-border/60 bg-card p-6 sm:p-8"
            >
              <p className="font-semibold text-lg">{t.form.sentTitle}</p>
              <p className="mt-2 text-muted-foreground text-sm leading-relaxed">
                {t.form.sentBody}
              </p>
              <Button
                className="mt-6 rounded-lg"
                onClick={reset}
                type="button"
                variant="outline"
              >
                {t.form.sendAnother}
              </Button>
            </div>
          ) : (
            <form
              className="grid max-w-xl gap-5"
              noValidate={false}
              onSubmit={submit}
              ref={formRef}
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium">{t.form.nameLabel}</span>
                  <input
                    autoComplete="name"
                    className={FIELD}
                    maxLength={120}
                    name="name"
                    required
                    type="text"
                  />
                </label>
                <label className="grid gap-1.5 text-sm">
                  <span className="font-medium">{t.form.emailLabel}</span>
                  <input
                    autoComplete="email"
                    className={FIELD}
                    maxLength={254}
                    name="email"
                    required
                    type="email"
                  />
                </label>
              </div>
              <label className="grid gap-1.5 text-sm">
                <span className="font-medium">{t.form.messageLabel}</span>
                <textarea
                  className={cn(FIELD, "min-h-[9rem] resize-y leading-relaxed")}
                  maxLength={5000}
                  name="message"
                  placeholder={t.form.messagePlaceholder}
                  required
                />
              </label>
              {/* Honeypot: off-screen rather than display:none, so the bots
                  that skip hidden fields still fill this one. Out of the tab
                  order and the accessibility tree for everyone else. */}
              <div aria-hidden className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
                <label>
                  Website
                  <input autoComplete="off" name="website" tabIndex={-1} type="text" />
                </label>
              </div>
              <div>
                <Button
                  className="group rounded-lg px-6"
                  disabled={status === "sending"}
                  ref={submitRef}
                  type="submit"
                  variant="cta"
                >
                  {status === "sending" ? t.form.sending : t.form.send}
                  <ArrowRight
                    aria-hidden
                    className="transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                  />
                </Button>
              </div>
            </form>
          )}
        </motion.div>

        {/* The address stays, as the fallback: same subject, the visitor's own
            mail client. Smaller than it was, because the form is now the
            thing the page is for. */}
        <motion.div className="mt-10 sm:mt-12" variants={REVEAL}>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {t.form.orDirect}{" "}
            <a
              className="group inline-flex max-w-full items-center gap-1 font-medium text-foreground underline decoration-2 decoration-primary/30 underline-offset-[0.2em] transition-[text-decoration-color,color] duration-200 ease-out hover:text-primary hover:decoration-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
              href={mailtoFor(selected.subject, selected.body)}
            >
              <span className="min-w-0 break-all">{EMAIL}</span>
              <ArrowUpRight
                aria-hidden
                className="h-[0.8em] w-[0.8em] shrink-0 text-primary transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>{" "}
            {/* The same single-cell stack as the subject trigger, for the same
                reason: the confirmation is far shorter than the invitation, so
                the cell holds the longer of the two and nothing reflows. */}
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

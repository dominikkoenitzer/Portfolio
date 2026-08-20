import { motion } from "framer-motion";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SITE_CONFIG } from "@/constants";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";
import { cn } from "@/lib/utils";

const EMAIL = SITE_CONFIG.email;
const EASE = [0.22, 1, 0.36, 1] as const;

// Display order of the subject options. Keys must exist under `contact.intents`
// in every language module (typecheck enforces the shape via `Translation`).
const INTENT_KEYS = ["job", "freelance", "collab", "other"] as const;
type IntentKey = (typeof INTENT_KEYS)[number];

/** What the sentence and the mail link are built from, whatever the source. */
type Draft = { label: string; subject: string; body: string };

/**
 * The Services page hands us an enquiry through router state (see
 * `buildInquiry` there): the service title plus a fully composed subject and
 * message in the visitor's language. Read defensively — `state` is whatever the
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
 * client understands — no need to hand-write CRLF pairs.
 */
const mailtoFor = (subject: string, body: string) =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

/**
 * The contact page is one sentence the visitor finishes, and one link.
 *
 * There is no backend by design — the picked subject prefills a mailto template,
 * so the message is sent by the visitor's own mail client. Nothing to deploy, no
 * API key, no third-party service.
 */
export function ContactSection() {
  const { language } = useLanguage();
  const t = translations[language].contact;
  const { toast } = useToast();

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

  // The service, when there is one, leads the list — it's why they're here.
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
    <section className="section-padding" id="contact">
      <div className="mx-auto max-w-3xl">
        <motion.h1
          className="break-words font-bold leading-[1.02] [hyphens:manual] [-webkit-hyphens:manual] [overflow-wrap:break-word]"
          initial={{ opacity: 0, y: 20 }}
          style={{ fontSize: "clamp(2.25rem, 8vw, 4.5rem)" }}
          transition={{ duration: 0.7, ease: EASE }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {/* hyphens: manual so German only breaks at the soft hyphen (U+00AD)
              the translation places — "zusammen-arbeiten", not the dictionary's
              "zusammenar-beiten". pb keeps descenders off the clipping edge. */}
          {t.headlineLine1}
          <br />
          <span className="hero-name-gradient inline-block pb-[0.15em]">
            {t.headlineLine2}
          </span>
        </motion.h1>

        {/* The visitor's half of the exchange: a line they finish. The rule on
            the left marks it as their draft rather than more of the headline. */}
        <motion.p
          className="mt-10 border-primary/35 border-l-2 pl-5 text-muted-foreground leading-snug sm:pl-6"
          initial={{ opacity: 0, y: 16 }}
          style={{ fontSize: "clamp(1.15rem, 3vw, 1.75rem)" }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          {t.sentenceLead}{" "}
          <Popover onOpenChange={setOpen} open={open}>
            <PopoverTrigger asChild>
              <button
                aria-label={t.changeSubject}
                className="group inline-flex items-baseline gap-1.5 rounded-sm font-medium text-foreground underline decoration-primary/50 decoration-dashed underline-offset-[7px] transition-colors hover:text-primary hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background"
                type="button"
              >
                {selected.label}
                <ChevronDown
                  aria-hidden
                  className="h-[0.6em] w-[0.6em] shrink-0 self-center text-primary/70 transition-transform duration-200 group-data-[state=open]:rotate-180"
                />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-64 p-2">
              <div className="grid gap-1">
                {options.map(({ key, label }) => {
                  const isActive = key === intent;
                  return (
                    <button
                      aria-pressed={isActive}
                      className={cn(
                        "rounded-lg px-2.5 py-2 text-left text-sm transition-colors",
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
                      {label}
                    </button>
                  );
                })}
              </div>
            </PopoverContent>
          </Popover>
        </motion.p>

        {/* The address is the button — no card, no wrapper, no icon tile. */}
        <motion.div
          className="mt-12 sm:mt-16"
          initial={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          viewport={{ once: true }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <a
            className="group inline-flex max-w-full items-start gap-2 font-semibold tracking-tight transition-colors duration-200 hover:text-primary focus-visible:rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background sm:items-center"
            href={mailtoFor(selected.subject, selected.body)}
            style={{ fontSize: "clamp(1.25rem, 4.5vw, 2.25rem)" }}
          >
            <span className="min-w-0 break-all">{EMAIL}</span>
            <ArrowUpRight
              aria-hidden
              className="mt-[0.35em] h-[0.55em] w-[0.55em] shrink-0 text-primary transition-transform duration-200 group-hover:-translate-y-1 group-hover:translate-x-1 sm:mt-0"
            />
          </a>

          {/* One quiet line. mailto: is a dead end for anyone on webmail without
              a registered handler, so the copy fallback sits right beside it. */}
          <p className="mt-4 text-muted-foreground text-sm">
            {t.emailHint}{" "}
            <button
              className="underline decoration-border underline-offset-4 transition-colors hover:text-foreground hover:decoration-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={copyEmail}
              type="button"
            >
              {copied ? t.copied : t.copyEmail}
            </button>
          </p>
        </motion.div>
      </div>
    </section>
  );
}

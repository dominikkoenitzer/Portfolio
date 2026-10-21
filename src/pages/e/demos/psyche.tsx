import { AnimatePresence, motion } from "framer-motion";
import { type KeyboardEvent, useEffect, useRef, useState } from "react";
import { Action, BarText, Demo, Frame, Pills } from "../kit";
import { useMotionSafe, useSeenOnce, wait } from "../motion";
import { RING } from "../style";

/*
 * Psyche, told through its key moments. The codes are real TOTP codes
 * (RFC 6238, SHA-1, six digits, 30 seconds) computed in the browser from
 * made-up secrets. Matching and remembering follow Psyche's SiteMatcher and
 * AppController: Exact when the host is one of the account's domains or
 * under one, Probable when the site's name is the issuer's name with each
 * hyphen where the issuer breaks words; only one Exact match is typed without
 * asking, and picking any other account asks before remembering the site.
 * The services Psyche knows by name are left out; their list is real brands.
 * Colours are the picker's own (Themes/Theme.xaml).
 */

const APP = {
  bg: "#131932",
  raised: "rgb(255 255 255 / 0.06)",
  line: "rgb(255 255 255 / 0.08)",
  text: "#edf1fa",
  secondary: "#8c95ad",
  hint: "#6b7490",
  accent: "#5ec8ff",
  alarm: "#ff8a7a",
  track: "rgb(255 255 255 / 0.1)",
};

/** Code and ring turn to the alarm colour at five seconds or less, as in Psyche. */
const WARNING_SECONDS = 5;
/** FreshCodeAsync waits out any code with two whole seconds or less left. */
const FRESH_MARGIN = 2;

/* ------------------------------------------------------------------ */
/* TOTP, as every authenticator computes it                            */
/* ------------------------------------------------------------------ */

function base32(secret: string): Uint8Array<ArrayBuffer> {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  for (const c of secret.replace(/=+$/, "").toUpperCase()) bits += alphabet.indexOf(c).toString(2).padStart(5, "0");
  const out = new Uint8Array(new ArrayBuffer(Math.floor(bits.length / 8)));
  for (let i = 0; i < out.length; i += 1) out[i] = Number.parseInt(bits.slice(i * 8, i * 8 + 8), 2);
  return out;
}

async function totp(secret: string, counter: number): Promise<string> {
  const key = await crypto.subtle.importKey("raw", base32(secret), { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const msg = new ArrayBuffer(8);
  new DataView(msg).setUint32(4, counter);
  const mac = new Uint8Array(await crypto.subtle.sign("HMAC", key, msg));
  const o = mac[mac.length - 1] & 0x0f;
  const n = ((mac[o] & 0x7f) << 24) | (mac[o + 1] << 16) | (mac[o + 2] << 8) | mac[o + 3];
  return String(n % 1_000_000).padStart(6, "0");
}

/** The demo's clock: real time plus an offset the demo may jump, ticking four times a second. */
function useClock(offset = 0) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(t);
  }, []);
  const at = now + offset;
  return { counter: Math.floor(at / 30_000), left: 30 - ((at / 1000) % 30) };
}

/** The codes for a window, and the window they were computed for (they arrive a moment after it starts). */
function useCodes(secrets: string[], counter: number) {
  const [state, setState] = useState<{ codes: string[]; at: number }>({ codes: [], at: -1 });
  const key = secrets.join("|");
  useEffect(() => {
    let live = true;
    Promise.all(secrets.map((s) => totp(s, counter))).then((codes) => live && setState({ codes, at: counter }));
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, counter]);
  return state;
}

/** The countdown ring Psyche draws beside every code. */
function Ring({ left, size = 16 }: { left: number; size?: number }) {
  const r = 6;
  const c = 2 * Math.PI * r;
  return (
    <svg aria-hidden className="shrink-0 -rotate-90" height={size} viewBox="0 0 16 16" width={size}>
      <circle cx="8" cy="8" fill="none" r={r} stroke={APP.track} strokeWidth="2" />
      <circle
        cx="8"
        cy="8"
        fill="none"
        r={r}
        stroke={Math.ceil(left) <= WARNING_SECONDS ? APP.alarm : APP.accent}
        strokeDasharray={c}
        strokeDashoffset={c * (1 - left / 30)}
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

const split = (code?: string) => (code ? `${code.slice(0, 3)} ${code.slice(3)}` : "··· ···");

/** The keycap Psyche draws in its footer hints. */
function Key({ children }: { children: string }) {
  return (
    <span className="rounded px-1.5 py-px text-[0.6875rem]" style={{ background: APP.raised, color: APP.hint, boxShadow: `inset 0 0 0 1px ${APP.line}` }}>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Matching                                                            */
/* ------------------------------------------------------------------ */

type Account = { issuer: string; user: string; domains: string[]; secret: string };

const ACCOUNTS: Account[] = [
  { issuer: "Lumen", user: "you@example.com", domains: ["lumen.example"], secret: "KRSXG5CTMVRXEZLU" },
  { issuer: "Acme Corp", user: "work@example.com", domains: [], secret: "GEZDGNBVGY3TQOJQ" },
  { issuer: "Northwind", user: "you@example.com", domains: ["northwind.example"], secret: "JBSWY3DPEHPK3PXP" },
];

type Level = "Exact" | "Probable" | null;

/** Psyche's rule, with the last label standing in for the public suffix. */
function match(host: string, domains: string[], issuer: string): Level {
  for (const d of domains) if (host === d || host.endsWith(`.${d}`)) return "Exact";
  const labels = host.split(".");
  const name = labels[labels.length - 2] ?? "";
  const words = issuer.toLowerCase().split(/\s+/);
  if (name.replace(/-/g, "") !== words.join("")) return null;
  // Each hyphen in the site's name must stand where the issuer breaks words.
  if (name.includes("-") && name !== words.join("-")) return null;
  return "Probable";
}

/** The registrable domain Psyche would remember for a host. */
const siteOf = (host: string) => host.split(".").slice(-2).join(".");

const SITES = [
  { value: "mail.lumen.example", label: "mail.lumen.example" },
  { value: "acme-corp.example", label: "acme-corp.example" },
  { value: "acm-ecorp.example", label: "acm-ecorp.example" },
];

type Phase = "idle" | "picker" | "ask" | "typing" | "typed";

/** The key moment: Alt+P on a sign-in page types the right code, or asks. */
export function PickerDemo() {
  const [ref, seen] = useSeenOnce<HTMLDivElement>();
  const { reduced, spring, fade } = useMotionSafe();
  const [site, setSite] = useState(SITES[0].value);
  const [phase, setPhase] = useState<Phase>("idle");
  const [typed, setTyped] = useState("");
  const [asked, setAsked] = useState<number | null>(null);
  const [note, setNote] = useState("");
  // Domains learned in this demo, per account: what "Remember" saves into the vault.
  const [learned, setLearned] = useState<string[][]>(ACCOUNTS.map(() => []));
  const { counter, left } = useClock();
  const { codes } = useCodes(
    ACCOUNTS.map((a) => a.secret),
    counter,
  );
  const run = useRef(0);
  const firstRow = useRef<HTMLButtonElement>(null);
  const yes = useRef<HTMLButtonElement>(null);

  const levels = ACCOUNTS.map((a, i) => match(site, [...a.domains, ...learned[i]], a.issuer));
  const weight = (l: Level) => (l === "Exact" ? 2 : l ? 1 : 0);
  const ranked = ACCOUNTS.map((a, i) => ({ a, i, level: levels[i] })).sort((x, y) => weight(y.level) - weight(x.level));
  const exact = ranked.filter((r) => r.level === "Exact");

  const typeCode = async (code: string, after: string) => {
    const id = ++run.current;
    setPhase("typing");
    setTyped("");
    await wait(reduced ? 0 : 160);
    for (let i = 1; i <= 6; i += 1) {
      if (run.current !== id) return;
      setTyped(code.slice(0, i));
      await wait(reduced ? 0 : 55);
    }
    if (run.current !== id) return;
    setNote(after);
    setPhase("typed");
  };

  const press = () => {
    run.current++;
    setTyped("");
    setAsked(null);
    // One exact match and the cursor in a field: typed at once, no picker.
    if (exact.length === 1 && codes[exact[0].i]) void typeCode(codes[exact[0].i], "Typed without asking: exactly one account belongs to this site.");
    else setPhase("picker");
  };

  // Played once when it first comes into view: Alt+P on a site with one exact
  // match. The timer is not cleared on re-render; `played` and `run` guard it.
  const played = useRef(false);
  useEffect(() => {
    if (!seen || reduced || played.current || !codes.length) return;
    played.current = true;
    window.setTimeout(() => run.current === 0 && press(), 500);
  });

  // The picker takes the keyboard focus, as Psyche's own window does.
  useEffect(() => {
    if (phase === "picker") firstRow.current?.focus({ preventScroll: true });
    if (phase === "ask") yes.current?.focus({ preventScroll: true });
  }, [phase]);

  const pick = (i: number) => {
    if (levels[i] === "Exact") {
      void typeCode(codes[i], "Typed the picked account's code.");
      return;
    }
    setAsked(i);
    setPhase("ask");
  };

  const answer = (remember: boolean) => {
    if (asked === null) return;
    const i = asked;
    const domain = siteOf(site);
    if (remember) setLearned((all) => all.map((d, j) => (j === i ? [...new Set([...d, domain])] : d)));
    void typeCode(
      codes[i],
      remember ? `Typed. ${domain} is now an exact match for ${ACCOUNTS[i].issuer}: press Alt+P again.` : "Typed, and nothing remembered: the next visit asks again.",
    );
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape" && (phase === "picker" || phase === "ask")) {
      e.preventDefault();
      setPhase("idle");
    } else if (phase === "ask" && (e.key === "Enter" || e.key.toLowerCase() === "n")) {
      e.preventDefault();
      answer(e.key === "Enter");
    }
  };

  const status =
    phase === "idle"
      ? "The cursor is in the code field. Press Alt+P."
      : phase === "picker"
        ? ranked[0].level === "Exact"
          ? "More than one account could be meant, so Psyche asks."
          : ranked[0].level === "Probable"
            ? "Acme Corp is only a probable match: listed first, never typed on its own."
            : "No account belongs to this site, so nothing is marked."
        : phase === "ask"
          ? "Nothing is typed until you answer."
          : phase === "typing"
            ? "Typing, one digit at a time."
            : note;

  const resetSite = (v: string) => {
    run.current++;
    setSite(v);
    setPhase("idle");
    setTyped("");
    setAsked(null);
  };

  return (
    <div ref={ref}>
      <Demo
        caption="Press Alt+P on each site. Only a site an account already belongs to gets its code without a question."
        height={420}
        label="Psyche choosing the right two-factor code for the site in front"
        live={phase === "typed" || phase === "picker" || phase === "ask" ? status : ""}
        phoneHeight={500}
      >
        <Frame
          bottom={
            <>
              <BarText>{status}</BarText>
              <Action onClick={press} primary>
                Alt+P
              </Action>
            </>
          }
          top={<Pills label="Site" onChange={resetSite} options={SITES} value={site} />}
        >
          {/* The sign-in page, as the browser shows it. */}
          <div className="absolute inset-0 overflow-hidden rounded-xl bg-background ring-1 ring-border" onKeyDown={onKey}>
            <div className="flex h-9 items-center gap-2 border-border border-b px-3">
              <span aria-hidden className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span className="h-2 w-2 rounded-full bg-foreground/15" key={i} />
                ))}
              </span>
              <span className="min-w-0 flex-1 truncate rounded-md bg-foreground/[0.06] px-2.5 py-1 font-mono text-[0.6875rem] text-foreground/75">
                https://{site}/verify
              </span>
            </div>
            <div className="px-5 pt-5 sm:px-8 sm:pt-7">
              <p className="m-0 font-semibold text-[0.9375rem]">Two-step verification</p>
              <p className="m-0 mt-1 text-[0.75rem] text-muted-foreground">Enter the 6-digit code from your authenticator.</p>
              <div className="mt-4 flex items-center gap-2.5">
                <div className="flex h-10 w-44 items-center rounded-lg px-3 font-mono text-[1rem] tracking-[0.2em] ring-1 ring-primary/60">
                  <span aria-hidden>{typed}</span>
                  {phase !== "typed" ? <span aria-hidden className="ml-px h-4 w-px animate-pulse bg-foreground/70" /> : null}
                </div>
                <span aria-hidden className="flex h-10 items-center rounded-lg bg-foreground/[0.08] px-4 font-medium text-[0.8125rem] text-foreground/80">
                  Verify
                </span>
              </div>
              <p aria-hidden className="m-0 mt-4 text-[0.75rem] text-muted-foreground">
                No access to your authenticator? Use a recovery code.
              </p>
            </div>

            {/* Psyche's picker, a window of its own over the page. */}
            <AnimatePresence>
              {phase === "picker" || phase === "ask" ? (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute inset-x-2 top-2 bottom-2 flex flex-col overflow-hidden rounded-lg shadow-[0_24px_48px_-20px_rgb(0_0_0/0.7)] sm:inset-x-auto sm:top-1/2 sm:bottom-auto sm:left-1/2 sm:w-[23rem] sm:-translate-x-1/2 sm:-translate-y-1/2"
                  exit={{ opacity: 0, y: 6 }}
                  initial={{ opacity: 0, y: 6 }}
                  role="dialog"
                  aria-label="Psyche picker"
                  style={{ background: APP.bg, color: APP.text, boxShadow: `inset 0 0 0 1px ${APP.line}` }}
                  transition={fade}
                >
                  <div className="flex items-center gap-3 px-4 py-2.5" style={{ boxShadow: `inset 0 -1px 0 ${APP.line}` }}>
                    <span className="flex-1 text-[0.875rem]" style={{ color: APP.hint }}>
                      Search accounts
                    </span>
                    <span className="font-mono text-[0.6875rem]" style={{ color: APP.hint }}>
                      {site}
                    </span>
                  </div>
                  <ul className="m-0 flex min-h-0 flex-1 list-none flex-col gap-0.5 overflow-hidden p-1.5">
                    {ranked.map(({ a, i, level }, row) => {
                      const selected = phase === "ask" ? asked === i : row === 0;
                      const warn = Math.ceil(left) <= WARNING_SECONDS;
                      return (
                        <motion.li key={a.issuer} layout transition={{ layout: spring }}>
                          <button
                            className={`flex h-12 w-full items-center gap-3 rounded-md px-2.5 text-left ${RING}`}
                            disabled={phase === "ask"}
                            onClick={() => pick(i)}
                            ref={row === 0 ? firstRow : undefined}
                            style={{ background: selected ? APP.raised : "transparent" }}
                            type="button"
                          >
                            <span className="min-w-0 flex-1">
                              <span className="flex items-baseline gap-2 font-medium text-[0.8125rem] leading-tight">
                                {a.issuer}
                                {level === "Exact" ? (
                                  <span className="font-medium text-[0.6875rem]" style={{ color: APP.accent }}>
                                    This site
                                  </span>
                                ) : null}
                              </span>
                              <span className="block truncate text-[0.75rem] leading-tight" style={{ color: APP.secondary }}>
                                {a.user}
                              </span>
                            </span>
                            <span
                              className="font-mono font-semibold text-[1.0625rem] tabular-nums"
                              style={{ color: warn ? APP.alarm : selected ? APP.accent : APP.text }}
                            >
                              {split(codes[i])}
                            </span>
                            <Ring left={left} />
                          </button>
                        </motion.li>
                      );
                    })}
                  </ul>
                  <div className="flex min-h-11 items-center gap-3 px-4 text-[0.6875rem]" style={{ boxShadow: `inset 0 1px 0 ${APP.line}`, color: APP.hint }}>
                    {phase === "ask" && asked !== null ? (
                      <>
                        <span className="min-w-0 flex-1 truncate" style={{ color: APP.text }}>
                          Remember {siteOf(site)} for {ACCOUNTS[asked].issuer}?
                        </span>
                        <button className={`flex h-11 items-center gap-1.5 sm:h-8 ${RING}`} onClick={() => answer(true)} ref={yes} type="button">
                          <Key>Enter</Key> Yes
                        </button>
                        <button className={`flex h-11 items-center gap-1.5 sm:h-8 ${RING}`} onClick={() => answer(false)} type="button">
                          <Key>N</Key> No
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="flex-1" style={{ color: APP.text }}>
                          Open Psyche
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Key>Enter</Key> Type
                        </span>
                        <span className="hidden items-center gap-1.5 sm:flex">
                          <Key>Esc</Key> Close
                        </span>
                      </>
                    )}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </Frame>
      </Demo>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* A fresh code                                                         */
/* ------------------------------------------------------------------ */

type Fresh = "idle" | "waiting" | "typing" | "typed";

/** A code typed in its last seconds expires on the way, so Psyche waits for the next. */
export function FreshDemo() {
  const { reduced, fade } = useMotionSafe();
  const [offset, setOffset] = useState(0);
  const { counter, left } = useClock(offset);
  const { codes, at } = useCodes([ACCOUNTS[2].secret], counter);
  const [state, setState] = useState<Fresh>("idle");
  const [typed, setTyped] = useState("");
  const [spare, setSpare] = useState(0);
  const [waited, setWaited] = useState(false);
  const pendingFor = useRef<number | null>(null);
  const run = useRef(0);

  const typeOut = async (code: string) => {
    const id = ++run.current;
    setState("typing");
    for (let i = 1; i <= 6; i += 1) {
      if (run.current !== id) return;
      setTyped(code.slice(0, i));
      await wait(reduced ? 0 : 55);
    }
    if (run.current !== id) return;
    setSpare(Math.floor(30 - (((Date.now() + offset) / 1000) % 30)));
    setState("typed");
  };

  // When waiting, the next window's code is typed the moment it exists.
  useEffect(() => {
    if (state !== "waiting" || pendingFor.current === null || at < pendingFor.current || !codes[0]) return;
    pendingFor.current = null;
    void typeOut(codes[0]);
  });

  const deliver = (secondsLeft: number) => {
    run.current++;
    setTyped("");
    if (Math.ceil(secondsLeft) <= FRESH_MARGIN) {
      pendingFor.current = counter + 1;
      setWaited(true);
      setState("waiting");
    } else if (codes[0]) {
      setWaited(false);
      void typeOut(codes[0]);
    }
  };

  /** Moves the demo's clock to the last second and a half of this code, then presses Alt+P. */
  const late = () => {
    const target = 1.4;
    const shift = (left - target) * 1000;
    setOffset((o) => o + shift);
    deliver(target);
  };

  const status =
    state === "waiting"
      ? `${split(codes[0])} has under 2 s left. Psyche waits for the next code.`
      : state === "typing"
        ? "Typing."
        : state === "typed"
          ? waited
            ? `Typed ${split(typed)}, the new code, with ${spare} s to spare.`
            : `Typed ${split(typed)} with ${spare} s to spare.`
          : `${Math.ceil(left)} s left on this code.`;
  const warn = Math.ceil(left) <= WARNING_SECONDS;

  return (
    <Demo
      caption="Press Alt+P late: the clock jumps to the code's last second, and Psyche types the next code instead."
      height={300}
      label="Psyche waiting for a fresh code when the current one is about to expire"
      live={state === "idle" || state === "typing" ? "" : status}
      phoneHeight={380}
    >
      <Frame
        bottom={
          <>
            <BarText>{status}</BarText>
            {/* One group, so on a phone both actions wrap below the text together. */}
            <span className="ml-auto flex gap-2">
              <Action onClick={() => deliver(left)}>Alt+P now</Action>
              <Action onClick={late} primary>
                Alt+P late
              </Action>
            </span>
          </>
        }
      >
        <div className="absolute inset-0 flex flex-col justify-center gap-5 rounded-xl px-5 sm:px-8" style={{ background: APP.bg, color: APP.text }}>
          <div className="flex items-center gap-3">
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-[0.875rem]">Northwind</span>
              <span className="block text-[0.75rem]" style={{ color: APP.secondary }}>
                you@example.com
              </span>
            </span>
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                animate={{ opacity: 1, y: 0 }}
                className="font-mono font-semibold text-[1.375rem] tabular-nums sm:text-[1.5rem]"
                exit={{ opacity: 0, y: -6 }}
                initial={{ opacity: 0, y: 6 }}
                key={codes[0] ?? "none"}
                style={{ color: warn ? APP.alarm : APP.text }}
                transition={fade}
              >
                {split(codes[0])}
              </motion.span>
            </AnimatePresence>
            <Ring left={left} size={18} />
          </div>
          <div className="flex items-center gap-3" style={{ boxShadow: `inset 0 1px 0 ${APP.line}`, paddingTop: 20 }}>
            <span className="flex-1 text-[0.75rem]" style={{ color: APP.secondary }}>
              Typed into the page
            </span>
            <span
              className="flex h-10 w-[7.5rem] shrink-0 items-center rounded-lg px-3 font-mono sm:w-40 text-[1rem] tracking-[0.2em]"
              style={{ background: APP.raised, boxShadow: `inset 0 0 0 1px ${state === "waiting" ? APP.alarm : APP.line}` }}
            >
              {typed}
              {state === "waiting" ? (
                <span className="text-[0.75rem] tracking-normal" style={{ color: APP.hint }}>
                  waiting…
                </span>
              ) : null}
            </span>
          </div>
        </div>
      </Frame>
    </Demo>
  );
}

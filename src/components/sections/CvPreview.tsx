import { ExternalLink, FileText, X } from "lucide-react";
import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/button";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useOverlayLayer } from "@/hooks/use-overlay-layer";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

/**
 * One "View CV" button that opens the CV for the language the site is in.
 *
 * There are two documents, English and German, and they used to sit on
 * /timeline as two separate links. The visitor's language already says which
 * one they want: German gets the Lebenslauf, everyone else the Curriculum
 * Vitae (there is no French or Chinese edition).
 *
 * Both are standalone HTML pages under public/cv/, so the preview is an
 * iframe of the real document rather than a rendered copy. Same origin, which
 * is why `frame-src 'self'` is in the production CSP (vercel.json): with
 * `'none'` this panel would be blank in production and perfect in dev.
 */
const DOCUMENTS = {
  de: { href: "/cv/lebenslauf.html", name: "Lebenslauf" },
  other: { href: "/cv/curriculum-vitae.html", name: "Curriculum Vitae" },
} as const;

export function CvPreview() {
  const { language } = useLanguage();
  const t = translations[language].about;
  const doc = language === "de" ? DOCUMENTS.de : DOCUMENTS.other;
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        <FileText aria-hidden />
        {t.viewCv}
      </Button>
      {open ? (
        <CvDialog
          closeLabel={t.cvClose}
          href={doc.href}
          name={doc.name}
          newTabLabel={t.cvOpenNewTab}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}

/**
 * The preview panel: a titled frame over a dimmed page. Standard dialog
 * behaviour, the same as the project lightbox: focus moves in and is restored,
 * Escape and a click on the backdrop close it, Tab stays inside, and the page
 * behind it cannot scroll.
 */
function CvDialog({
  closeLabel,
  href,
  name,
  newTabLabel,
  onClose,
}: {
  closeLabel: string;
  href: string;
  name: string;
  newTabLabel: string;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  useBodyScrollLock(true);

  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();
    return () => previousFocus.current?.focus?.();
  }, []);

  // Only the overlay in front answers Escape: the palette can be opened over
  // this dialog, and one keypress used to close both.
  const isTopLayer = useOverlayLayer(true);

  /*
   * Move focus into the dialog on open. The Tab trap below only fires on keys
   * pressed inside the panel, so with focus left on <body> it never ran: 14
   * tabs from the open dialog walked the whole page behind it and never
   * reached Close. Taking the iframe out of the tab order removed the one
   * element that used to catch focus by accident, which is what exposed this.
   */
  useEffect(() => {
    const first = panelRef.current?.querySelector<HTMLElement>(
      'button, [href], [tabindex]:not([tabindex="-1"])',
    );
    first?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isTopLayer(event)) onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, isTopLayer]);

  // The iframe is a focus stop of its own and swallows Tab once inside it, so
  // the trap only has to hold the two controls in the header.
  const trapTab = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const items = panelRef.current?.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled]), iframe",
    );
    if (!items || items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[90] flex flex-col p-3 sm:p-6">
      {/* Backdrop: click to dismiss. */}
      <button
        aria-hidden
        className="-z-10 fixed inset-0 cursor-default bg-foreground/40"
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />

      <div
        aria-labelledby="cv-preview-title"
        aria-modal="true"
        className="mx-auto flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-border/60 bg-card"
        onKeyDown={trapTab}
        ref={panelRef}
        role="dialog"
      >
        <div className="flex items-center gap-3 border-border/60 border-b px-4 py-3">
          <h2
            className="min-w-0 flex-1 truncate font-semibold text-base"
            id="cv-preview-title"
          >
            {name}
          </h2>
          <a
            className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-muted-foreground text-sm transition-colors duration-200 ease-out hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            href={href}
            rel="noopener noreferrer"
            target="_blank"
          >
            {newTabLabel}
            <ExternalLink aria-hidden className="h-3.5 w-3.5" />
          </a>
          <button
            aria-label={closeLabel}
            className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors duration-200 ease-out hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
            onClick={onClose}
            ref={closeRef}
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <CvFrame href={href} name={name} />
      </div>
    </div>,
    document.body,
  );
}

/** The CV's own layout is two columns and stops making sense under this. */
const DOC_WIDTH = 860;

/**
 * The document itself. Below its natural width the frame is rendered at that
 * width and scaled down to fit, so a phone shows the whole page instead of a
 * window onto its top-left corner. `bg-background` under it so the frame never
 * flashes white on this cream page while the file loads.
 */
function CvFrame({ href, name }: { href: string; name: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    const node = boxRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setBox({ width, height });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const scale = box && box.width < DOC_WIDTH ? box.width / DOC_WIDTH : 1;

  return (
    // The frame is positioned out of flow: at 860px wide it would otherwise
    // feed its own width back into the box being measured.
    <div
      className="relative min-h-0 flex-1 overflow-hidden bg-background"
      ref={boxRef}
    >
      {/* `max-w-none`: index.css carries a blanket `* { max-width: 100% }`
          under 640px, which would clamp the 860px frame back to the panel
          width and then scale it again, painting the document at 42%. */}
      {/* Not a tab stop: the embedded document swallows Escape and Shift+Tab,
          so once focus entered the frame there was no keyboard route back out
          of the dialog — a keyboard trap, and the one WCAG A failure on the
          site. The CV is reachable as a normal page from the button beside
          Close, so nothing is lost by taking the frame out of the tab order. */}
      <iframe
        className="absolute top-0 left-0 max-w-none border-0"
        src={href}
        tabIndex={-1}
        style={
          scale < 1 && box
            ? {
                width: DOC_WIDTH,
                height: box.height / scale,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }
            : { width: "100%", height: "100%" }
        }
        title={name}
      />
    </div>
  );
}

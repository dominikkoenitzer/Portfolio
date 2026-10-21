import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { SEO } from "@/components/seo";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";
import { translations } from "@/lib/translations";

/**
 * The measurement page at /diag: the shared diagnostic panel, mounted on a page
 * no link points to and no crawler indexes (noindex here, in the prerendered
 * document and in the response header). It measures this browser for ten
 * seconds and shows the result; a report leaves the device only when the
 * visitor presses Send.
 *
 * Where a report goes is set at build time by VITE_DIAG_ENDPOINT. Without it the
 * panel still measures and shows everything, and Send says that no address is
 * set up instead of posting anywhere.
 */

const ENDPOINT: string | undefined = import.meta.env.VITE_DIAG_ENDPOINT || undefined;
const RELEASE: string =
  import.meta.env.VITE_VERCEL_GIT_COMMIT_SHA?.slice(0, 12) || "local";

/** The panel waits this long so it measures the page settled, as visitors see it. */
const SETTLE_MS = 1500;

/** What the site chose to draw on this device, from the same queries it uses. */
function quality() {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  return {
    motion: reduced ? "reduced" : "full",
    sphere: !reduced && matchMedia("(min-width: 768px)").matches ? "on" : "off",
    tree: !reduced && matchMedia("(min-width: 1024px)").matches ? "on" : "off",
    theme: document.documentElement.classList.contains("dark") ? "dark" : "light",
  };
}

/** The site's own WebGL canvas (the sky), for the panel's screenshot. */
const siteCanvas = () =>
  [...document.querySelectorAll("canvas")].find((c) => !c.closest("[data-diag-panel]"));

/**
 * With no endpoint, a click on Send is taken before the panel's own handler
 * sees it (capture phase, on the panel's shadow root) and answered in the
 * panel's status line.
 */
function holdSend(message: string) {
  const root = document.querySelector("[data-diag-panel]")?.shadowRoot;
  if (!root) return;
  root.addEventListener(
    "click",
    (event) => {
      const send = (event.target as Element | null)?.closest?.("button.primary");
      if (!send) return;
      event.stopImmediatePropagation();
      event.preventDefault();
      const status = send.closest("section")?.querySelector('p[role="status"]');
      if (status) status.textContent = message;
      // A click does not focus a button in every browser (Safari), and the
      // panel closes on Escape only while focus is inside it.
      (send as HTMLElement).focus();
    },
    true,
  );
}

export default function Diagnostics() {
  const { language } = useLanguage();
  const t = translations[language].diagnostics;
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!open) return;
    let close: (() => void) | undefined;
    let cancelled = false;
    const timer = window.setTimeout(async () => {
      const diag = await import("@/vendor/diag/index.js");
      if (cancelled) return;
      diag.installDiag();
      const panel = diag.mountPanel({
        app: "portfolio",
        release: RELEASE,
        endpoint: ENDPOINT,
        lang: language === "de" ? "de" : "en",
        quality,
        canvas: siteCanvas,
        onClose: () => {
          close = undefined;
          // Closing on unmount comes through here too; only a visitor's close
          // swaps the panel for the button that brings it back.
          if (!cancelled) setOpen(false);
        },
      });
      close = panel.close;
      if (!ENDPOINT) holdSend(t.noEndpoint);
    }, SETTLE_MS);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      close?.();
    };
  }, [open, language, t.noEndpoint]);

  return (
    <section className="section-padding">
      <SEO description={t.seoDescription} nofollow noindex title={t.eyebrow} />
      <div className="mx-auto w-full max-w-3xl">
        <SectionHeading eyebrow={t.eyebrow} subtitle={t.body} title={t.title} />
        {!open && (
          <div className="mt-8 flex justify-center">
            <Button className="rounded-lg px-6" onClick={() => setOpen(true)} variant="cta">
              {t.reopen}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

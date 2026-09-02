import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, Bot, FileText, Github, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NAV_LINKS, SITE_CONFIG } from "@/constants";
import { revealOnScroll } from "@/lib/framer-animations";
import { useLanguage } from "@/lib/language-context";
import { REVEAL, stagger } from "@/lib/motion";
import { translations } from "@/lib/translations";

/**
 * The same path-to-nav-key map the Navbar keeps, repeated rather than shared:
 * it lives as a private const in `Navbar.tsx` and `constants/index.ts` holds
 * only the paths. Eight entries are cheaper to duplicate than a new module, but
 * a new nav route has to be added in both places.
 */
const NAV_KEY_BY_PATH: Record<string, keyof typeof translations.en.nav> = {
  "/": "home",
  "/about": "about",
  "/experience": "experience",
  "/skills": "skills",
  "/projects": "projects",
  "/services": "services",
  "/contact": "contact",
  "/donate": "donate",
};

/**
 * Column heading, in the secondary text colour (5.2:1) rather than
 * `.eyebrow`: the eyebrow is sage, and sage is the signal colour. Three of them
 * stacked in a footer on all 21 routes would stop being a signal.
 */
const COL_LABEL =
  "text-[11px] text-muted-foreground uppercase tracking-[0.18em]";

/**
 * Every footer link is a 44px row, so the whole grid is a column of legal
 * tap targets on a phone without any coarse-pointer fallback stretching them.
 * Colour is the only thing that moves on hover: a lift on a list of twelve
 * links reads as the page twitching.
 */
const LINK =
  "inline-flex min-h-[44px] items-center gap-2.5 rounded-sm text-muted-foreground text-sm transition-colors duration-200 ease-out hover:text-primary";

const ICON = "h-4 w-4 shrink-0 opacity-80";

export function Footer() {
  const { language } = useLanguage();
  const t = translations[language];
  const reduceMotion = useReducedMotion();
  const currentYear = new Date().getFullYear();

  const pages = NAV_LINKS.map((link) => ({
    to: link.targetId,
    name: t.nav[NAV_KEY_BY_PATH[link.targetId]] ?? link.name,
  }));

  // The CV documents are static files under public/, not routes, so they are
  // plain anchors (the pretty /cv and /lebenslauf URLs are Vercel redirects
  // and do not exist in dev).
  const elsewhere = [
    {
      href: SITE_CONFIG.github,
      icon: <Github className={ICON} />,
      label: "GitHub",
    },
    {
      href: "https://senbon.ch/",
      icon: <BookOpen className={ICON} />,
      label: t.footer.journal,
    },
    // One CV entry, the one that matches the language the site is in: German
    // gets the Lebenslauf, everyone else the Curriculum Vitae. Same rule as
    // the "View CV" button on /about.
    language === "de"
      ? {
          href: "/cv/lebenslauf.html",
          icon: <FileText className={ICON} />,
          label: "Lebenslauf",
        }
      : {
          href: "/cv/curriculum-vitae.html",
          icon: <FileText className={ICON} />,
          label: "Curriculum Vitae",
        },
    {
      href: "/llms.txt",
      icon: <Bot className={ICON} />,
      label: "llms.txt",
    },
  ];

  return (
    <footer className="border-border/30 border-t bg-background pb-safe">
      <motion.div
        className="mx-auto max-w-7xl px-6 py-12 sm:px-8 md:px-12 lg:px-16"
        {...revealOnScroll(reduceMotion, stagger())}
      >
        {/* Two columns from the smallest phone up: stacking three blocks made
            the footer a screen and a half tall, which is its own kind of
            afterthought. The identity block takes the full width above them. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-9 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-x-14">
          {/* Who this is, and the one-click way to reach him. */}
          <motion.div className="col-span-2 min-w-0 lg:col-span-1" variants={REVEAL}>
            <Link
              className="rounded-sm font-bold text-xl tracking-tight transition-colors duration-200 ease-out hover:text-primary"
              to="/"
            >
              Dominik Könitzer
            </Link>
            <p className="mt-1.5 text-muted-foreground text-sm">
              {t.footer.tagline}
            </p>

            <Button
              asChild
              className="mt-5 rounded-lg px-5"
              size="lg"
              variant="soft"
            >
              <a href={`mailto:${SITE_CONFIG.email}`}>
                <Mail className="h-4 w-4" />
                {t.footer.emailMe}
              </a>
            </Button>
          </motion.div>

          {/* The nav, repeated. The footer is the second place people scroll
              to and it used to offer exactly one link out of it. */}
          <motion.nav aria-labelledby="footer-pages" variants={REVEAL}>
            <h2 className={COL_LABEL} id="footer-pages">
              {t.footer.pages}
            </h2>
            {/* Eight links in one file is a tall thin column next to two short
                ones, so from lg they run in two. */}
            <ul className="mt-2 lg:grid lg:grid-cols-2 lg:gap-x-5">
              {pages.map((page) => (
                <li key={page.to}>
                  <Link className={LINK} to={page.to}>
                    {page.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.nav>

          <motion.nav aria-labelledby="footer-elsewhere" variants={REVEAL}>
            <h2 className={COL_LABEL} id="footer-elsewhere">
              {t.footer.elsewhere}
            </h2>
            <ul className="mt-2">
              {elsewhere.map((item) => (
                <li key={item.href}>
                  {/* Every one of these leaves the app, so they are anchors,
                      and the two off-site ones open in a new tab. The icon is
                      decoration: the label carries the name, which is what the
                      two bare glyphs here never did. */}
                  <a
                    className={LINK}
                    href={item.href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {item.icon}
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>
        </div>

        {/* The legal line and the policy. The language control lives in the
            header only. */}
        <motion.div
          className="mt-10 flex flex-col items-center gap-3 border-border/40 border-t pt-5 text-center sm:flex-row sm:justify-between sm:gap-6 sm:text-left"
          variants={REVEAL}
        >
          <p className="text-muted-foreground text-sm">
            © {currentYear} Dominik Könitzer. {t.footer.rights}
          </p>

          <Link className={`${LINK} sm:shrink-0`} to="/privacy">
            {t.footer.privacyPolicy}
          </Link>
        </motion.div>
      </motion.div>
    </footer>
  );
}

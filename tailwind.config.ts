import type { Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // The illustration's own three, on top of the shadcn set (see the
        // token table in index.css). `blush` is not a Tailwind scale, but
        // `sage` sits next to Tailwind's `green`/`lime` ones on purpose: a
        // `bg-lime-400` would be off-palette here, so nothing reaches for it.
        lilac: "hsl(var(--lilac))",
        sage: {
          DEFAULT: "hsl(var(--sage))",
          bright: "hsl(var(--sage-bright))",
          deep: "hsl(var(--sage-deep))",
          foreground: "hsl(var(--sage-foreground))",
        },
        blush: {
          DEFAULT: "hsl(var(--blush))",
          deep: "hsl(var(--blush-deep))",
          foreground: "hsl(var(--blush-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Zen Kaku Gothic New", ...fontFamily.sans],
        heading: ["Zen Maru Gothic", ...fontFamily.sans],
        display: ["Zen Maru Gothic", ...fontFamily.sans],
        // The hero name only: the ExtraBold rounded face, the one place a
        // title-card treatment earns its keep.
        title: ["M PLUS Rounded 1c", ...fontFamily.sans],
      },
      transitionTimingFunction: {
        "in-expo": "cubic-bezier(0.95, 0.05, 0.795, 0.035)",
        "out-expo": "cubic-bezier(0.19, 1, 0.22, 1)",
        // The CSS half of EASE_OUT in lib/motion.ts, as a named token. An
        // arbitrary `ease-[var(--ease-out)]` is reported ambiguous by Tailwind
        // and emits no utility at all, so a CSS transition written that way
        // silently falls back to the browser default curve.
        bloom: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;

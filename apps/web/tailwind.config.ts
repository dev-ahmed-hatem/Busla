import type { Config } from "tailwindcss";

/**
 * Tailwind reads brand + status colours from the @busla/tokens CSS variables
 * (injected via globals.css), so the palette stays single-sourced. Prefer
 * logical utilities (ps-/pe-/ms-/me-) for RTL-safe layout.
 */
const config: Config = {
  content: [
    "./src/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "var(--color-brand-navy)",
          amber: "var(--color-brand-amber)",
          bus: "var(--color-brand-bus-yellow)",
        },
        status: {
          ontime: "var(--color-status-on-time)",
          delayed: "var(--color-status-delayed)",
          issue: "var(--color-status-issue)",
          info: "var(--color-status-info)",
        },
        surface: "var(--color-surface)",
        background: "var(--color-background)",
        border: "var(--color-border)",
      },
      borderRadius: {
        card: "var(--radius-lg)",
        pill: "var(--radius-pill)",
      },
      fontFamily: {
        sans: "var(--font-family)",
      },
    },
  },
  plugins: [],
};

export default config;

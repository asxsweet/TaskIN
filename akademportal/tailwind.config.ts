import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#1E52CC",
          tint: "#E8EFFE",
          dark: "#0D1F4E",
        },
        success: {
          DEFAULT: "#0A7A5E",
          tint: "#D9F5EE",
        },
        warning: {
          DEFAULT: "#B45309",
          tint: "#FEF3C7",
        },
        danger: {
          DEFAULT: "#B91C1C",
          tint: "#FEE2E2",
        },
        neutral: {
          50: "#FAFAFA",
          100: "#F4F4F5",
          200: "#E4E4E7",
          300: "#D4D4D8",
          400: "#A1A1AA",
          500: "#71717A",
          600: "#52525B",
          700: "#3F3F46",
          800: "#27272A",
          900: "#18181B",
          950: "#0A0A0F",
        },
      },
      fontFamily: {
        display: ["var(--font-instrument-serif)", "serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "monospace"],
      },
      borderRadius: {
        xs: "4px",
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
        pill: "9999px",
      },
      boxShadow: {
        xs: "0 1px 2px rgba(0, 0, 0, 0.05)",
        sm: "0 2px 8px rgba(0, 0, 0, 0.06)",
        focus: "0 0 0 3px rgba(30, 82, 204, 0.25)",
      },
    },
  },
  plugins: [],
};

export default config;

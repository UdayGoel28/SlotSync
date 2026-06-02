import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
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
        // SlotSync organic palette
        sage: {
          50: "#F5F7F4",
          100: "#E8EDE6",
          200: "#D4DDD0",
          300: "#B5C4AF",
          400: "#8FA786",
          500: "#6B8A60",
        },
        cream: {
          50: "#FDFCFA",
          100: "#F5F0EA",
          200: "#EDE5DB",
          300: "#E0D3C4",
        },
        coral: {
          50: "#FDF5F3",
          100: "#F7C4BC",
          200: "#F2A99A",
          300: "#E88A78",
          400: "#D4846A",
          500: "#C06B52",
        },
        terra: {
          DEFAULT: "#D4846A",
          dark: "#B8704F",
          light: "#E0A08A",
        },
        brand: {
          50: "#FDF5F3",
          100: "#F7C4BC",
          200: "#F2A99A",
          300: "#E88A78",
          400: "#D4846A",
          500: "#C06B52",
          600: "#B8704F",
          700: "#A05E42",
          800: "#8A4E36",
          900: "#6E3E2B",
        },
      },
      fontFamily: {
        sans: ['"DM Sans"', "system-ui", "sans-serif"],
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;

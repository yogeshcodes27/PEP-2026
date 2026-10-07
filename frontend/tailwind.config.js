/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#FFFFFF",
        surface: {
          DEFAULT: "#FAFAFA",
          strong: "#F4F4F5",
        },
        border: {
          DEFAULT: "#E4E4E7",
        },
        text: {
          primary: "#0A0A0A",
          secondary: "#52525B",
        },
        charcoal: {
          DEFAULT: "#18181B",
          hover: "#27272A",
        },
        teal: {
          50: "#F0FDFA",
          100: "#CCFBF1",
          200: "#99F6E4",
          600: "#0D9488",
          700: "#0F766E",
          800: "#115E59",
          900: "#134E4A",
        },
        brand: {
          DEFAULT: "#0F766E",
          light: "#F0FDFA",
          border: "#CCFBF1",
          hover: "#115E59",
          dark: "#134E4A",
        },
        warning: {
          DEFAULT: "#B45309",
          bg: "#FFFBEB",
          border: "#FDE68A",
        },
        danger: {
          DEFAULT: "#B91C1C",
          bg: "#FEF2F2",
          border: "#FECACA",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "monospace",
        ],
      },
      borderRadius: {
        card: "12px",
        control: "8px",
      },
      maxWidth: {
        content: "1120px",
      },
    },
  },
  plugins: [],
};

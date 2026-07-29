/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F7F0DE",      // warm sandstone paper
        ink: "#241C15",        // near-black warm ink for text
        indigo: {
          DEFAULT: "#22314A",
          dark: "#141C29",
        },
        marigold: {
          DEFAULT: "#E8A23B",
          dark: "#C9821F",
        },
        peacock: {
          DEFAULT: "#0F6E5D",
          dark: "#0A4B3F",
        },
        maroon: {
          DEFAULT: "#8C2F39",
          dark: "#6B1F27",
        },
      },
      fontFamily: {
        display: ["'Yeseva One'", "serif"],
        body: ["'Karla'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      backgroundImage: {
        "booti-row":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='16' viewBox='0 0 40 16'%3E%3Cpath d='M4 14C4 8 8 2 12 2s8 6 8 12M20 14C20 8 24 2 28 2s8 6 8 12' stroke='%23E8A23B' stroke-width='1.4' fill='none' stroke-linecap='round'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

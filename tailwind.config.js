/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "-apple-system", "sans-serif"],
        body: ["Inter", "-apple-system", "sans-serif"],
      },
      colors: {
        ss: {
          black: "#171717",
          bg: "#F4F3ED",
          orange: "#F15A24",
          white: "#FFFFFF",
          grey: "#777777",
          border: "#BDBDBD",
          "soft-orange": "#FFE1D5",
          green: "#477A55",
          red: "#C43C32",
        },
        // Keep legacy for any remaining references
        academic: {
          bg: "#F4F3ED",
          navy: "#171717",
          terracotta: "#F15A24",
          sage: "#FFE1D5",
          white: "#FFFFFF",
          text: "#171717",
          muted: "#777777",
        },
      },
      boxShadow: {
        "ss-sm": "0 1px 3px rgba(23,23,23,0.08)",
        "ss-md": "0 4px 12px rgba(23,23,23,0.10)",
      },
    },
  },
  plugins: [],
};

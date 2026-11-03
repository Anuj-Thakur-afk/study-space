/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        academic: {
          bg: "#F5F2EA",
          navy: "#263653",
          terracotta: "#E69A68",
          sage: "#DCE5DC",
          white: "#FFFFFF",
          text: "#263238",
          muted: "#777777",
        },
        navy: {
          DEFAULT: "#263653",
          dark: "#1B263B",
          light: "#354A6F",
        },
        terracotta: {
          DEFAULT: "#E69A68",
          dark: "#D4834F",
          light: "#F5BE9E",
        },
        sage: {
          DEFAULT: "#DCE5DC",
          dark: "#BDCBBD",
          light: "#EEF3EE",
        },
      },
      boxShadow: {
        academic: "0 4px 20px -2px rgba(38, 54, 83, 0.08)",
        soft: "0 10px 30px -5px rgba(38, 54, 83, 0.1)",
      },
    },
  },
  plugins: [],
};

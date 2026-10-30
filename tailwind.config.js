/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: "#245B45",
        mint: "#EAF4EE",
        ink: "#1F2933",
        cream: "#FAFBF8"
      },
      boxShadow: {
        soft: "0 12px 35px rgba(31, 41, 51, 0.07)"
      }
    }
  },
  plugins: []
};
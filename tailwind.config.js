/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  darkMode: "selector",
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Poppins"],
    },
  },
  plugins: [],
};

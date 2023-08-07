/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: "#0ACA85",
      },
    },
    fontFamily: {
      heading: ["Gemsbuck"],
      base: ["Montserrat"],
    },
  },
  plugins: [],
};

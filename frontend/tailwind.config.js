/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef6ff",
          100: "#d9ebff",
          200: "#bcdcff",
          300: "#8ec6ff",
          400: "#59a7ff",
          500: "#3186ff",
          600: "#1a67f5",
          700: "#1552e0",
          800: "#1843b5",
          900: "#193d8f",
        },
      },
    },
  },
  plugins: [],
};

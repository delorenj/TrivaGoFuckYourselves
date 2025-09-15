/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#003F5C',
          medium: '#366E9F',
          light: '#6B9EDA',
          lighter: '#A1CEFF',
          pale: '#D6EFFF'
        }
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

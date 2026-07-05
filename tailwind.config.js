/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          light: '#8B1A24',
          DEFAULT: '#6B0F1A',
          dark: '#4D0A11',
        },
        gold: {
          light: '#E2BD45',
          DEFAULT: '#C9A227',
          dark: '#9F7E1B',
        },
        ivory: {
          DEFAULT: '#FFF8F0',
          dark: '#EADFC9',
        },
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        sans: ['"Montserrat"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

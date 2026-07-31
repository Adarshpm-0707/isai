/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          light: '#ff8826',
          DEFAULT: '#f96c02',
          dark: '#c85400',
        },
        crimson: {
          light: '#e6261f',
          DEFAULT: '#c20903',
          dark: '#8a0602',
        },
        maroon: {
          light: '#e6261f',
          DEFAULT: '#c20903',
          dark: '#8a0602',
        },
        gold: {
          light: '#ff8826',
          DEFAULT: '#f96c02',
          dark: '#c20903',
        },
        ivory: {
          DEFAULT: '#FFF8F0',
          dark: '#EADFC9',
        },
      },
      fontFamily: {
        cinzel: ['"Cinzel"', 'serif'],
        cormorant: ['"Cinzel"', 'serif'],
        'cormorant-sc': ['"Cinzel"', 'serif'],
        quiche: ['"Cinzel"', 'serif'],
        burgues: ['"Cinzel"', 'serif'],
        trajan: ['"Cinzel"', 'serif'],
        playfair: ['"Cinzel"', 'serif'],
        sans: ['"Cinzel"', 'serif'],
      },
    },
  },
  plugins: [],
}

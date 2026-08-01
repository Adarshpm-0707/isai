/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          light: '#F6D18A',
          bright: '#F6D18A',
          DEFAULT: '#D8A55A',
          main: '#D8A55A',
          dark: '#B67A2F',
          deep: '#B67A2F',
        },
        bronze: {
          light: '#7A3F1C',
          DEFAULT: '#5C2F14',
          dark: '#2B1409',
          outline: '#2B1409',
        },
        orange: {
          light: '#F6D18A',
          DEFAULT: '#D8A55A',
          dark: '#B67A2F',
        },
        crimson: {
          light: '#D8A55A',
          DEFAULT: '#B67A2F',
          dark: '#5C2F14',
        },
        maroon: {
          light: '#D8A55A',
          DEFAULT: '#B67A2F',
          dark: '#5C2F14',
        },
        ivory: {
          DEFAULT: '#F6D18A',
          dark: '#D8A55A',
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

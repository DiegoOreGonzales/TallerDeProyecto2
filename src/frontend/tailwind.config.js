/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        continental: {
          light: '#3B6EA5',
          DEFAULT: '#1A4D8C',
          dark: '#0F3A68',
        },
      },
    },
  },
  plugins: [],
}

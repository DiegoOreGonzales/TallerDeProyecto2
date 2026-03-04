/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'bg-color': '#131313',
        'surface': '#131313',
        'surface-container-lowest': '#0e0e0e',
        'surface-container-low': '#1c1b1b',
        'surface-container': '#20201f',
        'surface-container-high': '#2a2a2a',
        'surface-container-highest': '#353535',
        'on-surface': '#e5e2e1',
        'on-surface-variant': '#e2bfb0',
        'primary-container': '#ff6b00',
        continental: {
          light: '#3B6EA5',
          DEFAULT: '#1A4D8C',
          dark: '#0F3A68',
        },
      },
      fontFamily: {
        headline: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

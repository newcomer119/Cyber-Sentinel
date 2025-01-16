/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'cyber-red': '#FF0000',
        'cyber-blue': '#0000FF',
        'cyber-black': '#1A1A1A',
      }
    },
  },
  plugins: [],
};
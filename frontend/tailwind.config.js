/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          750: '#2D3748',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
  darkMode: 'class',
}
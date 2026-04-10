/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', 
  theme: {
    extend: {
      colors: {
        'brand-pink': '#FF00CC',
        'brand-purple': '#333399',
        'brand-blue': '#00CCFF',
      },
      backgroundImage: {
        'brand-gradient': "linear-gradient(to right, #00CCFF, #FF00CC)",
      }
    },
  },
  plugins: [],
}
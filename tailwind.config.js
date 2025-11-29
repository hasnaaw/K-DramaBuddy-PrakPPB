/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Memastikan Tailwind memindai semua file di src
  ],
  darkMode: 'class', // Mengaktifkan dark mode berdasarkan class 'dark'
  theme: {
    extend: {},
  },
  plugins: [],
}
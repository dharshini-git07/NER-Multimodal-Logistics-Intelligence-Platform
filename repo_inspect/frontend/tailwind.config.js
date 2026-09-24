/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ner: {
          dark: '#0B132B',
          navy: '#1C2541',
          surface: '#1E293B',
          card: '#0F172A',
          teal: '#48CAE4',
          accent: '#00B4D8',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          critical: '#991B1B',
        }
      }
    },
  },
  plugins: [],
}

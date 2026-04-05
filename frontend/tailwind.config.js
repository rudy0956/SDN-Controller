/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B0F19', // Darkest blue/grey
        surface: '#1A2235', // Lighter surface
        primary: '#3B82F6', // Blue
        primaryHover: '#2563EB',
        accent: '#10B981', // Green for success/TE active
        danger: '#EF4444', // Red for congestion
        textPrimary: '#F3F4F6',
        textSecondary: '#9CA3AF'
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

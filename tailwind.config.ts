/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sidebar: '#0E0D0B',
        'sidebar-hover': '#1A1814',
        accent: { DEFAULT: '#C8906A', light: '#E0B090', dim: '#9B6B4C' },
        surface: { DEFAULT: '#FFFFFF', 2: '#F7F5F2', 3: '#F0EDE8' },
        ink: { DEFAULT: '#1A1612', muted: '#6B6560', soft: '#A09890' },
        border: { DEFAULT: '#E8E3DD', strong: '#D0C8C0' },
      },
      fontFamily: { sans: ['Heebo', 'system-ui', 'sans-serif'] },
      borderRadius: { DEFAULT: '6px', lg: '10px', xl: '14px' },
    },
  },
  plugins: [],
}

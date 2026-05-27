/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#3B82F6',
          'blue-light': '#60A5FA',
          'blue-dark': '#1D4ED8',
          'blue-glow': '#2563EB',
        },
        dark: {
          900: '#08080D',
          800: '#0F0F18',
          700: '#16161F',
          600: '#1E1E2A',
          500: '#282836',
          400: '#363645',
          300: '#4E4E5E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'blue-glow':   '0 0 24px rgba(59,130,246,0.35)',
        'card':        '0 0 0 1px rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.5)',
        'card-hover':  '0 0 0 1px rgba(255,255,255,0.08), 0 8px 40px rgba(0,0,0,0.7)',
        'card-blue':   '0 0 0 1px rgba(59,130,246,0.2), 0 8px 32px rgba(59,130,246,0.12)',
      },
      animation: {
        'fade-in':  'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

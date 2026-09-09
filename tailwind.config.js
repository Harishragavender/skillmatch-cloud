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
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc7fb',
          400: '#38a9f8',
          500: '#0e8ce9',
          600: '#026fc7',
          700: '#0358a1',
          800: '#074b85',
          900: '#0c3f6e',
          950: '#082849',
        },
        cyber: {
          cyan: '#00f0ff',
          purple: '#8b5cf6',
          violet: '#a855f7',
          pink: '#ec4899',
          emerald: '#10b981',
          amber: '#f59e0b',
        },
        dark: {
          bg: '#090d16',
          card: '#0f172a',
          cardHover: '#17223b',
          surface: '#131d35',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(56, 189, 248, 0.35)',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px -3px rgba(14, 140, 233, 0.3)',
        'glow': '0 0 25px -5px rgba(14, 140, 233, 0.45)',
        'glow-lg': '0 0 40px -10px rgba(14, 140, 233, 0.6)',
        'glow-cyan': '0 0 25px -5px rgba(0, 240, 255, 0.45)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.45)',
        'glow-purple': '0 0 25px -5px rgba(168, 85, 247, 0.45)',
        'card-3d': '0 20px 40px -15px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
        'card-3d-hover': '0 30px 60px -20px rgba(0,0,0,0.7), 0 0 25px rgba(56, 189, 248, 0.3), 0 0 0 1px rgba(56, 189, 248, 0.5)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}

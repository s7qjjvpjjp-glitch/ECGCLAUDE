import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
        },
        peach: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          400: '#fb923c',
          500: '#f97316',
        },
        lavender: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          400: '#c084fc',
          500: '#a855f7',
        },
        mint: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          400: '#4ade80',
          500: '#22c55e',
        },
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          400: '#38bdf8',
          500: '#0ea5e9',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'butterfly-1': 'float1 4s ease-in-out infinite',
        'butterfly-2': 'float2 5s ease-in-out infinite 0.8s',
        'butterfly-3': 'float1 3.5s ease-in-out infinite 1.5s',
        'butterfly-4': 'float2 4.5s ease-in-out infinite 2.2s',
        'butterfly-5': 'float1 5.5s ease-in-out infinite 0.5s',
        'butterfly-6': 'float2 4s ease-in-out infinite 3s',
        'butterfly-7': 'float1 3.8s ease-in-out infinite 1.2s',
      },
      keyframes: {
        float1: {
          '0%': { transform: 'translateY(0px) rotate(-5deg)' },
          '50%': { transform: 'translateY(-18px) rotate(5deg)' },
          '100%': { transform: 'translateY(0px) rotate(-5deg)' },
        },
        float2: {
          '0%': { transform: 'translateY(0px) rotate(5deg) scaleX(-1)' },
          '50%': { transform: 'translateY(-14px) rotate(-5deg) scaleX(-1)' },
          '100%': { transform: 'translateY(0px) rotate(5deg) scaleX(-1)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config

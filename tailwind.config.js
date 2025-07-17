/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--primary-50)',
          100: 'var(--primary-100)',
          200: 'var(--primary-200)',
          300: 'var(--primary-300)',
          400: 'var(--primary-400)',
          500: 'var(--primary-500)',
          600: 'var(--primary-600)',
          700: 'var(--primary-700)',
          800: 'var(--primary-800)',
          900: 'var(--primary-900)',
        },
        earth: {
          50: 'var(--earth-50)',
          100: 'var(--earth-100)',
          200: 'var(--earth-200)',
          300: 'var(--earth-300)',
          400: 'var(--earth-400)',
          500: 'var(--earth-500)',
          600: 'var(--earth-600)',
          700: 'var(--earth-700)',
          800: 'var(--earth-800)',
          900: 'var(--earth-900)',
        },
        accent: {
          sage: 'var(--accent-sage)',
          'sage-light': 'var(--accent-sage-light)',
          'sage-dark': 'var(--accent-sage-dark)',
          moss: 'var(--accent-moss)',
          'moss-light': 'var(--accent-moss-light)',
          'moss-dark': 'var(--accent-moss-dark)',
          bark: 'var(--accent-bark)',
          'bark-light': 'var(--accent-bark-light)',
          'bark-dark': 'var(--accent-bark-dark)',
          stone: 'var(--accent-stone)',
          'stone-light': 'var(--accent-stone-light)',
          'stone-dark': 'var(--accent-stone-dark)',
        },
      },
      backgroundImage: {
        'gradient-forest': 'var(--gradient-forest)',
        'gradient-earth': 'var(--gradient-earth)',
        'gradient-moss': 'var(--gradient-moss)',
        'gradient-stone': 'var(--gradient-stone)',
        'gradient-dawn': 'var(--gradient-dawn)',
      },
      boxShadow: {
        natural: 'var(--shadow-natural)',
        depth: 'var(--shadow-depth)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        sway: 'sway 8s ease-in-out infinite',
        breathe: 'breathe 8s ease-in-out infinite',
        grow: 'grow 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        breathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        grow: {
          '0%': { transform: 'scale(0)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
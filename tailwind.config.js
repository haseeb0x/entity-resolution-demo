/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#FAFAF9',
        foreground: '#1C1917',
        flag: '#B91C1C',
        clear: '#15803D',
        border: '#E7E5E4',
        muted: {
          DEFAULT: '#F5F5F4',
          foreground: '#57534E',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#1C1917',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Source Serif Pro"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
};

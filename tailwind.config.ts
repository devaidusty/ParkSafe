import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['DM Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        'zone-green': '#1d5c38',
        'zone-yellow': '#b8860b',
        'zone-red': '#8b1a1a',
        'ink': '#111111',
      },
      boxShadow: {
        card: 'rgba(0,0,0,0.4) 0px 2px 4px, rgba(0,0,0,0.3) 0px 7px 13px -3px, rgba(0,0,0,0.2) 0px -3px 0px inset',
        'card-light': 'rgba(0,0,0,0.08) 0px 2px 4px, rgba(0,0,0,0.06) 0px 7px 13px -3px, rgba(0,0,0,0.04) 0px -3px 0px inset',
        sheet: '0 -4px 24px rgba(0,0,0,0.12)',
      },
      letterSpacing: {
        widest2: '0.12em',
      },
    },
  },
  plugins: [],
} satisfies Config

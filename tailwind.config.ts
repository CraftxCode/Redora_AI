import type { Config } from 'tailwindcss';

/** Design tokens for the black + crimson system. Red is an accent, never a surface. */
export default {
  // Hover styles apply only on devices that can hover, so touch screens never get a stuck hover state.
  future: { hoverOnlyWhenSupported: true },
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: { 950: '#050505', 900: '#080808', 800: '#0C0C0C' },
        surface: { 1: '#111111', 2: '#151515', 3: '#191919' },
        line: { 1: '#242424', 2: '#303030' },
        crimson: { DEFAULT: '#E50914', bright: '#FF3030', soft: '#FF6666', deep: '#700008' },
        fg: { DEFAULT: '#F5F5F5', dim: '#A0A0A0', mute: '#858585' },
      },
      fontFamily: {
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        sans: ['"Geist Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(229,9,20,.35), 0 0 40px -8px rgba(229,9,20,.45)',
        panel: '0 30px 80px -20px rgba(0,0,0,.8), 0 0 60px -30px rgba(229,9,20,.35)',
      },
      keyframes: {
        pulseDot: { '0%,100%': { opacity: '1', transform: 'scale(1)' }, '50%': { opacity: '.45', transform: 'scale(1.5)' } },
        drift: { '0%,100%': { transform: 'translate3d(0,0,0)', opacity: '.2' }, '50%': { transform: 'translate3d(0,-26px,0)', opacity: '.7' } },
        ring: { '0%': { transform: 'scale(.96)', opacity: '.5' }, '100%': { transform: 'scale(1.04)', opacity: '.15' } },
        blink: { '50%': { opacity: '0' } },
        fadeIn: { from: { opacity: '0', transform: 'translateY(6px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        overlayIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        sheetIn: { from: { opacity: '0', transform: 'translateY(16px) scale(.98)' }, to: { opacity: '1', transform: 'translateY(0) scale(1)' } },
        dots: { '0%,80%,100%': { transform: 'translateY(0)', opacity: '.4' }, '40%': { transform: 'translateY(-3px)', opacity: '1' } },
      },
      animation: {
        'pulse-dot': 'pulseDot 1.8s ease-in-out infinite',
        drift: 'drift 9s ease-in-out infinite',
        ring: 'ring 7s ease-in-out infinite alternate',
        blink: 'blink 1s steps(1) infinite',
        dots: 'dots 1.2s ease-in-out infinite',
        'overlay-in': 'overlayIn .2s ease-out both',
        'sheet-in': 'sheetIn .3s cubic-bezier(.2,.8,.2,1) both',
      },
    },
  },
  plugins: [],
} satisfies Config;

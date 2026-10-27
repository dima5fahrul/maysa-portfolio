import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: 'rgb(var(--accent) / <alpha-value>)',
        page: 'rgb(var(--page) / <alpha-value>)',
        surface: 'rgb(var(--surface) / <alpha-value>)',
        heading: 'rgb(var(--heading) / <alpha-value>)',
        body: 'rgb(var(--body) / <alpha-value>)',
        muted: 'rgb(var(--muted) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-heading)', 'system-ui', 'sans-serif'],
        nav: ['var(--font-nav)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'cursive'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      keyframes: {
        'ken-burns': {
          '0%': { transform: 'scale(1) translate3d(0,0,0)' },
          '100%': { transform: 'scale(1.09) translate3d(0,-1.5%,0)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(22px)', filter: 'blur(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'line-grow': {
          '0%': { opacity: '0', transform: 'scaleX(0)' },
          '100%': { opacity: '1', transform: 'scaleX(1)' },
        },
        'scroll-cue': {
          '0%, 100%': { opacity: '0.45', transform: 'translateY(0)' },
          '50%': { opacity: '1', transform: 'translateY(8px)' },
        },
      },
      animation: {
        'ken-burns': 'ken-burns 22s cubic-bezier(0.33, 0, 0.2, 1) forwards',
        'fade-up': 'fade-up 1s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 1.2s ease-out both',
        'line-grow': 'line-grow 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        'scroll-cue': 'scroll-cue 2.2s ease-in-out 2s infinite',
      },
    },
  },
  plugins: [],
};
export default config;

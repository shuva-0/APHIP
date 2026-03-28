/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        void: '#04080f',
        base: '#070d1c',
        surface: '#0a1228',
        panel: '#0d1632',
        card: '#111e3d',
        hover: '#162447',
        cyan: {
          400: '#38bdf8',
          500: '#0ea5e9',
        },
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      boxShadow: {
        'glow-cyan': '0 0 30px rgba(56,189,248,0.2)',
        'glow-red': '0 0 30px rgba(239,68,68,0.25)',
        'glow-green': '0 0 30px rgba(16,185,129,0.2)',
        'glow-amber': '0 0 30px rgba(245,158,11,0.2)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
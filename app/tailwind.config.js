/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        mil: {
          bg:      '#0b0f07',
          surface: '#121708',
          card:    '#1a2210',
          border:  '#2a3818',
          text:    '#c0b880',
          muted:   '#5a6a40',
          gold:    '#c8a030',
          'gold-d':'#8a6a18',
          green:   '#4a8020',
        },
      },
      fontFamily: {
        mono:    ['"Share Tech Mono"', 'monospace'],
        display: ['Oswald', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ledger: {
          bg: '#0F1720',
          panel: '#161F2B',
          line: '#243040',
          amber: '#F2A93B',
          amberDim: '#8A6524',
          mint: '#3FCF8E',
          rose: '#E6607A',
          text: '#E7ECF2',
          muted: '#8B98A9',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [],
}

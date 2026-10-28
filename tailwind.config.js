/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          deep: '#06141B',
        },
        slate: {
          dark: '#11212D',
        },
        border: {
          muted: '#253745',
        },
        text: {
          primary: '#CCD0CF',
          secondary: '#9BA8AB',
        },
        brand: {
          deepNavy: '#06141B',
          darkSlate: '#11212D',
          borderBlue: '#253745',
          lightGrey: '#9BA8AB',
          pearlWhite: '#CCD0CF',
          cyan: '#00E5FF',
          teal: '#2DD4BF',
          fuchsia: '#D946EF',
          rose: '#F43F5E',
          emerald: '#10B981',
          bacRed: '#E31837',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -4px rgba(0, 229, 255, 0.25)',
        'glow-fuchsia': '0 0 25px -4px rgba(217, 70, 239, 0.25)',
        'glow-card': '0 8px 30px rgba(0, 0, 0, 0.45)',
      }
    },
  },
  plugins: [],
}

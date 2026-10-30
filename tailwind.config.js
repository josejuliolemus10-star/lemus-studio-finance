/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          black: '#000000',
          dark: '#080808',
          card: '#0D0D0D',
          cardHover: '#141414',
          surface: '#111111',
          border: '#242424',
          borderHover: '#383838',
          white: '#FFFFFF',
          silver: '#E4E4E7',
          gray: '#A1A1AA',
          muted: '#71717A',
        },
        brand: {
          deepNavy: '#000000', // Actualizado a Pure Black
          darkSlate: '#0D0D0D', // Actualizado a Obsidian Dark
          borderBlue: '#242424', // Actualizado a Dark Charcoal
          lightGrey: '#A1A1AA',
          pearlWhite: '#FFFFFF',
          cyan: '#FFFFFF',      // Monocromático primario
          teal: '#2DD4BF',
          fuchsia: '#A1A1AA',
          rose: '#F43F5E',
          bacRed: '#E31837',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        mono: ['"Space Grotesk"', 'monospace'],
      },
      boxShadow: {
        'glow-white': '0 0 25px -4px rgba(255, 255, 255, 0.25)',
        'glow-card': '0 10px 30px rgba(0, 0, 0, 0.8)',
      }
    },
  },
  plugins: [],
}

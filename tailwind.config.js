/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          750: '#293548',
          850: '#172033',
        },
        taka: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        }
      },
      fontSize: {
        'xs': ['0.8125rem', { lineHeight: '1.25rem' }],   // 13px
        'sm': ['0.9375rem', { lineHeight: '1.375rem' }],  // 15px
        'base': ['1.0625rem', { lineHeight: '1.625rem' }],// 17px
        'lg': ['1.1875rem', { lineHeight: '1.75rem' }],   // 19px
        'xl': ['1.375rem', { lineHeight: '1.875rem' }],   // 22px
        '2xl': ['1.625rem', { lineHeight: '2.125rem' }],  // 26px
        '3xl': ['2rem', { lineHeight: '2.375rem' }],      // 32px
      }
    },
  },
  plugins: [],
}

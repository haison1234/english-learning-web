/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#010828',
        cream: '#EFF4FF',
        neon: '#6FFF00',
      },
      fontFamily: {
        // "font-grotesk" → Anton (headings, nav)
        grotesk: ['Anton', 'sans-serif'],
        // "font-condiment" → Condiment (cursive accents)
        condiment: ['Condiment', 'cursive'],
        // "font-mono" → system monospace (body paragraphs)
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace',
        ],
      },
    },
  },
  plugins: [],
}

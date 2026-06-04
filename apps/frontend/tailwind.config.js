/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandDark: '#23242D',
        actionBlue: '#0060FD',
        actionBlueHover: '#004FD8',
        actionBlueActive: '#003FA8',
        actionBlueVariant: '#0071F9',
        deepNavy: '#233876',
        mediumBlue: '#1F242E',
        secondaryText: '#566681',
        grayBorder: '#E5E7EB',
        darkGrayBorder: '#D1D5DB',
        offWhite1: '#F9FAFB',
        offWhite2: '#F7FAFC',
        offWhite3: '#FAFCFE',
        warningPrimary: '#FFCC00',
        warningSecondary: '#FF9F00',
        successGreenBg: '#E8F5E9',
        successGreenText: '#2E7D32',
      },
      fontFamily: {
        sans: ['"Noto Sans"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        poppins: ['"Noto Sans"', 'sans-serif'],
      },
      boxShadow: {
        l1: 'rgba(31, 36, 46, 0.1) 0px 4px 24px 0px',
        l2: 'rgba(31, 36, 46, 0.15) 0px 8px 32px 0px',
        l3: 'rgba(31, 36, 46, 0.2) 0px 12px 48px 0px',
      }
    },
  },
  plugins: [],
}

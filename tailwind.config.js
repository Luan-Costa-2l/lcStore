/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundColor: {
        'blue-light': '#0086FF',
        'blue-dark': '#0468C3',
        'green': '#59C00B',
        'green-dark': '#3A7808'
      },
      maxWidth: {
        'default': '1200px'
      },
    },
  },
  plugins: [],
}

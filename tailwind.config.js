/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./index.html",
  ],
  theme: {
    extend: {
      animation: {
        'pulse ': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
    },
  },
  plugins: [],
}
}

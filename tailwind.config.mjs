/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-a1": "#4ade80",
        "primary-a2": "#16a34a",
        "secondary-a1": "#3b3b3a",
      },
      fontFamily: {
        cairo: ["var(--font-cairo)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

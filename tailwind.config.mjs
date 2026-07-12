/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "primary-foreground": "var(--primary-foreground)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        secondary: "var(--secondary)",
        muted: "var(--muted)",
        "muted-foreground": "var(--muted-foreground)",
        accent: "var(--accent)",
        border: "var(--border)",
        input: "var(--input)",
        destructive: "var(--destructive)",
        /* Legacy aliases kept for backward compat */
        "primary-a1": "#8EC641",
        "primary-a2": "#5a8a1f",
        "secondary-a1": "#0d1a07",
      },
      fontFamily: {
        geist: ["var(--font-geist-sans)", "sans-serif"],
        cairo: ["var(--font-cairo)", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "var(--radius)",
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#111827",
        accent: "#D4AF37",
        cream: "#F8F5F0",
      },

      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },

      boxShadow: {
        luxury:
          "0 10px 30px rgba(0,0,0,0.08)",
      },
    },
  },

  plugins: [],
};
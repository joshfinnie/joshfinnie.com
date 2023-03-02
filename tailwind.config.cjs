const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,astro}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        logo: ["Eczar", ...defaultTheme.fontFamily.sans],
        sans: ["IBM Plex Sans", ...defaultTheme.fontFamily.sans],
        mono: ["IBM Plex Mono", ...defaultTheme.fontFamily.mono],
      },
      typography: {
        DEFAULT: {
          css: {
            a: {
              "font-weight": "bold",
            },
            li: {
              margin: 0,
            },
            p: {
              "text-align": "justify",
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./public/**/*.html", "./src/**/*.{astro,js,jsx,ts,tsx,vue,svelte}"],
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
              color: "rgb(217, 119, 6)",
              "text-decoration": "none",
              " ont-weight": "inherit",
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

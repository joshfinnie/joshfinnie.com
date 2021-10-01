module.exports = {
  mode: 'jit',
  purge: [
    './public/**/*.html',
    './src/**/*.{astro,js,jsx,ts,tsx,vue,svelte}'
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            a: {
              color: 'rgb(4, 120, 87)',
              'text-decoration': 'none',
              'font-weight': 'inherit',
            },
            li: {
              margin: 0,
            },
            p: {
              'text-align': 'justify',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

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
              color: 'rgb(217, 119, 6)',
              'text-decoration': 'none',
              ' ont-weight': 'inherit',
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

// @ts-check
export default /** @type {import('astro').AstroUserConfig} */ ({
  buildOptions: {
    site: 'https://www.joshfinnie.com',
    sitemap: true,
  },
  // Enables Tailwind support for development
  devOptions: {
    port: 3333,
    hostname: "0.0.0.0",
    tailwindConfig: "./tailwind.config.js",
  },
  // Enable the Preact renderer to support Preact JSX components.
  renderers: ['@astrojs/renderer-preact'],
  vite: {
    plugins: [
    ],
  },
});

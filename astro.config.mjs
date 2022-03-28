import preact from "@astrojs/preact";

// @ts-check
export default /** @type {import('astro').AstroUserConfig} */ ({
  buildOptions: {
    site: "https://www.joshfinnie.com",
    sitemap: true,
  },
  devOptions: {
    port: 3333,
    hostname: "0.0.0.0",
    tailwindConfig: "./tailwind.config.js",
  },
  integrations: [preact()],
  vite: {
    plugins: [],
  },
  markdownOptions: {
    render: [
      "@astrojs/markdown-remark",
      {
        //syntaxHighlight: 'prism',
        shikiConfig: {
          // Choose from Shiki's built-in themes
          // https://github.com/shikijs/shiki/blob/main/docs/themes.md#all-themes
          theme: "dracula",
          // Manually specify langs
          // Note: Shiki has countless langs built-in, including .astro!
          langs: ["astro"],
          // Enable word wrap to prevent horizontal scrolling
          wrap: false,
        },
        rehypePlugins: ["rehype-slug", ["rehype-autolink-headings", { behavior: "prepend" }]],
      },
    ],
  },
});

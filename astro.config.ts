import { defineConfig } from "astro/config";

import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

// @ts-check
export default defineConfig({
  site: "https://www.joshfinnie.com/",
  trailingSlash: "always",
  server: {
    port: 3333,
    hostname: "0.0.0.0",
  },
  integrations: [
    preact(),
    sitemap(),
    tailwind({
      config: { path: "./tailwind.config.cjs" },
    }),
  ],
  vite: {
    plugins: [],
  },
  markdown: {
    render: [
      "@astrojs/markdown-remark",
      {
        shikiConfig: {
          theme: "dracula",
          langs: ["astro"],
          wrap: false,
        },
        rehypePlugins: ["rehype-slug", ["rehype-autolink-headings", { behavior: "prepend" }]],
      },
    ],
  },
});
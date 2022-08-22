import { defineConfig } from "astro/config";

import image from "@astrojs/image";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'

// @ts-check
export default defineConfig({
  site: "https://www.joshfinnie.com",
  server: {
    port: 3333,
    hostname: "0.0.0.0",
  },
  integrations: [
    image(),
    preact(),
    sitemap(),
    tailwind({
      config: { path: "./tailwind.config.cjs" },
    }),
  ],
  vite: {
    plugins: [],
    optimizeDeps:{
      exclude: ['tiny-glob'],
    }
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

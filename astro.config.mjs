import { defineConfig, sharpImageService } from "astro/config";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

import alpinejs from "@astrojs/alpinejs";

// https://astro.build/config
export default defineConfig({
  experimental: {
    responsiveImages: true,
    svg: true,
  },
  site: "https://www.joshfinnie.com/",
  trailingSlash: "always",
  server: {
    port: 3333,
  },
  image: {
    service: sharpImageService(),
  },
  integrations: [
    mdx(),
    sitemap(),
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    alpinejs(),
  ],
  markdown: {
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
    shikiConfig: {
      theme: "dracula",
    },
  },
});

import { defineConfig } from "astro/config";

import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";

import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeSlug from 'rehype-slug'
//import toc from 'rehype-toc'

export default defineConfig({
  site: "https://www.joshfinnie.com/",
  trailingSlash: "always",
  integrations: [mdx(), preact(), sitemap(), tailwind({
    config: {
      path: "./tailwind.config.cjs"
    }
  })],
  markdown: {
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
    shikiConfig: {
      theme: 'dracula'
    }
  }
});

import { defineConfig, sharpImageService } from "astro/config";
import mdx from "@astrojs/mdx";
import preact from "@astrojs/preact";
import sitemap from "@astrojs/sitemap";
import tailwind from "@astrojs/tailwind";
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeSlug from 'rehype-slug';
import icon from "astro-icon";

// https://astro.build/config
export default defineConfig({
  site: "https://www.joshfinnie.com/",
  trailingSlash: "always",
  server: {
    port: 3333
  },
  image: {
    service: sharpImageService()
  },
  integrations: [mdx(), preact(), sitemap(), tailwind({
    config: {
      path: "./tailwind.config.cjs"
    }
  }), icon()],
  markdown: {
    rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
    shikiConfig: {
      theme: 'dracula'
    }
  }
});

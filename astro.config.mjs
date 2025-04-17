import { defineConfig, fontProviders } from "astro/config";
import alpinejs from "@astrojs/alpinejs";
import mdx from "@astrojs/mdx";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: "Inter",
        cssVariable: "--font-inter",
      },
    ],
    responsiveImages: true,
  },
  site: "https://www.joshfinnie.com/",
  trailingSlash: "always",
  server: {
    port: 3333,
  },
  integrations: [mdx(), sitemap(), react(), alpinejs()],
  markdown: {
    shikiConfig: {
      theme: "dracula",
    },
  },
});

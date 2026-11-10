import alpinejs from '@astrojs/alpinejs';
import { unified } from '@astrojs/markdown-remark';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';
import cards from 'astro-cards';
import expressiveCode from 'astro-expressive-code';
// Load environment variables
import { config } from 'dotenv';
import { remarkAlert } from 'remark-github-blockquote-alert';

config();

// https://astro.build/config
export default defineConfig({
  env: {
    schema: {
      CLOUDINARY_CLOUD_NAME: {
        context: 'client',
        access: 'public',
        type: 'string',
      },
    },
  },
  vite: { plugins: [tailwindcss()], resolve: { tsconfigPaths: true } },
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-inter',
    },
  ],
  image: {
    responsiveStyles: true,
    layout: 'constrained',
    // astro-cards runs remote images (the Cloudinary hero and headshot it
    // composites into OG cards) through Astro's image allowlist.
    remotePatterns: [{ protocol: 'https', hostname: 'res.cloudinary.com' }],
  },
  build: {
    inlineStylesheets: 'always',
  },
  markdown: {
    processor: unified({
      remarkPlugins: [remarkAlert],
    }),
  },
  site: 'https://www.joshfinnie.com/',
  trailingSlash: 'always',
  server: {
    port: 3333,
  },
  integrations: [
    cards({ width: 1200, height: 630, format: 'jpeg', quality: 88 }),
    // Expressive Code must run before mdx() so it can process code blocks.
    expressiveCode(),
    mdx(),
    sitemap(),
    alpinejs(),
  ],
});

import alpinejs from '@astrojs/alpinejs';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';

// Load environment variables
import { config } from 'dotenv';

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
  vite: { plugins: [tailwindcss()] },
  experimental: {
    fonts: [
      {
        provider: fontProviders.google(),
        name: 'Inter',
        cssVariable: '--font-inter',
      },
    ],
  },
  image: {
    responsiveStyles: true,
    layout: 'constrained',
  },
  site: 'https://www.joshfinnie.com/',
  trailingSlash: 'always',
  server: {
    port: 3333,
  },
  integrations: [mdx(), sitemap(), alpinejs()],
  markdown: {
    shikiConfig: {
      theme: 'dracula',
    },
  },
});

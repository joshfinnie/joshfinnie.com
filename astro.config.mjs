import alpinejs from '@astrojs/alpinejs';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';
import expressiveCode from 'astro-expressive-code';

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
  },
  build: {
    inlineStylesheets: 'always',
  },
  site: 'https://www.joshfinnie.com/',
  trailingSlash: 'always',
  server: {
    port: 3333,
  },
  integrations: [
    // Expressive Code must run before mdx() so it can process code blocks.
    expressiveCode({
      themes: ['rose-pine-dawn', 'rose-pine-moon'],
      // Dark mode is driven by the `.dark` class on <html> (Alpine toggle),
      // not the OS preference, so disable the media query and scope the dark
      // theme to `.dark`. The light theme stays the default (base) theme.
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme) => (theme.type === 'dark' ? '.dark' : false),
      styleOverrides: {
        borderRadius: '0.375rem',
        codePaddingBlock: '1.25rem',
      },
    }),
    mdx(),
    sitemap(),
    alpinejs(),
  ],
});

import { defineEcConfig } from 'astro-expressive-code';

export default defineEcConfig({
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
});

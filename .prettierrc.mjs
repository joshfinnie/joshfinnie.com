/** @type {import("prettier").Config} */
export default {
  // Defaults
  printWidth: 120,
  useTabs: false,
  semi: true,
  trailingComma: "es5",
  bracketSpacing: true,
  arrowParens: "always",
  // Plugins
  plugins: ["prettier-plugin-astro"],
  // Overrides for specific file types
  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],
};

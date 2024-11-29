import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import react from "@eslint-react/eslint-plugin";
import eslintPluginAstro from "eslint-plugin-astro";
import * as tsParser from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,astro}"],
    ...react.configs.recommended,
    languageOptions: {
      parser: tsParser,
    },
  },
  { ignores: ["node_modules/*", "dist/*", ".astro/*"] },
  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
];

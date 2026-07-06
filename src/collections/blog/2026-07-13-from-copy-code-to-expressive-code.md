---
title: "Deleting My Copy-Code Component for Expressive Code"
date: "2026-07-13"
tags:
  - "astro"
  - "refactor"
  - "ux"
  - "tooling"
slug: "from-copy-code-to-expressive-code"
heroImage: "blog/expressive"
unsplash: "Thomas Park"
unsplashURL: "thomascpark"
description: "A few months ago I hand-rolled a copy-to-clipboard button for my code blocks. This summer I threw it away and let astro-expressive-code do that job and the ones I never got around to. Here is what the swap looked like."
draft: false
---

Back in February I wrote about [adding a copy code button to this blog](/blog/adding-copy-code-to-astro/). It was a small, self-contained component: about a hundred lines of vanilla JavaScript that found every code block, wrapped it, and stuck a language label and a clipboard button on top. I was proud of how little it took. At the end of that post I linked the whole thing on GitHub and suggested you could drop it into your own Astro blog.

This summer I deleted it. Not because it broke, but because I found [Expressive Code](https://expressive-code.com/) doing everything my component did and a pile of things it did not.

## What I was actually maintaining

My copy-code setup was really two pieces held together with tape. The first was `CopyCode.astro`, the script that injected the header bar and copy button after the page loaded. The second was a block of CSS in `global.css` that made Shiki's dual-theme output work with my dark mode toggle. Shiki emitted light colors as inline styles and dark colors as CSS variables, and I had a set of `!important` rules to force the dark variables to win when the `.dark` class was present.

Both pieces worked, but both were mine to keep working. The copy button ran on every page as a client-side script that reached into the DOM Shiki had produced. The CSS overrides depended on the exact shape of that output. Anytime Astro bumped its Shiki version, that was surface area I had to check. It was not a lot of maintenance, but it was maintenance for features that a dedicated library already treats as table stakes.

## Why Expressive Code

Expressive Code is an Astro integration that renders code blocks as fully styled frames. Out of the box it gives you copy buttons, language labels, terminal frames for shell snippets, editor-style title tabs, line numbers, line highlighting, and text markers, with theming that understands light and dark. Everything I had built by hand was a subset of its defaults, and most of its features were things I had wanted but never sat down to write.

The part that sold me was the theming. I had spent real effort getting Shiki's dark mode to cooperate with my Alpine toggle. Expressive Code handles the same problem as a configuration option instead of a CSS fight.

## The swap

The integration goes in `astro.config.mjs`, and the one ordering rule that matters is that it has to run before `mdx()` so it can process code blocks before MDX does. My config ended up like this:

```js
import expressiveCode from 'astro-expressive-code';

export default defineConfig({
  integrations: [
    // Expressive Code must run before mdx() so it can process code blocks.
    expressiveCode({
      themes: ['rose-pine-dawn', 'rose-pine-moon'],
      useDarkModeMediaQuery: false,
      themeCssSelector: (theme) => (theme.type === 'dark' ? '.dark' : false),
      styleOverrides: {
        borderRadius: '0.375rem',
        codePaddingBlock: '1.25rem',
      },
    }),
    mdx(),
    // ...
  ],
});
```

The three lines in the middle are the whole reason the migration was easy. Alpine toggles a `.dark` class on the `<html>` element to drive my dark mode, and the operating system preference plays no part. Setting `useDarkModeMediaQuery` to false tells Expressive Code to stop emitting a `prefers-color-scheme` media query, and `themeCssSelector` scopes the dark theme to my `.dark` class instead. The light theme stays the default. That is the exact behavior I had been forcing with `!important` overrides, except now it is two options.

With that in place I deleted `CopyCode.astro` and removed its `<CopyCode />` include from `BlogPost.astro`. That took out the 113-line component and its client-side script, and an integration that renders the frames at build time now does the work the browser used to do on load.

## The CSS I got to delete

The most satisfying part was the stylesheet. My old Shiki overrides looked like this, and every rule needed `!important` to beat Tailwind Typography:

```css
.dark pre.astro-code,
.dark pre.astro-code span {
  color: var(--shiki-dark) !important;
  background-color: var(--shiki-dark-bg) !important;
  font-style: var(--shiki-dark-font-style) !important;
}
```

All of it came out. Expressive Code styles its own frames, and Tailwind Typography targets elements with zero-specificity `:where()` selectors, so Expressive Code's styles win without a single override. The block of `!important` rules I had written to referee that fight was simply not needed anymore. I replaced the whole section with a one-line comment explaining why nothing has to live there.

## The one thing that broke

The migration was not free. I render [Mermaid](https://mermaid.js.org/) diagrams from fenced code blocks tagged `mermaid`, and my `MermaidInit` script found them by looking for `pre code.language-mermaid`, which is what Shiki produced. Expressive Code produces a different DOM: a `<pre data-language="mermaid">` wrapped in a `figure.expressive-code`. My selector matched nothing, so the diagrams stopped rendering.

The fix was to make the script recognize both shapes. It now queries for the legacy selector and Expressive Code's output together, then walks up to whichever container it finds before swapping in the rendered diagram:

```js
const blocks = document.querySelectorAll(
  'pre code.language-mermaid, [data-language="mermaid"]',
);
for (const block of blocks) {
  const code = block.matches('code') ? block : block.querySelector('code');
  const target =
    block.closest('figure.expressive-code') ?? block.closest('pre') ?? block;
  if (!code || !target) continue;
  // build the .mermaid div and replace `target`
}
```

This is the kind of coupling I mentioned earlier. My Mermaid code was quietly depending on the shape of the syntax highlighter's output, and changing the highlighter surfaced that dependency. It was a ten-minute fix, but it is worth naming, because if you have any script that reaches into your code blocks, expect to update it when the thing that generates those blocks changes.

## Was it worth it

Yes, and it is the same lesson as the last few cleanups I have done here. I enjoyed building the copy button, and writing that post taught me things about the Clipboard API and Astro's script bundling. But maintaining a hand-rolled version of a solved problem is a cost that grows quietly, and the moment a maintained library does more than my version for less code than my version, keeping mine around is just pride. I removed more code than I added, my code blocks gained features I never built, and there is one less script running in every reader's browser.

If you followed my earlier post and copied that component, there is nothing wrong with it. But if you are setting up code blocks on an Astro site today, I would reach for Expressive Code first and only hand-roll the parts it genuinely cannot do.

If you make the same swap, or you think I was too quick to delete my own work, find me on [**Bluesky**](https://bsky.app/profile/joshfinnie.dev).
</content>

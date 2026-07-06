---
title: "Trading ESLint and Prettier for Biome"
date: "2026-07-06"
tags:
  - "refactor"
  - "best-practices"
  - "astro"
  - "tooling"
slug: "from-eslint-and-prettier-to-biome"
heroImage: "blog/biome"
unsplash: "sprucejpg"
unsplashURL: "sprucejpg"
description: "A while back I added ESLint and Prettier to this blog. This year I pulled both out and replaced them with Biome, a single Rust-based tool that formats and lints in one pass. Here is why, and what the switch actually looked like."
draft: false
---

A little over a year ago I wrote about [adding ESLint and Prettier to this blog](/blog/adding-eslint-and-prettier-to-my-blog/). That setup did its job. Prettier kept my formatting consistent and ESLint caught the occasional unused import before it shipped. But the setup was never one thing. It was two tools that needed a third package to stop arguing with each other, plus an Astro plugin for each, plus a config file apiece. When I sat down this past winter to clean up the repo, that pile of glue was the first thing I wanted gone. I replaced all of it with [Biome](https://biomejs.dev/).

## What Biome is

Biome is a single toolchain that formats and lints JavaScript, TypeScript, JSX, JSON, CSS, and, as of the 2.x releases, HTML and Astro files. Rust powers it, which is the part everyone leads with because it is genuinely fast, but the reason I cared was that it collapses the whole ESLint-plus-Prettier-plus-plugins arrangement into one binary with one config file. There is no formatter fighting the linter, because the same tool owns both jobs.

## Why I made the switch

The old setup worked, so this was not a rescue mission. It was a simplification. My ESLint config pulled in `typescript-eslint`, `eslint-plugin-astro`, and `eslint-plugin-prettier` just to get formatting and linting to coexist, and Prettier had its own `prettier-plugin-astro` on top of that. Four plugins and two config files to do what is fundamentally two jobs. Every dependency bump was a chance for one of those pieces to drift out of step with the others.

When I ran the migration, removing ESLint, Prettier, and their plugins took 112 packages out of my `node_modules`. That number alone made the case. A personal blog does not need a hundred packages of tooling to keep its semicolons in line. The speed was a nice bonus, but the real win was having one thing to configure, one thing to update, and one command to run.

## What the migration looked like

The move was less work than the original setup had been. Biome ships migration commands that read your existing config and translate it, so I did not start from a blank file.

First I installed Biome and removed the old tools:

```bash
pnpm add --save-dev --exact @biomejs/biome
pnpm remove eslint prettier prettier-plugin-astro eslint-plugin-astro eslint-plugin-prettier typescript-eslint
```

Then I let Biome read the old configs and carry the settings over:

```bash
pnpm biome migrate eslint --write
pnpm biome migrate prettier --write
```

That second step is the one that saved me the most time. It pulled my Prettier choices straight into `biome.json`, so single quotes for JavaScript, double quotes for JSX, trailing commas where ES5 allows them, and semicolons always. I did not have to remember any of that or look it up. The `migrate eslint` command did the same for my lint rules, writing each one out explicitly rather than leaning on a named preset, which means I can now see exactly which rules it enforces instead of trusting a `recommended` bundle.

Finally I rewrote the scripts in `package.json` to point at Biome:

```json
"scripts": {
  "format": "biome check --write .",
  "format:check": "biome check .",
  "lint": "biome lint ."
}
```

The `check` command is the part I like most. It runs the formatter, the linter, and import sorting together, and with `--write` it fixes everything it safely can in a single pass. `pnpm format` is now the only command I need before a commit.

## The parts I had to think about

Two things did not translate automatically, and both came down to deciding what Biome should leave alone.

The first was CSS. I build this blog with Tailwind v4, and I did not want Biome reformatting or linting my stylesheets, so I turned it off for those files with an override that disables both the formatter and the linter on anything matching `**/*.css`. Tailwind and its tooling own that layer, and Biome staying out of it keeps the two from stepping on each other.

The second was my blog content. My posts are Markdown and MDX, and prose is not code. I already run [Vale](https://vale.sh/) over my writing for style, so I excluded `src/content/**/*.md` and the MDX equivalent from Biome's formatter. Biome handles the code, Vale handles the words, and neither reaches into the other's territory.

## Wiring it into commits

Once the config settled, I added a Husky pre-commit hook so I would stop relying on memory. The hook runs `pnpm format` to fix and stage everything, then `pnpm run check` to make sure the types are still sound, and finally runs Vale over any staged Markdown. Formatting is no longer something I remember to do. It happens on the way into every commit, and Biome is fast enough that I never notice the pause.

## Was it worth it

Yes, and more cleanly than I expected. The migration commands did most of the translation, the dependency list got dramatically shorter, and the mental model went from "a formatter and a linter and the packages that make them get along" to "one tool that does both." I have not missed a single thing from the old setup. In fact, I have used Biome for all my projects since I switched my blog over to it!

If you already run ESLint and Prettier and it works, you do not have to tear it out. But if you are setting up a new project, or you are staring at the same pile of plugins I was and wondering whether it needs to be that complicated, Biome is worth an afternoon. Run the migrate commands, delete the old files, and see how much lighter the repo feels.

If you try it, or you think I gave up something I will regret, find me on [**Bluesky**](https://bsky.app/profile/joshfinnie.dev).
</content>
</invoke>

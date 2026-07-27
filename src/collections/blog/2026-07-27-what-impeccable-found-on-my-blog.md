---
title: "What Impeccable Found When I Pointed It at My Own Blog"
date: "2026-07-27"
tags:
  - "design"
  - "tooling"
  - "astro"
  - "best-practices"
heroImage: "blog/cleaning"
unsplash: "Towfiqu barbhuiya"
unsplashURL: "towfiqu999999"
slug: "what-impeccable-found-on-my-blog"
description: "I used Impeccable, a design skill for Claude Code, to document this blog's actual design system and then critique it against its own rules. Here is what it caught, from a shadow rule three components were quietly breaking to a blog index rendering ten H1 tags on one page."
draft: false
---

I have redesigned this blog in small pieces for years, and every pass left a little residue behind. A color here from an old component library, a shadow there because it looked fine at the time, a layout choice that made sense on one page and got copied to three others without anyone asking whether it still made sense. Nothing failed exactly. It was just a pile of decisions with no record behind them, which meant every new change was a guess about whether it fit. This month I used [Impeccable](https://impeccable.style/), a design skill built for Claude Code, to turn that pile into an actual system, and then to check my own site against it. What it found was more useful than I expected.

## What Impeccable actually does

Impeccable is not a component library or a Figma plugin. It is a set of commands that live inside Claude Code and treat your project's design system as something worth writing down and checking against, the same way you would treat your test suite. The two files that matter most are `PRODUCT.md`, which captures who your users are and what the product is actually for, and `DESIGN.md`, which captures the visual system itself: colors, type, spacing, shadow rules, named do's and don'ts. Once those exist, commands like `critique` and `polish` stop guessing at what "good" means for your project and start checking your actual code against the rules you already committed to.

That distinction is the whole point. A generic linter can tell you a color is not in your palette. It cannot tell you that your palette used to have two competing accent colors because you never finished migrating off a component library's defaults, or that a shadow on a card violates a rule you only wrote down last week. Impeccable's `document` command reads your code, extracts the tokens and patterns that are actually in use, and writes them into `DESIGN.md` as prose and named rules. From that point forward, every design conversation has something to point back to.

## The hodge-podge, made visible

Running `init` and `document` on this blog surfaced something I already suspected but had never actually looked at directly. My color tokens had two accents living side by side: `teal-500`, which every hand-written component actually used for links and hover states, and a leftover `blue-700` and `fuchsia-700` from a shadcn-style component kit I had added for the consulting page and never fully integrated. Neither was wrong on its own. Together they meant the site did not have one identity, it had two, stitched together at the seams.

`DESIGN.md` gave that problem a name: the One Accent Rule, which says teal is the only color allowed to signal "this is interactive," and nothing else competes with it. Repointing `--primary` and `--secondary` to teal and zinc took an afternoon. The value was not the color change itself. It was having a rule that would catch the next time I reached for a third accent color without thinking about it.

## The critique loop, with real numbers

The command I got the most value from is `critique`. It runs two independent passes against a page, one that reads the page like a design reviewer and scores it against Nielsen's ten usability heuristics, and one that runs deterministic checks against the actual rendered markup. Then it reconciles the two into a single report with a score out of 40, or out of whatever subset of heuristics genuinely apply to that surface.

I ran it against my homepage first and got a 23 out of 32. The report was specific in a way that surprised me. It flagged that my `Card` component was applying a shadow to blog post cards, which directly broke a rule I had just written into `DESIGN.md` reserving shadows for floating elements like the nav bar, not flat cards sitting in the page. It also caught that my homepage was showing a full job history and a resume download button above the actual blog posts, which contradicted my own stated product principle that blog readers are the primary audience and everything else is secondary.

I fixed both, then pointed `critique` at my blog index page and got a 15 out of 24, worse than the homepage in percentage terms. That one caught something no generic tool would have: every single post preview card was rendering its title as an `h1`, which meant a page with ten posts on it had ten top-level headings and no page heading of its own. It also noticed that tag and series browsing existed in my data layer, fully built, and had no entry point anywhere on the one page that should have been the main way people found posts.

After fixing the heading structure, adding descriptions and tags to each card, and giving the page an actual `h1`, I ran `critique` again. Score moved to 19 out of 24. Same rubric, same page, measurably better, and I have the two reports sitting in my repo to prove it.

## The bug that was hiding in three places at once

The most satisfying find was small and structural rather than visual. My `Button` component has an `outline` variant used across the site, from the pagination controls on my blog to a call-to-action button on my consulting page. That variant had a `shadow-xs` baked into its class list, quietly violating the same no-shadow-on-flat-surfaces rule `DESIGN.md` had already caught on the homepage. Nobody would have spotted this by staring at any single page, because the shadow is subtle and the component looks fine in isolation. It only became obvious once I had a rule that said shadows belong on floating chrome and nowhere else, and a tool willing to check every consumer of that component against it. One line removed, and every page that used an outline button got fixed at once.

## What I would tell someone starting out

Impeccable does not replace looking at your own site. I still read every diff, ran the actual build after every change, and double-checked a few of the tool's own claims against the raw HTML before trusting them, because I caught it guessing wrong along the way, like assuming a pagination page was quietly falling back to page one when it was not. That is fine. The value is not that it is infallible, it is that it gives you a rule to check claims against instead of relying on vibes, and it remembers those rules across sessions instead of making you re-explain your taste every time you sit down to work on the site.

If you already have a design system written down somewhere, `document` will probably tell you things you already half-knew but never stated plainly. If you do not have one, writing it down is the actual work, and Impeccable is a reasonable way to force that conversation with yourself.

## Putting it together

The real shift was not any single color or shadow fix. It was going from a site with an implicit, half-remembered set of design opinions to one with `DESIGN.md` sitting in the repo as the actual source of truth, checked into version control next to the code it describes. Every rule in it came from looking at what my site actually does, not from a generic best-practices list, and every fix I made this month traces back to a specific line in that file. The blog index went from 63 percent to 79 percent on the same rubric, and I can point to exactly why. That is a better way to work than hoping I remember my own decisions correctly six months from now.

If you have used Impeccable on your own project, or you think I am overselling a glorified linter, find me on [**Bluesky**](https://bsky.app/profile/joshfinnie.dev).

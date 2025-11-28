# <www.joshfinnie.com>

Personal Homepage of Josh Finnie.

[![Netlify Status](https://api.netlify.com/api/v1/badges/0b679cee-412d-4608-b2ad-f132f2e5d7ad/deploy-status)](https://app.netlify.com/sites/awesome-tereshkova-b52194/deploys)

## Setup & Develop

To setup this repo, make sure you have `pnpm` installed then run `pnpm install` after cloning.

To run this repo locally, run `pnpm run dev`.

To test and build locally, run `pnpm run build`. (This sometimes will throw errors `pnpm run dev` does not.)

## Template for Blog Post

```markdown
---
title: "<TITLE>"
date: "<DATE>"
tags:
  - "<TAG 1>"
  - "<TAG 2>"
  - "<TAG 3>"
slug: "<CUSTOM POST SLUG>"
heroImage: "@assets/blog/<IMAGE>.jpg"
unsplash: "<ARTIST>"
unsplashURL: "<ARTIST URL>"
description: "<DESCRIPTION>"
---

<TEXT GOES HERE>
```

# www.joshfinnie.com


Personal Homepage of Josh Finnie.

[![Netlify Status](https://api.netlify.com/api/v1/badges/0b679cee-412d-4608-b2ad-f132f2e5d7ad/deploy-status)](https://app.netlify.com/sites/awesome-tereshkova-b52194/deploys)


### Setup & Develop

To setup this repo, run `npm install` after cloning.

To run this repo locally, run `npm run start`.

To test and build locally, run `npm run build`. (This sometimes will throw errors `npm run start` does not.)


### Template for Blog Post

```markdown
---

title: "<TITLE>"
date: "<DATE>"
tags:
  - "<TAG 1>"
  - "<TAG 2>"
  - "<TAG 3>"
layout: '../../layouts/BlogPost.astro'
heroImage: "/assets/blog/<IMAGE>.jpg"
unsplash: "<ARTIST>"
unsplashURL: "<ARTIST URL>"
description: "<DESCRIPTION"

---
<TEXT GOES HERE>
```

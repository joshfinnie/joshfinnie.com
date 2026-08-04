---
title: "Fixing Vite's astro:server-app.js Error"
date: "2026-08-04"
description: "A dev server hiccup that looks like a code error but isn't."
tags:
  - "astro"
  - "vite"
  - "debugging"
---

Every so often the Astro dev server throws this after a full reload:

```
[ERROR] [vite] An error happened during full reload
Failed to load url astro:server-app.js (resolved id: astro:server-app.js). Does the file exist?
```

`astro:server-app.js` is one of Astro's internal virtual modules for the dev SSR runtime. It has nothing to do with whatever file you were just editing. Vite's module graph gets into a bad state during a full reload and can't re-resolve the virtual module.

Restart first:

```bash
$ pnpm dev
```

If it comes back, clear the stale caches:

```bash
$ rm -rf node_modules/.vite .astro
$ pnpm dev
```

If it still shows up after a clean restart, check for an orphaned dev server process holding the port and kill it before starting again.

---
title: "Pinning a Dependency to an Older Major Version"
date: "2026-08-04"
description: "When the newest major breaks tooling that hasn't caught up yet."
tags:
  - "pnpm"
  - "tooling"
---

`astro check` started crashing with `Cannot read properties of undefined (reading 'fileExists')`. The cause was `typescript@7`, the new Go-based native rewrite, which doesn't expose `ts.sys` the way `@astrojs/language-server` expects. The fix isn't a code change, it's pinning the dependency back to a version the tooling actually supports:

```bash
$ pnpm add -D typescript@^6
```

TypeScript 6 still uses the classic JS-based compiler, so it stays compatible with the language server, while TypeScript 7's native rewrite doesn't yet. The rule of thumb: when a tool crashes right after a major bump to one of its dependencies, check whether the surrounding tools have caught up before assuming the crash is your bug.

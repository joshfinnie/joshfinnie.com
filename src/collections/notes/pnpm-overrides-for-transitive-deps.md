---
title: "Patching a Transitive Dependency with pnpm Overrides"
date: "2026-08-04"
description: "When the vulnerable package isn't in your package.json at all."
tags:
  - "pnpm"
  - "tooling"
---

A security advisory flagged `esbuild@0.27.7` in this repo, but nothing in `package.json` depends on esbuild by name. It's pulled in transitively, through `@tailwindcss/vite`'s bundled Vite and `bundle-require`, each resolving their own copy. You can't `pnpm add` your way out of a dependency you don't own.

The fix is an override that forces the whole tree onto the patched line:

```yaml
overrides:
  esbuild: '^0.28.1'
```

The part that cost time: pnpm 10 no longer reads a `pnpm.overrides` field from `package.json`, it warns and silently ignores it. Overrides now live in `pnpm-workspace.yaml`. After `pnpm install`, only the patched version remained in the lockfile.

```bash
$ pnpm install
$ pnpm why esbuild
```

`pnpm why` is the fast way to confirm an override actually collapsed every resolution down to one version before you move on.

---
title: "Let Inferred Types Win Over Hand-Written Ones"
date: "2026-08-04"
description: "A stricter-than-reality parameter type is enough to break strict mode."
tags:
  - "typescript"
  - "astro"
---

A helper like this looks harmless:

```ts
function isPublished(post: { data: { date: string; draft?: boolean } }) {
  return !post.data.draft && new Date(post.data.date) <= new Date();
}
```

But Astro's content collections infer `draft` as `boolean | undefined`, not `draft?: boolean`. Under strict mode those aren't the same thing, and `astro check` reports a type mismatch anywhere a real post reaches the helper.

The fix is to stop hand-writing the parameter type and let the properly-typed `post` from `getCollection` flow straight into the check, inlined at each call site instead of behind a helper with its own annotation:

```ts
posts.filter((post) => !post.data.draft && new Date(post.data.date) <= new Date());
```

Same behavior, no annotation to keep in sync with the schema. Whenever a hand-rolled type on a helper drifts from the type the framework actually generates, inlining the check is the quickest way back to green.

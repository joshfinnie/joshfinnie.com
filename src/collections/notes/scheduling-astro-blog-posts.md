---
title: "Scheduling Blog Posts Without Forgetting to Flip a Flag"
date: "2026-08-04"
description: "Gate publishing on the post date instead of a draft flag you have to remember to change."
tags:
  - "astro"
  - "typescript"
---

I kept writing posts, dating them for next week, and then forgetting to flip `draft: false` when that date arrived. The fix is to stop relying on memory and let the date do the gating.

```ts
export function isPublished(post: { data: { date: string; draft?: boolean } }) {
  return !post.data.draft && new Date(post.data.date) <= new Date();
}
```

Run every consumer of the collection through this: the post route, the paginated listing, tags, series pages, and the RSS feed. Gate the OG image route too, or a future post can still leak its image at a guessable URL before it's live.

Now `draft: true` still works for anything I want to hide indefinitely, but the normal case is just dating a post in the future. The next push on or after that date publishes it, no flag to remember.

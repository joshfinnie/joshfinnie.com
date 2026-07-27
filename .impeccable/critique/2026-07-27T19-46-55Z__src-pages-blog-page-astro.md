---
target: blog index (src/pages/blog/[...page].astro)
total_score: 19
max_score: 24
na_heuristics: 5,7,9,10
p0_count: 0
p1_count: 0
timestamp: 2026-07-27T19-46-55Z
slug: src-pages-blog-page-astro
---
Method: dual-agent (A: general-purpose · B: general-purpose) — re-run after fixes

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | "Page X of Y" plus Prev/Next, semantically marked (`nav aria-label="Pagination"`) |
| 2 | Match System / Real World | 3 | Plain reverse-chronological list, clear "Read article" affordance |
| 3 | User Control and Freedom | 3 | Pagination works both directions; tag/series links now give real navigation paths |
| 4 | Consistency and Standards | 4 | Confirmed single Card shell (no shadow) used for every post regardless of hero image, verified across all 10 cards in raw HTML |
| 5 | Error Prevention | n/a | No destructive actions on a reading list |
| 6 | Recognition Rather Than Recall | 3 | Description + up to 3 tags now visible per card |
| 7 | Flexibility and Efficiency | n/a | No meaningful expert shortcut for a chronological list |
| 8 | Aesthetic and Minimalist Design | 3 | Restrained, on-brand zinc/teal palette confirmed; no stray gray-*/neutral-* classes |
| 9 | Error Recovery | n/a | No error states on this page |
| 10 | Help and Documentation | n/a | Not applicable |
| **Total** | | **19/24** | **Good (79%)** |

Up from 15/24 (63%, Acceptable) on the first pass.

## Design Specificity Verdict

**LLM assessment**: Verified, not just claimed — all 5 prior fixes are genuinely present in the rendered output, not merely in source intent. Confirmed via independent re-inspection: single Card shell regardless of hero image, correct h1→h2 heading order, tags/descriptions rendering, shadows confined to floating chrome only.

**Deterministic scan**: `detect.mjs --json` against the page, `BlogPostPreview`, `Pagination`, `Button.astro`, and `BaseLayout`: exit 0, zero findings, both before and after the additional accessibility fixes below.

**Independent verification** (by me, not just the sub-agents): confirmed exactly 1 `<h1>` + 10 `<h2>` on both page 1 and page 2; confirmed all 10 article wrappers share identical `class="my-5"` regardless of hero image; confirmed 31 tag links on page 1 (1 page-level + 30 per-card); confirmed zero shadow classes outside the three known floating-chrome elements (avatar, pill nav, mobile dropdown).

## Overall Impression

The five original fixes held up under independent re-review — this isn't a case of claimed-but-not-real. The second pass surfaced two smaller, genuinely new issues (not present in the first critique's finding set): each card had three separate links to the same destination (image, title, "Read article"), tripling keyboard/screen-reader tab stops across a 10-post list, and `Tags.astro` was borrowing Tailwind Typography's `prose` class purely to get link styling on a non-prose fragment. Both are now fixed.

## What's Working

- **Uniform Card frame** — the alternating hero/non-hero layout bug is genuinely gone; verified in raw HTML, not just source.
- **Correct heading order** — one `h1` (page) → ten `h2`s (post titles), confirmed via grep on live HTML on both pages.
- **Shadows confined to floating chrome only** — pagination's outline buttons and every card render with zero `shadow-*` classes.

## Priority Issues (found on re-review, now fixed)

**[P2] Triple redundant per-card links** — the hero image, the `<h2>` title, and a "Read article" link at the bottom all pointed to the same URL, tripling tab stops for keyboard/screen-reader users across a 10-post page (30 stops instead of 10). Fixed: the `<h2>` title link is now the single real tab stop (canonical accessible name = the post title); the image and "Read article" links are marked `tabindex="-1" aria-hidden="true"` — still clickable by mouse for sighted users, no longer separate stops for keyboard/AT navigation. The now-decorative image link's `alt` was emptied since its parent is `aria-hidden`.

**[P3] `Tags.astro` depended on Tailwind Typography's `prose` class for link styling** — pulled in `@tailwindcss/typography`'s broader prose ruleset for a fragment that isn't prose content, fragile if those defaults ever shift. Fixed: replaced with direct utility classes (`text-sm text-zinc-500 dark:text-zinc-400`, `hover:text-teal-500 dark:hover:text-teal-400`) matching the site's existing link-hover convention, and added `aria-hidden="true"` to the decorative tag icon.

## Persona Red Flags

**Screen-reader/keyboard user browsing the archive**: was the clearest remaining friction point (triple-link redundancy); now resolved — one tab stop per card, with an unambiguous accessible name (the post title).

**Returning reader skimming for something specific**: works well — description + tags give enough to decide without a click, a meaningful improvement over the prior text-only h1-title cards.

## Minor Observations

- 25 of 115 posts have no `heroImage`; none appeared on pages 1-2 in this check (both pages happened to show only hero-image posts), so the no-image card path wasn't exercised against live content on this run. The code path is unchanged and structurally identical either way (`{post.data.heroImage && (...)}` conditionally renders only the image slot; the Card shell, title, description, and tags render unconditionally), so this is a coverage note rather than an open defect.
- An unused `--color-gray-200` Tailwind custom property is still emitted globally (palette generation, not a violation since nothing consumes it as a class) — not worth chasing further.

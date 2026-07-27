---
target: blog index (src/pages/blog/[...page].astro)
total_score: 15
max_score: 24
na_heuristics: 5,7,9,10
p0_count: 0
p1_count: 2
timestamp: 2026-07-27T15-09-06Z
slug: src-pages-blog-page-astro
---
Method: dual-agent (A: general-purpose · B: general-purpose)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | "Page X of Y" is clear, confirmed real (page 1 vs page 2 show different posts) |
| 2 | Match System / Real World | 3 | Straightforward chronological blog list, plain-English dates |
| 3 | User Control and Freedom | 2 | Only Prev/Next; `getTags`/`getSeries` exist in `src/lib/utils.ts:29-39` but are completely unused on this page |
| 4 | Consistency and Standards | 2 | Two visually distinct card layouts alternate unpredictably; shared `Button` "outline" variant bakes in `shadow-xs`, violating the flat-surface rule everywhere it's used |
| 5 | Error Prevention | n/a | No destructive actions on a reading list |
| 6 | Recognition Rather Than Recall | 2 | No description/excerpt or tags per card — relevance is unjudgeable without a click |
| 7 | Flexibility and Efficiency | n/a | A chronological read list has no meaningful expert shortcut to add |
| 8 | Aesthetic and Minimalist Design | 3 | Restrained palette holds up; mixed hero/non-hero card rhythm is the one visible inconsistency |
| 9 | Error Recovery | n/a | No error states surfaced on this page |
| 10 | Help and Documentation | n/a | Not applicable to a reading list |
| **Total** | | **15/24** | **Acceptable (63%)** |

## Design Specificity Verdict

**LLM assessment**: This reads as a generic "image blog card" template — hero image, overlay date+title, Prev/Next pager — with no content-type-specific signal. Nothing on the page says "senior engineer's Rust/Go/Python blog" until a reader reads an actual title; no language/tag badges, no reading time, no code-adjacent visual cue. Swap in any other personal blog's posts and nothing else would need to change.

**Deterministic scan**: `detect.mjs --json` against the page and its composed components (`BlogPostPreview`, `Pagination`, `BaseLayout`, `Header`, `Footer`, `Nav`): exit 0, zero findings. It correctly didn't flag `BlogPostPreview.astro`'s cards for shadow violations (there are none — confirmed by direct source grep), but it also can't see cross-file rule violations like the shared `Button` component's `outline` variant carrying `shadow-xs`, since that requires reading DESIGN.md's own invariant, not a generic anti-pattern.

**Visual overlays**: Unavailable — no browser automation tool exists in this session (confirmed directly, not just by the sub-agents). I independently verified the two structural claims that mattered most: pagination genuinely renders different post titles on `/blog/` vs `/blog/2/` (page 1 shows "Deleting My Copy-Code Component…", page 2 shows different titles, "Page 1 of 11" vs "Page 2 of 11" — Assessment B's identical-file-size worry was a false alarm, byte count coincidence, not a stale fallback), and the heading-structure claim: `grep -c` undercounted because the build output is single-line HTML; `grep -o "<h1"` confirms exactly 10 `<h1 class="font-bold text-3xl -mb-1">` elements on page 1, one per post card, and no separate page-level `<h1>Blog</h1>` exists anywhere on the page.

## Overall Impression

The restraint that makes the homepage feel calm works against this page: ten posts in a row with only a title, a date, and (inconsistently) a hero image gives a scanning reader nothing to judge relevance by, and no way to narrow by topic even though the tag/series data already exists in the codebase, just unused. The biggest opportunity: surface each post's description and a couple of tags on the card, and give readers an actual way into the tag/series browsing that's already built but disconnected from this page.

## What's Working

- **Flat cards, correctly implemented**: `BlogPostPreview.astro`'s cards carry zero shadow classes — this component did not repeat the `Card.astro`/`WorkExperience.astro` shadow violation fixed elsewhere this session.
- **Teal discipline holds**: the accent only appears on hover states, consistent with the One Accent Rule.
- **Date-badge overlay** (`bg-zinc-200 dark:bg-zinc-800` on hero-image posts) is a small, specifically-authored touch rather than default template chrome.

## Priority Issues

**[P1] No excerpt or tags shown per post card** — `BlogPostPreview.astro:21-52` renders only a hero image (sometimes), a date, and a title; `post.data.description` exists in the content schema (used elsewhere, e.g. `Article.astro` on the homepage) but is never shown here. A reader scanning ten posts can't judge relevance without opening each one. Fix: add `post.data.description` (1-2 lines, clamped) under the title, matching the treatment `Article.astro` already gives homepage previews. → `/impeccable clarify`

**[P1] Heading structure is wrong: 10 `<h1>`s per page, no page-level heading** — every post card renders its title as `<h1 class="font-bold text-3xl -mb-1">` (`BlogPostPreview.astro:36` and `:45`), and the page itself (`src/pages/blog/[...page].astro`) has no `<h1>` of its own. Ten same-level top headings on one page breaks the document outline for screen readers and hurts SEO. Fix: give the page a single `<h1>Blog</h1>` (or similar) and demote each card's title to `<h2>`. → `/impeccable audit`

**[P2] Tag and series browsing exists in the data layer but is disconnected from this page** — `getTags` and `getSeries` (`src/lib/utils.ts:29-39`) power `/tags/` and `/series/` elsewhere on the site, but `/blog/` itself offers zero entry point into either: no tag chips on cards, no link to browse by topic. For a technical blog where readers often want "just the Rust posts," this is a real discovery gap. Fix: link each post's tags (2-3 max) on its card to `/tags/[tag]/`, and/or add a link to `/tags/` near the page heading. → `/impeccable layout`

**[P2] Shared `Button` "outline" variant violates the no-shadow-on-flat-surfaces rule** — `src/components/starwind/button/Button.astro`'s `outline` variant recipe includes `shadow-xs` (confirmed in source), which `Pagination.astro`'s Prev/Next buttons inherit, along with every other `variant="outline"` consumer on the site (e.g. the Consult page's outline CTA). This is a system-level defect, not a one-off — fix it once in `Button.astro` rather than patching each consumer. → `/impeccable polish`

**[P3] Inconsistent card layout alternates unpredictably** — posts with a `heroImage` get an image+overlay treatment; posts without get a bare text header (`BlogPostPreview.astro:21-51`), producing visibly different card sizes/rhythms interleaved in the same list. Fix: give text-only posts a consistent frame (even a quiet placeholder), or drop hero images from the list view entirely for uniformity. → `/impeccable layout`

## Persona Red Flags

**Jordan (first-time reader arriving from search/RSS)**: Lands mid-list with no page heading or short framing ("Recent posts on Rust, Go, Python…") confirming they're in the right place — only the browser tab's `<title>` says "Blog."

**Casey (mobile reader)**: Hero images at 1024×576, even scaled down, dominate the viewport before any text is visible, pushing each card's title further below the fold and increasing scroll effort to compare posts.

## Minor Observations

- `Nav.astro` has no active/current-page indicator (no `aria-current`), so a reader on `/blog/` can't tell which nav item corresponds to where they are — a gap that likely exists site-wide, not just here.
- The calendar icon rendered alongside each date lacks `aria-hidden`, so screen readers may announce redundant decorative markup next to the visible date text.

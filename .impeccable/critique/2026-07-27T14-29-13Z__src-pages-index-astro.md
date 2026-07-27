---
target: homepage (src/pages/index.astro)
total_score: 23
max_score: 32
na_heuristics: 7,10
p0_count: 2
p1_count: 1
timestamp: 2026-07-27T14-29-13Z
slug: src-pages-index-astro
---
Method: dual-agent (A: general-purpose · B: general-purpose)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|-----------|-------|-----------|
| 1 | Visibility of System Status | 3 | Static site; CurrentlyReading has a real loading skeleton, nothing else needs status |
| 2 | Match System / Real World | 4 | Concrete employer names, dates, plain first-person language |
| 3 | User Control and Freedom | 3 | Simple nav, no traps, working theme toggle |
| 4 | Consistency and Standards | 2 | `Card.astro` applies `shadow-lg` to both blog and job cards, directly contradicting DESIGN.md's own Floating-Chrome-Only rule |
| 5 | Error Prevention | 3 | External links use `rel="noopener"`; no destructive actions on this page |
| 6 | Recognition Rather Than Recall | 3 | Nav labels clear; icon-only social links carry aria-labels |
| 7 | Flexibility and Efficiency | n/a | No power-user path exists or is needed on a personal homepage (Read-mode surface) |
| 8 | Aesthetic and Minimalist Design | 2 | Homepage stacks bio + posts + reading widget + full job history + resume CTA, all at once |
| 9 | Error Recovery | 3 | CurrentlyReading fetch fails silently and degrades gracefully |
| 10 | Help and Documentation | n/a | Not applicable to a read-only blog surface |
| **Total** | | **23/32** | **Good (72%)** |

## Design Specificity Verdict

**LLM assessment**: The hero copy is genuinely authored — real employer, real stack, first-person voice — and avoids generic "passionate developer" filler. But the structural pattern (shrinking avatar into a pill nav, card-based post list, job-history timeline with logos, resume download) is the well-known Tailwind UI "Spotlight" portfolio template, close to verbatim. Content is specific; the frame is off-the-shelf.

**Deterministic scan**: `detect.mjs --json` against `index.astro` and its composed components (Hero, Content, BlogPostPreview, BaseLayout, Header, Footer, Nav) returned exit code 0, zero findings. The detector's static/regex/DOM-cascade rules didn't catch the shadow-rule or grid-layout violations below — those require reading DESIGN.md's own documented invariants, which is outside what a generic anti-pattern detector checks. No false positives to report since there were no findings.

**Visual overlays**: Not available this session — no browser automation tool (e.g. claude-in-chrome) was present in either the parent or either sub-agent's tool list. Both design review and detector evidence relied on source inspection and a `curl` fetch of rendered HTML rather than live viewport/contrast measurement. Treat the contrast finding below as computed from hex values, not measured live.

## Overall Impression

The bio and writing are the strongest thing on the page — specific, warm, credible. But the homepage tries to be blog index, resume, and reading log simultaneously, and in doing so breaks two of DESIGN.md's own just-written rules (shadow-lg on flat cards, a two-column grid) while crowding the primary blog-reading task with a full career timeline + resume CTA that PRODUCT.md explicitly says shouldn't happen ("consulting is secondary and must not crowd out the reading experience"). The single biggest opportunity: move job history off the homepage (it already lives on `/about`) and let the page commit to being a reading-first surface.

## What's Working

- **Hero bio** (`Hero.astro`) is authentically written in first person with a real photo and real specifics — not templated filler.
- **Footer** is restrained and correctly teal-only, matching the "Studio Desk" mood.
- **Avatar-to-pill-nav shrink** correctly confines shadow/blur to the one floating element DESIGN.md's Floating-Chrome-Only rule permits — the signature interaction is implemented cleanly.

## Priority Issues

**[P0] `Card.astro` violates the Floating-Chrome-Only shadow rule**
- **Why it matters**: `src/components/Card.astro:12` applies `shadow-lg` unconditionally, and this component wraps both blog post preview cards and (via `WorkExperience.astro`) job-history cards on the homepage. DESIGN.md, written this session, explicitly reserves `shadow-lg` for the avatar/pill nav and says flat surfaces get a hairline border only. This is now a real system violation, not a hypothetical one.
- **Fix**: Drop `shadow-lg` from `Card.astro`'s base classes; keep the existing `border border-zinc-200 dark:border-zinc-700`. Same fix applies to `CurrentlyReading.astro:52` (`shadow-sm` on the book cover) and `WorkExperience.astro:24` (`shadow-md shadow-zinc-800/5 ring-1 ring-zinc-900/5` on the logo circle) — the latter reuses the avatar's exact shadow recipe on a static list item, which is visually consistent with the avatar but still a rule violation since it isn't floating/scrolling chrome.
- **Suggested command**: `/impeccable polish` (or `/impeccable audit` first to confirm no other shadow instances were missed)

**[P0] Homepage's job history + resume CTA compete with the primary blog-reading task**
- **Why it matters**: `Content.astro` uses `grid lg:grid-cols-2`, which directly contradicts DESIGN.md's "single centered reading column, no multi-column grid" rule, and gives a full career timeline + resume download equal visual weight to the 3 recent posts. This also violates PRODUCT.md's own stated principle: "Blog readers are the primary audience; consulting is secondary and must not crowd out the reading experience." A first-time reader lands expecting writing and instead sees a resume button and 5-entry job timeline before the blog content is reinforced.
- **Fix**: Collapse to a single column. Move job history and the resume CTA off the homepage (both already live on `/about`, which is one nav click away) or demote them to a short one-line credential mention below the post list, not a competing block.
- **Suggested command**: `/impeccable layout`

**[P1] No visual hierarchy between homepage section headers**
- **Why it matters**: "Recent Blog Posts," "Currently Reading," and "Job History" all use identical `text-sm font-semibold` styling. Nothing signals to a visitor which section is the priority, worsening the P0 above.
- **Fix**: Give the primary section (posts) a heavier/larger heading treatment (per DESIGN.md's Title hierarchy: 700 weight, 1.875rem) and demote secondary sections to Label-weight headers.
- **Suggested command**: `/impeccable typeset`

**[P2] Contrast failure on job-history footer text**
- **Why it matters**: `WorkExperience.astro:33` sets `text-zinc-400` (not `zinc-500`) as the *light-mode* color for `CardFooter`, at `text-xs` (12px). Computed contrast of zinc-400 (`#a1a1aa`) against a white card background is ≈2.56:1, well under WCAG AA's 4.5:1 requirement for body text of this size.
- **Fix**: Change to `text-zinc-500 dark:text-zinc-400` to match the pattern already used correctly elsewhere in the same file (line 30).
- **Suggested command**: `/impeccable audit`

**[P3] Scattered minor shadow-rule violations**
- **Why it matters**: Beyond the P0 above, `CurrentlyReading.astro:52`'s `shadow-sm` book cover is a small, low-visibility instance of the same Floating-Chrome-Only violation.
- **Fix**: Same fix as the P0 shadow issue; likely resolved in the same pass.
- **Suggested command**: `/impeccable polish`

## Persona Red Flags

**Jordan (First-Timer / first-time blog reader)**: Lands on the homepage expecting a technical blog, but before any sense of "this is a writing-focused site" is reinforced beyond 3 short post cards, they're shown a resume-download button and a 5-entry job timeline. Reads as a resume site with a blog attached, not a blog with a byline.

**Casey (Distracted Mobile User)**: On mobile the two-column grid collapses to one column, so the full job-history list sits between the post list and the footer, adding meaningful scroll length before reaching site-wide nav/RSS — a real cost for someone skimming one-handed.

## Minor Observations

- `Hero.astro:16` has a dead empty `<p>` tag — vestigial markup that makes spacing behavior harder to predict.
- The Twitch icon sits alongside GitHub/Bluesky/LinkedIn in the hero with no indication it's still an active/relevant link given current positioning.

---
name: joshfinnie.com
description: Personal homepage and blog for a senior software engineer, built quiet and text-first around a floating avatar/nav.
colors:
  paper-white: "#ffffff"
  paper-zinc-50: "#fafafa"
  ink-zinc-800: "#27272a"
  surface-zinc-900: "#18181b"
  muted-zinc-600: "#52525b"
  muted-zinc-400: "#a1a1aa"
  teal-accent: "#14b8a6"
  teal-accent-dark: "#2dd4bf"
  border-hairline: "#f4f4f5"
  border-hairline-dark: "rgba(255,255,255,0.1)"
typography:
  display:
    fontFamily: "Inter, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.015em"
  title:
    fontFamily: "Inter, sans-serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.2
  body:
    fontFamily: "Inter, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.7
  label:
    fontFamily: "Inter, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  sm: "6px"
  md: "8px"
  lg: "10px"
  full: "9999px"
spacing:
  xs: "0.75rem"
  sm: "1rem"
  md: "1.5rem"
  lg: "2rem"
  xl: "8rem"
components:
  nav-pill:
    backgroundColor: "rgba(255,255,255,0.9)"
    textColor: "#27272a"
    rounded: "{rounded.full}"
  card:
    backgroundColor: "#ffffff"
    textColor: "#27272a"
    rounded: "{rounded.md}"
    padding: "16px"
---

# Design System: joshfinnie.com

## Overview

**Creative North Star: "The Studio Desk"**

The site is a fixed, dependable frame around content that changes: a small circular avatar that shrinks into a floating pill nav as you scroll, a stable two-column-width reading measure, and a footer that never competes for attention. Everything is neutral zinc gray at rest; a single teal accent marks the handful of things that are interactive (links, hover states, one primary action). The mood is quiet and restrained, closer to a working engineer's notebook than a "designed portfolio." Nothing decorative is allowed to compete with the words on the page.

The shadcn/starwind component kit that powers `/consult` and its `Button`/`Card` primitives originally shipped its own scaffolding colors (`--primary: blue-700`, `--secondary: fuchsia-700`) and a separate `neutral-*` gray family alongside the blog's hand-authored `zinc-*` utilities. Both have been consolidated: `--primary`/`--primary-accent` now resolve to `teal-700` (light) / `teal-700`–`teal-600` (dark), `--secondary` resolves to a neutral `zinc-700`/`zinc-300` fill rather than fuchsia, and every `--color-neutral-*` token reference in `global.css` was repointed to the matching `--color-zinc-*` step so the token layer and the hand-authored markup share one gray family. Semantic status tokens (`info`/`success`/`warning`/`error`, sky/green/amber/red) are unchanged; they signal state, not brand, and don't compete with the One Accent Rule.

**Key Characteristics:**
- One accent color (teal), used sparingly, everywhere else neutral zinc
- Depth reserved for floating chrome (avatar + pill nav); everything else is flat with hairline borders
- Generous, centered reading column; no dense grid layouts
- Sans-only type (Inter), no serif or display face
- Rounded, soft geometry throughout (pill nav, rounded cards/images); no sharp corners

## Colors

Neutral-dominant palette: zinc grays carry every surface, border, and body of text; teal is the system's only accent and appears only on interactive elements.

### Primary
- **Teal Accent** (`#14b8a6` light / `#2dd4bf` dark, Tailwind `teal-500`/`teal-400`): the single accent color. Used exclusively for link hover states (nav, footer, body links) and, per the consolidation decision, should become the `--primary` token driving the starwind `Button` "primary" variant once that migration lands.

### Neutral
- **Paper White** (`#ffffff` / zinc-50 `#fafafa`): page and card background in light mode.
- **Ink Zinc** (zinc-800/900 `#27272a`/`#18181b`): primary body and heading text; card background in dark mode.
- **Muted Zinc** (zinc-600/400 `#52525b`/`#a1a1aa`): secondary text (byline dates, footer copy, subdued paragraphs).
- **Hairline Zinc** (zinc-100/200, `rgba(255,255,255,0.1)` in dark): borders and dividers; never a visible drop shadow substitute, always a 1px ring or border.

### Named Rules
**The One Accent Rule.** Teal is the only color that signals "interactive." It appears on ≤5% of any given screen: link hovers, icon-hover states, and the primary button. It never appears as a background fill or large surface.

**The One Gray Family Rule.** `zinc` is the project's only neutral scale. `global.css`'s shadcn/starwind token layer (`--background`, `--card`, `--muted`, `--border`, etc.) resolves entirely to `--color-zinc-*` steps, matching the hand-authored `zinc-*` utilities used across the blog. Don't introduce `gray-*` or `neutral-*` utilities anywhere in the codebase; they read as off-tone against the zinc scale even though they look similar at a glance.

## Typography

**Body/Display Font:** Inter (with system sans-serif fallback), loaded via Astro's font API from Google Fonts.

**Character:** A single, workmanlike sans typeface carries every role from hero headline to footer fine print. There is no serif or display face; hierarchy comes from weight and size, not a type pairing.

### Hierarchy
- **Display** (700, `clamp(1.875rem, 4vw, 3rem)` / text-3xl–5xl, tight tracking): hero headline and page `h1`s (e.g. homepage tagline, blog post titles).
- **Title** (700, 1.875rem / text-3xl): blog post preview titles, section headers.
- **Body** (400, 1rem, line-height 1.7): article prose, rendered through Tailwind Typography's `prose prose-zinc` (and `dark:prose-invert`); centered reading column, justified on the homepage bio paragraphs.
- **Label** (500, 0.875rem): nav links, footer links, tag lists, byline dates.

### Named Rules
**The Prose-First Rule.** Any block of running text (bio, article body, tag lists) goes through Tailwind Typography's `prose prose-zinc dark:prose-invert` rather than hand-set type scale utilities, so long-form content always inherits the same measure, leading, and link styling.

## Layout

Content lives in a single centered column, never a multi-column grid: `max-w-2xl` on mobile widening to `lg:max-w-5xl`, itself nested inside a `max-w-7xl` outer frame with `sm:px-8 lg:px-12` gutters. This same column width is reused identically across header, main content, and footer so the page reads as one continuous ruled sheet rather than stacked independent sections.

The header is the signature structural device: a small circular avatar that sits inline with the content column on load, then (via CSS custom properties: `--avatar-image-transform`, `--avatar-border-opacity`, `--header-position`) shrinks and slides into a `position: sticky` floating pill nav as the page scrolls. This scroll-driven transform is a durable layout invariant, not a one-off animation.

Vertical rhythm is generous: `mt-32` between the last content block and the footer, `mt-6`/`mt-5` between paragraphs and post entries. Cards and post previews stack in a single flow (`my-5`), not a grid, on all breakpoints observed.

## Elevation & Depth

Flat by default. Cards, footer, and prose blocks use a 1px hairline border or `ring-1` instead of a shadow — `Card.astro`, `WorkExperience.astro`, `Education.astro`, and the book cover in the CurrentlyReading widget all carry only a border/ring, no shadow. Depth is reserved for UI that physically floats over content: the avatar chip, the pill nav, the mobile nav dropdown, and the dismissible "Currently Reading" corner widget, all of which carry `shadow-lg shadow-zinc-800/5` plus a `ring-1 ring-zinc-900/5` and (for the avatar/pill nav) a `backdrop-blur-sm` frosted-glass treatment as they sit above scrolling content.

### Shadow Vocabulary
- **Floating chrome** (`shadow-lg shadow-zinc-800/5` + `ring-1 ring-zinc-900/5`, `backdrop-blur-sm` where the surface is translucent): avatar badge, pill nav, mobile nav dropdown, and the fixed-position "Currently Reading" widget — the only elements that overlay scrolling content rather than sitting in the document flow.

### Named Rules
**The Floating-Chrome-Only Rule.** Shadows exist to signal "this sits above the page," not "this is a card." If an element doesn't scroll independently of the content beneath it (i.e. it isn't `fixed`/`sticky` and overlaid), prefer a hairline border/ring over a shadow.

## Shapes

Soft and rounded throughout, with radius increasing with a component's visual weight: the avatar and mobile menu button use `rounded-full`, cards and hero images use `rounded-lg`/`rounded-md` (~8–10px), and the starwind design-token scale (`--radius: 0.625rem` base, stepping from `--radius-xs` at ~4px to `--radius-3xl` at ~26px) formalizes this same soft-corner logic for any new component. No sharp (0px) corners appear anywhere in the current implementation.

## Components

### Buttons
- **Shape:** `rounded-md` (~6px), per the starwind `button` recipe's base class.
- **Primary:** `bg-primary` resolves to teal-700, the system's one accent, reserved for the single dominant action per view. Sizes range `sm`/`md`/`lg` (h-9/h-11/h-12) plus matching icon-only variants.
- **Secondary:** `bg-secondary` resolves to a neutral zinc fill (zinc-700 on white text in light mode, zinc-300 on dark text in dark mode) rather than a second accent color — a quieter filled option that doesn't compete with teal.
- **Hover / Focus:** `hover:bg-{variant}/90` opacity dim on hover, `focus-visible:ring-3 ring-{variant}/50` for keyboard focus. Disabled state drops to 50% opacity and disables pointer events.
- **Ghost / Outline:** `outline` uses a bordered, background-matched neutral surface; `ghost` is borderless, showing only a muted hover background; both read as quieter than primary, consistent with the "restrained and functional" component character — outline/ghost are the default choice, with primary reserved for the one dominant action per view.

### Cards
- **Corner Style:** `rounded-lg` (~8px).
- **Background:** white / zinc-50 in light mode, zinc-800/900 in dark mode.
- **Shadow Strategy:** paired `shadow-lg` + `border` (zinc-200 light / zinc-700 dark); see Elevation & Depth's Card Lift entry. Used for post preview cards and the starwind `Card` primitives on `/consult`.
- **Border:** 1px, zinc-200 (light) / zinc-700 (dark).
- **Internal Padding:** `p-4` (16px).

### Navigation
- **Style:** desktop nav is a floating pill (`rounded-full`, translucent white/zinc-800 background, `backdrop-blur-sm`, hairline ring, `shadow-lg`); mobile collapses to a "Menu" disclosure button with an Alpine.js-driven dropdown list.
- **Typography:** `text-sm font-medium`, zinc-800/zinc-200 default.
- **States:** links go `hover:text-teal-500` (`dark:hover:text-teal-400`); no active/current-page state is currently styled.
- **Mobile:** full-width dropdown panel below a "Menu" trigger, same rounded/shadow/ring treatment as the desktop pill.

### Tags
- **Style:** inline comma-separated list prefixed by a small icon, rendered through `prose prose-zinc` so tag links inherit standard prose link styling (no chip/pill background).

### Footer
- **Style:** single hairline top border (zinc-100 / zinc-700 at 40% opacity in dark), centered on small screens, split into link row + copyright row on `sm:` and up. Links use the same teal hover treatment as nav.

### Currently Reading (signature component)
A dismissible corner widget (`CurrentlyReading.astro`), `fixed bottom-4 right-4`, that surfaces the book Josh is currently reading without competing with the primary content column. It earns the Floating-Chrome-Only shadow treatment because it genuinely overlays scrolling content. Appears after a 600ms delay (avoids a jarring instant pop-in), dismissible via an `×` button, and remembers the dismissal per-book in `localStorage` so it reappears when the book changes rather than being gone forever.

## Do's and Don'ts

### Do:
- **Do** keep teal as the only accent color; every other surface stays zinc neutral.
- **Do** reserve `shadow-lg` for elements that float above scrolling content (avatar, pill nav, mobile nav dropdown, the Currently Reading widget); use a hairline border/ring everywhere else, even on cards.
- **Do** route all long-form text through `prose prose-zinc dark:prose-invert` rather than hand-building a type scale.
- **Do** keep the centered `max-w-2xl`/`lg:max-w-5xl` reading column consistent across header, content, and footer.

### Don't:
- **Don't** reintroduce blue-700/fuchsia-700 (the original starwind defaults) as a second accent; `--primary`/`--secondary` are consolidated to teal/zinc and should stay that way.
- **Don't** use `gray-*` or `neutral-*` color utilities; `zinc` is the project's one neutral scale.
- **Don't** add a serif or second display typeface; Inter carries every role.
- **Don't** build a multi-column grid layout for content; the site's rhythm is a single stacked column at every breakpoint observed so far.
- **Don't** add decorative shadows to flat surfaces (body text blocks, plain sections); depth is reserved for the floating header chrome.
- **Don't** use a thick colored `border-l-4`-style accent bar for callouts/quotes; use a hairline border + soft neutral fill (rounded-lg, border-zinc-200/700, bg-zinc-50/zinc-800/50), matching the card language.

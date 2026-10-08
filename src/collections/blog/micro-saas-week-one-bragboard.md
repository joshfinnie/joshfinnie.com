---
title: "Micro SaaS Week One: Bragboard"
date: "2026-10-10"
tags:
  - "micro-saas"
  - "side-projects"
  - "indie-hacking"
  - "ai"
slug: "micro-saas-week-one-bragboard"
description: "Bragboard turns rough notes about your work into a sourced, first-person record, asks for the details you left out, and builds resumes from it. Here's how week one went."
heroImage: "blog/micro-saas-bragboard"
unsplash: ""
unsplashURL: ""
---

Every performance review, I sit down to write about the last six months and remember about three things I did. I've lost the numbers. I've lost the names of the people I worked with. Week one of the [October micro SaaS challenge](/blog/the-october-micro-saas-challenge) was me building the tool I keep wishing I had, and it's live at [**bragboard.dev**](https://bragboard.dev).

## What Bragboard Does

You log a win in plain words, the way you'd type it into Slack right after a deploy. Claude turns those notes into a short first-person narrative covering the problem, what you did, who helped, and what changed. Then it asks you up to five questions about what's missing. What was the measurable result? Did you lead this or support it? How many services did it touch?

Each answer goes into the narrative, and the question closes. Skip one and it stays closed for good. The record gets better every time you come back, and you can come back in a two-minute burst or a long session before a review.

The narrative isn't the end product. It's source material. Bragboard keeps your positions, education, and skills in a profile, links each brag to a job, and writes a resume from the whole record. Paste in a job posting and it writes a tailored version, picking the brags that fit and reporting which requirements the resume covers.

Nobody starts with an empty history, so there are two importers. You can drop in an old resume PDF. You can also export your merged pull requests with the GitHub CLI on your own machine:

```sh
gh search prs --author @me --merged --limit 1000 \
  --json number,title,body,repository,closedAt,url > prs.json
```

Claude groups those pull requests into accomplishments and matches them to your jobs. Because `gh` runs with your login, private company repos come along, and Bragboard never gets access to GitHub.

## Facts Only Come From You

I care about one rule more than any other in this product. Claude may not invent anything. No made-up metrics, team sizes, tools, or dates. A missing detail becomes a question instead of a guess. Most AI resume tools do the opposite, and the result reads like a LinkedIn post about someone you've never met.

A rule in a system prompt is a request, not a guarantee, so I wanted a way to check it. Every input Claude sees carries an id. Notes lines are `N1`, `N2`. Answered questions are `A1`. Your messages are `M1`, and pull requests are `P1`. Claude has to return the narrative as sentences, each tagged with the ids that back it up:

```ts
const SOURCE_RULES = `Every input carries an id: notes lines (N1, N2),
answered questions (A1), the user's messages (M1), and pull requests (P1).
Write the narrative as paragraphs, each a list of sentences, and give every
sentence the ids of all the inputs that state its facts.`;
```

The server maps those ids back to real records and stores the result. On the brag page there's a Blame view, the same idea as `git blame`, that shows where every sentence came from. If a sentence claims a 40% latency drop, you can click it and see the note where you said so. If it can't point anywhere, that's a bug I can see.

The same rule carries into resumes. Each bullet stores the brags it came from, and tailored resumes use the posting's keywords only where a brag already shows the same thing.

## Questions Are Rows, Not Chat

My first version was a chat thread. It fell apart fast. Claude would re-ask things I'd already answered, and the prompt grew with every message.

Now each question is a row in Postgres with a status of `open`, `answered`, or `dismissed`. Every call rebuilds the prompt from current state: the notes, the current narrative, answered questions as a fact log, and dismissed questions so Claude knows not to ask them again. Old narratives never get replayed. Prompt size tracks the size of the record, not the length of the conversation.

Writes go through one `db.batch`, which Neon runs as a single transaction. The narrative update, the history entry, and the question changes all land together. If the Claude call fails, nothing gets written.

## Treating User Text As Data

Everything a user types or uploads reaches Claude inside tagged sections like `<notes>` and `<pull_requests>`. The system prompt says tagged material describes the user's work and is never an instruction. That alone doesn't stop someone from writing `</notes>` in their notes and following it with "new instructions." So any text that imitates one of my tags gets defanged before it's sent:

```ts
const SECTION_TAG = new RegExp(
  `<(\\s*/?\\s*(?:${SECTION_TAGS})\\b[^>]*)>`,
  "gi",
);

export function neutralizeTags(text: string): string {
  return text.replace(SECTION_TAG, "‹$1›");
}
```

Angle brackets become guillemets, and the fake tag is just text. Claude also has no tools, sees only the signed-in user's data, and its output renders as plain text. A successful hijack could only mess up your own brag.

The job posting fetcher got the same suspicion. It takes a URL from the user and fetches it on the server, which is the textbook setup for server-side request forgery. Every resolved address has to be public, including each redirect's, and the fetcher gives up past 3 MB or 10 seconds.

## Living Inside Netlify's 60 Seconds

Netlify functions stop at 60 seconds, and Claude calls can take tens of seconds. That limit shaped more of the design than anything else.

Every Claude call gets a 50-second deadline, retries included, so a slow response ends in a clear error instead of a killed function. The GitHub importer sends pull requests in batches of up to 100, four at a time, one request per batch. A resume writes each job's bullets in parallel calls, which gets a full resume down to about 15 seconds. Imported brags don't get drafted at import time at all. They get their narrative the first time you open them.

Every system prompt is also sent as a cached block. When you answer three questions on one brag in a row, most of the prompt comes back from the cache at a fraction of the price. The admin page shows how much of the input came from the cache, along with spend by day and p95 latency per call type.

## Pricing And Limits

Free covers 30 first drafts a month, one resume import, 50 imported pull requests, one general resume, and one tailored job. Pro is $12 a month or $96 a year. The split follows the two ways people use it. Logging wins as they happen should be free forever. The job search, with an import and a tailored resume for every posting, is where the paid tier lives.

I didn't add a usage counter anywhere. Bragboard counts usage from records that already exist: successful draft calls this month, pull requests stored on brags, resumes, job targets. Counters drift. Rows don't.

The Stripe webhook follows the same idea. It never trusts the event payload for state. It verifies the signature, then re-reads the subscription from Stripe:

```ts
if (SUBSCRIPTION_EVENTS.has(event.type)) {
  const object = event.data.object as { id: string };
  await syncSubscription(object.id);
}
```

Stripe doesn't promise events arrive in order. Re-reading on every event means a late `updated` can't overwrite a newer `deleted`.

Now the honest part. As I write this, I've finished and tested the Stripe code, but the production keys aren't set, and the pricing section still says "Pro is coming soon." That fails my own rule about a checkout that would take a real card. The code was never the hard part. Flipping the switch is, which is exactly the problem I said this month was for.

## Where I Broke The Rules

I froze the stack: Astro, Neon, Stripe, Netlify. Bragboard is Next.js. The app is almost all server actions and forms that write to Postgres and then re-render, and the App Router gave me that pattern for free. I'd make the same call again. It still breaks a rule I made two weeks ago, and I'd rather say so than pretend I didn't.

I also broke "scope gets cut, never extended," and not a little. The plan was notes, a narrative, and questions. By Wednesday it had two importers, star ratings for importance, duplicate detection and merging, skill suggestions, a drag-and-drop resume editor, an ATS-friendly PDF, and job tailoring. That's 43 commits and about 19,000 lines of TypeScript. Claude Code made each feature cheap enough that saying no felt silly. Saying no was the point, though, and next week I'm going to try harder.

## Putting It Together

Bragboard turns rough notes about your work into a sourced, first-person record, asks for the details you forgot, and writes resumes from it without making anything up. The parts I'm proudest of are the boring ones: sentence-level sources, questions stored as rows, and usage counted from data that already exists. The week also taught me that I can keep adding features forever while the one task that makes it a business sits there undone. If you've ever kept a brag doc, I'd love to hear whether this would replace it on [**Bluesky**](https://bsky.app/profile/joshfinnie.dev).

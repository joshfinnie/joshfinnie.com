---
title: "Micro SaaS Week Four: SignedOnSite"
date: "2026-10-31"
tags:
  - "micro-saas"
  - "side-projects"
  - "indie-hacking"
  - "stripe"
slug: "micro-saas-week-four-signedonsite"
description: "SignedOnSite lets home service pros quote a job on their phone, get the customer's e-signature, and collect a deposit before leaving the driveway. Here's how week four went."
heroImage: "blog/micro-saas-signedonsite"
unsplash: ""
unsplashURL: ""
---

A contractor looks at a job, writes a number on a notepad, and promises to email a real quote tonight. By the time it lands, the homeowner has three other quotes and has stopped answering. Week four of the [October micro SaaS challenge](/blog/the-october-micro-saas-challenge) was a tool for closing that gap while everyone is still standing in the driveway, and it's live at [**signedonsite.com**](https://signedonsite.com).

## What SignedOnSite Does

A pro signs up and picks the kind of work they do. There are six choices: handyman, plumbing, electrical, heating and cooling, painting, and flooring. Each one loads a starter price book with 15 to 26 common jobs at typical US prices. Shared items like a service call or haul-away show up once, no matter how many trades you pick.

On site, the pro builds a proposal from that price book on their phone, attaches photos of the job, and sets a deposit between 25 and 50 percent. Then they hand the phone over, or text or email a link. The homeowner reviews it, types their name, signs with a finger, and pays the deposit by card. Both sides get the signed PDF by email.

Every job moves through the same pipeline: draft, sent, signed, deposit paid, complete. That's the whole product. No scheduling, no dispatch, no invoicing, and no QuickBooks sync. Those belong to the big field service suites, and SignedOnSite isn't trying to be one.

## From Plumbers To Every Trade

The spec I started from was for plumbers only. The landing page talked about crawling under sinks, and the price book was all plumbing. On the first evening I wrote to Claude:

<!-- vale write-good.Passive = NO -->

> so i think this should be used by more than just plumbers... this should be for any handyman type job

<!-- vale write-good.Passive = YES -->

The change took about ten minutes. Claude went through every place in the app that assumed plumbing, added the trade picker, and wrote starter price books for the other five trades. The hero example on the landing page turned into a deck repair: four lines, $1,510 total, and a $377.50 deposit.

That cuts against the usual micro SaaS advice to pick one narrow audience and own it. I know. The core flow doesn't change between a plumber and a painter, though. Only the price book does, and a price book is data, not code.

## Signing Exactly What You Saw

The part I care about most is the signature. A signed proposal has to prove the customer agreed to exactly what was on their screen. Not what the pro edited five minutes later, and not what the database happens to hold now.

When the customer opens the proposal, the page carries a SHA-256 hash of a snapshot of everything on it. When they sign, the server builds the snapshot again and compares:

```ts
export async function signProposal(proposal: FullProposal, businessName: string, input: SignatureInput) {
  if (proposal.status !== "sent") throw new ProposalError("This proposal can't be signed right now");
  const snapshot = buildSnapshot(proposal, businessName);
  const signedHash = hashSnapshot(snapshot);
  if (signedHash !== input.reviewedHash) {
    throw new ProposalError("This proposal changed while you were reviewing it. Reload to see the latest version.");
  }
  // ...
}
```

The update that marks it signed only matches a row whose status is still `sent`, so two people tapping Sign at once can't both win. The snapshot, the hash, the typed name, the drawn signature, the IP, and the user agent all get stored, and nobody can edit a signed proposal after that.

The first version had a bug the tests caught. Postgres stores the snapshot as `jsonb`, and `jsonb` doesn't keep key order. Read the snapshot back, hash it again, and you'd get a different answer for the same proposal. The fix is a canonical JSON writer that sorts keys before hashing:

```ts
function canonicalJson(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0));
    return `{${entries.map(([k, v]) => `${JSON.stringify(k)}:${canonicalJson(v)}`).join(",")}}`;
  }
  return JSON.stringify(value);
}
```

A hash is only proof if you get the same answer every time you compute it.

## The Deposit Goes Straight To The Pro

Like TeamDues, the money never touches me. Each pro connects their own Stripe account through Connect, using Accounts v2 with the full Stripe dashboard. The deposit is a direct charge on that account, and Stripe owns the fees and the losses. SignedOnSite takes no cut.

Two things mark a deposit as paid. The Connect webhook does it, and so does the customer coming back from Checkout, so the pro sees "deposit paid" right away instead of waiting on a webhook. Both paths are idempotent, so whichever arrives second does nothing. A pro without Stripe connected can still record a cash or check deposit by hand.

## Launch Day Was All Config

I finished the code Wednesday night. Thursday went to getting it live, and almost none of that was code.

Claude set up a `production` branch in Neon through the MCP server, emptied the data it copied from dev, and made storage credentials that only work on that branch. Job photos and signatures live in Neon's object storage, which speaks the S3 protocol, so the app reads `AWS_*` variable names. Netlify reserves `AWS_` for its own functions, so those became `SOS_AWS_*`. My `BETTER_AUTH_URL` in Netlify was missing `https://`, which broke the build. Claude fixed the value and made the app add a missing scheme. Then the build failed again, because I had imported all 16 variables as secrets. Netlify's secret scan found the `EMAIL_FROM` address sitting in `.env.example` and stopped the deploy. Six of those variables weren't secret at all, so they became plain ones.

Stripe was the smooth part again. I pasted Stripe's "help me get started" prompt, logged the CLI into a new SignedOnSite account, and Claude created the Solo and Crew products, all four prices, the customer portal, and both webhooks from inside the session. It also noticed my `.env.production` held a test key from a different Stripe account before anything went live.

## Pricing

Solo is $59 a month for one user. Crew is $99 a month for up to five, with the whole team's jobs visible. Yearly is $590 or $990, so two months free. Every account starts with a 14-day trial with no card.

There are no per-proposal fees. A pro who sends forty proposals a month pays the same as one who sends four. If a trial runs out, sending new proposals stops, but customers can still sign anything already sent. A homeowner should never hit a paywall on someone else's account.

## Where I Broke The Rules

The deadline held, with a day to spare. I built SignedOnSite on Wednesday and Thursday, and it was live on its own domain Thursday night, taking real subscriptions and real deposits.

Scope did not hold. The trade picker turned a plumbing product into one for six trades on the first night. I also added a "Remove all" button for the price book, with a confirmation and an undo, and emails that send the signed PDF to both sides. Each one was small and each one was useful. Together they are the same pattern as week one.

The stack held, if Next.js counts as the stack now. Neon did more work this time, with the database, a test branch, a production branch, and file storage all on one project. Auth is better-auth. The app is about 7,700 lines of TypeScript, plus 3,300 lines of tests: 41 unit tests and a Playwright journey from sign-up to "job complete" on a phone and a desktop.

And like the other three, nobody in the trades has seen it yet. The site is live, and I haven't shown it to a single contractor.

## Putting It Together

SignedOnSite gets a home service pro from walkthrough to signed and booked before they leave the driveway. The signature locks to a hash of exactly what the customer saw. The deposit goes straight into the pro's own Stripe account. The price book is the only part that changes between trades, which is why opening it up to six of them took an evening and not a rewrite. The code took two days. Launch day was environment variables, and the next job is the one I've skipped all month: putting it in front of people who quote jobs for a living. If you run a trade business and still quote on paper, tell me what would get you to try this on [**Bluesky**](https://bsky.app/profile/joshfinnie.dev).

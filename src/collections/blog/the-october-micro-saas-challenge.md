---
title: "The October Micro SaaS Challenge"
date: "2026-09-30"
tags:
  - "micro-saas"
  - "side-projects"
  - "challenges"
  - "indie-hacking"
slug: "the-october-micro-saas-challenge"
description: "Four weeks, four small paid software products, and the constraints I'm setting so the month produces something other than another folder of unfinished repos."
heroImage: "blog/micro-saas-october"
unsplash: "Ricardo Gomez Angel"
unsplashURL: "rgaleriacom"
---

I have a directory on this laptop full of side projects that got to about 70% and stopped. None of them ever asked anyone for money. I've decided that's the actual problem, so for the month of October I'm building micro SaaS products and charging for them from day one.

## What A Micro SaaS Is

A micro SaaS is a paid software product that does one thing, run by one person, with no ambition to become a platform. Small enough that the founder handles support, billing, and deploys in the same afternoon. The product solves a narrow problem for a narrow audience, and the pricing page has one or two tiers on it.

The best-known examples have all outgrown the label. Plausible Analytics started as two founders posting progress on Indie Hackers and now employs a handful of people. Bannerbear is still Jon Yongfook by himself, publishing his revenue numbers in public, and it passed a million a year in 2025. Neither took venture money, and both started exactly where I'm starting: one person, one narrow job, a price on it. Graduating out of micro SaaS is what success looks like, which is why the examples never quite match the definition.

What separates this from a side project is the payment. A side project has users, sometimes. A micro SaaS has customers, and customers file bug reports and cancel subscriptions and tell you exactly which feature they actually wanted.

## Micro SaaS Against The Alternatives

The three modes get confused a lot, so here's how I separate them.

| | Side project | Micro SaaS | Venture SaaS |
|---|---|---|---|
| Goal | Learning, fun | Monthly revenue | Market capture |
| Team | One, casually | One, deliberately | Hired quickly |
| Revenue target | None | Hundreds to low thousands | Millions |
| Scope | Grows on a whim | Frozen on purpose | Expands by mandate |
| Success signal | It works | Someone renews | Growth rate |
| Failure cost | Lost weekend | Lost weekend plus a support inbox | Lost years |

The middle column is the one I've never actually attempted, and the row that matters is "someone renews."

## Why The Model Works Now

The expensive parts of running a software business got cheap. Payments are a library call. Auth is a library call. A Postgres instance costs less per month than lunch, and the hosting bill for a product with fifty paying customers rounds to zero.

Billing used to be the wall that stopped me. It isn't anymore, and the entire revenue surface of a small product looks about like this:

```ts
// src/pages/api/stripe-webhook.ts
import type { APIRoute } from "astro";
import Stripe from "stripe";
import { db } from "../../lib/db";

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

export const POST: APIRoute = async ({ request }) => {
  const sig = request.headers.get("stripe-signature")!;
  const event = stripe.webhooks.constructEvent(
    await request.text(),
    sig,
    import.meta.env.STRIPE_WEBHOOK_SECRET,
  );

  if (event.type === "customer.subscription.updated") {
    const sub = event.data.object;
    await db.setPlan(sub.customer as string, sub.status);
  }

  return new Response(null, { status: 200 });
};
```

That's the billing system. Forty lines including imports, and everything else in the product is the part that makes it worth paying for. The hard problem was never the code, which is precisely why I keep writing code instead of doing the hard problem.

## Why I'm Doing This

I want the reps. Building one product teaches you about that product. Building four in four weeks teaches you what's common to all of them, which is the part I'm missing.

There's a second reason, less flattering. I'm good at the engineering and bad at the part where I tell someone the price. A month with a deadline attached forces the uncomfortable half. If the code is great and nobody can pay for it, the week failed, and I want to feel that four times in a row.

## The Rules I'm Proposing

These are my starting constraints, and I reserve the right to discover that some of them were stupid.

One product per week, four total, starting October 1. Each one ships to a public URL with a working Stripe checkout before Friday ends. Not a waitlist, not a "contact me for pricing" form, a live checkout that would take a real card.

The stack is frozen. Astro, Postgres on Neon, Stripe, deployed to Netlify, all things I already know. Learning a new framework mid-challenge is the most appealing way to waste a week, so it's off the table.

Scope gets cut, never extended. If Thursday arrives and the product isn't done, I ship a smaller product rather than a later one. A Friday deadline that slides is just a Tuesday with extra steps.

Every build gets a post the same week, published here, covering what it does and what went wrong. Those posts will run as a series alongside this one.

And I keep whatever I build. No deleting the repo on Saturday because it embarrassed me.

## What Failure Looks Like

Four weeks is nowhere near enough time to learn whether any of these products has a market. I know that going in. The month optimizes for reps and for finishing, not for revenue, and anyone reading this expecting a revenue screenshot at the end should adjust now.

The real risk isn't that nothing sells. It's that I end October with four live Stripe accounts, four domains renewing annually, and four small support obligations I didn't plan for. Shipping is not free after the ship date. I'd rather name that now than discover it in November.

## Putting It Together

Micro SaaS is small paid software that does one job for one audience, and the reason it's viable is that the infrastructure got boring and cheap while the hard part stayed human. I'm giving myself four weeks, one product a week, each with a live checkout before Friday, on a stack I already know, with a post per build. The goal isn't income. It's to stop being a person who builds things nobody ever pays for.

First build goes up next week. If you've done something like this and know which of my rules is about to break first, I'd genuinely like to hear it on [**Bluesky**](https://bsky.app/profile/joshfinnie.dev).

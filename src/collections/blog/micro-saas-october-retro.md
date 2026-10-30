---
title: "The October Micro SaaS Challenge: A Retro"
date: "2026-11-04" # TODO: confirm publish date once SignedOnSite ships
tags:
  - "micro-saas"
  - "side-projects"
  - "indie-hacking"
  - "ai"
slug: "micro-saas-october-retro"
draft: true
description: "Four micro SaaS products in four weeks, built with Claude Code: what shipped, which rules broke, what it cost, and what I'd change next time."
heroImage: "blog/micro-saas-retro"
unsplash: "Zongnan Bao"
unsplashURL: "zbao"
---

In September I gave myself four weeks to ship four small paid products, each with a live checkout by Saturday. October is over, and I have four public URLs, a pile of broken rules, and a much clearer idea of where my time actually goes. The code was the cheap part, and that cuts both ways.

## Four Products In Four Weeks

Here's what the month produced, side by side.

| Product | What it does | Price | Checkout by deadline | Size |
| --- | --- | --- | --- | --- |
| [Bragboard](https://bragboard.dev) | Turns notes about your work into a sourced record and resumes | Free, or $12/mo Pro | No, keys not set | ~19,000 lines |
| [TeamDues](https://teamdues.com) | Collects youth sports fees for volunteer coaches | $15 per team per month | Yes | ~9,750 lines |
| [NoShowFixer](https://noshowfixer.com) | Confirm or cancel reminders built on an existing calendar | $19 to $30/mo, free in early access | No, left off on purpose | ~5,200 lines |
| [SignedOnSite](https://signedonsite.com) | Plumbing proposals signed and deposit paid in the driveway | $59 Solo, $99 Crew | TODO | TODO |

<!-- TODO: add a "Results" column or a short paragraph here with real signups, paying customers, and revenue for each product. Zeros are fine. -->

Four products, four audiences, four pricing models. Bragboard is freemium. TeamDues charges per team for the length of a season. NoShowFixer has feature tiers. SignedOnSite is a flat monthly fee with no per-proposal cut. I didn't plan that spread, but it means I now have four different answers to "how should this charge," and only one of them has taken a real card so far.

<!-- TODO: one or two sentences on SignedOnSite and how week four went, once it ships. -->

## Astro Out, Next.js In

The biggest change from the plan is that none of the four run on Astro. The kickoff post froze the stack at Astro, Neon, Stripe, and Netlify, all tools I already knew. Then all four products shipped on Next.js.

The switch happened on day one. Bragboard is almost all server actions and forms that write to Postgres and re-render, and the App Router gives you that pattern for free. I called it a broken rule in the week one post and said I'd make the same call again. By week two I stopped pretending and said the rule was wrong. Weeks three and four didn't even come up for debate.

Astro is still what I reach for when a site is about content. This blog runs on it and isn't moving. A micro SaaS is the opposite. It's forms, auth, and state that changes on every request, and Next.js fits that shape.

<!-- TODO: the "why" in your own words. Was it purely the app shape, or did Claude Code also do better work in Next.js than Astro (more training data, more conventions to follow)? Any pain points with Next.js over the month, like build times, caching surprises, or Netlify quirks? -->

The rest of the frozen stack held. Neon, Stripe, and Netlify ran under all four products. Looking back, the framework was never the part worth freezing. The services I pay for and have to keep running were.

## How AI Changed The Build

I built all four with Claude Code. For this post I went back through the session logs for every project, and the same patterns show up in all of them.

### A Spec In, A Product Out

Three of the four started the same way. I pasted a spec of 1,500 to 2,100 words, with the data model, the routes, the pricing, and a list of what was out of scope. I didn't use plan mode. Claude asked a couple of questions and then built. TeamDues went from spec to 140 files, 66 unit tests, and 6 end-to-end tests in about 67 minutes of agent time. SignedOnSite's first working version took about 43 minutes. Bragboard was the exception. It grew out of an old demo repo over a week of back and forth.

<!-- TODO: where did the specs come from? The TeamDues spec mentions a shared 00-shared-infra-and-logistics.md file and a build window of Oct 27-31, which reads like you wrote several specs up front. Did Claude help write them? -->

After the spec, my prompts got short. Most were around 35 characters: "let's do it," "commit and push," "fix all of it." I steered by picking answers from Claude's multiple-choice questions far more than by typing. Bragboard alone had 26 rounds of them.

The spec wasn't always the last word. On NoShowFixer I asked Claude to review the spec before building, and it pushed back. It said I had about four days left and should ship the no-show reducer alone. It flagged SMS carrier registration and Google OAuth review as blockers I couldn't clear in a week. I took the cut. The waitlist filler, the bundle, and texting all waited, and I swapped Google sign-in for a plain calendar feed. Claude rewrote that part of the design in about four minutes with the tests still passing.

### Bragboard Became The Template

Week one paid for the rest of the month. On TeamDues and SignedOnSite, Claude went looking through my other repos and copied Bragboard's auth, database, and test setup. Each new product started on a stack I had already debugged once.

### Stripe And Neon Build For Agents

The services I kept frozen turned out to be the ones that worked best with an agent, and I don't think that's a coincidence.

Neon feels like its team pictured an agent as the user. Claude created all four databases through Neon's MCP server. I never clicked "new project." Every project got a `test` branch, so the tests ran against real Postgres without touching production data. On Bragboard, Claude ran the production migrations through the MCP. On NoShowFixer it made a `production` branch. On SignedOnSite it set up private storage buckets for job photos. All of that happened inside the same conversation where I was describing the product.

Stripe's tooling for Claude Code is the best I've used from any company. On Bragboard I pasted Stripe's own "help me get started" prompt, which installed their plugin. Billing went from "let's talk about the monetization of this for a second" to live code with a migration in about 30 minutes. On TeamDues the Stripe skill moved Claude off Express accounts, which Stripe now treats as legacy, and onto Accounts v2 for Connect. Setting up Stripe this way was easier than doing it on Stripe's own website.

<!-- TODO: one concrete moment where the Stripe or Neon tooling clearly beat the dashboard. -->

The rough spots were at the edges. The Stripe sandbox key couldn't create connected accounts, so TeamDues' Connect flow never ran against real Stripe in that session.

### Claude Checked Its Own Work

I asked for almost none of the checks. On Bragboard alone, Claude ran lint about 149 times and typecheck about 124 times. Test counts climbed every day. Bragboard went from 73 tests to 192 in a week, and NoShowFixer went from 38 to 88. Claude took phone and desktop screenshots, read them back, and fixed what looked off.

Those tests caught real bugs. On SignedOnSite, Postgres reordered the keys in a `jsonb` column, which broke the hash that proves a customer signed exactly what they saw. A date format crashed every signed page. Claude's own tests found both before I did.

Design went through the same loop. I ran `/impeccable` on all four products. It wrote the PRODUCT.md and DESIGN.md files, then sent pairs of reviewer subagents over each screen to score it and list fixes.

### Where It Cost Me

On Bragboard's first day, a copy command also deleted uncommitted prototype files. Claude got most of them back from Next's build cache, all but one migration. My admin cost dashboard had the wrong per-token prices for Opus until I showed Claude my real bill. On NoShowFixer, an overnight design-review loop went down to a three-pixel gap on the landing page. Claude checked SES in the wrong AWS account, and the Inngest keys didn't save on Netlify until the third try.

Almost every one of those was at the edge where code meets a real account: credentials, DNS, billing, deploy settings. Inside the repo, Claude was fast and careful. Outside it, I still had to be in the room.

### What Wasn't Possible Before

Without these tools, October would have been one product, maybe. Each of these has auth, a database with migrations, payment code, tests in the hundreds or close to it, accessibility fixes, and a design review on every screen. The NoShowFixer email setup even handles bounces and complaints through signed notifications. That's what a small team ships over a quarter. I had a week per product, and the first working version of each took an afternoon.

The gain wasn't typing speed. One person could now work at every layer, from Postgres branches to Stripe Connect to a screen reader reading a form label, and do it to a standard I'd want my name on. The bottleneck moved off the code.

<!-- TODO: confirm the "one product, maybe" estimate and the "small team over a quarter" comparison match how you'd put it. -->

The part AI didn't touch is the part the challenge was about. I finished and tested Bragboard's Stripe code in week one, and I still didn't set the production keys. No model writes the sentence that asks a stranger for money.

## The Rules That Held And The Ones That Broke

I covered the frozen stack above. It was the first rule to go, and it went for good.

The checkout rule went one for three before week four. Bragboard missed it. TeamDues made it, with a checkout that takes a real card. NoShowFixer skipped it on purpose, because a reminder tool has to prove itself on real calendars before anyone pays for it. I still think that call was right, and it still broke the rule.

<!-- TODO: did SignedOnSite have a live checkout by October 31? -->

Scope went from the worst rule to the best one. Week one blew past it. TeamDues did fees and nothing else, with no scheduling and no team chat. NoShowFixer cut its waitlist filler and its bundle even after I'd designed and modeled both.

The post-per-build rule held. Every week got its write-up on its deadline day. The last rule was to keep whatever I built and not delete the repo on Sunday. All four are still up.

<!-- TODO: confirm all four are staying up, and which (if any) you'll keep working on. -->

One caveat on the scoreboard. Week one got two extra days because October 1 was a Thursday, and the later weeks didn't. Some of Bragboard's size is just time.

<!-- TODO: the logs don't line up with one product per calendar week. Bragboard work started September 30, TeamDues was built October 8 and 9, NoShowFixer October 22 and 23, and SignedOnSite started October 28. Worth saying so? -->

## The One I Didn't Believe In

I liked three of the four ideas a lot. Bragboard is the tool I kept wishing I had. TeamDues and SignedOnSite take a boring money problem off the plate of someone with no spare time. NoShowFixer never clicked for me. I still can't say why. The no-show math is real, and the spec was as solid as the others. I just didn't feel it.

It shows in the work. I pushed the other three until every flow worked end to end, with real tests behind them. NoShowFixer shipped with no end-to-end suite, no CI, and no checkout. In the week three post I called leaving the checkout off a deliberate choice, and it was. It was also the easy choice for a product I didn't care much about. Maybe it was burnout three weeks in. Maybe I was just getting tired of the challenge.

Here's the surprising part. NoShowFixer works anyway. It reads a calendar feed, sends the reminders, handles bounces, and runs on its own domain with email out of the SES sandbox. A product I didn't believe in used to end up in that folder of unfinished repos I mentioned in the kickoff. This time my lack of enthusiasm cost me polish and tests, not the whole product. I think that's a real benefit. You can ship a working micro SaaS on an idea you're lukewarm about, and let real users tell you if you were wrong, instead of talking yourself out of it first.

The catch is that belief still matters. It shows up in the last stretch: the test suite, the checkout, the launch. A product I don't care about still gets built. It just doesn't get finished.

<!-- TODO: confirm the "easy choice" line about the checkout is fair. It reads the week three decision a little less charitably than that post did. -->

## What Failure Actually Looked Like

Back in September I said the real risk wasn't that nothing sold. It was ending October with four Stripe accounts, four domains renewing every year, and four small support jobs I never planned for.

I got the domains. bragboard.dev, teamdues.com, noshowfixer.com, and signedonsite.com all renew next fall whether anyone pays or not.

I didn't get the support load, and the reason is the real failure of the month. I never announced any of them. Each one went live at a public URL, got a blog post, and then sat there. I didn't post a launch, email a single coach or plumber, or show any of them to the people I built them for. You can't get support requests from customers who don't know you exist.

None of my rules asked for that. I wrote rules for shipping: a public URL, a checkout, a frozen stack, a post. Not one of them said a real person in the target audience had to hear about the product. So I followed the rules and skipped the part that makes it a business.

Time is the other half. Getting each product to a state I was happy with took longer than I planned, every week. The rest of each week went into polish, not outreach. Back in September I wrote that I'm good at the engineering and bad at the part where I tell someone the price. Four weeks later, that's still true. A month with deadlines didn't force the uncomfortable half. It gave me four new places to avoid it.

<!-- TODO: the rest of this section needs your numbers.
  - How many Stripe accounts are actually live?
  - What do the four cost per month to run (Neon, Netlify, Inngest, Twilio, SES, domains)?
  - Any signups at all, even organic ones from the blog posts?
-->

## What I'd Do Differently

I'd make outreach a rule with a deadline, the same as the checkout. Something like ten real people in the target audience who see the product before Saturday. I'd also save the last day of each week for it, and if the build ran over, the product would ship rougher. A product nobody has seen doesn't get any better from another day of polish.

I'd make the checkout the first task of the week, not the last. Every week where the checkout slipped, the code for it was already done. Leaving it until Friday turned it into the one thing I could put off, and I put it off.

I'd freeze services instead of frameworks. Neon, Stripe, and Netlify never moved, and they're the ones that cost money and need looking after. Swapping the frontend framework cost me nothing.

I'd set up tests and CI on day one. TeamDues had unit, database, and Playwright tests running in CI, and it was the week I trusted most. NoShowFixer had no end-to-end suite and no CI, for a tool that sends email in someone else's name.

<!-- TODO: confirm these three are yours, and add anything else. Would you run the challenge again? What would change about the format itself (one product a week, Saturday deadlines)? -->

## Putting It Together

October gave me four live products and taught me that with Claude Code doing most of the typing, my limit is no longer how fast I can build. It's how willing I am to say no to a feature and how soon I'll show the thing to a stranger. Scope got better every week. The checkout didn't keep up, and outreach never started. I built four products for coaches, practitioners, plumbers, and job seekers, and none of them heard about it from me. The parts that held were the boring services underneath, and the rule I broke first was the one that mattered least. The rule I needed most was the one I never wrote.

<!-- TODO: final verdict. Are you going to announce any of them now? Which one first? -->

If you've run your own build challenge, or you're thinking about one, tell me which rule you'd keep on [**Bluesky**](https://bsky.app/profile/joshfinnie.dev).

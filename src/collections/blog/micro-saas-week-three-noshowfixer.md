---
title: "Micro SaaS Week Three: NoShowFixer"
date: "2026-10-24"
tags:
  - "micro-saas"
  - "side-projects"
  - "indie-hacking"
  - "nextjs"
slug: "micro-saas-week-three-noshowfixer"
description: "NoShowFixer sends appointment reminders that clients confirm or cancel in one tap, built on the calendar a solo practitioner already uses. Here's how week three went."
heroImage: "blog/micro-saas-noshowfixer"
unsplash: ""
unsplashURL: ""
---

A massage therapist who charges $90 a session and eats three no-shows a month loses over $3,000 a year to empty tables. Big booking platforms solve this, but the solo tutor or trainer running everything out of Google Calendar isn't going to switch tools to fix it. Week three of the [October micro SaaS challenge](/blog/the-october-micro-saas-challenge) was for that person, and it's live at [**noshowfixer.com**](https://noshowfixer.com).

## What NoShowFixer Does

The practitioner pastes in their calendar's secret iCal address. NoShowFixer reads their upcoming appointments, finds each client's email, and sends reminders ahead of every session. The client taps Confirm or Cancel. That's the whole loop for the client. They never make an account, and the email comes from "Stillwater Massage via NoShowFixer" with the practitioner's own address as reply-to.

When a client cancels, the practitioner gets an email right away. One click in the dashboard opens the slot back up. The dashboard keeps score in dollars. A practitioner doesn't care how many emails went out. They care how many sessions they kept.

The product has a planned second half: a waitlist that gets offered any slot that opens, first to claim it wins. A bundle would release any appointment not confirmed by a deadline straight to that waitlist. The state machine and plans already know about both, but only the no-show reducer shipped this week.

## The Calendar Stays Theirs

My first plan was Google OAuth. It would have given me write access to the calendar, push notifications, and a Google verification process that takes weeks. None of that fits in seven days.

An iCal feed is a dumb URL that returns the whole calendar as text. Google, Apple, Outlook, and Fastmail all give one out. It's read-only, so NoShowFixer can never touch the practitioner's calendar. When a slot opens, the dashboard tells them and they update their own calendar. I like that tradeoff more than I expected. The practitioner never has to wonder what some app did to their schedule.

A secret calendar URL is still a password, so it gets encrypted at rest. Fetching a URL a stranger pasted into a form is a textbook server-side request forgery hole too. Every fetch resolves the hostname first and refuses private addresses, and it follows redirects by hand so each hop gets the same check:

```ts
for (let redirects = 0; redirects <= 3; redirects++) {
  await assertPublicHost(url.hostname);
  const response = await fetch(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    headers: { accept: "text/calendar, text/plain;q=0.5" },
  });
  // ...
}
```

Polling is the real cost. Every ten minutes an Inngest cron fans out one sync per practitioner, and each sync diffs the feed against what's in Postgres. An event missing from the feed means the practitioner deleted it, so the appointment gets cancelled. That rule is dangerous when a feed comes back half empty because a provider hiccuped. So the diff has a brake:

```ts
const live = existing.filter((a) => !CLOSED.includes(a.status));
plan.remove = live.filter((a) => !seen.has(a.externalId)).map((a) => a.id);
plan.suspiciousRemoval = plan.remove.length >= 3 && plan.remove.length > live.length / 2;
```

If more than half of the live appointments vanish at once, NoShowFixer cancels nothing and tells the practitioner to check their calendar link. Losing three real cancellations to a pause is fine. Wiping out a week of bookings because Google returned an empty file is not.

Matching events to clients is the fuzzy part. NoShowFixer looks for attendee emails first, then any email in the event description, then a client whose name matches the event title exactly. If none of those work, the appointment shows up as needing a contact rather than getting a guess.

## Links That Don't Act On Their Own

The obvious design is a Confirm link that confirms on click. It breaks on day one. Corporate mail scanners and link previewers open every URL in an email. A Confirm link that acts on GET would confirm every appointment for every client behind Outlook's safe links. And a Cancel link would cancel them.

So every link in an email opens a page with one button, and only the button's POST changes anything. The links themselves carry a signed token with the action, the appointment, the client, and an expiry two hours after the session starts:

```ts
export function createActionToken(payload: ActionPayload): string {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}
```

That's an HMAC over the JSON, verified with `timingSafeEqual` on the way back. No token table, nothing to clean up. The magic link login uses the same page plus button pattern for the same reason. A login link that a scanner can burn before the person opens it is a support ticket waiting to happen.

## One Door For Every Status Change

An appointment can be pending, confirmed, cancelled, released, open, refilled, or expired. Three different things can move it: the client tapping a button, the practitioner clicking in the dashboard, and the calendar sync. They race. A client can tap Cancel in the same second the sync notices the event moved.

Every move goes through one function. The allowed transitions live in a table:

```ts
const RULES: Record<TransitionReason, Rule> = {
  client_confirmed: { from: ["pending"], to: "confirmed" },
  client_cancelled: { from: ["pending", "confirmed", "refilled"], to: "cancelled" },
  event_deleted: { from: ["pending", "confirmed", "refilled", "open"], to: "cancelled" },
  confirm_deadline: { from: ["pending"], to: "released" },
  event_moved: { from: ["pending", "confirmed", "refilled"], to: "pending" },
  // ...
};
```

`transitionAppointment` locks the row with `SELECT ... FOR UPDATE`, filtered to the statuses the reason allows. If the row isn't in one of them, nothing happens and the caller gets `null`. Otherwise it writes the new status and an audit row in the same transaction. A cancel that loses a race to a deletion becomes a no-op instead of an error. Every change also leaves a record, which matters for a product that promises to never surprise anyone.

## Back To Sleeping Jobs

Last week I threw out one-job-per-installment for an hourly sweep, because cancelling stale jobs got ugly. This week I went right back to one job per appointment. Each job plans its reminders, then sleeps until each one:

```ts
for (const [index, at] of plan.reminders.entries()) {
  await step.sleepUntil(`wait-${index}`, at);
  outcomes.push(await step.run(`send-${index}`, () => sendReminder(event.data.appointmentId, plan.plannedStart, index)));
}
```

The difference is what happens when the job wakes up. It reloads the appointment and checks everything again. Still pending? Same start time the job planned around? Plan still includes reminders? Client hasn't unsubscribed or bounced? If anything changed, it logs why and skips. Inngest's `cancelOn` kills the old job when an appointment gets rescheduled, but that's only a cleanup. The reload is the guard. A stale job can wake up and it simply does nothing.

TeamDues needed the sweep because reminder timing came from shared data that changed constantly. Here each appointment owns its own timeline, and sessions are hours apart instead of weeks. Precise timing matters more. A reminder at "two hours before" has to go out two hours before, not at the top of the next hour.

The timing itself is a pure function. `planReminders` takes the start time, the practitioner's offsets, their time zone, and their quiet hours, then pushes any send that lands overnight to the next morning. If a client books too late for the first reminder, it sends one now, but only if the client still has enough time to reply. It has its own test file, since time zones and quiet hours that wrap past midnight are where I trust myself least.

## Pricing

The plan is three tiers. The no-show reducer is $19 a month, the waitlist filler is $19, and the bundle with automatic release is $30. Yearly is ten times monthly. Every account gets a 14-day trial with a card.

Right now none of that is live. NoShowFixer is free during early access, and every practitioner who finishes onboarding gets comped onto the no-show plan. I'd rather have a handful of practitioners on real calendars telling me what breaks than one paying customer I can't support yet. Billing access already runs through one function that reads the subscription status, so turning on Stripe is a webhook and a checkout page, not a rewrite.

## Where I Broke The Rules

The big one first. The challenge rule was a live checkout that takes a real card by Saturday. NoShowFixer doesn't have one. Last week I wrote that I finally flipped the switch, and this week I left it off on purpose. A reminder tool only proves itself once real appointments run through it, and I'd rather earn trust with free accounts first. It's still a broken rule, and I'm saying so instead of quietly moving the goalposts.

Scope got cut, which is the rule I'm proudest of keeping. I designed and modeled the waitlist filler and the bundle, then left both out. SMS waits on carrier registration, so email is the only channel. Amazon SES handles sending, with bounces and complaints coming back through signed SNS notifications and landing in a suppression list.

The stack held, if you count Next.js as the stack now. Netlify, Neon, and Inngest stayed from last week. The whole thing is about 5,200 lines of TypeScript, roughly half the size of TeamDues. Testing is the weak spot. There are unit tests for the state machine, the schedule, the calendar diff and parser, client matching, tokens, and the SNS verification. There's no end-to-end suite and no CI yet. A tool that sends email in someone else's name needs both, and they're first on the list for next week.

## Putting It Together

NoShowFixer gets clients to confirm or cancel from the calendar a practitioner already uses. It reads that calendar through a plain iCal feed and never writes to it. It refuses to cancel anything when the feed looks broken. Every email link opens a page with a button so mail scanners can't act for anyone. Every status change goes through one locked transition, and reminder jobs check the world again every time they wake up. I shipped the product without its checkout and without its second feature. That's a smaller week than I planned, and an honest one. If you run your own calendar and lose sessions to no-shows, tell me what would make you trust this on [**Bluesky**](https://bsky.app/profile/joshfinnie.dev).

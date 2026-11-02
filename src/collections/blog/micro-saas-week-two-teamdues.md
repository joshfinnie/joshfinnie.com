---
title: "Micro SaaS Week Two: TeamDues"
date: "2026-10-17"
tags:
  - "micro-saas"
  - "side-projects"
  - "indie-hacking"
  - "stripe"
slug: "micro-saas-week-two-teamdues"
description: "TeamDues collects youth sports fees for volunteer coaches: paste a roster, set a fee plan, send payment links, and let reminders run until every family pays. Here's how week two went."
heroImage: "blog/micro-saas-teamdues"
unsplash: ""
unsplashURL: ""
---

Every youth sports season, some volunteer ends up holding a spreadsheet, a pile of Venmo screenshots, and a list of parents who still owe $150. Collecting the money is the worst part of the job, and it lands on the person with the least free time. Week two of the [October micro SaaS challenge](/blog/the-october-micro-saas-challenge) was a tool for that person, and it's live at [**teamdues.com**](https://teamdues.com).

## What TeamDues Does

A coach or treasurer pastes in the roster the league already sent. TeamDues reads the columns, cleans up phone numbers, and groups siblings into one family. Then the coach sets the fee. It can be one payment or a set of installments, with sibling discounts and scholarships if the team offers them.

Every family gets a private payment link by email. The parent never makes an account. They open the link on their phone, see what they owe for each of their kids on one page, and pay by card. Reminders go out on their own until the family pays in full.

Plenty of families will still pay with cash, a check, or Venmo. Recording those by hand is a first-class feature, not an afterthought. A team can skip card payments entirely and still get the roster, balances, and reminders.

The roster import took more work than I expected. League spreadsheets have no standard shape. One has "Parent Email," the next has "Mom's e-mail," and some have no header row at all. The parser guesses the mapping from header hints and lets the coach fix it:

```ts
const HEADER_HINTS: { field: RosterField; patterns: RegExp[] }[] = [
  { field: "guardianEmail", patterns: [/e-?mail/] },
  { field: "guardianPhone", patterns: [/phone|cell|mobile|text/] },
  { field: "guardianName", patterns: [/parent|guardian|mom|dad|contact/] },
  { field: "playerName", patterns: [/player|child|kid|athlete|student|^name$/] },
];
```

If the first row matches a hint and contains no phone numbers or emails, it's a header. Otherwise it's data.

## Replaying Balances Instead Of Storing Them

Money is where a product like this earns trust or loses it. A balance that's wrong by $20 means a coach sends an awkward text to a parent who already paid. I wanted balances that can't drift, so TeamDues never stores them.

Instead, there's a replay. Any change that touches money locks the team's row in Postgres. That includes a payment, a refund, a new discount, a plan edit, or a roster change. Every payment then gets re-applied, oldest first, to the oldest unpaid installments for that parent's kids:

```ts
for (const payment of [...payments].sort(comparePayments)) {
  let left = payment.creditedCents;
  const players = playersByGuardian.get(payment.guardianId);
  if (!players) continue;
  for (const installment of ordered) {
    if (left <= 0) break;
    if (!players.has(installment.playerId)) continue;
    const open = remaining.get(installment.id)!;
    if (open <= 0) continue;
    const amount = Math.min(open, left);
    remaining.set(installment.id, open - amount);
    allocations.push({ paymentId: payment.id, installmentId: installment.id, amountCents: amount });
    left -= amount;
  }
}
```

The old allocations get deleted and the new ones get written in the same transaction. I like this approach because the hard cases stop being special. Two parents paying for the same kid works. A discount added after someone already paid works. Overpayments sit as credit until the family owes more.

Status works the same way. TeamDues works out whether an installment is `upcoming`, `due`, `overdue`, or `paid` from allocations and today's date in the team's time zone. No column holds it, so no column can be stale.

## Reminders Are A Sweep, Not A Schedule

My spec called for one background job per installment, sleeping until its reminder date. That falls apart the moment anything changes. A parent pays, a coach moves a due date, a family gets paused, and now there are jobs to find and cancel.

So reminders run as an hourly sweep on Inngest. Each run looks at teams outside quiet hours, which means 9am to 8pm local time. It works out from current data which stage each unpaid installment has reached:

```ts
export const REMINDER_OFFSETS = [
  { kind: "upcoming", offsetDays: -7 },
  { kind: "due", offsetDays: 0 },
  { kind: "overdue_1", offsetDays: 3 },
  { kind: "overdue_2", offsetDays: 10 },
  { kind: "overdue_3", offsetDays: 17 },
  { kind: "overdue_4", offsetDays: 24 },
];
```

That's a week before the due date, the day of, three days late, then weekly up to four overdue reminders. A paid family simply has nothing due on the next sweep. There is nothing to cancel.

Sending each stage once comes down to a unique row. Before sending, the sweep inserts into `reminder_sends`, keyed on installment, parent, and stage. If the insert conflicts, someone already sent it:

```ts
const claimed = await db
  .insert(reminderSends)
  .values(job.installmentIds.map((installmentId) => ({ installmentId, guardianId: job.guardianId, kind: job.kind })))
  .onConflictDoNothing()
  .returning({ installmentId: reminderSends.installmentId });
if (claimed.length === 0) return "skipped";
```

If delivery fails, the claim gets deleted so the next sweep can try again. Siblings due on the same day get combined into one message. If the sweep was down for a day, missed stages get skipped rather than sent as a backlog. Nobody wants three reminder emails at once.

## The Money Never Touches Me

I didn't want TeamDues holding a single dollar of anyone's team fees. Card payments go straight into the team's own Stripe account and pay out to the team's bank.

Each team gets one Stripe Accounts v2 account. Parents pay through Checkout, created on the team's account with the `Stripe-Account` header, so these are direct charges:

```ts
const session = await stripe().checkout.sessions.create(
  {
    mode: "payment",
    line_items: lineItems,
    customer_email: guardian.email ?? undefined,
    metadata,
    success_url: `${payUrl}?paid={CHECKOUT_SESSION_ID}`,
    cancel_url: payUrl,
  },
  { stripeAccount: team.stripeAccountId! },
);
```

My spec said Express accounts. Stripe now treats `type: express` as legacy, and Accounts v2 won't pair an Express dashboard with Stripe owning losses, which direct charges need. So teams get the full Stripe Dashboard, and Stripe carries the negative balance risk. That fits the product better anyway. Card fees belong to the team, and the team can pass them on to parents as a separate line item.

The webhook records payments idempotently, with `stripe_checkout_session_id` as a unique column. It also checks that the event's account matches the team before trusting it. Refunds and disputes happen in the team's Stripe dashboard and flow back through the same replay.

## Collecting Less

This product touches kids, so I set a hard rule early. TeamDues stores a player's first and last name and nothing else. No birth dates, no photos, no medical notes, no kids' contact info. Only adults enter data.

Texting got the same caution. Email is the default. The only text a parent can get before saying yes is the opt-in request itself. Replying YES, or ticking a box on the payment page, records when and how they agreed. STOP opts them out, and so does Twilio error 21610. Changing a parent's phone number resets consent, since the new number never agreed to anything.

Reminders and receipts go out in the team's name, like "Riverside Tigers U10," with the coach's address as reply-to. When a parent hits reply, they reach a person they know.

## Pricing

TeamDues costs $15 per team per month while the season runs, for the whole roster. The first month is free, and pilot teams are free this fall. That's the only plan.

I went per team instead of per player or per payment because of how teams actually buy. The season is the unit. A treasurer can sign up before the first practice and cancel after the last game, and the price never changes based on how many kids are on the roster.

## Where I Broke The Rules

I froze the stack at Astro, Neon, Stripe, and Netlify. TeamDues is Next.js again, plus Inngest for jobs, Twilio for texts, and Amazon SES for email. Next.js is a better fit for fast prototyping, and two weeks in I'm ready to admit the rule was wrong rather than keep breaking it quietly. Netlify, Neon, and Stripe held.

The rule that mattered most held too. TeamDues had a public URL and a checkout that takes a real card by the deadline. Last week I wrote that flipping the switch was the hard part. This week I flipped it.

Scope held better as well. TeamDues does fees and nothing else, with no scheduling, no team chat, and no league management. It came in around 9,750 lines of TypeScript, about half of Bragboard, with unit, database integration, and Playwright end to end tests running in CI. A tool that moves other people's money doesn't get to skip the tests.

## Putting It Together

TeamDues turns collecting team fees into a five-minute setup. Paste the roster, set the fee, and send the links, and reminders take it from there. The parts I trust most are the ones that can't drift. Balances get replayed from payments, reminders get worked out from current data every hour, and the money sits in the team's own Stripe account the whole time. I also shipped a real checkout this week, which was the whole point of the month. If you've ever been the parent stuck collecting team fees, tell me what I got wrong on [**Bluesky**](https://bsky.app/profile/joshfinnie.dev).

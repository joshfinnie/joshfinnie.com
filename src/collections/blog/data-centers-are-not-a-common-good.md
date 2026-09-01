---
title: "Data Centers Are Not a Common Good"
date: "2026-09-03"
tags:
  - "leftist"
  - "data-centers"
  - "infrastructure"
  - "climate"
  - "policy"
slug: "data-centers-are-not-a-common-good"
heroImage: "blog/data-centers-are-not-a-common-good"
unsplash: "İsmail Enes Ayhan"
unsplashURL: "ismailenesayhan"
description: "AI data centers sell themselves as shared infrastructure, but the power, water, and health costs land on the towns hosting them. A look at the buildout through Hardin's commons model and Ostrom's rules for fixing it."
draft: false
leftistOnly: true
---

A prompt feels like nothing. We type, tokens come back, and the whole exchange has the heft of a text message sent across the room. Somewhere in Loudoun County or west of Phoenix, a concrete box the footprint of four Walmarts is pulling down enough electricity to run a mid-sized city so that exchange can keep feeling like nothing.

## The cloud is a building

The word "cloud" did a lot of quiet work. It told two generations of users that computing happens in the air, that storage is a plane you push things onto, that the only real constraint is your monthly bill. We are engineers and we know better in the abstract, yet most of us have never stood in front of the thing. Rows of transformers. Diesel generators on pads out back for when the grid stumbles. Cooling towers venting a plume you can see from the highway. A substation sized for a single customer.

Here is what makes the illusion stick. Every other resource we treat as a common good comes with visible friction. Water has a meter. Roads have traffic. A public park gets crowded on a Saturday and you feel it. Compute has none of that. The interface returns in eight hundred milliseconds whether the grid behind it is comfortable or on the edge of a load-shedding event, so the signal that would normally tell us we are taking too much never arrives.

That gap is not an accident of design, and it is where my argument starts. The companies building this generation of data centers are treating local utility infrastructure the way a herder treats an unfenced pasture. The compute gets sold at a margin. The depletion gets billed to whoever happens to live nearby.

## What a commons actually is

Garrett Hardin published "The Tragedy of the Commons" in 1968, and the version most people remember is a vibe rather than a model. The model is narrow and it matters here. A commons in Hardin's sense is a resource that is non-excludable, meaning you cannot practically keep anyone out, and rivalrous, meaning what one party consumes nobody else gets. Air was his canonical sink. A shared grazing field was his canonical stock.

The failure is not greed. Each herder acts rationally. Adding one more animal delivers the full value of that animal to the herder and spreads the cost of the extra grazing across everyone. Do that arithmetic enough times, in parallel, with no rule limiting anyone, and the pasture goes to dirt while every individual decision along the way looked defensible on its own spreadsheet.

Hardin's own conclusion was authoritarian and his politics were ugly, which is worth saying plainly rather than citing him clean. The mechanism still describes what is happening. The fix is the part he got wrong, and Elinor Ostrom spent a career proving it.

## The data centers are the cattle

Map the model onto a county. The regional grid and the local aquifer are non-excludable in every practical sense. A utility under an obligation to serve cannot turn away a customer who shows up with a signed interconnection request and a load profile. Both resources are rivalrous in the way that counts: generation capacity consumed at 4pm on an August afternoon is capacity nobody else has, and groundwater drawn from a stressed basin does not come back on a schedule that helps anyone.

The data centers are the cattle. Each one is a rational addition from the operator's side. The revenue from a hyperscale campus flows to a company headquartered two thousand miles away, while the cost of the new transmission line, the peaker plant that fires up to cover the load, and the higher residential rate that pays for both gets spread across every ratepayer on that system. Profits privatize cleanly. Depletion socializes just as cleanly.

The pitch always uses the language of shared benefit. Digital infrastructure. Investment in the community. A partnership. What the county signs is closer to a grant of open pasture, with a tax abatement stapled to it.

## People already see the bill coming

The polling is more interesting than either side's talking points. [Third Way's 2026 memo](https://www.thirdway.org/memo/do-americans-believe-banning-data-centers-will-lower-electricity-prices), based on a national survey of a thousand registered voters, found the country split almost evenly: 43 percent will accept data center construction if clear rules make operators reimburse communities for the water and electricity they consume, and 41 percent oppose it outright over pollution, cost, and what it does to a place.

Read that again, because the split is not really a split. Both halves are describing the same complaint. Nobody in that survey believes the resource use is free. The larger group is willing to trade access to the pasture for enforceable compensation, and the smaller group has already concluded the compensation will never show up. A blanket national moratorium polls badly, so the demand is not "stop building." The demand is "pay the meter."

Meanwhile the jobs math keeps failing in public. A campus that consumes the power of a small city runs on a few dozen permanent technicians once the construction crews leave. The construction jobs are real and they are temporary. The load is permanent.

## Swallowing the power grid

The IEA's projections are the clearest number in the whole argument. Global data center electricity consumption is on track to pass [1,000 TWh](https://www.iea.org/reports/electricity-2026/demand), roughly double the 460 TWh figure from 2022. The domestic version is starker: data centers will account for about half of all United States electricity demand growth through 2030, out of more than 420 TWh of new demand in total.

Half. Not half of the growth in commercial load, or half of some subcategory. Half of everything new the country is adding, going to one class of customer that did not exist at this scale five years ago.

Growth of that shape does not get absorbed by an existing grid. It gets met by keeping coal plants online past their retirement dates, by building gas peakers, and by running fossil generation harder in exactly the hours it pollutes most. Modeling covered by the [Environmental Health Project](https://www.environmentalhealthproject.org/post/the-dangers-of-data-centers) and Physicians for Social Responsibility puts the resulting burden at roughly 600,000 asthma cases and 1,300 premature deaths per year by 2030, a public health cost above $20 billion annually, up from an estimated $6 billion in 2023.

That $20 billion is the purest expression of the mechanism. It appears on no operator's balance sheet, in no colocation contract, in no per-token price. It lands on lungs downwind of the generation, which seldom belong to anyone working in tech.

## The hidden water crisis

Most reporting on data center water focuses on what the building itself drinks through its cooling loop, and that framing lets operators publish an impressive-looking number about on-site efficiency while the real drain sits somewhere else entirely.

Ceres put the number on it in August 2026. Their report [Water Behind the Watts](https://www.ceres.org/resources/reports/drained-by-data-the-cumulative-impact-of-data-centers-on-regional-water-stress) traces the freshwater consumed by the power plants generating the electricity data centers use, and across seven states holding about half the country's capacity, that indirect draw comes to 3.4 trillion gallons. Twelve times the combined annual water use of Los Angeles, Phoenix, and Washington DC. In those states, 78 percent of the electricity comes from water-dependent thermal plants, and two-thirds of the generation sits in basins already rated at medium-high or extreme water stress. By 2030 the indirect figure could reach 7.6 trillion gallons.

Direct use hurts differently, and the damage is about timing rather than annual totals. Researchers at UC Riverside and Caltech made the point in a study of peak demand on public water systems: cooling load spikes on the hottest days, which is precisely when the municipal system is already at its limit and residential demand peaks too. Their projection is that data center cooling could require between 697 million and 1.45 billion gallons of additional peak capacity per day within four years, comparable to the entire daily water supply of New York City. A water authority does not size its plants for the average. It sizes for the worst day, and someone pays for that headroom.

## Fencing the pasture

Hardin's answer was coercion from above. Ostrom won a Nobel for showing that communities manage shared resources successfully all the time, without privatization and without a central authority, when they can define the boundary, write the rules, and enforce them locally. That is the frame worth using here, and the pieces of it are already in motion.

### Local resistance got procedural

Local resistance has stopped being a matter of a few angry people at a zoning meeting. Groups like the [Commons Social Change Library](https://commonslibrary.org/) publish campaign toolkits that give a community the specific procedural levers: how to intervene in a rezoning application, how to demand a water impact study before approval, how to file at the public utility commission when a rate case tries to socialize the interconnection cost.

Those tools work because the decisions are genuinely local. Rezoning is local. Water allocation is local. Elected officials vote on the tax abatement that makes the project pencil out, and their names sit on a ballot in a low-turnout election. Those are real pressure points, and communities have started pressing them.

### Innovation only arrives under pressure

Nvidia's move to closed-loop liquid cooling in its GB300 racks, where the coolant recirculates and the heat rejects without evaporating municipal water, is genuinely better engineering. So are the underwater and heat-reuse experiments. I want to be careful about how much credit that earns, though, because none of it happened as a matter of principle.

Closed-loop cooling showed up on roadmaps after moratoriums, after lawsuits, after Arizona and Georgia towns started denying permits over water. Regulation produced the innovation. Anyone arguing that we should trust the industry to solve this voluntarily is arguing against the evidence of how the solutions we do have came to exist. And a closed loop still does not touch the indirect draw upstream. It moves the water out of the building and leaves it in the power plant.

### Ostrom's rules, written into zoning

The version I actually want is unglamorous: a local pact with teeth, negotiated before the county grants the permit rather than after the crew pours the slab.

Make the developer pay the full cost of grid upgrades their load requires, not a socialized share of it. Require metered public reporting of power and water draw, peak and average both, as a condition of the certificate of occupancy. Fund localized water reclamation from a per-megawatt fee. Put a clawback in the abatement tied to the permanent jobs number the company put in its own application. None of that is anti-development. It is Ostrom's boundary and monitoring conditions in the only legal instrument a county actually controls, which is the one that says what you may build and on what terms.

## Re-weighting the cloud

The thing that makes this hard is not economic and it is not technical. It is that the interface hides the invoice. A prompt returns in under a second, a backup finishes overnight, and nothing in that experience carries information about the megawatt-hour or the gallons that made it possible.

```bash
# What the call tells us
curl -s https://api.example.com/v1/messages \
  -d '{"model":"...","messages":[...]}' \
  | jq '.usage'
# { "input_tokens": 812, "output_tokens": 1041 }

# What it does not tell us: watt-hours drawn, the fuel mix
# that generated them, the liters evaporated cooling the rack,
# or the county paying for the substation.
```

Every one of those numbers exists. Someone measures them, and they are simply not exposed to the person triggering the work, which is the same structural blindness that let the pasture go to dirt while every herder's ledger balanced. Digital space is not resource-free. It is a set of buildings in specific counties, drawing on specific aquifers and specific transmission lines, and the people who live nearest to it are currently paying for the part of the bill we do not see. Are you seeing this fight play out in your own county? I would like to hear how it is going, so find me on [**Bluesky**](https://bsky.app/profile/joshfinnie.dev).

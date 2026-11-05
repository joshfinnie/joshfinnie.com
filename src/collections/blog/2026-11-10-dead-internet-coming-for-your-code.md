---
title: "The Dead Internet Is Coming for Your Code"
date: "2026-11-10"
tags:
  - "ai"
  - "open-source"
  - "opinion"
heroImage: "blog/dead-internet"
unsplash: "Mathew MacQuarrie"
unsplashURL: "matmacq"
slug: "dead-internet-coming-for-your-code"
description: "Coding models learn from public GitHub, and public GitHub is filling with untested, error-swallowing hello world apps, many written by other models. Why code quality is heading for model collapse."
draft: false
---

In my [last post](/blog/tailwind-stack-overflow-docs-snowball) I argued that LLMs are drying up the human docs they learned from. That was the polite version of the problem. The worse version is what the models will learn from instead, and it's already sitting on GitHub.

## The Dead Internet, Now for Code

Dead internet theory started as a fringe idea: most of what you read online is bots writing for other bots, with fewer real people behind it every year. For a long time it sounded paranoid. Then social feeds filled up with generated posts replying to generated posts, and it started to sound less like a theory and more like a description.

Code is next. Public repos are the training set for every coding model, and more and more of those repos come out of a model, get pushed by someone who never read them, and sit there forever. The next model trains on that and writes more of it.

## What the Models Learned From

Today's coding models are good because they learned from about fifteen years of humans writing code in public. Not all of it was great, but a lot of it had been through some kind of review, with issues filed against it, pull requests that got rejected, and maintainers who were willing to say no. Stack Overflow answers got voted down when they were wrong. Docs got fixed when people complained loudly enough.

That friction worked as a filter. Bad code still existed, but good code carried more weight, because it got copied, starred, forked, and linked far more often than the bad stuff did. The models picked up those signals right along with the code.

## Hello World, Forever

Now look at what people add today. GitHub is full of hello world apps: weekend projects, tutorial follow-alongs, and "I built a SaaS in an afternoon" demos. Most of them have no tests and ignore errors, and nobody will ever open an issue on them because nobody uses them.

The typical one looks like this:

```js
app.get("/users/:id", async (req, res) => {
  const user = await db.query(`SELECT * FROM users WHERE id = ${req.params.id}`);
  res.json(user);
});
```

There's no error handling, so if the query throws, the request hangs or the process crashes. The query string pastes user input straight into the SQL. There's no test, and there never will be. It worked on the author's laptop for the one demo they recorded, which is all it was ever meant to do.

One of these repos is harmless. Millions of them are a training set. To a model, code that shows up often looks like the right way to do things, and it has no way to tell which repos were real software and which were somebody's Saturday afternoon, so a swallowed error repeated across ten thousand repos reads as the normal way to write a route handler.

And more of these repos come from models every day. A model writes the hello world app, someone pushes it without reading it, and the next model trains on it and writes the same app with the same holes, only now with more examples backing it up.

## Stuck on Last Year's Packages

You can already see a milder form of this in package versions. A model only knows the packages it saw during training, and getting Claude to reach for the latest version of a library is a fight I have all the time.

Express is a good example. Express 5 shipped in late 2024 and became the default on npm in 2025, yet ask a model to scaffold a server and you'll still often get this:

```json
{
  "dependencies": {
    "express": "^4.18.2"
  }
}
```

The reason is simple. Express 4 was the default for about a decade, and Express 4 tutorials still fill the internet, while Express 5 has a fraction of that. Tools that feed current docs into the model help, but they're patches on top of the training, and they don't change what the model believes is normal.

Now combine that with the hello world problem. Every generated repo pins the old version, those repos become training data, and the old version picks up even more examples, so the model gets more confident about the wrong default instead of less.

## Model Collapse Is Already Measured

The research has a name for this. In 2024, Shumailov and colleagues published a paper in Nature called "AI models collapse when trained on recursively generated data," where they trained models on the output of earlier models, over and over. The rare cases disappeared first. Then the output drifted toward a bland, wrong average, and in one test, text that started out about medieval architecture had turned into a list of jackrabbits by the ninth generation.

To be fair, the paper is about training on generated data without filtering it, not about every production model. But "without filtering" is a pretty good description of scraping GitHub.

The effect is already showing up in real codebases. GitClear's 2025 report looked at 211 million changed lines of code from 2020 through 2024 and found that in 2024, for the first time, copy-pasted lines outnumbered moved lines. Moved lines are how GitClear tracks refactoring, and that number fell sharply. The report can't prove an AI wrote any given duplicated block, but it does show the shape of the change: more pasting and less cleanup, during exactly the years AI assistants took over.

In code, the rare cases are the good ones. They're the careful error handling, the test that covers the weird edge, and the clean abstraction someone spent a week getting right, and they're the first things a collapsing model forgets.

## Nothing Is Coming to Fix It

I'd like to end this section with the fix. I don't think there is one.

Filtering training data sounds good until you try it at the scale of GitHub. You can filter by stars, but stars are cheap and getting cheaper. You can filter by date and train only on code from before the flood, but then the model never learns anything new, which is the frozen snapshot from my last post. You can pay humans to write clean training code, but that's a rounding error next to what the models take in.

The incentives point the wrong way too. Every lab wants more data, more data means more of GitHub, and more of GitHub means more hello world. Nobody wins a benchmark by training on less.

The humans who could push back are leaving. Fewer people write docs, answer questions, or review open source pull requests, and the ones who still do tend to be senior engineers, the same people LLMs make faster, who don't need to publish anything to keep learning. The next generation learns from the model instead. So the model is now teaching the people who would have corrected it.

## Putting It Together

Coding models learned from fifteen years of humans reviewing each other's work in public. That review is fading, and the gap is filling up with untested, error-swallowing hello world apps, more of them written by models every day. Models trained on that code will treat its shortcuts as normal, pin last year's packages, and forget the rare, careful code first. The research calls it model collapse, and GitClear's numbers suggest it's already happening. I don't see a fix coming, because the labs want more data and the people who would push back are walking away. The internet for code is dying, and we're the ones writing it. If you think I'm wrong and see a way out, I'd honestly like to hear it on [**Bluesky**](https://bsky.app/profile/joshfinnie.dev).

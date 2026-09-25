---
title: "AI Made Me a Polyglot Again"
date: "2026-09-25"
tags:
  - "ai"
  - "programming"
  - "career"
slug: "ai-made-me-a-polyglot-again"
heroImage: "blog/ai-made-me-a-polyglot-again"
unsplash: "Simon Kadula"
unsplashURL: "simonkadula"
description: "How working as the architect to an AI coder removed the syntax tax on unfamiliar languages, and what still has to come from me."
---

For most of my career I wrote Python because I wrote Python. That is not a good reason, but it was an honest one. The language I knew best was the language that let me ship, so the language I knew best kept winning, and every year the gap between it and everything else got wider.

That loop broke about a year ago. I now start projects in Go, Rust, and Elixir without much ceremony, and the reason has nothing to do with me suddenly getting smarter. The work I do changed shape.

## The Old Cost of Learning a New Language

Picking up a new language was never really about syntax. Syntax is a weekend. The cost was everything around it.

You had to learn which build tool the community actually uses versus the one the docs mention. You had to learn the idioms well enough that a reviewer would not flinch. You had to learn the standard library deeply enough to stop reaching for a dependency every time you needed to trim a string. And you had to learn the error messages, which is its own dialect entirely.

Multiply that by a few weeks of feeling slow, and the calculus was obvious. If I could finish the job in Python in two days, or finish it in Go in three weeks while learning Go, I wrote Python. Every time. The right tool lost to the familiar tool on schedule pressure alone, and I made that trade so often I stopped noticing I was making it.

## Architect, Not Typist

What shifted is where my time goes. I do not sit and produce syntax anymore. I decide what the thing is.

A typical session now starts with me writing down the shape of the system before a single line exists. What are the boundaries. What owns the data. Where does the concurrency live. What happens when the third-party call times out. What does the failure mode look like at 3am. I hand that over, the model produces code, and I read it the way I would read a pull request from a competent contractor who has never met my users.

Here is what that looks like concretely. I wanted a small worker that pulls jobs off a queue, does bounded parallel work, and shuts down cleanly. I do not write Go daily. But I know exactly what I want:

```go
func (w *Worker) Run(ctx context.Context) error {
	sem := make(chan struct{}, w.maxInFlight)
	g, ctx := errgroup.WithContext(ctx)

	for {
		job, err := w.queue.Next(ctx)
		if errors.Is(err, context.Canceled) {
			return g.Wait()
		}
		if err != nil {
			return err
		}

		sem <- struct{}{}
		g.Go(func() error {
			defer func() { <-sem }()
			return w.handle(ctx, job)
		})
	}
}
```

I did not need to remember that `errgroup` exists or how its context cancellation propagates. I needed to know that I wanted bounded concurrency, a shared cancellation signal, and a clean drain on shutdown. Those are design decisions. The model turned them into idiomatic Go faster than I could have looked up the package.

The role feels closer to tech lead than to author. I review, I push back, I ask why a function got three return values, I reject the version that swallows an error. The judgment is still mine. The keystrokes are not.

## Picking the Right Framework Instead of the Familiar One

This part genuinely delights me. With the syntax tax gone, the question "what is the best tool for this job" finally gets an honest answer.

I had a project that needed to hold tens of thousands of long-lived websocket connections with per-connection state. In Python I would have built it, and it would have worked, and I would have spent the next six months fighting the event loop. Phoenix Channels does that out of the box because the BEAM was built for exactly this. So I built it in Elixir. I had written maybe forty lines of Elixir in my life.

```elixir
defmodule PresenceChannel do
  use Phoenix.Channel

  def join("room:" <> room_id, _params, socket) do
    send(self(), :after_join)
    {:ok, assign(socket, :room_id, room_id)}
  end

  def handle_info(:after_join, socket) do
    {:ok, _} = Presence.track(socket, socket.assigns.user_id, %{
      online_at: System.system_time(:second)
    })

    push(socket, "presence_state", Presence.list(socket))
    {:noreply, socket}
  end
end
```

The pattern match on `"room:" <> room_id` is not something I would have reached for unprompted. I would have written a regex like a Python developer visiting a foreign country. Seeing the idiomatic version is how I learned it, and now I use it deliberately.

Same story with Rust for a CLI that had to parse a few gigabytes of logs. I was not going to learn the borrow checker for a one-off tool. Now I get to use the language whose entire reason for existing is that job, and the compiler catches the mistakes my unfamiliarity would otherwise introduce. Strict languages got better for me, not worse, because the feedback loop that used to punish a newcomer now runs against generated code before I ever read it.

## What Actually Transfers

None of this works if you are starting from zero. The reason I can review Go I do not write daily is that fifteen years of writing other things taught me what to look for.

Concurrency models transfer. If you understand that Go's goroutines and Elixir's processes and Python's async tasks are three different answers to the same question, you can evaluate whether the generated code picked a sane one. Error handling transfers. A language can spell it `Result`, `error`, or an exception, and the question stays the same: what happens when this fails, and does the caller have enough information to do something about it. Type systems transfer. Data modeling transfers hardest of all, and it is where I spend most of my review attention, because a bad schema survives every rewrite.

Test design transfers too. I cannot always tell you whether a `table_test` in Go is stylistically perfect, but I can absolutely tell you the test suite never exercises the timeout path, and that is the bug.

What does not transfer is trivia, and trivia is precisely what I used to spend three weeks acquiring.

## The Rules I Make It Work Under

Reviewing code is only useful if you know what you are holding it to. So I stopped re-explaining my taste every session and wrote it down. My `AGENT.md` carries a handful of standing rules, and three of them are doing most of the work.

```md
- When making technical decisions, do not give much weight to development cost.
  Instead, prefer quality, simplicity, robustness, scalability, and long term maintainability.
- Apply that same high standard to engineering excellence: lint, test failures, and test flakiness.
  If you see one, even if it is not caused by what you are working on right now, still get it fixed.
- Do NOT add arbitrary or redundant comments to code. But ensure all functions have proper doc strings
  per the language's best practices.
```

The first one matters more than it looks. Left alone, a model optimizes for the shortest path to something that runs. That is the same instinct that made me write Python out of habit for a decade, just faster. Telling it up front that I do not care how long the good version takes changes what comes back: fewer clever one-liners, fewer silent `unwrap` calls, more boring code I can still read in a year. In a language I do not write daily, I cannot always feel that a shortcut is a shortcut. Naming the standard in advance means I do not have to.

The second rule is how I buy confidence I have not personally earned. My fluency in Go is shallow, but `go vet` is not shallow, and neither is the race detector. When I say fix every lint warning and every flaky test even if you did not cause it, I am pointing the toolchain at the gaps in my own knowledge. A clean build in a language I half know is worth more to me than a clean build in Python, because in Python I would have caught most of it myself.

The third rule changes how I read. Comments that restate the code are noise in any language, but docstrings are how I find my way around an unfamiliar one. A Go doc comment tells me what a function promises before I work out what it does:

```go
// Drain stops accepting new jobs and waits for in-flight work to finish.
// It returns once every handler has returned or ctx expires, whichever
// comes first. Drain is safe to call multiple times.
func (w *Worker) Drain(ctx context.Context) error {
```

Three lines, and I know the contract, the cancellation behavior, and the idempotency guarantee without reading the body. When I review a package of twenty functions in a language I am shaky in, those headers are the difference between reading the code and skimming it.

I do the same thing on the design side with [Impeccable](https://impeccable.style/), which keeps my visual rules in a `DESIGN.md` and checks the actual code against them instead of against vibes. I wrote up [what it found when I pointed it at this blog](/blog/what-impeccable-found-on-my-blog/), including a shadow rule three separate components were quietly breaking. Same shape as the `AGENT.md` rules: state the standard once, in a file, and let it hold every future change to it.

None of this makes the generated code correct. It makes it legible and consistent, which is what I need to judge whether it is correct. Review stops being "do I like this" and becomes "does this meet the thing I already decided," and that second question I can answer in a language I do not speak fluently.

## Where This Breaks Down

I want to be honest about the cost, because there is one.

Reading code in a language you do not write fluently is slower than reading code you do, and slower reading means you skim. Skimming a diff is how bad code gets merged. I have caught myself approving Rust that compiled and passed tests without really understanding the lifetime annotations, and "it compiled" is not review. When I notice that happening, I stop and go read the actual documentation for the thing I glossed over. That takes time I told myself I was saving.

Debugging is worse. When something fails in production in a runtime I only half know, I do not have the instincts. I do not know what a BEAM scheduler under load looks like when it is unhappy. I do not know Go's pprof output the way I know a Python traceback. The model can help, but debugging is where you most need your own mental model of the system, and a shallow one shows.

There is also idiom drift. Generated code is idiomatic in the small and inconsistent in the large. One module handles errors one way, another module handles them a different way, and because both look fine in isolation I do not catch it until the codebase feels like four people wrote it. The fix is the same fix it has always been: write the conventions down, and hold the generated code to them the way you would hold a new hire to them.

My rule now is that I will only run something in production in a language where I can debug it at 3am without help. Prototypes and tools get no such restriction. That line has moved as I have gotten more comfortable, and it will keep moving, but I keep it drawn somewhere.

## Putting It Together

The bottleneck in my work was never ideas about systems. It was the hours between having the idea and having it running, and most of those hours went to trivia I would forget by the next project. Removing that lets me choose the runtime that actually fits the problem, which is a better outcome than anything I would have written in Python out of habit.

The judgment did not get cheaper. If anything it got more valuable, because now it is the only part I supply. Knowing what to build, what the failure modes are, and what a good abstraction looks like is the whole job, and none of that came from a model. It came from years of writing code by hand in languages I knew cold. I would not trade that foundation for a faster start.

If you have made the same shift, or decided against it, start a conversation on [**Bluesky**](https://bsky.app/profile/joshfinnie.dev).

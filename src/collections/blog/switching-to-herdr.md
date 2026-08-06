---
title: "I Gave Up tmux and Zellij for Herdr"
date: "2026-08-06"
tags:
  - "terminal"
  - "tmux"
  - "zellij"
  - "dotfiles"
  - "ai"
slug: "switching-to-herdr"
heroImage: "blog/switching-to-herdr"
unsplash: "Andrea Lightfoot"
unsplashURL: "andreaelphotography"
description: "After years of tmux and a recent stretch running Zellij, I replaced both with Herdr, a background runtime built around keeping AI coding agents alive across reboots. Here is why I switched and how I configured it."
draft: false
---

I have used tmux for most of my career and switched to Zellij more recently for its saner defaults and built-in plugins. Three days ago I dropped both for [Herdr](https://herdr.dev/). Not as an experiment I am running alongside the old setup, a full replacement. Here is why, and how I have it configured.

## What tmux and zellij never solved

Both tmux and Zellij are multiplexers first. They give you panes, tabs, and sessions you can detach from and reattach to, and they do that well. What neither one does is know anything about what is running inside those panes. I spend most of my day now with two or three AI coding agents going in different panes across different projects, and tmux has no idea whether Claude Code in pane three is still working, waiting on me, or has been sitting idle for twenty minutes. I had to keep switching over just to check.

The other gap showed up whenever my laptop restarted or lost network for a minute. tmux sessions survive a lot, but they do not survive the machine going down, and neither does Zellij. An agent mid-task in a detached pane just dies with the session.

## What Herdr actually is

Herdr is not another terminal multiplexer competing on keybindings. It runs as a background server, and your terminal sessions live inside that server rather than inside whatever terminal window happens to be open. Close the window, restart the machine, lose your network for a bit, and the sessions are still there when you reconnect, agents included. It works with whatever agent CLI you already run. Claude Code, Codex, Cursor, opencode, Grok, and a long list of others, all without modification, because Herdr just manages the terminal underneath them rather than replacing them.

The part that actually changed my workflow is agent status tracking. Herdr watches each pane and knows whether the agent inside it is working, blocked waiting on you, or idle, and surfaces that in a sidebar. I no longer tab through six panes to find the one that needs me. I glance at the sidebar.

The bigger win sits on top of that: a notification the moment an agent stops to wait on me. Claude finishes a task or hits a question it needs me to answer, and Herdr fires a ping instead of leaving me to notice on my own next time I happen to check that pane. I used to lose ten or fifteen minutes at a stretch because an agent had been sitting idle, blocked on a question I never saw. That does not happen anymore.

## Setting it up

The install is one shell command, and the defaults are close to what I wanted, but I changed a few things in `~/.config/herdr/config.toml`, tracked in my dotfiles alongside the rest of my shell setup. I turned off the first run onboarding flow since I had already read the docs. I switched the theme to `rose-pine`, matching the rest of my terminal setup instead of Herdr's default.

The keybinding change mattered more than it sounds. Herdr's prefix key defaults to `ctrl+b`, tmux's classic default, but my Zellij config already remapped `Ctrl-a` to drop into a tmux-compatible mode, a habit left over from years of screen and tmux before that. I set Herdr's prefix to `ctrl+a` to match, so the muscle memory I built up over a decade did not need to change again on top of everything else that did.

```toml
[keys]
prefix = "ctrl+a"

[theme]
name = "rose-pine"

onboarding = false
```

I also turned off `pane_history` under the experimental section. Herdr can save recent pane screen output across full server restarts, but I restart my server rarely enough that I would rather keep the resource footprint smaller than keep that history around.

## Running agents through it day to day

In practice this looks almost the same as before. I open a pane, run `claude` or `codex` the way I always did, and work. The difference shows up when I walk away. I can close my laptop mid-task, and when I reopen it and reattach, the agent is either still working or waiting for me exactly where I left it, instead of dead in a session tmux quietly dropped.

Herdr also ships a CLI and a socket API that agents can use to coordinate with each other and with the runtime itself, which is how the status tracking works under the hood. I installed the Claude Code integration hook that reports session state back to Herdr over that socket, so the sidebar reflects what Claude is actually doing rather than guessing from terminal output.

## Plugins and getting back in from anywhere

Herdr has a [plugin marketplace](https://herdr.dev/plugins/) with more than 500 community plugins across 500-plus repositories, all indexed automatically from GitHub. Tag a repo `herdr-plugin`, add a `herdr-plugin.toml` manifest, and the marketplace picks it up on the next refresh. Nobody reviews the listings, so I treat it the way I treat any open registry and check a plugin before I install one, but the size of it says people are actually building on this rather than just using the core app.

One plugin I would call a must install: [herdr-plus](https://github.com/cloudmanic/herdr-plus). It adds Projects, a fuzzy picker that builds an entire workspace, every tab, pane, and startup command, from a single TOML file, and opens it as a normal workspace or as a git worktree in one keystroke. It adds Quick Actions on top of that, a fuzzy launcher for the one-off scripts I run constantly from whatever directory I am already in. `herdr plugin install cloudmanic/herdr-plus` and I stopped hand-building the same three-pane layout every time I opened a new project.

Another one worth calling out is [herdr-spreader](https://github.com/yuk1ty/herdr-spreader), because it is the closest thing to a direct migration path from tmuxp, which I leaned on heavily back when tmux was still my daily driver. Same idea, a declarative layout file that spins up tabs, panes, and startup commands in one shot, just YAML instead of tmuxp's Python config, with nested pane splits, per-pane working directories and environment variables, and a `wait_for` option that holds a pane until a command's output matches a pattern before moving on. `herdr plugin install yuk1ty/herdr-spreader` and `herdr-spreader apply` got me back to the exact workflow tmuxp gave me, on top of a runtime that actually survives a reboot.

Then there is [herdr-reviewr](https://github.com/persiyanov/herdr-reviewr), a review pane that sits beside your agent, shows its diff syntax-highlighted, and lets you drop line comments and send them straight back with one keystroke. It is a genuinely solid plugin, and if I had never built my own tool for this I would install it without hesitation. I did build my own tool for this. I call it [diffai](/projects/diffai/), it does the same job, and it has been living in my second pane since before herdr-reviewr existed. I am contractually obligated by my own ego to mention that.

The other piece I lean on is `herdr --remote`. Herdr can manage the SSH config it uses to reach a remote machine, layering in keepalive settings and a shared connection so a flaky network does not drop the session, and reusing the same authenticated connection instead of renegotiating SSH every time. In practice that means I can start something on my desktop, walk over to my laptop, run `herdr --remote`, and land in the exact same panes and agents rather than SSHing in and starting a new tmux session from scratch.

## Before you switch

Herdr is Apache 2.0 licensed and has a real community behind it, but it is still a young project compared to fifteen-plus years of tmux. Windows support is in beta. It phones home in the background by default to check for new versions and updated agent-detection manifests, both of which you can turn off in the config if that bothers you. And you are trusting a third piece of software to sit between you and every terminal session you run, which is a bigger ask than a multiplexer that just splits panes.

For me the tradeoff was worth it the moment an agent survived a laptop restart for the first time. Developers built tmux and Zellij for humans keeping track of panes. Herdr targets a world where some of what runs in those panes is not waiting on you to look at it, and that is closer to how I actually work now. Have you switched to Herdr yet, or are you still holding onto tmux or Zellij? Let's chat on [**Bluesky**](https://bsky.app/profile/joshfinnie.dev).

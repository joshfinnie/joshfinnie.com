---
title: "Superpowers Fixes Discipline, GSD Fixes Context"
date: "2026-11-16"
tags:
  - "ai"
  - "claude-code"
  - "tooling"
  - "best-practices"
heroImage: "blog/superpowers-gsd"
unsplash: "Enchanted Tools"
unsplashURL: "enchantedtools"
slug: "superpowers-fixes-discipline-gsd-fixes-context"
description: "Superpowers and GSD Core both make coding agents more reliable, but they attack different failures. Here is where they overlap, where they split, and how to wire Superpowers skills into GSD subagents with agent_skills."
draft: false
---

Most posts about Superpowers and GSD treat them as rivals and ask you to pick one. I run Superpowers every day and only recently started layering GSD on top, and the more I read of both codebases, the less the "versus" framing holds up. They fix two different ways a coding agent falls apart, and GSD ships a config option that lets them work together.

## What Superpowers Does

[Superpowers](https://github.com/obra/superpowers) is Jesse Vincent's skills library, now maintained by his company Prime Radiant. It's a set of fifteen skills plus a SessionStart hook that injects a bootstrap skill, `using-superpowers`, into every session. That bootstrap is blunt about what it wants:

```md
If you think there is even a 1% chance a skill might apply to what you are
doing, you ABSOLUTELY MUST invoke the skill.
```

It follows that up with a table of the excuses agents use to skip process ("This is just a simple question," "The skill is overkill") and a rebuttal for each one. The skills themselves encode an engineering practice: `brainstorming` draws out what you want before anything gets built, `writing-plans` turns the design into small tasks, `subagent-driven-development` hands each task to a fresh subagent with a spec review and a code quality review after it, and `test-driven-development` enforces red, green, refactor hard enough that it deletes code written before its test.

That's why I keep it on. The failure I hit most with a bare agent was never a lack of intelligence; it was the agent jumping straight to code, skipping the test, and telling me it had finished when it hadn't. Superpowers turns those shortcuts into things the agent has to argue its way past. On most days, it loses.

The project also measures itself in a way I wish more prompt libraries did. The v7.0.1 release notes report that brainstorming skipped the design doc without asking in 24 of 24 test runs before a fix and 3 of 24 after it.

## What GSD Does

[GSD Core](https://github.com/open-gsd/gsd-core) is a spec-driven development system built around one problem: context rot. As a session fills its window, the model starts contradicting decisions it agreed to an hour ago, and nothing announces the decline. GSD's answer is to keep your main session as a thin orchestrator that never touches source files and push every heavy step into a subagent with a clean context.

Work moves through a phase loop of discuss, plan, execute, verify, and ship. You drive it with explicit slash commands, starting from `/gsd-new-project` or `/gsd-onboard`, and every step writes its output to a `.planning/` directory: `CONTEXT.md` for the decisions you made, `RESEARCH.md` and `PLAN.md` from the planning agents, `VERIFICATION.md` from the verifier, and `STATE.md` tracking where the whole project stands. Execution runs plans in parallel waves, and each executor starts with a fresh 200k token window loaded with only its plan.

One housekeeping note: install GSD Core, not the original `get-shit-done` repo. The original repo [went read-only in June 2026](https://github.com/open-gsd/gsd-core/discussions/109) after its maintainer went silent, and GSD Core is the community fork that carries the project forward.

## Where They Overlap

Read both sets of docs back to back and the shared skeleton is hard to miss. Both refuse to let the agent write code before there's a written spec, whether that's a Superpowers design doc or a GSD `CONTEXT.md`. Both break the spec into a plan of small, checkable tasks. Both hand each task to a fresh subagent instead of grinding through everything in one long context, and both put a review gate between "the code exists" and "ship it."

The overlap goes deeper than design. GSD Core's own repository has a `docs/superpowers/specs/` directory, and the design doc for its `/gsd-next` command came out of a Superpowers brainstorming session. The people building GSD use Superpowers to do it.

## Where They Split

The split comes down to where the discipline lives. Superpowers changes how the agent behaves inside your conversation, while GSD moves the work out of your conversation and onto disk.

| | Superpowers | GSD Core |
|---|---|---|
| Failure it targets | The agent skipping process | Quality decay as context fills |
| How it starts | Skills trigger on their own | You run `/gsd-*` commands |
| Where state lives | Conversation, design doc, plan file | `.planning/` on disk |
| Size | 15 skills | 72 commands, 36 agents |
| Opinionated about | Engineering practice: TDD, worktrees, YAGNI | Project management: milestones, phases, requirement IDs |
| Install | Claude Code plugin | `npx` installer that writes into `.claude/` |

Neither one is free. Superpowers' main session still accumulates everything you discuss with it, so a marathon session eventually drags. GSD is honest in its own docs that "the phase loop introduces real friction," and with 72 commands there's a learning curve just to know which one you need. Superpowers asks almost nothing of you up front, while GSD asks you to adopt its loop or fight it.

## Superpowering Superpowers With GSD

The obvious way to combine them is to let GSD own the project and let Superpowers enforce the engineering practice inside it. That doesn't happen on its own, and the reason is worth understanding before you install anything.

GSD's executors are subagents, and GSD's docs state that subagents "do not inherit orchestrator context." Superpowers makes the same call from its side: the bootstrap opens with a `<SUBAGENT-STOP>` block telling any dispatched subagent to ignore it. Put the two together and a GSD executor writing your code never hears about Superpowers' TDD skill at all, while your main session gets a bootstrap pushing it to brainstorm and plan in exactly the places GSD wants to discuss and plan.

So there are two seams to handle: the main session, where the two would compete, and the subagents, where Superpowers would otherwise be missing.

### Install Both

Superpowers comes from the official plugin marketplace, and GSD Core comes from its installer. I use pnpm everywhere, and `pnpm dlx` runs the same package the docs show with `npx`.

```bash
# inside Claude Code
/plugin install superpowers@claude-plugins-official

# in your shell
pnpm dlx @opengsd/gsd-core@latest --claude --global
```

A local install into a fresh test repo wrote 853 files into `.claude/`, including 72 commands, 36 agents, and 19 hooks across seven lifecycle events in `settings.local.json`. That is a lot of code running inside every session, so read what it installed before you trust it with a real project.

Don't commit that install to a shared repo, either. The installer bakes absolute paths into the command files (675 references to my home directory in that test repo), so a teammate who clones it gets commands that point at files on my laptop. Have everyone install it themselves, or use the native plugin route (`claude plugin install gsd-core`), which skips the path baking but names every command `/gsd-core:gsd-<command>` instead.

### Decide Who Owns Planning

The Superpowers bootstrap ends with a rule that solves the main-session conflict for you: user instructions in `CLAUDE.md` take precedence over skills. That means one short section in a project's `CLAUDE.md` can hand planning to GSD without uninstalling anything.

```md
## Planning in GSD projects

When a `.planning/` directory exists, GSD owns planning. Use `/gsd-discuss-phase`
and `/gsd-plan-phase` instead of the Superpowers brainstorming and writing-plans
skills. The Superpowers test-driven-development, systematic-debugging, and
verification-before-completion skills still apply.
```

Keying it off `.planning/` keeps the rule scoped. Projects without GSD keep the full Superpowers flow, which for most of my day-to-day work is exactly what I want. In my test repo, "can you add a slugify function?" with no `.planning/` directory went straight into Superpowers brainstorming, and "can you add a wordCount function?" after GSD set up the project went straight to `/gsd-discuss-phase` with no brainstorm at all.

### Hand Superpowers Skills to GSD Subagents

GSD Core has a documented setting for the subagent side called `agent_skills`. It lives in `.planning/config.json` and maps any of GSD's 22 consumer agent types to a list of skills that get injected when that agent spawns. Plugin skills use a `global:<plugin>:<skill>` form, which on Claude Code loads the skill by name through the Skill tool.

```json
{
  "agent_skills": {
    "gsd-executor": [
      "global:superpowers:test-driven-development",
      "global:superpowers:verification-before-completion"
    ],
    "gsd-debugger": ["global:superpowers:systematic-debugging"],
    "gsd-code-fixer": ["global:superpowers:receiving-code-review"]
  }
}
```

That's the whole trick. GSD's executor keeps its fresh context and its single plan, and now it also carries Superpowers' rule that a failing test comes first. The debugger gets the four-phase root cause process instead of guessing, and the agent fixing review findings gets the skill that tells it to verify feedback before blindly applying it. You can also set this interactively with `/gsd-config --integrations`.

Commit `config.json` after you add the map. GSD runs each executor in its own git worktree, and a worktree only sees committed files, so an executor that falls back to loading its own skills reads a config with no `agent_skills` in it.

### What Happened When I Ran It

I ran one small phase end to end in a throwaway repo: add a `wordCount` function with tests. The executor's prompt carried the `<agent_skills>` block, and its second action, before touching a single file, was loading `superpowers:test-driven-development` and `superpowers:verification-before-completion`. The git log afterward reads test, feat, test, feat, and both times it stubbed the function with an empty body so the new tests failed on their assertions instead of on a missing export, the same move Superpowers made on its own earlier in the same repo.

I can't hand Superpowers all the credit, though. The GSD plan already marked those tasks as TDD and ran its own check for failing-test evidence, so two systems were pushing the same discipline at once. I also hit the worktree problem above: I'd left `config.json` uncommitted, and the block only reached the executor because the orchestrator pasted it into the prompt itself. After I committed it, a second run through `/gsd-quick` picked up the skills through GSD's own lookup with no help, and that executor loaded both Superpowers skills and produced the same test, feat, test, feat history.

Each injected skill adds tokens to every agent that loads it, and GSD runs a lot of agents, so keep the list short. The `global:<plugin>:<skill>` form only works on Claude Code; GSD skips those entries with a warning on every other runtime.

## When I Skip GSD Entirely

Most of what I do in a day is a bug fix, a small feature, or a refactor I can describe in a paragraph, and for that work GSD is the wrong tool. The test repo made that concrete. I added four small string functions to the same library, each with tests, and each one took a different path.

| Path | Function | Wall clock | Planner | Executor | Plan written |
|---|---|---|---|---|---|
| Full phase loop | `wordCount` | ~44 min (10 of it project setup) | 15 min | 3 min | 333 lines |
| `/gsd-quick` | `titleCase` | ~18 min | 11 min | 2.5 min | 303 lines |
| `/gsd-fast` | `reverseWords` | ~42 sec | none | none | none |
| Superpowers alone | `slugify` | ~3 min, my approval included | none | none | short design in chat |

Each path ran once, in a toy repo, so treat these as rough. The gaps are too big to be noise, though, and they all point at the same component. The setup time in the first row comes from GSD asking for a codebase map on any repo that already has code, and the rest of that run split into 22 minutes of planning and 9 of execution, code review, and verification.

The planner is the bottleneck. On the full loop it ran on Opus for 15 minutes, read about 20 of GSD's own reference docs, built a throwaway prototype of the function to check its own plan, and wrote a 333-line `PLAN.md` for a word counter. I expected `/gsd-quick` to fix that, since it skips discussion, research, the plan checker, and the verifier. It saved about 13 minutes by dropping those steps, but the planner itself still ran for 11 minutes, built a simulated git repo in its scratch directory to test edge cases, and wrote a plan that was actually larger in bytes than the full loop's. Both executors, running on Sonnet, finished the real work in under three minutes.

`/gsd-fast` is the only GSD path that suits small work, and it gets there by skipping GSD's machinery entirely. It runs inline in the main session with no subagents and no plan, which means Superpowers' TDD skill fired the way it would in any session: four failing tests against an empty stub, then the implementation, then one commit, all in 42 seconds. At that size, GSD's answer amounts to Superpowers plus a line in `STATE.md`.

GSD's own docs offer a rule of thumb I agree with: if the task fits in one short prompt and one agent turn, skip the phase loop. I'd go further and skip `/gsd-quick` too, because the planner it keeps is where the time goes. Superpowers alone covers that work well, since brainstorming scales down to a quick agreement in chat for small changes and only writes a full design doc when the work calls for one.

GSD earns its ceremony when the work spans days, sessions, or more files than I've read recently. That's when context rot stops being theoretical and a `STATE.md` on disk beats my memory of what we decided on Tuesday.

## Putting It Together

Superpowers and GSD aren't competing for the same job. Superpowers keeps the agent honest about process, and GSD keeps it sharp across a long project by never letting one context window carry the whole thing. They already agree on the shape of good agent work, which is why combining them takes two small pieces of config: a `CLAUDE.md` rule that gives GSD the planning, and an `agent_skills` map that carries Superpowers' TDD and debugging discipline into GSD's subagents. The planner sets the price of admission: 11 to 15 minutes before any code gets written, whether the job is a word counter or a week of work. I'm keeping Superpowers as my default, using `/gsd-fast` or nothing at all for small changes inside a GSD project, and reaching for the full loop only when a project is big enough to rot. If you've wired these two together differently, tell me how it went on [**Bluesky**](https://bsky.app/profile/joshfinnie.dev).

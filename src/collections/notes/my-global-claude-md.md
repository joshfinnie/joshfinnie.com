---
title: "What's in My Global CLAUDE.md"
date: "2026-08-03"
description: "The handful of standing instructions I give every coding agent, and why each one earns its place."
tags:
  - "ai"
  - "claude-code"
  - "tooling"
---

Claude Code reads `~/.claude/CLAUDE.md` on every session, so anything in there applies to every project I touch. Mine is short on purpose. Long instruction files get skimmed, and each rule I add dilutes the others.

Here it is in full:

```markdown
# global agent instructions

## Package Managers

- Always use **pnpm** for Node.js/JavaScript projects.
  Never use `npm` or `yarn` unless the project explicitly requires it (e.g., a `package-lock.json` with no `pnpm-lock.yaml`).

- Never use the em dash "—".
- When writing commit messages, NEVER auto-add your agent name as co-author
- Never manually modify CHANGELOG.md files or any files that are marked as auto-generated
- When making technical decisions, do not give much weight to development cost.
  Instead, prefer quality, simplicity, robustness, scalability, and long term maintainability.
- When doing bug fixes, always start with reproducing the bug in an E2E setting as closely aligned with how an end user would experience it as possible.
  This makes sure you find the real problem so your fix will actually solve it.
- When end-to-end testing a product, be picky about the UI you see and be obsessed with pixel perfection.
  If something clearly looks off, even if it is not directly related to what you are doing, try to get it fixed along the way.
- Apply that same high standard to engineering excellence: lint, test failures, and test flakiness.
  If you see one, even if it is not caused by what you are working on right now, still get it fixed.
- Do NOT add arbitrary or redundant comments to code.
```

A few of these deserve a word about why.

**pnpm, always.** Nothing philosophical here. I use pnpm workspaces, and an agent that reaches for `npm install` out of habit leaves a stray lockfile behind that I then have to notice and delete.

**No em dashes.** They are the tell. Once you have seen enough generated prose you cannot unsee them, and I would rather the writing on my site sound like me.

**Don't weigh development cost.** This is the rule I would keep if I could only keep one. Left alone, agents optimize for finishing, and "finishing" quietly becomes the smallest change that compiles. Telling it that my time is not the scarce resource shifts the output toward the thing I would have built myself with a free afternoon.

**Reproduce bugs end to end first.** Without this, you get a fix for a plausible-looking cause rather than the actual one. Making the agent see the failure the way a user would keeps it honest about whether the fix worked.

**Fix the broken thing you walked past.** Lint errors, flaky tests, a misaligned button. If an agent notices it and steps around it, that is worse than not noticing, because now nobody is going to.

**No redundant comments.** Left to its own devices, a model narrates every line. I want a comment when the code cannot explain itself, not `// increment the counter`.

The rules I have removed over time are as telling as the ones I kept. Anything about formatting or style belongs in a linter config, where a tool enforces it instead of politely asking. `CLAUDE.md` is for judgment calls a tool cannot make for you.

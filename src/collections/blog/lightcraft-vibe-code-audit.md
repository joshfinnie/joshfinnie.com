---
title: "Taking a Fine-Toothed Comb to a Vibe-Coded Lightroom Clone"
date: "2026-11-07" # TODO: confirm the repo is public by then
tags:
  - "rust"
  - "ai"
  - "open-source"
  - "refactor"
  - "code-review"
slug: "lightcraft-vibe-code-audit"
draft: true
description: "I spent a week having Claude Code audit my private fork of LightCraft, the AI-built Rust Lightroom clone: fuzzing, crash safety, a locked control port, faster frames, and 50,000 deleted lines."
heroImage: "blog/lightcraft-tetons"
unsplash: ""
unsplashURL: ""
---

LightCraft is the free, pure-Rust Lightroom clone from the ArtCraft team, one of seven Adobe replacements they built with a fleet of AI agents and released this fall. I like it a lot. I also opened the code and thought it felt vibe coded in a way I didn't like, so I spent a week with Claude Code finding out what was actually wrong and fixing it.

## The Criticism

ArtCraft got a lot of attention fast. [Futurism](https://futurism.com/future-society/adobe-creative-suite-software-open-source-artcraft) covered it, a [Substack post](https://ahutchinson.substack.com/p/someone-just-vibe-coded-the-entire) tried every app, and the [Hacker News thread](https://news.ycombinator.com/item?id=50010170) did what Hacker News threads do. A lot of people called the apps unoptimized, vibe-coded messes.

Most of that criticism came from using the apps. A text cursor in the wrong place. Subject masking that missed an obvious subject. Nobody I could find had gone through the code itself. I wanted to know whether "vibe coded" meant something you could point at in the source, or just a feeling.

My first prompt to Claude was the honest version:

> i love this application, but it's vibe coded in a way that i do not like. is there a way to can take a fine toothed comb to this and improve it like the staff level engineer?

## Audit First, Change Nothing

I didn't hand Claude a rubric. The repo already had a strong CLAUDE.md with rules like "never crash," clean layers, and "everything is a command," and my global CLAUDE.md added my own habits on top. Claude wrote its own plan from those, and I agreed with it. Audit first and change nothing. Lock in current behavior with tests before refactoring. Refactor in small commits with one theme each. Then add a lint or a gate so the problem can't come back.

The audit came back as a ranked document. It had eleven confirmed bugs, each reproduced through the CLI, the control port, or the app itself, and a list of bigger structural problems ranked by priority. Every fix after that followed the same pattern. First a test that failed, then the fix, then a full `cargo xtask ci` run before anything merged.

## Three Short Prompts Set The Bar

The prompts that steered the whole week were short. The longest one I typed was under 200 characters. Three of them did most of the work, and each one named a level of engineer.

The first was the opening prompt above, asking Claude to go through the code "like the staff level engineer." I didn't write a checklist. Claude answered with a plan instead of a patch, and that plan became the audit.

The second came on day two, after Claude had fixed the first round of bugs:

> nice. with a staff level engineering review of the application itself. what's left to improve, fix, remove?

The first pass looked for bugs. This one looked at the whole system. Most of the structural numbers in this post came from it: the error types flattened into strings, the state structs growing a field a day, and the command function past 1,700 lines. The word "remove" mattered too. It put deleting code on the table as a fix in its own right.

The third came a week later, and it raised the bar again:

<!-- vale write-good.Passive = NO -->

> that's okay. let's give this another principal engineering level review. be picky as i want a good list of best practices that can be adopted or code-smell that can be deleted or rewritten.

<!-- vale write-good.Passive = YES -->

For that one Claude split the codebase five ways and ran a reviewer on each part in parallel: the engine core, the UI, the imaging stack, the catalog and file IO, and the apps and tooling. It then checked every claim the reviewers made and marked the ones it had confirmed. That pass found the data-loss bugs below, and it pointed at the per-frame work in the loupe and the menu bar. I read the list and replied "let's do them all."

My take on why these worked: the title is shorthand for a standard. "Staff" asks for judgment about how the pieces fit. "Principal," plus "be picky," asks for the long tail of things a busy reviewer would let slide. The title doesn't give Claude knowledge it didn't have. It changes what Claude looks for and how much it's willing to flag. The rules themselves already lived in CLAUDE.md, so the prompt only had to set the bar. I'd use the same order again: start with the bugs, then the system, then the picky pass.

## What Vibe Coded Actually Looked Like

Claude's first verdict surprised me. "It's better built than 'vibe coded' suggests. The low layers are solid." The image math, the color code, and the undo system all held up. The problems sat where the layers meet, and in the top two crates, the engine and the egui UI.

Those problems grew fast. Upstream went from about 112,000 lines of Rust to about 308,000 in two weeks, and the structural debt grew with it. Functions returning `Result<_, String>`, which throws away what kind of error happened, went from 142 to 619. The giant `run_ui_command` function went from 1,012 lines to 1,710. The UI state struct picked up 41 fields in a day. Nothing in there is a crash. It's what code looks like when many agents add features and nobody owns the seams.

The real bugs were small and specific. `version.delete index=-1` deleted the first version. A misspelled parameter got silently ignored, so `photo.rate rating=2 idz=[1,2]` rated the wrong photo and reported `ok`. A folder with a symlink loop hung the import forever. The CLI wrote a hardcoded fake date into real photo libraries.

## Crashes From Hostile Files

A photo editor reads files from strangers, so the parsers matter most. The raw, TIFF, and metadata parsers indexed slices straight from file offsets, which panics the moment a file lies about its size. Claude counted 21 of those sites in the TIFF crate, 82 in metadata, and 889 in the raw decoders.

The fix was boring on purpose. Every read from a file offset uses `get` instead of `[i]`, and Clippy refuses to build if anyone forgets. Here's part of the TIFF change:

```rust
// every offset here comes from a file: read with `get`, never `[i]` (tests may index)
#![cfg_attr(not(test), deny(clippy::indexing_slicing))]

// before
let offset = self.offsets[i];
Some(&data[start..end])

// after
let Some(&offset) = self.offsets.get(i) else { break };
data.get(start..end)
```

The same rule now covers the TIFF, metadata, codec, and raw crates, and the CI gate checks that every crate root still carries its never-crash attributes.

Then Claude added fuzz targets for the raw, codec, and metadata parsers. They found two real bugs. The best one was a 686-byte TIFF that made the third-party `tiff` crate try to allocate 8 GB for a single tag, which killed the whole app instead of showing an error. LightCraft now refuses a tag that claims more values than the file holds, before it decodes anything. Raw files got the same treatment. The sample limit had been `1 << 30`, so a small raw could ask for 2 to 4 GB, and every decoder now checks the image size limit before it allocates.

## Locking The Control Port

LightCraft has a local control port for automation, and it accepted commands from anything on the machine without a token. An upstream pull request already fixed that, so I merged it early. Claude then tightened the edges around it. The token file belongs to the app that serves the port, and it gets cleaned up properly. Idle connections drop after five minutes, and click and drag counts on the channel have limits.

The supply chain got a look too. The build pulled in `ring`, and the `rsa` crate carried a published RustSec advisory. The last change I'm making, still uncommitted as I write this, is a `cargo xtask deps` gate built on cargo-deny. It refuses crates that compile C or assembly, copyleft licenses, sources other than crates.io, and any crate with an open advisory.

## Data That Could Disappear

The principal-level review found the scariest bugs, because they lose your photos without crashing anything. If your library folder went missing, say an unplugged drive, LightCraft quietly made a new one full of demo photos. Import with Copy or Move wrote straight to the final file name and never synced the folder, so a crash mid-import could leave a half-written file that looked complete. The presets file could get overwritten with nothing. The catalog kept one snapshot with no checksum.

All of it now goes through one atomic writer. Reads of user files have a size cap. The catalog keeps more than one generation, each with a checksum, and the desktop app has a Back Up Library command.

## Making It Fast

The "unoptimized" complaint was real, and it was easy to measure. On a heavily painted photo with 40 brush strokes, every frame re-serialized all the develop settings to JSON just to hash them. It did that one to three times per frame. An idle frame in the loupe took 24 ms, over the 16 ms budget for 60 frames per second.

Claude timed everything before touching it, and checked the numbers when they looked too good.

| What | Before | After |
| --- | --- | --- |
| Idle loupe frame, heavy edit | 24 ms | 0.55 ms |
| Settings hash per drag frame | 5.2 ms | 0.67 ms |
| Menu bar per frame | 3.0 ms | 1.24 ms |
| Extra memory, JPEG export | 510 MB | 145 MB |
| Extra memory, 16-bit TIFF export | 412 MB | 2 MB |

The settings now hash once per edit and cache the result. The hash mixes raw words instead of JSON text. Exports stopped copying the whole image on the way to the encoder. Each fix shipped with a test that fails if the extra work comes back.

## Triaging 515 Pull Requests

Upstream had over 500 open pull requests when I asked Claude to go through them. About 500 came from outside forks, a lot of them written by agents. Fifty-one had conflicts, and many were duplicates of each other.

Claude grouped them by what they touched and read every diff. Where two fixed the same thing, it picked the better one. I merged the first batch of twelve, all safety fixes: refusing malformed commands, bounded TIFF parsing, exports and GPU errors that stop cleanly instead of crashing, and the control port token. A dozen good fixes were sitting in a queue nobody had time to read. That's another thing vibe-coded projects produce, and an agent is a good fit for reading through it.

## Cutting 50,000 Lines

My fork ended the week with 26,403 lines added and 50,752 removed. Most of the cut was stuff I'll never use. Thirty locale files made up about 35,000 lines on their own, and I only need English. The MCP server was another 2,800 lines, and the app binary now works as the CLI. The FreeBSD and Nix packaging went, along with the CI for platforms I don't run. Claude also vendored the two shared ArtCraft UI crates and gave the app its own ID, so the fork doesn't depend on anything upstream.

Linux and the web build stayed. I might use Linux, and I like having a web version. The fork runs on my Mac and my Windows PC, and it's set up for the photos from my Fujifilm X-T30 II.

## Where Claude Got It Wrong

It wasn't clean. Claude stashed a file it shouldn't have. Once it cited a commit hash that never existed. It killed `rustup` in the middle of an update and broke the toolchain. Its early claim of "273 swallowed errors" didn't survive a closer look, and it took it back. Four of its first fixes got dropped on rebase because upstream had already fixed the same bugs.

I overruled it a few times too. It set up hosted CI runners for macOS and Windows, and I stopped it, because the gate runs locally and that's enough for a fork only I use. It suggested switching the test runner to nextest. Then it measured nextest at eleven times slower on this suite, and I said no. It also added a 90-minute guard to the CI command after one test hung for seven hours.

## The Week In Numbers

The whole thing was one Claude Code session over seven working days, with about 86 prompts from me. Most were short: "yea," "let's do it," "what's next?" The context filled up and got compacted nine times. On two nights I left it running on `/loop` and checked the results in the morning. I didn't use plan mode or any skills. The audit documents did the planning.

Coverage across the workspace ended at 91% of lines. About 4.5 million fuzz inputs ran clean on three of the parser targets.

## Putting It Together

"Vibe coded" turned out to mean something specific. It meant unchecked indexing in parsers, errors flattened into strings, state structs that grow a field a day, and data writes with no atomic step. The core was better than the reputation. The seams were worse. None of it needed a rewrite. It needed an audit, a failing test per bug, and a lint that stops each class of mistake from coming back. The same tool that wrote the mess was a good tool for cleaning it up, as long as someone kept asking for the boring version of every fix.

My fork is at [github.com/joshfinnie/lightcraft](https://github.com/joshfinnie/lightcraft). It's a personal fork, not an official build, and nothing in it has gone back upstream. The hero image is LightCraft developing Ansel Adams' "The Tetons and the Snake River" (1942), public domain from the U.S. National Archives. If you've tried cleaning up an AI-built codebase, tell me what you found on [**Bluesky**](https://bsky.app/profile/joshfinnie.dev).

<!-- TODO: repo link goes live only once github.com/joshfinnie/lightcraft is public. Keep draft: true until then. -->

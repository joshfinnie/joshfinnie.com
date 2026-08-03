---
title: "Restoring a File You Deleted Three Commits Ago"
date: "2026-08-03"
description: "Find the commit that deleted a file and bring it back, without touching anything else."
tags:
  - "git"
---

I do this often enough to keep looking it up, so here it is. First, find the commit that deleted the file:

```bash
$ git log --oneline --diff-filter=D -- path/to/file.ts
```

That gives you the commit where the deletion happened. The file still exists in that commit's _parent_, so restore it from there:

```bash
$ git checkout <sha>^ -- path/to/file.ts
```

The `^` is the whole trick — it means "the commit before this one." Grab the SHA of the deletion, add a caret, and the file lands back in your working tree staged and ready to commit.

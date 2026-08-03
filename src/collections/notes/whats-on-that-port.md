---
title: "What's Listening on That Port?"
date: "2026-08-03"
description: "The one-liner for tracking down whatever stole port 3000."
tags:
  - "cli"
  - "linux"
---

Dev server won't start because the port is already taken? Find the culprit:

```bash
$ lsof -i :3000
```

That prints the PID along with the command name, so you can see at a glance that you left a server running in another terminal. If you just want the PID to kill it:

```bash
$ kill $(lsof -t -i :3000)
```

The `-t` flag makes `lsof` output terse — PIDs only — which is exactly what `kill` wants.

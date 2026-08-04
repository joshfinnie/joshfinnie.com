---
title: "Gate SSL on the Host, Not NODE_ENV"
date: "2026-08-04"
description: "A database connection that silently dropped SSL because it trusted the wrong signal."
tags:
  - "postgres"
  - "debugging"
---

A seed script started failing against a remote database with `PostgresError: SSL required`, even though the connection string had `sslmode=require` right in it. The driver just wasn't negotiating SSL for that connection at all.

The culprit was this, in the database client setup:

```ts
const ssl = process.env.NODE_ENV === "production";
```

That reads reasonably: production talks to a real database, so it gets SSL. But it means every non-production run, a local script, a one-off `tsx` invocation, a seed job, connects with `NODE_ENV` unset or `development`, and silently skips SSL no matter what host it's actually talking to. The remote database doesn't care what `NODE_ENV` says. It cares whether the connection carries encryption.

The fix is to key off the thing that actually matters:

```ts
const ssl = !host.includes("localhost") && !host.includes("127.0.0.1");
```

`NODE_ENV` describes how your code is running. It says nothing about where the other end of the connection lives. Gate any security decision, SSL included, on the real target, not on a proxy for it.

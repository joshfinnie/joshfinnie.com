---
title: "Setting Up the Server"
draft: false
date: "2026-08-31"
tags:
  - "rust"
  - "axum"
  - "docker"
  - "tutorial"
series: "pokemon-api"
order: 3
description: "Wiring the config from the last part into an Axum server, split across a binary entry point and a build_app function."
---

With config in place, we can bring up an actual server. We split this across two files: `main.rs`, which owns startup and shutdown, and `app.rs`, which owns building the `Router` itself. Keeping `build_app` separate from `main` gives us a clean composition boundary. Later, integration tests can construct the application directly without starting a real TCP listener.

```rust
// crates/pokemon-api/src/app.rs
use axum::Router;

pub fn build_app() -> Router {
    Router::new()
}
```

`build_app` doesn't do anything asynchronous yet, so it stays a plain synchronous function rather than `async fn`. It also can't fail today, so it returns `Router` directly instead of `anyhow::Result<Router>`. Async initialization, and anything that can fail, belongs in `main`; building the router itself is just composition.

```rust
// crates/pokemon-api/src/main.rs

use tokio::net::TcpListener;

use pokemon_api::app::build_app;
use pokemon_api::config::AppConf;

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    tracing_subscriber::fmt::init();

    let config = AppConf::init()?;
    let addr = config.server.addr();

    let listener = TcpListener::bind(addr).await?;

    tracing::info!(%addr, "Listening");

    let app = build_app();

    axum::serve(listener, app).await?;

    Ok(())
}
```

We reach for Tokio's `TcpListener` here, not `std::net::TcpListener`. Both can bind a socket, but Tokio's version does it asynchronously and hands back a listener `axum::serve` can poll without blocking the runtime, which is the natural pairing with everything else in this function already being `async`.

`main` reads config, binds a listener to the address it produces, builds the app, and hands both off to `axum::serve`. Nothing here is Pokemon-specific yet. The routes that make this a Pokemon API get merged into `build_app` starting with the next part.

```bash
$ make run
INFO Listening addr=0.0.0.0:8080
```

In another terminal:

```bash
$ curl -i http://localhost:8080
HTTP/1.1 404 Not Found
```

A 404 is the right outcome here. There are no routes yet, so nothing should match, but the response coming back at all proves the whole path works: config produced a `SocketAddr`, that address became a `TcpListener`, and Axum served an empty `Router` over it. Part 4 gives that router its first real route.

---
title: "Middleware"
draft: true
date: "2026-08-28"
tags:
  - "rust"
  - "axum"
  - "docker"
  - "tutorial"
series: "pokemon-api"
order: 5
description: "Wiring CORS, request tracing, and a body size limit through tower-http, driven by the config we already loaded."
---

Middleware is for the concerns that apply to every route regardless of what it does: which origins can call the API, how large a request body we accept, and what tracing records about each request. None of that belongs inside a handler, and none of it is specific to Pokemon.

We reach for [tower-http](https://docs.rs/tower-http) rather than writing this by hand, since Axum's `Router` already composes with anything built on `tower::Layer`.

```rust
// crates/pokemon-api/src/middleware/cors.rs

use axum::http::{HeaderName, HeaderValue, Method};
use tower_http::cors::CorsLayer;

use crate::config::ServerConf;

pub fn build(conf: &ServerConf) -> anyhow::Result<CorsLayer> {
    let origins: Vec<HeaderValue> = conf
        .allowed_origins
        .split(',')
        .map(|origin| origin.trim().parse())
        .collect::<Result<_, _>>()?;

    let methods: Vec<Method> = conf
        .allowed_methods
        .split(',')
        .map(|method| method.trim().parse())
        .collect::<Result<_, _>>()?;

    let headers: Vec<HeaderName> = conf
        .allowed_headers
        .split(',')
        .map(|header| header.trim().parse())
        .collect::<Result<_, _>>()?;

    Ok(CorsLayer::new()
        .allow_origin(origins)
        .allow_methods(methods)
        .allow_headers(headers))
}
```

Parsing the comma-separated env values here, instead of in `config.rs`, keeps `ServerConf` a plain data holder and puts the tower-specific types where tower-specific code belongs. The parsing is fallible now too, `filter_map` would have silently dropped a malformed origin instead of failing, and a CORS policy that's silently missing an origin nobody asked to drop is worse than a server that refuses to start. `?` here means a bad `SERVER_ALLOWED_ORIGINS` value fails loudly at startup instead of quietly at request time.

```rust
// crates/pokemon-api/src/lib.rs

pub mod app;
pub mod config;
pub mod middleware;
pub mod routes;
```

`build_app` now needs the config to build the CORS layer, so it takes a reference to it instead of nothing:

```rust
// crates/pokemon-api/src/app.rs

use axum::extract::DefaultBodyLimit;
use axum::Router;
use tower_http::trace::TraceLayer;

use crate::config::AppConf;
use crate::{middleware, routes};

pub fn build_app(config: &AppConf) -> anyhow::Result<Router> {
    Ok(Router::new()
        .merge(routes::init())
        .layer(DefaultBodyLimit::max(config.server.default_body_limit))
        .layer(middleware::cors::build(&config.server)?)
        .layer(TraceLayer::new_for_http()))
}
```

`build_app` is fallible again, since building the CORS layer now is. That gives us a startup invariant worth having: if the server starts at all, its HTTP configuration was valid.

Layers apply outside-in on the way to the handler and inside-out on the way back, so `TraceLayer` being last here means it sees the request first and the response last, giving it an accurate picture of the whole request lifecycle including CORS handling. `TraceLayer::new_for_http()` creates a tracing span for each HTTP request and records information about the request and response using Tower HTTP's default fields. That's enough for now; once the application's observability needs are clearer, we can customize the span and its fields, but that's its own concern for later, not something to design speculatively here.

The call site now propagates the error:

```rust
// crates/pokemon-api/src/main.rs
let app = build_app(&config)?;
```

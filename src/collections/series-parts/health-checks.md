---
title: "Health Checks"
draft: false
date: "2026-08-31"
tags:
  - "rust"
  - "axum"
  - "docker"
  - "tutorial"
series: "pokemon-api"
order: 4
description: "A liveness endpoint the container orchestrator can poll before the service has any dependencies to check."
---

Before we add a database or anything else the service depends on, we give it a liveness check: an endpoint that answers as long as the process is up and the Axum router is serving requests. That gives a container orchestrator a simple way to determine whether the process is still alive and serving requests.

```rust
// crates/pokemon-api/src/routes/health.rs

use axum::http::StatusCode;
use axum::{
    Router,
    routing::get,
};

pub fn init() -> Router {
    Router::new().route("/healthz", get(health))
}

async fn health() -> StatusCode {
    StatusCode::OK
}
```

A liveness check doesn't need a body. `200` means alive, anything else means it isn't, and that's the whole contract, so `health` returns a bare `StatusCode` instead of a JSON payload. If we later want the endpoint to report more than that, a body is easy to add then.

Rather than reaching into `routes::health` directly from `app.rs`, `routes/mod.rs` owns composing the route modules together:

```rust
// crates/pokemon-api/src/routes/mod.rs
use axum::Router;

mod health;

pub fn init() -> Router {
    Router::new().merge(health::init())
}
```

```rust
// crates/pokemon-api/src/app.rs
use axum::Router;

use crate::routes;

pub fn build_app() -> Router {
    Router::new().merge(routes::init())
}
```

`app.rs` never needs to know `health.rs` exists; it just asks `routes` for whatever routes exist. As more route modules show up over the rest of this series, they get added to `routes/mod.rs`, not to `app.rs`.

Liveness is only half the picture. A readiness check, one that confirms the database is actually reachable before the load balancer sends traffic, needs a database pool to check. We add a `/readyz` endpoint once that pool and the shared `AppState` that holds it exist, later in this series.

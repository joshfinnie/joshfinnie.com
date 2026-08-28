---
title: "Application State"
draft: true
date: "2026-08-28"
tags:
  - "rust"
  - "axum"
  - "docker"
  - "tutorial"
series: "pokemon-api"
order: 7
description: "Sharing the pool and config with every handler through Axum's typed state, and finally finishing the /readyz endpoint."
---

Every handler we write from here on needs the database pool. Passing it around as a function argument doesn't work once Axum is calling those handlers for us, so we hand it to the `Router` once as shared state, and Axum injects it into any handler that asks for it.

```rust
// crates/pokemon-api/src/lib.rs

pub mod app;
pub mod config;
pub mod db;
pub mod middleware;
pub mod routes;
pub mod state;
```

```rust
// crates/pokemon-api/src/state.rs

use sqlx::PgPool;

use crate::config::AppConf;

#[derive(Clone)]
pub struct AppState {
    pub config: AppConf,
    pub db: PgPool,
}
```

`AppState` needs to be cheap to clone, since Axum clones it for every request. That's fine here: `PgPool` is already an `Arc` internally, and `AppConf` is small.

`build_app` now takes the state directly instead of just the config, and calls `.with_state` once at the end so every route merged in above it can use `State<AppState>`:

```rust
// crates/pokemon-api/src/app.rs

use axum::extract::DefaultBodyLimit;
use axum::Router;
use tower_http::trace::TraceLayer;

use crate::state::AppState;
use crate::{middleware, routes};

pub fn build_app(state: AppState) -> anyhow::Result<Router> {
    Ok(Router::new()
        .merge(routes::init())
        .layer(DefaultBodyLimit::max(state.config.server.default_body_limit))
        .layer(middleware::cors::build(&state.config.server)?)
        .layer(TraceLayer::new_for_http())
        .with_state(state))
}
```

`routes::init()` itself now returns `Router<AppState>` instead of a stateless `Router`, since `/readyz` below needs `State<AppState>` to reach the pool. `Router<AppState>` doesn't mean "a router that already has state in it," it means a router whose handlers require `AppState`, and that still needs one supplied before it can serve anything. That's what `.with_state(state)` does in `build_app` above: it's the point where a `Router<AppState>` becomes a plain `Router` ready to hand to `axum::serve`.

```rust
// crates/pokemon-api/src/routes/mod.rs
use axum::Router;

use crate::state::AppState;

mod health;

pub fn init() -> Router<AppState> {
    Router::new().merge(health::init())
}
```

```rust
// crates/pokemon-api/src/main.rs

let config = AppConf::init()?;
let addr = config.server.addr();

let pool = db::build_pool(&config.database).await?;
let state = AppState { config: config.clone(), db: pool };

let listener = TcpListener::bind(addr).await?;

tracing::info!(%addr, "Listening");

let app = build_app(state)?;
```

The listener still isn't bound until after the database pool and its migrations have successfully initialized, the same ordering from the last part. If a required dependency fails during startup, the process exits without ever accepting traffic.

With a pool available, we can finally finish the readiness check we deferred back in the Health Checks part. `/healthz` still only proves the process is up; `/readyz` now proves the database is reachable too, which is the check a load balancer should actually gate traffic on.

```rust
// crates/pokemon-api/src/routes/health.rs

use axum::extract::State;
use axum::http::StatusCode;
use axum::{
    Router,
    routing::get,
};

use crate::state::AppState;

pub fn init() -> Router<AppState> {
    Router::new()
        .route("/healthz", get(health))
        .route("/readyz", get(ready))
}

async fn health() -> StatusCode {
    StatusCode::OK
}

async fn ready(State(state): State<AppState>) -> StatusCode {
    match sqlx::query("SELECT 1").execute(&state.db).await {
        Ok(_) => StatusCode::OK,
        Err(_) => StatusCode::SERVICE_UNAVAILABLE,
    }
}
```

`/readyz` executes a minimal query against Postgres rather than just borrowing a connection from the pool. Borrowing a connection would prove the pool can obtain one, but not that the database can actually execute anything against it; `SELECT 1` does. That's the real distinction between the two endpoints: `/healthz` only proves the application process is up and serving requests, `/readyz` proves its database dependency is operational. Same contract either way: a status code is the whole response, nothing to parse.

The whole app now shares its state. The next three parts build what actually uses it: a repository for reading and writing Pokemon data, a service layer for the rules around that data, and the handlers that expose it over HTTP.

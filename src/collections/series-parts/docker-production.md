---
title: "Docker & Production"
draft: false
date: "2026-08-31"
tags:
  - "rust"
  - "docker"
  - "tutorial"
series: "pokemon-api"
order: 13
description: "A pinned, multi-stage Dockerfile, graceful shutdown, and the gap between a container that runs and a service you could actually deploy."
---

Everything so far runs with `make run` against a Postgres instance on the host. Shipping this means a container: something that builds once, runs the same way everywhere, and doesn't drag a Rust toolchain along with it into production.

## Building the image

A naive `Dockerfile` that just runs `cargo build --release` rebuilds every dependency from scratch on every single code change, since Docker's layer cache invalidates the moment any file in the build context changes. [cargo-chef](https://github.com/LukeMathWalker/cargo-chef) fixes that by splitting "build the dependencies" from "build our code" into separate, separately-cacheable layers.

```dockerfile
# syntax=docker/dockerfile:1
# Dockerfile

FROM lukemathwalker/cargo-chef:0.1.68-rust-1.85-bookworm AS chef
WORKDIR /app

FROM chef AS planner
COPY . .
RUN cargo chef prepare --recipe-path recipe.json

FROM chef AS builder
COPY --from=planner /app/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json -p pokemon-api
COPY . .
RUN cargo build --release -p pokemon-api

FROM debian:bookworm-slim AS runtime
RUN apt-get update \
    && apt-get install -y --no-install-recommends ca-certificates wget \
    && rm -rf /var/lib/apt/lists/*
RUN useradd --create-home --uid 1000 pokemon

COPY --from=builder /app/target/release/pokemon-api /usr/local/bin/pokemon-api

USER pokemon
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s \
    CMD wget -qO- http://localhost:8080/healthz || exit 1

ENTRYPOINT ["/usr/local/bin/pokemon-api"]
```

`planner` figures out the dependency graph and writes it to `recipe.json`; `builder` uses that recipe to compile just the dependencies in a layer Docker can cache, then copies the real source in and builds `pokemon-api` on top. Change application code without touching `Cargo.toml`, and the dependency layer stays cached; only the last two steps rerun.

Two details worth explaining rather than just writing. First, the `chef` base image names a specific `cargo-chef`/Rust/Debian combination, not `latest-rust-1`. "Build once, run the same way everywhere" is the whole point of containerizing in the first place; a floating tag means the image built today and the image built from the same `Dockerfile` next month can silently contain a different Rust compiler. Pin it, and bump the pin deliberately when there's a reason to.

Second, `debian:bookworm-slim` doesn't ship an HTTP client, so `wget` gets installed alongside `ca-certificates` specifically so `HEALTHCHECK` has something to run. That `HEALTHCHECK` and the `/readyz` endpoint from Application State are answering different questions for different audiences: Docker's `HEALTHCHECK` is about container-level liveness, whether Docker itself should consider this container healthy or restart it, while `/readyz` is what a load balancer or orchestrator polls to decide whether to route traffic to this instance at all. It's not an accident that `HEALTHCHECK` here points at `/healthz`, not `/readyz`; a container can be alive and still not ready for traffic; those are different signals for different consumers.

Notice `runtime` never copies a `migrations/` directory in. `sqlx::migrate!("./migrations")` back in Database Connection Pooling embeds the migration files into the binary at compile time, not at runtime, so the compiled `pokemon-api` binary already carries everything it needs to migrate a fresh database on startup. That's one less thing to get wrong in a container image, and it's also a decision worth revisiting once more than one instance of this API exists, more on that below.

A `.dockerignore` keeps the build context, and therefore what gets sent to the daemon and what can bust the cache, down to what actually matters:

```text
# .dockerignore
target
.git
.env.local
```

`.env.local` isn't excluded for build-cache reasons; it's excluded because it can hold real secrets, and nothing that ever touches a build context should end up baked into an image layer. Production secrets belong in the deployment environment or a secrets manager, injected at runtime, never copied in at build time.

## Running it locally

For local development, `compose.yaml` brings up Postgres and the API together, using the same environment variables `AppConf` already knows how to read:

```yaml
# compose.yaml
services:
  postgres:
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: pokemon
      POSTGRES_PASSWORD: pokemon
      POSTGRES_DB: pokemon
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U pokemon"]
      interval: 5s
      timeout: 3s
      retries: 5

  api:
    build:
      context: .
      dockerfile: Dockerfile
    environment:
      SERVER_PORT: "8080"
      SERVER_ALLOWED_ORIGINS: "http://localhost:3000"
      SERVER_ALLOWED_METHODS: "GET,POST,PUT,DELETE,OPTIONS"
      SERVER_ALLOWED_HEADERS: "Content-Type,Authorization"
      SERVER_DEFAULT_BODY_LIMIT: "1048576"
      SERVER_ENABLE_DOCS: "false"
      DATABASE_URL: "postgres://pokemon:pokemon@postgres:5432/pokemon"
      DATABASE_MAX_CONNECTIONS: "10"
    ports:
      - "8080:8080"
    depends_on:
      postgres:
        condition: service_healthy
```

`SERVER_ENABLE_DOCS` is new. `/docs` isn't inherently unsafe, disabling it doesn't disable the API itself, only the interactive documentation, but an unauthenticated console that can invoke every route in the API is exactly the kind of thing that shouldn't be reachable by default just because nobody thought about it. That decision becomes config instead of a hardcoded route:

```rust
// crates/pokemon-api/src/config.rs

#[derive(Clone, Envconfig)]
pub struct ServerConf {
    #[envconfig(from = "SERVER_PORT", default = "8080")]
    pub port: u16,

    #[envconfig(from = "SERVER_ALLOWED_ORIGINS")]
    pub allowed_origins: String,

    #[envconfig(from = "SERVER_ALLOWED_METHODS")]
    pub allowed_methods: String,

    #[envconfig(from = "SERVER_ALLOWED_HEADERS")]
    pub allowed_headers: String,

    #[envconfig(from = "SERVER_DEFAULT_BODY_LIMIT", default = "1048576")]
    pub default_body_limit: usize,

    #[envconfig(from = "SERVER_ENABLE_DOCS", default = "true")]
    pub enable_docs: bool,
}
```

```rust
// crates/pokemon-api/src/app.rs

pub fn build_app(state: AppState) -> anyhow::Result<Router> {
    let mut router = Router::new().merge(routes::init());

    if state.config.server.enable_docs {
        router = router.merge(SwaggerUi::new("/docs").url("/api-docs/openapi.json", ApiDoc::openapi()));
    }

    Ok(router
        .fallback(not_found)
        .layer(DefaultBodyLimit::max(state.config.server.default_body_limit))
        .layer(middleware::cors::build(&state.config.server)?)
        .layer(TraceLayer::new_for_http())
        .with_state(state))
}
```

Local development, and `.env.example`, keep the default of `true`: docs on by default is the right default for a repo someone just cloned. `compose.yaml` above sets `SERVER_ENABLE_DOCS=false` explicitly, since that's closer to what a real deployment would want, and a config-driven toggle means turning it back on for a specific environment is a variable, not a code change.

```bash
$ docker compose up --build
```

That builds the image, starts Postgres, waits for it to report healthy, then starts the API against it, the same startup sequence from Application State, config then pool then listener, just running inside a container instead of on the host.

## What production actually looks like

Everything above is a real, working container. It's also not the same thing as production, and it's worth being explicit about the gap rather than letting "runs in Docker" quietly stand in for "ready to deploy."

Postgres running as a `compose.yaml` service is convenient for local development and not something to run that way for real traffic; a production deployment points `DATABASE_URL` at a managed database instead, one with its own backups, failover, and operational ownership separate from the API. Secrets, `DATABASE_URL` included, come from whatever the deployment platform provides for that, not from an `environment:` block checked into a compose file. TLS terminates at a load balancer or reverse proxy in front of this service, not inside `pokemon-api` itself, since certificate management is its own concern this application has no reason to own. And a real deployment runs more than one instance of this API behind that load balancer, which is where a decision that looked harmless earlier stops being harmless.

Running `sqlx::migrate!` on every startup is fine with one instance. With four instances deploying at once, all four try to run migrations against the same database simultaneously:

```text
Deploy
  ├── API replica 1 → migrations
  ├── API replica 2 → migrations
  ├── API replica 3 → migrations
  └── API replica 4 → migrations
```

sqlx takes a lock around its migration run, so this doesn't corrupt anything, the other replicas just wait their turn, but application startup and schema migration are still coupled in a way that's worth separating deliberately once there's more than one replica. A common pattern is running migrations as their own deployment step, a one-off job that runs the migration and exits, before the new application version rolls out at all, rather than leaving four copies of the same binary racing to be the one that gets the lock first.

The last piece is what happens when a replica needs to stop, a deploy, a scale-down, a node getting reclaimed. `axum::serve` as written stops the instant the process receives a termination signal, mid-request or not. Graceful shutdown means: stop accepting new connections, but let requests already in flight finish first.

```rust
// crates/pokemon-api/src/main.rs

use tokio::signal;

async fn shutdown_signal() {
    let ctrl_c = async {
        signal::ctrl_c()
            .await
            .expect("failed to install Ctrl+C handler");
    };

    #[cfg(unix)]
    let terminate = async {
        signal::unix::signal(signal::unix::SignalKind::terminate())
            .expect("failed to install signal handler")
            .recv()
            .await;
    };

    #[cfg(not(unix))]
    let terminate = std::future::pending::<()>();

    tokio::select! {
        _ = ctrl_c => {}
        _ = terminate => {}
    }

    tracing::info!("shutdown signal received");
}
```

```rust
// crates/pokemon-api/src/main.rs

axum::serve(listener, app)
    .with_graceful_shutdown(shutdown_signal())
    .await?;
```

`ctrl_c` handles a developer hitting `Ctrl+C` locally; the Unix `terminate` branch handles `SIGTERM`, which is what Docker sends on `docker stop` and what Kubernetes sends before it eventually escalates to `SIGKILL`. `tokio::select!` waits for whichever comes first, logs that shutdown started, and `with_graceful_shutdown` stops `axum::serve` from accepting new connections while letting whatever's already in progress complete. Without this, a rolling deploy under real traffic drops whatever request happened to be mid-flight when the old replica got killed. With it, that same deploy is invisible to whoever was making the request.

None of resource limits, log aggregation, or a managed Postgres instance are things this series can demonstrate without turning into a Kubernetes tutorial, but they're the same shape as everything else here: `/healthz` and `/readyz` are the liveness and readiness signals an orchestrator needs, structured logs to stdout are what a log aggregator expects instead of a file it has to go find, and graceful shutdown is what makes "multiple replicas" and "rolling deploys" safe instead of just possible. The application itself doesn't need to change to support any of that; it's already built this way.

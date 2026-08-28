---
title: "Observability"
draft: true
date: "2026-08-28"
tags:
  - "rust"
  - "axum"
  - "tutorial"
series: "pokemon-api"
order: 14
description: "Request IDs and custom tracing spans, the two things Middleware explicitly deferred, plus structured logs for production."
---

Back in Middleware, `TraceLayer::new_for_http()` got the default Tower HTTP span, and we said custom spans and request IDs were their own concern for later. This is later. With CORS, the database, and the whole HTTP surface in place, it's clear what those spans actually need to carry.

A request ID is the small piece everything else here depends on: one value, generated the moment a request arrives, present in every log line that request produces, and echoed back in the response so a caller reporting a problem can hand it to us directly.

```rust
// crates/pokemon-api/src/middleware/request_id.rs

use axum::http::HeaderName;
use tower_http::request_id::{MakeRequestUuid, PropagateRequestIdLayer, SetRequestIdLayer};

pub const REQUEST_ID_HEADER: &str = "x-request-id";

pub fn set_layer() -> SetRequestIdLayer<MakeRequestUuid> {
    SetRequestIdLayer::new(HeaderName::from_static(REQUEST_ID_HEADER), MakeRequestUuid)
}

pub fn propagate_layer() -> PropagateRequestIdLayer {
    PropagateRequestIdLayer::new(HeaderName::from_static(REQUEST_ID_HEADER))
}
```

`SetRequestIdLayer` generates a UUID for any request that doesn't already carry one (a load balancer or gateway upstream might set it first) and attaches it as a request extension. `PropagateRequestIdLayer` copies that same value onto the outgoing response header, so it travels in both directions.

Wiring both in means being careful about layer order, the same "outside-in on the way in, inside-out on the way back" rule from Middleware. The request ID has to exist before `TraceLayer` builds its span, which means `SetRequestIdLayer` needs to be outside `TraceLayer`, added later in the chain:

```rust
// crates/pokemon-api/src/app.rs

use tower_http::request_id::RequestId;
use tower_http::trace::TraceLayer;
use tracing::info_span;

use crate::middleware::request_id;

pub fn build_app(state: AppState) -> anyhow::Result<Router> {
    let mut router = Router::new().merge(routes::init());

    if state.config.server.enable_docs {
        router = router.merge(SwaggerUi::new("/docs").url("/api-docs/openapi.json", ApiDoc::openapi()));
    }

    Ok(router
        .fallback(not_found)
        .layer(DefaultBodyLimit::max(state.config.server.default_body_limit))
        .layer(middleware::cors::build(&state.config.server)?)
        .layer(
            TraceLayer::new_for_http().make_span_with(|request: &axum::http::Request<_>| {
                let request_id = request
                    .extensions()
                    .get::<RequestId>()
                    .and_then(|id| id.header_value().to_str().ok())
                    .unwrap_or("unknown")
                    .to_string();

                info_span!(
                    "http_request",
                    method = %request.method(),
                    uri = %request.uri(),
                    request_id = %request_id,
                )
            })
            .on_response(
                |response: &axum::http::Response<_>, latency: std::time::Duration, _span: &tracing::Span| {
                    tracing::info!(
                        status = %response.status(),
                        latency_ms = %latency.as_millis(),
                        "response"
                    );
                },
            ),
        )
        .layer(request_id::propagate_layer())
        .layer(request_id::set_layer())
        .with_state(state))
}
```

`request_id::set_layer()` comes last, making it the outermost layer, so it runs before anything else on the way in and assigns the id before `TraceLayer`'s `make_span_with` ever runs. `propagate_layer()` sits just inside it, ready to copy that id onto the response on the way back out. The custom span itself replaces the default Tower HTTP one with exactly three fields: the method, the URI, and now the request id, so `tracing::info!` calls anywhere inside a handler automatically carry all three without repeating them.

`status` and `latency_ms` deliberately aren't span fields the way `method` and `uri` are. `make_span_with` runs the moment a request arrives, before anything about the response exists, there's no status code or duration to put on the span yet. `on_response` runs once the response is ready, so that's where response-shaped data belongs: one line, logged at the end, that already carries `request_id` from the span it's nested inside without repeating it. Request metadata describes what came in; response metadata describes what happened, and `TraceLayer` gives each its own callback rather than forcing both into one.

```rust
// crates/pokemon-api/src/lib.rs

pub mod app;
pub mod config;
pub mod db;
pub mod error;
pub mod middleware;
pub mod openapi;
pub mod routes;
pub mod state;
```

```rust
// crates/pokemon-api/src/middleware/mod.rs

pub mod cors;
pub mod request_id;
```

The last piece is what those log lines actually look like. `tracing_subscriber::fmt::init()` from `main.rs`, all the way back in Project Setup, produces pretty-printed, human-readable lines, which is exactly what you want staring at a terminal during local development and exactly what you don't want feeding a log aggregator that expects to parse structured fields out of each line.

```rust
// crates/pokemon-api/src/main.rs

tracing_subscriber::fmt().json().init();
```

Switching to `.json()` turns every log line, including the `method`, `uri`, and `request_id` fields on each request's span, into a single JSON object. A log aggregator can index `request_id` directly instead of regex-matching it out of a formatted string. The trade is that a JSON log line is unpleasant to stare at directly in a terminal; a real deployment picks the format based on an environment variable rather than hardcoding one, a small, mechanical extension of the same `envconfig`-driven pattern the rest of this series has used throughout.

That's the whole series: we started with an empty workspace and added each layer only when something actually needed it. Configuration gives the application its environment, the server gives it a process, health checks give it an operational contract, middleware handles cross-cutting concerns, the database pool gives it persistence, `AppState` gives requests access to shared dependencies, the repository isolates storage, the service owns domain rules, and handlers translate HTTP into those application operations. From there, OpenAPI made the contract discoverable, consistent error handling made it trustworthy, Docker made it deployable, and request IDs plus structured logs made it debuggable in production instead of just on a laptop. The result is deliberately boring: each layer has one job, dependencies point inward, and every capability we added after the first ten parts slotted into an architecture that was already ready for it.

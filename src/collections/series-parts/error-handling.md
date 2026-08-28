---
title: "Error Handling & API Contracts"
draft: true
date: "2026-08-28"
tags:
  - "rust"
  - "axum"
  - "tutorial"
series: "pokemon-api"
order: 12
description: "Closing the gaps in ApiError so every failure, not just the ones the service produces, returns the same JSON shape."
---

`ApiError` handles every failure the service can produce: not found, bad input, an internal error it logs but doesn't expose. What it doesn't handle is everything that fails before the service is even reached. Send `/v1/pokemon` malformed JSON, or hit a route that doesn't exist, and the response looks nothing like the `{"message": "..."}` shape the rest of the API promises. That's a real gap in the contract, and it's the kind a client only discovers by accident.

`ApiError` becomes an enum to hold both kinds of failure:

```rust
// crates/pokemon-api/src/error.rs

use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use pokemon_service::service::ServiceError;
use serde::Serialize;
use utoipa::ToSchema;

#[derive(Serialize, ToSchema)]
pub struct ErrorBody {
    pub message: String,
}

pub enum ApiError {
    Service(ServiceError),
    BadRequest(String),
    NotFound(String),
}

impl From<ServiceError> for ApiError {
    fn from(err: ServiceError) -> Self {
        Self::Service(err)
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            ApiError::Service(ServiceError::NotFound) => (StatusCode::NOT_FOUND, "not found".to_string()),
            ApiError::Service(ServiceError::Validation(msg)) => (StatusCode::BAD_REQUEST, msg),
            ApiError::Service(ServiceError::Repository(err)) => {
                tracing::error!(error = %err, "repository error");
                (StatusCode::INTERNAL_SERVER_ERROR, "internal error".to_string())
            }
            ApiError::BadRequest(message) => (StatusCode::BAD_REQUEST, message),
            ApiError::NotFound(message) => (StatusCode::NOT_FOUND, message),
        };

        (status, Json(ErrorBody { message })).into_response()
    }
}
```

`ApiError::NotFound` is deliberately separate from `ApiError::Service(ServiceError::NotFound)`, even though both produce `404`. They mean different things: the service's `NotFound` is "this route matched, and the resource it asked for doesn't exist," while the new variant below is "no route matched at all." Same status code, different failure, worth keeping apart rather than reusing one variant for both just because the response looks the same.

`ApiError::BadRequest` is for failures that never reach the service at all: a request Axum couldn't even parse into the handler's arguments. The first place that shows up is JSON extraction. `axum::Json<T>` already rejects malformed bodies, but its rejection is Axum's own type with Axum's own response shape, not ours. A small extractor closes that gap by wrapping `Json` and converting its rejection into `ApiError` before it ever gets a chance to respond on its own:

```rust
// crates/pokemon-api/src/error.rs (continued)

use axum::extract::rejection::JsonRejection;
use axum::extract::{FromRequest, Request};

pub struct ApiJson<T>(pub T);

impl<S, T> FromRequest<S> for ApiJson<T>
where
    axum::Json<T>: FromRequest<S, Rejection = JsonRejection>,
    S: Send + Sync,
{
    type Rejection = ApiError;

    async fn from_request(req: Request, state: &S) -> Result<Self, Self::Rejection> {
        let axum::Json(value) = axum::Json::<T>::from_request(req, state)
            .await
            .map_err(|_| ApiError::BadRequest("invalid JSON request body".into()))?;

        Ok(ApiJson(value))
    }
}
```

The `where` clause is doing the real work: it says "for any `T` where `axum::Json<T>` is itself an extractor that can fail with `JsonRejection`," which is true for anything `Deserialize`. `ApiJson<T>` just borrows `Json`'s extraction logic and swaps out what happens when it fails.

That failure message is a fixed string, not `rejection.to_string()`. Axum's own rejection text is genuinely useful for debugging, but it's Axum's wording, not ours, and it can change on an Axum upgrade we didn't otherwise need to think about as a contract change. An API contract that's supposed to be stable shouldn't have its error text controlled by a dependency's changelog. If distinguishing "not JSON at all" from "wrong shape of JSON" ever matters to callers, that's a reason to match on the specific `JsonRejection` variant and choose our own wording for each, not to forward whatever Axum happened to say.

Swapping the extractor in the handlers that accept a body is a one-line change each:

```rust
// crates/pokemon-api/src/routes/pokemon.rs

use crate::error::{ApiError, ApiJson};

async fn create(
    State(state): State<AppState>,
    ApiJson(req): ApiJson<CreatePokemonRequest>,
) -> Result<(StatusCode, Json<PokemonResponse>), ApiError> {
    let pokemon = state.pokemon_service.create(req.into()).await?;
    Ok((StatusCode::CREATED, Json(pokemon.into())))
}
```

The second gap is routes that don't exist at all. Axum's default for an unmatched route is a bare `404` with an empty body, which is a perfectly fine HTTP response and a broken API contract; every other failure in this API comes back as JSON. A fallback handler closes it:

```rust
// crates/pokemon-api/src/app.rs

async fn not_found() -> ApiError {
    ApiError::NotFound("no route matched this path".into())
}

pub fn build_app(state: AppState) -> anyhow::Result<Router> {
    Ok(Router::new()
        .merge(routes::init())
        .merge(SwaggerUi::new("/docs").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .fallback(not_found)
        .layer(DefaultBodyLimit::max(state.config.server.default_body_limit))
        .layer(middleware::cors::build(&state.config.server)?)
        .layer(TraceLayer::new_for_http())
        .with_state(state))
}
```

The fallback route can't get a `#[utoipa::path]` annotation the way every other handler in this API has: OpenAPI describes known paths, and "anything that didn't match a known path" isn't one. That's a real boundary of the schema from OpenAPI worth naming rather than working around. `ErrorBody` is already registered as a schema, though, so the shape of a `404` from the fallback matches the shape of every other documented error even if no `responses(...)` block can name that route.

The `create` and `get_one` handlers' documented error responses from OpenAPI stay accurate without any changes: `create` still returns `400` with an `ErrorBody` on validation failure, `get_one` still returns `404` with an `ErrorBody` when the resource doesn't exist. What changed here is internal, the enum variant and the exact wording of a JSON-parsing failure, not the externally observable contract those `responses(...)` blocks already promised.

That's the actual contract this part establishes: all application, routing, and JSON-parsing errors now use the same `{"message": "..."}` envelope. It's not every possible failure; a request body larger than `DefaultBodyLimit` allows, for instance, still gets Tower's own rejection rather than ours, since that layer sits outside anything `ApiError` touches. Closing gaps like that one is a judgment call about how much of the stack is worth normalizing, not a property you get for free just by introducing an error enum.

> [!TIP]
> `ErrorBody` is deliberately just a message. A production API often grows past that, something like `{"code": "VALIDATION_ERROR", "message": "height cannot be negative"}`, where `code` is stable and machine-matchable while `message` stays free text for humans. That's a real direction to grow in, not something this series needs to build to make its point.

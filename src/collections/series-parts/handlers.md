---
title: "Handlers"
draft: false
date: "2026-08-31"
tags:
  - "rust"
  - "axum"
  - "docker"
  - "tutorial"
series: "pokemon-api"
order: 10
description: "The last layer: translating HTTP requests into service calls and service errors into status codes."
---

Handlers are deliberately thin. Everything that could go wrong already has a name, `ServiceError::NotFound`, `ServiceError::Validation`, from the last part. A handler's whole job is pulling arguments out of the request, calling the service, and turning whatever comes back into an HTTP response. No business logic lives here.

First, the service needs a home in `AppState` alongside the pool that built it:

```rust
// crates/pokemon-api/src/lib.rs

pub mod app;
pub mod config;
pub mod db;
pub mod error;
pub mod middleware;
pub mod routes;
pub mod state;
```

```rust
// crates/pokemon-api/src/state.rs

use std::sync::Arc;

use pokemon_service::repository::PgPokemonRepository;
use pokemon_service::service::PokemonService;
use sqlx::PgPool;

use crate::config::AppConf;

#[derive(Clone)]
pub struct AppState {
    pub config: AppConf,
    pub db: PgPool,
    pub pokemon_service: Arc<PokemonService<PgPokemonRepository>>,
}
```

`AppState` names the concrete `PokemonService<PgPokemonRepository>` rather than staying generic itself. `PokemonService<R>` can be generic because it's only ever constructed directly; `AppState` gets threaded through Axum's `Router<AppState>`, so it needs to be one concrete type. The service sits behind `Arc` because every request shares the same instance; Axum clones `AppState` per request, and cloning an `Arc` is cheap, a pointer bump, rather than copying the service itself.

`db` stays in `AppState` alongside `pokemon_service` even though the service's repository already holds a clone of the same pool. That's not an accident: `/readyz` needs direct access to the pool for its own health check, while ordinary handlers only ever go through the service. Application logic and infrastructure-level health checks have different reasons to want a database connection, so both get one.

```rust
// crates/pokemon-api/src/main.rs

use pokemon_service::repository::PgPokemonRepository;
use pokemon_service::service::PokemonService;

let pool = db::build_pool(&config.database).await?;

let pokemon_repository = PgPokemonRepository::new(pool.clone());
let pokemon_service = Arc::new(PokemonService::new(pokemon_repository));

let state = AppState {
    config: config.clone(),
    db: pool,
    pokemon_service,
};
```

Next, a single error type that every handler can return, so error handling doesn't get reinvented per route:

```rust
// crates/pokemon-api/src/error.rs

use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use pokemon_service::service::ServiceError;
use serde::Serialize;

#[derive(Serialize)]
struct ErrorBody {
    message: String,
}

pub struct ApiError(ServiceError);

impl From<ServiceError> for ApiError {
    fn from(err: ServiceError) -> Self {
        Self(err)
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, message) = match self.0 {
            ServiceError::NotFound => (StatusCode::NOT_FOUND, self.0.to_string()),
            ServiceError::Validation(_) => (StatusCode::BAD_REQUEST, self.0.to_string()),
            ServiceError::Repository(_) => {
                tracing::error!(error = %self.0, "repository error");
                (StatusCode::INTERNAL_SERVER_ERROR, "internal error".to_string())
            }
        };

        (status, Json(ErrorBody { message })).into_response()
    }
}
```

The repository branch logs the real error but never puts it in the response. Telling a caller their request has a problem is useful; telling them a query against an internal table timed out is an information leak.

With that in place, the handlers themselves are short:

```rust
// crates/pokemon-api/src/routes/pokemon.rs

use axum::extract::{Path, State};
use axum::http::StatusCode;
use axum::routing::get;
use axum::{Json, Router};
use pokemon_service::domain::{Pokemon, PokemonId};
use pokemon_service::repository::CreatePokemon;
use serde::Deserialize;
use uuid::Uuid;

use crate::error::ApiError;
use crate::state::AppState;

#[derive(Deserialize)]
pub struct CreatePokemonRequest {
    pub name: String,
    pub base_experience: Option<i64>,
    pub height: i64,
    pub is_default: bool,
    pub order: i64,
    pub weight: i64,
}

impl From<CreatePokemonRequest> for CreatePokemon {
    fn from(req: CreatePokemonRequest) -> Self {
        CreatePokemon {
            name: req.name,
            base_experience: req.base_experience,
            height: req.height,
            is_default: req.is_default,
            order: req.order,
            weight: req.weight,
        }
    }
}

pub fn init() -> Router<AppState> {
    Router::new()
        .route("/v1/pokemon", get(list).post(create))
        .route("/v1/pokemon/{pokemon_id}", get(get_one).delete(remove))
}

async fn list(State(state): State<AppState>) -> Result<Json<Vec<Pokemon>>, ApiError> {
    let pokemon = state.pokemon_service.list().await?;
    Ok(Json(pokemon))
}

async fn get_one(
    State(state): State<AppState>,
    Path(pokemon_id): Path<Uuid>,
) -> Result<Json<Pokemon>, ApiError> {
    let pokemon = state.pokemon_service.get(PokemonId(pokemon_id)).await?;
    Ok(Json(pokemon))
}

async fn create(
    State(state): State<AppState>,
    Json(req): Json<CreatePokemonRequest>,
) -> Result<Json<Pokemon>, ApiError> {
    let pokemon = state.pokemon_service.create(req.into()).await?;
    Ok(Json(pokemon))
}

async fn remove(
    State(state): State<AppState>,
    Path(pokemon_id): Path<Uuid>,
) -> Result<StatusCode, ApiError> {
    state.pokemon_service.delete(PokemonId(pokemon_id)).await?;
    Ok(StatusCode::NO_CONTENT)
}
```

`ApiError` implements `From<ServiceError>`, so `?` inside each handler automatically converts a service error into the HTTP-facing error type. `routes/mod.rs` picks it up alongside health:

```rust
// crates/pokemon-api/src/routes/mod.rs
use axum::Router;

use crate::state::AppState;

mod health;
mod pokemon;

pub fn init() -> Router<AppState> {
    Router::new().merge(health::init()).merge(pokemon::init())
}
```

`app.rs` doesn't change at all, it was already asking `routes::init()` for whatever routes exist, so a whole new resource shows up there without touching that file.

Every Ability and nested `/v1/pokemon/{pokemon_id}/abilities` endpoint from the overview's table follows this same path: a repository method, a service method that validates, a handler that extracts and responds. There's no new pattern to learn for any of them, which is really the point of building the layers in this order. By the time you reach the handlers, the interesting decisions are already made, and wiring up the rest of the API is repetition, not discovery.

### Aside: what update would look like

We skipped `PUT /v1/pokemon/{pokemon_id}` in the repository and service parts to keep the code manageable, but it's worth sketching, since "update" touches all three layers in a way "delete" doesn't. Nothing here is new: it's the same three-step shape as `create`, just with an id to look up first.

```rust
// crates/pokemon-service/src/repository.rs, added to the PokemonRepository trait
async fn update(&self, id: PokemonId, input: CreatePokemon) -> Result<Pokemon, RepositoryError>;

// ...and to the Postgres impl
async fn update(&self, id: PokemonId, input: CreatePokemon) -> Result<Pokemon, RepositoryError> {
    let row = sqlx::query_as::<_, PokemonRow>(
        r#"
        UPDATE pokemon
        SET name = $2, base_experience = $3, height = $4, is_default = $5, "order" = $6, weight = $7
        WHERE id = $1
        RETURNING id, name, base_experience, height, is_default, "order", weight
        "#,
    )
    .bind(id.0)
    .bind(&input.name)
    .bind(input.base_experience)
    .bind(input.height)
    .bind(input.is_default)
    .bind(input.order)
    .bind(input.weight)
    .fetch_optional(&self.pool)
    .await?
    .ok_or(RepositoryError::NotFound)?;

    // Like create, this isn't touching pokemon_abilities.
    Ok(build_pokemon(row, Vec::new()))
}
```

```rust
// crates/pokemon-service/src/service.rs, on PokemonService
pub async fn update(&self, id: PokemonId, changes: CreatePokemon) -> Result<Pokemon, ServiceError> {
    if changes.name.trim().is_empty() {
        return Err(ServiceError::Validation("name cannot be empty".into()));
    }

    if changes.height < 0 || changes.weight < 0 {
        return Err(ServiceError::Validation(
            "height and weight cannot be negative".into(),
        ));
    }

    Ok(self.repository.update(id, changes).await?)
}
```

```rust
// crates/pokemon-api/src/routes/pokemon.rs
pub fn init() -> Router<AppState> {
    Router::new()
        .route("/v1/pokemon", get(list).post(create))
        .route(
            "/v1/pokemon/{pokemon_id}",
            get(get_one).put(update).delete(remove),
        )
}

async fn update(
    State(state): State<AppState>,
    Path(pokemon_id): Path<Uuid>,
    Json(req): Json<CreatePokemonRequest>,
) -> Result<Json<Pokemon>, ApiError> {
    let pokemon = state
        .pokemon_service
        .update(PokemonId(pokemon_id), req.into())
        .await?;
    Ok(Json(pokemon))
}
```

Reusing `CreatePokemonRequest` and `CreatePokemon` for the update body is a shortcut. A real API might use a separate `UpdatePokemonRequest`; a client wanting partial updates would typically get that through `PATCH` with optional fields, while `PUT` stays a full replacement of the resource like the one here. Either way, the wiring, extract the id and body, validate, delegate to the repository, is identical to everything else in this part.

## Testing through the router

Back in Setting Up the Server, `build_app` stayed separate from `main` so tests could construct the application without binding a real socket. This is that payoff: a test that sends an actual HTTP request through the actual `Router`, CORS layer and all, without a running process anywhere.

```rust
// crates/pokemon-api/src/routes/pokemon.rs (continued)

#[cfg(test)]
mod tests {
    use std::sync::Arc;

    use axum::body::Body;
    use axum::http::{Request, StatusCode};
    use pokemon_service::repository::PgPokemonRepository;
    use pokemon_service::service::PokemonService;
    use sqlx::PgPool;
    use tower::ServiceExt;

    use crate::config::{AppConf, DatabaseConf, ServerConf};
    use crate::state::AppState;

    fn test_config() -> AppConf {
        AppConf {
            server: ServerConf {
                port: 0,
                allowed_origins: "http://localhost:3000".into(),
                allowed_methods: "GET,POST,PUT,DELETE,OPTIONS".into(),
                allowed_headers: "Content-Type".into(),
                default_body_limit: 1_048_576,
            },
            database: DatabaseConf {
                url: String::new(),
                max_connections: 5,
            },
        }
    }

    #[sqlx::test]
    async fn create_then_get_pokemon(pool: PgPool) {
        let pokemon_service = Arc::new(PokemonService::new(PgPokemonRepository::new(pool.clone())));
        let state = AppState {
            config: test_config(),
            db: pool,
            pokemon_service,
        };
        let app = crate::app::build_app(state).unwrap();

        let response = app
            .clone()
            .oneshot(
                Request::builder()
                    .method("POST")
                    .uri("/v1/pokemon")
                    .header("content-type", "application/json")
                    .body(Body::from(
                        r#"{"name":"Pikachu","base_experience":112,"height":4,"is_default":true,"order":35,"weight":60}"#,
                    ))
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
    }
}
```

`tower::ServiceExt::oneshot` sends one request into the `Router` and hands back the response, no `TcpListener`, no `axum::serve`, no port to collide with another test running in parallel. `#[sqlx::test]` doesn't need an explicit `migrations` path here the way the repository tests in the last part did; this file already lives in `pokemon-api`, so the macro's default, relative to this crate, finds `crates/pokemon-api/migrations/` on its own. `test_config` exists because `AppConf` has no `Default`, building it by hand is the price of a config type that came entirely from the environment until now.

That's a complete, working API: configuration gives the application its environment, the server gives it a process, health checks give it an operational contract, middleware handles cross-cutting concerns, the database pool gives it persistence, `AppState` gives requests access to shared dependencies, the repository isolates storage, the service owns domain rules, and handlers translate HTTP into those application operations. Each layer has one job, dependencies point inward, and adding another resource follows the same pattern rather than requiring a new architecture.

It's also not finished. Nothing describes this API to a consumer who hasn't read the source, a malformed request doesn't get the same error shape a valid one's failures do, and there's no container to actually ship. The remaining parts close those gaps.

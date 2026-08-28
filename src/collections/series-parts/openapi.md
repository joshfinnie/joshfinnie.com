---
title: "OpenAPI"
draft: true
date: "2026-08-28"
tags:
  - "rust"
  - "axum"
  - "openapi"
  - "tutorial"
series: "pokemon-api"
order: 11
description: "Generating an OpenAPI schema and interactive docs from the handlers we already wrote, with utoipa."
---

The API works. Nobody outside this codebase knows what it does, though, unless they read the handler source or ask us directly. An OpenAPI schema fixes that: a machine-readable description of every route, request body, and response shape, which is also what generates the interactive docs most API consumers actually reach for first.

We use [utoipa](https://docs.rs/utoipa) to generate that schema from annotations on the code we already have, rather than hand-writing a `.yaml` file that drifts out of sync with the handlers the moment someone changes a field.

```toml
# crates/pokemon-api/Cargo.toml
[dependencies]
utoipa = { version = "5", features = ["axum_extras", "uuid"] }
utoipa-swagger-ui = { version = "8", features = ["axum"] }
```

Only `pokemon-api` takes this dependency on. `pokemon_service`'s `Pokemon`, `Ability`, and their ids stay exactly as the Repository part left them: `Debug`, `Clone`, `Serialize`, `Deserialize`, nothing about HTTP or documentation. An OpenAPI schema is a description of what the API returns over HTTP, and that's an API-presentation concern, not a domain one, even though `utoipa::ToSchema` itself isn't tied to any particular web framework. Response types that mirror the domain live in `pokemon-api` instead:

```rust
// crates/pokemon-api/src/routes/pokemon.rs

use pokemon_service::domain::{Pokemon, PokemonAbility};
use utoipa::ToSchema;
use uuid::Uuid;

#[derive(Serialize, ToSchema)]
pub struct PokemonResponse {
    pub id: Uuid,
    pub name: String,
    pub base_experience: Option<i64>,
    pub height: i64,
    pub is_default: bool,
    pub order: i64,
    pub weight: i64,
    pub abilities: Vec<PokemonAbilityResponse>,
}

#[derive(Serialize, ToSchema)]
pub struct PokemonAbilityResponse {
    pub pokemon_id: Uuid,
    pub ability_id: Uuid,
    pub is_hidden: bool,
    pub slot: i64,
}

impl From<Pokemon> for PokemonResponse {
    fn from(pokemon: Pokemon) -> Self {
        PokemonResponse {
            id: pokemon.id.0,
            name: pokemon.name,
            base_experience: pokemon.base_experience,
            height: pokemon.height,
            is_default: pokemon.is_default,
            order: pokemon.order,
            weight: pokemon.weight,
            abilities: pokemon.abilities.into_iter().map(PokemonAbilityResponse::from).collect(),
        }
    }
}

impl From<PokemonAbility> for PokemonAbilityResponse {
    fn from(ability: PokemonAbility) -> Self {
        PokemonAbilityResponse {
            pokemon_id: ability.pokemon_id.0,
            ability_id: ability.ability_id.0,
            is_hidden: ability.is_hidden,
            slot: ability.slot,
        }
    }
}
```

`PokemonResponse` looks almost identical to `Pokemon`, and that repetition is the cost of the boundary. It's a cost worth paying here: if the domain type ever grows a field the API shouldn't expose, or the wire format needs to diverge from the storage shape, `PokemonResponse` is the one place that changes. The `From<Pokemon>` impl is what keeps the duplication from becoming two things that quietly drift apart.

`CreatePokemonRequest` gets the same treatment, `ToSchema` alongside the `Deserialize` it already has:

```rust
// crates/pokemon-api/src/routes/pokemon.rs

use utoipa::ToSchema;

#[derive(Deserialize, ToSchema)]
pub struct CreatePokemonRequest {
    pub name: String,
    pub base_experience: Option<i64>,
    pub height: i64,
    pub is_default: bool,
    pub order: i64,
    pub weight: i64,
}
```

Those two derives are doing two different jobs on the same struct: `Deserialize` is what lets Axum's `Json` extractor turn a request body into a `CreatePokemonRequest` at runtime, and `ToSchema` is what lets utoipa describe that same shape as JSON Schema in the generated spec. One struct, one source of truth, two audiences: the running server and whoever reads the docs.

`ErrorBody` needs the same treatment, since every error response uses it:

```rust
// crates/pokemon-api/src/error.rs

use utoipa::ToSchema;

#[derive(Serialize, ToSchema)]
pub struct ErrorBody {
    pub message: String,
}
```

Each handler gets a `#[utoipa::path]` attribute describing what it does, on top of what it already does. The response types are the ones we just defined, and every documented failure names `ErrorBody` as its body instead of leaving it to guesswork:

```rust
// crates/pokemon-api/src/routes/pokemon.rs (continued)

use utoipa::path;

use crate::error::ErrorBody;

#[utoipa::path(
    get,
    path = "/v1/pokemon",
    responses((status = 200, description = "List all Pokemon", body = Vec<PokemonResponse>))
)]
async fn list(State(state): State<AppState>) -> Result<Json<Vec<PokemonResponse>>, ApiError> {
    let pokemon = state.pokemon_service.list().await?;
    Ok(Json(pokemon.into_iter().map(PokemonResponse::from).collect()))
}

#[utoipa::path(
    get,
    path = "/v1/pokemon/{pokemon_id}",
    params(("pokemon_id" = Uuid, Path, description = "The Pokemon's id")),
    responses(
        (status = 200, description = "The Pokemon", body = PokemonResponse),
        (status = 404, description = "No Pokemon with that id", body = ErrorBody),
    )
)]
async fn get_one(
    State(state): State<AppState>,
    Path(pokemon_id): Path<Uuid>,
) -> Result<Json<PokemonResponse>, ApiError> {
    let pokemon = state.pokemon_service.get(PokemonId(pokemon_id)).await?;
    Ok(Json(pokemon.into()))
}

#[utoipa::path(
    post,
    path = "/v1/pokemon",
    request_body = CreatePokemonRequest,
    responses(
        (status = 201, description = "The created Pokemon", body = PokemonResponse),
        (status = 400, description = "Validation failed", body = ErrorBody),
    )
)]
async fn create(
    State(state): State<AppState>,
    Json(req): Json<CreatePokemonRequest>,
) -> Result<(StatusCode, Json<PokemonResponse>), ApiError> {
    let pokemon = state.pokemon_service.create(req.into()).await?;
    Ok((StatusCode::CREATED, Json(pokemon.into())))
}

#[utoipa::path(
    delete,
    path = "/v1/pokemon/{pokemon_id}",
    params(("pokemon_id" = Uuid, Path, description = "The Pokemon's id")),
    responses(
        (status = 204, description = "Deleted"),
        (status = 404, description = "No Pokemon with that id", body = ErrorBody),
    )
)]
async fn remove(
    State(state): State<AppState>,
    Path(pokemon_id): Path<Uuid>,
) -> Result<StatusCode, ApiError> {
    state.pokemon_service.delete(PokemonId(pokemon_id)).await?;
    Ok(StatusCode::NO_CONTENT)
}
```

`create` changed to actually return `201 Created` instead of `200 OK`. That was worth fixing here rather than carrying forward: the point of writing the schema down is that it describes the real contract, not whatever the handler happened to do before anyone looked closely. A created resource getting `201` is the correct HTTP semantics regardless of OpenAPI; documenting it is just what caught the mismatch.

The health routes are public API surface too, even though they don't return anything about Pokemon:

```rust
// crates/pokemon-api/src/routes/health.rs (continued)

#[utoipa::path(get, path = "/healthz", responses((status = 200, description = "The process is alive")))]
async fn health() -> StatusCode {
    StatusCode::OK
}

#[utoipa::path(
    get,
    path = "/readyz",
    responses(
        (status = 200, description = "The database is reachable"),
        (status = 503, description = "The database is not reachable"),
    )
)]
async fn ready(State(state): State<AppState>) -> StatusCode {
    match sqlx::query("SELECT 1").execute(&state.db).await {
        Ok(_) => StatusCode::OK,
        Err(_) => StatusCode::SERVICE_UNAVAILABLE,
    }
}
```

Those `#[utoipa::path]` annotations need somewhere to collect into an actual schema:

```rust
// crates/pokemon-api/src/openapi.rs

use utoipa::OpenApi;

use crate::error::ErrorBody;
use crate::routes::pokemon::{CreatePokemonRequest, PokemonAbilityResponse, PokemonResponse};

#[derive(OpenApi)]
#[openapi(
    paths(
        crate::routes::health::health,
        crate::routes::health::ready,
        crate::routes::pokemon::list,
        crate::routes::pokemon::get_one,
        crate::routes::pokemon::create,
        crate::routes::pokemon::remove,
    ),
    components(schemas(
        PokemonResponse,
        PokemonAbilityResponse,
        CreatePokemonRequest,
        ErrorBody,
    ))
)]
pub struct ApiDoc;
```

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

Last, mount it. `utoipa-swagger-ui` serves the interactive docs and the raw JSON schema from the `OpenApi` struct we just built:

```rust
// crates/pokemon-api/src/app.rs

use utoipa_swagger_ui::SwaggerUi;

use crate::openapi::ApiDoc;

pub fn build_app(state: AppState) -> anyhow::Result<Router> {
    Ok(Router::new()
        .merge(routes::init())
        .merge(SwaggerUi::new("/docs").url("/api-docs/openapi.json", ApiDoc::openapi()))
        .layer(DefaultBodyLimit::max(state.config.server.default_body_limit))
        .layer(middleware::cors::build(&state.config.server)?)
        .layer(TraceLayer::new_for_http())
        .with_state(state))
}
```

```bash
$ make run
```

```bash
$ curl -s http://localhost:8080/api-docs/openapi.json | jq .
```

Visiting `http://localhost:8080/docs` in a browser gets an interactive page listing every documented route, with a "try it out" button that sends real requests against the running server. Every route we add from here that doesn't get a `#[utoipa::path]` attribute simply won't show up there, silently, so a route missing from `/docs` is worth treating as a route that isn't finished yet.

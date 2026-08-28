---
title: "Database Connection Pooling"
draft: true
date: "2026-08-28"
tags:
  - "rust"
  - "axum"
  - "postgresql"
  - "docker"
  - "tutorial"
series: "pokemon-api"
order: 6
description: "Adding a PostgreSQL connection pool with sqlx, config-driven like everything else, and running migrations on startup."
---

A connection pool, not a single connection, is what a request handler actually reaches for. Opening a fresh Postgres connection per request is slow and doesn't scale past a handful of concurrent users, so we build one pool at startup and share it across every request instead.

[sqlx](https://docs.rs/sqlx) gives us the connection pool and async database access, with optional compile-time verification for SQL queries. We add its config the same way we added the server's, as a nested struct on `AppConf`.

```rust
// crates/pokemon-api/src/config.rs

#[derive(Clone, Envconfig)]
pub struct AppConf {
    #[envconfig(nested)]
    pub server: ServerConf,

    #[envconfig(nested)]
    pub database: DatabaseConf,
}

#[derive(Clone, Envconfig)]
pub struct DatabaseConf {
    #[envconfig(from = "DATABASE_URL")]
    pub url: String,

    #[envconfig(from = "DATABASE_MAX_CONNECTIONS", default = "10")]
    pub max_connections: u32,
}
```

```dotenv
# .env.local
DATABASE_URL=postgres://pokemon:pokemon@localhost:5432/pokemon
DATABASE_MAX_CONNECTIONS=10
```

The pool itself gets its own module, so `main.rs` stays a straight line of "load config, build pool, build app, serve" rather than accumulating connection details inline. It lives in `pokemon-api`, not `pokemon_service`, even though `pokemon_service` is where the repositories that use the pool end up. Building a `PgPool` is application startup, an infrastructure concern owned by the binary crate, not domain logic. `pokemon_service`'s repositories take a `PgPool` as an argument later; they don't need to know how one gets constructed.

```rust
// crates/pokemon-api/src/db.rs

use sqlx::postgres::{PgPool, PgPoolOptions};

use crate::config::DatabaseConf;

pub async fn build_pool(conf: &DatabaseConf) -> anyhow::Result<PgPool> {
    let pool = PgPoolOptions::new()
        .max_connections(conf.max_connections)
        .connect(&conf.url)
        .await?;

    sqlx::migrate!("./migrations").run(&pool).await?;

    Ok(pool)
}
```

Running migrations here means the schema is always current the moment the pool is ready, which matters for a container that might start from a fresh database. `sqlx migrate add <name>` generates the migration file this reads from.

`sqlx::migrate!("./migrations")` resolves that path relative to the crate that contains the macro invocation, not the workspace root, so it matters where the directory actually lives. Since `db.rs` is in `pokemon-api`, the migrations live there too:

```text
crates/pokemon-api/
├── migrations/
│   └── 0001_create_pokemon.sql
└── src/
    └── db.rs
```

The tables match the domain types from the overview directly: `pokemon`, `abilities`, and `pokemon_abilities` as the join table carrying `is_hidden` and `slot`.

```sql
-- crates/pokemon-api/migrations/0001_create_pokemon.sql

CREATE TABLE abilities (
    id   UUID PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE pokemon (
    id              UUID PRIMARY KEY,
    name            TEXT NOT NULL,
    base_experience BIGINT,
    height          BIGINT NOT NULL,
    is_default      BOOLEAN NOT NULL,
    "order"         BIGINT NOT NULL,
    weight          BIGINT NOT NULL
);

CREATE TABLE pokemon_abilities (
    pokemon_id UUID NOT NULL REFERENCES pokemon(id) ON DELETE CASCADE,
    ability_id UUID NOT NULL REFERENCES abilities(id) ON DELETE CASCADE,
    is_hidden  BOOLEAN NOT NULL,
    slot       BIGINT NOT NULL,
    PRIMARY KEY (pokemon_id, ability_id)
);
```

`base_experience` is the only nullable column, matching `Option<i64>` on the `Pokemon` domain type; everything else is `NOT NULL` because the domain type has no `Option` to represent its absence. The foreign keys `ON DELETE CASCADE` so deleting a Pokemon or an Ability cleans up its `pokemon_abilities` rows instead of leaving orphaned links behind.

```rust
// crates/pokemon-api/src/main.rs

let config = AppConf::init()?;
let addr = config.server.addr();

let pool = db::build_pool(&config.database).await?;

let listener = TcpListener::bind(addr).await?;

tracing::info!(%addr, "Listening");

let app = build_app(&config)?;
```

Notice the order: `main` builds the pool and runs its migrations before the listener binds. If database initialization fails, the process exits without ever advertising a listening socket, so nothing can route traffic to a server that isn't actually ready to serve it.

The pool exists now, but nothing uses it yet. `build_app` still only knows about `AppConf`. Sharing the pool with handlers is what `AppState` is for, next.

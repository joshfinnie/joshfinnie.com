---
title: "The Repository Layer"
draft: false
date: "2026-08-31"
tags:
  - "rust"
  - "axum"
  - "postgresql"
  - "docker"
  - "tutorial"
series: "pokemon-api"
order: 8
description: "A trait-based repository in the pokemon_service crate, so the code that talks to Postgres never has to know it's serving HTTP."
---

This is the first part that touches `pokemon_service`, the library crate we created back in Project Setup but haven't used yet. The repository's job is to translate between persistence and the domain: it knows how to read and write Pokemon data in Postgres, but it doesn't know anything about HTTP or application-level business rules. It doesn't know what an `axum::Router` is, and that's the point: a repository that can't see HTTP is a repository you can unit test against a real database without spinning up a server.

We define it as a trait first, not because we're planning multiple implementations today, but because a trait is what lets the service layer in the next part depend on "something that can fetch a Pokemon" instead of "Postgres specifically," which is what makes that layer testable with a fake.

```rust
// crates/pokemon-service/src/lib.rs

pub mod domain;
pub mod repository;
```

```rust
// crates/pokemon-service/src/domain.rs

use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct PokemonId(pub Uuid);

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Pokemon {
    pub id: PokemonId,
    pub name: String,
    pub base_experience: Option<i64>,
    pub height: i64,
    pub is_default: bool,
    pub order: i64,
    pub weight: i64,
    pub abilities: Vec<PokemonAbility>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct PokemonAbility {
    pub pokemon_id: PokemonId,
    pub ability_id: AbilityId,
    pub is_hidden: bool,
    pub slot: i64,
}

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
pub struct AbilityId(pub Uuid);

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Ability {
    pub id: AbilityId,
    pub name: String,
}
```

Notice `PokemonId` and `AbilityId` don't derive anything from `sqlx`. The domain layer shouldn't know Postgres exists, so it doesn't get a shortcut for binding directly into a query; the repository below binds the `Uuid` each one wraps explicitly instead. It's a little more typing in exchange for `pokemon_service`'s domain types depending on nothing but `serde` and `uuid`.

```rust
// crates/pokemon-service/src/repository.rs

use std::collections::HashMap;

use sqlx::PgPool;
use uuid::Uuid;

use crate::domain::{Ability, AbilityId, Pokemon, PokemonAbility, PokemonId};

#[derive(Debug, thiserror::Error)]
pub enum RepositoryError {
    #[error("not found")]
    NotFound,
    #[error(transparent)]
    Database(#[from] sqlx::Error),
}

pub struct CreatePokemon {
    pub name: String,
    pub base_experience: Option<i64>,
    pub height: i64,
    pub is_default: bool,
    pub order: i64,
    pub weight: i64,
}

pub trait PokemonRepository: Send + Sync {
    async fn list(&self) -> Result<Vec<Pokemon>, RepositoryError>;
    async fn get(&self, id: PokemonId) -> Result<Pokemon, RepositoryError>;
    async fn create(&self, input: CreatePokemon) -> Result<Pokemon, RepositoryError>;
    async fn delete(&self, id: PokemonId) -> Result<(), RepositoryError>;
}
```

Two things changed from a first draft you might reach for. `create` takes a `CreatePokemon`, not a `Pokemon`, because the caller doesn't have a complete Pokemon yet, an id doesn't exist until the row does. And this trait doesn't need `async_trait` anymore; native `async fn` in traits is stable, and we don't need `dyn PokemonRepository` anywhere, so there's no trait-object-safety problem to work around.

```rust
// crates/pokemon-service/src/repository.rs (continued)

pub struct PgPokemonRepository {
    pool: PgPool,
}

impl PgPokemonRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[derive(sqlx::FromRow)]
struct PokemonRow {
    id: Uuid,
    name: String,
    base_experience: Option<i64>,
    height: i64,
    is_default: bool,
    order: i64,
    weight: i64,
}

#[derive(sqlx::FromRow)]
struct PokemonAbilityRow {
    pokemon_id: Uuid,
    ability_id: Uuid,
    is_hidden: bool,
    slot: i64,
}

impl From<PokemonAbilityRow> for PokemonAbility {
    fn from(row: PokemonAbilityRow) -> Self {
        PokemonAbility {
            pokemon_id: PokemonId(row.pokemon_id),
            ability_id: AbilityId(row.ability_id),
            is_hidden: row.is_hidden,
            slot: row.slot,
        }
    }
}

fn build_pokemon(row: PokemonRow, abilities: Vec<PokemonAbility>) -> Pokemon {
    Pokemon {
        id: PokemonId(row.id),
        name: row.name,
        base_experience: row.base_experience,
        height: row.height,
        is_default: row.is_default,
        order: row.order,
        weight: row.weight,
        abilities,
    }
}
```

`PokemonRow` and `PokemonAbilityRow` are separate from `Pokemon` and `PokemonAbility` on purpose. `Pokemon` is a complete aggregate, a Pokemon and its abilities together, but a single Postgres row can only ever be one or the other. `build_pokemon` is where the two get combined, so `get` and `list` never hand back a `Pokemon` with an `abilities` field nobody bothered to fill in.

```rust
impl PokemonRepository for PgPokemonRepository {
    async fn list(&self) -> Result<Vec<Pokemon>, RepositoryError> {
        let rows = sqlx::query_as::<_, PokemonRow>(
            r#"
            SELECT id, name, base_experience, height, is_default, "order", weight
            FROM pokemon
            ORDER BY "order"
            "#,
        )
        .fetch_all(&self.pool)
        .await?;

        let ability_rows = sqlx::query_as::<_, PokemonAbilityRow>(
            "SELECT pokemon_id, ability_id, is_hidden, slot FROM pokemon_abilities",
        )
        .fetch_all(&self.pool)
        .await?;

        let mut abilities_by_pokemon: HashMap<Uuid, Vec<PokemonAbility>> = HashMap::new();
        for row in ability_rows {
            abilities_by_pokemon
                .entry(row.pokemon_id)
                .or_default()
                .push(row.into());
        }

        Ok(rows
            .into_iter()
            .map(|row| {
                let abilities = abilities_by_pokemon.remove(&row.id).unwrap_or_default();
                build_pokemon(row, abilities)
            })
            .collect())
    }

    async fn get(&self, id: PokemonId) -> Result<Pokemon, RepositoryError> {
        let row = sqlx::query_as::<_, PokemonRow>(
            r#"
            SELECT id, name, base_experience, height, is_default, "order", weight
            FROM pokemon
            WHERE id = $1
            "#,
        )
        .bind(id.0)
        .fetch_optional(&self.pool)
        .await?
        .ok_or(RepositoryError::NotFound)?;

        let ability_rows = sqlx::query_as::<_, PokemonAbilityRow>(
            "SELECT pokemon_id, ability_id, is_hidden, slot FROM pokemon_abilities WHERE pokemon_id = $1",
        )
        .bind(id.0)
        .fetch_all(&self.pool)
        .await?;

        let abilities = ability_rows.into_iter().map(PokemonAbility::from).collect();

        Ok(build_pokemon(row, abilities))
    }

    async fn create(&self, input: CreatePokemon) -> Result<Pokemon, RepositoryError> {
        let id = Uuid::new_v4();

        let row = sqlx::query_as::<_, PokemonRow>(
            r#"
            INSERT INTO pokemon (id, name, base_experience, height, is_default, "order", weight)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, name, base_experience, height, is_default, "order", weight
            "#,
        )
        .bind(id)
        .bind(&input.name)
        .bind(input.base_experience)
        .bind(input.height)
        .bind(input.is_default)
        .bind(input.order)
        .bind(input.weight)
        .fetch_one(&self.pool)
        .await?;

        // A freshly created Pokemon has no abilities assigned yet, so an
        // empty Vec here is accurate, not a shortcut.
        Ok(build_pokemon(row, Vec::new()))
    }

    async fn delete(&self, id: PokemonId) -> Result<(), RepositoryError> {
        let result = sqlx::query("DELETE FROM pokemon WHERE id = $1")
            .bind(id.0)
            .execute(&self.pool)
            .await?;

        if result.rows_affected() == 0 {
            return Err(RepositoryError::NotFound);
        }

        Ok(())
    }
}
```

`list` and `get` both select explicit columns rather than `SELECT *`. That's a deliberate contract with the schema: if a column gets added to the `pokemon` table later, these queries keep returning exactly what `PokemonRow` expects instead of silently picking up a new field that has nowhere to go.

`create` generates the id itself with `Uuid::new_v4()` rather than accepting one. Since `CreatePokemon` has no `id` field, there's nowhere else for it to come from; the repository is the layer that actually knows how a Pokemon gets persisted; assigning its identity is part of that.

> [!TIP]
> We used runtime `query_as` here instead of the compile-time-checked `query_as!` macro, which trades away a little safety for not needing a live database reachable at `cargo build` time. That's a reasonable default for a tutorial; on a real project with a CI database available, `query_as!` catches typos in column names before the code ever runs.

`AbilityRepository` gets the same treatment, including the endpoint from the overview that lists every Pokemon with a given ability, since that's a real part of this API's design, not just a hypothetical extension.

```rust
// crates/pokemon-service/src/repository.rs (continued)

pub struct CreateAbility {
    pub name: String,
}

pub trait AbilityRepository: Send + Sync {
    async fn list(&self) -> Result<Vec<Ability>, RepositoryError>;
    async fn get(&self, id: AbilityId) -> Result<Ability, RepositoryError>;
    async fn create(&self, input: CreateAbility) -> Result<Ability, RepositoryError>;
    async fn delete(&self, id: AbilityId) -> Result<(), RepositoryError>;
    async fn pokemon(&self, id: AbilityId) -> Result<Vec<Pokemon>, RepositoryError>;
}

pub struct PgAbilityRepository {
    pool: PgPool,
}

impl PgAbilityRepository {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }
}

#[derive(sqlx::FromRow)]
struct AbilityRow {
    id: Uuid,
    name: String,
}

impl From<AbilityRow> for Ability {
    fn from(row: AbilityRow) -> Self {
        Ability {
            id: AbilityId(row.id),
            name: row.name,
        }
    }
}

impl AbilityRepository for PgAbilityRepository {
    async fn list(&self) -> Result<Vec<Ability>, RepositoryError> {
        let rows = sqlx::query_as::<_, AbilityRow>("SELECT id, name FROM abilities")
            .fetch_all(&self.pool)
            .await?;

        Ok(rows.into_iter().map(Ability::from).collect())
    }

    async fn get(&self, id: AbilityId) -> Result<Ability, RepositoryError> {
        let row = sqlx::query_as::<_, AbilityRow>("SELECT id, name FROM abilities WHERE id = $1")
            .bind(id.0)
            .fetch_optional(&self.pool)
            .await?
            .ok_or(RepositoryError::NotFound)?;

        Ok(row.into())
    }

    async fn create(&self, input: CreateAbility) -> Result<Ability, RepositoryError> {
        let id = Uuid::new_v4();

        let row = sqlx::query_as::<_, AbilityRow>(
            "INSERT INTO abilities (id, name) VALUES ($1, $2) RETURNING id, name",
        )
        .bind(id)
        .bind(&input.name)
        .fetch_one(&self.pool)
        .await?;

        Ok(row.into())
    }

    async fn delete(&self, id: AbilityId) -> Result<(), RepositoryError> {
        let result = sqlx::query("DELETE FROM abilities WHERE id = $1")
            .bind(id.0)
            .execute(&self.pool)
            .await?;

        if result.rows_affected() == 0 {
            return Err(RepositoryError::NotFound);
        }

        Ok(())
    }

    async fn pokemon(&self, id: AbilityId) -> Result<Vec<Pokemon>, RepositoryError> {
        let rows = sqlx::query_as::<_, PokemonRow>(
            r#"
            SELECT p.id, p.name, p.base_experience, p.height, p.is_default, p."order", p.weight
            FROM pokemon p
            INNER JOIN pokemon_abilities pa ON pa.pokemon_id = p.id
            WHERE pa.ability_id = $1
            ORDER BY p."order"
            "#,
        )
        .bind(id.0)
        .fetch_all(&self.pool)
        .await?;

        // Each Pokemon here is already known to have this ability, that's
        // the query; we're not also loading the rest of its abilities for
        // this particular view.
        Ok(rows.into_iter().map(|row| build_pokemon(row, Vec::new())).collect())
    }
}
```

## Testing against a real database

The service layer's tests in a later part run against an in-memory fake and never touch Postgres. That's the right call for validation rules, but it can't catch a typo in a column name or a query that doesn't do what the SQL looks like it does. For that, `PgPokemonRepository` needs tests that run against a real database.

```rust
// crates/pokemon-service/src/repository.rs (continued)

#[cfg(test)]
mod tests {
    use sqlx::PgPool;
    use uuid::Uuid;

    use super::*;

    #[sqlx::test(migrations = "../pokemon-api/migrations")]
    async fn create_then_get_round_trips(pool: PgPool) {
        let repo = PgPokemonRepository::new(pool);

        let created = repo
            .create(CreatePokemon {
                name: "Charmander".into(),
                base_experience: Some(62),
                height: 6,
                is_default: true,
                order: 4,
                weight: 85,
            })
            .await
            .unwrap();

        let fetched = repo.get(created.id).await.unwrap();

        assert_eq!(fetched.name, "Charmander");
        assert!(fetched.abilities.is_empty());
    }

    #[sqlx::test(migrations = "../pokemon-api/migrations")]
    async fn get_missing_pokemon_is_not_found(pool: PgPool) {
        let repo = PgPokemonRepository::new(pool);

        let result = repo.get(PokemonId(Uuid::new_v4())).await;

        assert!(matches!(result, Err(RepositoryError::NotFound)));
    }

    #[sqlx::test(migrations = "../pokemon-api/migrations")]
    async fn delete_removes_the_row(pool: PgPool) {
        let repo = PgPokemonRepository::new(pool);

        let created = repo
            .create(CreatePokemon {
                name: "Squirtle".into(),
                base_experience: Some(63),
                height: 5,
                is_default: true,
                order: 7,
                weight: 90,
            })
            .await
            .unwrap();

        repo.delete(created.id).await.unwrap();

        let result = repo.get(created.id).await;
        assert!(matches!(result, Err(RepositoryError::NotFound)));
    }
}
```

`#[sqlx::test]` provisions a fresh, migrated Postgres database for each test and tears it down afterward, so tests can't leak state into each other no matter what order they run in. The `migrations` argument matters here for the same reason `sqlx::migrate!`'s path did back in the Database Connection Pooling part: it's resolved relative to this crate, `pokemon_service`, and the migrations actually live over in `pokemon-api`, so the path has to say so explicitly. This needs a real Postgres server reachable through `DATABASE_URL` to run against, `cargo test --workspace` won't pass without one, which is a fair trade for tests that prove the SQL itself is correct, not just that the Rust around it compiles.

The Repository traits, their Postgres implementations, and the domain types are everything `pokemon_service` exports so far. The service layer next builds the actual business logic on top.
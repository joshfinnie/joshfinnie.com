---
title: "Service and Domain Logic"
draft: true
date: "2026-08-28"
tags:
  - "rust"
  - "axum"
  - "docker"
  - "tutorial"
series: "pokemon-api"
order: 9
description: "A service layer that owns validation and business rules, depending on the repository trait instead of Postgres directly."
---

The repository knows how to move data in and out of Postgres. It doesn't know that a Pokemon needs a name, or that height and weight can't be negative. Those are rules about the domain, not about storage, so they belong in a layer above the repository, one that depends on `PokemonRepository` the trait rather than `PgPokemonRepository` the struct.

That distinction is what makes this layer testable without a database: give it an in-memory fake that implements the same trait, and a test suite can exercise every validation rule in milliseconds.

```rust
// crates/pokemon-service/src/lib.rs

pub mod domain;
pub mod repository;
pub mod service;
```

```rust
// crates/pokemon-service/src/service.rs

use crate::domain::{Pokemon, PokemonId};
use crate::repository::{CreatePokemon, PokemonRepository, RepositoryError};

#[derive(Debug, thiserror::Error)]
pub enum ServiceError {
    #[error("pokemon not found")]
    NotFound,
    #[error("validation failed: {0}")]
    Validation(String),
    #[error(transparent)]
    Repository(#[from] RepositoryError),
}

impl From<RepositoryError> for ServiceError {
    fn from(err: RepositoryError) -> Self {
        match err {
            RepositoryError::NotFound => ServiceError::NotFound,
            other => ServiceError::Repository(other),
        }
    }
}

pub struct PokemonService<R: PokemonRepository> {
    repository: R,
}

impl<R: PokemonRepository> PokemonService<R> {
    pub fn new(repository: R) -> Self {
        Self { repository }
    }

    pub async fn list(&self) -> Result<Vec<Pokemon>, ServiceError> {
        Ok(self.repository.list().await?)
    }

    pub async fn get(&self, id: PokemonId) -> Result<Pokemon, ServiceError> {
        Ok(self.repository.get(id).await?)
    }

    pub async fn create(&self, input: CreatePokemon) -> Result<Pokemon, ServiceError> {
        if input.name.trim().is_empty() {
            return Err(ServiceError::Validation("name cannot be empty".into()));
        }

        if input.height < 0 || input.weight < 0 {
            return Err(ServiceError::Validation(
                "height and weight cannot be negative".into(),
            ));
        }

        Ok(self.repository.create(input).await?)
    }

    pub async fn delete(&self, id: PokemonId) -> Result<(), ServiceError> {
        Ok(self.repository.delete(id).await?)
    }
}
```

`PokemonService` is generic over `R: PokemonRepository` rather than holding `Arc<dyn PokemonRepository>`. Now that `PokemonRepository` uses native `async fn` instead of `async_trait`, it isn't object-safe, `dyn PokemonRepository` won't compile, since a trait object can't express "this method returns some future type I'll tell you about later." Generics sidestep the problem entirely: production code builds `PokemonService::new(PgPokemonRepository::new(pool))`, and a test can just as easily build `PokemonService::new(FakeRepository::default())`. That's the same swappable-fake testability the trait gives us, through monomorphization instead of dynamic dispatch, and neither production nor tests pays for indirection the other doesn't need.

`create` takes the repository's own `CreatePokemon` directly rather than a separate service-level type; there's no meaningful difference between "the data needed to create a Pokemon" at the service boundary and at the repository boundary, so one struct does both jobs. Validation happens here, before the repository ever sees it: an empty name or a negative height fails with `ServiceError::Validation` and never reaches Postgres. Identity, by contrast, isn't the service's concern; `PgPokemonRepository::create` from the last part generates the id, since that's tied to how the row gets written, not to any business rule.

`RepositoryError::NotFound` maps to `ServiceError::NotFound`, but every other repository error passes through as `ServiceError::Repository`. Handlers don't need to know sqlx exists; they only need to know whether a request failed because of bad input, a missing resource, or something internal.

`AbilityService` would follow the same shape: validate, delegate to the repository, translate errors.

## Testing the service

This is the payoff for depending on `PokemonRepository` the trait instead of `PgPokemonRepository` the struct: a fake that lives entirely in memory, no database, no network, and validation tests that run in milliseconds.

```rust
// crates/pokemon-service/src/service.rs (continued)

#[cfg(test)]
mod tests {
    use std::sync::Mutex;

    use uuid::Uuid;

    use super::*;

    #[derive(Default)]
    struct FakePokemonRepository {
        pokemon: Mutex<Vec<Pokemon>>,
    }

    impl PokemonRepository for FakePokemonRepository {
        async fn list(&self) -> Result<Vec<Pokemon>, RepositoryError> {
            Ok(self.pokemon.lock().unwrap().clone())
        }

        async fn get(&self, id: PokemonId) -> Result<Pokemon, RepositoryError> {
            self.pokemon
                .lock()
                .unwrap()
                .iter()
                .find(|p| p.id.0 == id.0)
                .cloned()
                .ok_or(RepositoryError::NotFound)
        }

        async fn create(&self, input: CreatePokemon) -> Result<Pokemon, RepositoryError> {
            let pokemon = Pokemon {
                id: PokemonId(Uuid::new_v4()),
                name: input.name,
                base_experience: input.base_experience,
                height: input.height,
                is_default: input.is_default,
                order: input.order,
                weight: input.weight,
                abilities: Vec::new(),
            };

            self.pokemon.lock().unwrap().push(pokemon.clone());
            Ok(pokemon)
        }

        async fn delete(&self, id: PokemonId) -> Result<(), RepositoryError> {
            let mut pokemon = self.pokemon.lock().unwrap();
            let len_before = pokemon.len();
            pokemon.retain(|p| p.id.0 != id.0);

            if pokemon.len() == len_before {
                return Err(RepositoryError::NotFound);
            }

            Ok(())
        }
    }

    fn sample() -> CreatePokemon {
        CreatePokemon {
            name: "Bulbasaur".into(),
            base_experience: Some(64),
            height: 7,
            is_default: true,
            order: 1,
            weight: 69,
        }
    }

    #[tokio::test]
    async fn create_rejects_empty_name() {
        let service = PokemonService::new(FakePokemonRepository::default());

        let result = service
            .create(CreatePokemon { name: "  ".into(), ..sample() })
            .await;

        assert!(matches!(result, Err(ServiceError::Validation(_))));
    }

    #[tokio::test]
    async fn create_rejects_negative_height() {
        let service = PokemonService::new(FakePokemonRepository::default());

        let result = service.create(CreatePokemon { height: -1, ..sample() }).await;

        assert!(matches!(result, Err(ServiceError::Validation(_))));
    }

    #[tokio::test]
    async fn create_then_get_round_trips() {
        let service = PokemonService::new(FakePokemonRepository::default());

        let created = service.create(sample()).await.unwrap();
        let fetched = service.get(created.id).await.unwrap();

        assert_eq!(fetched.name, "Bulbasaur");
    }

    #[tokio::test]
    async fn get_missing_pokemon_is_not_found() {
        let service = PokemonService::new(FakePokemonRepository::default());

        let result = service.get(PokemonId(Uuid::new_v4())).await;

        assert!(matches!(result, Err(ServiceError::NotFound)));
    }
}
```

`FakePokemonRepository` implements the exact same trait `PgPokemonRepository` does, just against a `Mutex<Vec<Pokemon>>` instead of Postgres. `PokemonService::new` doesn't know or care which one it received. The first two tests never touch `create`'s success path at all, they only need to prove validation rejects bad input before it reaches the repository. `RepositoryError::NotFound` mapping to `ServiceError::NotFound` gets exercised too, through a real repository call, just not a real database.

With validation covered, the last part wires this service into HTTP.

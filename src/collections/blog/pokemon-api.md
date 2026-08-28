---
title: "Building a Pokemon API in Rust"
draft: false
date: "2026-08-31"
tags:
  - "rust"
  - "axum"
  - "docker"
  - "postgresql"
  - "tutorial"
slug: "pokemon-api"
seriesHub: "pokemon-api"
heroImage: "blog/pokemon-api"
unsplash: "Thimo Pederson"
unsplashURL: "thimo"
description: "A fourteen-part series building a production-shaped RESTful API in Rust with Axum, Docker, and PostgreSQL, using a Pokemon API as the running example."
---

Most Rust API tutorials stop at a single main.rs file with a handful of routes bolted on. That's fine for learning the syntax, but it doesn't show you how a real service fits together, where config lives, how a database pool gets shared across requests, or why the layer that talks to your database shouldn't know anything about HTTP.

This series builds that structure from the ground up, using a small Pokemon API as the running example: Pokemon, their abilities, and the relationship between them. We start with the project skeleton, then configuration, because everything downstream depends on knowing where the database lives and what port to bind to. From there we bring up the Axum server itself, add health checks so the container orchestrator knows the service is alive, and layer in middleware for the concerns that cut across every request. Once the skeleton is running, we connect a PostgreSQL pool, wire up shared application state, and build out the layers that do the actual work: a repository for data access, a service layer for domain logic, and the handlers that tie it all to HTTP.

By the end we have a containerized API with the same shape you'd find in a real production codebase, and a reason for every layer being there. Each part builds on the one before it, so the table of contents on the left will take you through in order.

## What we're building

Two resources: Pokemon and their Abilities, joined by a many-to-many relationship that also carries data of its own (whether the ability counts as hidden, and which slot it occupies).

```rust
pub struct Pokemon {
    /// The identifier for this resource.
    pub id: PokemonId,
    /// The name for this resource.
    pub name: String,
    /// The base experience gained for defeating this Pokemon.
    pub base_experience: Option<i64>,
    /// The height of this Pokemon in decimetres.
    pub height: i64,
    /// Set for exactly one Pokemon used as the default for each species.
    pub is_default: bool,
    /// Order for sorting. Almost national order, except families are grouped together.
    pub order: i64,
    /// The weight of this Pokemon in hectograms.
    pub weight: i64,
    /// A list of abilities this Pokemon could potentially have.
    pub abilities: Vec<PokemonAbility>,
}

pub struct PokemonId(Uuid);

pub struct PokemonAbility {
    /// The Pokemon this ability belongs to.
    pub pokemon_id: PokemonId,
    /// The ability assigned to the Pokemon.
    pub ability_id: AbilityId,
    /// Whether or not this is a hidden ability.
    pub is_hidden: bool,
    /// The slot this ability occupies in this Pokemon species.
    pub slot: i64,
}

pub struct Ability {
    /// The identifier for this resource.
    pub id: AbilityId,
    /// The name for this resource.
    pub name: String,
}

pub struct AbilityId(Uuid);
```

The full endpoint surface this design implies:

| Name                          | HTTP Method | Route                                          |
| ------------------------------| ----------- | ----------------------------------------------|
| List Pokemon                  | GET         | /v1/pokemon                                    |
| Create Pokemon                | POST        | /v1/pokemon                                    |
| Get a Pokemon                 | GET         | /v1/pokemon/{pokemon_id}                       |
| Update a Pokemon              | PUT         | /v1/pokemon/{pokemon_id}                       |
| Delete a Pokemon              | DELETE      | /v1/pokemon/{pokemon_id}                       |
| List a Pokemon's Abilities    | GET         | /v1/pokemon/{pokemon_id}/abilities             |
| Get a Pokemon's Ability       | GET         | /v1/pokemon/{pokemon_id}/abilities/{ability_id}|
| Add to a Pokemon's Abilities  | POST        | /v1/pokemon/{pokemon_id}/abilities             |
| Update a Pokemon's Ability    | PUT         | /v1/pokemon/{pokemon_id}/abilities/{ability_id}|
| Remove a Pokemon's Ability    | DELETE      | /v1/pokemon/{pokemon_id}/abilities/{ability_id}|
| List Abilities                | GET         | /v1/abilities                                  |
| Create an Ability             | POST        | /v1/abilities                                  |
| Get an Ability                | GET         | /v1/abilities/{ability_id}                     |
| Update an Ability             | PUT         | /v1/abilities/{ability_id}                     |
| Delete an Ability             | DELETE      | /v1/abilities/{ability_id}                     |
| List Pokemon with Ability     | GET         | /v1/abilities/{ability_id}/pokemon             |
| Health Check                  | GET         | /healthz                                       |

We build the full Pokemon path: repository, service, and handlers, start to finish. The Ability endpoints get a full repository (list, get, create, delete, and the "which Pokemon have this ability" query) in the Repository part, since that's where the interesting persistence decisions live, but we stop there. Their service and handler layers follow the exact same pattern as Pokemon's, so we leave writing them out as an exercise once you've seen the pattern once.

Find me on [Bluesky](https://bsky.app/profile/joshfinnie.dev) if you build along with it.

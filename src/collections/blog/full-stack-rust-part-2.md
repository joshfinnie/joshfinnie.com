---
title: "Full-Stack Rust Part 2"
date: "2026-03-02"
tags:
  - "rust"
  - "web-development"
  - "full-stack"
  - "programming"
  - "tutorial"
slug: "full-stack-rust-part-2"
series: "full-stack-rust"
heroImage: "blog/fullstack-rust"
unsplash: "ChatGPT"
description: "Part 2 of building a full-stack URL shortener in Rust. We swap our in-memory HashMap for SQLite with sqlx, write migrations, and persist URLs across restarts."
draft: true
---

This is a 6 part blog post series about writing a full-stack application in Rust.
In this second part we will be adding database persistence with [sqlx](https://docs.rs/sqlx/latest/sqlx/).
Here is the full series outline:

1. **Axum Backend Basics** — routes, shared state, and an in-memory URL shortener
2. **Database Persistence** (this post) — swapping the HashMap for a real database with sqlx
3. **Error Handling & Validation** — custom error types, URL validation, and graceful responses
4. **Authentication** — API keys and auth middleware
5. **Yew.rs Frontend** — building an SPA that talks to our API
6. **Deployment** — Dockerizing the app and serving Yew from Axum

## The Problem with In-Memory Storage

At the end of Part 1 we had a working URL shortener, but there was a catch.
Every time you stop the server, all your URLs vanish.
That is not great for a service people actually want to use.

Let's fix that by swapping our `HashMap` for a real database.

## Why sqlx?

The Rust ecosystem has several database libraries to choose from.
[Diesel](https://diesel.rs/) is the most established ORM, and [SeaORM](https://www.sea-ql.org/SeaORM/) is a newer async-first option.
Both are solid, but they come with their own DSLs and code generation steps.

I prefer [sqlx](https://docs.rs/sqlx/latest/sqlx/) because it lets you write plain SQL.
There is no schema DSL to learn, no generated code to manage.
You write SQL, sqlx checks it at compile time against your actual database, and you get back typed Rust structs.
It is the closest thing to "just use SQL" that the Rust ecosystem has.

## Why SQLite?

For a tutorial like this, SQLite is perfect.
There is zero setup — no server to install, no ports to configure, no Docker containers to spin up.
It is just a file on disk.

The best part is that sqlx's API is nearly identical across database backends.
When you are ready to move to Postgres in production, you swap the connection pool type and your queries stay almost the same.
We will keep things simple with SQLite for now.

## Updating Dependencies

Let's add `sqlx` and `chrono` to our `Cargo.toml`:

```toml
[dependencies]
axum = "0.6"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tokio = { version = "1", features = ["full"] }
nanoid = "0.4"
sqlx = { version = "0.7", features = ["runtime-tokio", "sqlite"] }
chrono = { version = "0.4", features = ["serde"] }
```

We pull in `sqlx` with the `runtime-tokio` and `sqlite` features.
The `chrono` crate gives us proper datetime types, and the `serde` feature lets us serialize timestamps straight to JSON.

## Setting Up the Database

sqlx has a handy CLI tool for managing databases and migrations.
Let's install it and set things up:

```bash
$ cargo install sqlx-cli --no-default-features --features sqlite
```

Now create the database and our first migration:

```bash
$ export DATABASE_URL="sqlite:urls.db"
$ sqlx database create
$ sqlx migrate add create_urls_table
```

That last command creates a file in `migrations/` with a timestamp prefix.
Open it up and add our schema:

```sql
CREATE TABLE IF NOT EXISTS urls (
    slug TEXT PRIMARY KEY NOT NULL,
    url TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
```

Nothing fancy — a `slug` as the primary key, the destination `url`, and a `created_at` timestamp that defaults to now.

Run the migration:

```bash
$ sqlx migrate run
```

You should see a confirmation that the migration was applied.
If you peek at the project root, you will see a `urls.db` file — that is your database.

## Updating Our Models

Our structs need a couple of changes.
We add `sqlx::FromRow` so sqlx can map database rows directly into our struct, and we use `chrono::NaiveDateTime` for the timestamp:

```rust
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct CreateUrl {
    url: String,
}

#[derive(Serialize, sqlx::FromRow)]
struct UrlResponse {
    slug: String,
    url: String,
    created_at: NaiveDateTime,
}
```

The `FromRow` derive is one of sqlx's best features.
It automatically maps column names to struct fields, so you do not have to write any manual deserialization code.

## Swapping the State

In Part 1 we used `Arc<RwLock<HashMap<String, String>>>` as our shared state.
Now we replace that with sqlx's `SqlitePool`:

```rust
use sqlx::SqlitePool;
```

That is it.
`SqlitePool` is already `Clone` and `Send + Sync`, so Axum is happy to use it directly as state.
No more `Arc`, no more `RwLock`.

## Rewriting the Handlers

Here is where things get interesting.
Let's rewrite all three handlers to use the database.

**Create a short URL:**

```rust
use axum::{extract::State, http::StatusCode, Json};

async fn create_url(
    State(pool): State<SqlitePool>,
    Json(payload): Json<CreateUrl>,
) -> Result<(StatusCode, Json<UrlResponse>), StatusCode> {
    let slug = nanoid::nanoid!(6);

    let url_row = sqlx::query_as::<_, UrlResponse>(
        "INSERT INTO urls (slug, url) VALUES (?, ?) RETURNING slug, url, created_at"
    )
    .bind(&slug)
    .bind(&payload.url)
    .fetch_one(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok((StatusCode::CREATED, Json(url_row)))
}
```

The `RETURNING` clause is a nice trick.
Instead of inserting and then doing a separate SELECT, we get the full row back in one query — including the `created_at` that the database set for us.

**Redirect from a slug:**

```rust
use axum::extract::Path;
use axum::response::Redirect;

async fn redirect_url(
    State(pool): State<SqlitePool>,
    Path(slug): Path<String>,
) -> Result<Redirect, StatusCode> {
    let row = sqlx::query_as::<_, UrlResponse>(
        "SELECT slug, url, created_at FROM urls WHERE slug = ?"
    )
    .bind(&slug)
    .fetch_optional(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    row.map(|r| Redirect::temporary(&r.url))
        .ok_or(StatusCode::NOT_FOUND)
}
```

We use `fetch_optional` here instead of `fetch_one`.
This returns an `Option<UrlResponse>` — `None` if the slug does not exist, which we convert into a 404.

**List all URLs:**

```rust
async fn list_urls(
    State(pool): State<SqlitePool>,
) -> Result<Json<Vec<UrlResponse>>, StatusCode> {
    let urls = sqlx::query_as::<_, UrlResponse>(
        "SELECT slug, url, created_at FROM urls ORDER BY created_at DESC"
    )
    .fetch_all(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(urls))
}
```

The `ORDER BY created_at DESC` gives us the newest URLs first, which is a better default for our future frontend.

## Updating main

Our `main` function needs to set up the connection pool and run migrations on startup:

```rust
use axum::{routing::{get, post}, Router};
use sqlx::sqlite::SqlitePoolOptions;

#[tokio::main]
async fn main() {
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "sqlite:urls.db".to_string());

    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to create pool");

    sqlx::migrate!()
        .run(&pool)
        .await
        .expect("Failed to run migrations");

    let app = Router::new()
        .route("/urls", post(create_url).get(list_urls))
        .route("/:slug", get(redirect_url))
        .with_state(pool);

    println!("Listening on http://0.0.0.0:3000");
    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
```

A few things to note here.
`SqlitePoolOptions::new().max_connections(5)` gives us a pool of up to 5 connections.
For SQLite that is more than enough.

The `sqlx::migrate!()` macro embeds your migration files into the binary at compile time.
When the server starts, it checks if the database is up to date and applies any pending migrations.
This means you never have to remember to run migrations manually in production.

## The Full Code

Here is the complete `src/main.rs`:

```rust
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Redirect,
    routing::{get, post},
    Json, Router,
};
use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use sqlx::sqlite::SqlitePoolOptions;
use sqlx::SqlitePool;

#[derive(Deserialize)]
struct CreateUrl {
    url: String,
}

#[derive(Serialize, sqlx::FromRow)]
struct UrlResponse {
    slug: String,
    url: String,
    created_at: NaiveDateTime,
}

async fn create_url(
    State(pool): State<SqlitePool>,
    Json(payload): Json<CreateUrl>,
) -> Result<(StatusCode, Json<UrlResponse>), StatusCode> {
    let slug = nanoid::nanoid!(6);

    let url_row = sqlx::query_as::<_, UrlResponse>(
        "INSERT INTO urls (slug, url) VALUES (?, ?) RETURNING slug, url, created_at"
    )
    .bind(&slug)
    .bind(&payload.url)
    .fetch_one(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok((StatusCode::CREATED, Json(url_row)))
}

async fn redirect_url(
    State(pool): State<SqlitePool>,
    Path(slug): Path<String>,
) -> Result<Redirect, StatusCode> {
    let row = sqlx::query_as::<_, UrlResponse>(
        "SELECT slug, url, created_at FROM urls WHERE slug = ?"
    )
    .bind(&slug)
    .fetch_optional(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    row.map(|r| Redirect::temporary(&r.url))
        .ok_or(StatusCode::NOT_FOUND)
}

async fn list_urls(
    State(pool): State<SqlitePool>,
) -> Result<Json<Vec<UrlResponse>>, StatusCode> {
    let urls = sqlx::query_as::<_, UrlResponse>(
        "SELECT slug, url, created_at FROM urls ORDER BY created_at DESC"
    )
    .fetch_all(&pool)
    .await
    .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(urls))
}

#[tokio::main]
async fn main() {
    let database_url = std::env::var("DATABASE_URL")
        .unwrap_or_else(|_| "sqlite:urls.db".to_string());

    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await
        .expect("Failed to create pool");

    sqlx::migrate!()
        .run(&pool)
        .await
        .expect("Failed to run migrations");

    let app = Router::new()
        .route("/urls", post(create_url).get(list_urls))
        .route("/:slug", get(redirect_url))
        .with_state(pool);

    println!("Listening on http://0.0.0.0:3000");
    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
```

## Taking It for a Spin

Make sure your `DATABASE_URL` is set and start the server:

```bash
$ export DATABASE_URL="sqlite:urls.db"
$ cargo run
```

Create a short URL:

```bash
$ curl -X POST http://localhost:3000/urls \
  -H "Content-Type: application/json" \
  -d '{"url": "https://joshfinnie.com"}'
```

You should get back something like:

```json
{
  "slug": "V1StGX",
  "url": "https://joshfinnie.com",
  "created_at": "2026-03-02T12:34:56"
}
```

Notice the `created_at` field — that is our database doing its thing.

Now stop the server, start it again, and list the URLs:

```bash
$ cargo run
$ curl http://localhost:3000/urls
```

Your URLs are still there.
Persistence!

## Wrapping Up

We went from an in-memory `HashMap` to a proper SQLite database in about the same number of lines of code.
sqlx made this remarkably painless — plain SQL queries, compile-time checking, and automatic struct mapping with `FromRow`.

A few things we are still missing:

- **Error handling** — we are returning bare `StatusCode` errors with no message body. Our API consumers deserve better.
- **Validation** — we are not checking if the submitted URL is actually a valid URL. Someone could store `not-a-url` and we would happily accept it.

In the next part of this series, we will tackle both of those problems with custom error types and URL validation.
Stay tuned!

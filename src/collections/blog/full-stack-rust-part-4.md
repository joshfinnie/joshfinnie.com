---
title: "Full-Stack Rust Part 4"
date: "2026-03-30"
tags:
  - "rust"
  - "web-development"
  - "full-stack"
  - "programming"
  - "tutorial"
slug: "full-stack-rust-part-4"
series: "full-stack-rust"
heroImage: "blog/fullstack-rust"
unsplash: "Jan Mellström"
unsplashURL: "mrjane"
description: "Part 4 of building a full-stack URL shortener in Rust. We add API key authentication using Axum middleware and Tower layers to protect our write endpoints."
draft: true
---

This is a 6 part blog post series about writing a full-stack application in Rust.
In this fourth part we will be adding API key authentication to protect our write endpoints.
Here is the full series outline:

1. **Axum Backend Basics** — routes, shared state, and an in-memory URL shortener
2. **Database Persistence** — swapping the HashMap for a real database with sqlx
3. **Error Handling & Validation** — custom error types, URL validation, and graceful responses
4. **Authentication** (this post) — API keys and auth middleware
5. **Yew.rs Frontend** — building an SPA that talks to our API
6. **Deployment** — Dockerizing the app and serving Yew from Axum

## Why Authentication?

Right now anyone with access to our API can create and delete URLs. That is fine for local development, but the moment we put this on the internet we need some kind of gate on our write endpoints.

We are going to keep it simple: a single API key passed as a Bearer token in the `Authorization` header. It is not a full user system, but it is more than enough for a personal URL shortener and it gives us a great excuse to explore Axum's middleware story.

## Adding dotenvy

Hardcoding secrets is a bad habit, so let's pull our configuration from environment variables. The [dotenvy](https://docs.rs/dotenvy/latest/dotenvy/) crate loads a `.env` file at startup, which is perfect for local development.

Add it to your `Cargo.toml`:

```toml
[dependencies]
dotenvy = "0.15"
```

Now create a `.env` file in the project root:

```bash
DATABASE_URL=sqlite:urls.db
API_KEY=super-secret-key-change-me
```

Make sure to add `.env` to your `.gitignore` so you never accidentally commit your secrets.

At the top of `main.rs`, load the file early:

```rust
dotenvy::dotenv().ok();
```

We call `.ok()` instead of `.unwrap()` so the app still starts if no `.env` file is present (for example, in production where you set real environment variables).

## Upgrading AppState

Up to now our `AppState` has been a simple type alias. We need it to carry both the database pool and the API key, so let's promote it to a proper struct.

```rust
use sqlx::SqlitePool;

#[derive(Clone)]
struct AppState {
    pool: SqlitePool,
    api_key: String,
}
```

And in `main`, build it like this:

```rust
let database_url = std::env::var("DATABASE_URL")
    .expect("DATABASE_URL must be set");
let api_key = std::env::var("API_KEY")
    .expect("API_KEY must be set");

let pool = SqlitePool::connect(&database_url).await.unwrap();

let state = AppState { pool, api_key };
```

This is a nice pattern in Axum. Because `AppState` implements `Clone`, Axum can hand a copy to every request without any extra ceremony.

## Writing the Middleware

Axum builds on [Tower](https://docs.rs/tower/latest/tower/), so middleware is just an async function that decides whether to call the next handler or bail out early. Let's write a `require_api_key` function.

```rust
use axum::{
    extract::State,
    http::{Request, StatusCode},
    middleware::Next,
    response::Response,
};

async fn require_api_key(
    State(state): State<AppState>,
    request: Request<axum::body::Body>,
    next: Next,
) -> Result<Response, StatusCode> {
    let auth_header = request
        .headers()
        .get("Authorization")
        .and_then(|value| value.to_str().ok());

    match auth_header {
        Some(header) if header.starts_with("Bearer ") => {
            let token = &header[7..];
            if token == state.api_key {
                Ok(next.run(request).await)
            } else {
                Err(StatusCode::UNAUTHORIZED)
            }
        }
        _ => Err(StatusCode::UNAUTHORIZED),
    }
}
```

Let's walk through what is happening here. We extract `AppState` so we can read the expected API key. Then we grab the `Authorization` header, check that it starts with `Bearer `, and compare the token to our stored key. If everything checks out, we call `next.run(request)` to pass the request along to the actual handler. If not, we short-circuit with a `401 Unauthorized`.

## Splitting Routes

The key insight is that we only want to protect write endpoints. Reads (listing URLs and redirecting) should stay public. Axum makes this easy with `route_layer`.

```rust
use axum::{middleware, routing::{get, post, delete}, Router};

#[tokio::main]
async fn main() {
    dotenvy::dotenv().ok();

    let database_url = std::env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    let api_key = std::env::var("API_KEY")
        .expect("API_KEY must be set");

    let pool = SqlitePool::connect(&database_url).await.unwrap();
    let state = AppState { pool, api_key };

    let protected = Router::new()
        .route("/urls", post(create_url))
        .route("/urls/:slug", delete(delete_url))
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            require_api_key,
        ));

    let public = Router::new()
        .route("/urls", get(list_urls))
        .route("/:slug", get(redirect_url));

    let app = Router::new()
        .merge(protected)
        .merge(public)
        .with_state(state);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000")
        .await
        .unwrap();
    println!("Listening on http://0.0.0.0:3000");
    axum::serve(listener, app).await.unwrap();
}
```

We create two separate routers: `protected` gets the `require_api_key` middleware via `route_layer`, while `public` has no middleware at all. Then we `merge` them together. Axum is smart enough to combine overlapping paths (like `/urls` which has both `GET` and `POST`) into the right thing.

The `from_fn_with_state` helper is important here. Because our middleware needs access to `AppState`, we use this variant instead of the plain `from_fn`.

## Updating the Handlers

With `AppState` as a struct instead of a bare pool, our handlers need a small tweak. Everywhere we had `State(pool)` we now have `State(state)` and use `state.pool`.

Here is `create_url` as an example:

```rust
async fn create_url(
    State(state): State<AppState>,
    Json(payload): Json<CreateUrl>,
) -> Result<(StatusCode, Json<UrlResponse>), AppError> {
    let slug = nanoid::nanoid!(6);

    sqlx::query("INSERT INTO urls (slug, url) VALUES (?, ?)")
        .bind(&slug)
        .bind(&payload.url)
        .execute(&state.pool)
        .await?;

    Ok((
        StatusCode::CREATED,
        Json(UrlResponse {
            slug,
            url: payload.url,
        }),
    ))
}
```

The change is minimal — just swap `pool` for `state.pool`. Do the same for `list_urls`, `redirect_url`, and `delete_url`.

## Testing It Out

Let's fire up the server and make sure everything works.

```bash
$ cargo run
```

First, try creating a URL without any API key:

```bash
$ curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/urls \
  -H "Content-Type: application/json" \
  -d '{"url": "https://joshfinnie.com"}'
```

You should get back `401`. Good.

Now try with the wrong key:

```bash
$ curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:3000/urls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer wrong-key" \
  -d '{"url": "https://joshfinnie.com"}'
```

Still `401`. Perfect.

Now with the correct key:

```bash
$ curl -X POST http://localhost:3000/urls \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer super-secret-key-change-me" \
  -d '{"url": "https://joshfinnie.com"}'
```

```json
{"slug": "V1StGX", "url": "https://joshfinnie.com"}
```

There we go. And our public endpoints should still work without any key:

```bash
$ curl http://localhost:3000/urls
```

```json
[{"slug": "V1StGX", "url": "https://joshfinnie.com"}]
```

Redirects work too:

```bash
$ curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/V1StGX
```

You should see `307` — a temporary redirect.

## Wrapping Up

We now have a proper authentication layer on our URL shortener. Our write endpoints require a valid API key while reads stay open to the world. Axum's middleware system, built on Tower, makes this surprisingly pleasant to implement.

A few things to keep in mind if you want to take this further:

- **Hashing** — we are comparing the API key as a plain string. In production, you might want to hash stored keys and compare hashes.
- **Multiple keys** — right now we support a single key. You could store multiple keys in the database and look them up per request.
- **Rate limiting** — Tower has a [RateLimit](https://docs.rs/tower/latest/tower/limit/rate/struct.RateLimit.html) layer that would be easy to add alongside our auth middleware.

In the next part we will build a frontend for our URL shortener using [Yew.rs](https://yew.rs/), Rust's component-based framework that compiles to WebAssembly.
Stay tuned!

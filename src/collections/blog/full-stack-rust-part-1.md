---
title: "Building a Full-Stack Rust Application"
date: "2026-02-19"
tags:
  - "rust"
  - "web-development"
  - "full-stack"
  - "programming"
  - "tutorial"
slug: "full-stack-rust-part-1"
series: "full-stack-rust"
heroImage: "blog/fullstack-rust"
unsplash: "ChatGPT"
description: "Part 1 of building a full-stack URL shortener in Rust. We set up an Axum backend with in-memory storage, CRUD routes, and a nanoid-based slug generator."
---

This is a 6 part blog post series about writing a full-stack application in Rust.
In this first part we will be diving into [Axum](https://docs.rs/axum/latest/axum/) for the backend.
Here is the full series outline:

1. **Axum Backend Basics** (this post) — routes, shared state, and an in-memory URL shortener
2. **Database Persistence** — swapping the HashMap for a real database with sqlx
3. **Error Handling & Validation** — custom error types, URL validation, and graceful responses
4. **Authentication** — API keys and auth middleware
5. **Yew.rs Frontend** — building an SPA that talks to our API
6. **Deployment** — Dockerizing the app and serving Yew from Axum

## Introduction to Axum

Per their docs, Axum is a web application framework that focuses on ergonomics and modularity.
There are a lot of options here to chose from, but I have always found Axum to be the best for applications like this example. 
It seems to best be suited for CRUD APIs.
And its light use of macros appeases my senses compared to [Rocket](https://rocket.rs/).

Below is an example of the "Hello World" boilerplate for Axum:

```rust
use axum::{
    routing::get,
    Router,
};

#[tokio::main]
async fn main() {
    // build our application with a single route
    let app = Router::new().route("/", get(|| async { "Hello, World!" }));

    // run it with hyper on localhost:3000
    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
```

It easy and straight to the point.
Do not be fooled though, Axum is full of powerful features too!

## Our URL Shortener

For this series, we are going to build a URL shortener.
It is the perfect project for learning full-stack Rust: it's simple enough to grok in a blog post, but touches enough real-world patterns (shared state, JSON APIs, redirects) to be genuinely useful.

By the end of Part 1, we will have a working Axum API that can:

- Accept a URL and return a shortened slug
- Redirect a visitor from the slug to the original URL
- List all stored URLs (handy for debugging and for our future frontend)

### Project Setup

Let's start a new Rust project:

```bash
$ cargo new url-shortener
$ cd url-shortener
```

Now add the dependencies we need to `Cargo.toml`:

```toml
[dependencies]
axum = "0.6"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tokio = { version = "1", features = ["full"] }
nanoid = "0.4"
```

A quick rundown:

- **axum** — our web framework
- **serde / serde_json** — for serializing and deserializing JSON
- **tokio** — the async runtime Axum runs on
- **nanoid** — generates short, URL-safe unique IDs

### Shared State

A production URL shortener would use a database, but for Part 1 we will keep things simple with an in-memory `HashMap` wrapped in an `Arc<RwLock<_>>`.
This lets multiple Axum handlers read and write to our store concurrently.

```rust
use std::collections::HashMap;
use std::sync::{Arc, RwLock};

type UrlStore = Arc<RwLock<HashMap<String, String>>>;
```

If you have not used `Arc<RwLock<_>>` before, think of it this way: `Arc` lets multiple threads share ownership, and `RwLock` lets many readers _or_ one writer access the inner data at a time.
It is the standard pattern for shared mutable state in async Rust.

### Models

We need a simple struct for the JSON body our API will accept, and one for the response:

```rust
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
struct CreateUrl {
    url: String,
}

#[derive(Serialize)]
struct UrlResponse {
    slug: String,
    url: String,
}
```

Nothing fancy here — just enough for Axum's JSON extractor to do its thing.

### Handlers

Now for the fun part. We need three handler functions.

**Create a short URL:**

```rust
use axum::{extract::State, http::StatusCode, Json};

async fn create_url(
    State(store): State<UrlStore>,
    Json(payload): Json<CreateUrl>,
) -> (StatusCode, Json<UrlResponse>) {
    let slug = nanoid::nanoid!(6);
    store.write().unwrap().insert(slug.clone(), payload.url.clone());

    (
        StatusCode::CREATED,
        Json(UrlResponse {
            slug,
            url: payload.url,
        }),
    )
}
```

We use `nanoid::nanoid!(6)` to generate a 6-character slug.
That gives us roughly 2.2 billion possible slugs — plenty for our purposes.
If you want even shorter URLs, you could drop to 4 characters at the cost of a smaller keyspace.

**Redirect from a slug:**

```rust
use axum::extract::Path;
use axum::response::Redirect;

async fn redirect_url(
    State(store): State<UrlStore>,
    Path(slug): Path<String>,
) -> Result<Redirect, StatusCode> {
    store
        .read()
        .unwrap()
        .get(&slug)
        .map(|url| Redirect::temporary(url))
        .ok_or(StatusCode::NOT_FOUND)
}
```

This is my favorite handler of the bunch.
Axum's `Redirect` response type makes this incredibly clean — no manually setting headers or status codes.

**List all URLs:**

```rust
async fn list_urls(
    State(store): State<UrlStore>,
) -> Json<Vec<UrlResponse>> {
    let store = store.read().unwrap();
    let urls: Vec<UrlResponse> = store
        .iter()
        .map(|(slug, url)| UrlResponse {
            slug: slug.clone(),
            url: url.clone(),
        })
        .collect();

    Json(urls)
}
```

### Wiring It All Together

Now let's bring it all together in `main`:

```rust
use axum::{routing::{get, post}, Router};

#[tokio::main]
async fn main() {
    let store: UrlStore = Arc::new(RwLock::new(HashMap::new()));

    let app = Router::new()
        .route("/urls", post(create_url).get(list_urls))
        .route("/:slug", get(redirect_url))
        .with_state(store);

    println!("Listening on http://0.0.0.0:3000");
    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
```

Notice how `.with_state(store)` injects our `UrlStore` into every handler that asks for it via the `State` extractor.
This is one of Axum's best features — dependency injection without macros or global state.

### Taking It for a Spin

Start the server:

```bash
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
{"slug": "V1StGX", "url": "https://joshfinnie.com"}
```

Now visit `http://localhost:3000/V1StGX` in your browser (using the slug you got back) and you will be redirected to the original URL.

List all stored URLs:

```bash
$ curl http://localhost:3000/urls
```

### The Full Code

Here is the complete `src/main.rs` for reference:

```rust
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::Redirect,
    routing::{get, post},
    Json, Router,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::sync::{Arc, RwLock};

type UrlStore = Arc<RwLock<HashMap<String, String>>>;

#[derive(Deserialize)]
struct CreateUrl {
    url: String,
}

#[derive(Serialize)]
struct UrlResponse {
    slug: String,
    url: String,
}

async fn create_url(
    State(store): State<UrlStore>,
    Json(payload): Json<CreateUrl>,
) -> (StatusCode, Json<UrlResponse>) {
    let slug = nanoid::nanoid!(6);
    store.write().unwrap().insert(slug.clone(), payload.url.clone());

    (
        StatusCode::CREATED,
        Json(UrlResponse {
            slug,
            url: payload.url,
        }),
    )
}

async fn redirect_url(
    State(store): State<UrlStore>,
    Path(slug): Path<String>,
) -> Result<Redirect, StatusCode> {
    store
        .read()
        .unwrap()
        .get(&slug)
        .map(|url| Redirect::temporary(url))
        .ok_or(StatusCode::NOT_FOUND)
}

async fn list_urls(
    State(store): State<UrlStore>,
) -> Json<Vec<UrlResponse>> {
    let store = store.read().unwrap();
    let urls: Vec<UrlResponse> = store
        .iter()
        .map(|(slug, url)| UrlResponse {
            slug: slug.clone(),
            url: url.clone(),
        })
        .collect();

    Json(urls)
}

#[tokio::main]
async fn main() {
    let store: UrlStore = Arc::new(RwLock::new(HashMap::new()));

    let app = Router::new()
        .route("/urls", post(create_url).get(list_urls))
        .route("/:slug", get(redirect_url))
        .with_state(store);

    println!("Listening on http://0.0.0.0:3000");
    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
```

## Wrapping Up

And that is it for Part 1!
We have a fully working URL shortener API in about 70 lines of Rust.
Axum made routing, JSON handling, and shared state remarkably painless.

A few things worth noting if you want to extend this on your own:

- **Validation** — we are not checking if the incoming URL is actually a valid URL. The [url](https://docs.rs/url/latest/url/) crate is great for that.
- **Persistence** — our `HashMap` disappears when the server stops. Swapping in SQLite via [sqlx](https://docs.rs/sqlx/latest/sqlx/) would be a natural next step.
- **Error handling** — the `.unwrap()` calls on our `RwLock` are fine for a tutorial, but in production you would want to handle poisoned locks gracefully.

In the next part of this series, we will add database persistence with [sqlx](https://docs.rs/sqlx/latest/sqlx/) so our URLs survive a server restart.
Stay tuned!

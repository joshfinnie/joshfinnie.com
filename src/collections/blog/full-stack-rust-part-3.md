---
title: "Full-Stack Rust Part 3"
date: "2026-03-16"
tags:
  - "rust"
  - "web-development"
  - "full-stack"
  - "programming"
  - "tutorial"
slug: "full-stack-rust-part-3"
series: "full-stack-rust"
heroImage: "blog/fullstack-rust"
unsplash: "Jan Mellström"
unsplashURL: "mrjane"
description: "Part 3 of building a full-stack URL shortener in Rust. We add custom error types, URL validation, and structured JSON error responses to our Axum API."
draft: true
---

This is a 6 part blog post series about writing a full-stack application in Rust.
In this third part we will be adding proper error handling and URL validation.
Here is the full series outline:

1. **Axum Backend Basics** — routes, shared state, and an in-memory URL shortener
2. **Database Persistence** — swapping the HashMap for a real database with sqlx
3. **Error Handling & Validation** (this post) — custom error types, URL validation, and graceful responses
4. **Authentication** — API keys and auth middleware
5. **Yew.rs Frontend** — building an SPA that talks to our API
6. **Deployment** — Dockerizing the app and serving Yew from Axum

## The Problem

Take a look at the error handling from Part 2.
When something goes wrong, we return a bare `StatusCode` — no message, no context, nothing.
If a user hits a slug that does not exist, they get a `404` with an empty body.
If the database blows up, they get a `500` with an empty body.

That is not a great API experience.

On top of that, we are not validating URLs at all.
Someone could POST `{"url": "lol not a url"}` and we would happily store it in the database.
Let's fix both of these issues.

## Adding Dependencies

We need the `url` crate for URL validation, and we need the `macros` feature on Axum:

```toml
[dependencies]
axum = { version = "0.6", features = ["macros"] }
serde = { version = "1", features = ["derive"] }
serde_json = "1"
tokio = { version = "1", features = ["full"] }
nanoid = "0.4"
sqlx = { version = "0.7", features = ["runtime-tokio", "sqlite"] }
chrono = { version = "0.4", features = ["serde"] }
url = "2"
```

The `macros` feature is not strictly required for what we are doing, but it unlocks some helpful derive macros that we will use shortly.
The `url` crate is the standard Rust library for parsing and validating URLs.

## Defining a Custom Error Type

Let's create an `AppError` struct that carries both an HTTP status code and a human-readable message:

```rust
use axum::http::StatusCode;
use serde::Serialize;

#[derive(Debug, Serialize)]
struct AppError {
    #[serde(skip)]
    status: StatusCode,
    message: String,
}
```

The `#[serde(skip)]` on `status` is important.
We do not want to serialize the status code into our JSON response body — it will already be the HTTP status code on the response itself.
The JSON body just needs the `message`.

## Helper Constructors

Writing `AppError { status: StatusCode::BAD_REQUEST, message: "...".to_string() }` everywhere would get old fast.
Let's add some helper constructors:

```rust
impl AppError {
    fn bad_request(message: impl Into<String>) -> Self {
        Self {
            status: StatusCode::BAD_REQUEST,
            message: message.into(),
        }
    }

    fn not_found(message: impl Into<String>) -> Self {
        Self {
            status: StatusCode::NOT_FOUND,
            message: message.into(),
        }
    }

    fn internal(message: impl Into<String>) -> Self {
        Self {
            status: StatusCode::INTERNAL_SERVER_ERROR,
            message: message.into(),
        }
    }
}
```

Using `impl Into<String>` means we can pass in either a `String` or a `&str` — whichever is convenient at the call site.

## Implementing IntoResponse

For Axum to use our `AppError` as a return type, it needs to implement `IntoResponse`.
This is where we control exactly what the client sees:

```rust
use axum::response::{IntoResponse, Response};
use axum::Json;

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let body = serde_json::json!({
            "error": self.message,
        });

        (self.status, Json(body)).into_response()
    }
}
```

Every error response will now be a JSON object like `{"error": "URL not found"}` with the appropriate HTTP status code.
Clean and consistent.

## Converting sqlx Errors

We have `sqlx::Error` popping up all over our handlers.
Let's implement `From<sqlx::Error>` so we can use the `?` operator without manual `.map_err()` calls:

```rust
impl From<sqlx::Error> for AppError {
    fn from(err: sqlx::Error) -> Self {
        AppError::internal(format!("Database error: {}", err))
    }
}
```

Now any sqlx error automatically converts into an `AppError` with a 500 status.
In a production app you might want to log the actual error and return a generic message to the client, but this is fine for our tutorial.

## URL Validation

Here is our validation function.
We parse the URL and make sure it uses either `http` or `https`:

```rust
fn validate_url(input: &str) -> Result<(), AppError> {
    let parsed = url::Url::parse(input)
        .map_err(|_| AppError::bad_request(format!("Invalid URL: {}", input)))?;

    match parsed.scheme() {
        "http" | "https" => Ok(()),
        scheme => Err(AppError::bad_request(
            format!("Unsupported URL scheme '{}'. Only http and https are allowed.", scheme),
        )),
    }
}
```

This catches two categories of bad input.
First, anything that is not a valid URL at all (like `"not a url"`).
Second, URLs with schemes we do not want to support — imagine someone storing a `file:///etc/passwd` URL in your shortener.
We only allow `http` and `https`.

## Updating the Handlers

Now let's update our handlers to use `AppError` instead of bare `StatusCode`.

**Create a short URL:**

```rust
async fn create_url(
    State(pool): State<SqlitePool>,
    Json(payload): Json<CreateUrl>,
) -> Result<(StatusCode, Json<UrlResponse>), AppError> {
    validate_url(&payload.url)?;

    let slug = nanoid::nanoid!(6);

    let url_row = sqlx::query_as::<_, UrlResponse>(
        "INSERT INTO urls (slug, url) VALUES (?, ?) RETURNING slug, url, created_at"
    )
    .bind(&slug)
    .bind(&payload.url)
    .fetch_one(&pool)
    .await?;

    Ok((StatusCode::CREATED, Json(url_row)))
}
```

Look how clean that is.
The `validate_url(&payload.url)?` line either passes silently or returns a 400 error with a helpful message.
The `?` on the sqlx query either gives us the row or returns a 500 error.
No more `.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)` noise.

**Redirect from a slug:**

```rust
async fn redirect_url(
    State(pool): State<SqlitePool>,
    Path(slug): Path<String>,
) -> Result<Redirect, AppError> {
    let row = sqlx::query_as::<_, UrlResponse>(
        "SELECT slug, url, created_at FROM urls WHERE slug = ?"
    )
    .bind(&slug)
    .fetch_optional(&pool)
    .await?;

    row.map(|r| Redirect::temporary(&r.url))
        .ok_or_else(|| AppError::not_found(format!("No URL found for slug '{}'", slug)))
}
```

Now when someone hits a slug that does not exist, they get a JSON response like `{"error": "No URL found for slug 'abc123'"}` instead of an empty 404.

**List all URLs:**

```rust
async fn list_urls(
    State(pool): State<SqlitePool>,
) -> Result<Json<Vec<UrlResponse>>, AppError> {
    let urls = sqlx::query_as::<_, UrlResponse>(
        "SELECT slug, url, created_at FROM urls ORDER BY created_at DESC"
    )
    .fetch_all(&pool)
    .await?;

    Ok(Json(urls))
}
```

The list handler barely changed.
We just swapped `StatusCode` for `AppError` and let the `?` operator do the rest.

## The Full Code

Here is the complete `src/main.rs`:

```rust
use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::{IntoResponse, Redirect, Response},
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

#[derive(Debug, Serialize)]
struct AppError {
    #[serde(skip)]
    status: StatusCode,
    message: String,
}

impl AppError {
    fn bad_request(message: impl Into<String>) -> Self {
        Self {
            status: StatusCode::BAD_REQUEST,
            message: message.into(),
        }
    }

    fn not_found(message: impl Into<String>) -> Self {
        Self {
            status: StatusCode::NOT_FOUND,
            message: message.into(),
        }
    }

    fn internal(message: impl Into<String>) -> Self {
        Self {
            status: StatusCode::INTERNAL_SERVER_ERROR,
            message: message.into(),
        }
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let body = serde_json::json!({
            "error": self.message,
        });

        (self.status, Json(body)).into_response()
    }
}

impl From<sqlx::Error> for AppError {
    fn from(err: sqlx::Error) -> Self {
        AppError::internal(format!("Database error: {}", err))
    }
}

fn validate_url(input: &str) -> Result<(), AppError> {
    let parsed = url::Url::parse(input)
        .map_err(|_| AppError::bad_request(format!("Invalid URL: {}", input)))?;

    match parsed.scheme() {
        "http" | "https" => Ok(()),
        scheme => Err(AppError::bad_request(
            format!("Unsupported URL scheme '{}'. Only http and https are allowed.", scheme),
        )),
    }
}

async fn create_url(
    State(pool): State<SqlitePool>,
    Json(payload): Json<CreateUrl>,
) -> Result<(StatusCode, Json<UrlResponse>), AppError> {
    validate_url(&payload.url)?;

    let slug = nanoid::nanoid!(6);

    let url_row = sqlx::query_as::<_, UrlResponse>(
        "INSERT INTO urls (slug, url) VALUES (?, ?) RETURNING slug, url, created_at"
    )
    .bind(&slug)
    .bind(&payload.url)
    .fetch_one(&pool)
    .await?;

    Ok((StatusCode::CREATED, Json(url_row)))
}

async fn redirect_url(
    State(pool): State<SqlitePool>,
    Path(slug): Path<String>,
) -> Result<Redirect, AppError> {
    let row = sqlx::query_as::<_, UrlResponse>(
        "SELECT slug, url, created_at FROM urls WHERE slug = ?"
    )
    .bind(&slug)
    .fetch_optional(&pool)
    .await?;

    row.map(|r| Redirect::temporary(&r.url))
        .ok_or_else(|| AppError::not_found(format!("No URL found for slug '{}'", slug)))
}

async fn list_urls(
    State(pool): State<SqlitePool>,
) -> Result<Json<Vec<UrlResponse>>, AppError> {
    let urls = sqlx::query_as::<_, UrlResponse>(
        "SELECT slug, url, created_at FROM urls ORDER BY created_at DESC"
    )
    .fetch_all(&pool)
    .await?;

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

## Testing the Error Responses

Let's fire up the server and see our new error handling in action.

```bash
$ export DATABASE_URL="sqlite:urls.db"
$ cargo run
```

Try submitting an invalid URL:

```bash
$ curl -X POST http://localhost:3000/urls \
  -H "Content-Type: application/json" \
  -d '{"url": "not a url at all"}'
```

```json
{"error": "Invalid URL: not a url at all"}
```

Try a `file://` URL:

```bash
$ curl -X POST http://localhost:3000/urls \
  -H "Content-Type: application/json" \
  -d '{"url": "file:///etc/passwd"}'
```

```json
{"error": "Unsupported URL scheme 'file'. Only http and https are allowed."}
```

Try a slug that does not exist:

```bash
$ curl http://localhost:3000/nope42
```

```json
{"error": "No URL found for slug 'nope42'"}
```

Every error now returns a structured JSON response with a helpful message.
Your API consumers will thank you.

## Wrapping Up

We went from bare status codes to structured, informative error responses.
Our API now validates URLs before storing them and gives clear feedback when something goes wrong.

The pattern we used — a custom error struct with `IntoResponse` and `From` implementations — is a common one in Axum applications.
It scales well as your app grows because adding new error types is just a matter of adding another constructor method.

In the next part of this series, we will add authentication with API keys and middleware so that not just anyone can create short URLs.
Stay tuned!

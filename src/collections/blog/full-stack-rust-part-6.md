---
title: "Full-Stack Rust Part 6"
date: "2026-04-27"
tags:
  - "rust"
  - "web-development"
  - "full-stack"
  - "programming"
  - "tutorial"
  - "docker"
  - "deployment"
slug: "full-stack-rust-part-6"
series: "full-stack-rust"
heroImage: "blog/fullstack-rust"
unsplash: "ChatGPT"
description: "Part 6 of building a full-stack URL shortener in Rust. We serve the Yew frontend from Axum, Dockerize the whole thing, and deploy to Shuttle."
draft: true
---

This is a 6 part blog post series about writing a full-stack application in Rust.
In this final part we will be serving the frontend from Axum, Dockerizing everything, and deploying to Shuttle.
Here is the full series outline:

1. **Axum Backend Basics** — routes, shared state, and an in-memory URL shortener
2. **Database Persistence** — swapping the HashMap for a real database with sqlx
3. **Error Handling & Validation** — custom error types, URL validation, and graceful responses
4. **Authentication** — API keys and auth middleware
5. **Yew.rs Frontend** — building an SPA that talks to our API
6. **Deployment** (this post) — Dockerizing the app and serving Yew from Axum

## Serving the Frontend from Axum

In Part 5 we ran the frontend and backend as separate processes. That works for development, but for production we want a single binary that serves everything. Let's build the Yew frontend into static files and have Axum serve them.

First, build the frontend with Trunk:

```bash
$ cd frontend
$ trunk build --release
```

This creates a `frontend/dist/` directory with your `index.html`, the compiled WASM binary, and any JavaScript glue code. Everything the browser needs is right there.

Now let's tell Axum to serve these files. Add `tower-http` with the `fs` feature to the backend's `Cargo.toml` if you have not already:

```toml
[dependencies]
tower-http = { version = "0.5", features = ["cors", "fs"] }
```

Then update your router in `backend/src/main.rs`:

```rust
use tower_http::services::ServeDir;

let frontend = ServeDir::new("../frontend/dist");

let app = Router::new()
    .nest("/api", protected.merge(public))
    .fallback_service(frontend)
    .with_state(state)
    .layer(cors);
```

There are two important changes here. First, we nest all our API routes under `/api`. So `/urls` becomes `/api/urls` and `/:slug` becomes `/api/:slug`. Second, we use `fallback_service` with `ServeDir` to serve the frontend for any route that does not match an API endpoint. This is what makes client-side routing work — any unknown path gets `index.html` and Yew takes over from there.

Do not forget to update your frontend code to use the `/api` prefix for all API calls.

```rust
// Before
let response = reqwasm::http::Request::get("/urls")

// After
let response = reqwasm::http::Request::get("/api/urls")
```

You will also want to update the redirect handler. Since short URL redirects now live at `/api/:slug`, you might want to add a top-level redirect route that forwards `/:slug` to the API handler for a cleaner user experience.

## Dockerizing the Application

Docker lets us build a reproducible image that runs anywhere. We will use a multi-stage build to keep the final image small.

Create a `Dockerfile` in the project root:

```dockerfile
# Stage 1: Build the frontend
FROM rust:1.82-bookworm AS frontend-builder

RUN cargo install trunk
RUN rustup target add wasm32-unknown-unknown

WORKDIR /app
COPY frontend/ frontend/
COPY Cargo.toml .

WORKDIR /app/frontend
RUN trunk build --release

# Stage 2: Build the backend
FROM rust:1.82-bookworm AS backend-builder

WORKDIR /app
COPY backend/ backend/
COPY Cargo.toml .

WORKDIR /app/backend
RUN cargo build --release

# Stage 3: Runtime
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=backend-builder /app/backend/target/release/url-shortener .
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

ENV DATABASE_URL=sqlite:urls.db
EXPOSE 3000

CMD ["./url-shortener"]
```

Let's walk through the three stages. The first stage installs Trunk and builds our Yew frontend to WASM. The second stage builds the Axum backend in release mode. The third stage starts from a minimal Debian image, copies in just the compiled binary and the frontend assets, and runs the server.

The final image will be around 80-100 MB, which is pretty good for a full-stack app with both a backend and a WASM frontend.

Build and run it:

```bash
$ docker build -t url-shortener .
$ docker run -p 3000:3000 -e API_KEY=my-secret-key url-shortener
```

Open `http://localhost:3000` and you should see your URL shortener running from a single container.

## Deploying to Shuttle

[Shuttle](https://www.shuttle.rs/) is a deployment platform built specifically for Rust. It handles provisioning, building, and hosting so you can go from code to production in a single command.

First, install the CLI:

```bash
$ cargo install cargo-shuttle
```

Now let's update our backend to use Shuttle's runtime. Add the Shuttle dependencies to `backend/Cargo.toml`:

```toml
[dependencies]
shuttle-axum = "0.49"
shuttle-runtime = "0.49"
shuttle-shared-db = { version = "0.49", features = ["sqlite"] }
```

The main change is replacing our `#[tokio::main]` function with Shuttle's annotation. Update `backend/src/main.rs`:

```rust
use shuttle_runtime::SecretStore;

#[shuttle_runtime::main]
async fn main(
    #[shuttle_shared_db::Sqlite] pool: SqlitePool,
    #[shuttle_runtime::Secrets] secrets: SecretStore,
) -> shuttle_axum::ShuttleAxum {
    sqlx::migrate!().run(&pool).await.unwrap();

    let api_key = secrets
        .get("API_KEY")
        .expect("API_KEY secret must be set");

    let state = AppState { pool, api_key };

    let protected = Router::new()
        .route("/api/urls", post(create_url))
        .route("/api/urls/:slug", delete(delete_url))
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            require_api_key,
        ));

    let public = Router::new()
        .route("/api/urls", get(list_urls))
        .route("/api/:slug", get(redirect_url));

    let frontend = ServeDir::new("frontend/dist");

    let app = Router::new()
        .merge(protected)
        .merge(public)
        .fallback_service(frontend)
        .with_state(state);

    Ok(app.into())
}
```

Shuttle injects the database pool and secrets automatically. No connection strings to manage, no infrastructure to provision.

Create a `Secrets.toml` file in the backend directory for your secrets:

```toml
API_KEY = "your-production-api-key-here"
```

Build the frontend and deploy:

```bash
$ cd frontend
$ trunk build --release
$ cd ../backend
$ cargo shuttle deploy
```

Shuttle will build your backend in the cloud, provision a SQLite database, and give you a URL. That is it. Your full-stack Rust URL shortener is live on the internet.

## What We Built

Let's take a step back and appreciate what we have accomplished over these six posts.

1. **Part 1** — We built an Axum backend with in-memory storage, learned about shared state with `Arc<RwLock<_>>`, and created our first API endpoints.
2. **Part 2** — We swapped the HashMap for SQLite using sqlx, added migrations, and made our data persistent.
3. **Part 3** — We added proper error handling with custom `AppError` types, validated URLs with the `url` crate, and returned meaningful error responses.
4. **Part 4** — We added API key authentication with Axum middleware, learned about Tower layers, and split our routes into protected and public groups.
5. **Part 5** — We built a Yew frontend that compiles to WebAssembly, created components with hooks, and connected everything to our API.
6. **Part 6** — We served the frontend from Axum, Dockerized the whole stack, and deployed to Shuttle.

The end result is a full-stack web application written entirely in Rust. One language for the server, one language for the browser, one language for the build tooling. That is pretty remarkable.

## Where to Go from Here

Our URL shortener is functional, but there is plenty of room to grow. Here are some ideas if you want to keep building:

- **Custom slugs** — let users choose their own slug instead of always generating a random one. You would need a uniqueness check and some validation rules.
- **Expiration** — add a `created_at` timestamp and an optional TTL so URLs can expire automatically.
- **Analytics** — track click counts, referrers, and geographic data. This is where a URL shortener gets really interesting.
- **User accounts** — replace the single API key with a proper user system. Each user gets their own URLs and their own API keys.
- **PostgreSQL** — SQLite is great for getting started, but if you expect real traffic you would want to move to Postgres. Sqlx makes this a one-line change in the connection string.

## Thank You

Thank you for following along with this series. Building full-stack applications in Rust is still a relatively young practice, and I hope this walkthrough showed that it is not only possible but genuinely enjoyable. The ecosystem has come a long way.

If you have questions, feedback, or just want to share what you built, find me on Mastodon at [@joshfinnie@fosstodon.org](https://fosstodon.org/@joshfinnie). I would love to hear from you.

Happy hacking!

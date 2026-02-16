---
title: "Full-Stack Rust Part 5"
date: "2026-04-13"
tags:
  - "rust"
  - "web-development"
  - "full-stack"
  - "programming"
  - "tutorial"
  - "yew"
  - "wasm"
slug: "full-stack-rust-part-5"
series: "full-stack-rust"
heroImage: "blog/fullstack-rust"
unsplash: "Jan Mellström"
unsplashURL: "mrjane"
description: "Part 5 of building a full-stack URL shortener in Rust. We build a Yew.rs frontend that compiles to WebAssembly and talks to our Axum API."
draft: true
---

This is a 6 part blog post series about writing a full-stack application in Rust.
In this fifth part we will be building a frontend with [Yew.rs](https://yew.rs/) that compiles to WebAssembly.
Here is the full series outline:

1. **Axum Backend Basics** — routes, shared state, and an in-memory URL shortener
2. **Database Persistence** — swapping the HashMap for a real database with sqlx
3. **Error Handling & Validation** — custom error types, URL validation, and graceful responses
4. **Authentication** — API keys and auth middleware
5. **Yew.rs Frontend** (this post) — building an SPA that talks to our API
6. **Deployment** — Dockerizing the app and serving Yew from Axum

## What is Yew?

[Yew](https://yew.rs/) is a component-based framework for building web applications in Rust. If you have used React, the mental model will feel very familiar: you build components, manage state with hooks, and render HTML-like markup. The big difference is that Yew compiles to WebAssembly, so your frontend runs at near-native speed in the browser.

It is not the only Rust frontend framework out there (Leptos and Dioxus are also excellent), but Yew has been around the longest and has a mature ecosystem. For our URL shortener, it is a perfect fit.

## Restructuring into a Workspace

Up to now all our code has lived in a single crate. With a frontend in the mix, let's restructure into a [Cargo workspace](https://doc.rust-lang.org/book/ch14-03-cargo-workspaces.html).

```bash
$ mkdir backend frontend
$ mv src/ backend/
$ mv Cargo.toml backend/
```

Now create a workspace-level `Cargo.toml` in the project root:

```toml
[workspace]
members = ["backend", "frontend"]
```

And initialize the frontend crate:

```bash
$ cd frontend
$ cargo init
```

Your project should now look like this:

```
url-shortener/
  Cargo.toml          # workspace
  backend/
    Cargo.toml
    src/
      main.rs
  frontend/
    Cargo.toml
    src/
      main.rs
```

## Frontend Dependencies

Open `frontend/Cargo.toml` and add our dependencies:

```toml
[dependencies]
yew = { version = "0.21", features = ["csr"] }
reqwasm = "0.5"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
wasm-bindgen-futures = "0.4"
web-sys = { version = "0.3", features = ["HtmlInputElement"] }
gloo = "0.11"
```

A quick rundown:

- **yew** with `csr` — client-side rendered Yew components
- **reqwasm** — a simple HTTP client that works in WASM
- **serde / serde_json** — JSON serialization, same as the backend
- **wasm-bindgen-futures** — lets us `.await` futures in WASM land
- **web-sys** — raw DOM bindings; we need `HtmlInputElement` for reading form inputs
- **gloo** — utility crate for common browser APIs (timers, console, etc.)

## Installing Trunk

[Trunk](https://trunkrs.dev/) is the go-to build tool for Rust WASM apps. It handles compiling your Rust code to WebAssembly, bundling assets, and serving with hot reload.

```bash
$ cargo install trunk
$ rustup target add wasm32-unknown-unknown
```

The `wasm32-unknown-unknown` target is what lets Rust compile to WebAssembly. Without it, Trunk will not know what to do.

Now create a minimal `frontend/index.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>URL Shortener</title>
</head>
<body></body>
</html>
```

That is it. Trunk will inject the WASM bundle and a small JavaScript glue file automatically. No webpack, no node_modules, no bundler config.

## Shared Types

Our frontend needs to speak the same JSON language as our backend. Let's define the shared types in `frontend/src/types.rs`:

```rust
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, Deserialize, Serialize)]
pub struct UrlResponse {
    pub slug: String,
    pub url: String,
}

#[derive(Serialize)]
pub struct CreateUrlRequest {
    pub url: String,
}
```

These mirror the structs on the backend. In a larger project you might extract them into a shared crate, but for our purposes duplicating them is fine.

## The URL List Component

Let's start with a component that fetches and displays all our shortened URLs. Create `frontend/src/url_list.rs`:

```rust
use yew::prelude::*;
use crate::types::UrlResponse;

#[derive(Properties, PartialEq)]
pub struct UrlListProps {
    pub refresh_counter: u32,
}

#[function_component(UrlList)]
pub fn url_list(props: &UrlListProps) -> Html {
    let urls = use_state(|| Vec::<UrlResponse>::new());
    let loading = use_state(|| true);

    {
        let urls = urls.clone();
        let loading = loading.clone();
        let refresh = props.refresh_counter;

        use_effect_with(refresh, move |_| {
            loading.set(true);
            wasm_bindgen_futures::spawn_local(async move {
                let response = reqwasm::http::Request::get("/urls")
                    .send()
                    .await
                    .unwrap();

                let fetched: Vec<UrlResponse> = response
                    .json()
                    .await
                    .unwrap();

                urls.set(fetched);
                loading.set(false);
            });
            || ()
        });
    }

    if *loading {
        return html! { <p>{ "Loading..." }</p> };
    }

    html! {
        <div>
            <h2>{ "Shortened URLs" }</h2>
            if urls.is_empty() {
                <p>{ "No URLs yet. Create one above!" }</p>
            } else {
                <table>
                    <thead>
                        <tr>
                            <th>{ "Slug" }</th>
                            <th>{ "URL" }</th>
                        </tr>
                    </thead>
                    <tbody>
                        { for urls.iter().map(|url| html! {
                            <tr>
                                <td><a href={ format!("/{}", url.slug) }>{ &url.slug }</a></td>
                                <td>{ &url.url }</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            }
        </div>
    }
}
```

The `use_effect_with` hook takes a dependency (our `refresh_counter`) and re-runs whenever it changes. This is how we will trigger a re-fetch after creating a new URL.

## The Create Form Component

Now let's build the form for creating new short URLs. Create `frontend/src/create_form.rs`:

```rust
use web_sys::HtmlInputElement;
use yew::prelude::*;
use crate::types::CreateUrlRequest;

#[derive(Properties, PartialEq)]
pub struct CreateFormProps {
    pub on_created: Callback<()>,
    pub api_key: AttrValue,
}

#[function_component(CreateForm)]
pub fn create_form(props: &CreateFormProps) -> Html {
    let url_input = use_state(|| String::new());
    let loading = use_state(|| false);
    let error = use_state(|| Option::<String>::None);

    let oninput = {
        let url_input = url_input.clone();
        Callback::from(move |e: InputEvent| {
            let input: HtmlInputElement = e.target_unchecked_into();
            url_input.set(input.value());
        })
    };

    let onsubmit = {
        let url_input = url_input.clone();
        let loading = loading.clone();
        let error = error.clone();
        let on_created = props.on_created.clone();
        let api_key = props.api_key.clone();

        Callback::from(move |e: SubmitEvent| {
            e.prevent_default();
            let url = (*url_input).clone();
            let loading = loading.clone();
            let error = error.clone();
            let on_created = on_created.clone();
            let api_key = api_key.clone();
            let url_input = url_input.clone();

            if url.is_empty() {
                error.set(Some("Please enter a URL.".to_string()));
                return;
            }

            loading.set(true);
            error.set(None);

            wasm_bindgen_futures::spawn_local(async move {
                let body = serde_json::to_string(&CreateUrlRequest { url })
                    .unwrap();

                let result = reqwasm::http::Request::post("/urls")
                    .header("Content-Type", "application/json")
                    .header("Authorization", &format!("Bearer {}", api_key))
                    .body(body)
                    .send()
                    .await;

                loading.set(false);

                match result {
                    Ok(resp) if resp.ok() => {
                        url_input.set(String::new());
                        on_created.emit(());
                    }
                    Ok(resp) => {
                        error.set(Some(format!("Server error: {}", resp.status())));
                    }
                    Err(e) => {
                        error.set(Some(format!("Network error: {}", e)));
                    }
                }
            });
        })
    };

    html! {
        <form {onsubmit}>
            <h2>{ "Create Short URL" }</h2>
            <input
                type="text"
                placeholder="https://example.com/long-url"
                value={ (*url_input).clone() }
                {oninput}
                disabled={ *loading }
            />
            <button type="submit" disabled={ *loading }>
                if *loading {
                    { "Creating..." }
                } else {
                    { "Shorten" }
                }
            </button>
            if let Some(err) = &*error {
                <p style="color: red;">{ err }</p>
            }
        </form>
    }
}
```

There is a lot going on here, so let's break it down. We use three pieces of state: the input value, a loading flag, and an optional error message. The `oninput` callback updates the input state on every keystroke. The `onsubmit` callback fires when the form is submitted, sends the POST request with the Bearer token, and either clears the form and notifies the parent or displays an error.

The `on_created` callback is how we tell the parent component to refresh the URL list.

## The App Component

Now let's wire everything together. Replace `frontend/src/main.rs`:

```rust
mod create_form;
mod types;
mod url_list;

use create_form::CreateForm;
use url_list::UrlList;
use yew::prelude::*;

#[function_component(App)]
fn app() -> Html {
    let refresh_counter = use_state(|| 0u32);

    let on_created = {
        let refresh_counter = refresh_counter.clone();
        Callback::from(move |_| {
            refresh_counter.set(*refresh_counter + 1);
        })
    };

    html! {
        <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
            <h1>{ "URL Shortener" }</h1>
            <CreateForm {on_created} api_key="super-secret-key-change-me" />
            <hr />
            <UrlList refresh_counter={ *refresh_counter } />
        </div>
    }
}

fn main() {
    yew::Renderer::<App>::new().render();
}
```

The `refresh_counter` pattern is simple but effective. Every time a URL is created, we bump the counter. The `UrlList` component depends on this counter via `use_effect_with`, so it re-fetches automatically.

In a real app you would not hardcode the API key in the component. You would read it from an environment variable at build time or have a proper login flow. For our tutorial, this keeps things moving.

## Adding CORS to the Backend

During development, Trunk serves the frontend on `http://localhost:8080` while Axum runs on `http://localhost:3000`. The browser will block cross-origin requests unless we add CORS headers.

Add `tower-http` to the backend's `Cargo.toml`:

```toml
[dependencies]
tower-http = { version = "0.5", features = ["cors"] }
```

Then wrap your router:

```rust
use tower_http::cors::{Any, CorsLayer};

let cors = CorsLayer::new()
    .allow_origin(Any)
    .allow_methods(Any)
    .allow_headers(Any);

let app = Router::new()
    .merge(protected)
    .merge(public)
    .with_state(state)
    .layer(cors);
```

In production you would lock this down to specific origins, but `Any` is fine for local development.

## Running the Full Stack

Open two terminals. In the first, start the backend:

```bash
$ cd backend
$ cargo run
```

In the second, start the frontend with Trunk's built-in proxy:

```bash
$ cd frontend
$ trunk serve --proxy-backend=http://localhost:3000
```

The `--proxy-backend` flag tells Trunk to forward any requests it cannot handle (like our API calls to `/urls`) to the backend. This means our frontend code can make requests to `/urls` without worrying about CORS during development.

Open `http://localhost:8080` in your browser and you should see the URL shortener interface. Try creating a URL and watch it appear in the list below.

## Wrapping Up

We now have a full-stack Rust application. The backend is Axum with SQLite and API key auth, and the frontend is Yew compiled to WebAssembly. Everything is Rust, from the server to the browser.

Yew's component model is surprisingly productive once you get the hang of it. The `use_state` and `use_effect_with` hooks will feel natural if you have any React experience, and the compiler catches entire categories of bugs before you even open the browser.

A few things you could improve:

- **Styling** — we kept styles minimal. Adding a CSS framework like [Tailwind](https://tailwindcss.com/) via Trunk's asset pipeline would make things look much nicer.
- **Environment variables** — hardcoding the API key in the frontend is not ideal. Trunk supports [environment variable injection](https://trunkrs.dev/configuration/) at build time.
- **Optimistic updates** — instead of waiting for the list to re-fetch, you could immediately add the new URL to the local state.

In the final part of this series, we will serve the Yew frontend directly from Axum, Dockerize the whole thing, and deploy it to [Shuttle](https://www.shuttle.rs/).
Stay tuned!

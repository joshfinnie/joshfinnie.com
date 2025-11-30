---
title: "Full-Stack Rust Part 1"
date: "2023-04-28"
tags:
  - "rust"
  - "web-development"
  - "full-stack"
  - "programming"
  - "tutorial"
slug: "full-stack-rust-part-1"
heroImage: "/assets/blog/rust-stack.jpg"
unsplash: "Jan Mellström"
unsplashURL: "mrjane"
description: "<DESCRIPTION>"
---

This is a 2 part blog post about writting a full-stack application in rust.
In this first part we will be diving into [Axum](https://docs.rs/axum/latest/axum/) for the backend.
And in the second part, we will be spin up [Yew.rs](https://yew.rs) for the frontend.

If the second part of the post is published, you can [find it here](/blog/full-stack-rust-part-2/).

I have been building this example live [on Twitch](https://twitch.tv/joshfinnie).
If you love watching folks code, please come on over and give me a follow!

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
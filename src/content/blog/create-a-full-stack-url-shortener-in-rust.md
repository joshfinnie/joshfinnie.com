---
title: "Create a Full-Stack URL Shortener in Rust"
date: "2023-03-15"
tags:
  - "rust"
  - "tutorial"
  - "yew"
  - "programming"
slug: "creating-a-full-stack-url-shortener-in-rust"
heroImage: "/assets/blog/links.jpg"
unsplash: "Maria Oswalt"
unsplashURL: "mcoswalt"
description: "<DESCRIPTION>"
---

In this tutorial, we are going to be building a full-stack URL shortener using [Rust](https://www.rust-lang.org/).
We will be using the following to help us:

- [Axum](https://docs.rs/axum/latest/axum/) for our backend.
- [SQLx](https://github.com/launchbadge/sqlx) to communicate with our [Postgresql](https://www.postgresql.org/) database.
- [HashIDs](https://hashids.org/rust/) to generate user-friendly IDs for the shortened URLs.
- [Yew.rs](https://yew.rs/) for our frontend.

### What are these technologies?

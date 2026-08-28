---
title: "Configuration"
draft: true
date: "2026-08-28"
tags:
  - "rust"
  - "axum"
  - "docker"
  - "tutorial"
series: "pokemon-api"
order: 2
description: "Loading server config from the environment with envconfig, so nothing about the port or CORS rules lives in the binary."
---

Everything the server needs to know before it can start, the port to bind, which origins can call it, comes from the environment rather than the binary itself. That lets us run the same binary locally, in CI, and in a container without changing the application code, only the values around it.

We use the [envconfig](https://docs.rs/envconfig) crate to derive that loading logic instead of writing it by hand.

```rust
use std::net::{IpAddr, Ipv4Addr, SocketAddr};

use envconfig::Envconfig;

#[derive(Clone, Envconfig)]
pub struct AppConf {
    #[envconfig(nested)]
    pub server: ServerConf,
}

impl AppConf {
    pub fn init() -> Result<Self, envconfig::Error> {
        dotenvy::from_filename(".env.local").ok();
        Self::init_from_env()
    }
}

#[derive(Clone, Envconfig)]
pub struct ServerConf {
    #[envconfig(from = "SERVER_PORT", default = "8080")]
    pub port: u16,

    #[envconfig(from = "SERVER_ALLOWED_ORIGINS")]
    pub allowed_origins: String,

    #[envconfig(from = "SERVER_ALLOWED_METHODS")]
    pub allowed_methods: String,

    #[envconfig(from = "SERVER_ALLOWED_HEADERS")]
    pub allowed_headers: String,

    #[envconfig(from = "SERVER_DEFAULT_BODY_LIMIT", default = "1048576")]
    pub default_body_limit: usize,
}

impl ServerConf {
    pub fn addr(&self) -> SocketAddr {
        SocketAddr::new(IpAddr::V4(Ipv4Addr::UNSPECIFIED), self.port)
    }
}
```

`allowed_origins`, `allowed_methods`, and `allowed_headers` stay plain `String`s here rather than `tower_http` or `axum` types. We parse and validate them when we build the CORS middleware in a later part, not here, so `ServerConf` doesn't need to depend on either crate. Config's job is describing what the environment says; turning that into HTTP-specific types is a separate concern with its own part.

`AppConf` is deliberately just a container for `ServerConf` today. As we add the database pool later in the series, its config nests in here the same way, so `AppConf` stays the one place that knows how to load configuration from the environment.

`envconfig` only reads variables that are already in the process environment; it has no idea `.env.local` exists. That's what the `dotenvy::from_filename(".env.local").ok()` line above is for: it loads the file into the environment before `init_from_env` reads it. The `.ok()` matters too, `.env.local` won't exist in CI or in the container this eventually ships in, and that's fine; in those environments the real values are already set as actual environment variables, so there's nothing for dotenvy to load.

```dotenv
# .env.local
SERVER_PORT=8080
SERVER_ALLOWED_ORIGINS=http://localhost:3000
SERVER_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
SERVER_ALLOWED_HEADERS=Content-Type,Authorization
SERVER_DEFAULT_BODY_LIMIT=1048576
```

`.env.local` holds real values for your machine, so it's one of the entries the `.gitignore` from Project Setup already excludes. What we do check in is `.env.example`, the same keys with placeholder values, so cloning the repo is enough to know what needs setting.

```dotenv
# .env.example
SERVER_PORT=8080
SERVER_ALLOWED_ORIGINS=http://localhost:3000
SERVER_ALLOWED_METHODS=GET,POST,PUT,DELETE,OPTIONS
SERVER_ALLOWED_HEADERS=Content-Type,Authorization
SERVER_DEFAULT_BODY_LIMIT=1048576
```

The allowed origins, methods, and headers don't do anything yet. They're read into config here so the CORS middleware we add in a later part has somewhere to pull them from, without needing to touch this file again.

```bash
$ make check
# output omitted
```

At this point, `AppConf::init()` can turn the environment into typed values, but the server doesn't consume any of it yet. That's the next part: building the Axum application and binding it to the address `config.server.addr()` produces.

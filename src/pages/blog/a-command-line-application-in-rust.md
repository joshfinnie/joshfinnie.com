---
title: "A Command-Line Application in Rust"
date: "2022-12-13"
tags:
  - "rust"
  - "command-line"
  - "tutorial"
layout: "../../layouts/BlogPost.astro"
heroImage: "/assets/blog/command-center.jpg"
unsplash: "Ugi K."
unsplashURL: "wizzyfx"
description: "In this blog post we start from scratch and write a full command-line application written in Rust. We use Clap for argument parsing, and Reqwest for hitting the API."
---

Each Monday, I post a record of my last week's music listening.
These now can be found on [Mastodon](https://fosstodon.org/@joshfinnie/109501039676079665) for [reasons](/blog/leaving-twitter-for-mastodon/).
To create these posts, I have been running a small tool I wrote in Python.
But I thought this type of application would make for a good tutorial.

Let's create a small command-line application using Rust!

## Application Creation

I have always been impressed with the ease of creating a new Rust crate.
Running the following command creates all the scaffolding you need.
The following command gets us up and running!

```bash
$ cargo init lfmc
```

The crate we are creating is called `lfmc` for "Last.fm Count".
Feel free to call this whatever you want.
That's it.
We can head into the newly created folder and run our application!

```bash
$ cd lfmc
$ cargo run
   Compiling lfmc v0.1.0 (/Users/joshfinnie/src/lfmc)
    Finished dev [unoptimized + debuginfo] target(s) in 1.96s
     Running `target/debug/lfmc`
Hello, world!
```

Now that we have a great start to our application, we need some more packages to make the application function.

## Adding Crates

We want to add the crate that we are going to use for our application.
First, we need to install [clap](https://crates.io/crates/clap).
This is going to help us parse arguments for our application.

Since Rust 1.62, we have the amazing tool `cargo add` built in!
So let's add clap:

```bash
$ cargo add clap --features derive
```

At the time of writing, this command updated my `Cargo.toml` to read as the following:

```toml
[package]
name = "lfmc"
version = "0.1.0"
edition = "2021"

[dependencies]
clap = { version = "4.0.29", features = ["derive"] }
```

Notice I added the `--features` flag.
This allows us to add specific features of the crates we are using.
Since we will need the `derive` feature of Clap, it is added with the `cargo add` command!

Now let's modify our `src/main.rs` file to run a simplified example application using clap.

```rust
use clap::Parser;

/// Simple program to greet a person
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// Name of the person to greet
    #[arg(short, long)]
    name: String,
}

fn main() {
    let args = Args::parse();
    println!("Hello {}!", args.name)
}
```

When we run this command, we should see the following output for both `--help` and `--name josh`:

```bash
$ cargo run -- --help
Simple program to greet a person

Usage: lfmc --name <NAME>

Options:
  -n, --name <NAME>  Name of the person to greet
  -h, --help         Print help information
  -V, --version      Print version information
  
$ cargo run -- --name Josh
    Finished dev [unoptimized + debuginfo] target(s) in 0.04s
     Running `target/debug/lfmc --name Josh`
Hello Josh!
```

**Note**: We are running our application without building it.
This means we need the `--` to inject the arguments into our application, and not cargo itself.
This will not be needed once we build our application binary.
Other than that little "gotcha", we have an amazing working application.
Let's start expandind it to fit our needs!

Next we will want to add the [reqwest](https://crates.io/crates/reqwest) crate with the `json` and `blocking` features, [serde](https://crates.io/crates/serde) with the `derive` feature, and [serde_json](https://crates.io/crates/serde_json).
We will want to deserialize the json response from our API call.
Also we will not want to have to worry about asynchronous calls due to the complication it adds; `blocking` allows synchronous calls.

```bash
$ cargo add reqwest --features json,blocking
$ cargo add serde --features derive
$ cargo add serde_json
```

Our `Cargo.toml` should look like this:

```toml
[package]
name = "lfmc"
version = "0.1.0"
edition = "2021"

[dependencies]
clap = { version = "4.0.29", features = ["derive"] }
reqwest = { version = "0.11.13", features = ["json", "blocking"] }
serde = { version = "1.0.150", features = ["derive"] }
serde_json = "1.0.89"

```

## Adding Features

It is wonderful we already have a working command-line application.
But we want this application to do something specific.
To not bury the lede, this is what I expect our application to do at the end of this tutorial:

```bash
$ ./lfmc --help
An application to view your latest artists from Last.fm

Usage: lfmc [OPTIONS]

Options:
  -k, --api-key <API_KEY>    Your Last.fm API Key
  -u, --username <USERNAME>  Your Last.fm Username
  -l, --limit <LIMIT>        The limit of Artists
  -p, --period <PERIOD>      The lookback period [default: 7day]
  -h, --help                 Print help information
  -V, --version              Print version information

$ ./lfmc --api-key xxxxx --username joshfinnie --limit 5
     ♫ My Top 5 played artists in the past week: Royal Canoe (4), River Boy (2), Swet Shop Boys (2), 88-Keys (1), & Allie X (1). Via #LastFM ♫
```


If you do not want to read this tutorial, the code is up on Github [here](https://github.com/joshfinnie/lfmc).

Let's first work on implementing the rest of the `Args` struct so that we have the base for the above application.
We'll need to remove the `name` keyword and add the arguments we want to use.
`main.rs` will look like this:

```rust
use clap::Parser;

/// An application to view your latest artists from Last.fm
#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// Your Last.fm API Key
    #[arg(short='k', long)]
    api_key: Option<String>,

    /// Your Last.fm Username
    #[arg(short, long)]
    username: Option<String>,

    /// The limit of Artists
    #[arg(short, long)]
    limit: Option<u8>,

    /// The lookback period
    #[arg(short, long, default_value="7day")]
    period: Option<String>
}

fn main() {
    let args = Args::parse();
    println!("Hello World!")
}
```

I let each of the fields in the `Args` struct be optional because eventually I want to also read off a `.env` file too.
The idea being that if the user has a `.env` file, we will use that but the user could also pass the variables in through arguments.
But that won't be until later.

Also note, I have changed the short character for `api_key`.
Clap defaults to the first letter of the field name, but `a` did not feel right to me.
It is an easy change; made it `k` for "key".

## Building Features

The first step in building our application further is to take the inputs from our user and build a URI that will fetch what we need from Last.fm.
I like to break out logic like this into its own section to keep the overall code clean.
Let's implement a `Config` struct and some functions.

```rust
#[derive(Debug)]
struct Config {
    api_key: String,
    username: String,
    limit: u8,
    period: String,
}

impl Config {
    fn new(api_key: String, username: String, limit: u8, period: String) -> Self {
        Config {
            api_key,
            username,
            limit,
            period,
        }
    }

    fn get_uri(&self) -> String {
        format!(
            "http://ws.audioscrobbler.com/{}/?method={}&user={}&api_key={}&format={}&period={}&limit={}",
            "2.0"
            "user.gettopartists",
            &self.username,
            &self.api_key,
            "json",
            &self.period,
            &self.limit,
        )
    }
}
```

Reviewing the struct above, you can see that we need a few more variables than what we will request from our user.
There are some defaults that I use that do not have a reason to be changed.
Then I implemented two different functions within the `Config` struct.
The first one just creates a populated `Config` struct.
And the second one renders the formatted URI string we will need for the API.

The next step is using that URI we built and reach out to Last.fm. 
We will use the `reqwest` crate and pipe the response into a `serde_json::Value`.
This will allow us to manipulate the data just like JSON.
I have updated our `main` function to do this:

```rust
fn main() {
    let args = Args::parse();

    let c = Config::new(
        args.api_key.unwrap(),
        args.username.unwrap(),
        args.limit.unwrap(),
        args.period.unwrap(),
    );

    let r: Result<_, reqwest::Error> = reqwest::blocking::get(c.get_uri())
        .expect("Error reaching Last.fm")
        .json::<Value>();

    if let Ok(j) = r {
        let artists = j["topartists"]["artist"].as_array().unwrap();
        for a in artists.iter() {
            println!(
                "{} ({})", 
                a["name"].as_str().unwrap(),
                a["playcount"].as_str().unwrap()
            );
        }
    } else {
        panic!("Could not convert response to json");
    }
}
```

Running the below code now gets this information from Last.fm!

```bash
$ cargo run -- --api-key xxxxx --username joshfinnie --limit 5
   Compiling lfmc v0.1.0 (/Users/joshfinnie/src/lfmc)
    Finished dev [unoptimized + debuginfo] target(s) in 1.47s
     Running `target/debug/lfmc --api-key xxxxx --username joshfinnie --limit 5`
Royal Canoe (9)
Hero (3)
Allie X (2)
Art School Girlfriend (1)
Better Oblivion Community Center (1)
```

As you can see, we now get a print out of our top five artists for a given timeframe.
Lastly, we want to convert this into a useful string we can Toot or post where we want to!
To do this, I think we would benefit from an external function.
This will make it a bit more clean.
Below is the external function that creates the output we want:

```rust
fn construct_output(config: Config, json: Value) -> String {
    let period: &str = match config.period.as_str() {
        "overall" => "",
        "7day" => " week",
        "1month" => " month",
        "3month" => " 3 months",
        "6month" => " 6 months",
        "12month" => " year",
        _ => todo!(),
    };

    let mut f = format!(
        "♫ My Top {} played artists in the past{}:",
        config.limit.to_string(),
        period
    );

    let artists = json["topartists"]["artist"].as_array().unwrap();
    for (i, artist) in artists.iter().enumerate() {
        let ending = match i {
            x if x <= (config.limit as usize - 3) => ",",
            x if x == (config.limit as usize - 2) => ", &",
            _ => "",
        };

        f = format!(
            " {} {} ({}){}",
            f,
            artist["name"].as_str().unwrap(),
            artist["playcount"].as_str().unwrap(),
            ending
        );
    }
    f = format!("{}. Via #LastFM ♫", f);
    f.to_string()
}
```

Now, if we call this function from our main function, we get the following output!

```bash
cargo run -- --api-key xxxxx --username joshfinnie --limit 5
   Compiling lfmc v0.1.0 (/Users/joshfinnie/src/lfmc)
    Finished dev [unoptimized + debuginfo] target(s) in 0.93s
     Running `target/debug/lfmc --api-key xxxxx -username joshfinnie --limit 5`
     ♫ My Top 5 played artists in the past week: Royal Canoe (9), Lana Del Rey (3), Tiësto (2), Allie X (1), & Art School Girlfriend (1). Via #LastFM ♫
```

At this point in time, we are excited with the outcome.
We have a command-line application that accepts some variables, reaches out to an API, and spits out a formatted string we can toot!
There are some things that we could clean up and perfect.
But that will probably be for another blog post!

Lastly, we want to build the production binary and finally run it as an application!

```bash
$ cargo build --release
$ ./target/release/lfmc --api-key xxxxx --username joshfinnie --limit 5
     ♫ My Top 5 played artists in the past week: Royal Canoe (4), River Boy (2), Swet Shop Boys (2), 88-Keys (1), & Allie X (1). Via #LastFM ♫
```

Notice it is very quick!
This is such an improvement over my Python version.
I am happy.

## Conclusion

I hope that this blog post has shown how easy it is to get a command-line application up and running.
We showed how to install some helper crates, reach out to an API, and parse the results.
Again, I will throw the code up on Github [here](https://github.com/joshfinnie/lfmc).
And if you have any questions or comments, find me on [Mastodon](https://fosstodon.org/@joshfinnie).
Thanks for reading!

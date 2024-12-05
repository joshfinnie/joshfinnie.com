---
title: "Follow Up: Building a Command-Line Application in Rust"
date: "2023-07-03"
tags:
  - "rust"
  - "command-line"
  - "tutorial"
  - "follow-up"
slug: "follow-up-a-command-line-application-in-rust"
heroImage: "@assets/blog/command-center-2.jpg"
unsplash: "Jp Valery"
unsplashURL: "jpvalery"
description: ""
---

_Updated 2023-07-04_

Late last year, I wrote about [creating a command-line application in rust](/blog/a-command-line-application-in-rust/).
Since then, I have been using it every week to post my most played artists on [Mastodon](https://fosstodon.org/@joshfinnie).
Over the past six months, I have made several updates to the application, and I thought it would be appropriate to inform everyone about the changes.

**Note**: If you prefer to skip the blog post and only read the PR Diff, you can find it [here](https://github.com/joshfinnie/lfmc/pull/1/files).

## Environment Variables

One of the major updates I wanted to implement was the inclusion of a configuration file for users.
This file would contain default values to be used when flags are not provided.
Ideally, running `./lfmc` would read values from the config file and seamlessly work.

To achieve this, I installed the [dirs crate](https://crates.io/crates/dirs), which is a small, low-level library that provides platform-specific standard directory locations for configuration files on Linux, Windows, and macOS.
This not only allows us to update the location of our config file, but it also provides cross-compatibility.

The application fetches the user's HOME directory and then looks for a `.env` file in the `$HOME/.config/lfmc/` folder.
The code then reads the environment variables to be used by the application.
Below is the code that gets this done:

```rust
if let Some(home_dir) = dirs::home_dir() {
    dotenv::from_filename(
        format!("{}/.config/lfmc/.env", home_dir.to_string_lossy())
    ).ok();
}
```

Furthermore, I added default values to the Config struct.
The updated Config struct now appears as follows:

```rust
#[derive(Parser)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// Your Last.fm API Key
    #[arg(short = 'k', long, env = "API_KEY")]
    api_key: String,

    /// Your Last.fm Username
    #[arg(short, long, env = "USERNAME")]
    username: String,

    /// The limit of Artists
    #[arg(short, long, default_value = "5", env = "LIMIT")]
    limit: u16,

    /// The lookback period
    #[arg(short, long, default_value = "7day", env = "PERIOD")]
    period: String,
}
```

## Better Error handling

Another big change I made is dealing with the unneeded `unwrap` functions throughout the code.
I wanted the application to make use of comprehensive error handling.
For error handling, I added the [Anyhow](https://crates.io/crates/anyhow) crate and made the following changes:

```rust
fn construct_output(config: Config, json: Value) -> Result<String> {
   ...
   let artists = json["topartists"]["artist"].as_array().ok_or(
       anyhow!("Error parsing JSON.")
   )?;

   for (i, artist) in artists.iter().enumerate() {
       ...
       let name = artist["name"].as_str().ok_or(
           anyhow!("Artist not found.")
       )?;

       let playcount = artist["playcount"].as_str().ok_or(
           anyhow!("Playcount not found.")
       )?;
       ...
   }
   ...
}
```

Thanks to [Harald Hoyer](https://fosstodon.org/@backslash@floss.social) on Mastodon for the above code, it is much cleaner than my match statement I had before!

## Conclusion

I am extremely pleased with these improvements as they have significantly enhanced the robustness of this command-line application.
Additionally, they have eliminated many of the previously existing bad practices in the application.

Once again, please let me know if there is anything you would change.
You can find me on [Mastodon](https://fosstodon.org/@joshfinnie), and I would love to chat about Rust!

---
title: "Moving from Oh-My-Zsh to Starship & Fish Shell"
date: "2022-04-05"
tags:
  - "tutorial"
  - "terminal"
  - "fish shell"
  - "starship"
slug: "moving-from-oh-my-zsh-to-starship-and-fish-shell"
heroImage: "@assets/blog/fish.jpg"
unsplash: "Milos Prelevic"
unsplashURL: "prelevicm"
description: "I changed my prompt configurator from Oh-My-Zsh to Starship.rs and with that changed my shell to Fish. This blog post tells the story of my upgrade and the pitfalls and benefits of moving to Fish Shell."
---

I have been using [Zsh](https://www.zsh.org/) for almost a decade.
I remember the day that I switched from the default shell Bash to ZSH.
Powered by [Oh-My-Zsh](https://ohmyz.sh/), my terminal was powerful and helpful.
Add on top of that Oh-My-Zsh amazing templates; it was also pretty!

It was an amazing experience, and I recently had that experience again with [Starship.rs](https://starship.rs/).
Switching to Starship.rs meant I broke up with Oh-My-Zsh, and thus Zsh.
With everything back up in the air, I thought this would be a great time to try the [Fish shell](https://fishshell.com/)!

If you want to see why you should make this switch without reading all my specific setup, [click here](#benefits)

## Installing Starship.rs

Since I am on a Macbook Pro and already set up [homebrew](https://brew.sh/) as my package manager, installing Starship.rs was easy.
You need to install Starship.rs through Homebrew. Run the below command and get Fish installed as well!

```bash
$ brew install starship fish
```

With Starship installed, let's update the terminal a bit.
Create a configuration file for Starship:

```bash
$ mkdir -p $HOME/.config
$ touch $HOME/.config/starship.toml
```

Feel free to read [this documentation](https://starship.rs/config/#prompt) to customize your prompt how you like it.
Here is a snippet of mine.
It seems to work for me for now, but terminal prompts are so personal:

```toml
command_timeout = 10000

# Inserts a blank line between shell prompts
add_newline = true

...

[cmd_duration]
min_time = 4
show_milliseconds = false
disabled = false
format = " 🕙 $duration($style) "
style = "bold italic #87A752"
```

## Installing Fish

After completing the install through homebrew, jump into the fish terminal.
Type `fish` and see that you can start using Fish right away.
**Note**: You can always type `exit` to get back to your default shell.
But we want a more permanent solution, below is how we add Fish to our available shells and set it as default:

```bash
$ echo /usr/local/bin/fish | sudo tee -a /etc/shells
$ chsh -s /usr/local/bin/fish
```

These commands mean you are officially using Fish as your shell.

## Configuring Fish

> No configuration needed: fish is designed to be ready to use immediately, without requiring extensive configuration.

On the homepage for Fish is the above quote.
The shell prides itself on clear defaults and powerful built-in features.
But I am a tinkerer and need to configuration Fish a bit.
These are the steps I took to customize.

To facilitate the configuration of Fish, we need to create a config file.
If you have done any customization of Zsh or Bash you are already familiar with this concept.
Where we make these changes is a bit different.
Let's create the file we need:

```bash
$ mkdir -p $HOME/.config/fish
$ echo "set -gx EDITOR emacs" >> $HOME/.config/fish/config.fish
```

The above commands make sure we have a folder to hold our Fish configuration and sets my `EDITOR` variable to emacs.
The next major change we want to do to our Fish configuration file is tie in Starship.rs.

```bash
$ echo "starship init fish | source" >> $HOME/.config/fish/config.fish
```

And with that, we should be using our Starship prompt with Fish!

## Fish Oddities

Using Fish comes with a few oddities that we'll have to deal with.
The biggest difficulty when moving to Fish is the change in how aliases work.

With Zsh I set up some aliases to make my life easier:

```bash
# My Aliases

alias rm='rm -i'
alias cp='cp -i'
alias mv='mv -i'
alias mkdir='mkdir -p'
alias h='history'
alias which='type -a'
alias ..='cd ..'
alias ...='cd ../..'
alias ls='exa -lag --header'
alias edit='vim'
alias ccd='clear && cd'
alias killpyc='find . -name \*.pyc -delete'
alias tmux="tmux -2"
alias latex="docker run -v `pwd`:/tmp latex pdflatex"
alias exa="$HOME/.asdf/installs/rust/nightly/bin/exa"
```

The most important alias I want to cary over Fish is my `ls` alias which uses [exa](https://the.exa.website/).
I have fallen for `exa`, and seeing the normal `ls` is disappointing.
Other aliases are better defaults, but will be helpful to have these in Fish too!

Fish has two different kinds of abbreviations.
`abbr` is manages abbreviations - user-defined words that are replaced with longer phrases after they are entered. <sup>[1](https://fishshell.com/docs/current/cmds/abbr.html)</sup>
`alias` is a simple wrapper for the `function` builtin, which creates a function wrapping a command.<sup>[2](https://fishshell.com/docs/current/cmds/alias.html)</sup>
Since we are trying to mirror Zsh's aliases, we'll use Fish's `abbr`.

First, let's create a file to hold our abbreviations.
Fish has a standard location for additional config files, so let's create that file and edit our abbreviations:

```bash
$ mkdir -p $HOME/.config/fish/conf.d/
$ touch $HOME/.cofig/fish/conf.d/abbr.fish
```

And fill it out:

```bash
abbr rm "rm -i"
abbr cp "cp -i"
abbr mv "mv -i"
abbr mkdir "mkdir -p"
abbr h "history"
abbr which "type -a"
abbr ls "exa -lag --header"
```

Once the abbreviations file is complete, we can add it to our Fish config file.
Add `source $HOME/.config/fish/conf.d/abbr.fish` to the Fish config file.
After reloading the config, we should be able to use our abbreviations.

To test it out, I ran `ls` in the `$HOME/.config/fish/` folder and got this:

```bash
Permissions Size User       Group Date Modified Name
drwxr-xr-x     - joshfinnie staff  3 Apr 15:28  completions
drwxr-xr-x     - joshfinnie staff  3 Apr 16:19  conf.d
.rw-r--r--   181 joshfinnie staff  3 Apr 16:21  config.fish
.rw-r--r--  1.6k joshfinnie staff  3 Apr 16:19  fish_variables
drwxr-xr-x     - joshfinnie staff  3 Apr 15:28  functions
```

Super!

Another thing that is different in Fish than Zsh or Bash is how we set Environment Variables.
With Zsh or Bash, we'd export a variable to set it globally.
But in Fish, there is a different syntax that we will have to use.

Below is an example of setting up the `FZF_DEFAULT_COMMAND` in both Zsh and Fish. It's a small difference, but a noticeable one.

```bash
# Bash
export FZF_DEFAULT_COMMAND='ag -g "" --hidden --ignore .git'

# Fish
set -x FZF_DEFAULT_COMMAND 'ag -g "" --hidden --ignore .git'
```

I do not set many environment variables this way, but if you do this should be an easy update.

## Benefits

Although changing shells can be overwhelming, there are some great benefits to using Fish.

1. It is fast.
   I find interacting with Fish to be snappier than Zsh even when customized at the same level.
2. It is much easier to customize.
   There are plenty of services like Oh-My-Zsh that work for Fish.
   Just to list a few, check out [Fisher](https://github.com/jorgebucaran/fisher) and [Oh-My-Fish](https://github.com/oh-my-fish/oh-my-fish).
3. There is an amazing ecosystem of functions. _I will speak a bit more about functions below._
4. Autocomplete and history search are next level.
   These are available for Zsh too, but Fish's autocomplete feels infinitely better.

### Functions

I listed functions as one of the benefits of Fish.
And I have to admit I have not used them to their full potential yet.
But they are worthy of note.

Within Fish, you can define functions that can do powerful things.
The function can iterate over files, or modify files based on boolean checks.
Your creativity is the only limit Fish functions have.
Below, I write and use a "Hello, World!" function for you to see:

```bash
$ function hello
      echo Hello $argv!
  end

$ hello
Hello

$ hello Josh
Hello Josh!
```

It is that easy.
You can always see what functions are currently available by typing `functions` in the Fish shell.

Another option for you is to write and save function in files.
Any file in your `$fish_function_path` will work as long as it ends with `.fish`.
By default this path includes `$HOME/.config/fish/functions` which is where I'd recommend storing these files.

Per [the documentation](https://fishshell.com/docs/current/language.html#syntax-function) functions are best use as a stronger alias or abbreviation.
So, as we aliased `exa` above, I'll also create a function for this command:

```bash
function lsa
    exa -lag --header $argv
end
```

This function saved at `$HOME/.config/fish/functions/lsa.fish` will now allow me to use `lsa`.
Doing so will trigger the above function and give me the same output as my abbreviated `ls`.
This is nice as it does not expand the abbreviation like `ls` does.
But miles might vary on the importance of that feature.

**Note**: you can also use the `funcsave` command that comes with Fish shell to save any functions you created.
So we could save our `hello` function above by typing `funcsave hello`.
This will write the function to your function folder automatically!

```bash
$ funcsave hello
funcsave: wrote $HOME/.config/fish/functions/hello.fish
```

## Conclusion

This is a quick explanation of how I adopted Fish and Starship.rs for my terminal.
I will be honest, I tried Fish five or so years ago and hated it.
Let's see if my experience is better than last time.
If you have used Starship.rs and Fish, let me know!
Contact me [on Twitter](https://twitter.com/joshfinnie) and I'd love to chat.
So far it has been a nice change-of-pace.

## Also Might Enjoy

- [ASDF: How To Set Up Runtimes on Windows Subsystem for Linux](/blog/setting_up_wsl_with_asdf/)
- [Using Latex through Docker](https://www.joshfinnie.com/blog/latex-through-docker/)

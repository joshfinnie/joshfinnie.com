---
title: "ASDF: How To Set Up Runtimes on Windows Subsystem for Linux"
date: "2021-12-17"
tags:
  - "asdf"
  - "widows"
  - "wsl"
  - "linux"
  - "tutorial"
layout: "../../layouts/BlogPost.astro"
heroImage: "/assets/blog/construction.jpg"
unsplash: "Nicolas J Leclercq"
unsplashURL: "nicolasjleclercq"
description: "In this blog post we discuss how to use ASDF to install and manage different language runtimes in a newly created Ubuntu VM on Windows Subsystem for Linux."
---

I recently updated to Ubuntu 20.04 as the default [Windows Subsystem for Linux (WSL)](https://docs.microsoft.com/en-us/windows/wsl/about). I am excited to jump to the new WSL2 and thought having a fresh start would be a good thing! Even better, I thought I'd write the steps I take to setup a brand new Linux installation for software development. This tutorial does not really depend on WSL too much. It will assume you know what WSL is and will just be discussing what ASDF is and how I use it.

## What is ASDF?

[ASDF](https://asdf-vm.com/) is a command-line tool that allows you to manage many different runtime versions with a single tool. What do I mean by runtime versions? If you’ve ever installed a specific version of ruby (or PHP or Python or Node) to be able to test out some software, you’ve already dealt with this. I am currently using ASDF to manage all my language runtimes. It allows me to switch versions of Node without [NVM](https://github.com/nvm-sh/nvm). It allows me to switch versions of Python without [Pyenv](https://github.com/pyenv/pyenv). It allows me to switch versions of Rust, Go, and a myriad of other languages and tools without having to learn the specific tool for that language.

## How to use ASDF?

The [ASDF website](https://asdf-vm.com/guide/getting-started.html#_3-install-asdf) has good documentation on the install processes not handled here. Again, I did this for my WSL2 instance of Ubuntu so that is what we'll be showing here.

The first thing we need to do is make sure our Ubuntu VM is up-to-date and has the extra packages we'll need for this process. Run the following commands:

```bash
$ sudo apt-get update
$ sudo apt-get install git curl unzip
```

Once we updated our Ubuntu VM, we'll need to install ASDF itself. I prefer to do this via Git so let's run the following commands:

```bash
$ git clone https://github.com/asdf-vm/asdf.git ~/.asdf --branch v0.8.1
$ source ~/.asdf/asdf.sh
```

The above commands will clone the ASDF git repo to your home directory and default to branch `v0.8.1`. I'd recommend using the latest version (v0.8.1 was the latest version at the time of writing this post). You can check what the latest version is [here](https://github.com/asdf-vm/asdf/tags). Once we've cloned the repo, we want to source the script to get ASDF working for our terminal. Note: this will only work for the instance of the terminal we currently have opened. Let's update our shell's rc file (most likely found at `~/.bashrc` or `~/.zshrc`) file to finish the ASDF set up.

```
# ASDF Settings
# append completions to fpath
source ~/.asdf/asdf.sh
fpath=(${ASDF_DIR}/completions $fpath)
# initialise completions with ZSH's compinit
autoload -Uz compinit && compinit
```

After this, we should have ASDF installed! Let's confirm this by running the following command:

```bash
$ asdf --version
v0.8.1
```

## Installing ASDF Plugins

Having ASDF installed on your Ubuntu VM in WSL is cool and all, but the real power of ASDF is the plugins that allow you to control these runtimes. The next part of this post will discuss the runtimes I use ASDF for and how I get them up-and-running. There are a list of ASDF community plugins [here](https://github.com/asdf-community), but I always end up googling "asdf <language>" to find the plugin I want to use.

Below, I am going to show my setup to install node and python. I do use ASDF to handle more runtimes (like deno, terraform, rust, go, and some PBS resources, but I thought it was getting a bit repetitive.) Below, let's install Node!

```bash
$ asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
$ asdf list all nodejs 16
16.0.0
16.1.0
16.2.0
16.3.0
$ asdf install nodejs 16.3.0
$ asdf global nodejs 16.3.0
```

Above, I install the `nodejs` plugin for ASDF. You can tell ASDF where to install the plugin from; in this case, we are using ASDF's version found [here](https://github.com/asdf-vm/asdf-nodejs). I then use the `list all nodejs 16` command to search for all versions of node v16 that ASDF knows about. The `install nodejs 16.3.0` installs the latest v16 version of node. The `global nodejs 16.3.0` command sets my system's global node to the v16.3.0 version. This updates a file `~/.tool-versions` to show this:

```bash
$ cat ~/.tool-versions
nodejs 16.3.0
$ node --version
v16.3.0
```

Amazing. We are now using ASDF to control our version of Node on our Ubuntu VM! Python is a little more complicated. We will have to make sure we have the requirements the plugin requires. Each plugin is a little different; I give the README a good scan to make sure I understand what we have to do. Python is also a little different because I often switch between two versions of python. This shows us a good example on how to manage different versions of a runtime.

```bash
$ sudo apt-get update
$ sudo apt-get install make libssl-dev build-essential zlib1g-dev libbz2-dev libreadline-dev libsqlite3-dev wget llvm libncursesw5-dev xz-utils tk-dev libxml2-dev libxmlsec1-dev libffi-dev liblzma-dev
$ asdf install python 3.8.12
$ asdf install python 3.10.1
$ asdf global python 3.10.1
```

Above you can see that we need to install a few more packages for Ubuntu. This plugin uses [python-build](https://github.com/pyenv/pyenv/tree/master/plugins/python-build) behind the scenes and we're actually building Python from scratch here. Once we install the needed packages, we use ASDF in add the specific 3.8 version of python I need. Lastly we install the latest version of python to use everywhere else. The `global python 3.10.1` command ensures that. Again, let's take a look at our `~/.tool-versions` file to confirm:

```bash
$ cat ~/.tool-versions
python 3.10.1
nodejs 16.3.0
$ python --version
Python 3.10.1
```

There we have it! Both the python and node runtimes installed and managed by ASDF. Remember how I need python 3.8.12 for a specific project. ASDF has this covered for us too! We can use a local `.tool-versions` file to override any global versions of that runtime. It's pretty seamless, `cd` into that specific project and ASDF changes my python runtime from 3.10.1 to 3.8.12. This is also super helpful when dealing with rust as there are a few features of the nightly build I still like to use, but prefer to try rust stable first.

## Conclusion

There you have it. This is how I go about setting up ASDF on a fresh instance of Ubuntu for the Windows Subsystem for Linux. I realize that this is useful for people using Linux too, but I am a huge fan of where WSL2 is going and am excited to keep trying to use it as a developer. As always, if you want to connect and discuss this post, find me on [Twitter](https://twitter.com/joshfinnie)! Hope this blog post helps you get up-and-running with ASDF.

## Also might enjoy:

- [Using Latex Through Docker](/blog/latex-through-docker/)
- [My Basic Python Dockerfile](/blog/basic-python-dockerfile/)

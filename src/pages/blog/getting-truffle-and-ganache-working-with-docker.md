---
title: "Getting Truffle and Ganache Working with Docker"
date: "2022-03-09"
tags:
  - "web3"
  - "docker"
  - "tutorial"
layout: "../../layouts/BlogPost.astro"
heroImage: "/assets/blog/truffles.jpg"
unsplash: "Jessica Loaiza"
unsplashURL: "jessicaloaizar"
description: "I recently had an issue installing Truffle locally on my computer. There was an issue with my version of Node.js or NPM... Instead of messing up or polluting my global NPM installs further, I took to Docker to get Truffle and Ganache working for me. This post details that journey."
---

We have been experimenting on how to introduce [web3](https://en.wikipedia.org/wiki/Web3) at work.
After using [hardhat](https://hardhat.org/) for all of the [Buildspace](https://buildspace.so/) classes, I thought exploring [Truffle](https://trufflesuite.com/docs/truffle/) and [Ganache](https://trufflesuite.com/docs/ganache/) would be interesting for comparison.
Unfortunately, not everything worked out-of-the-box for me.
And it lead me to try to get a working Truffle/Ganache setup using Docker.

## Understanding the Technology

That introduction used a lot of terms that you might not be familiar with.
You also might not know what in the world _web3_ is.
If so, this section is for you.
If the introduction did not sound like Greek to you, feel free to skip this section and go directly to the [problem statement](#the-problem).

### web3 &amp; Ethereum

Web3 is an iteration of web development based on blockchain technology.
The hopes of this iteration is to decentralize data throughout the web and establish a more universal, accessible economy. <sup>[1](https://en.wikipedia.org/wiki/Web3)</sup>
The two largest blockchain technologies today is Bitcoin and Ethereum.
Ethereum is the blockchain which the libraries mentioned above use.

Ethereum is a decentralized, open-source blockchain technology that has built-in smart contract capability. <sup>[2](https://en.wikipedia.org/wiki/Ethereum)</sup>
The ability for smart contracts is what makes Ethereum so attractive to developers.
This attractiveness is why there is so much tooling around these contracts.

### Solidity

Solidity is a programming language that one uses to write smart contracts. This is the language that is used when you initialize a project with either Hardhat or Truffle.
Even though Solidity was first developed to work with the Ethereum blockchain, it has since expanded to work with different blockchains.
This fact makes it useful to learn if you want to dive into smart contract development.

### Hardhat

Hardhat is an NPM package that creates a development environment to compile, deploy, test, and debug your Ethereum software. <sup>[3](https://hardhat.org/getting-started/)</sup>
This is the most popular tool to develop Ethereum smart contracts.

### Truffle

Truffle is another NPM package.
It is a development environment, testing framework and asset pipeline for blockchains using the Ethereum Virtual Machine.
<sup>[4](https://trufflesuite.com/docs/truffle/)</sup>
Very much like Hardhat, Truffle makes contract development smoother.

### Ganache

Ganache is the third NPM package listed here.
It is a personal blockchain for Ethereum distributed application development. <sup>[5](https://trufflesuite.com/docs/ganache/)</sup>
This allows you to deploy your smart contracts locally and saves you from testing on the real blockchains.
It's the first time that I have explored running my own blockchain.
I usually just use the testnets, but this was a nice alternative.
And I can see using this going forward.

## The Problem

I had issues installing Truffle globally on my computer. (Which is the preferred method per their documentation.)
There seems to be an issue with Truffle and the latest version of NPM; which seems to have been around for [a while](https://github.com/trufflesuite/truffle/issues/1616).
I could not get Truffle to install locally without messing with my global Node.js install.
Below is the error I am getting when I tried the global installation:

```bash
npm ERR! fatal error: too many errors emitted, stopping now [-ferror-limit=]
npm ERR! 20 errors generated.
npm ERR! make: *** [Release/obj.target/leveldb/deps/leveldb/leveldb-1.20/db/builder.o] Error 1
npm ERR! gyp ERR! build error
npm ERR! gyp ERR! stack Error: `make` failed with exit code: 2
npm ERR! gyp ERR! stack     at ChildProcess.onExit (/nodejs/16.3.0/.npm/lib/node_modules/npm/node_modules/node-gyp/lib/build.js:194:23)
npm ERR! gyp ERR! stack     at ChildProcess.emit (node:events:394:28)
npm ERR! gyp ERR! stack     at Process.ChildProcess._handle.onexit (node:internal/child_process:290:12)
npm ERR! gyp ERR! System Darwin 18.7.0
npm ERR! gyp ERR! command "/nodejs/16.3.0/bin/node" "/nodejs/16.3.0/.npm/lib/node_modules/npm/node_modules/node-gyp/bin/node-gyp.js" "rebuild"
npm ERR! gyp ERR! cwd /nodejs/16.3.0/.npm/lib/node_modules/truffle/node_modules/ganache/node_modules/leveldown
npm ERR! gyp ERR! node -v v16.3.0
npm ERR! gyp ERR! node-gyp -v v8.4.1
npm ERR! gyp ERR! not ok

```

I am not a huge fan of installing things globally, especially when it does not work with the latest version of Node.js or NPM.
Luckily, we have tools to help us in these situations.

## Docker

Docker has been around for a while.
But in case you are unfamiliar, Docker is a set of tools that facilitates OS-level virtualization.<sup>[6](https://en.wikipedia.org/wiki/Docker_(software))</sup>
These tools will allow us to containerize the Truffle and Ganache setup removing the need of global installation.
It's a win-win.
The Docker container we build can be used anywhere, and we no longer need to worry about the version of Node.js we have installed on our computer.

If you do not have Docker installed on your machine yet, go [here](https://docs.docker.com/get-docker/).
It's beyond the scope of this post, but the linked directions should be pretty straight forward.
But once installed, let's clone my init example where we will keep the code we need for Docker.
Run the following commands to set up this directory:

```bash
$ git clone https://github.com/joshfinnie/truffle-init-example.git <PATH>
$ cd <PATH>
$ touch Dockerfile
$ touch docker-compose.yml
```

This will give you the default files we will need to get Truffle and Ganache installed in a Docker container.
It's a bit odd, but I had to figure out how to get the default Truffle folder structure without installing it globally.
This [repo](https://github.com/joshfinnie/truffle-init-example) was generated for this post and gives you the default folders and files a `truffle init` will do.
Give it a ⭐️ if you find it helpful!

### Dockerfile

Below is the code for the Dockerfile.
We'll go into some depth asto what's going on here.

```dockerfile
FROM node:16-bullseye-slim as base

RUN apt-get update && \
    apt-get install --no-install-recommends -y \
        build-essential \
        python3 && \
    rm -fr /var/lib/apt/lists/* && \
    rm -rf /etc/apt/sources.list.d/*

RUN npm install --global --quiet npm truffle ganache

FROM base as truffle

RUN mkdir -p /home/app
WORKDIR /home/app

COPY package.json /home/app
COPY package-lock.json /home/app

RUN npm install --quiet

COPY truffle-config.js /home/app
COPY contracts /home/app/contracts
COPY migrations /home/app/migrations/
COPY test /home/app/test/

CMD ["truffle", "version"]

FROM base as ganache

RUN mkdir -p /home
WORKDIR /home
EXPOSE 8545

ENTRYPOINT ["ganache", "--host 0.0.0.0"]
```

The first block of code I will breakdown is the code that builds our "base" container.
I have long ago adopted [multi-stage builds](https://docs.docker.com/develop/develop-images/multistage-build/) as a way to optimize my Dockerfiles, and feel like this is the ideal reason why.
Having a "base" container allows us to make sure the default `node:16-bullseye-slim` Docker image is up-to-date and has all our required packages installed.

```dockerfile
FROM node:16-bullseye-slim as base

RUN apt-get update && \
    apt-get install --no-install-recommends -y \
        build-essential \
        python3 && \
    rm -fr /var/lib/apt/lists/* && \
    rm -rf /etc/apt/sources.list.d/*

RUN npm install --global --quiet npm truffle ganache

```

We install `build-essenials` and `python3` from the Debian package manager.
These are dependencies for Truffle.
And we install `truffle` and `ganache` using NPM.

Taking from our created "base" image, we then buildout our truffle container.

```dockerfile
FROM base as truffle

RUN mkdir -p /home/app
WORKDIR /home/app

COPY package.json /home/app
COPY package-lock.json /home/app

RUN npm install --quiet

COPY truffle-config.js /home/app
COPY contracts /home/app/contracts
COPY migrations /home/app/migrations/
COPY test /home/app/test/

CMD ["truffle", "version"]
```

We create a working directory, copy our `package.json` file, and install the required packages.
We then copy over the rest of the files needed to run the Truffle project.
Lastly calling `truffle version` to spit out our version of Truffle installed.
**Note** This command would be doing something more exciting here, but for this blog post, that is all we're doing.

Lastly, we build out our Ganache container.
This one is a tad less complex due to Ganache being a tool that runs in the background.

```dockerfile
FROM base as ganache

RUN mkdir -p /home
WORKDIR /home
EXPOSE 8545

ENTRYPOINT ["ganache-cli", "--host 0.0.0.0"]
```

In this container, we again take from the "base" container, expose the default Ganache port of `8545` and run it.
**Note** we use the `--host` flag here to change the default host from 127.0.0.1 to 0.0.0.0.

### docker-compose.yml

Below is the [Docker Compose](https://docs.docker.com/compose/) file.
Even though you don't need a Compose file, I find them easier to deal with and love to include them.
There's something satisfying about running `docker compose up` and having your entire system running within Docker.

```yaml
version: '3.4'
services:
  truffle:
    build:
      context: .
      target: truffle
    depends_on:
      - ganache
    networks:
      - backend
    volumes:
      - .:/home/app
      - /home/app/node_modules
  ganache:
    build:
      context: .
      target: ganache
    ports:
      - 8545:8545
    networks:
      - backend
networks:
  backend:
    driver: "bridge"
```

## Conclusion

I hope this post helps anyone struggling to install Truffle locally.
I never understood the reasoning NPM libraries needing global installation.
Hardhat fixes this by using `npx` and I would love to see Truffle move to this paradigm.
It would make using it much easier in my mind.
But it would also require them to fix this issue with the latest version of Node.js.
If anyone knows of another way to fix this, feel free to chat with me on [Twitter](https://twitter.com/joshfinnie).

## Also might enjoy

* [Using Latex Through Docker](/blog/latex-through-docker)
* [My Basic Python Dockerfile](/blog/basic-python-dockerfile)

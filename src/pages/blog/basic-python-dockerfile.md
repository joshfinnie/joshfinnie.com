---
title: "My Basic Python Dockerfile"
date: "2019-06-06"
tags:
  - "docker"
  - "python"
  - "open-source"
  - "tutorial"
path: "/blog/my-basic-python-dockerfile"
heroImage: "/assets/blog/python.jpg"
expires: true
layout: "../../layouts/BlogPost.astro"
unsplash: "Marius Masalar"
unsplashURL: "marius"
---

A little while back I read an article sharing this person's basic `Dockerfile` which they use for all their projects. I thought this was a good idea to do and went about creating and [releasing](https://github.com/joshfinnie/docker-python) my own. This blog post will share my basic `Dockerfile` I use for Python projects as well as explain some of the less usual parts.

So without much more ado, here is my basic `Dockerfile` I use for Python Projects.

```docker
FROM python:3.6-slim-stretch

# Update to latest packages and add build-essential and python-dev
RUN apt-get update && \
    apt-get install --no-install-recommends -y \
            build-essential=12.3 \
            python3-dev=3.5.3-1 && \
    rm -fr /var/lib/apt/lists/*

# Install Dumb Init
RUN pip install dumb-init==1.2.2

# Install required packages.
COPY requirements.txt /tmp/
RUN pip install -r /tmp/requirements.txt

# Create non-root user
RUN useradd --create-home app
WORKDIR /home/app
USER app

# Copy the code
COPY src/ ./src/

# Use Dumb Init's entrypoint.
ENTRYPOINT ["dumb-init", "--"]
```

## Special Considerations

There are two small things that I do want to point out to everyone. First, I still use Python 3.6 as my go-to Python. I am sure I will make the switch soon, but for now this version still seems right to me. Second, I use an application called `dumb-init`. [Dumb Init](https://github.com/Yelp/dumb-init) has been something that I have been adding to my Docker containers since day one. Maybe we are past the need for it, but I still like the comfort it brings me.

> dumb-init is a simple process supervisor and init system designed to run as PID 1 inside minimal container environments (such as Docker). It is deployed as a small, statically-linked binary written in C.

## Conclusion

The above `Dockerfile` is nothing too special or out-of-the-box. Yet, it sets you up for success for python applications; be it a simple script (like I highlight in this files repo) or a full-fledged web application. Please let me know what you think about this!

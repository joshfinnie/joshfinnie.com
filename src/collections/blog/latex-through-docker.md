---
title: "Using Latex Through Docker"
date: "2019-09-17"
tags:
  - "docker"
  - "latex"
  - "productivity"
  - "coding"
  - "tutorial"
  - "projects"
slug: "latex-through-docker"
heroImage: "blog/math"
expires: true
unsplash: "Roman Mager"
unsplashURL: "roman_lazygeek"
---

I recently started a new job, (Don't worry, there will be a blog post on that soon!) and I wanted to update my resume.
I wrote this resume using Latex. (find it [here](https://github.com/joshfinnie/resume) for reference)
With my new work computer, I was getting ready to start the arduous task of yet-again figuring out how to install Latex
on a mac. For some reason, installing Latex on a mac is not trivial. There are a lot of moving parts to make sure that
latex is rendered correctly on OS X. I decided instead of working on getting Latex installed again, I'd turn to Docker
to make this a repeatable process going forward. Why install Latex once on a new computer when you could create a Docker
container that you can take with you! Luckily the steps to install Latex on Debian are much easier than OS X. Below I
will share my Dockerfile needed to set up Latex and my workflow using the Docker container.

## Docker

As I stated in the introduction, I wanted to find a simple way to create a Latex docker container that was as small as
possible. (_Note_: this is not a small container by any means, the Latex ecosystem is HUGE.) Most important, I want to have
a repeatable setup. Below is all I need for the Latex install; I am using Debian Buster and installing 3 packages:
biber, latexmk, and texlive-full.

```docker
FROM debian:buster-slim

RUN apt-get update && \
    apt-get install --no-install-recommends -y \
        biber=2.12-2 \
        latexmk=1:4.61-0.1 \
        texlive-full=2018.20190227-2 && \
        rm -rf /var/lib/apt/lists/*

WORKDIR /tmp
```

Even though you only need the texlive package (and I am even wondering if `texlive-full` is appropriate here), I wanted to
make sure that this container would have everything I needed to render my latex resume without needing to have to rebuild
it. The truth of the matter is that this is an expensive build in terms of both time and energy, and I want to make sure I
have all my bases covered. Once we have this Dockerfile saved, let me show you the steps I take to build my `resume.tex`:

```bash
$ docker build -t latex .
$ docker run -v `pwd`:/tmp latex pdflatex sample.tex
```

That's it... I even added the above `docker run` command to an alias: `latex` Now I just need to run `latex sample.tex` and
a pdf is generated for me. Lovely!

## Conclusion

After writing this article I went ahead and tried the Cask. Even though `brew cask install mactex-no-gui` is easy, I am still
going to stick with my Docker container. The command needed to generate the same sample tex file is:

```bash
$ /Library/TeX/Distributions/TeXLive-2019.texdist/Contents/Programs/texbin/pdflatex sample.tex
```

I know I am already making an alias for my Docker container, but I would have hoped that brew would have taken steps to make this
all easier for us! I enjoy the isolation that Docker provides me for my development computer, might as well use that isolation for
Latex. I hope you find this an easy way to get latex installed on any computer that has Docker. Let me know if you have any
question or comments, reach out to me on Twitter [@joshfinnie](https://twitter.com/joshfinnie).

_NOTE_: You can also find all the required files on [Github](https://github.com/joshfinnie/latex-docker)

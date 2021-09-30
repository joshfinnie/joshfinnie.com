---

title: "Auto-Starting Tmux in iTerm2"
date: "2014-05-16"
tags:
  - "OS X"
  - "iTerm2"
  - "tmux"
path: "/blog/auto-starting-tmux-in-iterm2"
expires: true
layout: '../../layouts/BlogPost.astro'

---

I have been using [Tmux](http://tmux.sourceforge.net/) a lot lately and was getting tired of having to attach to it everytime I start [iTerm2](http://www.iterm2.com/). There had to be a way for me to initialize a Tmux session every time I start a new session of iTerm2. Luckily, it allows you to pass some text on startup! Using this feature (See below image for where...), I now pass up the below code to iTerm2:

    tmux attach -t init || tmux new -s init

This snippet tries to attach to a Tmux instance called `init` and if it cannot it attach it creates one for me.

![iTerm Tmux Setup](/assets/blog/iterm_tmux_setup.png)

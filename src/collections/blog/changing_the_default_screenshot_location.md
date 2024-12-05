---
title: "Changing the Default Screenshot Location"
date: "2014-02-04"
tags:
  - "OS X"
  - "properties"
  - "defaults"
slug: "changing-the-default-screenshot-location"
expires: true
---

With using [Pushfile](https://github.com/joshfinnie/pushfile) more and more, I consistently find my Desktop littered with the screenshots I have taken. I found it interesting that OS X defaults its screenshot save location to your desktop, and there had to be a way to change it!

Luckily there is. And it is as easy as creating a place to hold your screenshots and changing a `defaults` line.

First let's create a sane space to hold our screenshots... I chose `/usr/local/screenshots/` but feel free to put them where you like.

    $ mkdir /usr/local/screenshots/

Then you want to changed the default screenshot location. If you are not aware, there is a sort of API to change [OS X defaults](https://developer.apple.com/library/mac/documentation/Darwin/Reference/ManPages/man1/defaults.1.html) which can be used to change default functions of your operating system. Let's change the screenshot location defaults:

    $ defaults write com.apple.screencapture location /usr/local/screenshots

And that's it. Now when you create a screenshot, it won't clutter up your desktop but instead be saved somewhere sane. Only if there was somehow we can go about changing the name of the screenshots to get rid of this: `Screen Shot 2014-02-04 at 10.02.07 AM`

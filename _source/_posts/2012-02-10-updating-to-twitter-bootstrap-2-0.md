---
layout: post.html
title: Updated to Twitter Bootstrap 2.0
tags: [Twitter, Bootstrap]
---

I have to say that I have never been happier as a web developer when [Twitter Bootstrap][1] was first announced. It gave me a nice design framework that I could use to get my ideas out into the world faster. I wasn’t worried about how my website was going to look; I could focus on how it was functioning.

There wasn’t a lot that I could have faulted the first implementation of Twitter Bootstrap. I used it on a few projects without a hitch, but a new version is out so I though I’d give it a go.

Luckily Twitter provided an excellent [upgrading reference][2] for people going to version 2.0. The one major thing you need to worry about (if you have a pretty standard installation of Twitter Bootstrap) is the change to the top navigation bar:

> Navbar (formerly topbar)
>
> *  Base class changed from `.topbar` to `.navbar`
> *  Now supports static position (default behavior, not fixed) and fixed to the top of viewport via `.navbar-fixed-top` (previously only supported fixed)
> *  Added vertical dividers to top-level nav
> *  Improved support for inline forms in the navbar, which now require .navbar-form to properly scope styles to only the intended forms.
> *  Navbar search form now requires use of the `.navbar-search` class and its input the use of `.search-query`. To position the search form, you must use `.pull-left` or `.pull-right`.
> *  Added optional responsive markup for collapsing navbar contents for smaller resolutions and devices. See navbar docs for how to utilize.


Most important, `.topbar` was changed to `.navbar`, meaning you want to take some time to change the top bar in your current code. I also enjoy the [expanded documentation][3] of the navbar in general.

For a simple blog like this, I have to say that the upgrade to Twitter Bootstrap went without a hitch. I am sure there will be some more tweaking here and there as I progress using version 2.0, but I would recommend to anyone who uses Twitter Bootstrap to take the time and upgrade!

 [1]: http://twitter.github.com/bootstrap/
 [2]: http://twitter.github.com/bootstrap/upgrading.html
 [3]: http://twitter.github.com/bootstrap/components.html#navbar
---
title: "Using Pygments with Static Blogs"
date: "2014-05-20"
tags:
  - "how-to"
  - "python"
  - "pygments"
  - "blogging"
path: "/blog/using-pygments-with-static-blogs"
expires: true
layout: "../../layouts/BlogPost.astro"
---

There are many ways you can get stylized code snippets on your static website, from javascript libraries to embedded iframes. Some of these techniques are super easy, some are more complex, but if you write your blog using markdown, there is no better than [Pygments](http://pygments.org/).

As long as your blog uses [Markdown](http://daringfireball.net/projects/markdown/) or is set up to use Pygments for `codeblocks`, setting up stylized code should be simple. For this blog, I use Mynt, and to stylize a `codeblock` with specific code type, you simplely add the type of code in curly braces after the backticks. (i.e. `{ python }`)

And to get the CSS required to work with Pygments, run the following command:

```bash
$ pygmentize -S perldoc -f html > pygemtize-perldoc.css
```

That should be all that you need for setting up Pygments on your static blog.

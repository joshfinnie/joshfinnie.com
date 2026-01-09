---
title: "Flat Flog, an Introduction"
date: "2013-09-24"
description: "Build static blogs with Flask using flat-flog, a Python-based static site generator with Markdown support."
tags:
  - "open-source"
  - "static blogging"
  - "flat flog"
slug: "flat-flog-an-introduction"
expires: true
---

## Introduction

Static blog generators are all the rage today. Flat-flog is my attempt at one; it is nothing special, but it is mine. Flat-flog is written in Python using the Flask Microframework and some of its extensions. It comes with [Twitter Boostrap](https://getbootstrap.com) and some default template to get you started. This idea stemmed from a blog post by [James Harding](http://www.jamesharding.ca/posts/simple-static-markdown-blog-in-flask/). This project is going to be a work in progress for some time, so buyer beware.

## Installation

To start using flat-flog for your own personal static blog, you want to download it from the [repository](https://github.com/joshfinnie/flat-flog).

```bash
$ git clone https://github.com/joshfinnie/flat-flog.git /path/to/NAME_BLOG_HERE
```

Next you want to create a virtualenv and install the requirements. This will install the required packages to run Flat-Flog, mainly [Flask](http://flask.pocoo.org/), [Frozen-Flask](http://pythonhosted.org/Frozen-Flask/) and [Flask-FlatPages](http://pythonhosted.org/Flask-FlatPages/).

```bash
$ virtualenv .
$ source bin/activate
$ pip install -r requirements.txt
```

That's it. We should not have everything we need to create your static blog.

## Create a Post

Flat Flog is first and foremost a blogging engine. Because of that, I wanted to make sure it is easy and familiar to create a blog post. To create a new post, all you need to do is create a new file in the `flat_flog/_content/_posts` folder. Flat Flog will automatically recongnize this as a new post and render the Markdown into a blog post. The `flat_flog/_content/_drafts` folder is where you can put drafts of blog posts you are not ready to publish.

The format of a post entry is as followed:

```md
title: ** YOUR TITLE HERE **
date: ** TODAY'S DATE **
tags: ['** TAG 1 **', '** TAG 2 **', etc…]

** THE BODY OF THE POST HERE **
```

## Create a Page

Even though Flat Flog is a bloggin engine, I wanted to make sure that you could as easily create a page dynamically. Flat Flog comes with three pages created for you, About, Contact and Home, but creating another page is easy. You would want to put the content of the page you want to create in the `flat_flog/_content/_pages` folder.

The format of a page is as followed:

```md
title: ** YOUR TITLE HERE **

** THE BODY OF THE PAGE HERE **
```

## Serve in development

Because we are using Flask, it is easy to serve your flog locally. To serve your flog while developing, you can simplely run it as a Flask application. Run the following command to serve the content of your flog dynamically:

```bash
$ cd flat_flog
$ python blog.py
```

This will allow you to see your blog at <http://0.0.0.0:5000/>. And, a nice feature of Flask, since `DEBUG=True` any changes made to your blog will auto-reload allowing for easier developement.

## Create your Static Blog

After you are done development of your blog, you want to freeze your blog to create a static version of it for deployment. This is done by the following command:

```bash
$ cd flat_flog
$ python blog.py build
```

This will create a `_site` folder with your static blog. You can then host these files anywhere. I have found some luck with hosting this blog on S3. It is a cheap and reliable hosting environment for static pages. You could also use [Github Pages](http://pages.github.com/).

You can also easily test your static website by entering the following code:

```bash
$ cd ../_site
$ python -m SimpleHTTPServer 8000
```

This should serve your site at <http://0.0.0.0:8000>.

## Things TODO

Flatflog is no where near done. As I said in the intro, this is a work in progress. Below is a list of things I want to get done:

- Make tags work better.
- Implement time-sorted archive (maybe...)
- Expand `Config` file for more personalization.

Also, if you want to contribute, feel free to fork the [repository](https://github.com/joshfinnie/flat-flog) and send me some pull requests.

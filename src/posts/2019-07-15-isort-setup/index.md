---

title: "My Basic isort Configuration"
date: "2019-07-15"
tags:
  - "python"
  - "tooling"
path: "/blog/my-basic-isort-configuration"
image: "./sorting.jpg"
expires: true

---

In an attempt to remove areas of [bikeshedding](https://en.wikipedia.org/wiki/Law_of_triviality) in our code reviews, I have slowly been implementing format automation to our codebase at [TrackMaven](https://trackmaven.com). The first large leap we took was to implemnt [Black]() for our backend Python code and [Prettier]() for our frontend Javascript code. The next area of contention that I saw was ordering of imports for our Python code. Now, this might be something that bothers me more than anyone of my coworkers, but I thought I'd share a neat third-party solution I found called [isort](https://github.com/timothycrosley/isort) and some the now "default" configuration I will be using for all my Python code in the future.

## Why isort?

One might be asking why

<p class="unsplash text-center">Photo by <a href="https://unsplash.com/@thetechnomaid?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText">Sophie Elvis</a> on <a href="https://unsplash.com/">Unsplash</a></p>

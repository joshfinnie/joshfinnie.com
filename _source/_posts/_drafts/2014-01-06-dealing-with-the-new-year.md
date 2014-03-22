---
layout: post.html
title: Dealing with the New Year
tags: [Javascript, Django, programming]

---

## What's the problem?

Not sure if you have noticed it on any websites, but the new year brings on a period of time where some websites have the incorrect copyright date listed.

I am notorious when it comes to promptly changing the copyright date to the newly minted year; and I certainly enjoy seeing the push notifications from Github of other's attempts to be punctual:

[![image](http://www.lasttweetpng.com/:username/tweet/418008362564206592.png)](https://twitter.com/DCPython/status/418008362564206592)

## Fix for BeerLedge

* Use the Django tag {% now "Y" %}

## Universal Fix (Javascript)
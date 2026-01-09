---
title: "Updating Mavericks and Postgres.app"
date: "2014-01-27"
description: "Fix broken virtualenvs after upgrading to Mavericks and Postgres.app 9.3 by updating libssl symlinks."
tags:
  - "OS X"
  - "postgresql"
  - "update"
  - "how-to"
slug: "updating-mavericks-and-postgresapp"
expires: true
---

I have recently upgrade my computer to [Mavericks](http://www.apple.com/osx/) and at the same time upgraded the [Postgres.app](http://www.postgresapp.com/) to 9.3. In doing so, I broke something; after the upgrade I was getting a nasty error message using virtualenvs I created pre-upgrade. And of course the warning was not helpful! So I had to figure out what happened myself.

What to do? I took some time to research what was needed to be done, if anyone else was getting similar issues, and had a hard time locking anything down. Luckily, I came across this [Stack Overflow Page](http://stackoverflow.com/questions/11538249/python-pip-install-psycopg2-install-error). In reading the answers, I started to understand what might have happened. Below is what I did to fix the problem, and hopefully it will help someone else.

First, copy the updated `libssl.dylib` file from the Postgres.app location:

    $ sudo cp /Applications/Postgres.app/Contents/MacOS/lib/libssl.1.0.0.dylib /usr/lib

Then I created a new symbolic link from the copied `libssl.1.0.0.dylib` file to the standard `libssl.dylib` file located in `/usr/lib`.

    $ sudo ln -fs /usr/lib/libssl.1.0.0.dylib /usr/lib/libssl.dylib

The `-f` flag will remove the existing link before creating the new one.

After I completed this, it seemed like the old virtualenvs worked without a hitch. I am not sure why this happened; whether it was due to the upgrade to Mavericks, the upgrade to Postgres.app 9.3 or a combination of both, but it was quite frustrating. Hope this explanation helps someone...

Let me know on [Twitter](https://twitter.com/joshfinnie) if anyone has a better way of doing this or something above is wrong. Thanks!

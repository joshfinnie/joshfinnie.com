---
layout: post.html
title: Installing Mezzanine on Heroku
tags: [Mezzanine, CMS, Heroku, Python, How To]

---

**Oringally posted here: <https://gist.github.com/joshfinnie/4046138>. Also in need of an update.**

Lately, I have been looking into Python CMSs. There are many out there, but for some reason or another Mezzanine stuck out as one I should try. Installing it is easy enough, but getting it up on running on my new favorite host, Heroku, was a bit of a challege.

Below you will find the steps that I took to get Mezzanine up and running on Heroku. Please let me know in the comments below if anything didn't work for you.

## Setting up the Database

Heroku is shortly depricating Django's standard `DATABASES` dictionary in favor for a package which takes OS Environment Variables and builds the required dictionary for you. This is a good thing because it makes setting up a database on Heroku very easy. The package is called `dj_database_url` and it makes short work of getting a PostgreSQL database up and running with Mezzanine. Below is the code that you want to put in Mezzanine's `DATABASES` section:

<pre class="language-python"><code>
import dj_database_url
DATABASES = {'default': dj_database_url.config(default='postgres://localhost')}
</code></pre>

## Serving Static Media

Getting Heroku to find the static media of a Django app was something more difficult than I originalls thought. After attempting many different internet solutions, I finally got Heroku to serve my static media. Below are the two files that I had to edit to get this running, I am not sure if both are absolutely needed, but the static media is being served none-the-less. (Please leave a comment below if anyone found of a better way to do this!)

First, I added a URLPattern to my `urls.py` file. This should have been easy enough, but Mezzanine has a catch-all pattern: `("^", include("mezzanine.urls")),` which made me manipulate the file a little more than I would have liked. Below is what my URLPatterns now look like for Mezzanine.

<pre class="language-python"><code>
urlpatterns = patterns('',
    (r'^static/(?P<path>.*)$',
     'django.views.static.serve',
     {'document_root': settings.STATIC_ROOT}),)

urlpatterns += patterns("",
    ("^admin/", include(admin.site.urls)),

...
</code></pre>

 Second, I started to use the Gunicorn server to aid in getting my static media served properly. Heroku does not require a Profile to run Django apps, but in that case it uses ********. Since I am a huge fan of the Gunicorn web server, I wanted to eventually serve Mezzanine through it anyways. Adding the below Procfile got Mezzanine running on Gunicorn and successfully got Heroku to serve my static files.

<pre class="language-bash"><code>
$ web: python manage.py collectstatic --noinput; python manage.py run_gunicorn -b 0.0.0.0:$PORT
</code></pre>

 The above Procfile does two things, first if runs `collectstatic` to insure that all the static media is in the appropriate place within your app, and second it runs the Gunicorn server. In addition to adding this Procfile, you also need to add the Gunicorn application to your `INSTALLED_APPS` list on your `settings.py` file. Below is what my list looks like once Gunicorn was added (Note that I did not uncomment Mezzanine Accounts nor Mezzanine Mobile, if you are using them for your app, make sure to uncomment them.):

<pre class="language-python"><code>
INSTALLED_APPS = (
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.redirects",
    "django.contrib.sessions",
    "django.contrib.sites",
    "django.contrib.sitemaps",
    "django.contrib.staticfiles",
    "mezzanine.boot",
    "mezzanine.conf",
    "mezzanine.core",
    "mezzanine.generic",
    "mezzanine.blog",
    "mezzanine.forms",
    "mezzanine.pages",
    "mezzanine.galleries",
    "mezzanine.twitter",
    #"mezzanine.accounts",
    #"mezzanine.mobile",
    "gunicorn",
)
</code></pre>

## The requirements.txt

Heroku installs your Python apps by creating a virtualenv and installing packages via your `requirements.txt` file. For Mezzanine, this is the `requirements.txt` file I used to run my instance of Mezzanine:

<pre class="language-markup"><code>
Django==1.4
Mezzanine==1.1.4
Pillow==1.7.7
bleach==1.1.2
distribute==0.6.24
dj-database-url==0.2.1
filebrowser-safe==0.2.8
grappelli-safe==0.2.7
gunicorn==0.14.5
html5lib==0.95
psycopg2==2.4.5
pytz==2012c
wsgiref==0.1.2
</code></pre>

I have included `dj-database-url` due to Heroku's `DATABASES` support (See the section called settings.py for more information.). I also include `psycopg2` since I am using Heroku's free instance of PostgreSQL for my database.

## Conclusion

Like I have said above, this is the way that worked for me, but I am sure it is not the _best_ way of doing it. Let me know in the comments below as to whether this worked for you or not.
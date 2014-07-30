#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = u'Josh Finnie'
DESCRIPTION = u"Josh Finnie's blog about programming and stuff"
SITENAME = u'JoshFinnie.com'
SITEURL = ''

PATH = 'content'

TIMEZONE = 'America/New_York'

DEFAULT_LANG = u'en'

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = None
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None

# Blogroll
LINKS = (('Pelican', 'http://getpelican.com/'),
         ('Python.org', 'http://python.org/'),
         ('Jinja2', 'http://jinja.pocoo.org/'),
         ('You can modify those links in your config file', '#'),)

# Social widget
SOCIAL = (('You can add links in your config file', '#'),
          ('Another social link', '#'),)

DEFAULT_PAGINATION = 5

STATIC_PATHS = ['assets']

TEMPLATE_PAGES = {
    'extra/robots.txt': 'robots.txt',
    'extra/humans.txt': 'humans.txt',
    'articles.html': 'blog/index.html',
}

READERS = {'html': None}

ARTICLE_EXCLUDES = (('pages', 'extra', 'drafts', 'talks'))
STATIC_PATHS = [
    'talks',
]

ARTICLE_URL = 'blog/{slug}/'
ARTICLE_SAVE_AS = 'blog/{slug}/index.html'
PAGE_URL = '{slug}/index.html'
PAGE_SAVE_AS = '{slug}/index.html'


# Uncomment following line if you want document-relative URLs when developing
# RELATIVE_URLS = True

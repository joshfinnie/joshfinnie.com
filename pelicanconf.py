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
FEED_ALL_ATOM = 'feeds/atom.xml'
CATEGORY_FEED_ATOM = None
TRANSLATION_FEED_ATOM = None

TEMPLATE_PAGES = {
    'extra/robots.txt': 'robots.txt',
    'extra/humans.txt': 'humans.txt',
    'extra/license.txt': 'license.txt',
    'articles.html': 'blog/index.html',
    'error.html': 'error.html',
}

READERS = {'html': None}

ARTICLE_EXCLUDES = (('pages', 'extra', 'drafts', 'talks'))
STATIC_PATHS = [
    'talks', 'assets'
]

ARTICLE_URL = 'blog/{slug}/'
ARTICLE_SAVE_AS = 'blog/{slug}/index.html'
PAGE_URL = '{slug}/'
PAGE_SAVE_AS = '{slug}/index.html'
CATEGORY_URL = 'category/{slug}/'
CATEGORY_SAVE_AS = 'category/{slug}/index.html'
TAG_URL = 'tag/{slug}/'
TAG_SAVE_AS = 'tag/{slug}/index.html'
AUTHOR_URL = 'author/{slug}/'
AUTHOR_SAVE_AS = 'author/{slug}/index.html'

THEME = "theme"

PLUGIN_PATHS = ["plugins", "plugins"]
PLUGINS = ['sitemap']

SITEMAP = {
    'format': 'xml',
    'priorities': {
        'articles': 0.5,
        'indexes': 0.5,
        'pages': 0.5
    },
    'changefreqs': {
        'articles': 'monthly',
        'indexes': 'daily',
        'pages': 'monthly'
    }
}

# Uncomment following line if you want document-relative URLs when developing
# RELATIVE_URLS = True

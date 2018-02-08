#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

AUTHOR = 'Josh Finnie'
SITENAME = 'JoshFinnie.com'
SITEURL = ''

PATH = 'content'

TIMEZONE = 'America/New_York'

DEFAULT_LANG = 'en'

# Feed generation is usually not desired when developing
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None
CATEGORY_FEED_ATOM = None
FEED_ALL_ATOM = 'feeds/atom.xml'
TRANSLATION_FEED_ATOM = None

# Customized Settings
ARTICLE_EXCLUDES = (('pages', 'extra', 'drafts', 'talks'))
ARTICLE_SAVE_AS = 'blog/{slug}/index.html'
ARTICLE_URL = 'blog/{slug}/'
AUTHOR_SAVE_AS = 'author/{slug}/index.html'
AUTHOR_URL = 'author/{slug}/'
CATEGORY_SAVE_AS = 'category/{slug}/index.html'
CATEGORY_URL = 'category/{slug}/'
PAGE_SAVE_AS = '{slug}/index.html'
PAGE_URL = '{slug}/'
STATIC_PATHS = ['talks', 'assets']
TAG_SAVE_AS = 'tag/{slug}/index.html'
TAG_URL = 'tag/{slug}/'
TEMPLATE_PAGES = {
    'extra/robots.txt': 'robots.txt',
    'extra/humans.txt': 'humans.txt',
    'extra/license.txt': 'license.txt',
    'error.html': 'error.html',
}

THEME = "theme"

PLUGIN_PATHS = ['/Users/joshfinnie/src/repos/pelican-plugins/sitemap']
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

DEFAULT_PAGINATION = None
# Uncomment following line if you want document-relative URLs when developing
# RELATIVE_URLS = True

from fabric.api import local, env, hosts
import fabric.contrib.project as project
import os
import sys
import SimpleHTTPServer
import SocketServer
from datetime import datetime
import shutil

# Local path configuration (can be absolute or relative to fabfile)
env.deploy_path = 'output'
DEPLOY_PATH = env.deploy_path

# Remote server configuration
production = 'root@localhost:22'
dest_path = '/var/www'

# Rackspace Cloud Files configuration settings
env.cloudfiles_username = 'my_rackspace_username'
env.cloudfiles_api_key = 'my_rackspace_api_key'
env.cloudfiles_container = 'my_cloudfiles_container'


def clean():
    if os.path.isdir(DEPLOY_PATH):
        local('rm -rf {deploy_path}'.format(**env))
        local('mkdir {deploy_path}'.format(**env))


def build():
    local('pelican -s pelicanconf.py')


def rebuild():
    clean()
    build()


def regenerate():
    local('pelican -r -s pelicanconf.py')


def serve():
    os.chdir(env.deploy_path)

    PORT = 8000

    class AddressReuseTCPServer(SocketServer.TCPServer):
        allow_reuse_address = True

    server = AddressReuseTCPServer(('', PORT),
                                   SimpleHTTPServer.SimpleHTTPRequestHandler)

    sys.stderr.write('Serving on port {0} ...\n'.format(PORT))
    server.serve_forever()


def reserve():
    build()
    serve()


def preview():
    local('pelican -s publishconf.py')


def new(article_name):
    slug = article_name.lower().replace(' ', '-')
    filename = slug + '.md'
    with open('content/drafts/{}'.format(filename), 'w') as writer:
        writer.write('Title: {}\n'.format(article_name))
        writer.write('Author: Josh Finnie\n')
        writer.write('Date: {}\n'.format(datetime.now().strftime('%Y-%m-%d')))
        writer.write('Tags: untagged\n')
        writer.write('Slug: {}\n'.format(slug))


def drafts():
    drafts = sorted(os.listdir('content/drafts/'))
    for count, draft in enumerate(drafts):
        print '{}: {}'.format(count, draft)


def finish(draft_number):
    drafts = sorted(os.listdir('content/drafts/'))
    draft = drafts[int(draft_number)]
    shutil.move('content/drafts/{}'.format(draft), 'content/{}'.format(draft))


def posts():
    posts = [f for f in os.listdir('content/') if f.endswith('.md')]
    posts = sorted(posts, reverse=True)
    for count, posts in enumerate(posts):
        print '{}: {}'.format(count, posts)


def redraft(post_number):
    posts = [f for f in os.listdir('content/') if f.endswith('.md')]
    posts = sorted(posts, reverse=True)
    post = posts[int(post_number)]
    shutil.move('content/{}'.format(post), 'content/drafts/{}'.format(post))


@hosts(production)
def publish():
    local('pelican -s publishconf.py')
    project.rsync_project(
        remote_dir=dest_path,
        exclude=".DS_Store",
        local_dir=DEPLOY_PATH.rstrip('/') + '/',
        delete=True,
        extra_opts='-c',
    )

Title: Django 2.0 and Docker
Author: Josh Finnie
Date: 2018-01-05
Tags: tutorial, docker, django, python

With Django 2.0's official release just around the corner, I thought it would be a good time to write up my thoughts on it and show how I would go about starting a Django project these days. This tutorial will be using the Django v2.0.1, Django Rest Framework v3.7.7, and Docker (with Docker Compose). Feel free to reach out to me on [Twitter](https://twitter.com/joshfinnie) or via [email](mailto:josh@jfin.us) with any questions you might have about this tutorial.

## The Setup

First, this tutorial isn't going to go in to any depth about setting up Docker. I want this tutorial to be short and to the point; adding Docker setup to this post would just be too much. So, with the expectation that Docker is installed on your machine, we want to set up our `Dockerfile` for our new web application. What spurred me into writting this tutorial was the fact that Django 2.0 is the first Django to specifically only support Python 3.x. Even in this day-and-age, having Python 3.x installed on your machine is too much to ask (okay, that might be a bit hyperbolic; I just really like Docker...), so this is a perfect execuse to boot up a Docker image for this task.

### Dockerfile

The first file we will need to create is the `Dockerfile`. This file tells Docker how we want our container to be built. Below is the simplistic `Dockerfile` we will be using for this tutorial:

```
FROM python:3.6
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/
RUN pip install -r requirements.txt
ADD . /code/
```

### requirements.txt

As you can see in the above `Dockerfile`, we add a file to our container named `requirements.txt`. This file is what we will use to install our needed Python packages. The `requirements.txt` file is super simplistic; it should looks like:

```
Django==2.0.1
djangorestframework==3.7.7
```

These are the only packages we will need for this experiment.

### docker-compose.yaml

The last file we will need for our setup is the `docker-compose.yaml` file. This file is used to define the Docker container with more information than the base `Dockerfile` does, and is really the best way of using Docker locally. For this experiment, the `docker-compose.yaml` file looks like this:

```
version: '2'

services:
    db:
        image: postgres
    web:
        build: .
        command: python3 app/manage.py runserver 0.0.0.0:8000
        volumes:
            - .:/code
        ports:
            - "8000:8000"
        depends_on:
            - db
```

The above `docker-compose.yaml` file gives us a Postgres database container and a web container running our container defined by our `Dockerfile`. With these three files, we are ready to jump into building our Django application.

## Running our App

The first thing we want to do is to use Docker Compose to build our two Docker containers. We can do this by running the following command and giving it a bit of time:

```
$ docker-compose build
```


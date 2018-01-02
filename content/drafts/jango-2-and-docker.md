Title: Django 2.0 and Docker
Author: Josh Finnie
Date: 2017-11-18
Tags: tutorial, docker, django, python

With Django 2.0's official release just around the corner, I thought it would be a good time to write up my thoughts on it and show how I would go about starting a Django project these days. This tutorial will be using the Django 2.0 Release Candidate 1, Django Rest Framework v3.7.3, and Docker (with Docker Compose). Feel free to reach out to me on [Twitter](https://twitter.com/joshfinnie) or via [email](mailto:josh@jfin.us) with any questions you might have about this tutorial.

# The Setup

First, this tutorial isn't going to go in to any depth about setting up Docker. I want this tutorial to be short, and to the point; adding Docker setup is just too much. But, with the expectation that Docker is installed on your machine, we want to set up our `Dockerfile` for our new web application. What spurred me into writting this tutorial was the fact that Django 2.0 is the first Django to specifically only support Python 3.x. Even in this day-and-age, having Python 3.x installed on your machine is too much to ask, so this is a perfect execuse to boot up a Docker image for this task. Below is the simplistic `Dockerfile` we will be using for this tutorial:

```
FROM python:3
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/
RUN pip install -r requirements.txt
ADD . /code/
```

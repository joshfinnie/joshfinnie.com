---
title: "Set Up Flask and Restx with Docker"
date: "2022-06-01"
tags:
  - "python"
  - "flask"
  - "docker"
  - "rest"
slug: setup_flask_and_restx_with_docker
heroImage: "blog/snake"
unsplash: "Timothy Dykes"
unsplashURL: "timothycdykes"
description: "This blog post summarizes my experiments with Flask, Restx and Docker. I go over the steps I took to get a simple Todo application from start to finish."
---

I started at [IndigoAg](https://www.indigoag.com/) a couple of weeks ago and was thrown into a codebase that leveraged [Flask](https://flask.palletsprojects.com/en/2.1.x/) and [Restx](https://flask-restx.readthedocs.io/en/latest/).
Of these are two libraries I have not touched Flask in a long time, and never heard of Restx.
Restx has a great tutorial in [their documentation](https://flask-restx.readthedocs.io/en/latest/quickstart.html), but I was hoping for a more full-featured example to work on.
So I created my own and am writing about my thoughts about the process here.
If you want to just see the code, it is on [Github](https://github.com/joshfinnie/flask-restx-docker-todo).
Below you will read how I go about creating a new Flask project from scratch using Restx and Docker.

## Getting Started

The first thing I did was create a `Dockerfile` that would use Python 3.10 and install Poetry for me.

```docker
FROM python:3.10-slim

WORKDIR /usr/src/app

RUN pip install poetry
```

Next, using that `Dockerfile` let us add flask and restx.
**NOTE**: We will want to attach a volume so that the `pyproject.toml` and `poetry.lock` will be saved locally.
We can run the following command to set up our application:

```bash
$ docker build -t todo .
$ docker run -v `PWD`:/usr/src/app todo poetry init
$ docker run -v `PWD`:/usr/src/app todo poetry add flask restx
```

This will initialize a poetry project.
It will then install the packages and create a `poetry.lock` file.
All of this is required to have a repeatable build.
If you are not familiar with Poetry, these are almost equivalent to the `setup.py` and `requirements.txt` files that are more common.

Once the project is initialized and the lockfile is created, we'll need to update the `Dockerfile` to include them:

```docker
FROM python:3.10-slim

WORKDIR /usr/src/app

RUN pip install poetry
COPY pyproject.toml poetry.lock /usr/src/app/
RUN poetry update && poetry install
```

From now on running `docker build -t todo .` will also install Flask and Restx.
Excellent!

The next step will be adding our Flask application to the Docker container.
Let's first create a folder that will include our application code.
Run `mkdir -p todo` to create this folder.
And run `touch todo/app.py todo/__init__.py` to create the files we need.

Next add the below code to `app.py`:

```python
from flask import Flask
app = Flask(__name__)

@app.route("/")
    def hello():
        return "Hello World!"

if __name__ == "__main__":
    app.run()
```

Back to our `Dockerfile`, let's make sure our code is added to the container and all the environment variable are set up correctly.

```docker
FROM python:3.10-slim

WORKDIR /usr/src/app

ENV FLASK_APP=todo/app
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_ENV=development

RUN pip install poetry
COPY pyproject.toml poetry.lock /usr/src/app/
RUN poetry update && poetry install

ADD todo/ /usr/src/app/todo

CMD ["poetry", "run", "flask", "run"]
```

This is our complete `Dockerfile`.
Building the container will give you a full "hello world" example using Flask!

```bash
$ docker build -t todo .
$ docker run todo
```

At this point we have a great working Flask application running within Docker.
If you have no interest in learning about Restx, you can stop here.
The next section we will build on this example and add rest endpoints for a Todo application.

## Flask and Restx

It is great to see how we can get a Flask "Hello World" application up and running in Docker, but I also wanted to explore Restx.
To do this, let's make a few modifications.
First, let's create a folder to hold our API code and the files we'll need:

```bash
$ mkdir -p todo/api
$ touch todo/api/__init__.py todo/api/namespace.py
$ mkdir -p todo/api/resources
$ touch todo/api/resources/__init__.py todo/api/resources/todos.py
$ mkdir -p todo/api/models
$ touch todo/api/models/__init__.py todo/api/models/todos.py
```

Then we will update our `todo/app.py` to leverage our new structure getting ready for the Restx code:

```python
import os

from flask import Flask

from todo.api import register_api

DEBUG = os.getenv("DEBUG", "").lower() == "true"
HOST = os.getenv("HOST", "0.0.0.0")
PORT = os.getenv("PORT", 5000)

app = Flask(__name__)

register_api(app)

if __name__ == "__main__":
    app.run(debug=DEBUG, host=HOST, port=PORT)
```

The new `todo/app.py` starts separating some concerns for us.
We move the api code into its own folder, and just reach out to a function `register_api()` to connect everything.

In `todo/api/__init__.py` we will put the [Flask Blueprint](https://flask.palletsprojects.com/en/2.1.x/tutorial/views/) for our API.
This code looks like:

```python
from flask import Blueprint
from flask_restx import Api

from todo.api.resources import todos

api_blueprint = Blueprint("api", __name__)

API_VERSION = "v1"


def register_api(app):
    app.config["RESTX_ERROR_404_HELP"] = False
    app.register_blueprint(api_blueprint, url_prefix=f"/api/{API_VERSION}")


api = Api(
    api_blueprint,
    version=API_VERSION,
    title="Todo API",
    description="A simple todo API.",
)

api.add_namespace(todos.ns)
```

In this file, we add a Flask Blueprint called "api".
We then create our Restx API object.
Then we attach the todo Restx namespace through the `add_namespace` that's exposed on the Restx API object.

The code above is extendable while allowing us the maximum separation of concerns.
We will have a special namespace for each type of endpoint we want to expose in our API.
It is a eloquent solution.
But what does this code look like for the todo endpoints?
We first create the todo Restx namespace.
We will add it to `todo/api/namespaces.py` like this:

```python
from flask_restx import Namespace

todo_ns = Namespace("todos", description="Todos")
```

This will tell our application that we are expecting an API endpoint for todos.

After creating the todo Restx namespace, we can implement the model representation in `todo/api/models/todo.py`.
We will define the todo model and create a [Data Access Object (DAO)](https://en.wikipedia.org/wiki/Data_access_object) to access it.
DAOs are nice because even though this example saves "todos" to memory, we can change very little code to use a database to persist the data.

```python
from flask_restx import fields

from todo.api.namespaces import todo_ns as ns

todo = ns.model(
    "Todo",
    {
        "id": fields.Integer(readonly=True, description="The task unique identifier"),
        "task": fields.String(required=True, description="The task details"),
    },
)


class TodoDAO:
    def __init__(self):
        self.counter = 0
        self.todos = []

    def get(self, id):
        for todo in self.todos:
            if todo["id"] == id:
                return todo
        ns.abort(404, "Todo {} doesn't exist".format(id))

    def create(self, data):
        todo = data
        todo["id"] = self.counter = self.counter + 1
        self.todos.append(todo)
        return todo

    def update(self, id, data):
        todo = self.get(id)
        todo.update(data)
        return todo

    def delete(self, id):
        todo = self.get(id)
        self.todos.remove(todo)


DAO = TodoDAO()
DAO.create({"task": "Build an API."})
DAO.create({"task": "?????"})
DAO.create({"task": "profit!"})
```

Finally we will need to create the [CRUD](https://www.codecademy.com/article/what-is-crud) routes for todos.
We will add the following to the `todo/api/resources/todo.py` file:

```python
from flask_restx import Resource

from todo.api.namespaces import todo_ns as ns
from todo.api.models.todos import todo, DAO


@ns.route("/")
class TodoList(Resource):
    @ns.doc("list_todos")
    @ns.marshal_list_with(todo)
    def get(self):
        return DAO.todos

    @ns.doc("create_todo")
    @ns.expect(todo)
    @ns.marshal_with(todo, code=201)
    def post(self):
        return DAO.create(ns.payload), 201


@ns.route("/<int:id>")
@ns.response(404, "Todo not found")
@ns.param("id", "The task identifier")
class Todo(Resource):
    @ns.doc("get_todo")
    @ns.marshal_with(todo)
    def get(self, id):
        return DAO.get(id)

    @ns.doc("delete_todo")
    @ns.response(204, "Todo deleted")
    def delete(self, id):
        DAO.delete(id)
        return "", 204

    @ns.expect(todo)
    @ns.marshal_with(todo)
    def put(self, id):
        return DAO.update(id, ns.payload)
```

Above is the Restx Resource code that covers CRUD for our todos.
There is the ability to create a todo, read all todos, update an individual todo, and delete an individual todo.
With the DAO we created before, these endpoints look pretty trivial.
But, remember this is a simplistic example without authentication or anything.
That will add more complexity, but should not be too difficult to add in the above file.

## Conclusion

With these files, we have a full-featured rest application for our todos that runs in docker.
I hope you were able to follow along and learn something.
If you have any input, comments, or questions feel free to find me on [Twitter](https://twitter.com/joshfinnie).
We can discuss!
Also, remember, the entire code example can be found on [Github](https://github.com/joshfinnie/flask-restx-docker-todo).

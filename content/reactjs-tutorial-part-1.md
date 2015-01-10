Title: React.js Tutorial Part 1
Author: Josh Finnie
Date: 2015-01-10
Tags: tutorial, react.js, javascript, node.js

Welcome to my tutorial on how to get a website up and running using [React.js](http://facebook.github.io/react/) and [Node.js](http://nodejs.org/). I am expecting this to be a multipart tutorial as we go through building a job board for my local [Node.js Meetup Group](), though I am not sure how long these tutorials will last. I hope you enjoy them and if so feel free to share them!

## Getting Started with Express

In this tutorial I am going to assume you have Node.js installed since it is becomming standard in so many of today's build processes. If you do not have it installed, check out [this article](http://howtonode.org/how-to-install-nodejs).

The first thing we are going to do is set up a standard [express](http://expressjs.com/) app. This is easy do to through `express-generator`. Install `express-generator` using the following command:

```
$ npm install express-generator -g
```

Once installed, we are going to create a basic express app with one caveat, I will be using SASS as my styling language. To generate this express app, we run the following command:

```
$ express -c compass jobs.nodedc.com

   create : jobs.nodedc.com
   create : jobs.nodedc.com/package.json
   create : jobs.nodedc.com/app.js
   create : jobs.nodedc.com/public
   create : jobs.nodedc.com/public/javascripts
   create : jobs.nodedc.com/public/stylesheets
   create : jobs.nodedc.com/public/stylesheets/style.scss
   create : jobs.nodedc.com/routes
   create : jobs.nodedc.com/routes/index.js
   create : jobs.nodedc.com/routes/users.js
   create : jobs.nodedc.com/public/images
   create : jobs.nodedc.com/views
   create : jobs.nodedc.com/views/index.jade
   create : jobs.nodedc.com/views/layout.jade
   create : jobs.nodedc.com/views/error.jade
   create : jobs.nodedc.com/bin
   create : jobs.nodedc.com/bin/www

   install dependencies:
     $ cd jobs.nodedc.com && npm install

   run the app:
     $ DEBUG=jobs.nodedc.com ./bin/www
```

With the output of `express-generator` we can see that we are well on our way to what we need from Express. This is a bit overkill, but with a few small changes, we should have a working express app which will then run (eventually) our API and serve our React site.

Let's start up this generated site and see what we get. Below is the image that you should see in your browser (at [http://localhost:3000](http://localhost:3000)) if you are following along.

<center>![Hello Express](/assets/images/blog/hello-express.png)</center>

I then recommend going through the generated code and cleaning it up a little bit. We will not need the `user` routes so I just deleted them. I also expanded on the `package.json` some to add a description and keywords as well as changed the version to something more reasonable.


## Adding React.js

Now that we have a pretty basic express application as our backend, we are now going to jump into adding react. Adding react is not that difficult, but there are a few ways of doing things. Since we are already within a node.js app, I am going to go down the route of building our jsx scripts into javascript. To get ready for this, we need to install the `react-tools` node package. You can do that by the following command:

```
$ npm install react-tools --save-dev
```

We add the `--save-dev` flag to make sure the `react-tools` package is saved as a development requirement in our `package.json`. Now, to convert the jsx scripts to javascript, we just have to run the following command:

```
$ ./node_modules/react-tools/bin/jsx public/javascripts/src/ public/javascripts/build/
```

** Note: ** You could also install `react-tools` globlally if you'd like.

Next we want to [download React 0.12.2](http://facebook.github.io/react/downloads/react-0.12.2.zip), extract, and move `react-0.12.2/build/react.min.js` to our `/public/javascripts/build/` directory. Let's add React.js to our template! The default templating language for `express-generator` is [Jade](http://jade-lang.com/). It is a bit difficult to comprehend at first (and `express-generator` allows you to substitute either [EJS](http://www.embeddedjs.com/) or [Handlebars](http://handlebarsjs.com/) if you are more comfortable with those), but I find it super simplistic!

To add `react.min.js` to our templates, we just append it to the bottom of our `views/layout.jade` file as below:

```
doctype html
html
  head
    title= title
    link(rel='stylesheet', href='/stylesheets/style.css')
  body
    block content
    script(src='/javascripts/build/react.min.js')
```

Rerunning `DEBUG=jobs.nodedc.com ./bin/www` we should see our starting screen again, but now it's React.js ready. Now our templates should be ready for our React Components!

## Adding a React.js Component

Now that we have our express app running react.js, we can now start the process of writting our react application. In this part of the tutorial, we are only going to do a basic "Hello World" component, but next time we will start developing the components we need for our job board. So first, let's create our component.

The first thing we want to do is create the `div` needed for react. In the `views/index.jade` file, add a div with an `id` of "example". With jade, your `index.jade` file should look like this:

```
extends layout

block content
  #example
```

Next we want to create a simple react.js component in our `public/javascripts/src/` folder called `helloworld.jsx`. This component should look like:

```
React.render(
  <h1>Hello, world from React.js!</h1>,
  document.getElementById('example')
);
```

Because we are using the `react-tools` node package, we want to add the compiled javascript code to our templates. Change you `views/layout.jade` file to the following:

```
doctype html
html
  head
    title= title
    link(rel='stylesheet', href='/stylesheets/style.css')
  body
    block content
    script(src='/javascripts/build/react.min.js')
    script(src='/javascripts/build/helloworld.js')
```

And run the `react-tools` package to compile our component with the following command:

```
$ ./node_modules/react-tools/bin/jsx -x jsx public/javascripts/src/ public/javascripts/build/
```

Remember to use the `-x` flag as we used the extension `.jsx` for our jsx code. Now running the express server again we should see:

<center>![Hello React.js](/assets/images/blog/hello-react.png)</center>

There we have it. A pretty simple Hello World app with React.js and Express.js. Next we will clean up this process with some automation help from [gulp](http://gulpjs.com/) and start building react.js components to help us with our NodeDC job board!

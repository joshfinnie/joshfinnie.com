---
title: "Using Bower"
date: "2014-11-03"
tags:
  - "javascript"
  - "bower"
  - "how-to"
slug: "using-bower"
expires: true
---

**_This post was originally posted on [TrackMaven's Engine Room](http://engineroom.trackmaven.com). You can find it [here](http://engineroom.trackmaven.com/blog/using-bower/)._**

Using [Bower](http://bower.io) can save you a lot of time installing and keeping track of your third-party JavaScript libraries. It can be difficult to keep track of which version of what library you or your team uses, that's why we use it here at TrackMaven. Below I will go into how and why we use it.

## What is Bower

So what is Bower? Bower is the "package manager for the web." It allows you to install and track third-party JavaScript libraries easily. At TrackMaven we use it to install and keep track of all the libraries we use. Below is just a small excerpt from our `bower.json` file:

```json
"dependencies": {
    "jquery": "1.11.1",
    "angular": "1.2.26",
    "angular-ui-router": "0.2.11",
    "d3": "3.4.13",
    ...
}
```

Bower allows for us to not only keep track of what third-party JavaScript libraries we are using, but it also allows us to pin these libraries to certain versions. The ability to pin the versions have become invaluable to us as we grow our engineering team; it allows us to keep our development environment consistent across all our engineers. Another great feature of Bower is that it allows us to install these libraries from many different sources:

```bash
# registered package
$ bower install jquery
# GitHub shorthand
$ bower install desandro/masonry
# Git endpoint
$ bower install git://github.com/user/package.github
# URL
$ bower install https://example.com/script.js
```

## Initial Setup

Next we are going to talk about how to best set up Bower. Installing Bower is simple if you already have Node.js installed. (If you do not have Node.js installed, you can simply follow the directions [here](http://nodejs.org/download/).) Once Node.js is installed on your machine, the steps required to install Bower are as followed:

```bash
$ npm install -g bower
```

That's it! The above command installs Bower globally on your machine; this allows you to use Bower for all your projects.

If you want to use Bower to install a JavaScript library, all you need to do is run the following command:

```bash
$ bower install angular
```

This will install angular.js into your `bower_components` folder.

### Saving packages

This is great for a one-time installation of Angular, but if you want to create a repeatable workflow, it would be best to have a way to note this installation of Angular and it's version. You do this with your `bower.json` file. The easiest way to create a `bower.json` file is to run the command `bower init`. This will prompt you with a few questions about your project and give you a way to save packages to your project.

To save a library to your project, just append a `--save` or `--save-dev` when installing the library.

```bash
# Installs a package and add it to bower.json dependencies
$ bower install angular --save

# Install a package and add it to bower.json devDependencies
$ bower install jasmine --save-dev
```

### Versioning packages

You can also determine what version of a package you want to install by preceding the package with a `#` sign. For example, if we do not want Angular 1.2.26 but instead Angular 1.2.12, we could install that version with the following command:

```bash
$ bower install angularjs#1.2.12
```

This was very helpful for us at TrackMaven when starting off with Bower since we wanted to match our current setup as much as we could, and we were running some older versions of JavaScript libraries.

### Customizations

The defaults that come with Bower are pretty sane, but I always feel like the default folder `bower_components` is just a bit too clunky. Luckily Bower allows for an easy way to change some defaults. This is done via the `.bowerrc` file. Here at TrackMaven, we have three lines to ease our time with Bower:

```json
{
  "directory": ".bower-cache",
  "json": "bower.json",
  "interactive": false
}
```

Those three line do the following:

- **directory** - Changes the default directory in which Bower installs the libraries.
- **json** - Tells Bowser where your init file is. This allows you to rename it something other than `bower.json`.
- **interactive** - Makes Bower interactive, prompting whenever necessary. We turn this off since we use [Docker](http://www.docker.com/), and interactions break our install. This defaults to `null` which means `auto`, and is likely what you'd want to keep unless you run into issues.

The entire `.bowerrc` configuration options can be found [here](http://bower.io/docs/config/). There is a lot of configuration that can be done to Bower, so be sure to take a look.

## Benefits

The benefits of Bower for TrackMaven were seen immediately. After setting up Bower we had a simple way to keep track of not only what third-party libraries we use for our application, but even what versions of those libraries. This has cut down the time it takes us to spin up our development environments and cut down on the bugs we see when using slightly different versions of third-party libraries. Bower also allowed us to easily integrate our third-party libraries into our build process which allowed us to concatenate and minify them all seamlessly.

### Searching

Bower give you the ability to search for packages within its system. This is accomplished by using the `search` parameter. Running this command, `bower search angularjs` returns the following:

```bash
$ bower search angularjs
Search results:

angularjs-nvd3-directives git://github.com/cmaurer/angularjs-nvd3-directives.git
AngularJS-Toaster git://github.com/jirikavi/AngularJS-Toaster.git
angularjs git://github.com/angular/bower-angular.git
angular-facebook git://github.com/Ciul/Angularjs-Facebook.git
angularjs-file-upload git://github.com/danialfarid/angular-file-upload-bower.git
angularjs-rails-resource git://github.com/FineLinePrototyping/dist-angularjs-rails-resource
angularjs-geolocation git://github.com/arunisrael/angularjs-geolocation.git
angularjs-utilities git://github.com/realcrowd/angularjs-utilities.git
...
```

These are all the packages that are available through Bower which contain the word "angularjs". The search ability is very useful especially when using third-party libraries like Angular.js which have a vast plugin ecosystem.

## Drawbacks

The drawbacks of Bower are few and far between, but one of the major issues we had in using Bower was the lack of adoption with some third-party libraries. It takes a non-trivial effort to make your library compatible with Bower and some just haven't taken the time. Adding these libraries to our automated build process took quite the effort, but in the long run it was worth it.

### Dealing with the drawbacks

One of the biggest headaches we ran into with using Bower was the lack of consistency within the bower packages themselves. This is okay if you are just using the third-party libraries directly in your HTML, but at TrackMaven we wanted to concatenate and minify our JavaScript libraries. At TrackMaven, we use [Gulp.js](http://gulpjs.com/) as our build system, and after some research we found a Gulp package that allowed us to deal with our Bower packages. [Gulp-Bower-Files](https://www.npmjs.org/package/gulp-bower-files) gives your Gulp process an ability to interact with your installed Bower packages. With a small addition to our `bower.json` file we can tell Gulp-Bower-Files what file should be used for what Bower package. This removes a huge headache from using Bower. Below is an excerpt from our `bower.json` file to show what I mean:

```json
"overrides": {
  "canvg": {
    "main": "canvg.js"
  },
  "underscore": {
    "main": "underscore.js"
  },
  "moment": {
    "main": "moment.js"
  },
  "jspdf": {
    "main": "dist/jspdf.debug.js"
  }
}
```

For those who use the other JavaScript build system [Grunt.js](http://gruntjs.com/), it looks like the creator of Gulp-Bower-Files has deprecated it in favor of its updated version [Main-Bower-Files](https://www.npmjs.org/package/main-bower-files). This should have Grunt support in the future.

## Conclusion

In conclusion, if you have not looked into using Bower, I highly recommend it. Integration into our workflow took a little bit of time, but the benefits we are seeing from it are quite amazing!

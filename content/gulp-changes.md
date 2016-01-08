Title: Gulp.js Update and Modularization
Author: Josh Finnie
Date: 2016-01-07
Tags: gulp, javascript, tips

About 2 years ago, I made the switch from [Grunt.js](http://gruntjs.com/) to [Gulp.js](http://gulpjs.com/), and over these two years I have certainly learned a lot. Not only has the complexity in which I use Gulp.js increased 10 fold, but also my knowledge of Javascript best practices have also increased. Recently, I started to think about a better way of using Gulp.js. At my current job, [TrackMaven](http://engineroom.trackmaven.com/), we have a very complex and lengthy `gulpfile.coffee`. I started to wonder if there was a better way of organizing and developing our Gulp.js tasks so I thought I'd first experiment with my own sites. First up was this very blog.

## Before

The "before" picture of the state of Gulp.js on this blog was not that bad. Since this is a static site and only need a few commands to keep it going smoothly, I have nothing of the complexity I am faced with at work. But it does give us a good baseline of what a standard Gulp.js project is set up as. For the most part, when I come across someone using Gulp.js for their web application, I find a single file with all the logic in it. Again, for a simple application, this might not be too bad; for this blog, my `gulpfile.coffee` sat at a mere 55 lines of code (See code below). However, even this 55 line Gulp.js file has its issues; well not really, but lets imagine it does...

```
gulp = require "gulp"
gutil = require "gulp-util"

sass = require "gulp-ruby-sass"
sourcemaps = require "gulp-sourcemaps"
plumber = require "gulp-plumber"
autoprefixer = require "gulp-autoprefixer"
minifyCSS = require "gulp-minify-css"
run = require "gulp-shell"

connect = require "gulp-connect"

# Serve the generate html on localhost/localdocker:8080
gulp.task "connect", ->
    connect.server({
        root: ['output']
        port: 8080
        livereload: true
    })

# Styles for the site. Turns .scss files into a single main.css
gulp.task "scss", ->
    sass("theme/styles/")
        .on("error", (err) ->
            console.error "Error!", err.message
        )
        .pipe(plumber())
        .pipe(minifyCSS())
        .pipe(gulp.dest("theme/static/css"))

# Build the development html.
gulp.task "build", ->
    gulp.src("output/index.html")
        .pipe(run("pelican content -s pelicanconf.py"))

# Refresh the development html.
gulp.task "html", ->
    gulp.src("output/index.html")
        .pipe(run("pelican content -s pelicanconf.py"))
        .pipe(connect.reload())

# Build the production html.
gulp.task "publish", ->
    gulp.src("output/index.html")
        .pipe(run("pelican content -s publishconf.py"))
        .pipe(run("s3cmd sync --cf-invalidate --cf-invalidate-default-index --delete-removed output/ s3://www.joshfinnie.com"))

# Watch for any changes and run the required tasks.
gulp.task "watch", ->
    gulp.watch("theme/styles/**/*.scss", ["scss"])
    gulp.watch("theme/static/css/**/*.css", ["html"])
    gulp.watch("theme/templates/**/*.html", ["html"])
    gulp.watch("content/**/*.md", ["html"])

gulp.task("default", ["build", "scss", "watch", "connect"])
```

## After

What I thought to do with my `gulpfile.coffee` was to break it out into smaller managable parts. If we take a look at the code above, we can see 6 distinct functions. Yes those six functions do not have a lot of complexity, but suspend your belief for a moment and imagine they did, or believe me when I say that as time goes by these six functions are going to grow in complexity and it is best to nip this issue in the bud early. So what can we do? What I propose is that we split out each of these functions and make them their own module. This way we can then have each logical part separated from each other and imported into our final working `gulpfile.js`. This step will allow us to worry about one Gulp.js process at a time, and also create some modularity that you can take to other projects in the future. One of the big inititives we have going forward at TrackMaven is making sure we are following a microservice paradeigm, and having our Gulp.js tasks broken out into modular bite-sized functions is really going to help build these microservices quicker. So let's do just that... Below you can see the tree of my `gulp/` folder; you can see how each of the above Gulp.js tasks now have their own individual file:

```
├── gulp/
│   ├── gulpfile.coffee
│   ├── html.coffee
│   ├── publish.coffee
│   ├── scss.coffee
│   └── server.coffee
```

We can then take a look at one of these files to see how the magic works. For example, `html.coffee` holds the "Build the developement html" task from above:

```
run = require "gulp-shell"

module.exports = (gulp, connect) ->
    gulp.task 'html', ->
        gulp.src("output/index.html")
            .pipe(run("pelican content -s pelicanconf.py"))
            .pipe(connect.reload())
```

It looks very similar from the code in the first `gulpfile.coffee` file, and that is because it is! There is very little we have to to do the code to make sure a Gulp.js taks will work in this modular format. The only main thing that is different is that we are exporting a function that takes two variables, `gulp` and `connect` in this case. This will allow us to properly import this modularized Gulp.js taks within our main `gulpfile.coffee` file. So lets take a look at what `gulpfile.coffee` now looks like:

```
gulp = require "gulp"
gutil = require "gulp-util"
connect = require "gulp-connect"

server = require("./server")(gulp, connect)
scss = require('./scss')(gulp, connect)
html = require('./html')(gulp, connect)
publish = require('./publish')(gulp)

# Runs the build commands without booting up the server
gulp.task("build", ["scss", "html"])

gulp.task("default", ["build", "serve"], ->
    gulp.watch("theme/styles/**/*.scss", ["scss"])
    gulp.watch("theme/static/css/**/*.css", ["html"])
    gulp.watch("theme/templates/**/*.html", ["html"])
    gulp.watch("content/**/*.md", ["html"])
)
```

One can see that we are now importing the four modularized Gulp.js tasks. The great thing about setting up your `gulpfile` like this is now `server`, `scss`, `html` and `publish` are modularized and transferible. I could take the `html` task above (the one that will build our html using the `pelicanconf.py` file) and use that in any future [Pelican](http://docs.getpelican.com/en/3.6.3/) project I have. This will lead to a faster development time and should make my life easier if (or when) the `html` task for my projects gets more complex!

## Next steps

There are a few things that you can do to make this process even easier for you. Stealing form the great authors at [Yeoman](http://yeoman.io/), we can add a little bit of syntatic sugar to our `gulpfile` to automatically import each module we have created instead of explicity typing each one out. To do this, we need to add a bit of code to our `gulpfile` in place of the four imports we have above. This code will look like this:

```
var normalizedPath = require("path").join(__dirname, "gulp");

require("fs").readdirSync(normalizedPath).forEach(function(file) {
  if(file==='gulpfile.coffee') return;

  fileName = path.basename(file);
  fileName = require('./'+fileName)(gulp);
});
```

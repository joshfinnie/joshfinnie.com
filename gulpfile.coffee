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

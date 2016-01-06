autoprefixer = require "gulp-autoprefixer"
minifyCSS = require "gulp-minify-css"
plumber = require "gulp-plumber"
sass = require "gulp-ruby-sass"

module.exports = (gulp, connect) ->
    gulp.task "scss", ->
        sass("theme/styles/")
            .on("error", (err) ->
                console.error "Error!", err.message
            )
            .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
            .pipe(plumber())
            .pipe(minifyCSS())
            .pipe(gulp.dest("theme/static/css"))
            .pipe(connect.reload())

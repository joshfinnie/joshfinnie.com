autoprefixer = require "gulp-autoprefixer"
minifyCSS = require "gulp-minify-css"
plumber = require "gulp-plumber"
sass = require "gulp-ruby-sass"

module.exports = (gulp, connect) ->
    gulp.task 'scss', ->
        gulp.src("theme/styles/main.scss")
            .pipe(plumber())
            .pipe(sass())
            .pipe(minifyCSS())
            .pipe(gulp.dest("theme/static/css"))
            .pipe(connect.reload())
